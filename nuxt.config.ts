
import { resolve } from 'path'


// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2024-11-01',

  // ✅ Register Nuxt modules
  modules: [
    '@pinia/nuxt',
    'pinia-plugin-persistedstate',
    '@nuxt/ui',
    '@nuxtjs/i18n' // Enable Nuxt i18n module
  ],

  // ✅ Global CSS files
  css: [
    '~/app/assets/css/style.css',
    '~/app/assets/css/fonts.css',
  ],

  // ✅ Enable Nuxt Devtools
  devtools: { enabled: true },

  // ✅ Tailwind CSS configuration path
  tailwindcss: {
    configPath: '~/tailwind.config.js',
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
    {
      code: 'ar',
      name: 'Arabic',
      file: 'ar.json',
      dir: 'rtl'
    },
    {
      code: 'en',
      name: 'English',
      file: 'en.json',
      dir: 'ltr'
    }
  ]
}

})
