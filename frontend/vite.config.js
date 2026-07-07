import {defineConfig, transformWithEsbuild} from 'vite'
import react from '@vitejs/plugin-react'

const jsxInJsFiles = () => ({
  name: 'jsx-in-js-files',
  enforce: 'pre',
  async transform(code, id) {
    if (id.includes('/src/') && id.endsWith('.js')) {
      return transformWithEsbuild(code, id, {
        loader: 'jsx',
        jsx: 'automatic',
      })
    }

    return null
  },
})

export default defineConfig({
  plugins: [jsxInJsFiles(), react()],
  build: {
    outDir: 'dist'
  },
  optimizeDeps: {
    esbuildOptions: {
      jsx: 'automatic',
      loader: {
        '.js': 'jsx'
      }
    }
  }
})
