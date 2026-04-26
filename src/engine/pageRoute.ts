/**
 * Single canonical form: leading slash, no trailing slash, home = "/".
 * Collapses duplicate slashes (e.g. //about) so URL and DB always align.
 */
export function normalizePageRoute(route: string | null | undefined): string {
  if (route == null) return '/'
  let t = String(route).trim()
  if (t === '' || t === '/') return '/'
  t = t.replace(/^\/+/, '/')
  t = t.replace(/\/+$/, '') || '/'
  if (t === '/') return '/'
  if (!t.startsWith('/')) t = `/${t}`
  return t
}
