<template>
  <div class="max-w-[473px] mx-auto py-[100px]">
    <h2 class="text-[30px] font-bold leading-[165%] tracking-[0] text-center text-[#A0576F] mb-[19px]">
      Complete Profile
    </h2>

    <div class="space-y-[10px]">
      <!-- First Name -->
      <div class="flex items-center gap-[10px] border border-[#A0576F] rounded-[13px] px-[23px] bg-transparent">
        <UserIcon />
        <input placeholder="First Name" v-model="form.first_name"
          class="py-[16px] w-full text-[15.38px] font-normal text-[#90928F] outline-none placeholder:text-[#A0576F]"
          type="text" />
      </div>

      <!-- Last Name -->
      <div class="flex items-center gap-[10px] border border-[#A0576F] rounded-[13px] px-[23px] bg-transparent">
        <UserIcon />
        <input placeholder="Last Name" v-model="form.last_name"
          class="py-[16px] w-full text-[15.38px] font-normal text-[#90928F] outline-none placeholder:text-[#A0576F]"
          type="text" />
      </div>

      <!-- Phone Number -->
      <div class="flex items-center gap-[10px] border border-[#A0576F] rounded-[13px] px-[23px] bg-transparent">
        <MobileIcon />
        <input placeholder="Phone Number (Auto filled)" v-model="authModule.getFullOtpMobileNumber" disabled
          class="py-[16px] w-full text-[15.38px] font-normal text-[#90928F] outline-none placeholder:text-[#A0576F]"
          type="text" />
      </div>

      <!-- Email -->
      <div class="flex items-center gap-[10px] border border-[#A0576F] rounded-[13px] px-[23px] bg-transparent">
        <EmailIcon />
        <input placeholder="Email Address" v-model="form.email"
          class="py-[16px] w-full text-[15.38px] font-normal text-[#90928F] outline-none placeholder:text-[#A0576F]"
          type="text" />
      </div>

      <!-- Date of Birth -->
      <div class="flex items-center gap-[10px] border border-[#A0576F] rounded-[13px] px-[23px] bg-transparent">


        <UPopover :popper="{ placement: 'bottom-end' }">
          <UButton color="white" variant="link" class="p-0">
            <CalendarIcon />
          </UButton>
          <template #content>
            <UCalendar v-model="calendarDate" />
          </template>
        </UPopover>
        <input placeholder="Date Of Birth (Optional)" :value="formattedDateOfBirth" readonly
          class="py-[16px] w-full text-[15.38px] font-normal text-[#90928F] outline-none placeholder:text-[#A0576F]"
          type="text" />
      </div>
    </div>

    <!-- Gender -->
    <div class="mt-[20px]">
      <h4 class="text-[19.11px] font-medium text-[#A0576F]">Gender</h4>
      <div class="flex gap-4 mt-[20px]">
        <div class="flex-1 basis-1/2">
          <input type="radio" id="gender-male" value="Male" v-model="form.gender" name="gender" class="sr-only peer" />
          <label for="gender-male"
            class="block text-center w-full cursor-pointer py-[10px] rounded-full border border-[#A0576F] text-[#A0576F] text-[18px] bg-transparent transition-all peer-checked:bg-[#6B8B9B] peer-checked:text-[#EBE4DF] peer-checked:border-[#6B8B9B] peer-checked:shadow-md">
            Male
          </label>
        </div>
        <div class="flex-1 basis-1/2">
          <input type="radio" id="gender-female" value="Female" v-model="form.gender" name="gender"
            class="sr-only peer" />
          <label for="gender-female"
            class="block text-center w-full cursor-pointer py-[10px] rounded-full border border-[#A0576F] text-[#A0576F] text-[18px] bg-transparent transition-all peer-checked:bg-[#6B8B9B] peer-checked:text-[#EBE4DF] peer-checked:border-[#6B8B9B] peer-checked:shadow-md">
            Female
          </label>
        </div>
      </div>
    </div>

    <!-- Submit Button -->
    <BaseButton label="Continue" @click="completeProfile" :loading="authModule.loading"
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

const authModule = useAuth()
const profileStore = useProfile()

const form = ref({
  first_name: '',
  last_name: '',
  email: '',
  gender: 'Male',
  date_of_birth: ''
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
  const payload = { ...form.value }

  // احذف الحقول الفارغة
  Object.keys(payload).forEach((key) => {
    if (!payload[key as keyof typeof payload]) {
      delete payload[key as keyof typeof payload]
    }
  })

  await authModule.register(payload)
  await profileStore.fetchProfile()
}
</script>
