<template>
  <div
    class="py-[34px] px-[15px] md:px-[30px] h-full flex flex-col border border-[#AD7084] border-solid rounded-[20px]">
    <div class="">
      <div class="flex flex-col items-center mb-8">
        <div class="relative mb-4">
          <img :src="imagePreview || profileStore.profile?.image_profile || '/assets/img/imgg3.png'"
            :alt="getFullName() || 'Lasuban Logo'" class="w-[139px] h-[139px] rounded-full bg-rose-100 object-cover"
            :class="{ 'ring-4 ring-yellow-400 ring-opacity-50': selectedImage }" />
          <input ref="fileInput" type="file" accept="image/*" @change="handleImageUpload" class="hidden" />
          <button @click="fileInput?.click()"
            class="absolute bottom-2 right-1 rounded-full p-1 text-white bg-[#6B8B9B] w-[30px] h-[30px] flex items-center justify-center"
            type="button">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
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
          <div>
            <p class="text-start text-[14px] font-medium text-white mb-3">
              Date Of Birth
            </p>
            <div class="flex items-center gap-[10px] border border-[#EBE4DF] rounded-[13px] px-[23px] bg-transparent">

              <!-- التقويم -->
              <UPopover :popper="{ placement: 'bottom-end' }">
                <UButton color="white" variant="link" class="p-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                    <path
                      d="M7.76855 3C7.76855 2.58579 7.43277 2.25 7.01855 2.25C6.60434 2.25 6.26855 2.58579 6.26855 3H6.01855C3.80942 3 2.01855 4.79086 2.01855 7V18C2.01855 20.2091 3.80942 22 6.01855 22H13.2686C13.6828 22 14.0186 21.6642 14.0186 21.25C14.0186 20.8358 13.6828 20.5 13.2686 20.5H6.01855C4.63784 20.5 3.51855 19.3807 3.51855 18V7C3.51855 5.61929 4.63784 4.5 6.01855 4.5H6.26855V6C6.26855 6.41421 6.60434 6.75 7.01855 6.75C7.43277 6.75 7.76855 6.41421 7.76855 6V4.5H16.2686V6C16.2686 6.41421 16.6043 6.75 17.0186 6.75C17.4328 6.75 17.7686 6.41421 17.7686 6V4.5H18.0186C19.3993 4.5 20.5186 5.61929 20.5186 7V13.25C20.5186 13.6642 20.8543 14 21.2686 14C21.6828 14 22.0186 13.6642 22.0186 13.25V7C22.0186 4.79086 20.2277 3 18.0186 3H17.7686C17.7686 2.58579 17.4328 2.25 17.0186 2.25C16.6043 2.25 16.2686 2.58579 16.2686 3H7.76855Z"
                      fill="#EBE4DF" />
                    <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M21.9515 18.7063C21.6099 20.1652 19.6112 21.4584 18.8307 21.9145C18.6357 22.0285 18.4014 22.0285 18.2064 21.9145C17.4259 21.4584 15.4272 20.1652 15.0856 18.7063C14.7771 17.389 15.56 16.0203 16.8858 16.0006C16.9132 16.0002 16.941 16 16.9692 16C17.0207 16 17.0717 16.0025 17.122 16.0072C17.4753 16.0402 17.7961 16.1817 18.0409 16.3261C18.1865 16.412 18.3811 16.4676 18.5501 16.4676C18.7191 16.4676 18.8506 16.412 18.9962 16.3261C19.2759 16.1611 19.6547 16 20.0679 16C20.0961 16 20.1239 16.0002 20.1513 16.0006C21.4771 16.0203 22.26 17.389 21.9515 18.7063ZM17.2788 17.618C17.6435 17.8332 18.0996 17.9676 18.5501 17.9676C19.1014 17.9676 19.5056 17.7672 19.7584 17.618C19.8297 17.576 19.8986 17.5436 19.9596 17.5231C20.0203 17.5027 20.0555 17.5 20.0679 17.5C20.0888 17.5 20.1091 17.5002 20.129 17.5004C20.2279 17.5019 20.3127 17.5364 20.3974 17.67C20.4962 17.8259 20.557 18.0825 20.491 18.3643C20.4314 18.6191 20.1503 19.0455 19.5652 19.56C19.2147 19.8682 18.8365 20.1377 18.5186 20.3447C18.2006 20.1377 17.8224 19.8682 17.4719 19.56C16.8868 19.0455 16.6057 18.6191 16.5461 18.3643C16.4801 18.0825 16.5409 17.8259 16.6397 17.67C16.7245 17.5364 16.8092 17.5019 16.9081 17.5004L16.9396 17.5001L16.9692 17.5C16.9816 17.5 17.0168 17.5027 17.0775 17.5231C17.1385 17.5436 17.2074 17.576 17.2788 17.618Z"
                      fill="#EBE4DF" />
                    <path
                      d="M8.01855 10C8.01855 10.5523 7.57084 11 7.01855 11C6.46627 11 6.01855 10.5523 6.01855 10C6.01855 9.44771 6.46627 9 7.01855 9C7.57084 9 8.01855 9.44771 8.01855 10Z"
                      fill="#EBE4DF" />
                    <path
                      d="M12.0186 11C12.5708 11 13.0186 10.5523 13.0186 10C13.0186 9.44771 12.5708 9 12.0186 9C11.4663 9 11.0186 9.44771 11.0186 10C11.0186 10.5523 11.4663 11 12.0186 11Z"
                      fill="#EBE4DF" />
                    <path
                      d="M18.0186 10C18.0186 10.5523 17.5708 11 17.0186 11C16.4663 11 16.0186 10.5523 16.0186 10C16.0186 9.44771 16.4663 9 17.0186 9C17.5708 9 18.0186 9.44771 18.0186 10Z"
                      fill="#EBE4DF" />
                    <path
                      d="M7.01855 14.5C7.57084 14.5 8.01855 14.0523 8.01855 13.5C8.01855 12.9477 7.57084 12.5 7.01855 12.5C6.46627 12.5 6.01855 12.9477 6.01855 13.5C6.01855 14.0523 6.46627 14.5 7.01855 14.5Z"
                      fill="#EBE4DF" />
                    <path
                      d="M13.0186 13.5C13.0186 14.0523 12.5708 14.5 12.0186 14.5C11.4663 14.5 11.0186 14.0523 11.0186 13.5C11.0186 12.9477 11.4663 12.5 12.0186 12.5C12.5708 12.5 13.0186 12.9477 13.0186 13.5Z"
                      fill="#EBE4DF" />
                    <path
                      d="M17.0186 14.5C17.5708 14.5 18.0186 14.0523 18.0186 13.5C18.0186 12.9477 17.5708 12.5 17.0186 12.5C16.4663 12.5 16.0186 12.9477 16.0186 13.5C16.0186 14.0523 16.4663 14.5 17.0186 14.5Z"
                      fill="#EBE4DF" />
                    <path
                      d="M8.01855 17C8.01855 17.5523 7.57084 18 7.01855 18C6.46627 18 6.01855 17.5523 6.01855 17C6.01855 16.4477 6.46627 16 7.01855 16C7.57084 16 8.01855 16.4477 8.01855 17Z"
                      fill="#EBE4DF" />
                    <path
                      d="M12.0186 18C12.5708 18 13.0186 17.5523 13.0186 17C13.0186 16.4477 12.5708 16 12.0186 16C11.4663 16 11.0186 16.4477 11.0186 17C11.0186 17.5523 11.4663 18 12.0186 18Z"
                      fill="#EBE4DF" />
                  </svg>
                </UButton>

                <template #content>
                  <UCalendar v-model="calendarDate" />
                </template>
              </UPopover>
              <input placeholder="April - 18th - 2000" :value="formattedDateOfBirth" readonly
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
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#EBE4DF]" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <select v-model="formData.address"
                class="w-full h-[50px] pl-10 pr-4 py-2 rounded-[14px] bg-[#A0576F] ring-1 ring-[#EBE4DF] focus:ring-0 focus:border-[#A0576F] text-[#BBCACF] placeholder:text-[#D3C9C5] text-[14px] appearance-none">
                <option disabled value="">City</option>
                <option v-for="city in cities" :key="city.value" :value="city.value" class="disabled:text-white">
                  {{ city.label }}
                </option>
              </select>
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#EBE4DF]" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
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

        <div>


          <BaseButton
  label="Delete Profile"
  @click="deleteProfile"
  class="bg-[#C44E4E] text-[#EBE4DF] rounded-[100px] py-[10px] px-8 text-[14px] hover:bg-[#913E5D] transition cursor-pointer"
