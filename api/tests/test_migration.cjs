/* Simulate mongosh without opening a connection or modifying a database. */
const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const path = require('node:path')
const { test } = require('node:test')
const vm = require('node:vm')

const source = readFileSync(path.join(__dirname, '../mongo/migrate-concepts.js'), 'utf8')
const aliases = new Map([
  ['progress_records', 'records'],
  ['attendance_records', 'attendances'],
  ['institutional_information', 'informations'],
  ['account_recoveries', 'recoveries'],
  ['ai_runs', 'pipelines'],
  ['ai_usage', 'agents'],
])
const ownership = {
  administrations: ['schools', 'students', 'teams', 'memberships'],
  activities: ['workshops', 'practices', 'records'],
  events: ['events', 'registrations', 'attendances'],
  content: ['publications', 'news', 'informations'],
  authentication: ['users', 'sessions', 'recoveries'],
  messaging: ['conversations', 'messages', 'notifications'],
  integrations: ['pipelines', 'agents'],
}
const actions = ['find', 'insert', 'update', 'remove', 'createIndex', 'listIndexes']

function fixture(legacy = true) {
  const collections = new Map()
  const users = new Map()
  const roles = new Map()
  const writes = []
  for (const [domain, names] of Object.entries(ownership)) {
    const username = legacy && domain === 'administrations' ? 'school_management' : domain
    const role = `${username}_collections`
    const owned = names.map((name) => legacy
      ? [...aliases].find(([, target]) => target === name)?.[0] || name
      : name)
    for (const name of owned) {
      collections.set(name, { documents: [{ retained: name }], indexes: ['retained-index'] })
    }
    roles.set(role, {
      role,
      privileges: owned.map((collection) => ({ resource: { db: 'maisciencia', collection }, actions })),
      roles: [],
    })
    users.set(username, { user: username, pwd: 'original-secret', roles: [{ role, db: 'maisciencia' }] })
  }
  const application = {
    getCollectionNames: () => [...collections.keys()],
    getUser: (name) => users.get(name) || null,
    getRole: (name, options) => {
      assert.equal(options.showPrivileges, true)
      return roles.get(name) || null
    },
    getCollection: (name) => ({
      renameCollection: (target, dropTarget) => {
        assert.equal(dropTarget, false)
        assert.equal(collections.has(target), false)
        writes.push(['rename', name, target])
        collections.set(target, collections.get(name))
        collections.delete(name)
      },
    }),
    createRole: (role) => {
      writes.push(['createRole', role.role])
      roles.set(role.role, structuredClone(role))
    },
    updateRole: (name, update) => {
      writes.push(['updateRole', name])
      roles.set(name, { ...roles.get(name), ...structuredClone(update) })
    },
    createUser: (user) => {
      writes.push(['createUser', user.user])
      users.set(user.user, structuredClone(user))
    },
    grantRolesToUser: (name, grants) => {
      writes.push(['grantRole', name])
      users.get(name).roles.push(...structuredClone(grants))
    },
  }
  return { application, collections, users, roles, writes }
}

function run(state, overrides = {}) {
  const output = []
  vm.runInNewContext(source, {
    db: {
      getSiblingDB: (name) => {
        assert.equal(name, 'maisciencia')
        return state.application
      },
    },
    process: { env: { MONGO_DB: 'maisciencia', ...overrides } },
    print: (message) => output.push(message),
  })
  return output
}

const applyEnvironment = {
  MIGRATION_APPLY: 'true',
  MIGRATION_CONFIRM_DATABASE: 'maisciencia',
  ADMINISTRATIONS_DB_PASSWORD: 'preserved-secret',
}

test('default inspection reports changes without writes or secret disclosure', () => {
  const state = fixture()
  const output = run(state)
  const plan = JSON.parse(output[0])
  assert.equal(plan.mode, 'dry-run')
  assert.equal(plan.operations.filter((operation) => operation.action === 'renameCollection').length, 6)
  assert.equal(plan.legacyIdentityRetained, true)
  assert.equal(output.join('').includes('original-secret'), false)
  assert.equal(state.writes.length, 0)
})

test('a source and destination conflict aborts before all mutations', () => {
  const state = fixture()
  state.collections.set('records', { documents: ['existing-target'] })
  assert.throws(() => run(state, applyEnvironment), /Collection conflict/)
  assert.equal(state.writes.length, 0)
  assert.equal(state.collections.has('progress_records'), true)
})

test('missing application collections abort before mutations', () => {
  const state = fixture()
  state.collections.delete('users')
  assert.throws(() => run(state, applyEnvironment), /Missing application collection/)
  assert.equal(state.writes.length, 0)
})

test('applying requires an exact database confirmation', () => {
  const state = fixture()
  assert.throws(() => run(state, { ...applyEnvironment, MIGRATION_CONFIRM_DATABASE: 'another' }), /CONFIRM_DATABASE/)
  assert.equal(state.writes.length, 0)
})

test('a new service user requires its password before any write', () => {
  const state = fixture()
  assert.throws(() => run(state, { ...applyEnvironment, ADMINISTRATIONS_DB_PASSWORD: '' }), /ADMINISTRATIONS_DB_PASSWORD/)
  assert.equal(state.writes.length, 0)
})

test('application retains data objects, updates permissions, and retains the legacy identity', () => {
  const state = fixture()
  const records = state.collections.get('progress_records')
  const output = run(state, applyEnvironment)
  assert.strictEqual(state.collections.get('records'), records)
  for (const [oldName, newName] of aliases) {
    assert.equal(state.collections.has(oldName), false)
    assert.equal(state.collections.has(newName), true)
  }
  assert.equal(state.users.get('administrations').pwd, 'preserved-secret')
  assert.equal(state.users.get('school_management').pwd, 'original-secret')
  for (const [domain, owned] of Object.entries(ownership)) {
    assert.deepEqual(state.roles.get(`${domain}_collections`).privileges.map((entry) => entry.resource.collection).sort(), [...owned].sort())
  }
  assert.equal(output.join('').includes('preserved-secret'), false)
})

test('a completed migration can be inspected and applied again without writes', () => {
  const state = fixture()
  run(state, applyEnvironment)
  state.writes.length = 0
  const plan = JSON.parse(run(state, applyEnvironment)[0])
  assert.equal(plan.operations.length, 0)
  assert.equal(state.writes.length, 0)
})

test('a fresh database with current names needs no changes', () => {
  const state = fixture(false)
  assert.equal(JSON.parse(run(state)[0]).operations.length, 0)
  assert.equal(state.writes.length, 0)
})

test('an existing administrations password is preserved', () => {
  const state = fixture()
  state.users.set('administrations', {
    user: 'administrations', pwd: 'existing-secret', roles: [],
  })
  run(state, applyEnvironment)
  assert.equal(state.users.get('administrations').pwd, 'existing-secret')
  assert.equal(state.users.get('administrations').roles[0].role, 'administrations_collections')
})

test('a partially completed rename resumes without replacing target collections', () => {
  const state = fixture()
  const original = state.application.getCollection
  let interrupted = false
  state.application.getCollection = (name) => {
    if (name === 'attendance_records' && !interrupted) {
      interrupted = true
      throw new Error('Simulated interruption')
    }
    return original(name)
  }
  assert.throws(() => run(state, applyEnvironment), /Simulated interruption/)
  const records = state.collections.get('records')
  run(state, applyEnvironment)
  assert.strictEqual(state.collections.get('records'), records)
  assert.equal(state.collections.has('attendances'), true)
})
