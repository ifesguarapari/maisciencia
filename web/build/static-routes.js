import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { routeEntries } from '../src/pages.js'
import { getPageSeo } from '../src/seo.js'
import { renderPageMetadata, renderRobots, renderSitemap } from './seo.js'
import { renderPageContent } from './page-content.js'

export function staticRouteEntries(options = {}) {
  let outputDirectory
  return {
    name: 'static-route-entries',
    apply: 'build',
    configResolved(config) {
      outputDirectory = resolve(config.root, config.build.outDir)
    },
    async writeBundle(_options, bundle) {
      const entry = bundle['index.html']
      if (!entry || entry.type !== 'asset') {
        throw new Error('The compiled index.html is required for static route entries')
      }
      for (const routeEntry of routeEntries) {
        if (routeEntry === 'index.html') continue
        const filename = resolve(outputDirectory, routeEntry)
        await mkdir(dirname(filename), { recursive: true })
        const route = routeEntry.slice(0, -'/index.html'.length)
        const metadata = getPageSeo(route, options)
        await writeFile(filename, renderPageMetadata(renderPageContent(entry.source, route, metadata.base), metadata))
      }
      await writeFile(resolve(outputDirectory, 'robots.txt'), renderRobots(options))
      await writeFile(resolve(outputDirectory, 'sitemap.xml'), renderSitemap(options))
    },
  }
}
