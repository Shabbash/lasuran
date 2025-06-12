<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-[30px] animate-pulse">
    <div v-for="i in 8" :key="i" class="rounded-[16px] overflow-hidden bg-[#EBE4DF] p-[8px]">
      <div class="h-[114px] bg-[#D3BFC8] rounded-[16px] mb-[12px]"></div>
      <div class="px-[6px] space-y-2">
        <div class="h-[16px] w-[70%] bg-[#C6C6C7] rounded"></div>
        <div class="h-[12px] w-[50%] bg-[#C6C6C7] rounded"></div>
      </div>
    </div>
  </div>
</template>
