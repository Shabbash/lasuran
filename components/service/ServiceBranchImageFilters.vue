<template>
  <div class="space-y-[20px]">
    <div>
      <SelectableSlider
        v-model="menuModule.menu_id"
        :items="Maincategories"
        notTransition="1"
        @update:modelValue="onChangeMenu('menu_id', $event)"
        class="main-category" />


    </div>

        <!-- <div> -->
      <!-- <SelectableSlider
        v-model="menuModule.category_id"
        :items="categories"
        @update:modelValue="onChange('category_id', $event)"
        class="main-category" />


    </div> -->

    <div class="flex flex-col md:flex-row justify-between md:items-center gap-[20px]">
     <BaseCard  with-action @action-click="navigateToServices">
            <template #default>
              <BaseSlider :items="subCategories" :slide-per-row="5" :slide-per-row-mobile="3">
                <template #default="{ item }">
                  <div class="">
                    <div class=" overflow-hidden relative h-[142px] rounded-[23px]">
                      <div
                          class="absolute h-[105px] bottom-0 w-full rounded-[30px] bg-[linear-gradient(to_bottom,_#E8D5CC,_#E8BBAC)]">
                      </div>
                      <img class="mx-auto h-full object-cover inset-0 relative"
                           :src="item.image" />
                    </div>
                    <h2 class="text-center text-white mt-3 font-medium text-lg">{{ item.name }}
                    </h2>
                  </div>

                </template>
              </BaseSlider>
            </template>

          </BaseCard>
          </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import SelectableSlider from "~/components/base/SelectableSlider.vue";
import { useMenu } from '~/stores/menu';
import { useI18n } from 'vue-i18n'

const { t } = useI18n() // translation function

const menuModule = useMenu();


// Create computed properties for the menu data
const Maincategories = computed(() => {
  return menuModule.getMenus || [];
});

const categories = computed(() => {
  return menuModule.getCategories || [];
});


const subCategories = computed(() => {
  return menuModule.getSubCategories || [];
});

const branches = computed(() => {
  return menuModule.getBranches || [];
});

const props = defineProps({
  showBranchSelect: {
    type: Boolean,
    default: true
  }
})


// Initialize filters
const filters = ref({
  branch: null
});

const onChange = function (key: string, _: any) {
  // The newValue is already bound to the v-model, so we don't need to set it manually
  if (key == 'category_id') menuModule.setDefaultSubCategory();
  menuModule.fetchServices();
}

const onChangeMenu = function (key: string, _: any) {
  // The newValue is already bound to the v-model, so we don't need to set it manually
  if (key == 'menu_id') {
    menuModule.setDefaultCategory();
    menuModule.setDefaultSubCategory();
  }
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