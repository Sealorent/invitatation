// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'

const port = Number(process.env.PORT || 3000)
const mainCssPath = fileURLToPath(new URL('./assets/css/main.css', import.meta.url))

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  devServer: {
    port,
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    'nuxt-icon',
  ],

  css: [mainCssPath],

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'wedding-invitation-secret-key-2025',
    databaseUrl: process.env.DATABASE_URL || '',
    gdriveCredentials: process.env.GDRIVE_CREDENTIALS || '',
    gdriveFolderId: process.env.GDRIVE_FOLDER_ID || '',
    public: {
      appUrl: process.env.NUXT_PUBLIC_APP_URL || `http://localhost:${port}`,
    }
  },

  app: {
    head: {
      title: 'Wedding Invitation Platform',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Create beautiful digital wedding invitations' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap'
        }
      ]
    },
  },

  nitro: {
    experimental: {
      wasm: true
    }
  },

  typescript: {
    strict: false,
  },

  vite: {
    optimizeDeps: {
      exclude: ['@prisma/client']
    }
  }
})
