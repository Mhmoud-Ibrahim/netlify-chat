import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa' // 1. استيراد الإضافة

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // 2. إعداد الـ PWA
    VitePWA({
      registerType: 'autoUpdate', // تحديث التطبيق تلقائياً عند وجود نسخة جديدة
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Chat Now App',
        short_name: 'ChatNow',
        description: 'تطبيق دردشة فوري متطور',
        theme_color: '#0d6efd', // لون الـ Header في أندرويد (طابق لون البرايمري عندك)
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        display: 'standalone', 
        orientation: 'portrait'
      }
    })
  ],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  build: {
    chunkSizeWarningLimit: 1000,
  },
})
