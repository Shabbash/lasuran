<template>
  <div
    class="py-[34px] px-[30px] h-full flex flex-col border border-[#AD7084] border-solid rounded-[20px]"
  >
    <div class="">
      <div class="flex flex-col items-center mb-8">
        <div class="relative mb-4">
          <img
            :src="imagePreview || profileStore.profile?.image_profile || '/assets/img/imgg3.png'"
            :alt="getFullName() || 'Lasuban Logo'"
            class="w-[139px] h-[139px] rounded-full bg-rose-100 object-cover"
            :class="{ 'ring-4 ring-yellow-400 ring-opacity-50': selectedImage }"
          />
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            @change="handleImageUpload"
            class="hidden"
          />
          <button
            @click="fileInput?.click()"
            class="absolute bottom-2 right-1 rounded-full p-1 text-white bg-[#6B8B9B] w-[30px] h-[30px] flex items-center justify-center"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <!-- Indicator for pending image upload -->
          <div v-if="selectedImage" class="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
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
            class="flex rounded-[14px] border-[1.2px] border-[#EBE4DF] px-[18px] py-[10px] text-[16.76px] font-normal leading-[31px] h-[50px] tracking-[2.61px] text-[#BBCACF]"
          >
            <div class="flex items-center gap-2">
              <img
                src="/assets/img/sa-flag.svg"
                alt="saudi-flag"
                class="w-[35px] h-[23px]"
              />
              <span class="text-[#BBCACF] font-medium text-[14px]">+966</span>
            </div>
            <div class="mx-[18px] border-l border-[#BBCACF]"></div>
            <input
              type="text"
              placeholder="50 XXXX XXXX"
              :value="formatPhoneNumber(profileStore.profile?.mobile_number || '') || user.phone"
              readonly
              class="flex-1 outline-none bg-transparent text-[#BBCACF] placeholder:text-[#D3C9C5] text-[14px]"
            />
          </div>
        </div>
        <div>
          <div>
            <p class="text-start text-[14px] font-medium text-white mb-3">
              Date Of Birth
            </p>
            <div
              class="flex items-center gap-[10px] border border-[#EBE4DF] rounded-[13px] px-[23px] bg-transparent"
            >
              <label for="last-name"></label>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#EBE4DF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <input
                placeholder="April - 18th - 2000"
                id="last-name"
                v-model="formData.date_of_birth"
                class="flex-1 outline-none bg-transparent text-[#BBCACF] placeholder:text-[#D3C9C5] text-[14px] h-[50px]"
                type="text"
              />
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
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#EBE4DF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <select
                v-model="formData.address"
                class="w-full h-[50px] pl-10 pr-4 py-2 rounded-[14px] bg-[#A0576F] ring-1 ring-[#EBE4DF] focus:ring-0 focus:border-[#A0576F] text-[#BBCACF] placeholder:text-[#D3C9C5] text-[14px] appearance-none"
              >
                <option v-for="city in cities" :key="city.value" :value="city.value">
                  {{ city.label }}
                </option>
              </select>
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#EBE4DF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                <input type="radio" id="gender-male" value="Male" v-model="formData.gender" name="gender" class="sr-only peer" />
                <label for="gender-male"
                  class="block text-center w-full cursor-pointer py-[10px] rounded-full border border-[#EBE4DF] text-[#EBE4DF] text-[18px] bg-transparent transition-all
                          peer-checked:bg-[#6B8B9B] peer-checked:text-[#EBE4DF] peer-checked:border-[#6B8B9B]">
                  Male
                </label>
              </div>

              <div class="flex-1 basis-1/2">
                <input type="radio" id="gender-female" value="Female" v-model="formData.gender" name="gender" class="sr-only peer" />
                <label for="gender-female"
                  class="block text-center w-full cursor-pointer py-[10px] rounded-full border border-[#EBE4DF] text-[#EBE4DF] text-[18px] bg-transparent transition-all
                  peer-checked:bg-[#6B8B9B] peer-checked:text-[#EBE4DF] peer-checked:border-[#6B8B9B]">
                  Female
                </label>
              </div>
            </div>
          </div>
        </div>

        <div>
          <button
            class="bg-[#C44E4E] py-[10px] px-8 text-[14px] rounded-[100px] hover:bg-[#C44E4E] text-[#EBE4DF]"
            @click="deleteProfile"
          >
            Delete Profile
          </button>
        </div>
      </div>

      <div class="flex justify-end gap-6 justify-items-end mt-[30px]">
        <button
          :disabled="profileStore.isUpdating"
          class="w-[calc(50%-12px)] bg-white py-[10px] px-8 rounded-[100px] hover:bg-white text-[#913E5D] text-center flex items-center justify-center h-[50px] border border-[#913E5D] hover:text-[#913E5D] hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="saveProfile"
        >
          <div v-if="profileStore.isUpdating" class="animate-spin rounded-full h-4 w-4 border-b-2 border-[#913E5D] mr-2"></div>
          {{ profileStore.isUpdating ? 'Saving...' : 'Save' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import { useProfile } from '@/stores/profile';

// Initialize profile store
const profileStore = useProfile();

// Keep your original fallback data
const user = ref({
  name: "Zahra Ahmed",
  phone: "+966 854 759 9745",
  birthDate: "April 18th, 2000",
  city: "Riyadh",
  gender: "female"
});

// Form data for API integration
const formData = reactive({
  first_name: '',
  last_name: '',
  gender: '',
  date_of_birth: '',
  address: '',
});

// Keep your original cities data
const cities = [
  { label: "Riyadh", value: "Riyadh" },
  { label: "Jeddah", value: "Jeddah" },
  { label: "Mecca", value: "Mecca" },
  { label: "Medina", value: "Medina" },
  { label: "Dammam", value: "Dammam" }
];

// File input ref for image upload
const fileInput = ref<HTMLInputElement | null>(null);
const selectedImage = ref<File | null>(null);
const imagePreview = ref<string | null>(null);

// Watch for profile changes and update form data
watch(() => profileStore.profile, (newProfile) => {
  if (newProfile) {
    formData.first_name = newProfile.first_name || '';
    formData.last_name = newProfile.last_name || '';
    formData.gender = newProfile.gender || '';
    formData.date_of_birth = newProfile.date_of_birth || '';
    formData.address = newProfile.address || '';
  }
}, { immediate: true });

// Format phone number for display (keeping your original format)
const formatPhoneNumber = (phoneNumber: string) => {
  if (!phoneNumber) return '';
  // Remove country code if present
  const cleanNumber = phoneNumber.replace(/^966/, '');
  // Format as XXX XXX XXXX
  return cleanNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
};

// Get full name from profile
const getFullName = () => {
  if (!profileStore.profile) return '';
  return `${profileStore.profile.first_name} ${profileStore.profile.last_name}`.trim();
};

// Handle image selection (store file for later upload)
const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      const toast = useToast();
      toast.add({ title: 'Please select a valid image file', color: 'error' });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      const toast = useToast();
      toast.add({ title: 'Image size must be less than 5MB', color: 'error' });
      return;
    }

    // Store the selected file for later upload
    selectedImage.value = file;

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    console.log('Image selected, will be uploaded when Save is clicked');
  }
};

// Your original saveProfile function enhanced with API integration
const saveProfile = () => {
  // Prepare update data from form
  const updateData: any = {
    first_name: formData.first_name.trim(),
    last_name: formData.last_name.trim(),
    gender: formData.gender,
    date_of_birth: formData.date_of_birth || null,
    address: formData.address || null,
  };

  // Add selected image if user chose one
  if (selectedImage.value) {
    updateData.image_profile = selectedImage.value;
  }

  // Don't remove required fields - only remove optional empty fields
  const requiredFields = ['first_name', 'last_name', 'gender'];
  Object.keys(updateData).forEach(key => {
    if (key !== 'image_profile' && !requiredFields.includes(key) && (updateData[key] === '' || updateData[key] === null)) {
      delete updateData[key];
    } else if (updateData[key] === null) {
      // Convert null to empty string for required fields
      updateData[key] = '';
    }
  });

  // Call API to update profile
  profileStore.updateProfile(updateData);

  // Clear selected image after saving
  selectedImage.value = null;
  imagePreview.value = null;
};

// Your original deleteProfile function
const deleteProfile = () => {
  if (confirm('Are you sure you want to delete your profile?')) {
    console.log('Deleting profile', user.value);
  }
};

// Fetch profile on component mount
onMounted(async () => {
  // Ensure auth is initialized first
  const authStore = useAuth();
  if (!authStore.getToken) {
    await authStore.initAuth();
  }

  // Then fetch profile if we have a token
  if (authStore.getToken && !profileStore.profile) {
    profileStore.fetchProfile();
  }
});
</script>