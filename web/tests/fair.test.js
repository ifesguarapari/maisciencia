import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { renderPageContent } from '../build/page-content.js'
import { fairEditions, isFairRoute, renderFairPage } from '../src/fair.js'
import { regulation } from '../src/regulation.js'

const template = await readFile(new URL('../src/fair.html', import.meta.url), 'utf8')
const contract = JSON.parse(await readFile(new URL('../../specs/009-fair/contracts/fair.json', import.meta.url), 'utf8'))
const source = await readFile(new URL('../index.html', import.meta.url), 'utf8')
const escapeMarkup = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;')

for (const base of ['/', '/maisciencia/']) {
  test(`the first fair edition exposes the three requested encounters under ${base}`, () => {
    const html = renderFairPage(template, 'feira', base)
    assert.equal(fairEditions.length, 3)
    assert.match(html, /Primeira edição/)
    for (const [index, stage] of contract.stages.entries()) {
      const actual = fairEditions[index]
      assert.equal(`${actual.month} de ${actual.year}`, stage.dateLabel)
      assert.equal(actual.location, stage.location)
      assert.equal(`/${actual.route}`, stage.route)
      assert.deepEqual(actual.institutions, stage.institutions)
      assert.ok(html.includes(`href="${base}${actual.route}"`))
    }
    assert.equal([...html.matchAll(/class="fair-edition-card /g)].length, 3)
    const dates = [...html.matchAll(/<h3>([^<]+)<span>([^<]+)<\/span><\/h3>/g)]
      .map((match) => `${match[1]}${match[2]}`.trim())
    assert.deepEqual(dates, contract.stages.map((stage) => stage.dateLabel))
    assert.ok(html.includes(`href="${base}feira/regulamento"`))
    assert.ok(html.includes(`src="${base}${contract.brand}"`))
    assert.ok(html.includes(`class="brand-science" src="${base}images/maisciencia.svg"`))
    assert.ok(html.includes('alt="FEMAIS-ES"'))
    assert.ok(html.includes('Feira expositiva.'))
    assert.ok(!/1ª|ENCONTRO [123]|Página em construção/.test(html))
    assert.ok(!html.includes('%BASE_URL%') && !html.includes('{{'))
    assert.ok(!/R\$|milhões|mil reais|23183\.000542/.test(html))
    assert.equal([...html.matchAll(/<h1\b/g)].length, 1)
  })

  test(`each encounter contains only its exact supplied institutions under ${base}`, () => {
    const html = renderFairPage(template, 'feira', base)
    const cards = [...html.matchAll(/<article class="fair-edition-card [\s\S]*?<\/article>/g)].map((match) => match[0])
    assert.equal(cards.length, 3)
    for (const [index, card] of cards.entries()) {
      const names = [...card.matchAll(/class="fair-school-name">([^<]+)</g)].map((match) => match[1])
      const cities = [...card.matchAll(/class="fair-school-city">([^<]+)</g)].map((match) => match[1])
      assert.deepEqual(names, contract.stages[index].institutions.map(({ name }) => name))
      assert.deepEqual(cities, contract.stages[index].institutions.filter(({ city }) => city).map(({ city }) => city))
      assert.equal(names.length, [13, 12, 5][index])
    }
    assert.match(html, /professores, estudantes, pais e responsáveis do Programa Mais Ciência na Escola/)
    assert.ok(html.includes('id="experiencia"'))
    assert.match(html, /interagir|interação|interações/)
    assert.match(html, /acumulam pontos/)
    assert.match(html, /troféus e premiações/)
    assert.ok(!/\d+ pontos|ranking|QR Code/.test(html))
  })

  test(`each provisional encounter identifies its date and campus and returns to the fair under ${base}`, () => {
    for (const stage of contract.stages) {
      const html = renderFairPage(template, stage.route.slice(1), base)
      assert.match(html, />Em construção</)
      assert.ok(html.includes(stage.location))
      assert.ok(html.includes(stage.dateLabel.split(' de ')[0]))
      assert.ok(html.includes(`href="${base}feira#edicao"`))
      assert.equal([...html.matchAll(/<h1\b/g)].length, 1)
      assert.ok(!html.includes('id="fair-title"'))
    }
  })

  test(`the regulation is readable in the initial static HTML under ${base}`, () => {
    const html = renderPageContent(source, 'feira/regulamento', base)
    assert.ok(html.includes('class="fair-page"'))
    assert.ok(!html.includes('id="fair-title"') && !html.includes('id="about-title"'))
    assert.equal([...html.matchAll(/class="fair-document-section"/g)].length, 17)
    assert.equal([...html.matchAll(/<h1\b/g)].length, 1)
    for (const paragraph of regulation.preamble) assert.ok(html.includes(`<p>${escapeMarkup(paragraph)}</p>`))
    for (const section of regulation.sections) {
      assert.ok(html.includes(`href="#${section.id}"`))
      assert.ok(html.includes(`id="${section.id}"`))
      for (const paragraph of section.paragraphs) assert.ok(html.includes(`<p>${escapeMarkup(paragraph)}</p>`), paragraph)
    }
    assert.ok(!/R\$|23183\.000542/.test(html))
  })
}

test('fair rendering keeps the institutional home and previous placeholders intact', () => {
  for (const route of ['home', 'login', 'oficinas', 'oficinas/ler', 'oficinas/lancar', 'oficinas/melhorar']) {
    assert.equal(isFairRoute(route), false)
    assert.equal(renderPageContent(source, route), source)
  }
  for (const invalid of [null, 'feira/unknown', 'feira-extra', 'constructor', '__proto__']) {
    assert.equal(isFairRoute(invalid), false)
    assert.throws(() => renderFairPage(template, invalid, '/'), /Unknown fair route/)
  }
})

test('the regulation preserves all sections, participation, inclusion and evaluation clauses', () => {
  assert.equal(regulation.sections.length, contract.regulation.sectionCount)
  assert.equal(regulation.preamble.length, contract.regulation.preambleParagraphCount)
  assert.deepEqual(regulation.sections.map((section) => section.number), Array.from({ length: 17 }, (_, index) => index + 1))
  assert.equal(regulation.sections.reduce((count, section) => count + section.paragraphs.length, 0), 154)
  const text = regulation.sections.flatMap((section) => section.paragraphs).join('\n')
  assert.match(text, /4\.1\..*públicas ou privadas/)
  assert.match(text, /5\.2\..*50%.*mulheres.*25%.*estudantes negros/)
  assert.match(text, /3\.9\. Adequação da programação/)
  assert.match(text, /3\.10\./)
  assert.match(text, /13\.4\./)
  assert.match(text, /17\.5\./)
})
