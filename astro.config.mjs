// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  site: 'https://app.erpgarzaleal.com',
  base:"/ejemplo/", // Replace with your actual domain
  integrations: [
    sitemap(),
    mdx(),
    preact(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
