<template>
  <div class="space-y-[20px]">
    <div>
      <SelectableSlider
        v-model="menuModule.category_id"
        :items="categories"
        @update:modelValue="onChange('category_id', $event)"
        class="main-category" />

      <!--      :model-value="menuModule?.category_id"-->

      <!--      @update:modelValue="onChange('sub_category_id',$event)"-->
      <!--      :model-value="menuModule?.sub_category_id"-->
      <!--      @update:modelValue="onCategoryChange"-->
      <!--      <UTabs :ui="{-->
      <!--        root: 'inline-flex gap-0',-->
      <!--        list: 'bg-transparent gap-[14px]',-->
      <!--        trigger: 'px-0 py-[15px] w-[171px] gap-[9px] border  rounded-[100px] justify-center text-[15px] font-medium leading-normal data-[state=inactive]:text-[#BBCACF] hover:data-[state=inactive]:not-disabled:text-[#BBCACF] data-[state=inactive]:border-[#BBCACF] data-[state=active]:border-[#EBE4DF] data-[state=active]:bg-[#EBE4DF] data-[state=active]:text-[#A0576F] ',-->
      <!--      }"-->
      <!--      v-model="filters.category_id" :items="menuModule.getCategories"-->
      <!--      label-key="name"-->
      <!--      value-key="id"-->
      <!--      />-->
    </div>

    <div class="flex justify-between items-center">
      <USelectMenu
        v-model="filters.branch"
        :items="branches"
        valueKey="id"
        labelKey="name"
        placeholder="Select Branch"
        class="min-w-[300px] rounded-[100px] border border-[#EBE4DF] bg-[#EBE4DF] shadow-[1px_3px_8px_0px_#00000012] backdrop-blur-[25px] h-[56px] text-[#A0576F] text-[16px] font-[350] leading-normal ps-[28px]" />

      <SelectableSlider
        v-model="menuModule.sub_category_id"
        :items="subCategories"
        @update:modelValue="onChange('sub_category_id', $event)"
        class="sub-category" />
      <!--      <UTabs v-model="filters.sub_category_id" :items="categories"-->
      <!--      :ui="{-->
      <!--        root: 'inline-flex gap-0',-->
      <!--        list: 'bg-transparent gap-[14px]',-->
      <!--        trigger: 'px-[16px] py-[6px] rounded-[100px] text-center text-[16px] font-[200] leading-normal flex-none w-auto data-[state=inactive]:text-[#2B2B2B] data-[state=inactive]:bg-[#F6F6F64D] data-[state=active]:text-[#A0576F] data-[state=active]:bg-[#EBE4DF] data-[state=active]:font-[500]',-->
      <!--      }"-->
      <!--      />-->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import SelectableSlider from "~/components/base/SelectableSlider.vue";
import { useMenu } from '~/stores/menu';

const menuModule = useMenu();

// Create computed properties for the menu data
const categories = computed(() => {
  return menuModule.getCategories || [];
});

const subCategories = computed(() => {
  return menuModule.getSubCategories || [];
});

const branches = computed(() => {
  return menuModule.getBranches || [];
});

// Initialize filters
const filters = ref({
  branch: null
});

const onChange = function (key: string, _: any) {
  // The newValue is already bound to the v-model, so we don't need to set it manually
  if (key == 'category_id') menuModule.setDefaultSubCategory();
  menuModule.fetchServices();
}

// Initialize default selections when component is mounted
onMounted(async () => {
  // Initialize menu data if needed
  if (!menuModule.menus.data || menuModule.menus.data.length === 0) {
    await menuModule.initMenu();
  } else {
    // If category_id is not set, set default category
    if (!menuModule.category_id) {
      menuModule.setDefaultCategory();
    }

    // If sub_category_id is not set, set default subcategory
    if (!menuModule.sub_category_id) {
      menuModule.setDefaultSubCategory();
    }

    // Set default branch if available
    const branchesData = branches.value;
    if (branchesData && branchesData.length > 0 && !filters.value.branch) {
      filters.value.branch = branchesData[0].id;
    }

    // Fetch services with the selected filters
    menuModule.fetchServices();
  }
});


const emit = defineEmits(['update:modelValue'])

// These static data are no longer used since we're using data from the API
// Keeping them commented for reference
/*
const staticBranches = [
  { name: 'Lasuran, Riyadh Branch 1', id: 1 },
  { name: 'Lasuran, Jeddah Branch', id: 2 },
  { name: 'Lasuran, Dammam Branch', id: 3 }
]

const staticCategories: TabsItem[] = [
  { label: 'Hair Styling', value: 'Hair Styling' },
  { label: 'Eyebrows & Eyelashes', value: 'Eyebrows & Eyelashes' },
  { label: 'Massage', value: 'Massage' },
  { label: 'Makeup', value: 'Makeup' },
  { label: 'Nails', value: 'Nails' }
]
*/

// const gender = ref(props.modelValue.gender || 'female')
// const branch = ref(props.modelValue.branch || branches[0])
// const category = ref(props.modelValue.category || 'Hair Styling')

// watch([gender, branch, category], () => {
//   emit('update:modelValue', {
//     gender: gender.value,
//     branch: branch.value,
//     category: category.value
//   })
// })


</script>

<style scoped>

</style>