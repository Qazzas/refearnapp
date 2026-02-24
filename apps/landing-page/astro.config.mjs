// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  vite: {
    // @ts-ignore
    plugins: [tailwindcss()],
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  },

  adapter: cloudflare(),
  integrations: [vue()],
});
