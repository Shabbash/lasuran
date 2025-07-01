
import ar from '~/locales/ar.json'
import en from '~/locales/en.json'
export default defineI18nConfig(() => {
    return {
        legacy: false,
        locale: 'en',
        messages: { en, ar },
        globalInjection: true,        // Allow global usage of $t() in templates
        defaultLocale: 'en',          // Default locale
        skipSettingLocaleOnNavigate: true,
        locales: [
            {
                code: 'ar',               // Locale code
                iso: 'ar-EG',             // ISO code
                name: 'Arabic',           // Display name
                file: 'ar.json',          // Translation file
                dir: 'rtl'                // Text direction
            },
            {
                code: 'en',
                iso: 'en-US',
                name: 'English',
                file: 'en.json',
                dir: 'ltr'
            }
        ],
        lazy: false,                   // Lazy load locale files
        langDir: './locales',           // Directory for language files
        // langDir: resolve(__dirname, 'locales'), // ✅ safer & consistent
        detectBrowserLanguage: false  // Disable automatic language detection
    }
})

/*

  // ✅ Nuxt i18n configuration
  i18n: {
    legacy: false,                // Use Composition API instead of legacy mode
    globalInjection: true,        // Allow global usage of $t() in templates
    defaultLocale: 'en',          // Default locale
    skipSettingLocaleOnNavigate: true,
    locales: [
      {
        code: 'ar',               // Locale code
        iso: 'ar-EG',             // ISO code
        name: 'Arabic',           // Display name
        file: 'ar.json',          // Translation file
        dir: 'rtl'                // Text direction
      },
      {
        code: 'en',
        iso: 'en-US',
        name: 'English',
        file: 'en.json',
        dir: 'ltr'
      }
    ],
    lazy: true,                   // Lazy load locale files
    langDir: '../locales',           // Directory for language files
    // langDir: resolve(__dirname, 'locales'), // ✅ safer & consistent
    detectBrowserLanguage: false  // Disable automatic language detection
  }



*/