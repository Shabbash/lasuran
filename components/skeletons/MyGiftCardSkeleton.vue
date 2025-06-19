<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Left Side: Gift Cards List -->
    <div class="h-[770px] space-y-5">
      <div v-for="i in 4" :key="i" class="p-[20px] border border-[#AD7084] rounded-[12px] bg-[#AD7084]/20 animate-pulse">
        <div class="h-[20px] w-1/2 mb-[20px] bg-[#C6C6C7]/30 rounded"></div>
        <div class="h-[14px] w-full mb-[11px] pb-[11px] border-b border-[#AD7084] bg-[#C6C6C7]/20 rounded"></div>
        <div class="h-[14px] w-full mb-[11px] pb-[11px] border-b border-[#AD7084] bg-[#C6C6C7]/20 rounded"></div>
        <div class="h-[14px] w-[60%] bg-[#C6C6C7]/20 rounded"></div>
      </div>
    </div>

    <!-- Right Side: Swiper Preview + Payment -->
    <div class="space-y-6">
      <!-- Swiper Placeholder -->
      <div class="max-w-[330px] mx-auto h-[210px] rounded-[20px] bg-[#AD7084]/20 animate-pulse"></div>

      <!-- Payment Details Skeleton -->
      <div class="px-[25px] py-[35px] rounded-[12px] border border-[#AD7084] text-[#C6C6C7] bg-[#AD7084]/10 animate-pulse space-y-4">
        <div class="h-[20px] w-1/2 mx-auto mb-[17px] bg-[#C6C6C7]/30 rounded"></div>
        <div class="flex justify-between">
          <div class="h-[14px] w-[40%] bg-[#C6C6C7]/20 rounded"></div>
          <div class="h-[14px] w-[20%] bg-[#C6C6C7]/20 rounded"></div>
        </div>
        <div class="flex justify-between">
          <div class="h-[14px] w-[40%] bg-[#C6C6C7]/20 rounded"></div>
          <div class="h-[14px] w-[20%] bg-[#C6C6C7]/20 rounded"></div>
        </div>
        <div class="flex justify-between pb-[18px] border-b border-[#AD7084]">
          <div class="h-[14px] w-[40%] bg-[#C6C6C7]/20 rounded"></div>
          <div class="h-[14px] w-[20%] bg-[#C6C6C7]/20 rounded"></div>
        </div>
        <div class="flex justify-between mt-3 text-[17px] font-[500]">
          <div class="h-[18px] w-[30%] bg-[#C6C6C7]/30 rounded"></div>
          <div class="h-[18px] w-[20%] bg-[#C6C6C7]/30 rounded"></div>
        </div>
      </div>

      <!-- Button Placeholder -->
      <div class="h-[48px] w-full bg-[#6B8B9B]/50 rounded-full animate-pulse"></div>
    </div>
  </div>
</template>
