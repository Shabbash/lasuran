<template>
  <ProfileSkeleton v-if="!profileStore.profile" />

  <div v-else
    class="py-[34px] px-[15px] md:px-[30px] h-full flex flex-col border border-[#AD7084] border-solid rounded-[20px]">
    <div class="">
      <div class="flex flex-col items-center mb-8">
        <div class="relative mb-4">
          <img :src="imagePreview || profileStore.profile?.image_profile || '/assets/img/imgg3.png'"
            :alt="getFullName() || 'Lasuban Logo'" class="w-[139px] h-[139px] rounded-full bg-rose-100 object-cover"
            :class="{ 'ring-4 ring-yellow-400 ring-opacity-50': selectedImage }" />
          <input ref="fileInput" type="file" accept="image/*" @change="handleImageUpload" class="hidden" />
          <button @click="fileInput?.click()"
            class="absolute bottom-2 right-1 rounded-full p-1 text-white bg-[#6B8B9B] w-[30px] h-[30px] flex items-center justify-center cursor-pointer"
            type="button">

            <CameraIcon />
          </button>
          <!-- Indicator for pending image upload -->
          <div v-if="selectedImage"
            class="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
            Pending
          </div>
        </div>
        <h2 class="text-xl font-medium text-[#EBE4DF]">{{ getFullName() || user.name }}</h2>
        <p v-if="selectedImage" class="text-xs text-yellow-400 mt-1">Image will be updated when you click Save</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p class="text-start text-[14px] font-medium text-white mb-3">
            Phone Number
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

        <div>
          <p class="text-start text-[14px] font-medium text-white mb-3">Email</p>
          <input type="email" v-model="formData.email" placeholder="name@domain.com"
            class="w-full h-[50px] rounded-[14px] border border-[#EBE4DF] bg-transparent px-4 text-[#BBCACF] placeholder:text-[#D3C9C5] text-[14px] outline-none" />
        </div>

        <div>
          <div>
            <p class="text-start text-[14px] font-medium text-white mb-3">
              Date Of Birth
            </p>
            <div
              class="relative flex items-center gap-[10px] border border-[#EBE4DF] rounded-[13px] px-[23px] bg-transparent">

              <!-- التقويم -->
              <UPopover :popper="{ placement: 'bottom-end' }">
                <UButton color="white" variant="link" class="p-0 absolute inset-0 cursor-pointer">

                </UButton>
                <CalendarIcon3 />
                <template #content>
                  <UCalendar v-model="calendarDate" />
                </template>
              </UPopover>
              <input placeholder="April - 18th - 2000" :value="formData.date_of_birth" readonly
                class="flex-1 outline-none bg-transparent text-[#BBCACF] placeholder:text-[#D3C9C5] text-[14px] h-[50px]"
                type="text" />


            </div>
          </div>
        </div>

        <div>
          <p class="text-start text-[14px] font-medium text-white mb-3">
            City
          </p>
          <div>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">


                <LocationIcon2 />
              </div>
              <select v-model="formData.address"
                class="w-full h-[50px] pl-10 pr-4 py-2 rounded-[14px] bg-[#A0576F] ring-1 ring-[#EBE4DF] focus:ring-0 focus:border-[#A0576F] text-[#BBCACF] placeholder:text-[#D3C9C5] text-[14px] appearance-none">
                <option disabled value="">City</option>
                <option v-for="city in cities" :key="city.value" :value="city.value" class="disabled:text-white">
                  {{ city.label }}
                </option>
              </select>
              <!-- <p class="text-white">
              Selected ID: {{ formData.address_id }}
            </p> -->
              <!-- <select v-model="formData.address_id"
                class="w-full h-[50px] pl-10 pr-4 py-2 rounded-[14px] bg-[#A0576F] ring-1 ring-[#EBE4DF] focus:ring-0 focus:border-[#A0576F] text-[#BBCACF] placeholder:text-[#D3C9C5] text-[14px] appearance-none">
                <option disabled value="">Select Address</option>
                <option v-for="addr in addressList" :key="addr.id" :value="addr.id">
                  {{ addr.title }}
                </option>
              </select> -->



              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">

                <SelectArrowIcon />
              </div>
            </div>
          </div>
        </div>

        <div>
          <p class="text-start text-[14px] font-medium text-white mb-3">
            Gender
          </p>
          <div>
            <div class="flex gap-4">
              <div class="flex-1 basis-1/2">
                <input type="radio" id="gender-male" value="Male" v-model="formData.gender" name="gender"
                  class="sr-only peer" />
                <label for="gender-male" class="block text-center w-full cursor-pointer py-[10px] rounded-full border border-[#EBE4DF] text-[#EBE4DF] text-[18px] bg-transparent transition-all
                          peer-checked:bg-[#6B8B9B] peer-checked:text-[#EBE4DF] peer-checked:border-[#6B8B9B]">
                  Male
                </label>
              </div>

              <div class="flex-1 basis-1/2">
                <input type="radio" id="gender-female" value="Female" v-model="formData.gender" name="gender"
                  class="sr-only peer" />
                <label for="gender-female" class="block text-center w-full cursor-pointer py-[10px] rounded-full border border-[#EBE4DF] text-[#EBE4DF] text-[18px] bg-transparent transition-all
                  peer-checked:bg-[#6B8B9B] peer-checked:text-[#EBE4DF] peer-checked:border-[#6B8B9B]">
                  Female
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-end">


          <BaseButton label="Delete Profile" @click="deleteProfile"
            class="bg-[#C44E4E] text-[#EBE4DF] rounded-[100px] py-[10px] px-8 text-[14px] hover:bg-[#913E5D] transition cursor-pointer w-auto" />


        </div>
      </div>

      <div class="flex justify-end gap-6 justify-items-end mt-[30px]">

        <BaseButton :loading="profileStore.isUpdating" :label="profileStore.isUpdating ? 'Saving...' : 'Save'"
          :disabled="profileStore.isUpdating" @click="saveProfile"
          class="w-[calc(50%-12px)] bg-white disabled:bg-white py-[10px] px-8 rounded-[100px] hover:bg-white text-[#913E5D] text-center flex items-center justify-center h-[50px] border border-[#913E5D] hover:text-[#913E5D] hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed" />

      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from "vue";
import { useProfile } from '@/stores/profile';
import { useAuth } from '@/stores/auth';
import { useToast } from '#imports';
import { CalendarDate } from '@internationalized/date';
import CameraIcon from '@/components/icons/CameraIcon.vue';
import CalendarIcon3 from '@/components/icons/CalendarIcon3.vue';
import LocationIcon2 from '@/components/icons/LocationIcon2.vue';
import SelectArrowIcon from '@/components/icons/SelectArrowIcon.vue';
import ProfileSkeleton from '@/components/skeletons/ProfileSkeleton.vue'
import { useApp } from '@/stores/app'
import { COMPONENTS } from '@/data/constants'

const { setDialogComponent, setDialogShow } = useApp()


// Stores
const profileStore = useProfile();
const authStore = useAuth();
const router = useRouter();

// Refs and reactive state
const fileInput = ref<HTMLInputElement | null>(null);
const selectedImage = ref<File | null>(null);
const imagePreview = ref<string | null>(null);
const calendarDate = ref<CalendarDate | null>(null);

// Form data for API integration
const formData = reactive({
  first_name: '',
  last_name: '',
  gender: '',
  date_of_birth: '',
  address: '',
  // address_id: null,
  email: ''
});

// Cities
const cities = [
  { label: "Riyadh", value: "Riyadh" },
  { label: "Jeddah", value: "Jeddah" },
  { label: "Mecca", value: "Mecca" },
  { label: "Medina", value: "Medina" },
  { label: "Dammam", value: "Dammam" },
];

// Profile watcher
watch(() => profileStore.profile, (newProfile) => {
  if (newProfile) {
    formData.first_name = newProfile.first_name || '';
    formData.last_name = newProfile.last_name || '';
    formData.gender = newProfile.gender || '';
    formData.date_of_birth = newProfile.date_of_birth || '';
    formData.address = newProfile.address || '';
    // formData.address_id = newProfile.address?.id || null;
    formData.email = newProfile.email || ''; 
    // console.log('[DEBUG] selected address_id:', formData.address_id);


  }
}, { immediate: true });

const addressList = ref<{ id: number, title: string }[]>([]);

// const addressList = ref([
//   { id: 1, title: 'Riyadh' },
//   { id: 2, title: 'Jeddah' },
//   { id: 19, title: 'Test Address 19' },
// ]);


const fetchAddresses = async () => {
  const { data } = await useApi('/v1/addresses', { method: 'GET' });
  if (data?.status && Array.isArray(data.data)) {
    addressList.value = data.data.map(addr => ({
      id: addr.id,
      title: addr.title
    }));
  }
};

// const formatDate = (date: CalendarDate): string => {
//   const monthNames = [
//     '', 'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];

//   const getOrdinal = (n: number) => {
//     const s = ["th", "st", "nd", "rd"];
//     const v = n % 100;
//     return n + (s[(v - 20) % 10] || s[v] || s[0]);
//   };

//   return `${monthNames[date.month]} - ${getOrdinal(date.day)} - ${date.year}`;
// };


watch(calendarDate, (val) => {
  if (val) {
    const yyyy = val.year;
    const mm = String(val.month).padStart(2, '0');
    const dd = String(val.day).padStart(2, '0');
    formData.date_of_birth = `${yyyy}-${mm}-${dd}`;
  }
});


// const formattedDateOfBirth = computed(() => {
//   if (!calendarDate.value) return '';

//   const monthNames = [
//     '', 'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];

//   const getOrdinal = (n: number) => {
//     const s = ["th", "st", "nd", "rd"];
//     const v = n % 100;
//     return n + (s[(v - 20) % 10] || s[v] || s[0]);
//   };

//   return `${monthNames[calendarDate.value.month]} - ${getOrdinal(calendarDate.value.day)} - ${calendarDate.value.year}`;
// });


// Format phone number
const formatPhoneNumber = (phoneNumber: string) => {
  if (!phoneNumber) return '';
  const cleanNumber = phoneNumber.replace(/^966/, '');
  return cleanNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
};

// Full name
const getFullName = () => {
  if (!profileStore.profile) return '';
  return `${profileStore.profile.first_name} ${profileStore.profile.last_name}`.trim();
};

// Handle image selection
const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  const toast = useToast();

  if (file) {
    if (!file.type.startsWith('image/')) {
      toast.add({ title: 'Please select a valid image file', color: 'error' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.add({ title: 'Image size must be less than 5MB', color: 'error' });
      return;
    }

    selectedImage.value = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    console.log('Image selected, will be uploaded when Save is clicked');
  }
};

// Save profile
const saveProfile = () => {
  const updateData: any = {
    first_name: formData.first_name.trim(),
    last_name: formData.last_name.trim(),
    gender: formData.gender,
    date_of_birth: formData.date_of_birth,
    address: formData.address || null,
    // address_id: formData.address_id,

    // address: formData.address ? { title: formData.address } : null,
    email: formData.email
  };

  if (selectedImage.value) {
    updateData.image_profile = selectedImage.value;
  }

  const requiredFields = ['first_name', 'last_name', 'gender', 'date_of_birth'];
  Object.keys(updateData).forEach(key => {
    if (key !== 'image_profile' && !requiredFields.includes(key) && (updateData[key] === '' || updateData[key] === null)) {
      delete updateData[key];
    } else if (updateData[key] === null) {
      updateData[key] = '';
    }
  });

  console.log('📤 Sending address:', updateData.address);

  profileStore.updateProfile(updateData);
  selectedImage.value = null;
  imagePreview.value = null;
};

// Delete profile
import { useRouter } from 'vue-router';


const deleteProfile = () => {
  setDialogComponent(COMPONENTS.CONFIRM_DIALOG, {
    title: 'Delete Profile',
    message: 'Are you sure you want to delete your profile?',
    confirmText: 'Yes, Delete',
    cancelText: 'Cancel',
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

  setDialogShow(true)
}



// On mount fetch profile
onMounted(async () => {
  if (!authStore.getToken) {
    await authStore.initAuth();
  }

  if (authStore.getToken && !profileStore.profile) {
    profileStore.fetchProfile();
    console.log('📥 Received address from API:', profileStore.profile?.address);

  }
});
</script>
