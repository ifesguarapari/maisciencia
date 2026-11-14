import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { renderPageMetadata, renderRobots, renderSitemap } from '../build/seo.js'
import { checkSeo } from '../scripts/check-seo.mjs'
import { placeholderPages, routeEntries } from '../src/pages.js'
import { getPageRoute } from '../src/paths.js'
import { DEFAULT_SITE_ORIGIN, getPageSeo, seoNavigationDenylist, syncPageSeo } from '../src/seo.js'

const contract = JSON.parse(await readFile(new URL('../../specs/008-seo/contracts/seo.json', import.meta.url), 'utf8'))
const template = '<!doctype html><html lang="pt-BR"><head><!-- seo:start --><!-- seo:end --></head><body><main>Content</main></body></html>'

test('discovery documents bypass the PWA navigation shell without excluding pages or adjacent paths', () => {
  for (const base of ['/', '/maisciencia/', '/preview/site.v2/']) {
    const denied = (pathname) => seoNavigationDenylist(base).some((pattern) => pattern.test(pathname))
    for (const file of ['robots.txt', 'sitemap.xml']) {
      assert.ok(denied(`${base}${file}`))
      assert.ok(denied(`${base}${file}?check=1`))
      assert.ok(!denied(`${base}${file}/details`))
      assert.ok(!denied(`${base}nested/${file}`))
    }
    assert.ok(!denied(base))
    assert.ok(!denied(`${base}oficinas/ler`))
    assert.ok(!denied(`${base.replace('site.v2', 'siteXv2')}sitemapXxml`))
  }
})

async function fixture(t, options = {}) {
  const directory = await mkdtemp(path.join(tmpdir(), 'maisciencia-seo-'))
  t.after(() => rm(directory, { recursive: true, force: true }))
  const files = Object.fromEntries(routeEntries.map((file) => {
    const route = file === 'index.html' ? 'home' : file.replace(/\/index\.html$/, '')
    return [file, renderPageMetadata(template, getPageSeo(route, options))]
  }))
  files['robots.txt'] = renderRobots(options)
  files['sitemap.xml'] = renderSitemap(options)
  files['icons/slide.webp'] = 'image fixture'
  files['assets/main.css'] = 'body { color: white; }'
  files['assets/main.js'] = 'export const ready = true'
  await Promise.all(Object.entries(files).map(async ([file, source]) => {
    await mkdir(path.dirname(path.join(directory, file)), { recursive: true })
    await writeFile(path.join(directory, file), source)
  }))
  return directory
}

async function change(directory, file, transform) {
  const filename = path.join(directory, file)
  const before = await readFile(filename, 'utf8')
  const after = transform(before)
  assert.notEqual(after, before, `Mutation must change ${file}`)
  await writeFile(filename, after)
}

for (const [base, origin] of [['/', DEFAULT_SITE_ORIGIN], ['/maisciencia/', 'https://ifesguarapari.github.io']]) {
  test(`verifies the seven initial HTML documents and discovery files under ${origin}${base}`, async (t) => {
    const directory = await fixture(t, { base, origin })
    assert.deepEqual(await checkSeo({ directory, base, origin }), { base, origin, pagesChecked: 7 })
  })

  test(`metadata follows the SEO contract and route catalog under ${base}`, () => {
    const home = getPageSeo('home', { base, origin })
    assert.equal(home.siteName, contract.siteName)
    assert.equal(home.title, contract.homeTitle)
    assert.match(home.description, /Espírito Santo/)
    assert.equal(home.robots, contract.homeRobots)
    assert.equal(home.indexable, true)
    assert.equal(home.canonical, `${origin}${base}`)
    assert.equal(home.image, `${origin}${base}${contract.shareImage}`)
    assert.equal(home.imageType, contract.shareImageType)
    assert.equal(home.imageWidth, contract.shareImageWidth)
    assert.equal(home.imageHeight, contract.shareImageHeight)
    for (const [route, page] of Object.entries(placeholderPages)) {
      const metadata = getPageSeo(route, { base, origin })
      assert.equal(metadata.title, `${page.title} | ${contract.siteName}`)
      assert.equal(metadata.description, page.description)
      assert.equal(metadata.indexable, false)
      assert.equal(metadata.robots, contract.placeholderRobots)
      assert.equal(metadata.canonical, `${origin}${base}${route}/`)
      for (const suffix of ['', '/']) {
        const resolved = getPageRoute(`${base}${route}${suffix}`, base)
        assert.equal(getPageSeo(resolved, { base, origin }).canonical, metadata.canonical)
      }
    }
  })
}

