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
      <!-- Delivery Method Selector -->
      <USelectMenu
        v-if="showBranchSelect"
        v-model="filters.branch"
        :items="deliveryMethods"
        valueKey="value"
        labelKey="name"
        placeholder="Select Delivery Method"
        class="min-w-[300px] rounded-[100px] border border-[#EBE4DF] bg-[#EBE4DF] shadow-[1px_3px_8px_0px_#00000012] backdrop-blur-[25px] h-[32px] md:h-[56px] text-[#A0576F] text-[16px] font-[350] leading-normal ps-[28px]"
        @update:modelValue="onChange('delivery_method', $event)"
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

import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import SelectableSlider from '~/components/base/SelectableSlider.vue'

import { useMenu } from '~/stores/menu'
import { useHome } from '~/stores/home'
import { useBranches } from '~/stores/branches'

const emit = defineEmits<{
  (e: 'goProducts', payload: {
    branch: string | null
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

// Local UI state for delivery method + order method
const filters = ref<{ branch: string | null; order_method: string | null }>({
  branch: null,
  order_method: null
})

/** Computed **/
// @ts-ignore
const mainCategories = computed(() => menuModule.getMenus || [])
// @ts-ignore
const subCategories  = computed(() => menuModule.getSubCategories || [])
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
    !!(homeStore as any)?.homeData?.delivery_methods?.length ||
    !!(homeStore as any)?.deliveryMethods?.length

  if (!hasDM) {
    // @ts-ignore
    await homeStore.initializeHome()
  }

  // Ensure branches are loaded
  // @ts-ignore
  if (!branchesStore.getBranches.length && !branchesStore.isLoading) {
    await branchesStore.fetchBranches()
  }

  // Default delivery method (first one)
  if (!filters.value.branch && deliveryMethods.length > 0) {
    filters.value.branch = deliveryMethods[0]?.value ?? null
  }
})

// No need to watch branches for delivery method selector

/** Handlers **/
const onChange = async (key: string, _val: any) => {
  if (key === 'delivery_method') {
    // Store the selected delivery method
    console.log('📝 Delivery method changed to:', filters.value.branch)
    // No fetch here; navigation happens on subcategory selection.
    return
  }

  if (key === 'category_id') {
    // @ts-ignore
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
      // @ts-ignore
      menu_id: menuModule.menu_id ?? null,
      // @ts-ignore
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
