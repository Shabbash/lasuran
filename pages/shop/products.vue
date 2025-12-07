<template>
  <Container>
    <div>
      <BaseSlider
        :items="homeStore.home?.sliders || []"
        dots
        :slide-per-row="1"
        :slide-per-row-mobile="1"
        dots-class="dots-style"
        class="shop-slider"
      >
        <template #default="{ item }">
          <img :src="item.image" class="w-full rounded-[23px]" />
        </template>
      </BaseSlider>
    </div>

    <div class="grid grid-cols-1 gap-[20px] mt-[30px]">
      <ShopFilter :showBranchSelect="true" @goProducts="handleFilterChange" />
      
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-[20px] mt-[30px]">
      <ProductCard
        v-for="p in productsStore.transformedProducts"
        :key="p.id"
        :item="p"
        @select="openProductModal(p)"
      />
    </div>
  </Container>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Container from '@/components/base/Container.vue'
import BaseSlider from '@/components/base/Slider.vue'
import ProductCard from '@/components/shop/ProductCard.vue'
import ShopFilter from '@/components/shop/ShopFilter.vue'

import { useProducts } from '@/stores/products'
import { useMenu } from '~/stores/menu'
import { useHome } from '~/stores/home'
import { useBranches } from '~/stores/branches'
import { useCart } from '~/stores/cart'
import { SERVICE_TYPES, COMPONENTS, DELIVERY_METHOD } from '@/data/constants'
const { setServiceType, setDeliveryMethod } = useApp()

const route = useRoute()
const productsStore = useProducts()
const menuModule = useMenu()
const homeStore = useHome()
const branchesStore = useBranches()
const cartStore = useCart()

const toNum = (v: any) => (v != null ? Number(v) : null)
const toStr = (v: any) => (typeof v === 'string' ? v : (v ?? null))

onMounted(async () => {
  // ✅ Set service type to ONLINE for shop products
  // @ts-ignore
  const currentCartServiceType = cartStore.cartServiceType

  // Only set service type if cart is empty or already has ONLINE products
  if (!currentCartServiceType || currentCartServiceType === SERVICE_TYPES.ONLINE) {
    // @ts-ignore
    setServiceType(SERVICE_TYPES.ONLINE)
    // @ts-ignore
    setDeliveryMethod(DELIVERY_METHOD.PICKUP)
    console.log('✅ Set service type to ONLINE for shop products')
  } else {
    console.log('⚠️ Cart has different service type, not overriding:', currentCartServiceType)
  }

  // Load home data if needed
  // @ts-ignore
  if (!homeStore?.homeData?.sliders?.length || !homeStore?.deliveryMethods?.length) {
    // @ts-ignore
    await homeStore.initializeHome()
  }
})

const refreshFromQuery = async () => {
  const branch_id       = toNum(route.query.branch_id)
  const menu_id         = toNum(route.query.menu_id)
  const sub_category_id = toNum(route.query.sub_category_id)
  const order_method    = toStr(route.query.order_method)

  console.log('Query parameters received:', {
    branch_id,
    menu_id,
    sub_category_id,
    order_method
  })

  // Set the values in menu store
  if (branch_id) {
    menuModule.branch_id = branch_id as any
  }
  if (menu_id) {
    menuModule.menu_id = menu_id as any
  }
  if (sub_category_id) {
    menuModule.sub_category_id = sub_category_id as any
  }

  // Fetch menus first if branch_id is provided
  // @ts-ignore
  if (branch_id && !menuModule.getMenus?.length) {
    await menuModule.fetchMenus()
  }

  // Fetch products with the filter parameters
  console.log('About to fetch products with params:', {
    branch_id,
    menu_id,
    sub_category_id,
    order_method
  })

  await (productsStore as any).fetchProducts({
    branch_id,
    menu_id,
    sub_category_id,
    order_method
  })
}
const openProductModal = (product: any) => {
  const appStore = useApp()
  // @ts-ignore
  appStore.setDialogComponent(COMPONENTS.SHOP_SHOW, { product })
  // @ts-ignore
  appStore.setDialogShow(true)
}

const handleFilterChange = async (payload: any) => {
  console.log('Filter changed:', payload)

  // Update the URL with new filter parameters
  await navigateTo({
    path: '/shop/products',
    query: {
      branch_id: payload.branch,
      menu_id: payload.menu_id,
      sub_category_id: payload.sub_category_id,
      order_method: payload.order_method
    }
  })
}

onMounted(refreshFromQuery)
watch(() => route.query, refreshFromQuery)
</script>
