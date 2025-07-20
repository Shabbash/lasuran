<template>
  <div class="bg-decore-modal mx-auto rounded-[30px] overflow-hidden shadow-lg bg-[#EBE4DF] text-[#5F2C3E]">
    <!-- service details start -->

    <!-- success start -->
    <div class="px-[27px] pt-[80px] pb-[40px]">
      <div class="text-center">
        <img src="/assets/img/reservation-success.svg" class="mx-auto W-[270px]" alt="">
      </div>

      <!-- Reservation title translated -->
      <h2 class="text-[#A0576F] text-center text-[20px] font-bold leading-normal mt-[38px]">
        {{ t('reservation_added_to_cart') }}
      </h2>

      <!-- Cart button translated -->
      <button
        @click="onHomeClick"
        class="bg-[#A0576F] flex align-center gap-[24px] w-full text-[#EBE4DF] py-3 rounded-full font-[400] text-[20px] justify-center mt-[90px]">
        <span>{{ t('go_to_cart') }}</span>
      </button>
    </div>
    <!-- success end -->
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { COMPONENTS } from "~/data/constants"

const { t } = useI18n()
const { setDialogShow, setDialogComponent } = useApp()

const onHomeClick = () => {
  setDialogShow(false)
  navigateTo({ path: "/cart" })
}
</script>
