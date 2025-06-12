<template>
  <div class="animate-pulse flex flex-col border border-[#AD7084] rounded-[20px] p-[30px] space-y-6">
    <div class="flex flex-col items-center mb-8">
      <div class="w-[139px] h-[139px] rounded-full bg-[#d3bfc8] mb-4"></div>
      <div class="h-[20px] w-[100px] bg-[#C6C6C7] rounded"></div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="i in 4" :key="i">
        <div class="h-[14px] bg-[#C6C6C7] w-[120px] mb-2 rounded"></div>
        <div class="h-[50px] bg-[#EBE4DF] rounded-[14px]"></div>
      </div>
    </div>
    <div class="flex justify-end mt-[30px]">
      <div class="w-[150px] h-[50px] bg-[#d3bfc8] rounded-[100px]"></div>
    </div>
  </div>
</template>
