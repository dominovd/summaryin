// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Placeholder pages excluded from the sitemap until they get real content.
// When you fill a page in, remove it from this list AND drop its `noindex` prop.
const PLACEHOLDER_PATHS = ['/about/', '/contact/', '/terms/', '/privacy/'];

// https://astro.build/config
export default defineConfig({
  site: 'https://summaryin.com',
  output: 'static',
  trailingSlash: 'always',
  build: {
    inlineStylesheets: 'auto',
  },
  integrations: [
    sitemap({
      filter: (page) => !PLACEHOLDER_PATHS.some((p) => page.endsWith(p)),
    }),
  ],
});
