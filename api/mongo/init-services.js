// Run by the official MongoDB image when initializing an empty volume.
const databaseName = process.env.MONGO_INITDB_DATABASE || 'maisciencia'

if (['admin', 'config', 'local'].includes(databaseName)) {
  throw new Error('MONGO_DB must identify an application database.')
}

const application = db.getSiblingDB(databaseName)
const services = [
  {
    username: 'administrations',
    passwordVariable: 'ADMINISTRATIONS_DB_PASSWORD',
    collections: ['schools', 'students', 'teams', 'memberships'],
  },
  {
    username: 'activities',
    passwordVariable: 'ACTIVITIES_DB_PASSWORD',
    collections: ['workshops', 'practices', 'records'],
  },
  {
    username: 'events',
    passwordVariable: 'EVENTS_DB_PASSWORD',
    collections: ['events', 'registrations', 'attendances'],
  },
  {
    username: 'content',
    passwordVariable: 'CONTENT_DB_PASSWORD',
    collections: ['publications', 'news', 'informations'],
  },
  {
    username: 'authentication',
    passwordVariable: 'AUTHENTICATION_DB_PASSWORD',
    collections: ['users', 'sessions', 'recoveries'],
  },
  {
    username: 'messaging',
    passwordVariable: 'MESSAGING_DB_PASSWORD',
    collections: ['conversations', 'messages', 'notifications'],
  },
  {
    username: 'integrations',
    passwordVariable: 'INTEGRATIONS_DB_PASSWORD',
    collections: ['pipelines', 'agents'],
  },
]

for (const service of services) {
  const password = process.env[service.passwordVariable]
  if (!password) {
    throw new Error(`Set ${service.passwordVariable} before initializing the database.`)
  }

  const role = `${service.username}_collections`
  for (const collection of service.collections) {
    application.createCollection(collection)
  }

  application.createRole({
    role,
    privileges: service.collections.map((collection) => ({
      resource: { db: databaseName, collection },
      actions: ['find', 'insert', 'update', 'remove', 'createIndex', 'listIndexes'],
    })),
    roles: [],
  })

  application.createUser({
    user: service.username,
    pwd: password,
    roles: [{ role, db: databaseName }],
  })

  if (service.username === 'authentication') {
    // Application checks enforce expiration before MongoDB removes TTL records.
    application.users.createIndex({ email: 1 }, { unique: true })
    application.sessions.createIndex({ token_hash: 1 }, { unique: true })
    application.sessions.createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 })
  }
}
