import { contentPages } from '../src/pages.js'
import { getPageRoute } from '../src/paths.js'
import { getPageSeo, getSeoTags } from '../src/seo.js'
import { renderPageContent } from './page-content.js'

const metadataBlock = /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/g
const escapeMarkup = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character])

export function renderPageMetadata(html, metadata) {
  if ([...html.matchAll(metadataBlock)].length !== 1) {
    throw new Error('Exactly one SEO metadata block is required in the HTML document.')
  }
  const tags = getSeoTags(metadata).map(({ tag, attrs, text = '' }) => {
    const attributes = Object.entries(attrs).map(([name, value]) => `${name}="${escapeMarkup(value)}"`).join(' ')
    if (['meta', 'link'].includes(tag)) return `<${tag} ${attributes} />`
    const content = tag === 'script' ? text.replaceAll('<', '\\u003c') : escapeMarkup(text)
    return `<${tag} ${attributes}>${content}</${tag}>`
  })
  return html.replace(metadataBlock, () => `<!-- seo:start -->\n  ${tags.join('\n  ')}\n  <!-- seo:end -->`)
}

export function renderRobots(options = {}) {
  const home = getPageSeo('home', options)
  return `User-agent: *\nAllow: /\nSitemap: ${home.canonical}sitemap.xml\n`
}

export function renderSitemap(options = {}) {
  const routes = ['home', ...Object.keys(contentPages).filter((route) => contentPages[route].indexable)]
  const locations = routes.map((route) => `  <url><loc>${escapeMarkup(getPageSeo(route, options).canonical)}</loc></url>`).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${locations}\n</urlset>\n`
}

export function pageSeo(options = {}) {
  const home = getPageSeo('home', options)
  return {
    name: 'page-seo',
    transformIndexHtml: {
      order: 'post',
      handler(html, context) {
        const pathname = new URL(context.originalUrl || context.path, 'https://development.invalid').pathname
        const route = context.server ? getPageRoute(pathname, home.base) || 'home' : 'home'
        return renderPageMetadata(renderPageContent(html, route, home.base), getPageSeo(route, options))
      },
    },
  }
}
