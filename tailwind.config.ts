import type { Config } from 'tailwindcss'
import rtl from 'tailwindcss-rtl' // ✅ RTL plugin import

const config: Config = {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './app.vue',
  ],
  safelist: [
    'max-w-[539px]',
    'max-w-[638px]',
    'max-w-[800px]'
  ],
  theme: {
    extend: {
      fontFamily: {
        tajawal: ['Tajawal', 'sans-serif'],
        klein: ['Klein', 'sans-serif'],
        kleinCondensed: ['Klein Condensed', 'sans-serif'],
      },
    },
  },
  plugins: [rtl()] // ✅ Enable RTL plugin
}

export default config
