<template>
  <Container>
    <Banner :opacity="false" :bannerContent="bannerContent" />

    <!-- Loading State -->
    <div v-if="branchesStore.isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A0576F]"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="branchesStore.error" class="text-center mt-8 p-6 bg-red-50 rounded-lg">
      <p class="text-red-600 text-lg mb-4">{{ branchesStore.error }}</p>
      <BaseButton @click="branchesStore.fetchBranches()"
        class="bg-[#A0576F] text-white px-6 py-2 rounded-full hover:bg-[#913E5D]">
        Try Again
      </BaseButton>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- اختيار المدينة -->
      <USelectMenu hidden v-model="filters.city" :items="cityOptions" placeholder="Select City"
        class="min-w-[300px] rounded-[100px] border border-[#EBE4DF] bg-[#EBE4DF] shadow-[1px_3px_8px_0px_#00000012] backdrop-blur-[25px] h-[56px] text-[#A0576F] text-[16px] font-[350] leading-normal ps-[28px]" />

      <!-- بطاقات الفروع -->
      <div v-if="filteredBranches.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-[30px]">
        <BaseCard v-for="branch in filteredBranches" :key="branch.id">
          <template #default>
            <div @click="openBranchDialog(branch)"
              class="pt-[8px] pb-[20px] px-[8px] rounded-[16px] overflow-hidden bg-[#EBE4DF] cursor-pointer hover:shadow-lg transition">
              <div class="mb-[12px] h-[114px] rounded-[16px] overflow-hidden">
                <img :src="branch.image || branch.thumpimage_image" alt="Branch Image" class="w-full h-full object-cover" />
              </div>
              <div class="px-[6px]">
                <h3 class="text-[#A0576F] text-[14px] font-medium leading-normal mb-[10px]">
                  {{ branch.name }}
                </h3>
                <p class="location flex text-[#5B605C] text-[12px] font-[350] gap-[4px]">
                  {{ branch.address || branch.city_name }}
                </p>
                
              </div>
            </div>
          </template>
        </BaseCard>
      </div>

      <!-- حالة لا يوجد فروع -->
      <div v-else class="text-center mt-8 text-[#A0576F] text-lg">
        No branches available for the selected city.
      </div>
    </div>

    <!-- المودال -->
    <Dialog v-model:open="modalOpen" :modalMaxWidth="'max-w-[539px]'">
      <template #body>
        <div v-if="selectedBranch"
          class="bg-decore-modal mx-auto rounded-[30px] overflow-hidden shadow-lg bg-[#EBE4DF] text-[#5F2C3E]">
          <!-- صورة الفرع -->
          <img class="w-full h-[200px] object-cover rounded-[30px]"
            :src="selectedBranch.main_image || selectedBranch.image || selectedBranch.thumpimage_image"
            :alt="selectedBranch.name" />

          <!-- تفاصيل الفرع -->
          <div class="mx-[20px] mt-[20px] mb-[40px] relative">
            <div class="flex justify-between items-center mb-2">
              <h2 class="font-bold text-[30px] text-[#A0576F] leading-[100%]">{{ selectedBranch.name }}</h2>
              <div class="flex items-center gap-2">
                <div :class="selectedBranch.is_open ? 'bg-green-500' : 'bg-red-500'" class="w-3 h-3 rounded-full"></div>
                <span :class="selectedBranch.is_open ? 'text-green-600' : 'text-red-600'" class="text-sm font-medium">
                  {{ selectedBranch.is_open ? 'Open' : 'Closed' }}
                </span>
              </div>
            </div>

            <p class="location-modal flex items-center text-[14px] text-[#A0576F] font-[500] mb-[10px] gap-[12px]">
              {{ selectedBranch.address || selectedBranch.city_name }}
            </p>

            <div v-if="selectedBranch.phone" class="flex items-center text-[14px] text-[#5B605C] mb-[10px] gap-[8px]">
              <span>📞</span>
              <span>{{ selectedBranch.phone }}</span>
            </div>

            <div v-if="selectedBranch.description"
              class="text-[#5B605C] text-[14px] font-[350] mb-[20px]"
              v-html="selectedBranch.description">
            </div>

            <div class="mx-[40px] mt-[30px]">
              <div class="p-[20px] rounded-[20px] bg-[#A0576F]">
                <h3 class="opening-times text-white text-[16px] font-medium flex items-center gap-[10px] mb-[15px]">
                  Opening Times:</h3>

                <!-- Common time display if available -->
                <div v-if="selectedBranch.common_time" class="mb-4 p-3 bg-white/10 rounded-lg">
                  <div class="text-[#81F6D0] text-[14px] font-medium">{{ selectedBranch.common_day }}</div>
                  <div class="text-white text-[16px]">{{ selectedBranch.common_time }}</div>
                </div>

                <!-- Detailed working times -->
                <div class="space-y-3">
                  <div v-for="workingTime in selectedBranch.working_times" :key="workingTime.day"
                    class="flex justify-between">
                    <h4 class="text-white text-[16px] font-[350]">{{ workingTime.day }}</h4>
                    <div class="text-[#81F6D0] text-[16px] font-[350]">
                      <span v-if="workingTime.is_active">
                        {{ workingTime.start_at }} - {{ workingTime.end_at }}
                      </span>
                      <span v-else class="text-red-300">Closed</span>
                    </div>
                  </div>
                </div>
              </div>

              <BaseButton
                @click="openDirections"
                label="Get Directions"
                class="location-btn bg-[#A0576F] text-white rounded-[100px] w-full h-[50px] py-0 justify-center text-[16px] font-normal leading-[100%] tracking-[0] border border-[#A0576F] hover:bg-[#913E5D] transition cursor-pointer mt-[30px]" />
            </div>
          </div>
        </div>
      </template>
    </Dialog>
  </Container>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import Container from '@/components/base/Container.vue'
