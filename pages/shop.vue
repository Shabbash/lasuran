<template>
  <Container>
    <!-- Loading State -->
    <ShopSkeleton v-if="productsStore.isLoading" />

    <!-- Error State -->
    <div v-else-if="productsStore.error" class="flex justify-center items-center py-20">
      <div class="text-red-500 text-lg">{{ productsStore.error }}</div>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Slider Section -->
      <div>
        <BaseSlider
          :items="productsStore.sliders"
          dots
          :slide-per-row="1"
          :slide-per-row-mobile="1"
          dots-class="dots-style"
          class="shop-slider"
        >
          <template #default="{ item }">
            <div class="w-full">
              <div class="w-full overflow-hidden relative rounded-[23px]">
                <img
                  class="mx-auto h-auto md:h-full w-full object-contain md:object-cover inset-0 relative"
                  :src="item.image_url"
                />
              </div>
            </div>
          </template>
        </BaseSlider>
      </div>

      <!-- Popular Items Section -->
      <div class="w-full mt-[60px] slide-6">
        <BaseCard>
          <template #head>
            <h2 class="text-[#EBE4DF] font-[500] text-[24.665px] leading-none">Popular Items</h2>
          </template>
          <template #default>
            <BaseSlider :items="productsStore.getPopularProducts" :slide-per-row-mobile="2" :slide-per-row="6">
              <template #default="{ item }">
                <ProductCard :product="item" @select="openProductModal" />
              </template>
            </BaseSlider>
          </template>
        </BaseCard>
      </div>

      <!-- New Arrival Section -->
      <div class="w-full mt-[60px] slide-6">
        <BaseCard>
          <template #head>
            <h2 class="text-[#EBE4DF] font-[500] text-[24.665px] leading-none">New Arrival</h2>
          </template>
          <template #default>
            <BaseSlider :items="productsStore.getNewProducts" :slide-per-row-mobile="2" :slide-per-row="6">
              <template #default="{ item }">
                <ProductCard :product="item" @select="openProductModal" />
              </template>
            </BaseSlider>
          </template>
        </BaseCard>
      </div>
    </div>
  </Container>
</template>

<script setup lang="ts">
// Imports
import Container from '@/components/base/Container.vue'
import BaseCard from '@/components/base/Card.vue'
import BaseSlider from '@/components/base/Slider.vue'
import ShopSkeleton from '@/components/skeletons/ShopSkeleton.vue'
import ProductCard from '@/components/shop/ProductCard.vue'

import { useProducts } from '@/stores/products'
import { useApp } from '@/stores/app'
import { SERVICE_TYPES, COMPONENTS } from '@/data/constants'
import { usePageTitle } from '~/composables/usePageTitle'

const productsStore = useProducts()
const { setDialogComponent, setDialogShow, setServiceType } = useApp()

// Fetch data on mount
onMounted(async () => {
  setServiceType(SERVICE_TYPES.ONLINE)
  await productsStore.initializeShop()
})

// Open product modal
const openProductModal = (product: any) => {
  setDialogComponent(COMPONENTS.SHOP_SHOW, { product })
  setDialogShow(true)
}
</script>

<style scoped>
/* Add any specific scoped styling if needed */
</style>