test('uses the documented production origin by default', () => {
  assert.equal(DEFAULT_SITE_ORIGIN, contract.defaultOrigin)
  assert.equal(getPageSeo().canonical, `${contract.defaultOrigin}/`)
})

test('rejects invalid public origins before inspecting the artifact', async () => {
  for (const origin of ['http://example.org', 'https://example.org/path', 'https://example.org/?query=1',
    'https://example.org/#section', 'https://user:password@example.org', '//example.org', 'invalid', '']) {
    assert.throws(() => getPageSeo('home', { origin }), /WEB_SITE_ORIGIN/, origin)
    await assert.rejects(checkSeo({ directory: '/nonexistent-seo-fixture', origin }), /WEB_SITE_ORIGIN/, origin)
  }
})

test('rejects an unknown route instead of assigning it the home indexation policy', () => {
  assert.throws(() => getPageSeo('missing'), /Unknown SEO route/)
})

test('rejects accidental noindex on the institutional home page', async (t) => {
  const directory = await fixture(t)
  await change(directory, 'index.html', (html) => html.replace('index,follow,max-image-preview:large', 'noindex,follow'))
  await assert.rejects(checkSeo({ directory }), /index\.html: robots must be/)
})

test('rejects an indexable provisional workshop even when the sitemap remains correct', async (t) => {
  const directory = await fixture(t)
  await change(directory, 'oficinas/ler/index.html', (html) => html.replace('noindex,follow', 'index,follow'))
  await assert.rejects(checkSeo({ directory }), /oficinas\/ler\/index\.html: robots must be/)
})

test('requires each physical provisional document before JavaScript executes', async (t) => {
  const directory = await fixture(t)
  await rm(path.join(directory, 'oficinas/melhorar/index.html'))
  await assert.rejects(checkSeo({ directory }), /Missing required SEO entry: oficinas\/melhorar\/index\.html/)
})

test('rejects a second canonical even when it agrees with the first one', async (t) => {
  const directory = await fixture(t)
  await change(directory, 'index.html', (html) => html.replace('</head>', `<link href="${DEFAULT_SITE_ORIGIN}/" rel="canonical"></head>`))
  await assert.rejects(checkSeo({ directory }), /expected exactly one canonical link; found 2/)
})

test('rejects a canonical with the wrong origin, route, protocol or project base', async (t) => {
  const base = '/maisciencia/'
  const directory = await fixture(t, { base })
  const filename = path.join(directory, 'feira/index.html')
  const original = await readFile(filename, 'utf8')
  for (const wrong of ['https://other.example/maisciencia/feira/', `${DEFAULT_SITE_ORIGIN}/maisciencia/`,
    `${DEFAULT_SITE_ORIGIN}/feira/`, `${DEFAULT_SITE_ORIGIN}/maisciencia/feira`,
    'http://maisciencia.ifes.app.br/maisciencia/feira/']) {
    await writeFile(filename, original.replace(`href="${DEFAULT_SITE_ORIGIN}${base}feira/"`, `href="${wrong}"`))
    await assert.rejects(checkSeo({ directory, base }), /feira\/index\.html: canonical must be the absolute HTTPS URL/, wrong)
  }
})

