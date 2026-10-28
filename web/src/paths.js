export function normalizeBasePath(value = '/') {
  if (!/^(?:\/[a-zA-Z0-9._~-]+)*\/?$/.test(value)
    || value.split('/').some((segment) => segment === '.' || segment === '..')) {
    throw new Error('WEB_BASE_PATH must be an absolute URL path, such as / or /maisciencia/')
  }
  return `${value.replace(/\/$/, '')}/`
}

export function publicUrl(path, base) {
  return `${base}${path.replace(/^\//, '')}`
}

export function getPageRoute(pathname, base) {
  if (pathname === base.slice(0, -1)) return 'home'
  if (!pathname.startsWith(base)) return null
  const route = pathname.slice(base.length).replace(/\/$/, '')
  return ['', 'login', 'feira'].includes(route) ? route || 'home' : null
}

export function apiNavigationDenylist(base) {
  const apiPath = publicUrl('api', base).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return [/^\/api(?:[/?]|$)/, new RegExp(`^${apiPath}(?:[/?]|$)`)]
}
