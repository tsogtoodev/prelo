import { fileURLToPath, URL } from 'node:url'

export default defineNuxtConfig({
  modules: ['../src/nuxt'],
  alias: {
    '@tsogtoodev/prelo': fileURLToPath(new URL('../src/index.ts', import.meta.url)),
  },
  devtools: { enabled: false },
  compatibilityDate: '2026-07-01',
})
