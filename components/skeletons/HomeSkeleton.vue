<template>
  <div class="flex flex-row-reverse flex-wrap w-full gap-[24px] animate-pulse">

    <!-- ✅ Slider Section -->
    <div class="w-full lg:w-[calc(50%-12px)] md:mt-[57px]">
      <div class="bg-[#d3bfc8] h-[230px] md:h-[400px] rounded-[23px] w-full "></div>
    </div>

    <!-- ✅ What's New + Recommended Services -->
    <div class="w-full lg:w-[calc(50%-12px)] space-y-[30px] mt-[30px] first:mt-0">
      <!-- Box 1 -->
      <div class="space-y-[12px]">
        <div class="h-[20px] w-[150px] bg-[#d3bfc8] rounded"></div>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div v-for="i in 3" :key="'whats-new-' + i" class="bg-[#EBE4DF] rounded-[23px] overflow-hidden h-[180px]"></div>
        </div>
      </div>

      <!-- Box 2 -->
      <div class="space-y-[12px]">
        <div class="h-[20px] w-[200px] bg-[#d3bfc8] rounded"></div>
        <div class="grid grid-cols-3 md:grid-cols-4 gap-4">
          <div v-for="i in 4" :key="'recommended-' + i" class="bg-[#EBE4DF] rounded-[23px] overflow-hidden h-[160px]"></div>
        </div>
      </div>
    </div>

    <!-- ✅ Categories -->
    <div class="w-full md:mt-[30px]">
      <div class="h-[20px] w-[130px] bg-[#d3bfc8] mb-[16px] rounded"></div>
      <div class="grid grid-cols-3 md:grid-cols-5 gap-4">
        <div v-for="i in 5" :key="'cat-' + i" class="h-[180px] bg-[#EBE4DF] rounded-[23px]"></div>
      </div>
    </div>

  </div>
</template>
