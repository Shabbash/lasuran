<template>
  <div v-if="!loading"
    class="bg-decore-modal mx-auto rounded-[30px] overflow-hidden shadow-lg bg-[#EBE4DF] text-[#5F2C3E]">
    <!-- Product Layout: Two Columns -->
    <div class="flex min-h-[480px]">
      <!-- Left: Product Image -->
      <div class="w-[50%]">
        <img class="w-full h-full object-cover rounded-[30px]" :src="product.data.image" :alt="product.data.name" />
      </div>

      <!-- Right: Product Details -->
      <div class="w-[50%] flex flex-col justify-between mt-[40px] mx-[40px] relative">
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
          'flex items-center gap-[10px] w-full text-white py-3 rounded-full font-[400] text-[16px] justify-center transition cursor-pointer',
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
import { ref, computed } from 'vue'

// Import UI components
import PriceIcon from '@/components/icons/PriceIcon.vue'
import BaseButton from '@/components/base/Button.vue'

// Format currency
import { formatSAR } from '~/utils/formatCurrency'

// Access router for navigation
const router = useRouter()

// Get product ID from route params
const route = useRoute()
const productId = route.params.id

// Fetch product data using custom composable
const { data: product, pending: loading } = useApi(`products/${productId}`, {
  method: 'GET',
})

// Access cart store
const cartModule = useCart()

// Add product to cart and redirect to cart page

function addToCart() {
  const payload = {
    id: product.value.id,                  // ✅ this will become product_id internally
    quantity: 1,
    branch_id: product.value.branch_id || null, // optional
  }

  cartModule.addOrUpdateServiceInCart(payload)
    .then(() => {
      router.push('/cart')
    })
    .catch((err) => {
      console.error('Error adding product to cart:', err)
    })
}

// Price display with formatted SAR + action
const priceWithIcon = computed(() => {
  const price = product.value?.price ?? 0
  return `${formatSAR(price)} - Continue`
})
</script>
