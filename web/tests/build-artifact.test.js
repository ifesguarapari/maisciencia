import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { checkBuild } from '../scripts/check-build.mjs'

async function fixture(t, base = '/') {
  const workspace = await mkdtemp(path.join(tmpdir(), 'maisciencia-build-'))
  const directory = path.join(workspace, 'dist')
  t.after(() => rm(workspace, { recursive: true, force: true }))
  const files = {
    'index.html': `<link rel="manifest" href="${base}manifest.webmanifest"><link rel="stylesheet" href="${base}assets/main.css"><script src="${base}assets/main.js"></script><a href="${base}login/">Login</a><a href="${base}feira">Fair</a><svg><use :href="open ? '/unused/close.svg' : '/unused/menu.svg'" href="${base}icons/interface.svg#menu"></use></svg><a href="https://example.org/">External</a>`,
    'assets/main.css': `@import './theme.css'; body { background: url('${base}images/hero.svg'); }`,
    'assets/theme.css': 'body { color: white; }',
    'assets/main.js': `new Workbox('${base}sw.js', { scope: '${base}' }); import('./chunk.js'); const image = '${base}images/hero.svg';`,
    'assets/chunk.js': 'export const ready = true;',
    'images/hero.svg': '<svg></svg>',
    'icons/interface.svg': '<svg><symbol id="menu"></symbol></svg>',
    'icons/pwa.png': '',
    'manifest.webmanifest': JSON.stringify({ id: base, start_url: base, scope: base, icons: [{ src: `${base}icons/pwa.png` }] }),
    'sw.js': `precacheAndRoute([{url:'index.html'},{url:'login/index.html'},{url:'feira/index.html'}]);`,
  }
  files['login/index.html'] = files['index.html']
  files['feira/index.html'] = files['index.html']
  await Promise.all(Object.entries(files).map(async ([name, content]) => {
    await mkdir(path.dirname(path.join(directory, name)), { recursive: true })
    await writeFile(path.join(directory, name), content)
  }))
  return directory
}

for (const base of ['/', '/maisciencia/']) {
  test(`validates physical route entries and resources under ${base}`, async (t) => {
    const directory = await fixture(t, base)
    const result = await checkBuild({ directory, base })
    assert.equal(result.base, base)
    assert.equal(result.filesChecked, 12)
    assert.ok(result.referencesChecked > 20)
  })
}

test('rejects a missing physical route even when the home page links to it', async (t) => {
  const directory = await fixture(t, '/maisciencia/')
  await rm(path.join(directory, 'feira/index.html'))
  await assert.rejects(checkBuild({ directory, base: '/maisciencia/' }), /Missing required build entry: feira\/index.html/)
})

test('checks resources from nested documents rather than only the home page', async (t) => {
  const directory = await fixture(t, '/maisciencia/')
  await writeFile(path.join(directory, 'login/index.html'), '<link rel="manifest" href="/maisciencia/manifest.webmanifest"><img src="images/hero.svg">')
  await assert.rejects(checkBuild({ directory, base: '/maisciencia/' }), /login\/index.html: missing resource images\/hero.svg/)
})

test('rejects static resources that escape the configured project base', async (t) => {
  const directory = await fixture(t, '/maisciencia/')
  await writeFile(path.join(directory, 'assets/main.css'), 'body { background: url(/images/hero.svg); }')
  await assert.rejects(checkBuild({ directory, base: '/maisciencia/' }), /URL escapes base \/maisciencia\/: \/images\/hero.svg/)
})

test('rejects nonexistent resources in built JavaScript and module imports', async (t) => {
  const directory = await fixture(t)
  await rm(path.join(directory, 'assets/chunk.js'))
  await assert.rejects(checkBuild({ directory }), /missing resource \.\/chunk.js/)
})

test('rejects root asset literals left in compiled JavaScript for a project site', async (t) => {
  const directory = await fixture(t, '/maisciencia/')
  await writeFile(path.join(directory, 'assets/chunk.js'), "export const hero = '/images/hero.svg'")
  await assert.rejects(checkBuild({ directory, base: '/maisciencia/' }), /assets\/chunk.js: URL escapes base/)
})

test('rejects a manifest that gives the application a scope outside its base', async (t) => {
  const directory = await fixture(t, '/maisciencia/')
  const filename = path.join(directory, 'manifest.webmanifest')
  const manifest = JSON.parse(await readFile(filename, 'utf8'))
  manifest.scope = '/'
  await writeFile(filename, JSON.stringify(manifest))
  await assert.rejects(checkBuild({ directory, base: '/maisciencia/' }), /manifest.webmanifest: scope does not match \/maisciencia\//)
})

test('rejects a missing manifest icon', async (t) => {
  const directory = await fixture(t)
  await rm(path.join(directory, 'icons/pwa.png'))
  await assert.rejects(checkBuild({ directory }), /manifest.webmanifest: missing resource \/icons\/pwa.png/)
})

test('rejects registration under an incorrect service worker scope', async (t) => {
  const directory = await fixture(t, '/maisciencia/')
  const filename = path.join(directory, 'assets/main.js')
  await writeFile(filename, "new Workbox('/maisciencia/sw.js', { scope: '/' })")
  await assert.rejects(checkBuild({ directory, base: '/maisciencia/' }), /service worker registration or scope does not match/)
})

test('rejects provisional routes left out of the service worker precache', async (t) => {
  const directory = await fixture(t)
  await writeFile(path.join(directory, 'sw.js'), "precacheAndRoute([{url:'index.html'}])")
  await assert.rejects(checkBuild({ directory }), /sw.js: route is missing from precache: login\/index.html/)
})

test('rejects API responses accidentally added to the service worker precache', async (t) => {
  const directory = await fixture(t, '/maisciencia/')
  await mkdir(path.join(directory, 'api'), { recursive: true })
  await writeFile(path.join(directory, 'api/session'), '{}')
  const filename = path.join(directory, 'sw.js')
  await writeFile(filename, `${await readFile(filename, 'utf8')} precacheAndRoute([{url:'api/session'}])`)
  await assert.rejects(checkBuild({ directory, base: '/maisciencia/' }), /API URL must not be precached/)
})


test('rejects an HTML manifest link that points to a different existing file', async (t) => {
  const directory = await fixture(t, '/maisciencia/')
  const filename = path.join(directory, 'login/index.html')
  await writeFile(path.join(directory, 'other.webmanifest'), '{}')
  await writeFile(filename, (await readFile(filename, 'utf8')).replace('manifest.webmanifest', 'other.webmanifest'))
  await assert.rejects(checkBuild({ directory, base: '/maisciencia/' }), /login\/index.html: manifest link does not match/)
})

