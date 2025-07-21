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


        console.log('All orders from API:', allOrders)
        console.log('Looking for gifted_info.id:', giftedId)

        const found = allOrders.find((o: any) => o.gifted_info?.id === giftedId)
        console.log('Found order:', found)

        if (!found) throw new Error('Gifted order not found')

        // Check different possible fields for order_id
        const orderId = found.order_id || found.id || found.order?.id
        console.log('Order ID candidates:', {
          'found.order_id': found.order_id,
          'found.id': found.id,
          'found.order?.id': found.order?.id,
          'selected orderId': orderId
        })

        if (!orderId) {
          console.error('No order ID found in:', found)
          throw new Error('Order ID not found in gifted order')
        }

        // 🟡 Fetch full order details using order_id
        const orderResponse = await useApi(`orders/${orderId}`, {})
        console.log('Fetching order details for order_id:', orderId)
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
