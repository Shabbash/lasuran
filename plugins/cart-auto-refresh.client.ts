// plugins/cart-auto-refresh.client.ts
import { useCart } from '~/stores/cart'

export default defineNuxtPlugin(() => {
  if (process.client) {
    const cart = useCart()

    window.addEventListener('storage', (e) => {
      // Another tab asked to refresh the cart
      if (e.key === 'cart:refresh') {
        // Quiet refetch to sync totals & items
        cart.fetchCart(
          { promo_code: cart.params?.promo_code ?? null, gift_card: cart.params?.gift_card ?? null } as any,
          { disableLoading: true } as any
        )
      }
    })
  }
})
