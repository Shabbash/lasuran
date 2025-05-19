<template>
  <div v-if="!isLoading" class="bg-decore-modal mx-auto rounded-[30px] overflow-hidden shadow-lg bg-[#EBE4DF] text-[#5F2C3E]">
    <!-- service details start -->

    <img class="w-full h-[200px] object-cover rounded-[30px]" :src="selectedService.inner_image  ?? selectedService.image" :alt="defaultService.name" />

    <div class="mx-[20px] mt-[20px] mb-[40px] relative">
      <div class="flex justify-between items-center mb-2">
        <h2 class="font-bold text-[30px] text-[#A0576F] leading-[100%]">{{ defaultService.name }}</h2>
        <span class="font-bold text-[19px] text-[#A0576F] leading-[100%]">
                {{ selectedExtension === '' ? 'Price Upon Selection' : selectedService.price + ' SAR' }}
              </span>
      </div>

      <div class="flex items-center text-[14px] text-[#A0576F] font-[500] mb-[10px]">
        {{ selectedService.duration }}
      </div>

      <p class="text-[14px] font-[350] text-[#5F2C3E] leading-[1.6] mb-[18px]">
        {{ defaultService.description }}
      </p>

      <!-- <div class="flex justify-between gap-4">
        <div>
          <p class="font-medium text-[17px] text-[#A0576F] mb-[11px]">Extensions Amount</p>
         <CustomRadio v-model="selectedExtension" :items="selectedService.extensionOptions" />
       </div>

        <div>
          <p class="font-medium text-[17px] text-[#A0576F] mb-[25px]">Guests</p>
          <div @click="addGuest" class="text-center text-[14px] font-normal leading-normal text-[#6B8B9B] h-[42px] px-[20px] rounded-[100px] bg-[#BBCACF] flex items-center justify-between gap-[14px] min-w-[170px] mb-[18px]">
            <span>Yassmin Ahmed</span>
            <span class="close-tag"></span>
          </div>
          <button @click="addGuest"
              class="guest-btn rounded-[100px] border border-dashed border-[#6B8B9B] px-[24px] flex items-center h-[32px] gap-[4px] text-[14px] font-[350] text-[#6B8B9B] min-w-[170px]">
            <span>Add Guest</span>
          </button>
        </div>
      </div> -->

      <BaseButton @click="addToCart" :loading="cartModule.isAddLoading" class="bg-[#A0576F] text-[#EBE4DF] rounded-[100px] w-full py-[16px] justify-center text-[20px] font-normal leading-[100%] tracking-[0] border border-[#A0576F] hover:bg-[#913E5D] transition cursor-pointer mt-[30px]  disabled:bg-[#A0576F]">
        <span>{{ selectedExtension === '' ? '' : selectedService.price + ' SAR - ' }}Continue</span>
      </BaseButton>
<!--      <button-->
<!--          @click="addToCart"-->
<!--          :disabled="selectedExtension === ''"-->
<!--          class="cart-btn flex align-center gap-[24px] w-full text-white py-3 rounded-full font-[600] text-[16px] justify-center mt-[35px]"-->
<!--          :class="selectedExtension === '' ? 'bg-[#a0576f69]' : 'bg-[#A0576F]'">-->
<!--        <span>{{ selectedExtension === '' ? '' : selectedService.price + ' SAR - ' }}Continue</span>-->
<!--      </button>-->
    </div>

  </div>
  <div v-else>
    <ServiceDetailSkeleton />
  </div>
</template>

<script setup lang="ts">

import CustomRadio from "~/components/base/CustomRadio.vue";
import ServiceDetailSkeleton from "~/components/base/ServiceDetailSkeleton.vue";
import {COMPONENTS} from "~/data/constants";
const { setDialogComponent } = useApp();
const menuModule = useMenu();
const cartModule = useCart();
const selectedService = computed(() => menuModule.service.data);
const isLoading = computed(() => menuModule.service.loading);
const defaultService = computed(() => selectedService.value?.products?.[0] ?? selectedService.value);
// const selectedService = {
//   id: 1,
//   title: 'Hair Extensions',
//   image: '/assets/img/service-1.png',
//   price: null,
//   duration: '4 Hours',
//   description: 'Enhance length, volume, and style with premium, natural-looking extensions.',
//   extensionOptions: [
//     { label: '10 Extensions', value: '10' },
//     { label: '20 Extensions', value: '20' },
//     { label: '30 Extensions', value: '30' },
//     { label: '40 Extensions', value: '40' },
//     { label: '50 Extensions', value: '50' }
//   ]
// }

const selectedExtension = ref(null);

const addGuest = () => {
  setDialogComponent(COMPONENTS.SERVICE_GUEST)
}

const addToCart = function() {
  cartModule.addOrUpdateServiceInCart(defaultService.value).then(() => {
    setDialogComponent(COMPONENTS.SERVICE_APPOINTMENT);
  })
}

const continueToAppointment = function () {
  setDialogComponent(COMPONENTS.SERVICE_APPOINTMENT);
}
onMounted(() =>  {
  // @todo Fetching service data
});
</script>

<style scoped>



</style>