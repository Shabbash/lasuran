<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div
      v-for="n in 6"
      :key="n"
      class="animate-pulse py-[14px] px-[20px] h-full flex flex-col border border-[#AD7084] border-solid rounded-[20px] bg-[#EBE4DF]"
    >
      <div class="flex justify-between items-start mb-3">
        <div class="h-[20px] w-[160px] bg-[#C6C6C7] rounded"></div>
        <div class="h-[20px] w-[70px] bg-[#A0576F] rounded-full"></div>
      </div>

      <div class="space-y-4">
        <div class="flex items-center gap-[6px]">
          <div class="h-[16px] w-[16px] bg-[#C6C6C7] rounded-full"></div>
          <div class="h-[16px] w-[150px] bg-[#C6C6C7] rounded"></div>
        </div>
        <div class="flex items-center gap-[6px]">
          <div class="h-[16px] w-[16px] bg-[#C6C6C7] rounded-full"></div>
          <div class="h-[16px] w-[120px] bg-[#C6C6C7] rounded"></div>
        </div>
        <div class="flex items-center gap-[6px]">
          <div class="h-[16px] w-[16px] bg-[#C6C6C7] rounded-full"></div>
          <div class="h-[16px] w-[100px] bg-[#C6C6C7] rounded"></div>
        </div>
        <div class="flex items-center gap-[6px]">
          <div class="h-[16px] w-[16px] bg-[#C6C6C7] rounded-full"></div>
          <div class="h-[16px] w-[80px] bg-[#C6C6C7] rounded"></div>
        </div>
        
      </div>
    </div>
  </div>
</template>
