<template>
  <div class="max-w-[473px] mx-auto py-[100px]">
    <h2 class="text-[30px] font-bold leading-[165%] tracking-[0] text-center text-[#A0576F] mb-[19px]">
      {{ t('complete_profile') }}
    </h2>

    <div class="space-y-[10px]">
      <!-- First Name -->
      <div :class="['flex items-center gap-[10px] rounded-[13px] px-[23px] bg-transparent', errors.first_name ? 'border border-red-500' : 'border border-[#A0576F]']">
        <UserIcon />
        <input :placeholder="t('first_name_required')" v-model="form.first_name"
          class="py-[16px] w-full text-[15.38px] font-normal text-[#90928F] outline-none placeholder:text-[#A0576F]"
          type="text" />
      </div>

      <!-- Last Name -->
      <div :class="['flex items-center gap-[10px] rounded-[13px] px-[23px] bg-transparent', errors.last_name ? 'border border-red-500' : 'border border-[#A0576F]']">
        <UserIcon />
        <input :placeholder="t('last_name_required')" v-model="form.last_name"
          class="py-[16px] w-full text-[15.38px] font-normal text-[#90928F] outline-none placeholder:text-[#A0576F]"
          type="text" />
      </div>

      <!-- Phone Number -->
      <div class="flex items-center gap-[10px] border border-[#A0576F] rounded-[13px] px-[23px] bg-transparent">
        <MobileIcon />
        <input :placeholder="t('phone_number_auto')" v-model="authModule.getFullOtpMobileNumber" disabled
          class="py-[16px] text-[15.38px] font-normal text-[#90928F] outline-none placeholder:text-[#A0576F] mobile_number"
          type="text"/>
      </div>

      <!-- Email -->
      <div class="flex items-center gap-[10px] border border-[#A0576F] rounded-[13px] px-[23px] bg-transparent">
        <EmailIcon />
        <input :placeholder="t('email_address')" v-model="form.email"
          class="py-[16px] w-full text-[15.38px] font-normal text-[#90928F] outline-none placeholder:text-[#A0576F]"
          type="text" />
      </div>

      <!-- Date of Birth -->
      <div :class="['relative flex items-center gap-[10px] rounded-[13px] px-[23px] bg-transparent', errors.date_of_birth ? 'border border-red-500' : 'border border-[#A0576F]']">
        <UPopover :popper="{ placement: 'bottom-end' }">
          <UButton color="white" variant="link" class="p-0 absolute inset-0 cursor-pointer"></UButton>
          <CalendarIcon />
          <template #content>
            <UCalendar v-model="calendarDate" :locale="'ar-EG'" />
          </template>
        </UPopover>
        <input :placeholder="t('date_of_birth_required')" :value="formattedDateOfBirth" readonly
          class="py-[16px] w-full text-[15.38px] font-normal text-[#90928F] outline-none placeholder:text-[#A0576F]"
          type="text" />
      </div>
    </div>

    <!-- Gender -->
    <div class="mt-[20px]">
      <h4 class="text-[19.11px] font-medium text-[#A0576F]">{{ t('gender_required') }}</h4>
      <div class="flex gap-4 mt-[20px]">
        <div class="flex-1 basis-1/2">
          <input type="radio" id="gender-male" value="Male" v-model="form.gender" name="gender" class="sr-only peer" />
          <label for="gender-male"
            class="block text-center w-full cursor-pointer py-[10px] rounded-full border text-[18px] transition-all"
            :class="[
              form.gender === 'Male' ? 'bg-[#6B8B9B] text-[#EBE4DF] border-[#6B8B9B] shadow-md' : 'bg-transparent text-[#A0576F] border-[#A0576F]',
              errors.gender ? 'border-red-500 text-red-500' : ''
            ]">
            {{ t('male') }}
          </label>
        </div>
        <div class="flex-1 basis-1/2">
          <input type="radio" id="gender-female" value="Female" v-model="form.gender" name="gender" class="sr-only peer" />
          <label for="gender-female"
            class="block text-center w-full cursor-pointer py-[10px] rounded-full border text-[18px] transition-all"
            :class="[
              form.gender === 'Female' ? 'bg-[#6B8B9B] text-[#EBE4DF] border-[#6B8B9B] shadow-md' : 'bg-transparent text-[#A0576F] border-[#A0576F]',
              errors.gender ? 'border-red-500 text-red-500' : ''
            ]">
            {{ t('female') }}
          </label>
        </div>
      </div>
    </div>

    <!-- Submit Button -->
    <BaseButton :label="t('continue')" @click="completeProfile" :loading="authModule.loading"
      class="bg-[#A0576F] text-white rounded-[100px] w-full py-[16px] justify-center text-[18px] font-normal mt-[30px] border border-[#A0576F] hover:bg-[#913E5D] disabled:bg-[#A0576F]" />
  </div>
</template>


<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { CalendarDate } from '@internationalized/date'
import UserIcon from '~/components/icons/UserIcon.vue'
import CalendarIcon from '~/components/icons/CalendarIcon.vue'
import EmailIcon from '~/components/icons/EmailIcon.vue'
import MobileIcon from '~/components/icons/MobileIcon.vue'
import { useAuth } from '~/stores/auth'
import { useProfile } from '~/stores/profile'
import { useToast } from '#imports'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const authModule = useAuth()
const profileStore = useProfile()
const toast = useToast()

const form = ref({
  first_name: '',
  last_name: '',
  email: '',
  gender: '',
  date_of_birth: ''
})

const errors = ref({
  first_name: false,
  last_name: false,
  gender: false,
  date_of_birth: false
})

const calendarDate = ref<CalendarDate | null>(null)

watch(calendarDate, (val) => {
  if (val) {
    const yyyy = val.year
    const mm = String(val.month).padStart(2, '0')
    const dd = String(val.day).padStart(2, '0')
    form.value.date_of_birth = `${yyyy}-${mm}-${dd}`
  }
})

const formattedDateOfBirth = computed(() => {
  if (!calendarDate.value) return ''
  const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const getOrdinal = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd']
    const v = n % 100
    return n + (s[(v - 20) % 10] || s[v] || s[0])
  }
  return `${monthNames[calendarDate.value.month]} - ${getOrdinal(calendarDate.value.day)} - ${calendarDate.value.year}`
})

const completeProfile = async () => {
  // Reset errors
  errors.value = {
    first_name: !form.value.first_name,
    last_name: !form.value.last_name,
    gender: !form.value.gender,
    date_of_birth: !form.value.date_of_birth
  }

  const hasError = Object.values(errors.value).some(Boolean)

  if (hasError) {
    toast.add({ title: 'Please fill in all required fields', color: 'red' })
    return
  }

  const payload = { ...form.value }

  // Remove empty fields
  Object.keys(payload).forEach((key) => {
    if (!payload[key as keyof typeof payload]) {
      delete payload[key as keyof typeof payload]
    }
  })

  await authModule.register(payload)
  await profileStore.fetchProfile()
}
</script>
