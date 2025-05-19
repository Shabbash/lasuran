<template>
  <Container>
    <ServiceFilters v-model="filters" />
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-[30px]" v-if="!menuModule?.isServicesLoading">
      <BaseCard v-for="service in menuModule.getServices" :key="service.id">
        <template #default>
          <div @click="openModal(service)"
            class="pt-[14px] pb-[20px] px-[11px] rounded-[16px] overflow-hidden bg-[#EBE4DF] cursor-pointer hover:shadow-lg transition">
            <div class=" mb-[14px] h-[137px] rounded-[16px] overflow-hidden">
              <img :src="service.image" alt="Service Image" class="w-full h-full object-cover" />
            </div>

            <div class="px-[6px]">
              <h3 class="font-medium text-[18px] leading-[100%] text-[#5B605C] mb-[7px]">
                {{ service.name }}
              </h3>
              <p class="text-[#A0576F] font-bold text-[14px] leading-[100%] tracking-[-2%]">
                {{ service.price ? service.price + ' SAR' : 'Price Upon Selection' }}
              </p>
            </div>
          </div>
        </template>
      </BaseCard>
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-[30px]">
      <ServiceCardSkeleton v-for="i in 8" :key="i" />
    </div>

    <Dialog v-model:open="modalOpen">
      <template #body>
        <div v-if="selectedService"
          class="bg-decore-modal mx-auto rounded-[30px] overflow-hidden shadow-lg bg-[#EBE4DF] text-[#5F2C3E]">
          <!-- service details start -->


         <img class="w-full h-[200px] object-cover rounded-[30px]" :src="selectedService.image" :alt="selectedService.title" />

          <div class="mx-[20px] mt-[20px] mb-[40px] relative">
            <div class="flex justify-between items-center mb-2">
              <h2 class="font-bold text-[30px] text-[#A0576F] leading-[100%]">{{ selectedService.title }}</h2>
              <span class="font-bold text-[19px] text-[#A0576F] leading-[100%]">
                {{ selectedExtension === '' ? 'Price Upon Selection' : selectedService.price + ' SAR' }}
              </span>
            </div>

            <div class="flex items-center text-[14px] text-[#A0576F] font-[500] mb-[10px]">
              {{ selectedService.duration }}
            </div>

            <p class="text-[14px] font-[350] text-[#5F2C3E] leading-[1.6] mb-[18px]">
              {{ selectedService.description }}
            </p>

            <div class="flex justify-between gap-4">
              <div>
                <p class="font-medium text-[17px] text-[#A0576F] mb-[11px]">Extensions Amount</p>
                <CustomRadio v-model="selectedExtension" :items="selectedService.extensionOptions" />
              </div>

              <div>
                <p class="font-medium text-[17px] text-[#A0576F] mb-[25px]">Guests</p>
                <div class="text-center text-[14px] font-normal leading-normal text-[#6B8B9B] h-[42px] px-[20px] rounded-[100px] bg-[#BBCACF] flex items-center justify-between gap-[14px] min-w-[170px] mb-[18px]">
                  <span>Yassmin Ahmed</span>
                  <span class="close-tag"></span>
                </div>
                <button
                  class="guest-btn rounded-[100px] border border-dashed border-[#6B8B9B] px-[24px] flex items-center h-[32px] gap-[4px] text-[14px] font-[350] text-[#6B8B9B] min-w-[170px]">
                  <span>Add Guest</span>
                </button>
              </div>
            </div>

            <button
              :disabled="selectedExtension === ''"
              class="cart-btn flex align-center gap-[24px] w-full text-white py-3 rounded-full font-[600] text-[16px] justify-center mt-[35px]"
              :class="selectedExtension === '' ? 'bg-[#a0576f69]' : 'bg-[#A0576F]'">
              <span>{{ selectedExtension === '' ? '' : selectedService.price + ' SAR - ' }}Continue</span>
            </button>
          </div>

        </div>
      </template>
    </Dialog>
  </Container>
</template>
<script setup lang="ts">
import Container from '@/components/base/Container.vue'
import BaseCard from '@/components/base/Card.vue'
import Dialog from '@/components/base/Dialog.vue'
import CustomRadio from '@/components/base/CustomRadio.vue'
import ServiceCardSkeleton from '@/components/base/ServiceCardSkeleton.vue'
import type { TabsItem, RadioGroupItem, RadioGroupValue } from '@nuxt/ui'
import { CalendarDate } from '@internationalized/date'
import {COMPONENTS} from "~/data/constants";

const menuModule = useMenu();
// getProducts
menuModule.initMenu();

