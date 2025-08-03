<template>
  <ProfileSkeleton v-if="!profileStore.profile" />

  <div v-else
    class="py-[34px] px-[15px] md:px-[30px] h-full flex flex-col border border-[#AD7084] border-solid rounded-[20px]">
    <div>
      <div class="flex flex-col items-center mb-8">
        <div class="relative mb-4">
          <img :src="imagePreview || profileStore.profile?.image_profile || '/assets/img/imgg3.png'"
            :alt="getFullName() || 'Lasuran Logo'" class="w-[139px] h-[139px] rounded-full bg-rose-100 object-cover"
            :class="{ 'ring-4 ring-yellow-400 ring-opacity-50': selectedImage }" />
          <input ref="fileInput" type="file" accept="image/*" @change="handleImageUpload" class="hidden" />
          <button @click="fileInput?.click()"
            class="absolute bottom-2 right-1 rounded-full p-1 text-white bg-[#6B8B9B] w-[30px] h-[30px] flex items-center justify-center cursor-pointer"
            type="button">
            <CameraIcon />
          </button>

          <!-- Upload indicator -->
          <div v-if="selectedImage"
            class="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
            {{ $t('profile_image_pending') }}
          </div>
        </div>

        <h2 class="text-xl font-medium text-[#EBE4DF]">{{ getFullName() || user.name }}</h2>
        <p v-if="selectedImage" class="text-xs text-yellow-400 mt-1">
          {{ $t('profile_image_pending_hint') }}
        </p>




      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- First Name -->
        <div>
          <p class="text-start text-[14px] font-medium text-white mb-2">
            {{ $t('profile_first_name') }}
          </p>
          <input type="text" v-model="formData.first_name" :placeholder="$t('profile_first_name_placeholder')"
            class="w-full h-[50px] rounded-[14px] border border-[#EBE4DF] bg-transparent px-4 text-[#BBCACF] placeholder:text-[#D3C9C5] text-[14px] outline-none" />
        </div>

        <!-- Last Name -->
        <div>
          <p class="text-start text-[14px] font-medium text-white mb-2">
            {{ $t('profile_last_name') }}
          </p>
          <input type="text" v-model="formData.last_name" :placeholder="$t('profile_last_name_placeholder')"
            class="w-full h-[50px] rounded-[14px] border border-[#EBE4DF] bg-transparent px-4 text-[#BBCACF] placeholder:text-[#D3C9C5] text-[14px] outline-none" />
        </div>
        <!-- Phone Number -->
        <div>
          <p class="text-start text-[14px] font-medium text-white mb-3">
            {{ $t('profile_phone_number') }}
          </p>
          <div
            class="flex rounded-[14px] border-[1.2px] border-[#EBE4DF] px-[18px] py-[10px] text-[16.76px] font-normal leading-[31px] h-[50px] tracking-[2.61px] text-[#BBCACF]">
            <div class="flex items-center gap-2">
              <img src="/assets/img/sa-flag.svg" alt="saudi-flag" class="w-[35px] h-[23px]" />
              <span class="text-[#BBCACF] font-medium text-[14px]">+966</span>
            </div>
            <div class="mx-[18px] border-l border-[#BBCACF]"></div>
            <input type="text" placeholder="50 XXXX XXXX"
              :value="formatPhoneNumber(profileStore.profile?.mobile_number || '') || user.phone" readonly
              class="flex-1 outline-none bg-transparent text-[#BBCACF] placeholder:text-[#D3C9C5] text-[14px]" />
          </div>
        </div>

        <!-- Email -->
        <div>
          <p class="text-start text-[14px] font-medium text-white mb-3">
            {{ $t('profile_email') }}
          </p>
          <input type="email" v-model="formData.email" :placeholder="$t('profile_email_placeholder')"
            class="w-full h-[50px] rounded-[14px] border border-[#EBE4DF] bg-transparent px-4 text-[#BBCACF] placeholder:text-[#D3C9C5] text-[14px] outline-none" />
        </div>

        <!-- Date of Birth -->
        <div>
          <p class="text-start text-[14px] font-medium text-white mb-3">
            {{ $t('profile_date_of_birth') }}
          </p>
          <div
            class="relative flex items-center gap-[10px] border border-[#EBE4DF] rounded-[13px] px-[23px] bg-transparent">
            <UPopover :popper="{ placement: 'bottom-end' }">
              <UButton color="white" variant="link" class="p-0 absolute inset-0 cursor-pointer" />
              <CalendarIcon3 />
              <template #content>
                <UCalendar v-model="calendarDate" :locale="'ar-EG'" />
              </template>
            </UPopover>
            <input :placeholder="$t('profile_date_placeholder')" :value="formData.date_of_birth" readonly
              class="flex-1 outline-none bg-transparent text-[#BBCACF] placeholder:text-[#D3C9C5] text-[14px] h-[50px]"
              type="text" />
          </div>
        </div>

        <!-- City -->
        <!-- <div>
          <p class="text-start text-[14px] font-medium text-white mb-3">
            {{ $t('profile_city') }}
          </p>
          <div class="relative">
            <div class="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
              <LocationIcon2 />
            </div>
            <select v-model="formData.address"
              class="w-full h-[50px] ps-10 pe-4 py-2 rounded-[14px] bg-[#A0576F] ring-1 ring-[#EBE4DF] focus:ring-0 focus:border-[#A0576F] text-[#BBCACF] placeholder:text-[#D3C9C5] text-[14px] appearance-none">
              <option disabled value="">{{ $t('profile_city_placeholder') }}</option>
              <option v-for="city in cities" :key="city.value" :value="city.value">
                {{ city.label }}
              </option>
            </select>
            <div class="absolute inset-y-0 end-0 pe-3 flex items-center pointer-events-none">
              <SelectArrowIcon />
            </div>
          </div>
        </div> -->

        <!-- Gender -->
        <div>
          <p class="text-start text-[14px] font-medium text-white mb-3">
            {{ $t('profile_gender') }}
          </p>
          <div class="flex gap-4">
            <div class="flex-1 basis-1/2">
              <input type="radio" id="gender-male" value="Male" v-model="formData.gender" name="gender"
                class="sr-only peer" />
              <label for="gender-male"
                class="block text-center w-full cursor-pointer py-[10px] rounded-full border border-[#EBE4DF] text-[#EBE4DF] text-[18px] bg-transparent transition-all peer-checked:bg-[#6B8B9B] peer-checked:text-[#EBE4DF] peer-checked:border-[#6B8B9B]">
                {{ $t('profile_gender_male') }}
              </label>
            </div>
            <div class="flex-1 basis-1/2">
              <input type="radio" id="gender-female" value="Female" v-model="formData.gender" name="gender"
                class="sr-only peer" />
              <label for="gender-female"
                class="block text-center w-full cursor-pointer py-[10px] rounded-full border border-[#EBE4DF] text-[#EBE4DF] text-[18px] bg-transparent transition-all peer-checked:bg-[#6B8B9B] peer-checked:text-[#EBE4DF] peer-checked:border-[#6B8B9B]">
                {{ $t('profile_gender_female') }}
              </label>
            </div>
          </div>
        </div>

        <!-- Delete Profile Button -->
        <div class="flex items-end">
          <BaseButton :label="$t('profile_delete_profile')" @click="deleteProfile"
            class="bg-[#C44E4E] text-[#EBE4DF] rounded-[100px] py-[10px] px-8 text-[14px] hover:bg-[#913E5D] transition cursor-pointer w-auto" />
        </div>
      </div>

      <!-- Save Button -->
      <div class="flex justify-end gap-6 justify-items-end mt-[30px]">
        <BaseButton :loading="profileStore.isUpdating"
          :label="profileStore.isUpdating ? $t('profile_saving') : $t('profile_save')"
          :disabled="profileStore.isUpdating" @click="saveProfile"
          class="w-[calc(50%-12px)] bg-white disabled:bg-white py-[10px] px-8 rounded-[100px] hover:bg-white text-[#913E5D] text-center flex items-center justify-center h-[50px] border border-[#913E5D] hover:text-[#913E5D] hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed" />
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue"
import { useProfile } from '@/stores/profile'
import { useAuth } from '@/stores/auth'
import { useToast, useI18n } from '#imports'
import { CalendarDate } from '@internationalized/date'
import CameraIcon from '@/components/icons/CameraIcon.vue'
import CalendarIcon3 from '@/components/icons/CalendarIcon3.vue'
import LocationIcon2 from '@/components/icons/LocationIcon2.vue'
import SelectArrowIcon from '@/components/icons/SelectArrowIcon.vue'
import ProfileSkeleton from '@/components/skeletons/ProfileSkeleton.vue'
import { useApp } from '@/stores/app'
import { COMPONENTS } from '@/data/constants'
import { useRouter } from 'vue-router'