test('rejects a provisional entry carrying the home title and description', async (t) => {
  const directory = await fixture(t)
  const home = getPageSeo()
  const provisional = getPageSeo('login')
  await change(directory, 'login/index.html', (html) => html.replace(provisional.title, home.title).replace(provisional.description, home.description))
  await assert.rejects(checkSeo({ directory }), /login\/index\.html: (?:expected one nonempty title matching this route|description does not match this route)/)
})

test('rejects six noindex routes added to the sitemap', async (t) => {
  const directory = await fixture(t)
  await change(directory, 'sitemap.xml', (xml) => xml.replace('</urlset>', `${Object.keys(placeholderPages)
    .map((route) => `<url><loc>${DEFAULT_SITE_ORIGIN}/${route}/</loc></url>`).join('')}</urlset>`))
  await assert.rejects(checkSeo({ directory }), /sitemap\.xml: expected only the indexable home URL/)
})

test('rejects section fragments and invented sitemap update dates', async (t) => {
  const directory = await fixture(t)
  const filename = path.join(directory, 'sitemap.xml')
  const original = await readFile(filename, 'utf8')
  await writeFile(filename, original.replace('</loc>', '#about</loc>'))
  await assert.rejects(checkSeo({ directory }), /sitemap\.xml: expected only the indexable home URL/)
  await writeFile(filename, original.replace('</url>', '<lastmod>2026-11-14</lastmod></url>'))
  await assert.rejects(checkSeo({ directory }), /lastmod, changefreq and priority must not be invented/)
})

test('rejects malformed sitemap XML even if its loc is correct', async (t) => {
  const directory = await fixture(t)
  await change(directory, 'sitemap.xml', (xml) => xml.replace('</url>', ''))
  await assert.rejects(checkSeo({ directory }), /sitemap\.xml: expected a valid sitemap urlset/)
})

test('rejects robots rules hiding provisional pages or rendering resources', async (t) => {
  const base = '/maisciencia/'
  const directory = await fixture(t, { base })
  const filename = path.join(directory, 'robots.txt')
  const original = await readFile(filename, 'utf8')
  for (const rule of ['/', `${base}login/`, `${base}oficinas/`, `${base}assets/`, '/*.webp$']) {
    await writeFile(filename, original.replace('Allow: /', `Disallow: ${rule}`))
    await assert.rejects(checkSeo({ directory, base }), /robots\.txt: .* blocks crawling/, rule)
  }
})

test('accepts a more specific robots allow rule and a disallow outside the artifact', async (t) => {
  const base = '/maisciencia/'
  const directory = await fixture(t, { base })
  await change(directory, 'robots.txt', (source) => `${source}Disallow: /\nAllow: ${base}\nDisallow: /api/\n`)
  assert.equal((await checkSeo({ directory, base })).pagesChecked, 7)
})

test('rejects a robots sitemap URL pointing to a different project base', async (t) => {
  const base = '/maisciencia/'
  const directory = await fixture(t, { base })
  await change(directory, 'robots.txt', (source) => source.replace('/maisciencia/sitemap.xml', '/sitemap.xml'))
  await assert.rejects(checkSeo({ directory, base }), /robots\.txt: expected one absolute Sitemap:/)
})

test('rejects incorrect sharing URLs and a missing image asset', async (t) => {
  const directory = await fixture(t)
  const filename = path.join(directory, 'login/index.html')
  const original = await readFile(filename, 'utf8')
  await writeFile(filename, original.replace(`property="og:url" content="${DEFAULT_SITE_ORIGIN}/login/"`, 'property="og:url" content="https://other.example/"'))
  await assert.rejects(checkSeo({ directory }), /login\/index\.html: og:url does not match this route/)
  await writeFile(filename, original.replace(`property="og:image" content="${DEFAULT_SITE_ORIGIN}/icons/slide.webp"`, 'property="og:image" content="/icons/slide.webp"'))
  await assert.rejects(checkSeo({ directory }), /login\/index\.html: og:image does not match this route/)
  for (const [name, correct, incorrect] of [
    ['secure_url', `${DEFAULT_SITE_ORIGIN}/icons/slide.webp`, 'http://other.example/slide.webp'],
    ['type', 'image/webp', 'image/png'],
    ['width', '750', '1200'],
    ['height', '425', '630'],
  ]) {
    await writeFile(filename, original)
    await change(directory, 'login/index.html', (html) => html.replace(
      `property="og:image:${name}" content="${correct}"`, `property="og:image:${name}" content="${incorrect}"`,
    ))
    await assert.rejects(checkSeo({ directory }), (error) => error.message.includes(`login/index.html: og:image:${name} does not match this route`))
  }
  await writeFile(filename, original)
  await rm(path.join(directory, 'icons/slide.webp'))
  await assert.rejects(checkSeo({ directory }), /sharing image is missing from artifact/)
})

