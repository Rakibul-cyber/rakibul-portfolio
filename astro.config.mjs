// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// GitHub Pages serves this repository from the `gh-pages` branch under a sub-path,
// so every internal URL must be prefixed with `base` (see src/lib/url.ts).
export default defineConfig({
  site: 'https://rakibul-cyber.github.io',
  base: '/rakibul-portfolio',
  output: 'static',
  trailingSlash: 'ignore',
  // Astro 7 defaults to JSX-style whitespace collapsing, which can glue inline
  // elements together; classic HTML compression keeps prose spacing intact.
  compressHTML: true,
  build: {
    format: 'directory',
    // Small pages: inlining the stylesheet removes a render-blocking request.
    inlineStylesheets: 'always',
  },
  integrations: [
    sitemap({
      // The privacy page is noindex and stays out of the sitemap.
      filter: (page) => !/\/privacy\/?$/.test(page),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
