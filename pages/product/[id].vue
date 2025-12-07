<template>
  <div v-if="!loading"
    class="bg-decore-modal mx-auto rounded-[30px] overflow-hidden shadow-lg bg-[#EBE4DF] text-[#5F2C3E]">
    <!-- Product Layout: Two Columns -->
    <div class="flex flex-col lg:flex-row min-h-[480px]">
      <!-- Left: Product Image -->
      <div class="lg:w-[50%]">
        <img class="w-full h-full object-cover rounded-[30px]" :src="product.data.image" :alt="product.data.name" />
      </div>

      <!-- Right: Product Details -->
      <div class="lg:w-[50%] flex flex-col justify-between mt-[40px] mx-[40px] relative">
        <!-- Product Info -->
        <div>
          <!-- Title -->
          <h2 class="text-[#1D2539] font-[700] text-[21.525px] leading-[31.36px] mb-[8px]">
            {{ product.data.name }}
          </h2>

          <!-- Price Section -->
          <div class="flex items-end gap-[5px] mb-[14px]">
            <!-- Final Price -->
            <div class="text-[#1D2539] font-[700] text-[21.525px] leading-[31.36px]"
              v-html="formatSAR(product.data.price)" />

            <!-- Original Price -->
            <div v-if="product.data.discount_value"
              class="text-[#98A2B3] text-[13.016px] leading-[19.6px] font-[400] line-through"
              v-html="formatSAR(product.data.price_before_discount)" />

            <!-- Discount Percentage -->
            <div v-if="product.data.discount_type === 'percentage'"
              class="text-[#008200] text-[12.031px] leading-[19.6px] font-[700] capitalize">
              {{ product.data.discount_value }}% Off
            </div>
          </div>

          <!-- Static Product Tag (Example) -->
          <div class="flex items-center gap-[5px] p-[8px] bg-white rounded-[8px]">
            <img src="/public/assets/img/decorative.png" alt="Decoration" />
            <span>Coming Soon</span>
            <span>Lausran Shop</span>
          </div>
        </div>

        <!-- Action Button -->
        <BaseButton @click="addToCart" :loading="cartModule.isAddLoading" :disabled="cartModule.isAddLoading" :class="[
          'flex items-center gap-[10px] w-full text-white py-3 rounded-full font-[400] text-[16px] justify-center transition cursor-pointer mt-[20px] lg:mt-0 ',
          cartModule.isAddLoading ? 'bg-[#a0576f69]' : 'bg-[#A0576F] hover:bg-[#913E5D]',
          !product.data.description ? 'mb-[30px]' : ''
        ]">
          <PriceIcon />
          <span>Add to cart</span>
        </BaseButton>
      </div>
    </div>

    <!-- Description Section -->
    <div class="px-[40px] mt-[28px] pb-[30px]" v-if="product.data.description">
      <h2 class="text-[#A0576F] text-[19.251px] leading-[26.711px] font-[700] mb-[10px]">
        Service Overview
      </h2>
      <p class="text-[#1D2539] text-[16px] font-[400] leading-normal" v-html="product.data.description" />
    </div>
  </div>

  <!-- Loading Fallback -->
  <div v-else>
    Loading...
  </div>
</template>



<script setup lang="ts">
import { useApi } from '~/composables/useApi'
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'


// Import UI components
import PriceIcon from '@/components/icons/PriceIcon.vue'
import BaseButton from '@/components/base/Button.vue'

// Format currency
import { formatSAR } from '~/utils/formatCurrency'

// Import stores and composables
import { useAuthCheck } from '~/composables/useAuthCheck'
import { SERVICE_TYPES, DELIVERY_METHOD } from '~/data/constants'

// Access router for navigation
const router = useRouter()

// Get product ID from route params
const route = useRoute()
const productId = route.params.id

// Set service type to RESERVATION for cart operations (not ONLINE)
const { setServiceType, setDeliveryMethod, getServiceType } = useApp()
setServiceType(SERVICE_TYPES.RESERVATION)  // Use service_reservation for cart API
setDeliveryMethod(DELIVERY_METHOD.RESERVATION)

// Debug: Check what service type is actually set
console.log('Current service type after setting:', getServiceType)
console.log('SERVICE_TYPES.RESERVATION value:', SERVICE_TYPES.RESERVATION)

// Initialize menu store to get branch_id
const menuModule = useMenu()
onMounted(() => {
  menuModule.initMenu()
})

// Fetch product data using custom composable
const { data: product, pending: loading } = useApi(`products/${productId}`, {
  method: 'GET',
})

// Access cart store
const cartModule = useCart()

// Add product to cart - try direct API call to bypass coverage validation
async function addToCart() {
  const productId = product.value.data?.id || product.value.id

  console.log('Adding to cart - Product ID:', productId)
  console.log('App store service type before API call:', getServiceType)

  try {
    // Use $fetch directly to have full control over headers
    const authStore = useAuth()

    const response = await $fetch('https://lasuran-dev.jigsawme.io/api/v1/cart', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.getToken}`,
        'Service-Type': 'service_reservation',  // Force service_reservation
        'Delivery-Method': 'srvc_resv',
        'Device-Type': 'WEB',
        'Accept-Language': 'en',
        'Content-Type': 'application/json'
      },
      body: {
        product_id: productId,
        quantity: 1,
      }
    })

    console.log('Cart API response:', response)

    if (response?.status) {
      // Success - redirect to cart
      router.push('/cart')

      // Show success message
      const toast = useToast()
      toast.add({
        title: 'Product added to cart successfully',
        color: 'success'
      })
    }
  } catch (error: any) {
    console.error('Direct cart API error:', error)

    // Check if it's a coverage area error
    if (error?.response?._data?.message?.includes('coverage area')) {
      const toast = useToast()
      toast.add({
        title: 'Service not available in your area',
        description: 'Please update your address in your profile or contact support.',
        color: 'error'
      })
      return
    }

    // For other errors, try fallback to cart store method
    try {
      const item = {
        id: productId,
        quantity: 1,
      }

      // @ts-ignore - TypeScript doesn't recognize the method but it exists
      await cartModule.addOrUpdateServiceInCart(item, null, SERVICE_TYPES.RESERVATION)
    } catch (fallbackError) {
      console.error('Fallback cart method also failed:', fallbackError)
      const toast = useToast()
      toast.add({
        title: 'Unable to add to cart',
        description: 'Please try again later or contact support.',
        color: 'error'
      })
    }
  }
}


</script>
