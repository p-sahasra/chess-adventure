import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: "Sahasra's Chess Adventure",
        short_name: 'Chess Adventure',
        description: 'An interactive chess learning app for Sahasra',
        theme_color: '#4a1d96',
        background_color: '#1a1a2e',
        display: 'standalone',
        scope: '/chess-adventure/',
        start_url: '/chess-adventure/',
        icons: [
          {
            src: 'icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: 'icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}']
      }
    })
  ],
  base: '/chess-adventure/',
})
