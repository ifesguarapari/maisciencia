import assert from 'node:assert/strict'
import { test } from 'node:test'
import { apiNavigationDenylist, getPageRoute, normalizeBasePath, publicUrl } from '../src/paths.js'

test('build bases accept root and absolute prefixes with or without a final slash', () => {
  assert.equal(normalizeBasePath(), '/')
  assert.equal(normalizeBasePath('/'), '/')
  assert.equal(normalizeBasePath('/maisciencia'), '/maisciencia/')
  assert.equal(normalizeBasePath('/preview/site/'), '/preview/site/')
  for (const invalid of ['maisciencia/', '//other.example/', '/site/../', '/./', '/site?query', '/site#fragment']) {
    assert.throws(() => normalizeBasePath(invalid), /WEB_BASE_PATH/)
  }
})

for (const base of ['/', '/maisciencia/', '/preview/site/']) {
  test(`direct routes and final slash variants select the right page under ${base}`, () => {
    assert.equal(getPageRoute(base, base), 'home')
    for (const route of ['login', 'feira', 'oficinas', 'oficinas/ler', 'oficinas/lancar', 'oficinas/melhorar']) {
      assert.equal(getPageRoute(`${base}${route}`, base), route)
      assert.equal(getPageRoute(`${base}${route}/`, base), route)
    }
    for (const route of ['login-extra', 'login/details', 'oficinas-extra', 'oficinas/unknown', 'oficinas/ler-extra', 'oficinas/ler/details', 'oficinas//ler', 'oficinas/ler//', 'constructor', 'toString', '__proto__']) {
      assert.equal(getPageRoute(`${base}${route}`, base), null, route)
    }
  })

  test(`public resources retain SVG fragments and stay under ${base}`, () => {
    const documentUrl = new URL(`${base}oficinas/ler/`, 'https://example.test')
    const iconUrl = new URL(publicUrl('icons/interface.svg#menu', base), documentUrl)
    assert.equal(iconUrl.pathname, `${base}icons/interface.svg`)
    assert.equal(iconUrl.hash, '#menu')
    assert.equal(new URL(publicUrl('/images/background.webp', base), documentUrl).pathname, `${base}images/background.webp`)
    assert.equal(new URL(publicUrl('login', base), documentUrl).pathname, `${base}login`)
    assert.equal(new URL(publicUrl('oficinas/lancar', base), documentUrl).pathname, `${base}oficinas/lancar`)
    assert.equal(new URL(publicUrl('', base), documentUrl).pathname, base)
  })

  test(`API navigation stays outside the offline fallback under ${base}`, () => {
    const denied = apiNavigationDenylist(base)
    for (const prefix of new Set(['/api', `${base}api`])) {
      for (const suffix of ['', '/', '?page=1', '/web/session?refresh=1']) {
        assert.ok(denied.some((pattern) => pattern.test(`${prefix}${suffix}`)), `${prefix}${suffix}`)
      }
    }
    for (const path of [`${base}feira`, `${base}login/`, `${base}oficinas/ler/`, `${base}apiary`, '/apiculture']) {
      assert.ok(denied.every((pattern) => !pattern.test(path)), path)
    }
  })
}

test('a project prefix is a directory boundary and never captures another site', () => {
  assert.equal(getPageRoute('/maisciencia', '/maisciencia/'), 'home')
  for (const pathname of ['/login', '/feira/', '/oficinas/ler/', '/maisciencia-other/login', '/maisciencia-other/oficinas/ler', '/other/maisciencia/oficinas/ler']) {
    assert.equal(getPageRoute(pathname, '/maisciencia/'), null)
  }
})

test('API exclusion escapes dots in repository names', () => {
  const denied = apiNavigationDenylist('/school.site/')
  assert.ok(denied.some((pattern) => pattern.test('/school.site/api/web/session')))
  assert.ok(denied.every((pattern) => !pattern.test('/school-site/api/web/session')))
})
