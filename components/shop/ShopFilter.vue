<template>
  <div class="space-y-[20px]">
    <!-- Main Category Slider -->
    <div>
      <SelectableSlider
        v-model="menuModule.menu_id"
        :items="mainCategories"
        notTransition="1"
        @update:modelValue="onChangeMenu('menu_id', $event)"
        class="main-category"
      />
    </div>
    <!-- Branch / Order Method / Sub-Category -->
  
    <div class="flex flex-col md:flex-row justify-between md:items-center gap-[20px]">
      <!-- Branch Selector -->
    
      <!-- Delivery Method Selector -->
      <USelectMenu
        v-model="filters.order_method"
        :items="deliveryMethods"
        valueKey="value"
        labelKey="name"
        placeholder="اختر طريقة التوصيل"
        class="min-w-[300px] rounded-[100px] border border-[#EBE4DF] bg-[#EBE4DF] shadow-[1px_3px_8px_0px_#00000012] backdrop-blur-[25px] h-[32px] md:h-[56px] text-[#A0576F] text-[16px] font-[350] leading-normal ps-[28px]"
        @update:modelValue="onChange('order_method', $event)"
      />

    
      <SelectableSlider
        v-model="menuModule.sub_category_id"
        :items="subCategories"
        @update:modelValue="onChange('sub_category_id', $event)"
        class="sub-category"
      />
    </div>

   
    <div v-if="branchesStore.error" class="text-red-500 text-sm ps-2">
      {{ branchesStore.error }}
    </div>
  </div>
</template>

<script setup lang="ts">
// English-only comments.

import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import SelectableSlider from '~/components/base/SelectableSlider.vue'

import { useMenu } from '~/stores/menu'
import { useHome } from '~/stores/home'
import { useBranches } from '~/stores/branches'
import { useProducts } from '~/stores/products'




const emit = defineEmits<{
  (e: 'goProducts', payload: {
    branch: number | null
    order_method: string | null
    menu_id: number | null
    sub_category_id: number | null
  }): void
}>()

const props = defineProps({
  showBranchSelect: { type: Boolean, default: true }
})

const { t } = useI18n()
const route = useRoute()
const menuModule    = useMenu()
const homeStore     = useHome()
const branchesStore = useBranches()
const productsStore = useProducts()

// Helper functions
const toNum = (v: any) => (v != null ? Number(v) : null)
const toStr = (v: any) => (typeof v === 'string' ? v : (v ?? null))

// Local UI state for branch + order method
const filters = ref<{ branch: number | undefined; order_method: string | undefined }>({
  branch: undefined,
  order_method: undefined
})

/** Computed **/
const mainCategories = computed(() => (menuModule as any).getMenus || [])
const subCategories  = computed(() => (menuModule as any).getSubCategories || [])
const branches       = computed(() => (branchesStore as any).getBranches || [])
const deliveryMethods = [
  { id: 1, name: 'Pickup', value: '1' },
  { id: 2, name: 'Delivery', value: '2' }
]

// Computed property for selected branch object
const selectedBranch = computed(() => {
  if (!filters.value.branch) return null
  return branches.value.find((branch: any) => branch.id === filters.value.branch) || null
})

/** Normalize delivery methods from multiple possible sources + is_enabled casting */
const orderMethodItems = computed(() => {
  const src =
    (homeStore as any)?.home?.delivery_methods ??
    (homeStore as any)?.home?.data?.delivery_methods ??
    (homeStore as any)?.deliveryMethods ??
    []

  const array = Array.isArray(src) ? src : []
  const isTrue = (v: any) =>
    v === true || v === 1 || v === '1' || String(v).toLowerCase() === 'true'

  return array
    .filter((m: any) => isTrue(m?.is_enabled))
    .map((m: any) => ({
      id: m?.id,
      name: m?.name,
      code: m?.code,
      image: m?.image,
      description: m?.description
    }))
})

const hasEnabledOrderMethods = computed(() => orderMethodItems.value.length > 0)
const showOrderMethodSelect  = computed(() => orderMethodItems.value.length > 1)
const disabledMsg            = computed(
  () =>
    (homeStore as any)?.home?.disabled_delivery_method_msg ??
    (homeStore as any)?.home?.data?.disabled_delivery_method_msg ??
    ''
)

/** Initialize from query parameters **/
const initializeFromQuery = async () => {
  const branch_id = toNum(route.query.branch_id)
  const menu_id = toNum(route.query.menu_id)
  const sub_category_id = toNum(route.query.sub_category_id)
  const order_method = route.query.order_method as string

  console.log('ShopFilter: Initializing from query:', {
    branch_id,
    menu_id,
    sub_category_id,
    order_method,
    currentFilters: filters.value,
    currentMenuState: {
      branch_id: menuModule.branch_id,
      menu_id: menuModule.menu_id,
      sub_category_id: menuModule.sub_category_id
    }
  })

  // Set branch filter if provided
  if (branch_id) {
    filters.value.branch = branch_id
    menuModule.branch_id = branch_id as any
  }

  // Set delivery method if provided
  if (order_method) {
    filters.value.order_method = order_method
  }

  // Set menu_id if provided
  if (menu_id) {
    menuModule.menu_id = menu_id as any
  }

  // Set sub_category_id if provided
  if (sub_category_id) {
    menuModule.sub_category_id = sub_category_id as any
  }

  console.log('ShopFilter: After setting values:', {
    filters: filters.value,
    menuState: {
      branch_id: menuModule.branch_id,
      menu_id: menuModule.menu_id,
      sub_category_id: menuModule.sub_category_id
    }
  })
}

