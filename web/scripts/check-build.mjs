import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const origin = 'https://build.invalid'
const routeEntries = ['index.html', 'login/index.html', 'feira/index.html']
const staticExtension = /\.(?:html|css|js|mjs|svg|png|jpe?g|webp|avif|gif|ico|woff2?|webmanifest)(?:[?#].*)?$/i
const strings = /(["'`])((?:\\.|(?!\1)[^\\\r\n])*)\1/g

async function listFiles(directory, prefix = '') {
  const entries = await readdir(path.join(directory, prefix), { withFileTypes: true })
  const nested = await Promise.all(entries.map(async (entry) => {
    const name = path.posix.join(prefix, entry.name)
    return entry.isDirectory() ? listFiles(directory, name) : [name]
  }))
  return nested.flat()
}

function normalizeBase(value) {
  if (!value.startsWith('/') || value.startsWith('//') || /[?#\\]/.test(value)) {
    throw new Error('WEB_BASE_PATH must be an absolute pathname such as / or /maisciencia/.')
  }
  const base = value.endsWith('/') ? value : `${value}/`
  if (new URL(base, origin).pathname !== base) {
    throw new Error('WEB_BASE_PATH must not contain path traversal.')
  }
  return base
}

export async function checkBuild({ directory = 'dist', base = '/' } = {}) {
  base = normalizeBase(base)
  directory = path.resolve(directory)
  const files = new Set(await listFiles(directory))
  const errors = new Set()
  let referencesChecked = 0
  const fail = (message) => errors.add(message)
  const documentUrl = (file) => new URL(`${base}${file}`, origin)

  function resolveReference(reference, file) {
    reference = reference.trim().replaceAll('&amp;', '&')
    if (!reference || reference.startsWith('#') || /^(?:data:|mailto:|tel:|javascript:)/i.test(reference)) return
    let url
    try {
      url = new URL(reference, documentUrl(file))
    } catch {
      fail(`${file}: invalid URL ${reference}`)
      return
    }
    if (url.origin !== origin) return
    referencesChecked += 1
    if (!url.pathname.startsWith(base)) {
      fail(`${file}: URL escapes base ${base}: ${reference}`)
      return
    }
    let relative
    try {
      relative = decodeURIComponent(url.pathname.slice(base.length))
    } catch {
      fail(`${file}: invalid encoded pathname ${reference}`)
      return
    }
    if (relative.split('/').includes('..') || relative.includes('\\')) {
      fail(`${file}: URL escapes artifact directory: ${reference}`)
      return
    }
    const target = relative || 'index.html'
    const entry = target.endsWith('/') ? `${target}index.html` : target
    if (!files.has(entry) && !files.has(`${entry}/index.html`)) {
      fail(`${file}: missing resource ${reference}`)
    }
    return url
  }

  for (const entry of [...routeEntries, 'manifest.webmanifest', 'sw.js']) {
    if (!files.has(entry)) fail(`Missing required build entry: ${entry}`)
  }

  let registrations = 0
  for (const file of files) {
    if (!/\.(?:html|css|js|mjs|svg)$/.test(file)) continue
    const source = await readFile(path.join(directory, file), 'utf8')
    if (source.includes('%BASE_URL%')) fail(`${file}: unresolved BASE_URL placeholder`)

    if (/\.(?:html|svg)$/.test(file)) {
      for (const tag of source.matchAll(/<[a-z][^>]*>/gi)) {
        for (const attribute of tag[0].matchAll(/\s(?:href|src)\s*=\s*(["'])(.*?)\1/gi)) {
          const url = resolveReference(attribute[2], file)
          if (/^<link\b/i.test(tag[0]) && /\brel=["']manifest["']/i.test(tag[0]) && url?.href !== `${origin}${base}manifest.webmanifest`) {
            fail(`${file}: manifest link does not match ${base}manifest.webmanifest`)
          }
        }
      }
      if (file.endsWith('.html') && !/<link\b(?=[^>]*\brel=["']manifest["'])[^>]*>/i.test(source)) {
        fail(`${file}: missing manifest link`)
      }
    }

    if (/\.(?:css|html|svg)$/.test(file)) {
      for (const match of source.matchAll(/\burl\(\s*(["']?)(.*?)\1\s*\)/gi)) {
        resolveReference(match[2], file)
      }
      for (const match of source.matchAll(/@import\s+(["'])(.*?)\1/gi)) {
        resolveReference(match[2], file)
      }
    }

    if (/\.(?:js|mjs)$/.test(file)) {
      for (const match of source.matchAll(strings)) {
        const reference = match[2]
        if (reference.includes('${') || reference.includes('\\')) continue
        if (/^(?:\/|\.\.?\/)/.test(reference) && staticExtension.test(reference)) {
          resolveReference(reference, file)
        }
        if (/(?:^|\/)sw\.js$/.test(reference)) {
          const options = source.slice(match.index + match[0].length, match.index + match[0].length + 180)
          const scope = /^\s*,\s*\{[^}]*?\bscope\s*:\s*(["'`])([^"'`]+)\1/.exec(options)
          if (scope) {
            registrations += 1
            const registrationUrl = resolveReference(reference, file)
            const scopeUrl = new URL(scope[2], documentUrl(file))
            if (registrationUrl?.pathname !== `${base}sw.js` || scopeUrl.href !== `${origin}${base}`) {
              fail(`${file}: service worker registration or scope does not match ${base}`)
            }
          }
        }
      }
    }
  }
  if (!registrations) fail('Missing service worker registration with an explicit scope in built JavaScript')

  if (files.has('manifest.webmanifest')) {
    try {
      const manifest = JSON.parse(await readFile(path.join(directory, 'manifest.webmanifest'), 'utf8'))
      for (const field of ['id', 'start_url', 'scope']) {
        if (typeof manifest[field] !== 'string' || new URL(manifest[field], documentUrl('manifest.webmanifest')).href !== `${origin}${base}`) {
          fail(`manifest.webmanifest: ${field} does not match ${base}`)
        }
      }
      if (!Array.isArray(manifest.icons) || !manifest.icons.length) fail('manifest.webmanifest: missing icons')
      else for (const icon of manifest.icons) {
        if (typeof icon.src !== 'string') fail('manifest.webmanifest: icon is missing src')
        else resolveReference(icon.src, 'manifest.webmanifest')
      }
    } catch (error) {
      fail(`manifest.webmanifest: ${error.message}`)
    }
  }

  if (files.has('sw.js')) {
    const worker = await readFile(path.join(directory, 'sw.js'), 'utf8')
    const cached = new Set()
    for (const match of worker.matchAll(/\burl\s*:\s*(["'`])([^"'`]+)\1/g)) {
      const url = resolveReference(match[2], 'sw.js')
      if (!url) continue
      cached.add(url.pathname)
      if (/^\/api(?:\/|$)/.test(url.pathname) || url.pathname.startsWith(`${base}api/`) || url.pathname === `${base}api`) {
        fail(`sw.js: API URL must not be precached: ${match[2]}`)
      }
    }
    for (const entry of routeEntries) {
      if (!cached.has(`${base}${entry}`)) fail(`sw.js: route is missing from precache: ${entry}`)
    }
  }

  if (errors.size) throw new Error(`Build verification failed:\n${[...errors].map((error) => `- ${error}`).join('\n')}`)
  return { base, filesChecked: files.size, referencesChecked }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = await checkBuild({ base: process.env.WEB_BASE_PATH || '/' })
    process.stdout.write(`Build verified for ${result.base}: ${result.filesChecked} files, ${result.referencesChecked} internal references.\n`)
  } catch (error) {
    process.stderr.write(`${error.message}\n`)
    process.exitCode = 1
  }
}
