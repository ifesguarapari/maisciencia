import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

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
      for (const route of ['login', 'feira']) {
        const directory = resolve(outputDirectory, route)
        await mkdir(directory, { recursive: true })
        await writeFile(resolve(directory, 'index.html'), entry.source)
      }
    },
  }
}