import Banner from '@/components/base/Banner.vue'
import BaseCard from '@/components/base/Card.vue'
import Dialog from '@/components/base/Dialog.vue'
import { useBranches, type Branch } from '@/stores/branches'

// Initialize branches store
const branchesStore = useBranches()

// Filters
const filters = reactive({
  city: ''
})

// Computed properties
const cityOptions = computed(() => {
  const cities = branchesStore.getAvailableCities
  return ['All Cities', ...cities]
})

const filteredBranches = computed(() => {
  if (!filters.city || filters.city === 'All Cities') {
    return branchesStore.getBranches
  }
  return branchesStore.getBranchesByCity(filters.city)
})

// Modal
const modalOpen = ref(false)
const selectedBranch = ref<Branch | null>(null)

function openBranchDialog(branch: Branch) {
  selectedBranch.value = branch
  modalOpen.value = true
}

function openDirections() {
  if (selectedBranch.value?.google_map_link) {
    window.open(selectedBranch.value.google_map_link, '_blank')
  } else if (selectedBranch.value?.latitude && selectedBranch.value?.longitude) {
    const url = `https://www.google.com/maps?q=${selectedBranch.value.latitude},${selectedBranch.value.longitude}`
    window.open(url, '_blank')
  } else {
    // Fallback to search by name and address
    const query = encodeURIComponent(`${selectedBranch.value?.name} ${selectedBranch.value?.address || selectedBranch.value?.city_name}`)
    window.open(`https://www.google.com/maps/search/${query}`, '_blank')
  }
}

const bannerContent = {
  image: "/assets/img/branches-banner.svg",
  subtitle: "Explore Our",
  title: "Branches"
}

// Fetch branches on component mount
onMounted(() => {
  if (branchesStore.getBranches.length === 0) {
    branchesStore.fetchBranches()
  }

  // Set default city if available
  if (branchesStore.getAvailableCities.length > 0 && !filters.city) {
    filters.city = 'All Cities'
  }
})

// Add page metadata
definePageMeta({
  title: 'Branches',
  description: 'Find our branches and locations'
})
</script>
