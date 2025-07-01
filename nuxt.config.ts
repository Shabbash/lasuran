


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
    // legacy: false,                // Use Composition API instead of legacy mode
    // globalInjection: true,        // Allow global usage of $t() in templates
    // defaultLocale: 'en',          // Default locale
    skipSettingLocaleOnNavigate: true,
    locales: [
      {
        code: 'ar',               // Locale code
        // iso: 'ar-EG',             // ISO code
        name: 'Arabic',           // Display name
        file: 'ar.json',          // Translation file
        dir: 'rtl'                // Text direction
      },
      {
        code: 'en',
        // iso: 'en-US',
        name: 'English',
        file: 'en.json',
        dir: 'ltr'
      }
    ],
    
    // lazy: true,                   // Lazy load locale files
    langDir: 'locales',           // Directory for language files
    // langDir: resolve(__dirname, 'locales'), // ✅ safer & consistent
    // detectBrowserLanguage: false  // Disable automatic language detection
  }
})