/** Initial load **/
onMounted(async () => {
  // Ensure home data (delivery_methods + sliders) is loaded
  const hasDM =
    !!(homeStore as any)?.home?.delivery_methods?.length ||
    !!(homeStore as any)?.home?.data?.delivery_methods?.length ||
    !!(homeStore as any)?.deliveryMethods?.length

  if (!hasDM || !(homeStore as any)?.home?.sliders?.length) {
    await (homeStore as any).initializeHome()
  }

  // Ensure branches are loaded
  if (!(branchesStore as any).getBranches.length && !(branchesStore as any).isLoading) {
    await (branchesStore as any).fetchBranches()
  }

  // Initialize from query parameters first
  await initializeFromQuery()

  // Default delivery method if not set from query
  if (!filters.value.order_method && deliveryMethods.length > 0) {
    filters.value.order_method = deliveryMethods[0]?.value
  }

  // Default branch (first one) and fetch menus if not set from query
  if (!filters.value.branch && branches.value.length) {
    const first = branches.value[0]
    filters.value.branch = first.id
    menuModule.branch_id = first.id as any
    await menuModule.fetchMenus()
  } else if (filters.value.branch) {
    // If branch is set from query, fetch menus for that branch
    await menuModule.fetchMenus()
  }

  // Update products after initialization
  if (filters.value.branch || menuModule.menu_id || menuModule.sub_category_id) {
    console.log('ShopFilter: Initial product update after mount')
    await updateProducts()
  }
})

/** Keep menus synced when branches list arrives later */
watch(
  () => branches.value,
  async (newBranches) => {
    if (newBranches.length > 0 && !filters.value.branch) {
      const first = newBranches[0]
      filters.value.branch = first.id
      menuModule.branch_id = first.id as any
      await menuModule.fetchMenus()
    }
  }
)

/** Watch for route query changes */
watch(
  () => route.query,
  async (newQuery, oldQuery) => {
    console.log('ShopFilter: Route query changed:', { newQuery, oldQuery })

    // Only update if the query actually changed
    const hasChanged =
      newQuery.branch_id !== oldQuery?.branch_id ||
      newQuery.menu_id !== oldQuery?.menu_id ||
      newQuery.sub_category_id !== oldQuery?.sub_category_id ||
      newQuery.order_method !== oldQuery?.order_method

    if (hasChanged) {
      await initializeFromQuery()
      // Update products after query change
      await updateProducts()
    }
  }
)

/** Helper function to update products */
const updateProducts = async () => {
  const filterParams = {
    branch_id: filters.value.branch ?? null,
    order_method: filters.value.order_method ?? null,
    menu_id: menuModule.menu_id ?? null,
    sub_category_id: menuModule.sub_category_id ?? null
  }

  console.log('ShopFilter: Updating products with filters:', filterParams)
  console.log('ShopFilter: Current filter state:', filters.value)
  console.log('ShopFilter: Current menu state:', {
    menu_id: menuModule.menu_id,
    sub_category_id: menuModule.sub_category_id,
    branch_id: menuModule.branch_id
  })

  try {
    // Update products directly
    await (productsStore as any).fetchProducts(filterParams)
    console.log('ShopFilter: Products updated successfully')
  } catch (error) {
    console.error('ShopFilter: Error updating products:', error)
  }

  // Also emit for parent component with correct format
  emit('goProducts', {
    branch: filters.value.branch ?? null,
    order_method: filters.value.order_method ?? null,
    menu_id: menuModule.menu_id ?? null,
    sub_category_id: menuModule.sub_category_id ?? null
  })
}

/** Handlers **/
const onChange = async (key: string, _val: any) => {
  console.log('Filter changed:', key, _val)

  if (key === 'branch') {
    menuModule.branch_id = filters.value.branch as any
    menuModule.category_id = null
    menuModule.sub_category_id = null
    await menuModule.fetchMenus()

    // Update products after fetching menus
    await updateProducts()
    return
  }

  if (key === 'order_method') {
    // Update products when delivery method changes
    await updateProducts()
    return
  }

  if (key === 'category_id') {
    menuModule.setDefaultSubCategory()
    return
  }

  if (key === 'sub_category_id') {
    // Update products when subcategory changes
    await updateProducts()
    return
  }
}

const onChangeMenu = async (key: string, _val: any) => {
  if (key === 'menu_id') {
    menuModule.setDefaultCategory()
    menuModule.setDefaultSubCategory()

    // Update products when menu changes
    await updateProducts()
  }
}
</script>

<style scoped>
/* Styling via utility classes */
</style>
