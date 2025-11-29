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

// Access cart store
const cartModule = useCart()

// Set service type to ONLINE for online store products
const { setServiceType, setDeliveryMethod } = useApp()

// ✅ Only set service type if cart is empty or cart service type is already ONLINE
const currentCartServiceType = cartModule.cartServiceType

// If cart is empty or already has ONLINE products, set to ONLINE
if (!currentCartServiceType || currentCartServiceType === SERVICE_TYPES.ONLINE) {
  // @ts-ignore
  setServiceType(SERVICE_TYPES.ONLINE)  // Use online_store for products
  // @ts-ignore
  setDeliveryMethod(DELIVERY_METHOD.PICKUP)  // Use pickup for online store
} else {
  // Cart has different service type (e.g., RESERVATION), don't override
  console.log('Cart has different service type, not overriding:', currentCartServiceType)
}

// Initialize menu store to get branch_id
const menuModule = useMenu()
onMounted(() => {
  menuModule.initMenu()
})

// Fetch product data using custom composable
const { data: product, pending: loading } = useApi(`products/${productId}`, {
  method: 'GET',
})

// Add product to cart using cart store
async function addToCart() {
  const productId = product.value.data?.id || product.value.id

  console.log('Adding to cart - Product ID:', productId)

  const item = {
    id: productId,
    quantity: 1,
  }

  // @ts-ignore - TypeScript doesn't recognize the method but it exists
  await cartModule.addOrUpdateServiceInCart(item, null, SERVICE_TYPES.ONLINE)

  // Redirect to cart after adding
  router.push('/cart')
}


</script>
