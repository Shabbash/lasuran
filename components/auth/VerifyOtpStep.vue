<template>
  <div class="max-w-[473px] mx-auto py-[100px]">
    <div class="text-center">
      <img
        src="/assets/img/register-logo.svg"
        class="mx-auto max-w-[214px] mb-[40px]"
        alt=""
      >
    </div>

    <p class="text-[#5B605C] text-[16px] leading-[150%] mb-2 text-start">
      {{ t('verify_otp_msg') }}<br />
      <span class="text-[#A0576F]">
        +{{ authModule.mobile_code }} {{ authModule.mobile_number }}
      </span>
    </p>

    <!-- OTP Inputs -->
    <div
      class="flex justify-center gap-[18px] mt-[30px] pin-input"
      :class="{ 'pin-input--error': hasOtpError }"
    >
      <UPinInput
        type="number"
        v-model="form.otp"
        :length="4"
        placeholder="•"
        :ui="{
          base:
            'w-[82px] h-[58px] rounded-[12px] text-center text-[22px] font-medium ring-0 focus-visible:ring-0 border-[0.5px] transition-all'
        }"
      />
    </div>

    <!-- Error message under inputs -->
<p
  v-if="hasOtpError"
  class="mt-2 text-center text-[14px] leading-[150%] text-[#C44E4E]"
>
  {{ authModule.otpError || t('invalid_otp') }}
</p>



    <BaseButton
      :loading="authModule.loading"
      @click="onVerifyOtp"
      :label="t('continue')"
      class="bg-[#A0576F] text-white rounded-[100px] w-full py-[16px] mt-[67px] justify-center text-[18px] font-normal leading-[100%] tracking-[0] border border-[#A0576F] hover:bg-[#913E5D] transition cursor-pointer mt-[30px] disabled:bg-[#A0576F]"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuth } from '~/stores/auth'

const { t } = useI18n()
const authModule = useAuth()

const form = ref<{ otp: string[] }>({ otp: ['', '', '', ''] })

const hasOtpError = computed(() => !!authModule.otpError)

// Reset on mount (من الخطوة الأولى)
onMounted(() => {
  authModule.otpError = null
  form.value.otp = ['', '', '', '']
})

watch(
  () => form.value.otp,
  () => {
    authModule.otpError = null
  },
  { deep: true }
)

const onVerifyOtp = () => {
  authModule.verifyOtp({ otp: form.value.otp })
}
</script>



<style>
/* Default: empty state */
.pin-input input {
  background-color: #EBE4DF;
  border-color: #A0576F;
  color: #A0576F;
}

/* Filled state */
.pin-input input:not(:placeholder-shown) {
  background-color: #A0576F !important;
  color: #EBE4DF !important;
  border-color: #A0576F !important;
}

/* Error state for all boxes */
.pin-input.pin-input--error input {
  background-color: rgba(196, 78, 78, 0.08); /* تقريب لـ 40% opacity */
  border-color: #C44E4E !important;
  color: #C44E4E !important;
}

/* Error + filled (لو حابب تكون أغمق شوي) */
.pin-input.pin-input--error input:not(:placeholder-shown) {
  background-color: #c44f4f66 !important;
  border-color: #C44E4E !important;
  color: #C44E4E !important;
}

.pin-input input::placeholder {
  color: transparent !important;
}


</style>