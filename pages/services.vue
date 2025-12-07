<template>
  <Container>

  
    <!-- Services Banner / Slider -->
    <div v-if="sliders?.length" class="mb-6">
      <BaseSlider
        :items="sliders"
        dots
        :slide-per-row="1"
        :slide-per-row-mobile="1"
        dots-class="dots-style"
        class="services-slider"
      >
        <template #default="{ item }">
          <div class="w-full cursor-pointer">
            <div class="w-full overflow-hidden relative rounded-[23px] h-[200px] md:h-[300px]">
              <img
                class="mx-auto h-full w-full object-cover inset-0 relative"
                :src="item.image_url ?? item.image"
                alt="Banner"
                @click="handleBannerClick(item)"
              />
            </div>
          </div>
        </template>
      </BaseSlider>
    </div>

    <!-- Filters Bar -->
    <ServiceFilters v-model="filters" />

    <!-- Services Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-[30px]" v-if="!menuModule?.services.loading">
      <BaseCard v-for="service in menuModule.services.data as Service[]" :key="service.id">
        <template #default>
          <!-- Service Card -->
          <div
            @click="openModal(service)"
            class="pt-[14px] pb-[20px] px-[11px] rounded-[16px] overflow-hidden bg-[#EBE4DF] cursor-pointer hover:shadow-lg transition relative">

            <!-- Image -->
            <div class="mb-[14px] h-[137px] rounded-[16px] overflow-hidden">
              <img :src="service.image" alt="Service Image" class="w-full h-full object-cover" />
            </div>

            <!-- Title + Price -->
            <div class="px-[6px]">
              <h3 class="font-medium text-[18px] leading-[100%] text-[#5B605C] mb-[7px] truncate overflow-hidden whitespace-nowrap">
                {{ service.name }}
              </h3>
              <p class="text-[13px] font-[350] text-[#A0576F] leading-[1.2] mb-[8px] truncate overflow-hidden whitespace-nowrap min-h-[16px]">{{ service.brief_description }}</p>
              <div class="flex justify-between">
                <!-- Old Price (if discount) -->
                <p v-if="service.discount_value" class="text-[#A0576F] font-bold text-[12px] leading-[100%] tracking-[-2%] line-through">
                  <span class="sar-icon">&#xe900;</span> {{ service.price_before_discount }}
                </p>

                <!-- Final Price -->
                <p class="text-[#A0576F] font-bold text-[14px] leading-[100%] tracking-[-2%]">
                  <span class="sar-icon">&#xe900;</span> {{ service.price }}
                </p>
              </div>
            </div>

            <!-- Discount Label -->
            <div v-if="service.discount_value"
              class="absolute top-[26px] left-[23px] text-[#A0576F] bg-[#EBE4DF] border-[2px] border-[#A0576F] font-bold outline-[3px] outline-[#EBE4DF] px-[9px] py-[4px] rounded-full animate-pulse-slow transition-transform duration-500 ease-in-out scale-[1] hover:scale-[1.05]"
              style="transform: rotate3d(-3, 1, -3, 6deg);">
              <template v-if="service.discount_type === 'percentage'">
                {{ service.discount_value }}%
              </template>
              <template v-else-if="service.discount_type === 'value'">
                <span class="sar-icon">&#xe900;</span> {{ service.discount_value }}
              </template>
            </div>
          </div>
        </template>
      </BaseCard>
    </div>

    <!-- Loading State -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-[30px]">
      <ServiceCardSkeleton v-for="i in 8" :key="i" />
    </div>

    <!-- Pagination -->
    <Pagination :pagination="menuModule.services.pagination_options" @change="loadPage" />
  </Container>
</template>

<script setup lang="ts">
// Imports
import Container from '@/components/base/Container.vue'
import BaseCard from '@/components/base/Card.vue'
import BaseSlider from '@/components/base/Slider.vue' // ADD
import ServiceCardSkeleton from '~/components/skeletons/ServiceCardSkeleton.vue'
import Pagination from '~/components/base/Pagination.vue'
import ServiceFilters from '~/components/service/ServiceFilters.vue'
import { useMenu } from '~/stores/menu'
import { useApp } from '~/stores/app'
import { COMPONENTS, SERVICE_TYPES, DELIVERY_METHOD } from '~/data/constants'
import { onMounted, ref } from 'vue'
import { usePageTitle } from '~/composables/usePageTitle'
import { useHome } from '~/stores/home' // ADD

usePageTitle("titles.services")

// Define service type
interface Service {
  id: number | string;
  name: string;
  image: string;
  price?: string | number | null;
  duration?: string;
  description?: string;
  extensionOptions?: Array<{ label: string, value: string }>;
  [key: string]: any;
}

// State & Stores

const { setDialogShow, setDialogComponent, setServiceType, setDeliveryMethod } = useApp()
const filters = ref({})
const sliders = ref([])
  setServiceType(SERVICE_TYPES.RESERVATION)
const homeStore = useHome() 
const menuModule = useMenu()
const menuStore = useMenu()

// Init services on mount
onMounted(async () => {
 await setServiceType(SERVICE_TYPES.RESERVATION)
   setDeliveryMethod(DELIVERY_METHOD.RESERVATION)
    homeStore.initializeHome()
          await  menuStore.initMenu()



  getSliders( )
})




function handleBannerClick(item: any) {
  if (!item?.clickable) return
  if (item?.url) {
    window.open(item.url, '_blank') // open in new tab
  }
}


const getSliders= ()=>{


  const params : any ={
     location :"menu" ,
     delivery_method_id :7

}
           useApi("sliders-by-location", { params }, {
                onSuccess: (data: any) => {
                              console.log('sliders', data.data.sliders)

            sliders.value= data.data.sliders
                },
                onError: (err: any) => {
                   
                }
            });}


// Handle pagination
const loadPage = async (page: number) => {
  await menuModule.fetchServices(page)
}

// Open service modal dialog
function openModal(service: Service) {
  menuModule.setService(service)
  setDialogComponent(COMPONENTS.SERVICE_SHOW, {
    modalMaxWidth: 'max-w-[539px]'
  })
  setDialogShow(true)
}
</script>

<style scoped>
/* (Optional) dots styling if needed later */
.services-slider :deep(.dots-style) {}

.guest-btn::before {
  content: url('/assets/img/guest.svg');
  height: 22px;
}

.cart-btn::before {
  content: url('/assets/img/cart-btn.svg');
  height: 22px;
}

.close-tag::before {
  content: url('/assets/img/x.svg');
  width: 17px;
  height: 17px;
  display: block;
}
</style>
