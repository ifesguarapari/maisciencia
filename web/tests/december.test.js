import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile, readdir } from 'node:fs/promises'
import { test } from 'node:test'
import { renderPageContent } from '../build/page-content.js'
import { renderPageMetadata, renderSitemap } from '../build/seo.js'
import { decemberFair } from '../src/december-data.js'
import { renderDecemberPage } from '../src/december.js'
import { contentPages, placeholderPages, routeEntries } from '../src/pages.js'
import { getPageRoute } from '../src/paths.js'
import { getPageSeo } from '../src/seo.js'

const contract = JSON.parse(await readFile(new URL('../../specs/009-fair/contracts/fair.json', import.meta.url), 'utf8'))
const expected = contract.december
const route = expected.route.slice(1)
const source = await readFile(new URL('../index.html', import.meta.url), 'utf8')
const activities = decemberFair.axes.flatMap(({ activities }) => activities)
const expectedActivities = expected.axes.flatMap(({ activities }) => activities)
const escapeMarkup = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;')
const entries = (html) => [...html.matchAll(/<article\b[^>]*\bid="activity-([^"]+)"[^>]*>([\s\S]*?)<\/article>/g)]

test('the December activity content preserves the complete independent DOCX fingerprint', () => {
  const { algorithm, fields, value } = expected.sourceContentFingerprint
  assert.deepEqual(fields, expected.activityFields)
  const records = activities.map((activity) => fields.map((field) => activity[field]))
  assert.equal(createHash(algorithm).update(JSON.stringify(records), 'utf8').digest('hex'), value)
  assert.deepEqual(decemberFair.axes.map(({ id, number, title, activities }) => ({
    id, number, title, activities: activities.map(({ id, number, title }) => ({ id, number, title })),
  })), expected.axes.map(({ id, number, title, activities }) => ({
    id, number, title, activities: activities.map(({ id, number, title }) => ({ id, number, title })),
  })))
})

