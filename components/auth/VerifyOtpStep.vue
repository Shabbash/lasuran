<template>
  <div class="max-w-[473px] mx-auto py-[100px]">
    <div class="text-center">
      <img src="/assets/img/register-logo.svg" class="mx-auto max-w-[214px] mb-[40px]" alt="">
    </div>

    <p class="text-[#5B605C] text-[16px] leading-[150%] mb-2 text-start">
      {{ t('verify_otp_msg') }}<br />
      <span class="text-[#A0576F]">+{{ authModule.mobile_code }} {{ authModule.mobile_number }}</span>
    </p>

    <!-- OTP Inputs -->
    <div class="flex justify-center gap-[18px] mt-[30px]">
      <UPinInput
        type="number"
        v-model="form.otp"
        :length="4"
        :ui="{ base: 'w-[82px] h-[58px] border-[0.5px] border-[#A0576F] bg-transparent' }"
      />
    </div>

    <BaseButton
      :loading="authModule.loading"
      @click="onVerifyOtp"
      :label="t('continue')"
      class="bg-[#A0576F] text-white rounded-[100px] w-full py-[16px] mt-[67px] justify-center text-[18px] font-normal leading-[100%] tracking-[0] border border-[#A0576F] hover:bg-[#913E5D] transition cursor-pointer mt-[30px] disabled:bg-[#A0576F]"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuth } from '~/stores/auth'

const { t } = useI18n()
const authModule = useAuth()

const form = ref({ otp: null })

const onVerifyOtp = () => {
  authModule.verifyOtp(form.value)
}
</script>
