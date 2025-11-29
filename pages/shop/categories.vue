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
          v-model="selectedMenu"
          :items="menuItems"
          variant-class="gender-option"
          title="Select Menu"
          class="mt-[18px]"
        />
      </div>

      <!-- Delivery details + Branch select -->
      <div v-if="orderMethod==1">
        <h2 class="text-[#EBE4DF] text-[17px] font-medium leading-normal mb-[16px]">
         Select Branch
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
      <div v-else>
        <div>
          <p class="text-start text-[14px] font-medium text-white mb-3">
            {{ $t('profile_address') }}
          </p>
          <input type="text" :value="addressesStore.preferred?.full_address || ''"
            :placeholder="$t('profile_address_placeholder')" readonly @click="openAddressModal" class="w-full h-[50px] rounded-[14px] border border-[#EBE4DF] bg-transparent px-4 
           text-[#BBCACF] placeholder:text-[#D3C9C5] text-[14px] outline-none cursor-pointer" />
        </div>
      </div>
    </div>

    <!-- Categories (static demo) -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-[20px]">
      <CategoryCard  v-for="subCategory in menuModule.getSubCategories" :key="subCategory.id" :category="subCategory"  @click="goToProduct(subCategory.id)" />
    
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
import { SERVICE_TYPES ,DELIVERY_METHOD} from '@/data/constants'
import { COMPONENTS } from '@/data/constants'

import { useAddresses } from '@/stores/address'


/* Constants */

/* Init stores */
const productsStore = useProducts()
const homeStore = useHome()
const branchesStore = useBranches()
const menuModule = useMenu()   
const addressesStore = useAddresses()
const appStore = useApp()

           // ✅ انشئ الاستور بعد الاستيراد
const { setDialogComponent, setDialogShow, setServiceType ,setDeliveryMethod} = useApp()

/* Types */
type OrderMethod = '1' | '2'
type BranchItem = { label: string; value: number; address?: string; image?: string }
type MenuItem = { label: string; value: number }

/* State */
const orderMethod = ref<OrderMethod>('1')

// Menu items (Male/Female categories)
const menuItems = computed<MenuItem[]>(() =>
  menuModule.getMenus.map((m: any) => ({
    label: m.name?.en || m.name || `Menu #${m.id}`,
    value: m.id
  }))
)

// Selected menu (Male/Female category) - will be set after data loads
const selectedMenu = ref<MenuItem | null>(null)

/* Options */
const orderMethodItems = [
  { label: 'Pickup', value: '1' },
  { label: 'Delivery', value: '2' }
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
  if (!val?.value) return

  console.log('🏢 Branch selection changed to:', val)

  // حدّث branch_id داخل menu store
  // @ts-ignore
  menuModule.$patch({ branch_id: val.value })

  // أعد تحميل الـ menus والخدمات بناءً على الفرع
  await menuModule.fetchMenus()

  // Update selected menu after menus are loaded
  if (menuItems.value.length > 0) {
    selectedMenu.value = menuItems.value[0]
  }

  // @ts-ignore
  await menuModule.fetchServices()

  // @ts-ignore
  console.log('✅ Branch data updated, subcategories:', menuModule.getSubCategories)
})

// Watch for menu selection changes (Male/Female categories)
watch(selectedMenu, async (val) => {
  if (val?.value) {
    console.log('📝 Menu selection changed to:', val)

    // Update menu_id in store
    // @ts-ignore
    menuModule.$patch({ menu_id: val.value })

    // Set default category and subcategory for the selected menu
    // @ts-ignore
    menuModule.setDefaultCategory()
    // @ts-ignore
    menuModule.setDefaultSubCategory()

    // Fetch services for the selected menu
    // @ts-ignore
    await menuModule.fetchServices()

    // Note: getSubCategories is a getter, not a function
    // It will automatically update when category_id changes
    // @ts-ignore
    console.log('✅ Subcategories updated:', menuModule.getSubCategories)
  }
})

// Changed delivery method
watch(orderMethod, async (val) => {
  // Map order method to correct delivery method constant
  const deliveryMethodMap = {
    '1': DELIVERY_METHOD.PICKUP,
    '2': DELIVERY_METHOD.PICKUP  // أو DELIVERY_METHOD.DELIVERY لو موجود
  }

  setDeliveryMethod(deliveryMethodMap[val] || DELIVERY_METHOD.PICKUP)
  await menuModule.fetchMenus()
})

onMounted(async () => {
  // ✅ Only set service type if cart is empty or cart service type is already ONLINE
  const cartStore = useCart()
  // @ts-ignore
  const currentCartServiceType = cartStore.cartServiceType

  // If cart is empty or already has ONLINE products, set to ONLINE
  if (!currentCartServiceType || currentCartServiceType === SERVICE_TYPES.ONLINE) {
    // @ts-ignore
    setServiceType(SERVICE_TYPES.ONLINE)
    // @ts-ignore
    setDeliveryMethod(DELIVERY_METHOD.PICKUP)
  } else {
    // Cart has different service type (e.g., RESERVATION), don't override
    console.log('Cart has different service type, not overriding:', currentCartServiceType)
  }
})

/* Load all required data once */
onMounted(async () => {
  // 1. Load home data first
  if (!homeStore.homeData) {
    // @ts-ignore
    await homeStore.initializeHome()
  }

  // 2. Load branches
  if (!branchesStore.getBranches.length) {
    await branchesStore.fetchBranches()
  }

  // 3. Set default branch
  if (!selectedBranch.value && branchItems.value.length) {
    selectedBranch.value = branchItems.value[0]
  }

  // 4. Set branch_id in menu store BEFORE calling initMenu
  if (selectedBranch.value?.value) {
    // @ts-ignore
    menuModule.$patch({ branch_id: selectedBranch.value.value })
    console.log('✅ Set branch_id before initMenu:', selectedBranch.value.value)
  } else {
    console.warn('⚠️ No branch selected, cannot initialize menu')
    return
  }

  // 5. Initialize menu (fetch menus & services) - WAIT for it to complete
  // This will call fetchMenus() with the branch_id we just set
  await menuModule.initMenu()

  // 6. Set default menu after menus are loaded
  if (menuItems.value.length > 0 && !selectedMenu.value) {
    selectedMenu.value = menuItems.value[0]
    console.log('✅ Set default menu:', selectedMenu.value)
  }
})



const openAddressModal = () => {
  // @ts-ignore
  appStore.setDialogComponent(COMPONENTS.ADDRESSES_DIALOG, {
    modalMaxWidth: 'max-w-[539px]',
    onSelected: (addr: any) => {
      // Address is automatically saved in addressesStore
      console.log('Address selected:', addr)
    }
  })
  // @ts-ignore
  appStore.setDialogShow(true)
}

const goToProduct = (category_id: any) => {
  console.log('Selected menu:', selectedMenu.value)
  console.log('Selected branch:', selectedBranch.value)

  const query: any = {
    sub_category_id: category_id,
  }

  // Add branch_id if selected
  if (selectedBranch.value?.value) {
    query.branch_id = selectedBranch.value.value
  }

  // Add menu_id if selected (Male/Female categories)
  if (selectedMenu.value?.value) {
    query.menu_id = selectedMenu.value.value
  }

  navigateTo({
    path: '/shop/products',
    query
  })
}



</script>

<style scoped></style>
