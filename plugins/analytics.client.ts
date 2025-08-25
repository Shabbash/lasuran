import { defineNuxtPlugin } from '#app'
import * as A from '~/utils/analytics'

export default defineNuxtPlugin(() => {
  if (process.client || window) {
    (window as any).$analytics = A

    try {
      // ✅ Facebook Pixel
      !(function (f: any, b, e, v, n?, t?, s?) {
        if (f.fbq) return
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
        }
        if (!f._fbq) f._fbq = n
        n.push = n
        n.loaded = true
        n.version = '2.0'
        n.queue = []
        t = b.createElement(e)
        t.async = true
        t.src = v
        s = b.getElementsByTagName(e)[0]
        s.parentNode.insertBefore(t, s)
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
      window.fbq('init', '3713691135428049')
      window.fbq('track', 'PageView')

      // ✅ TikTok Pixel
      !(function (w: any, d, t) {
        w.TiktokAnalyticsObject = t
        const ttq = (w[t] = w[t] || [])
        ttq.methods = [
          'page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie'
        ]
        ttq.setAndDefer = function (t: any, e: any) {
          t[e] = function () {
            t.push([e].concat(Array.prototype.slice.call(arguments, 0)))
          }
        }
        for (let i = 0; i < ttq.methods.length; i++) {
          ttq.setAndDefer(ttq, ttq.methods[i])
        }
        ttq.instance = function (t: any) {
          const e = ttq._i[t] || []
          for (let i = 0; i < ttq.methods.length; i++) {
            ttq.setAndDefer(e, ttq.methods[i])
          }
          return e
        }
        ttq.load = function (e: any, n?: any) {
          const i = 'https://analytics.tiktok.com/i18n/pixel/events.js'
          ttq._i = ttq._i || {}
          ttq._i[e] = []
          ttq._i[e]._u = i
          ttq._t = ttq._t || {}
          ttq._t[e] = +new Date()
          ttq._o = ttq._o || {}
          ttq._o[e] = n || {}
          const a = document.createElement('script')
          a.type = 'text/javascript'
          a.async = true
          a.src = i + '?sdkid=' + e + '&lib=' + t
          const s = document.getElementsByTagName('script')[0]
          s.parentNode.insertBefore(a, s)
        }
        ttq.load('D2DEUUJC77U67ECJ7ON0')
        ttq.page()
      })(window, document, 'ttq')

      // ✅ Snapchat Pixel
      !(function (e: any, t) {
        e.snaptr = e.snaptr || function () {
          (e.snaptr.q = e.snaptr.q || []).push(arguments)
        }
        const n = t.createElement('script')
        n.async = true
        n.src = 'https://sc-static.net/scevent.min.js'
        const a = t.getElementsByTagName('script')[0]
        a.parentNode.insertBefore(n, a)
      })(window, document)
      window.snaptr('init', 'e9775f66-080f-4728-9338-674b9ee379a7')
      window.snaptr('track', 'PAGE_VIEW')
    }catch (err) {
      console.error(err);
    }
  }

  return { provide: { analytics: A } }
})
