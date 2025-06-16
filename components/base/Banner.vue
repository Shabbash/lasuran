<template>
  <div class="relative overflow-hidden rounded-[20px] mb-[35px] mt-[40px] h-[200px] md:h-[300px]">
    <!-- Skeleton Placeholder -->
    <div v-if="loading" class="absolute inset-0 bg-[#D4B6C1] animate-pulse z-0"></div>

    <!-- Banner Image -->
    <div v-else class="absolute inset-0 z-0">
      <img :src="bannerContent.image" alt="banner" class="w-full h-full object-cover" />
      <div v-if="opacity" class="absolute inset-0 bg-black/60"></div>
    </div>

    <!-- Text -->
    <div class="absolute inset-0 z-10 flex flex-col justify-center items-center gap-[20px] text-center">
      <template v-if="!loading">
        <p class="text-[#A0576F] text-[17px] font-bold leading-[22px] tracking-[-0.4px]">
          {{ bannerContent.subtitle }}
        </p>
        <h2 class="text-[#EBE4DF] text-[32px] md:text-[48px] font-bold leading-[1.2] tracking-[-0.4px]">
          {{ bannerContent.title }}
        </h2>
      </template>
      <template v-else>
        <div class="h-[20px] w-[100px] bg-[#A0576F] rounded-full animate-pulse"></div>
        <div class="h-[30px] w-[200px] md:w-[300px] bg-[#EBE4DF] rounded-full animate-pulse"></div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  loading?: boolean
  opacity?: boolean
  bannerContent: {
    image: string
    subtitle: string
    title: string
  }
}>()
</script>
