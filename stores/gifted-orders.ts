import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'

export const useGiftedOrders = defineStore('giftedOrders', {
  state: () => ({
    giftedOrderDetails: null as any,
    loading: false,
  }),

  actions: {
    async fetchGiftedOrder(giftedId: number) {
      this.loading = true
      this.giftedOrderDetails = null

      try {
        // 🟡 Fetch all gifted orders
        const response = await useApi(`gifted-orders`, {})
       const allOrders = Array.isArray(response.data.value?.data?.orders)
  ? response.data.value.data.orders
  : []


        const found = allOrders.find((o: any) => o.gifted_info?.id === giftedId)

        if (!found) throw new Error('Gifted order not found')

        // 🟡 Fetch full order details using order_id
        const orderResponse = await useApi(`orders/${found.order_id}`, {})
        alert(found.order_id)
        const orderDetails = orderResponse.data.value

        // 🟢 Combine gifted info + order details
        this.giftedOrderDetails = {
          ...found,
          ...orderDetails,
          order_product: orderDetails?.products?.[0] || null
        }

        return this.giftedOrderDetails
      } catch (error) {
        console.error('❌ Error fetching gifted order:', error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
