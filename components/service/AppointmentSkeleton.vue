<template>
  <div class="relative z-[1] pt-[42px] px-[80px] pb-[20px]">
    <div class="h-[28px] w-1/3 bg-[#E6CDC7A3] rounded mb-[40px] animate-pulse"></div>
    <div class="h-[20px] w-1/4 bg-[#E6CDC7A3] rounded mb-[12px] animate-pulse"></div>
    <div class="h-[250px] w-full bg-[#E6CDC7A3] rounded-[16px] animate-pulse mb-[24px]"></div>
    <div class="h-[20px] w-1/4 bg-[#E6CDC7A3] rounded mb-[12px] animate-pulse"></div>
    <div class="flex flex-wrap gap-[12px]">
      <div v-for="n in 4" :key="n" class="w-[100px] h-[40px] bg-[#E6CDC7A3] rounded-full animate-pulse"></div>
    </div>
    <div class="w-full h-[48px] bg-[#E6CDC7A3] rounded-full mt-[35px] animate-pulse"></div>
  </div>
</template>