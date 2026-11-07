import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { routeEntries } from '../src/pages.js'

export function staticRouteEntries() {
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
        await writeFile(filename, entry.source)
      }
    },
  }
}
