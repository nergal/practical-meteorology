import { defineConfig } from 'vite'
import atlasContent from './scripts/content.mjs'

export default defineConfig({
  base: './',
  plugins: [atlasContent()],
})
