<template>
  <Container>
    <!-- Slider -->
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

    <!-- Top controls -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-[34px] mt-[50px]">
      <div>
        <RadioSwitch
          v-model="orderMethod"
          :items="orderMethodItems"
          variant-class="ordermethod-option"
          title="Order Method"
        />


        <RadioSwitch
          v-model="gender"
          :items="menuItems"
          variant-class="gender-option"
          title="Gender"
          class="mt-[18px]"
        />
      </div>

      <!-- Delivery details + Branch select -->
      <div>
        <h2 class="text-[#EBE4DF] text-[17px] font-medium leading-normal mb-[16px]">
          Delivery Details
        </h2>
        <div class="p-[10px] rounded-[12px] bg-[#EBE4DF]">
          <div class="flex gap-[7px] mb-[6px]">
            <div class="h-[42px] w-[42px] rounded-[12px] overflow-hidden">
              <img
                class="w-full h-full object-cover"
                :src="selectedBranch?.image || 'https://lasuran-dev.jigsawme.io/assets/img/branches/default.png'"
                alt=""
              />
            </div>

            <div>
              <h3 class="text-[#A0576F] font-[Klein] text-[18px] font-medium leading-normal mb-[5px]">
                {{ selectedBranch?.label || '[Branch Name]' }}
              </h3>

              <div class="flex items-center gap-[6px]">
                <LocationIcon3 />
                <p class="text-[#5B605C] font-[Klein] text-[14px] font-[350]">
                  {{ selectedBranch?.address || 'Select a branch' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-[20px]">
            <BaseButton
              :disabled="!selectedBranch"
              class="flex align-center gap-[10px] w-full text-white py-3 rounded-full font-[400] text-[16px] justify-center bg-[#A0576F] hover:bg-[#913E5D] disabled:opacity-60 disabled:pointer-events-none"
            >
              <span>View Details</span>
            </BaseButton>

            <!-- Branch select -->
            <USelectMenu
              v-model="selectedBranch"      
              :items="branchItems"
              option-attribute="label"
              value-attribute="value"
              :search-attributes="['label','address']"
              searchable
              :loading="branchesStore.isLoading"
              class="w-full"
            >
              <BaseButton class="flex w-full justify-center text-white py-3 rounded-full bg-[#6B8B9B] hover:bg-[#5C7E8E]">
                <span>{{ selectedBranch ? 'Change Branch' : 'Choose Branch' }}</span>
              </BaseButton>

              <template #item="{ item }">
                <div class="flex items-center gap-2">
                  <img
                    :src="item.image || 'https://lasuran-dev.jigsawme.io/assets/img/branches/default.png'"
                    class="h-7 w-7 rounded-md object-cover"
                  />
                  <div class="flex flex-col">
                    <span class="text-sm font-medium">{{ item.label }}</span>
                    <span class="text-xs text-gray-500 truncate max-w-[220px]">{{ item.address }}</span>
                  </div>
                </div>
              </template>

              <template #empty>
                <div class="px-3 py-2 text-sm text-gray-500">
                  {{ branchesStore.isLoading ? 'Loading branches…' : 'No branches found' }}
                </div>
              </template>
            </USelectMenu>
          </div>
        </div>
      </div>
    </div>

    <!-- Categories (static demo) -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-[20px]">
      <CategoryCard />
      <CategoryCard />
      <CategoryCard />
      <CategoryCard />
      <CategoryCard />
      <CategoryCard />
      <CategoryCard />
    </div>
  </Container>
</template>

<script setup lang="ts">
/* Core */
import { ref, computed, onMounted, watch } from 'vue'

/* Components */
import Container from '@/components/base/Container.vue'
import RadioSwitch from '@/components/shop/RadioSwitch.vue'
import BaseCard from '@/components/base/Card.vue'
import BaseSlider from '@/components/base/Slider.vue'
import LocationIcon3 from '@/components/icons/LocationIcon3.vue'
import CategoryCard from '@/components/shop/CategoryCard.vue'
import ProductCard from '@/components/shop/ProductCard.vue'

/* Stores */
import { useHome } from '~/stores/home'
import { useBranches } from '@/stores/branches'
import { useProducts } from '@/stores/products'
import { useApp } from '@/stores/app'
import { useMenu } from '~/stores/menu'   // ✅ استيراد صحيح للستـور

/* Constants */
import { COMPONENTS } from '@/data/constants'

/* Init stores */
const productsStore = useProducts()
const homeStore = useHome()
const branchesStore = useBranches()
const menuModule = useMenu()   
           // ✅ انشئ الاستور بعد الاستيراد
const { setDialogComponent, setDialogShow, setServiceType } = useApp()

/* Types */
type OrderMethod = '1' | '2'
type Gender = 'Female' | 'Male'
type BranchItem = { label: string; value: number; address?: string; image?: string }

/* State */
const orderMethod = ref<OrderMethod>('1')
const menuItems = computed(() =>
  menuModule.getMenus.map((m: any) => ({
    label: m.name?.en || m.name || `Menu #${m.id}`,
    value: m.id
  }))
)

const gender = ref(menuItems.value[0])

/* Options */
const orderMethodItems = [
  { label: 'Pickup', value: '1' },
  { label: 'Delivery', value: '2' }
]
const genderItems = [
  { label: 'Female', value: 'Female' },
  { label: 'Male', value: 'Male' }
]

/* Derive delivery methods from store (reactive) */
const deliveryMethods = computed(() => homeStore.deliveryMethods)

/* Branch select items */
const branchItems = computed<BranchItem[]>(() =>
  branchesStore.getBranches.map(b => ({
    label: String(b.name || `Branch #${b.id}`),
    value: b.id,
    address: b.address || b.city_name || '',
    image: b.image || b.main_image || b.thumpimage_image
  }))
)

/* نحتفظ بالكائن المختار نفسه */
const selectedBranch = ref<BranchItem | null>(null)

/* ربط اختيار الفرع مع menu.store */
watch(selectedBranch, async (val) => {
  // حدّث branch_id داخل menu store
  menuModule.$patch({ branch_id: val?.value ?? null })
  // أعد تحميل الـ menus والخدمات بناءً على الفرع
  await menuModule.fetchMenus()
  await menuModule.fetchServices()
})

/* Load all required data once */
onMounted(async () => {
  if (!homeStore.homeData) {
    await homeStore.initializeHome()
  }

  // حمل الفروع
  if (!branchesStore.getBranches.length) {
    await branchesStore.fetchBranches()
  }

  // حدّد فرع افتراضي
  if (!selectedBranch.value && branchItems.value.length) {
    selectedBranch.value = branchItems.value[0]
  }

  // شغّل المنيو (بيجيب menus & services) — بعد ما نحدد الفرع
  await menuModule.initMenu()
})


</script>

<style scoped></style>
