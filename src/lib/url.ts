/**
 * Prefix an internal path with the deploy base (`/rakibul-portfolio/`).
 * Every internal href/src must go through this helper: GitHub Pages serves the
 * site from a sub-path, so a bare `/foo` would point outside the site.
 *
 * - `withBase('/')`          -> '/rakibul-portfolio/'
 * - `withBase('privacy/')`   -> '/rakibul-portfolio/privacy/'
 * - `withBase('/#work')`     -> '/rakibul-portfolio/#work'
 * External URLs, `mailto:`, `tel:` and in-page `#hash` links are returned unchanged.
 */
export function withBase(path: string): string {
  if (/^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(path)) return path;
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const clean = path.replace(/^\/+/, '');
  return `${base}/${clean}`;
}

/** Absolute URL on the production origin, used for canonical and Open Graph tags. */
export function absoluteUrl(path: string, site: URL | undefined): string {
  const origin = site?.origin ?? 'https://rakibul-cyber.github.io';
  return new URL(withBase(path), origin).href;
}
