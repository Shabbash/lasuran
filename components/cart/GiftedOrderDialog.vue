<template>
  <div class="mx-auto px-[27px] py-[40px]">
    <h2 class="text-[30px] font-bold leading-[165%] tracking-[0] text-center text-[#A0576F] mb-[30px]">
      {{ t('gift_dialog_title') }}
    </h2>

    <div class="space-y-[10px] text-[#5B605C] text-[15.38px]">
      <!-- First Name -->
      <div class="flex items-center gap-[10px] border border-[#A0576F] rounded-[13px] px-[23px] bg-transparent">
        <UserIcon />
        <input
          v-model="giftData.first_name"
          :placeholder="t('gift_first_name_placeholder')"
          class="py-[16px] w-full outline-none placeholder:text-[#a0576f59]"
          type="text"
        />
      </div>

      <!-- Last Name -->
      <div class="flex items-center gap-[10px] border border-[#A0576F] rounded-[13px] px-[23px] bg-transparent">
        <UserIcon />
        <input
          v-model="giftData.last_name"
          :placeholder="t('gift_last_name_placeholder')"
          class="py-[16px] w-full outline-none placeholder:text-[#a0576f59]"
          type="text"
        />
      </div>

      <!-- Mobile -->
      <div class="flex rounded-[14.37px] border border-[#A0576F] px-[18px] py-[15px] text-[#A0576F]">
        <div class="flex items-center gap-2">
          <img src="/assets/img/sa-flag.svg" alt="saudi-flag" class="w-[35px] h-[23px]" />
          <span class="font-medium">+{{ giftData.mobile_code }}</span>
        </div>
        <div class="mx-[18px] border-l border-[#BBCACF]"></div>
        <input
          v-model="giftData.mobile_number"
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          maxlength="9"
          @input="formatMobileNumber"
          :placeholder="t('gift_mobile_number_placeholder')"
          class="flex-1 outline-none bg-transparent placeholder:text-[#D3C9C5]"
        />
      </div>

      <!-- Email -->
      <div class="flex items-center gap-[10px] border border-[#A0576F] rounded-[13px] px-[23px] bg-transparent">
        <EmailIcon />
        <input
          v-model="giftData.email"
          placeholder="example@domain.com"
          class="py-[16px] w-full outline-none placeholder:text-[#a0576f59]"
          type="text"
        />
      </div>

      <!-- Gender -->
      <div class="mt-2">
        <p class="text-start text-[14px] font-medium text-[#5B605C] mb-3">
          {{ t('profile_gender') }}
        </p>
        <div class="flex gap-4">
          <div class="flex-1 basis-1/2">
            <input
              id="gender-male"
              type="radio"
              value="Male"
              v-model="giftData.gender"
              name="gender"
              class="sr-only peer"
            />
            <label
              for="gender-male"
              class="block text-center w-full cursor-pointer py-[10px] rounded-full border border-[#A0576F] text-[#A0576F] text-[16px] bg-transparent transition-all peer-checked:bg-[#A0576F] peer-checked:text-white peer-checked:border-[#A0576F]"
            >
              {{ t('profile_gender_male') }}
            </label>
          </div>
          <div class="flex-1 basis-1/2">
            <input
              id="gender-female"
              type="radio"
              value="Female"
              v-model="giftData.gender"
              name="gender"
              class="sr-only peer"
            />
            <label
              for="gender-female"
              class="block text-center w-full cursor-pointer py-[10px] rounded-full border border-[#A0576F] text-[#A0576F] text-[16px] bg-transparent transition-all peer-checked:bg-[#A0576F] peer-checked:text-white peer-checked:border-[#A0576F]"
            >
              {{ t('profile_gender_female') }}
            </label>
          </div>
        </div>
      </div>

      <!-- Message -->
      <div class="border border-[#A0576F] rounded-[13px] px-[23px] bg-transparent">
        <textarea
          v-model="giftData.message"
          :placeholder="t('gift_message_placeholder')"
          rows="3"
          class="w-full py-[16px] outline-none bg-transparent resize-none placeholder:text-[#a0576f59]"
        />
      </div>

      <!-- Confirm -->
      <BaseButton
        :disabled="!isFormValid"
        @click="handleConfirm"
        class="bg-[#A0576F] text-white rounded-[100px] w-full py-[16px] justify-center text-[18px] font-normal mt-[20px] hover:bg-[#913E5D] disabled:bg-[#913E5D] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ t('gift_confirm_button') }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onUnmounted } from 'vue'
import { useApp } from '~/stores/app'
import { useCart } from '~/stores/cart'
import { useI18n } from 'vue-i18n'

import UserIcon from '@/components/icons/UserIcon.vue'
import EmailIcon from '@/components/icons/EmailIcon.vue'

const { t } = useI18n()
const appStore = useApp()
const cartStore = useCart()

const hasConfirmed = ref(false)

/** Local state for the gift dialog */
const giftData = ref({
  first_name: '',
  last_name: '',
  mobile_code: '966',
  mobile_number: '',
  email: '',
  message: '',
  gender: '' as '' | 'Male' | 'Female'
})

/** Basic form validation — keep gender optional unless you want it required */
const isFormValid = computed(() => {
  const mobileValid = /^[0-9]{9,}$/.test(giftData.value.mobile_number.trim())
  return (
    giftData.value.first_name.trim() !== '' &&
    giftData.value.last_name.trim() !== '' &&
    mobileValid
  )
})

/** Normalize mobile input to digits only */
const formatMobileNumber = () => {
  giftData.value.mobile_number = giftData.value.mobile_number.replace(/\D/g, '')
}

/** Confirm and persist into cart params (gender included safely) */
const handleConfirm = () => {
  hasConfirmed.value = true

  const mobileCode = giftData.value.mobile_code.replace('+', '').trim()
  const mobileNumber = giftData.value.mobile_number.trim()

  // Build gifted payload while keeping TS types happy (only add gender if present)
  const giftedPayload: Record<string, any> = {
    first_name: giftData.value.first_name.trim(),
    last_name: giftData.value.last_name.trim(),
    mobile_code: mobileCode,
    mobile_number: `${mobileCode}${mobileNumber}`,
    email: giftData.value.email?.trim() || ''
  }
  if (giftData.value.gender) {
    giftedPayload.gender = giftData.value.gender
  }

  cartStore.params = {
    ...cartStore.params,
    is_gifted_order: 1,
    gifted_order_data: giftedPayload as any, // keep store typing intact if it doesn't include gender
    gift_message: giftData.value.message?.trim() || ''
  }

  window.dispatchEvent(new CustomEvent('giftConfirmed'))
  appStore.setDialogShow(false)
}

/** Prefill from existing cart params if available */
watch(
  () => cartStore.params?.gifted_order_data,
  (val: any) => {
    if (val) {
      giftData.value = {
        first_name: val.first_name || '',
        last_name: val.last_name || '',
        mobile_code: val.mobile_code || '966',
        // If backend stored full number (e.g., 9665xxxxxxx), strip leading code copy for UX
        mobile_number: (val.mobile_number || '').replace(new RegExp(`^\\+?${val.mobile_code || '966'}`), ''),
        email: val.email || '',
        message: cartStore.params?.gift_message || '',
        gender: val.gender || ''
      }
    }
  },
  { immediate: true, deep: true }
)

onUnmounted(() => {
  if (!hasConfirmed.value) {
    window.dispatchEvent(new CustomEvent('giftNotConfirmed'))
  }
})
</script>
