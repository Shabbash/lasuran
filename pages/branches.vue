<template>
  <Container>
    <!-- Banner -->
    <Banner :loading="isReady && branchesStore.isLoading" :opacity="false" :bannerContent="bannerContent" />

    <!-- Loading State -->
    <BranchSkeleton v-if="isReady && branchesStore.isLoading" />

    <!-- Error State -->
    <div v-else-if="isReady && branchesStore.error" class="text-center mt-8 p-6 bg-red-50 rounded-lg">
      <p class="text-red-600 text-lg mb-4">{{ branchesStore.error }}</p>
      <BaseButton @click="branchesStore.fetchBranches()"
        class="bg-[#A0576F] text-white px-6 py-2 rounded-full hover:bg-[#913E5D]">
        Try Again
      </BaseButton>
    </div>

    <!-- Content -->
    <div v-else-if="isReady">
      <!-- City Filter -->
      <USelectMenu hidden v-model="filters.city" :items="cityOptions" placeholder="Select City"
        class="min-w-[300px] rounded-[100px] border border-[#EBE4DF] bg-[#EBE4DF] shadow-[1px_3px_8px_0px_#00000012] backdrop-blur-[25px] h-[56px] text-[#A0576F] text-[16px] font-[350] leading-normal ps-[28px]" />

      <!-- Branch Cards -->
      <div v-if="filteredBranches.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-[30px]">
        <BaseCard v-for="branch in filteredBranches" :key="branch.id">
          <template #default>
            <div @click="openBranchDialog(branch)"
              class="pt-[8px] pb-[20px] px-[8px] rounded-[16px] overflow-hidden bg-[#EBE4DF] cursor-pointer hover:shadow-lg transition">
              <div class="mb-[12px] h-[114px] rounded-[16px] overflow-hidden">
                <img :src="branch.image || branch.thumpimage_image" alt="Branch Image" class="w-full h-full object-cover" />
              </div>
              <div class="px-[6px] truncate overflow-hidden whitespace-nowrap">
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

      <!-- No Branches Message -->
      <div v-else class="text-center mt-8 text-[#A0576F] text-lg">
        No branches available for the selected city.
      </div>
    </div>
  </Container>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import Container from '@/components/base/Container.vue'
import Banner from '@/components/base/Banner.vue'
import BaseCard from '@/components/base/Card.vue'
import BranchSkeleton from '@/components/skeletons/BranchSkeleton.vue'
import { useBranches, type Branch } from '@/stores/branches'
import { useApp } from '@/stores/app'
import { COMPONENTS } from '@/data/constants'

const branchesStore = useBranches()
const { setDialogComponent, setDialogShow } = useApp()

const isReady = computed(() => typeof branchesStore?.isLoading !== 'undefined')
const filters = reactive({ city: '' })

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

function openBranchDialog(branch: Branch) {
  setDialogComponent(COMPONENTS.BRANCH_SHOW, { branch })
  setDialogShow(true)
}

const bannerContent = {
  image: "/assets/img/branches-banner.svg",
  subtitle: "Explore Our",
  title: "Branches"
}

onMounted(() => {
  // if (branchesStore.getBranches.length === 0) {
    branchesStore.fetchBranches()
  // }
  if (branchesStore.getAvailableCities.length > 0 && !filters.city) {
    filters.city = 'All Cities'
  }
})

definePageMeta({
  title: 'Branches',
  description: 'Find our branches and locations'
})
</script>