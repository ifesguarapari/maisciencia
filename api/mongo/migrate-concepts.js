// Inspect an existing application database; writes require explicit opt-in.
// Stop application services and take a backup before applying this migration.
(() => {
  const databaseName = process.env.MONGO_DB || process.env.MONGO_INITDB_DATABASE || 'maisciencia'
  if (['admin', 'config', 'local'].includes(databaseName)) {
    throw new Error('MONGO_DB must identify an application database.')
  }

  const application = db.getSiblingDB(databaseName)
  const apply = process.env.MIGRATION_APPLY === 'true'
  const aliases = [
    ['progress_records', 'records'],
    ['attendance_records', 'attendances'],
    ['institutional_information', 'informations'],
    ['account_recoveries', 'recoveries'],
    ['ai_runs', 'pipelines'],
    ['ai_usage', 'agents'],
  ]
  const domains = [
    ['administrations', ['schools', 'students', 'teams', 'memberships']],
    ['activities', ['workshops', 'practices', 'records']],
    ['events', ['events', 'registrations', 'attendances']],
    ['content', ['publications', 'news', 'informations']],
    ['authentication', ['users', 'sessions', 'recoveries']],
    ['messaging', ['conversations', 'messages', 'notifications']],
    ['integrations', ['pipelines', 'agents']],
  ]
  const actions = ['find', 'insert', 'update', 'remove', 'createIndex', 'listIndexes']
  const collections = new Set(application.getCollectionNames())
  const operations = []

  // Complete preflight before the first mutation. Never merge or drop a target.
  for (const [source, target] of aliases) {
    if (collections.has(source) && collections.has(target)) {
      throw new Error(`Collection conflict: ${source} and ${target} both exist.`)
    }
    if (!collections.has(source) && !collections.has(target)) {
      throw new Error(`Missing collection: expected ${source} or ${target}.`)
    }
    if (collections.has(source)) {
      operations.push({ action: 'renameCollection', source, target })
      collections.delete(source)
      collections.add(target)
    }
  }

  const normalizePrivileges = (privileges) => JSON.stringify(privileges.map((privilege) => ({
    resource: privilege.resource,
    actions: [...privilege.actions].sort(),
  })).sort((first, second) => JSON.stringify(first).localeCompare(JSON.stringify(second))))

  for (const [username, owned] of domains) {
    for (const collection of owned) {
      if (!collections.has(collection)) {
        throw new Error(`Missing application collection: ${collection}.`)
      }
    }
    const user = application.getUser(username)
    if (!user && (username !== 'administrations' || !application.getUser('school_management'))) {
      throw new Error(`Missing service user: ${username}. Initialize new databases separately.`)
    }
    const role = `${username}_collections`
    const currentRole = application.getRole(role, { showPrivileges: true })
    const privileges = owned.map((collection) => ({
      resource: { db: databaseName, collection },
      actions,
    }))
    if (!currentRole || normalizePrivileges(currentRole.privileges) !== normalizePrivileges(privileges)) {
      operations.push({ action: currentRole ? 'updateRole' : 'createRole', role, privileges })
    }
    if (!user) {
      operations.push({ action: 'createUser', username, role })
    } else if (!user.roles.some((assigned) => assigned.db === databaseName && assigned.role === role)) {
      operations.push({ action: 'grantRole', username, role })
    }
  }

  if (apply && process.env.MIGRATION_CONFIRM_DATABASE !== databaseName) {
    throw new Error('Set MIGRATION_CONFIRM_DATABASE to the application database before applying.')
  }
  if (apply && operations.some((operation) => operation.action === 'createUser') && !process.env.ADMINISTRATIONS_DB_PASSWORD) {
    throw new Error('Set ADMINISTRATIONS_DB_PASSWORD before creating the administrations user.')
  }

  // Only identifiers are reported; passwords and connection details never enter output.
  print(JSON.stringify({
    database: databaseName,
    mode: apply ? 'apply' : 'dry-run',
    operations: operations.map(({ privileges, ...operation }) => operation),
    legacyIdentityRetained: Boolean(application.getUser('school_management')),
  }))
  if (!apply) return

  // MongoDB DDL is not transactional. Completed renames are recognized on a retry.
  for (const operation of operations) {
    switch (operation.action) {
      case 'renameCollection':
        application.getCollection(operation.source).renameCollection(operation.target, false)
        break
      case 'createRole':
        application.createRole({ role: operation.role, privileges: operation.privileges, roles: [] })
        break
      case 'updateRole':
        application.updateRole(operation.role, { privileges: operation.privileges })
        break
      case 'createUser':
        application.createUser({
          user: operation.username,
          pwd: process.env.ADMINISTRATIONS_DB_PASSWORD,
          roles: [{ role: operation.role, db: databaseName }],
        })
        break
      case 'grantRole':
        application.grantRolesToUser(operation.username, [{ role: operation.role, db: databaseName }])
        break
      default:
        throw new Error(`Unexpected migration operation: ${operation.action}.`)
    }
  }
  print('Migration applied. Validate service access before retiring the legacy user and role.')
})()