// Store instances
const profileStore = useProfile()
const authStore = useAuth()
const appStore = useApp()
const router = useRouter()
const { t } = useI18n()

// Refs and state
const fileInput = ref<HTMLInputElement | null>(null)
const selectedImage = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const calendarDate = ref<CalendarDate | null>(null)

const formData = reactive({
  first_name: '',
  last_name: '',
  gender: '',
  date_of_birth: '',
  address: '',
  email: ''
})

// Static cities list
// const cities = [
//   { label: "Riyadh", value: "Riyadh" },
//   { label: "Jeddah", value: "Jeddah" },
//   { label: "Mecca", value: "Mecca" },
//   { label: "Medina", value: "Medina" },
//   { label: "Dammam", value: "Dammam" },
// ]

// Watch profile data and sync form
watch(() => profileStore.profile, (newProfile) => {
  if (newProfile) {
    formData.first_name = newProfile.first_name || ''
    formData.last_name = newProfile.last_name || ''
    formData.gender = newProfile.gender || ''
    formData.date_of_birth = newProfile.date_of_birth || ''
    formData.address = newProfile.address || ''
    formData.email = newProfile.email || ''
  }
}, { immediate: true })

// Watch calendar changes and format for API
watch(calendarDate, (val) => {
  if (val) {
    const yyyy = val.year
    const mm = String(val.month).padStart(2, '0')
    const dd = String(val.day).padStart(2, '0')
    formData.date_of_birth = `${yyyy}-${mm}-${dd}`
  }
})

