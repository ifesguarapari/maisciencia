import { readFileSync } from 'node:fs'
import { isFairRoute, renderFairPage } from '../src/fair.js'

const fairTemplate = readFileSync(new URL('../src/fair.html', import.meta.url), 'utf8')

export function renderPageContent(html, route, base = '/') {
  if (!isFairRoute(route)) return html
  const marker = /<!-- page:start -->[\s\S]*?<!-- page:end -->/g
  if ([...html.matchAll(marker)].length !== 1) throw new Error('Exactly one page content block is required.')
  return html.replace(marker, () => `<!-- page:start -->${renderFairPage(fairTemplate, route, base)}<!-- page:end -->`)
    .replace('<body ', '<body class="fair-page" ')
    .replaceAll(`${base}images/background.webp`, `${base}images/feira/background.webp`)
    .replace('content="#101114"', 'content="#203445"')
}