test('rejects WebSite JSON-LD copied to provisional routes or given a false identity', async (t) => {
  const directory = await fixture(t)
  const home = await readFile(path.join(directory, 'index.html'), 'utf8')
  const structured = home.match(/<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/)[0]
  await change(directory, 'feira/index.html', (html) => html.replace('</head>', `${structured}</head>`))
  await assert.rejects(checkSeo({ directory }), /feira\/index\.html: expected no WebSite JSON-LD block/)
  await writeFile(path.join(directory, 'feira/index.html'), renderPageMetadata(template, getPageSeo('feira')))
  await change(directory, 'index.html', (html) => html.replace('"name":"Ifes Mais Ciência na Escola"', '"name":"Invented Site"'))
  await assert.rejects(checkSeo({ directory }), /WebSite JSON-LD identity, URL or language does not match/)
})

test('escapes metadata text and prevents script termination inside JSON-LD', () => {
  const metadata = { ...getPageSeo(), title: 'Ciência <Escola> & "Tecnologia" $&', description: '</script><script>unexpected()</script>' }
  const html = renderPageMetadata(template, metadata)
  assert.ok(html.includes('Ciência &lt;Escola&gt; &amp; &quot;Tecnologia&quot; $&amp;'))
  assert.ok(!html.includes('</script><script>unexpected()'))
  const structured = html.match(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)[1]
  assert.equal(JSON.parse(structured).description, metadata.description)
  assert.throws(() => renderPageMetadata('<head></head>', metadata), /Exactly one SEO metadata block/)
})

test('synchronizes home shell metadata to provisional routes and back without duplicates', () => {
  const elements = []
  const document = {
    head: {
      querySelectorAll: () => elements.filter((element) => element.attrs.id?.startsWith('seo-')),
      append: (element) => elements.push(element),
    },
    createElement: (tag) => ({
      tag,
      attrs: {},
      setAttribute(name, value) { this.attrs[name] = value },
      remove() { elements.splice(elements.indexOf(this), 1) },
    }),
  }
  const unrelated = document.createElement('meta')
  unrelated.setAttribute('name', 'theme-color')
  unrelated.setAttribute('content', '#101010')
  elements.push(unrelated)
  for (const route of ['home', 'oficinas/ler', 'oficinas/ler', 'home']) {
    const metadata = getPageSeo(route, { base: '/maisciencia/' })
    syncPageSeo(document, metadata)
    assert.equal(elements.filter(({ tag }) => tag === 'title').length, 1)
    assert.equal(elements.find(({ tag }) => tag === 'title').textContent, metadata.title)
    const canonical = elements.filter(({ attrs }) => attrs.rel === 'canonical')
    assert.equal(canonical.length, 1)
    assert.equal(canonical[0].attrs.href, metadata.canonical)
    assert.equal(elements.find(({ attrs }) => attrs.name === 'robots').attrs.content, route === 'home' ? contract.homeRobots : contract.placeholderRobots)
    assert.equal(elements.filter(({ attrs }) => attrs.type === 'application/ld+json').length, route === 'home' ? 1 : 0)
    assert.ok(elements.includes(unrelated))
  }
})
