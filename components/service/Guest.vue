<template>
  <div class="bg-decore-modal mx-auto rounded-[30px] overflow-hidden shadow-lg bg-[#EBE4DF] text-[#5F2C3E]">
    <!-- add guest start -->
     <div class="pt-[40px] pb-[60px] px-[27px]">
      <h2 class="text-center text-[23px] font-bold leading-normal text-[#A0576F] mb-[30px]">Add Guest</h2>
      <div class="space-y-[10px]">
        <div v-for="placeholder in ['Guest Name', 'Guest Phone Number']" :key="placeholder">
          <div
            class="flex items-center gap-[10px] border border-[#A0576F] rounded-[13px] px-[23px] bg-transparent">
            <input :placeholder="placeholder" :readonly="placeholder.includes('Auto filled')"
              class="py-[16px] w-full text-[15.38px] font-normal leading-[100%] tracking-[0] text-[#90928F] outline-none placeholder:text-[#a0576f59]"
              type="text" />
          </div>
        </div>
        <div class="flex items-center gap-[10px] border border-[#A0576F] rounded-[13px] px-[23px] bg-transparent">
          <textarea class="py-[16px] w-full text-[15.38px] font-normal leading-[100%] tracking-[0] text-[#90928F] outline-none placeholder:text-[#a0576f59] h-[180px]" name="" id=""></textarea>
        </div>
      </div>
      <button @click="submitAddToGuest" class="bg-[#A0576F] flex align-center gap-[24px] w-full text-white py-3 rounded-full font-[600] text-[16px] justify-center mt-[90px]">
        <span>Add</span>
      </button>
    </div>
    <!-- add guest end -->

    <!-- calendar start -->
    <!--          <div class="relative z-[1] pt-[42px] px-[80px] pb-[20px]">-->
    <!--            <button-->
    <!--              class="w-[42px] h-[42px] rounded-full bg-[#A0576F] text-white flex items-center justify-center hover:bg-[#913E5D] transition cursor-pointer absolute top-[24px] start-[28px]">-->
    <!--              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">-->
    <!--                <path-->
    <!--                  d="M17.5 22.1666C17.3464 22.1675 17.1942 22.1381 17.0521 22.08C16.91 22.022 16.7807 21.9364 16.6717 21.8283L9.67166 14.8283C9.45436 14.6097 9.3324 14.314 9.3324 14.0058C9.3324 13.6976 9.45436 13.4019 9.67166 13.1833L16.6717 6.1833C16.8948 5.99217 17.1819 5.8923 17.4756 5.90364C17.7692 5.91498 18.0477 6.0367 18.2555 6.24448C18.4633 6.45226 18.585 6.73079 18.5963 7.02441C18.6077 7.31803 18.5078 7.60512 18.3167 7.8283L12.145 14L18.3167 20.1716C18.4805 20.3341 18.5924 20.5415 18.6384 20.7677C18.6843 20.9938 18.6622 21.2284 18.5748 21.442C18.4874 21.6555 18.3386 21.8383 18.1473 21.9673C17.956 22.0963 17.7307 22.1657 17.5 22.1666Z"-->
    <!--                  fill="white" />-->
    <!--              </svg>-->
    <!--            </button>-->

    <!--            <h2 class="text-center text-[23px] font-bold leading-normal text-[#A0576F] mb-[40px]">Book Services</h2>-->

    <!--            <label class="flex items-center gap-[12px] text-[16px] font-normal leading-normal text-[#6B8B9B]">-->
    <!--              <input type="radio" class="hidden" name="reservation" value="someone-else" v-model="reserveOption" />-->
    <!--              <span class="w-[20px] h-[20px] rounded-full border border-[#A0576F] flex items-center justify-center">-->
    <!--                <span v-if="reserveOption === 'someone-else'"-->
    <!--                  class="w-[10px] h-[10px] bg-[#A0576F] rounded-full"></span>-->
    <!--              </span>-->
    <!--              Reserve for someone else-->
    <!--            </label>-->

    <!--            <div class="mb-[17px]">-->
    <!--              <h3 class="text-[21px] font-medium leading-normal text-[#A0576F] mt-[40px] mb-[14px]">Deep Facial Cleanse-->
    <!--              </h3>-->

    <!--              <USelect v-model="selectedProfessional" :items="professionals" placeholder="Select professional"-->
    <!--                class="rounded-[100px] border border-[#A0576F] bg-[#EBE4DF] text-[14px] font-normal leading-normal text-[#90928F] w-full"-->
    <!--                size="lg" />-->
    <!--            </div>-->

    <!--            <div class="mb-[12px]">-->
    <!--              <h3 class="text-[17px] font-normal leading-normal text-[#A0576F] mb-[12px]">Select Date</h3>-->
    <!--              <UCalendar v-model="value" />-->
    <!--            </div>-->

    <!--            <div class="">-->
    <!--              <h3 class="text-[17px] font-normal leading-normal text-[#A0576F] mb-[12px]">Availabe Time</h3>-->

    <!--              <URadioGroup v-model="selectedTime" orientation="horizontal" indicator="hidden" variant="card"-->
    <!--                :items="times" class="flex gap-4 flex-wrap" :ui="{-->
    <!--                  root: 'relative block',-->
    <!--                  fieldset: 'flex justify-between',-->
    <!--                  legend: 'mb-1 block font-medium text-default',-->
    <!--                  item: 'flex items-start bg-[#E6CDC7A3] rounded-[52px] border-0 flex justify-center items-center px-[19px] py-[14px] text-center text-[15px] font-normal leading-normal has-data-[state=checked]:bg-[#A0576F]',-->
    <!--                  container: 'flex items-center',-->
    <!--                  base: 'rounded-full ring ring-inset ring-accented overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2',-->
    <!--                  indicator: 'flex items-center justify-center size-full after:bg-default after:rounded-full',-->
    <!--                  wrapper: 'w-full',-->
    <!--                  label: 'block font-medium text-[#A0576F]',-->
    <!--                  description: 'text-muted',-->
    <!--                }" />-->


    <!--            </div>-->

    <!--            <button :disabled="selectedExtension === ''"-->
    <!--              class="cart-btn flex align-center gap-[24px] w-full text-white py-3 rounded-full font-[600] text-[16px] justify-center mt-[35px]"-->
    <!--              :class="selectedExtension === '' ? 'bg-[#a0576f69]' : 'bg-[#A0576F]'">-->
    <!--              <span>{{ selectedExtension === '' ? '' : selectedService.price + ' SAR - ' }}Continue</span>-->
    <!--            </button>-->
    <!--          </div>-->
    <!-- calendar end -->

    <!-- success start -->
    <!-- <div class="px-[27px] pt-[80px] pb-[40px]">

     <div class="text-center">
       <img src="/assets/img/reservation-success.svg" class="mx-auto W-[270px]" alt="">
     </div>

     <h2 class="text-[#A0576F] text-center text-[20px] font-bold leading-normal mt-[38px]">Reservation Added to Cart</h2>

     <button
       class="bg-[#A0576F] flex align-center gap-[24px] w-full text-[#EBE4DF] py-3 rounded-full font-[400] text-[20px] justify-center mt-[90px]">
       <span>Home</span>
     </button>
   </div> -->
    <!-- success end -->

  </div>
</template>

<script setup lang="ts">

import {COMPONENTS} from "~/data/constants";

const  { setDialogComponent} :any = useApp();

const submitAddToGuest = function() {
  setDialogComponent(COMPONENTS.SERVICE_SHOW);
}
</script>

<style scoped>



</style>