/>


        </div>
      </div>

      <div class="flex justify-end gap-6 justify-items-end mt-[30px]">

        <BaseButton 
        :loading="profileStore.isUpdating"
  :label="profileStore.isUpdating ? 'Saving...' : 'Save'"
  :disabled="profileStore.isUpdating"
  @click="saveProfile"
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

// Stores
const profileStore = useProfile();
const authStore = useAuth();

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
  }
}, { immediate: true });


const formatDate = (date: CalendarDate): string => {
  const monthNames = [
    '', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return `${monthNames[date.month]} - ${getOrdinal(date.day)} - ${date.year}`;
};


watch(calendarDate, (val) => {
  if (val) {
    const yyyy = val.year;
    const mm = String(val.month).padStart(2, '0');
    const dd = String(val.day).padStart(2, '0');
    formData.date_of_birth = `${yyyy}-${mm}-${dd}`;
  }
});


const formattedDateOfBirth = computed(() => {
  if (!calendarDate.value) return '';

  const monthNames = [
    '', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return `${monthNames[calendarDate.value.month]} - ${getOrdinal(calendarDate.value.day)} - ${calendarDate.value.year}`;
});


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
    date_of_birth: formData.date_of_birth || null,
    address: formData.address || null,
  };

  if (selectedImage.value) {
    updateData.image_profile = selectedImage.value;
  }

  const requiredFields = ['first_name', 'last_name', 'gender'];
  Object.keys(updateData).forEach(key => {
    if (key !== 'image_profile' && !requiredFields.includes(key) && (updateData[key] === '' || updateData[key] === null)) {
      delete updateData[key];
    } else if (updateData[key] === null) {
      updateData[key] = '';
    }
  });

  profileStore.updateProfile(updateData);
  selectedImage.value = null;
  imagePreview.value = null;
};

// Delete profile
const deleteProfile = () => {
  if (confirm('Are you sure you want to delete your profile?')) {
    console.log('Deleting profile', formData);
  }
};

// On mount fetch profile
onMounted(async () => {
  if (!authStore.getToken) {
    await authStore.initAuth();
  }

  if (authStore.getToken && !profileStore.profile) {
    profileStore.fetchProfile();
  }
});
</script>
