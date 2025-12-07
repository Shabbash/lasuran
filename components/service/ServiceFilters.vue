<template>
  <div class="space-y-[20px]">
    <!-- Main Category Slider -->
    <div>
      <SelectableSlider
        v-model="menuModule.menu_id"
        :items="Maincategories"
        notTransition="1"
        @update:modelValue="onChangeMenu('menu_id', $event)"
        class="main-category"
      />
    </div>

    <div class="flex flex-col md:flex-row justify-between md:items-center gap-[20px]">
      <!-- Branch Selector -->
      <USelectMenu
        v-if="showBranchSelect"
        v-model="filters.branch"
        :items="branches"
        valueKey="id"
        labelKey="name"
        :placeholder="t('select_branch')"
        class="min-w-[300px] rounded-[100px] border border-[#EBE4DF] bg-[#EBE4DF] shadow-[1px_3px_8px_0px_#00000012] backdrop-blur-[25px] h-[32px] md:h-[56px] text-[#A0576F] text-[16px] font-[350] leading-normal ps-[28px]"
        @update:modelValue="onChange('branch', $event)"
      />

      <!-- Sub Category Slider -->
      <SelectableSlider
        v-model="menuModule.sub_category_id"
        :items="subCategories"
        @update:modelValue="onChange('sub_category_id', $event)"
        class="sub-category"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import SelectableSlider from '~/components/base/SelectableSlider.vue'
import { useMenu } from '~/stores/menu'
const { setServiceType, setDeliveryMethod } = useApp()
import { SERVICE_TYPES, COMPONENTS, DELIVERY_METHOD } from '@/data/constants'

// Stores
const menuModule = useMenu()
const { t } = useI18n()
const route = useRoute()

// Props
const props = defineProps({
  showBranchSelect: {
    type: Boolean,
    default: true
  }
})

// Filters state
const filters = ref({
  branch: null
})

// Computed data
const Maincategories = computed(() => menuModule.getMenus || [])
const categories = computed(() => menuModule.getCategories || [])
const subCategories = computed(() => menuModule.getSubCategories || [])
const branches = computed(() => menuModule.getBranches || [])

// Watch branch list and set first branch as default
watch(
  () => branches.value,
  (newBranches) => {
    if (newBranches.length > 0 && !filters.value.branch) {
      filters.value.branch = newBranches[0].id
      menuModule.branch_id = newBranches[0].id
      menuModule.fetchMenus()
    }
  },
  { immediate: true }
)

// Handle filter change
const onChange = function (key: string, _: any) {
  // When branch changes: reset related state, fetch new menus and services
  if (key === 'branch') {
    // Update selected branch
    menuModule.branch_id = filters.value.branch;

    // Reset category and sub-category to prevent cross-branch issues
    menuModule.category_id = null;
    menuModule.sub_category_id = null;

    // Fetch menus for the new branch
    menuModule.fetchMenus().then(() => {
      // If menus are available, set default menu and load services
      if (menuModule.getMenus.length > 0) {
        menuModule.setDefaultMenu();
        menuModule.fetchServices();
      } else {
        // Clear services manually if no menus found
        menuModule.services.data = [];
      }
    });

    return; // Stop here after handling branch change
  }

  // When category changes: reset sub-category
  if (key === 'category_id') {
    menuModule.setDefaultSubCategory();
  }

  // For all other changes, fetch updated services
  menuModule.fetchServices();
}


// Handle menu change
const onChangeMenu = function (key: string, _: any) {
  if (key === 'menu_id') {
    menuModule.setDefaultCategory()
    menuModule.setDefaultSubCategory()
  }

  menuModule.fetchServices()
}

onMounted(()=>{
    setServiceType(SERVICE_TYPES.RESERVATION)

})
</script>

<style scoped>

</style>
