<template>
  <div class="w-full h-[75vh] rounded-[24px] overflow-hidden relative">
    <iframe v-if="finalUrl" :src="finalUrl" class="w-full h-full border-0"></iframe>
    <div v-else class="h-full grid place-items-center text-[#A0576F] px-6 text-center">
      <p>Missing or invalid payment URL.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, navigateTo } from '#imports'
import { useCart } from '~/stores/cart'
import { useApi } from '~/composables/useApi'

definePageMeta({ layout: 'blank' })

const route = useRoute()
const cart = useCart()

// Safely decode URL (handles double encoding)
function decodeSmart(input: string) {
  let s = input || ''
  try {
    const once = decodeURIComponent(s)
    if (/%[0-9A-Fa-f]{2}/.test(once)) return decodeURIComponent(once)
    return once
  } catch { return s }
}

const raw = (route.query.url as string) || ''
const finalUrl = computed(() => decodeSmart(raw))

let timer: any = null

// Helper: refresh cart in this tab, then notify other tabs to refresh too
async function refreshCartEverywhere() {
  try {
    // Clear local items (optional, keeps UI snappy)
    cart.products = []
    // Refetch totals quietly
    await cart.fetchCart(
      { promo_code: null, gift_card: null } as any,
      { disableLoading: true } as any
    )
  } catch {}

  // Notify other tabs (cart page) to refresh via storage event
  try {
    localStorage.setItem('cart:refresh', String(Date.now()))
  } catch {}
}

onMounted(() => {
  // Start polling every 3s to check payment status
  timer = setInterval(async () => {
    try {
      const merchant_reference =
        cart?.order?.data?.order_number || cart?.$state?.order?.data?.order_number
      if (!merchant_reference) return

      await useApi('payments/check-payment-status', {
        method: 'POST',
        body: { merchant_reference }
      }, {
        onSuccess: async (res: any) => {
          const payload = res?.data
          if (payload?.success === true) {
            clearInterval(timer); timer = null

            // ✅ Refresh cart here and broadcast to other tabs
            await refreshCartEverywhere()

            // Redirect to bookings
            navigateTo('/dashboard/bookings')
          } else if (payload?.success !== 'pending') {
            // Failure / unknown → stop polling (optional: show a message)
            clearInterval(timer); timer = null
          }
        }
      })
    } catch {}
  }, 3000)
})

onBeforeUnmount(() => { if (timer) clearInterval(timer) })
</script>
