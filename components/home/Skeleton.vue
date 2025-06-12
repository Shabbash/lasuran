<template>
  <div class="flex flex-row-reverse flex-wrap w-full gap-[24px]">
    <!-- Slider Section -->
    <div class="w-full lg:w-[calc(50%-12px)]">
      <USkeleton class="w-full h-[300px] rounded-[23px]" />
    </div>

    <!-- Widgets Section -->
    <div class="w-full lg:w-[calc(50%-12px)] space-y-[30px] mt-[30px] md:mt-0">
      <div v-for="i in 2" :key="i">
        <USkeleton class="h-6 w-1/3 mb-3 rounded" />
        <div class="flex space-x-4">
          <USkeleton v-for="j in 3" :key="j" class="w-[calc(33%-10px)] h-[180px] rounded-[23px]" />
        </div>
      </div>
    </div>

    <!-- Categories Section -->
    <div class="w-full md:mt-[30px]">
      <USkeleton class="h-6 w-1/3 mb-3 rounded" />
      <div class="flex space-x-4">
        <USkeleton v-for="i in 5" :key="i" class="w-[130px] h-[180px] rounded-[23px]" />
      </div>
    </div>
  </div>
</template>
