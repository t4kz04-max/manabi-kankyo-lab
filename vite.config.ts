import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    rolldownOptions: {
      output: {
        // 画面ごとの分割（src/app/routes.tsx の lazy）に加えて、
        // 更新の少ないライブラリとアイコンをそれぞれ1つのファイルにまとめる
        codeSplitting: {
          groups: [
            {
              name: 'vendor',
              test: /node_modules[/\\](react|react-dom|scheduler|react-router)[/\\]/,
            },
            { name: 'icons', test: /node_modules[/\\]lucide-react[/\\]/ },
          ],
        },
      },
    },
  },
})
