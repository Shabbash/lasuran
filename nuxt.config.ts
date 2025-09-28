import { resolve } from 'path'

// Nuxt configuration file
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2024-11-01',

  // ✅ Register modules
  modules: [
    '@pinia/nuxt',
    'pinia-plugin-persistedstate',
    '@nuxt/ui',
    '@nuxtjs/i18n'
  ],

  // ✅ Global CSS files
  css: [
    '~/app/assets/css/style.css',
    '~/app/assets/css/fonts.css',
  ],

  // ✅ Enable Nuxt Devtools
  devtools: { enabled: true },

  // ✅ Tailwind CSS config
  tailwindcss: {
    configPath: '~/tailwind.config.js',
  },

  // ✅ App head: title template + favicons + social preview meta
  app: {
    head: {
      // Example result: "Services - Lazuran" or "الخدمات - Lazuran"
      titleTemplate: (title?: string) =>
        title ? `${title} - Lazuran` : 'Lazuran',

      // ===== Links (favicons & manifest) =====
      link: [
        // Standard favicon
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },

        // PNG favicons
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },

        // Apple Touch icon (for iOS home screen)
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },

        // PWA manifest
        { rel: 'manifest', href: '/site.webmanifest' },

        // Safari pinned tab (monochrome SVG)
        { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#A0576F' }
      ],

      // ===== Meta (theme color + Open Graph + Twitter) =====
      meta: [
        // Brand/theme colors
        { name: 'theme-color', content: '#A0576F' },
        { name: 'msapplication-TileColor', content: '#A0576F' },

        // Open Graph (for link previews: WhatsApp, Facebook, etc.)
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Lazuran' },
        { property: 'og:title', content: 'Lazuran' },
        { property: 'og:description', content: 'Beauty & Salon booking platform' },
        // This image should be 1200x630 for best previews
        { property: 'og:image', content: '/preview.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },

        // Optional: locale can be adjusted per route if needed
        { property: 'og:locale', content: 'en_US' },

        // Twitter Card (X)
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Lazuran' },
        { name: 'twitter:description', content: 'Beauty & Salon booking platform' },
        { name: 'twitter:image', content: '/preview.png' }
      ]
    }
  },

  // ✅ Nuxt i18n configuration
  i18n: {
    legacy: false,
    globalInjection: true,
    defaultLocale: 'en',
    skipSettingLocaleOnNavigate: true,
    lazy: true,
    langDir: resolve('./locales'),
    detectBrowserLanguage: false,
    vueI18n: './i18n.config.ts',
    locales: [
      { code: 'ar', name: 'Arabic', file: 'ar.json', dir: 'rtl' },
      { code: 'en', name: 'English', file: 'en.json', dir: 'ltr' }
    ]
  }
})
