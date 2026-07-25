import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: './tsconfig.json',
      include: ['src'],
      cleanVueFileName: true,
    }),
  ],
  build: {
    lib: {
      entry: {
        index: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
        nuxt: fileURLToPath(new URL('./src/nuxt.ts', import.meta.url)),
      },
      formats: ['es'],
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: ['vue', '@nuxt/kit', 'node:fs', 'node:url'],
      output: {
        assetFileNames: 'prelo.[ext]',
      },
    },
  },
})
