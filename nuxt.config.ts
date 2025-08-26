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

  // ✅ Global title template (brand suffix/prefix)
  app: {
    head: {
      // Example result: "Services - Lazuran" or "الخدمات - Lazuran"
      titleTemplate: (title?: string) =>
        title ? `${title} - Lazuran` : 'Lazuran'
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
