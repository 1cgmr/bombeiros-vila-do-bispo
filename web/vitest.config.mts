import {fileURLToPath} from 'node:url'

import {defineConfig} from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    env: {
      NEXT_PUBLIC_SANITY_PROJECT_ID: 'n3esjk8x',
      NEXT_PUBLIC_SANITY_DATASET: 'production',
    },
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
