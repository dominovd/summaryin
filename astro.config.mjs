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
    // /chrome-extension/ is noindex until the Web Store listing URL is set, so it stays out of the sitemap too.
    sitemap({
      filter: (page) => Boolean(process.env.PUBLIC_CHROME_STORE_URL) || !page.includes('/chrome-extension/'),
    }),
  ],
});