// --------------111 start --------------------//
const services = [
  {
    id: 1,
    title: 'Hair Extensions',
    image: '/assets/img/service-1.png',
    price: null,
    duration: '4 Hours',
    description: 'Enhance length, volume, and style with premium, natural-looking extensions.',
    extensionOptions: [
      { label: '10 Extensions', value: '10' },
      { label: '20 Extensions', value: '20' },
      { label: '30 Extensions', value: '30' },
      { label: '40 Extensions', value: '40' },
      { label: '50 Extensions', value: '50' }
    ]
  },
  {
    id: 2,
    title: 'Mini Keratin Treatment',
    image: '/assets/img/service-2.png',
    price: '1000',
    duration: '3 Hours',
    description: 'Smooth and strengthen your hair with our keratin treatment.',
    extensionOptions: [
      { label: 'Short Hair', value: 'short' },
      { label: 'Medium Hair', value: 'medium' },
      { label: 'Long Hair', value: 'long' }
    ]
  },
  {
    id: 3,
    title: 'Haircut with Blow Dry',
    image: '/assets/img/service-3.png',
    price: '500',
    duration: '1 Hour',
    description: 'Get a professional haircut with a smooth blow dry finish.',
    extensionOptions: [
      { label: 'Basic Cut', value: 'basic' },
      { label: 'Layered Cut', value: 'layered' },
      { label: 'Bob Style', value: 'bob' }
    ]
  },
  {
    id: 4,
    title: 'Makeup Session',
    image: '/assets/img/service-1.png',
    price: '700',
    duration: '2 Hours',
    description: 'Full makeup session for events and special occasions.',
    extensionOptions: [
      { label: 'Natural Look', value: 'natural' },
      { label: 'Evening Glam', value: 'glam' },
      { label: 'Bridal', value: 'bridal' }
    ]
  },
  {
    id: 5,
    title: 'Eyebrows & Eyelashes',
    image: '/assets/img/service-2.png',
    price: '250',
    duration: '45 Minutes',
    description: 'Shape your eyebrows and enhance your lashes for a defined look.',
    extensionOptions: [
      { label: 'Eyebrow Shaping', value: 'brow' },
      { label: 'Lash Lift', value: 'lift' },
      { label: 'Brow & Lash Combo', value: 'combo' }
    ]
  },
  {
    id: 6,
    title: 'Relaxing Massage',
    image: '/assets/img/service-3.png',
    price: '450',
    duration: '1.5 Hours',
    description: 'Unwind with a relaxing full body massage tailored to your comfort.',
    extensionOptions: [
      { label: '30 mins', value: '30' },
      { label: '60 mins', value: '60' },
      { label: '90 mins', value: '90' }
    ]
  }
]

// --------------111 end--------------------//
const selectedService = ref<typeof services[0] | null>(null)
const selectedExtension = ref<RadioGroupValue>('')


const modalOpen = ref(false)

const { setDialogShow , setDialogComponent } = useApp();


function openModal(service: any) {
  menuModule.setService(service)
  setDialogComponent(COMPONENTS.SERVICE_SHOW);
  setDialogShow(true);
  // selectedService.value = service
  // selectedExtension.value = ''
  // modalOpen.value = true
}


// --------------222--------------------//


const reserveOption = ref('')

// --------------calender start ------//
const professionals = [
  { label: 'John Doe', value: 'john' },
  { label: 'Jane Smith', value: 'jane' }
]

const selectedProfessional = ref(null)
const value = ref(new CalendarDate(2022, 2, 3))


const times = [
  { label: '09:30 PM', value: '21:30' },
  { label: '10:00 PM', value: '22:00' },
  { label: '10:30 PM', value: '22:30' }
]

const selectedTime = ref('21:30')


const filters = ref({

});
// --------------calender end -----//

</script>

<style scoped>



/*
.main-category>.bg-primary,
.sub-category>.bg-primary {
  background-color: transparent !important;
}

.main-category .custom-tab {
  font-size: 15px !important;
  border-radius: 100px !important;
  font-weight: 500;

}

.main-category .custom-tab[aria-selected='false'] {
  background-color: #A0576F !important;
  color: #BBCACF !important;
  border: 1px solid #BBCACF !important;
}

.main-category .custom-tab[aria-selected='true'],
.sub-category .custom-tab[aria-selected='true'] {
  background-color: #EBE4DF !important;
  color: #A0576F !important;
  border: 1px solid #EBE4DF !important;
}

[aria-selected='false'] .i-male-icon {
  content: url('/assets/img/male-icon.svg') !important;
}


[aria-selected='true'] .i-male-icon {
  content: url('/assets/img/male-icon-active.svg') !important;
}


[aria-selected='false'] .i-female-icon {
  content: url('/assets/img/female-icon.svg') !important;
}


[aria-selected='true'] .i-female-icon {
  content: url('/assets/img/female-icon-active.svg') !important;
}

.sub-category .custom-tab {
  border: 0 !important;
  padding: 6px 16px !important;
  font-size: 15px;
  border-radius: 100px !important;

}

.sub-category .custom-tab[aria-selected='false'] {
  background-color: #F6F6F64D !important;
  color: #2B2B2B !important;
  font-weight: 200;
}

.custom-tab .truncate {
  text-overflow: unset;
  white-space: nowrap;

}

.guest-btn {}

.guest-btn::before {
  content: url('/assets/img/guest.svg');
  height: 22px;
}


.cart-btn {}

.cart-btn::before {
  content: url('/assets/img/cart-btn.svg');
  height: 22px;
}

.close-tag {}

.close-tag::before {
  content: url('/assets/img/x.svg');
  width: 17px;
  height: 17px;
  display: block;
}


.time-group label:has(*[data-state="checked"]) p {
  color: white;
  font-weight: bold;
} */
</style>
