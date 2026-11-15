import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { contentPages, routeEntries } from '../src/pages.js'
import { DEFAULT_SITE_ORIGIN, getPageSeo } from '../src/seo.js'

function decodeEntities(value) {
  return value.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (entity, name) => {
    const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" }
    if (!name.startsWith('#')) return named[name.toLowerCase()]
    const number = name[1].toLowerCase() === 'x' ? parseInt(name.slice(2), 16) : Number(name.slice(1))
    return number > 0 && number <= 0x10ffff ? String.fromCodePoint(number) : entity
  })
}

function attributes(source) {
  return Object.fromEntries([...source.matchAll(/([^\s=<>/]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)]
    .map((match) => [match[1].toLowerCase(), decodeEntities(match[2] ?? match[3] ?? match[4])]))
}

function webpDimensions(bytes) {
  if (bytes.length < 20 || bytes.toString('ascii', 0, 4) !== 'RIFF'
    || bytes.toString('ascii', 8, 12) !== 'WEBP' || bytes.readUInt32LE(4) + 8 !== bytes.length) {
    throw new Error('sharing image must have a complete WebP RIFF container')
  }
  let image
  let canvas
  for (let offset = 12; offset < bytes.length;) {
    if (offset + 8 > bytes.length) throw new Error('sharing image has a truncated WebP chunk')
    const type = bytes.toString('ascii', offset, offset + 4)
    const size = bytes.readUInt32LE(offset + 4)
    const start = offset + 8
    const end = start + size
    const next = end + (size % 2)
    if (next > bytes.length || (size % 2 && bytes[end] !== 0)) {
      throw new Error('sharing image has an incomplete WebP chunk')
    }
    const data = bytes.subarray(start, end)
    if (type === 'VP8X' && size === 10) {
      canvas = { width: data.readUIntLE(4, 3) + 1, height: data.readUIntLE(7, 3) + 1 }
    } else if (type === 'VP8 ' && size > 10 && data.subarray(3, 6).equals(Buffer.from([0x9d, 0x01, 0x2a]))) {
      image = { width: data.readUInt16LE(6) & 0x3fff, height: data.readUInt16LE(8) & 0x3fff }
    } else if (type === 'VP8L' && size > 5 && data[0] === 0x2f) {
      const dimensions = data.readUInt32LE(1)
      image = { width: (dimensions & 0x3fff) + 1, height: ((dimensions >>> 14) & 0x3fff) + 1 }
    }
    offset = next
  }
  if (!image || !image.width || !image.height) throw new Error('sharing image is missing a supported WebP image header')
  if (canvas && (canvas.width !== image.width || canvas.height !== image.height)) {
    throw new Error('sharing image WebP canvas and image dimensions disagree')
  }
  return image
}

async function listFiles(directory, prefix = '') {
  const entries = await readdir(path.join(directory, prefix), { withFileTypes: true })
  const nested = await Promise.all(entries.map((entry) => {
    const name = path.posix.join(prefix, entry.name)
    return entry.isDirectory() ? listFiles(directory, name) : [name]
  }))
  return nested.flat()
}

function matchesRobotsRule(pattern, pathname) {
  const anchored = pattern.endsWith('$')
  if (anchored) pattern = pattern.slice(0, -1)
  const expression = pattern.split('*').map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*')
  return new RegExp(`^${expression}${anchored ? '$' : ''}`).test(pathname)
}

function checkRobots(source, { base, origin, files, fail }) {
  const groups = []
  const sitemaps = []
  let group
  for (const line of source.split(/\r?\n/)) {
    const match = /^\s*([a-z-]+)\s*:\s*(.*?)\s*$/i.exec(line.replace(/#.*$/, ''))
    if (!match) continue
    const [, rawName, value] = match
    const name = rawName.toLowerCase()
    if (name === 'sitemap') sitemaps.push(value)
    if (name === 'user-agent') {
      if (!group || group.rules.length) {
        group = { agents: [], rules: [] }
        groups.push(group)
      }
      group.agents.push(value)
    } else if (['allow', 'disallow'].includes(name) && value) {
      if (!group) fail('robots.txt: crawl rule is missing a User-agent group')
      else group.rules.push({ name, value })
    }
  }
  if (!groups.some(({ agents }) => agents.includes('*'))) fail('robots.txt: missing User-agent: * policy')
  const expectedSitemap = `${origin}${base}sitemap.xml`
  if (sitemaps.length !== 1 || sitemaps[0] !== expectedSitemap) {
    fail(`robots.txt: expected one absolute Sitemap: ${expectedSitemap}`)
  }
  const paths = new Set([base, ...routeEntries.map((entry) => `${base}${entry.replace(/index\.html$/, '')}`),
    ...files.map((file) => `${base}${file}`)])
  for (const { agents, rules } of groups) {
    for (const pathname of paths) {
      const matching = rules.filter(({ value }) => matchesRobotsRule(value, pathname))
        .sort((left, right) => right.value.replace(/[*$]/g, '').length - left.value.replace(/[*$]/g, '').length
          || (left.name === 'allow' ? -1 : 1))
      if (matching[0]?.name === 'disallow') {
        fail(`robots.txt: ${agents.join(', ')} blocks crawling ${pathname} with Disallow: ${matching[0].value}`)
      }
    }
  }
}

function checkSitemap(source, canonicals, fail) {
  const xml = source.replace(/^\uFEFF/, '').replace(/<\?xml\s[^?]*\?>/, '').replace(/<!--[\s\S]*?-->/g, '').trim()
  const root = /^<urlset\b([^>]*)>([\s\S]*)<\/urlset>$/.exec(xml)
  if (!root || attributes(root[1]).xmlns !== 'http://www.sitemaps.org/schemas/sitemap/0.9'
    || !/^(?:\s*<url>\s*<loc>[^<]*<\/loc>\s*<\/url>)+\s*$/.test(root[2])) {
    fail('sitemap.xml: expected a valid sitemap urlset containing only url/loc entries')
  }
  if (/<(?:[\w-]+:)?(?:lastmod|changefreq|priority)\b/i.test(xml)) {
    fail('sitemap.xml: lastmod, changefreq and priority must not be invented')
  }
  const locations = [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((match) => decodeEntities(match[1].trim()))
  if (JSON.stringify([...locations].sort()) !== JSON.stringify([...canonicals].sort())) {
    fail(`sitemap.xml: expected only the indexable URLs ${canonicals.join(', ')}; found ${locations.join(', ') || 'none'}`)
  }
}

export async function checkSeo({ directory = 'dist', base = '/', origin = DEFAULT_SITE_ORIGIN } = {}) {
  const home = getPageSeo('home', { base, origin })
  base = home.base
  origin = home.origin
  directory = path.resolve(directory)
  const files = await listFiles(directory)
  const fileSet = new Set(files)
  const errors = new Set()
  const fail = (message) => errors.add(message)
  const homeUrl = `${origin}${base}`
  const imageCache = new Map()
  let pagesChecked = 0

  async function readRequired(file) {
    if (!fileSet.has(file)) {
      fail(`Missing required SEO entry: ${file}`)
      return null
    }
    return readFile(path.join(directory, file), 'utf8')
  }

  for (const file of routeEntries) {
    const source = await readRequired(file)
    if (source === null) continue
    pagesChecked += 1
    const route = file === 'index.html' ? 'home' : file.replace(/\/index\.html$/, '')
    const expected = getPageSeo(route, { base, origin })
    const canonical = route === 'home' ? homeUrl : `${homeUrl}${route}/`
    const documentFail = (message) => fail(`${file}: ${message}`)
    const head = /<head\b[^>]*>([\s\S]*?)<\/head>/i.exec(source)?.[1]
    if (!head) {
      documentFail('missing HTML head')
      continue
    }
    const scripts = [...head.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)]
    const html = head.replace(/<!--[\s\S]*?-->/g, '').replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, '')
    const tags = [...html.matchAll(/<(meta|link)\b([^>]*)>/gi)].map((match) => ({ tag: match[1].toLowerCase(), attrs: attributes(match[2]) }))
    const metas = (key, value) => tags.filter(({ tag, attrs }) => tag === 'meta' && attrs[key]?.toLowerCase() === value)
    const singleMeta = (key, name, expectedValue) => {
      const found = metas(key, name)
      if (found.length !== 1 || !found[0].attrs.content?.trim()) {
        documentFail(`expected one nonempty ${name} meta tag`)
        return
      }
      if (expectedValue !== undefined && found[0].attrs.content !== expectedValue) documentFail(`${name} does not match this route`)
      return found[0].attrs.content
    }
    const titles = [...html.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title\s*>/gi)]
    if (titles.length !== 1 || !titles[0][1].trim() || decodeEntities(titles[0][1]) !== expected.title) {
      documentFail('expected one nonempty title matching this route')
    }
    singleMeta('name', 'description', expected.description)
    const robots = singleMeta('name', 'robots')
    const expectedRobots = expected.indexable ? ['index', 'follow', 'max-image-preview:large'] : ['noindex', 'follow']
    const actualRobots = robots?.toLowerCase().split(',').map((value) => value.trim()).sort()
    if (JSON.stringify(actualRobots) !== JSON.stringify(expectedRobots.sort())) {
      documentFail(`robots must be ${expectedRobots.join(',')} for this route`)
    }
    for (const { attrs } of tags.filter(({ tag, attrs }) => tag === 'meta' && /^(?:googlebot|bingbot)$/i.test(attrs.name || ''))) {
      if (/\b(?:noindex|nofollow|none)\b/i.test(attrs.content || '')) documentFail(`${attrs.name} must not override the route crawl policy`)
    }
    const canonicals = tags.filter(({ tag, attrs }) => tag === 'link' && attrs.rel?.toLowerCase().split(/\s+/).includes('canonical'))
    if (canonicals.length !== 1) documentFail(`expected exactly one canonical link; found ${canonicals.length}`)
    else if (canonicals[0].attrs.href !== canonical) documentFail(`canonical must be the absolute HTTPS URL ${canonical}`)

    for (const [name, value] of Object.entries({ title: expected.title, description: expected.description, url: canonical,
      image: expected.image, 'image:secure_url': expected.image, 'image:type': expected.imageType,
      'image:width': String(expected.imageWidth), 'image:height': String(expected.imageHeight),
      'image:alt': expected.imageAlt, site_name: expected.siteName, type: 'website', locale: 'pt_BR' })) {
      singleMeta('property', `og:${name}`, value)
    }
    for (const [name, value] of Object.entries({ card: 'summary_large_image', title: expected.title,
      description: expected.description, image: expected.image, 'image:alt': expected.imageAlt })) {
      singleMeta('name', `twitter:${name}`, value)
    }
    const image = singleImageUrl(expected.image)
    if (image && !fileSet.has(image)) documentFail(`sharing image is missing from artifact: ${expected.image}`)
    else if (image) {
      if (!imageCache.has(image)) {
        try {
          imageCache.set(image, webpDimensions(await readFile(path.join(directory, image))))
        } catch (error) {
          imageCache.set(image, { error: error.message })
        }
      }
      const dimensions = imageCache.get(image)
      if (dimensions.error) documentFail(`${image}: ${dimensions.error}`)
      else if (dimensions.width !== expected.imageWidth || dimensions.height !== expected.imageHeight) {
        documentFail(`${image}: sharing image must be ${expected.imageWidth}x${expected.imageHeight}; found ${dimensions.width}x${dimensions.height}`)
      }
    }

    function singleImageUrl(value) {
      let url
      try { url = new URL(value) } catch {
        documentFail('sharing image must be an absolute HTTPS URL')
        return
      }
      if (url.protocol !== 'https:' || url.origin !== origin || !url.pathname.startsWith(base) || url.search || url.hash) {
        documentFail(`sharing image must use origin ${origin} and base ${base}`)
        return
      }
      try {
        return decodeURIComponent(url.pathname.slice(base.length))
      } catch {
        documentFail('sharing image has an invalid encoded pathname')
      }
    }

    const websites = []
    for (const match of scripts) {
      if (attributes(match[1]).type?.toLowerCase() !== 'application/ld+json') continue
      try {
        const data = JSON.parse(match[2])
        const entries = Array.isArray(data) ? data : [data, ...(Array.isArray(data?.['@graph']) ? data['@graph'] : [])]
        websites.push(...entries.filter((entry) => entry?.['@type'] === 'WebSite'
          || (Array.isArray(entry?.['@type']) && entry['@type'].includes('WebSite'))))
      } catch {
        documentFail('invalid JSON-LD')
      }
    }
    if (websites.length !== (route === 'home' ? 1 : 0)) documentFail(`expected ${route === 'home' ? 'one' : 'no'} WebSite JSON-LD block`)
    for (const data of websites) {
      if (data['@context'] !== 'https://schema.org' || data.name !== expected.siteName || data.url !== canonical || data.inLanguage !== 'pt-BR') {
        documentFail('WebSite JSON-LD identity, URL or language does not match the site')
      }
      for (const property of ['potentialAction', 'address', 'aggregateRating', 'review', 'legalName']) {
        if (property in data) documentFail(`WebSite JSON-LD must not invent ${property}`)
      }
    }
  }

  const robots = await readRequired('robots.txt')
  if (robots !== null) checkRobots(robots, { base, origin, files, fail })
  const sitemap = await readRequired('sitemap.xml')
  if (sitemap !== null) {
    const routes = ['home', ...Object.keys(contentPages).filter((route) => contentPages[route].indexable)]
    checkSitemap(sitemap, routes.map((route) => getPageSeo(route, { base, origin }).canonical), fail)
  }
  if (errors.size) throw new Error(`SEO verification failed:\n${[...errors].map((error) => `- ${error}`).join('\n')}`)
  return { base, origin, pagesChecked }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = await checkSeo({ base: process.env.WEB_BASE_PATH || '/', origin: process.env.WEB_SITE_ORIGIN || DEFAULT_SITE_ORIGIN })
    process.stdout.write(`SEO verified for ${result.origin}${result.base}: ${result.pagesChecked} HTML entries, robots and sitemap.\n`)
  } catch (error) {
    process.stderr.write(`${error.message}\n`)
    process.exitCode = 1
  }
}
