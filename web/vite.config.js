import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { apiNavigationDenylist, normalizeBasePath, publicUrl } from './src/paths.js'
import { staticRouteEntries } from './build/static-routes.js'
import { deferredPageStyles } from './build/deferred-styles.js'

const base = normalizeBasePath(process.env.WEB_BASE_PATH || '/')

export default defineConfig({
  base,
  plugins: [
    tailwindcss(),
    deferredPageStyles(),
    staticRouteEntries(),
    VitePWA({
      registerType: 'prompt',
      scope: base,
      includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png'],
      manifest: {
        id: base,
        name: 'Ifes Mais Ciência na Escola',
        short_name: 'Ifes Mais Ciência',
        description: 'Ciência, tecnologia e inovação aproximando escolas e comunidades.',
        lang: 'pt-BR',
        theme_color: '#101114',
        background_color: '#101114',
        display: 'standalone',
        start_url: base,
        scope: base,
        icons: [
          { src: publicUrl('icons/pwa-192x192.png', base), sizes: '192x192', type: 'image/png' },
          { src: publicUrl('icons/pwa-512x512.png', base), sizes: '512x512', type: 'image/png' },
          { src: publicUrl('icons/pwa-maskable-512x512.png', base), sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webp,woff2}'],
        navigateFallbackDenylist: apiNavigationDenylist(base),
      },
    }),
  ],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})
