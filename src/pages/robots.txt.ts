import type { APIRoute } from 'astro';

// Points crawlers at the sitemap under the deploy base path.
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL(
    `${import.meta.env.BASE_URL.replace(/\/?$/, '/')}sitemap-index.xml`,
    site,
  );
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap.href}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
