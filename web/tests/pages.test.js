import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { placeholderPages, routeEntries } from '../src/pages.js'

test('provisional page metadata follows the public UI contract', async () => {
  const contract = JSON.parse(await readFile(new URL('../../specs/006-landing/contracts/ui.json', import.meta.url), 'utf8'))
  for (const [route, page] of Object.entries(contract.routes)) {
    if (page.view !== 'placeholder') continue
    const metadata = placeholderPages[route.slice(1)]
    assert.ok(metadata, route)
    if (page.title) assert.equal(metadata.title, page.title, route)
    if (page.description) assert.equal(metadata.description, page.description, route)
    assert.match(metadata.accent, /^#[a-f0-9]{6}$/i)
  }
  assert.equal(placeholderPages.login.title, 'Acesso ao Aplicativo')
  assert.equal(placeholderPages.login.description, 'O ambiente digital do Ifes Mais Ciência na Escola estará disponível em breve.')
})

test('physical HTML entries cover the delivery contract', async () => {
  const contract = JSON.parse(await readFile(new URL('../../specs/007-web-delivery/contracts/delivery.json', import.meta.url), 'utf8'))
  assert.deepEqual([...routeEntries].sort(), [...contract.routeEntries].sort())
})
