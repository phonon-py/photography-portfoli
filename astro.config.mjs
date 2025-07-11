import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [
    tailwind(),
    sitemap(),
  ],
  site: 'https://phonon-py.github.io',
  base: import.meta.env.PROD ? '/photography-portfoli' : '/',
  output: 'static',
});