<template>
  <Container>
    <Banner :opacity="false" />

    <!-- اختيار المدينة -->
    <USelectMenu v-model="filters.city" :items="cityOptions" placeholder="Select City"
      class="min-w-[300px] rounded-[100px] border border-[#EBE4DF] bg-[#EBE4DF] shadow-[1px_3px_8px_0px_#00000012] backdrop-blur-[25px] h-[56px] text-[#A0576F] text-[16px] font-[350] leading-normal ps-[28px]" />

    <!-- بطاقات الفروع -->
    <div v-if="branches.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-[30px]">
      <BaseCard v-for="branch in branches" :key="branch.id">
        <template #default>
          <div @click="openBranchDialog(branch)"
            class="pt-[8px] pb-[20px] px-[8px] rounded-[16px] overflow-hidden bg-[#EBE4DF] cursor-pointer hover:shadow-lg transition">
            <div class="mb-[12px] h-[114px] rounded-[16px] overflow-hidden">
              <img :src="branch.image" alt="Branch Image" class="w-full h-full object-cover" />
            </div>
            <div class="px-[6px]">
              <h3 class="text-[#A0576F] text-[14.521px] font-medium leading-normal mb-[10px]">
                {{ branch.name }}
              </h3>
              <p class="location flex text-[#5B605C] text-[12px] font-[350] gap-[4px]">
                {{ branch.location }}
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

    <!-- المودال -->
    <Dialog v-model:open="modalOpen" :modalMaxWidth="'max-w-[490px]'">
      <template #body>
        <div v-if="selectedBranch"
          class="bg-decore-modal mx-auto rounded-[30px] overflow-hidden shadow-lg bg-[#EBE4DF] text-[#5F2C3E]">
          <!-- صورة الفرع -->
          <img class="w-full h-[200px] object-cover rounded-[30px]" :src="selectedBranch.image"
            :alt="selectedBranch.name" />

          <!-- تفاصيل الفرع -->
          <div class="mx-[20px] mt-[20px] mb-[40px] relative">
            <div class="flex justify-between items-center mb-2">
              <h2 class="font-bold text-[30px] text-[#A0576F] leading-[100%]">{{ selectedBranch.name }}</h2>
            </div>

            <p class="location-modal flex items-center text-[14px] text-[#A0576F] font-[500] mb-[10px] gap-[12px]">
              {{ selectedBranch.location }}
            </p>


            <p class="text-[#5B605C] text-[14px] font-[350">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad ate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>

            <div class="p-[20px] rounded-[20px] bg-[#A0576F] mx-[40px]">
              <h3 class="opening-times text-white text-[16px] font-medium">Opening Times:</h3>
              <div class="space-y-3 ">
                <div v-for="([day, time], index) in Object.entries(openingTimes)" :key="index"
                  class="flex justify-between">
                  <h4 class="font-medium text-[#5F2C3E]">{{ day }}</h4>
                  <div class="text-[#5F2C3E]">
                    <span>{{ time.from }}</span>
                    <span class="mx-2">-</span>
                    <span>{{ time.to }}</span>
                  </div>
                </div>
              </div>

            </div>

            <button @click="modalOpen = false"
              class="bg-[#A0576F] text-white rounded-full w-full py-3 font-[600] text-[16px] mt-[20px]">
              إغلاق
            </button>

            
          </div>
        </div>
      </template>
    </Dialog>
  </Container>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import Container from '@/components/base/Container.vue'
import Banner from '@/components/base/Banner.vue'
import BaseCard from '@/components/base/Card.vue'
import Dialog from '@/components/base/Dialog.vue'

// الفلاتر
const filters = reactive({
  city: 'Jeddah'
})

// بيانات الفروع المحلية (يمكن نقلها إلى ملف JSON لاحقًا)
const allBranches = {
  Jeddah: [
    {
      id: 1,
      name: 'Salet Ard Branch',
      location: 'Dahban - Jeddah',
      image: '/assets/img/branch-feature.svg',
      workingHours: '9:00 AM - 10:00 PM',
      phone: '0123456789'
    },
    {
      id: 2,
      name: 'Tahlia Branch',
      location: 'Tahlia Street - Jeddah',
      image: '/assets/img/branch-feature.svg',
      workingHours: '8:00 AM - 11:00 PM',
      phone: '0987654321'
    }
  ],
  Riyadh: [
    {
      id: 3,
      name: 'Olaya Branch',
      location: 'Olaya Street - Riyadh',
      image: '/assets/img/branch-feature.svg',
      workingHours: '10:00 AM - 9:00 PM',
      phone: '0555555555'
    }
  ]
}


const openingTimes = {
  Sunday: { from: '06:00 AM', to: '11:59 PM' },
  Monday: { from: '06:00 AM', to: '11:59 PM' },
  Tuesday: { from: '06:00 AM', to: '11:59 PM' },
  Wednesday: { from: '06:00 AM', to: '11:59 PM' },
  Thursday: { from: '06:00 AM', to: '11:59 PM' },
  Friday: { from: '06:00 AM', to: '11:59 PM' },
  Saturday: { from: 'Closed', to: 'Closed' }
}


// القيم المحسوبة
const cityOptions = Object.keys(allBranches)
const branches = computed(() => {
  return allBranches[filters.city] || []
})

// المودال
const modalOpen = ref(false)
const selectedBranch = ref<null | typeof allBranches['Jeddah'][0]>(null)

function openBranchDialog(branch: typeof allBranches['Jeddah'][0]) {
  selectedBranch.value = branch
  modalOpen.value = true
}
</script>
