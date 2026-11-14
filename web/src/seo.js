import { placeholderPages } from './pages.js'
import { normalizeBasePath } from './paths.js'

export const DEFAULT_SITE_ORIGIN = 'https://maisciencia.ifes.app.br'

export function seoNavigationDenylist(base = '/') {
  const prefix = normalizeBasePath(base).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return [new RegExp(`^${prefix}(?:robots\\.txt|sitemap\\.xml)(?:\\?.*)?$`)]
}

const siteName = 'Ifes Mais Ciência na Escola'
const homeTitle = `${siteName} | Educação científica no ES`
const homeDescription = 'Conheça o projeto Ifes Mais Ciência na Escola: educação científica, laboratórios maker e oficinas de tecnologia em escolas públicas do Espírito Santo.'

export function normalizeSiteOrigin(value = DEFAULT_SITE_ORIGIN) {
  let url
  try {
    url = new URL(value)
  } catch {
    throw new Error('WEB_SITE_ORIGIN must be an absolute HTTPS origin.')
  }
  if (url.protocol !== 'https:' || url.username || url.password
    || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('WEB_SITE_ORIGIN must be an HTTPS origin without credentials, path, query or fragment.')
  }
  return url.origin
}

export function getPageSeo(route = 'home', { base = '/', origin = DEFAULT_SITE_ORIGIN } = {}) {
  base = normalizeBasePath(base)
  origin = normalizeSiteOrigin(origin)
  const page = Object.hasOwn(placeholderPages, route) ? placeholderPages[route] : null
  if (route !== 'home' && !page) throw new Error(`Unknown SEO route: ${route}`)
  const indexable = route === 'home'
  return {
    route,
    base,
    origin,
    siteName,
    title: indexable ? homeTitle : `${page.title} | ${siteName}`,
    description: indexable ? homeDescription : page.description,
    canonical: `${origin}${base}${indexable ? '' : `${route}/`}`,
    robots: indexable ? 'index,follow,max-image-preview:large' : 'noindex,follow',
    indexable,
    image: `${origin}${base}icons/slide.webp`,
    imageType: 'image/webp',
    imageWidth: 750,
    imageHeight: 425,
    imageAlt: 'Ifes Mais Ciência na Escola: marcas do Ifes e Mais Ciência na Escola sobre uma ilustração de ciência e tecnologia',
  }
}

export function getSeoTags(metadata) {
  const meta = (kind, name, content) => ({
    tag: 'meta',
    attrs: { id: `seo-${name.replaceAll(':', '-')}`, [kind]: name, content },
  })
  const tags = [
    { tag: 'title', attrs: { id: 'seo-title' }, text: metadata.title },
    meta('name', 'description', metadata.description),
    meta('name', 'robots', metadata.robots),
    { tag: 'link', attrs: { id: 'seo-canonical', rel: 'canonical', href: metadata.canonical } },
    meta('property', 'og:type', 'website'),
    meta('property', 'og:locale', 'pt_BR'),
    meta('property', 'og:site_name', metadata.siteName),
    meta('property', 'og:title', metadata.title),
    meta('property', 'og:description', metadata.description),
    meta('property', 'og:url', metadata.canonical),
    meta('property', 'og:image', metadata.image),
    meta('property', 'og:image:secure_url', metadata.image),
    meta('property', 'og:image:type', metadata.imageType),
    meta('property', 'og:image:width', String(metadata.imageWidth)),
    meta('property', 'og:image:height', String(metadata.imageHeight)),
    meta('property', 'og:image:alt', metadata.imageAlt),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', metadata.title),
    meta('name', 'twitter:description', metadata.description),
    meta('name', 'twitter:image', metadata.image),
    meta('name', 'twitter:image:alt', metadata.imageAlt),
  ]
  if (metadata.indexable) {
    tags.push({
      tag: 'script',
      attrs: { id: 'seo-structured-data', type: 'application/ld+json' },
      text: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${metadata.canonical}#website`,
        name: metadata.siteName,
        alternateName: 'Ifes Mais Ciência',
        url: metadata.canonical,
        inLanguage: 'pt-BR',
        description: metadata.description,
      }),
    })
  }
  return tags
}

export function syncPageSeo(document, metadata) {
  // A service worker may return the home shell for another navigation route.
  for (const element of document.head.querySelectorAll('[id^="seo-"]')) element.remove()
  for (const descriptor of getSeoTags(metadata)) {
    const element = document.createElement(descriptor.tag)
    for (const [name, value] of Object.entries(descriptor.attrs)) element.setAttribute(name, value)
    if (descriptor.text) element.textContent = descriptor.text
    document.head.append(element)
  }
}
