// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';
import vue from '@astrojs/vue';
import react from '@astrojs/react';
// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  adapter: cloudflare(),
  integrations: [
    vue(),
    react(), // 2. Add React here
  ],
});