// Format mobile number
const formatPhoneNumber = (phoneNumber: string) => {
  if (!phoneNumber) return ''
  const cleanNumber = phoneNumber.replace(/^966/, '')
  return cleanNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')
}

// Return user's full name
const getFullName = () => {
  if (!profileStore.profile) return ''
  return `${profileStore.profile.first_name} ${profileStore.profile.last_name}`.trim()
}

// Handle image upload and preview
const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  const toast = useToast()

  if (file) {
    if (!file.type.startsWith('image/')) {
      toast.add({ title: t('profile.image_invalid'), color: 'error' })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.add({ title: t('profile.image_too_large'), color: 'error' })
      return
    }

    selectedImage.value = file

    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// Save profile changes
const saveProfile = () => {
  const updateData: any = {
    first_name: formData.first_name.trim(),
    last_name: formData.last_name.trim(),
    gender: formData.gender,
    date_of_birth: formData.date_of_birth,
    address: formData.address || null,
    email: formData.email
  }

  if (selectedImage.value) {
    updateData.image_profile = selectedImage.value
  }

  const requiredFields = ['first_name', 'last_name', 'gender', 'date_of_birth']
  Object.keys(updateData).forEach(key => {
    if (key !== 'image_profile' && !requiredFields.includes(key) && (updateData[key] === '' || updateData[key] === null)) {
      delete updateData[key]
    } else if (updateData[key] === null) {
      updateData[key] = ''
    }
  })

  profileStore.updateProfile(updateData)
  selectedImage.value = null
  imagePreview.value = null
}

// Show confirm dialog before deleting profile
const deleteProfile = () => {
  appStore.setDialogComponent(COMPONENTS.CONFIRM_DIALOG, {
    dialogTitle: t('profile.delete_dialog_title'),
    message: t('profile.delete_dialog_message'),
    confirmText: t('profile.delete_dialog_confirm'),
    cancelText: t('profile.delete_dialog_cancel'),
    modalMaxWidth: 'max-w-[458px]',
    loading: profileStore.isUpdating,
    confirmButtonClass: 'h-[49px] bg-[#C44E4E] hover:bg-[#913E5D] text-white rounded-[100px] text-[16px]',
    cancelButtonClass: 'h-[49px] bg-[#6B8B9B] text-white hover:bg-[#5a7886] rounded-[100px] text-[16px]',
    onConfirm: async () => {
      await profileStore.deleteProfile()
      if (!profileStore.profile) {
        router.push('/')
      }
    }
  })

  appStore.setDialogShow(true)
}

// On mount: ensure auth and fetch profile
onMounted(async () => {
  if (!authStore.getToken) {
    await authStore.initAuth()
  }

  if (authStore.getToken && !profileStore.profile) {
    profileStore.fetchProfile()
  }
})
</script>
