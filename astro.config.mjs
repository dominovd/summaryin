// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://summaryin.com',
  output: 'static',
  // Pages stay static; only routes with `prerender = false` (src/pages/api) run as Vercel functions.
  adapter: vercel(),
  trailingSlash: 'always',
  build: {
    inlineStylesheets: 'auto',
  },
  integrations: [
    sitemap(),
  ],
});
