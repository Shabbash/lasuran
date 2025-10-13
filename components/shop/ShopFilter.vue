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
      <USelectMenu
        v-if="showBranchSelect"
        v-model="filters.branch"
        :items="deliveryMethods"
        valueKey="id"
        labelKey="name"
        placeholder="select dilvery methodt"
        class="min-w-[300px] rounded-[100px] border border-[#EBE4DF] bg-[#EBE4DF] shadow-[1px_3px_8px_0px_#00000012] backdrop-blur-[25px] h-[32px] md:h-[56px] text-[#A0576F] text-[16px] font-[350] leading-normal ps-[28px]"
        :loading="homeStore.isLoading"
        @update:modelValue="onChange('branch', $event)"
      />

      
      <!-- <template v-if="hasEnabledOrderMethods">
       
        <USelectMenu
          v-if="showOrderMethodSelect"
          v-model="filters.order_method"
          :items="orderMethodItems"
          valueKey="code"
          labelKey="name"
          :placeholder="t('order_method')"
          class="min-w-[300px] rounded-[100px] border border-[#EBE4DF] bg-[#EBE4DF] shadow-[1px_3px_8px_0px_#00000012] backdrop-blur-[25px] h-[32px] md:h-[56px] text-[#A0576F] text-[16px] font-[350] leading-normal ps-[28px]"
          @update:modelValue="onChange('order_method', $event)"
        />
     
        <div
          v-else
          class="min-w-[300px] rounded-[16px] bg-[#EBE4DF] text-[#A0576F] px-4 py-3 text-sm flex items-center justify-between"
        >
          <span class="font-[500]">{{ orderMethodItems[0]?.name }}</span>
          <span class="text-[12px] opacity-70">{{ orderMethodItems[0]?.code }}</span>
        </div>
      </template> -->

    <!--     
        <template v-else>
            <div
            class="min-w-[300px] rounded-[16px] border border-amber-300/40 bg-amber-100/50 text-amber-800 px-4 py-3 text-sm"
            >
            {{ disabledMsg || "The selected order method isn't active, please select another method!" }}
            </div>
        </template> -->

    
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
import SelectableSlider from '~/components/base/SelectableSlider.vue'

import { useMenu } from '~/stores/menu'
import { useHome } from '~/stores/home'
import { useBranches } from '~/stores/branches'

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
const menuModule    = useMenu()
const homeStore     = useHome()
const branchesStore = useBranches()

// Local UI state for branch + order method
const filters = ref<{ branch: number | null; order_method: string | null }>({
  branch: null,
  order_method: null
})

/** Computed **/
const mainCategories = computed(() => menuModule.getMenus || [])
const subCategories  = computed(() => menuModule.getSubCategories || [])
const branches       = computed(() => branchesStore.getBranches || [])
const deliveryMethods = [

  { name: 'Pickup', value: '1' },
  { name: 'Delivery', value: '2' }

]

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

/** Initial load **/
onMounted(async () => {
  // Ensure home data (delivery_methods + sliders) is loaded
  const hasDM =
    !!(homeStore as any)?.home?.delivery_methods?.length ||
    !!(homeStore as any)?.home?.data?.delivery_methods?.length ||
    !!(homeStore as any)?.deliveryMethods?.length

  if (!hasDM || !(homeStore as any)?.home?.sliders?.length) {
    await homeStore.initializeHome()
  }

  // Ensure branches are loaded
  if (!branchesStore.getBranches.length && !branchesStore.isLoading) {
    await branchesStore.fetchBranches()
  }

  // Default order method (first enabled if exists)
  if (!filters.value.order_method && orderMethodItems.value.length > 0) {
    filters.value.order_method = orderMethodItems.value[0]?.code ?? null
  }

  // Default branch (first one) and fetch menus
  if (!filters.value.branch && branches.value.length) {
    const first = branches.value[0]
    filters.value.branch = first.id
    menuModule.branch_id = first.id
    await menuModule.fetchMenus()
  }
})

/** Keep menus synced when branches list arrives later */
watch(
  () => branches.value,
  async (newBranches) => {
    if (newBranches.length > 0 && !filters.value.branch) {
      const first = newBranches[0]
      filters.value.branch = first.id
      menuModule.branch_id = first.id
      await menuModule.fetchMenus()
    }
  }
)

/** Handlers **/
const onChange = async (key: string, _val: any) => {
  if (key === 'branch') {
    menuModule.branch_id = filters.value.branch
    menuModule.category_id = null
    menuModule.sub_category_id = null
    await menuModule.fetchMenus()
    return
  }

  if (key === 'category_id') {
    menuModule.setDefaultSubCategory()
    return
  }

  if (key === 'order_method') {
    // No fetch here; navigation happens on subcategory selection.
    return
  }

  if (key === 'sub_category_id') {
    emit('goProducts', {
      branch: filters.value.branch,
      order_method: filters.value.order_method,
      menu_id: menuModule.menu_id ?? null,
      sub_category_id: menuModule.sub_category_id ?? null
    })
    return
  }
}

const onChangeMenu = async (key: string, _val: any) => {
  if (key === 'menu_id') {
    menuModule.setDefaultCategory()
    menuModule.setDefaultSubCategory()
  }
  // Navigation happens on subcategory selection.
}
</script>

<style scoped>
/* Styling via utility classes */
</style>