for (const base of contract.basePaths) {
  test(`December is readable in the initial HTML and discoverable without JavaScript under ${base}`, () => {
    const metadata = getPageSeo(route, { base })
    const html = renderPageMetadata(renderPageContent(source.replaceAll('%BASE_URL%', base), route, base), metadata)
    assert.ok(contentPages[route].indexable)
    assert.ok(!Object.hasOwn(placeholderPages, route))
    assert.ok(routeEntries.includes(`${route}/index.html`))
    for (const suffix of ['', '/']) assert.equal(getPageRoute(`${base}${route}${suffix}`, base), route)
    assert.ok(html.includes(`data-fair-page="${route}"`))
    assert.match(html, /<body class="fair-page"/)
    assert.equal([...html.matchAll(/<h1\b/g)].length, 1)
    assert.ok(!/Em construção|Página em construção|\{\{/.test(html))
    assert.ok(!html.includes('id="about-title"') && !html.includes('id="fair-title"'))
    assert.ok(html.includes(`href="${metadata.canonical}"`))
    assert.ok(html.includes('name="robots" content="index,follow,max-image-preview:large"'))
    assert.ok(html.includes(`content="${metadata.image}"`))
    assert.ok(metadata.image.endsWith(`${base}icons/feira/slide.webp`))
    assert.ok(renderSitemap({ base }).includes(`<loc>${metadata.canonical}</loc>`))
    assert.ok(!html.includes('application/ld+json'))

    const cards = entries(html)
    assert.equal(cards.length, expected.activityCount)
    assert.equal(decemberFair.axes.length, expected.axisCount)
    assert.deepEqual(cards.map(([, id]) => id), expectedActivities.map(({ id }) => id))
    for (const [index, [, id, card]] of cards.entries()) {
      for (const field of expected.activityFields) {
        assert.ok(card.includes(escapeMarkup(activities[index][field])), `${id}: ${field} must be present in initial HTML`)
      }
      assert.match(card, /<h4\b/)
      assert.match(card, /<details\b/)
      assert.match(card, /<summary\b[^>]*>Sobre a exposição/)
      assert.ok(card.includes(`<p>${escapeMarkup(activities[index].description)}</p></div></details>`))
      const { width, height } = expected.illustrationSize
      assert.ok(card.includes(`src="${base}${expectedActivities[index].image}"`))
      assert.ok(card.includes(`alt="Ilustração: ${escapeMarkup(activities[index].title)}" width="${width}" height="${height}"`))
    }
    for (const axis of decemberFair.axes) {
      assert.ok(html.includes(`href="#${axis.id}"`))
      assert.ok(html.includes(`<h3 id="axis-title-${axis.id}">${escapeMarkup(axis.title)}</h3><p>${escapeMarkup(axis.description)}</p>`))
    }
  })

  test(`December retains the four source times, invited schools and separately scoped JIC under ${base}`, () => {
    const html = renderPageContent(source.replaceAll('%BASE_URL%', base), route, base)
    const program = html.match(/<section id="program"[\s\S]*?<\/section>/)[0]
    const times = [...program.matchAll(/<time datetime="([^"]+)">([^<]+)<\/time><h3>([^<]+)<\/h3>/g)]
    assert.deepEqual(times.map(([, time, , title]) => ({ time, title })), expected.schedule)
    assert.ok(program.includes(expected.venue))
    assert.ok(program.includes('dezembro de 2026'))
    assert.ok(program.includes(expected.dateLabel))
    assert.ok(program.includes('04/12/2026'))
    assert.ok(program.includes(`datetime="${expected.exactDate}"`))
    assert.equal(decemberFair.schedule.date, expected.exactDate)
    assert.equal(expected.exactDate, '2026-12-04')
    assert.ok(!/30 de novembro|2026-11-30/.test(program))
    const schools = html.match(/<ul class="fair-encounter-schools">([\s\S]*?)<\/ul>/)[1]
    const institutions = [...schools.matchAll(/<li\b[^>]*><span>([^<]+)<\/span>(?:<small>([^<]+)<\/small>)?<\/li>/g)]
      .map(([, name, city]) => ({ name, city: city ?? null }))
    assert.equal(institutions.length, expected.institutionCount)
    assert.deepEqual(institutions, contract.stages.find(({ route }) => route === expected.route).institutions)
    assert.match(html, /professores, estudantes, pais e responsáveis convidados/)
    assert.match(html, /autoridades convidadas/)

    const integration = html.match(/<section id="integration"[\s\S]*?<\/section>/)[0]
    assert.ok(integration.includes(escapeMarkup(decemberFair.integration.description)))
    assert.ok(integration.includes(`src="${base}${expected.integration.image}"`))
    assert.ok(integration.includes(`href="${expected.integration.url}" target="_blank" rel="noopener noreferrer"`))
    assert.match(integration, /Jornada de Integração 2026 será realizada entre os dias 30 de novembro e 4 de dezembro/)
    assert.match(integration, /programação do evento é aberta ao público/)
    for (const name of expected.integration.relatedEvents) assert.ok(integration.includes(name))
    assert.ok(html.includes('A proposta prevê o acompanhamento em tempo real pelo aplicativo do evento.'))
    assert.ok(!/R\$|\d+ pontos|action=|<form\b/.test(html))
  })

  test(`December links stay within known routes and every local anchor resolves under ${base}`, () => {
    const html = renderPageContent(source.replaceAll('%BASE_URL%', base), route, base)
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(([, id]) => id)
    assert.equal(new Set(ids).size, ids.length, 'IDs must remain unique in the complete document')
    const anchors = [...html.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)].map(([, href]) => href)
    const allowedExternal = new Set([expected.integration.url, 'https://www.instagram.com/ifesmaisciencia/'])
    for (const href of anchors) {
      if (href.startsWith('#')) assert.ok(ids.includes(href.slice(1)), `Missing anchor ${href}`)
      else if (/^https:/.test(href)) assert.ok(allowedExternal.has(href), `Unexpected external URL: ${href}`)
      else {
        assert.ok(href.startsWith(base), `URL must respect the public base: ${href}`)
        assert.notEqual(getPageRoute(href.split('#')[0], base), null, `Unknown page: ${href}`)
      }
    }
    for (const { id } of expectedActivities) assert.ok(ids.includes(`activity-${id}`))
    assert.ok(anchors.includes(`${base}feira`) && anchors.includes(`${base}feira#edicao`))
    assert.ok(anchors.includes(`${base}feira/regulamento`))
    assert.ok(!anchors.some((href) => /register|inscri|\/api\/|javascript:|data:/.test(href)))
  })
}

test('text from activity fields and axis summaries cannot become injected markup', () => {
  const activity = activities[0]
  const axis = decemberFair.axes[0]
  const original = { ...activity }
  const originalDescription = axis.description
  const unsafe = '<script>alert("activity")</script> & \'quoted\''
  try {
    for (const field of expected.activityFields) activity[field] = `${field}: ${unsafe}`
    axis.description = unsafe
    const html = renderDecemberPage()
    assert.ok(!html.includes(unsafe))
    assert.ok(!html.includes('<script>'))
    for (const field of expected.activityFields) assert.ok(html.includes(escapeMarkup(`${field}: ${unsafe}`)))
    assert.ok(html.includes(`<p>${escapeMarkup(unsafe)}</p>`))
  } finally {
    Object.assign(activity, original)
    axis.description = originalDescription
  }
})

test('each source activity has a distinct SVG with local resources and stable dimensions', async () => {
  const directory = new URL('../public/images/feira/activities/', import.meta.url)
  assert.deepEqual((await readdir(directory)).filter((file) => file.endsWith('.svg')).sort(), expectedActivities.map(({ id }) => `${id}.svg`).sort())
  const contents = await Promise.all(expectedActivities.map(({ image }) => readFile(new URL(`../public/${image}`, import.meta.url), 'utf8')))
  assert.equal(new Set(contents).size, expected.activityCount, 'Each activity needs a distinct illustration')
  for (const [index, svg] of contents.entries()) {
    const label = expectedActivities[index].id
    const root = svg.match(/^<svg\b([^>]+)>/)[1]
    assert.ok(root.includes('xmlns="http://www.w3.org/2000/svg"'), label)
    assert.ok(root.includes(`width="${expected.illustrationSize.width}"`), label)
    assert.ok(root.includes(`height="${expected.illustrationSize.height}"`), label)
    assert.ok(root.includes('viewBox="0 0 480 300"'), label)
    assert.match(svg, /<title\b[^>]*>[^<]+<\/title>/)
    assert.match(svg, /<desc\b[^>]*>[^<]+<\/desc>/)
    assert.match(svg, /<\/svg>\s*$/)
    assert.ok(!/<(?:script|foreignObject|animate|animateTransform|set)\b|\son[a-z]+\s*=/i.test(svg), label)
    const ids = [...svg.matchAll(/\sid="([^"]+)"/g)].map(([, id]) => id)
    assert.equal(new Set(ids).size, ids.length, `${label}: duplicate SVG IDs`)
    for (const [, href, paint] of svg.matchAll(/\s(?:xlink:)?href="([^"]+)"|url\(([^)]+)\)/g)) {
      const target = href ?? paint
      assert.ok(target.startsWith('#') && ids.includes(target.slice(1)), `${label}: resources must be local`)
    }
  }
})
