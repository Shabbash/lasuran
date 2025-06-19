<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Left: Tickets List (Swiper Simulation) -->
    <div class="h-[720px] space-y-5">
      <div v-for="i in 4" :key="i" class="p-[20px] rounded-[12px] border border-[#AD7084] bg-[#AD7084]/20 animate-pulse">
        <div class="flex justify-between items-center mb-3">
          <div class="h-[18px] w-[40%] bg-[#C6C6C7]/30 rounded"></div>
          <div class="h-[18px] w-[60px] bg-[#C6C6C7]/30 rounded-full"></div>
        </div>
        <div class="h-[14px] w-full border-b border-[#AD7084] mb-2 pb-2 bg-[#C6C6C7]/20 rounded"></div>
        <div class="h-[14px] w-full border-b border-[#AD7084] mb-2 pb-2 bg-[#C6C6C7]/20 rounded"></div>
        <div class="h-[14px] w-[60%] bg-[#C6C6C7]/20 rounded"></div>
      </div>
    </div>

    <!-- Right: Ticket Details -->
    <div class="flex flex-col h-full space-y-6">
      <div class="p-[20px] rounded-[12px] bg-[#EBE4DF] animate-pulse space-y-3">
        <div class="h-[16px] w-full bg-[#5B605C]/20 rounded"></div>
        <div class="h-[16px] w-full bg-[#5B605C]/20 rounded"></div>
        <div class="h-[16px] w-full bg-[#5B605C]/20 rounded"></div>
        <div class="h-[60px] w-full bg-[#5B605C]/10 rounded"></div>
      </div>

      <div class="h-[430px] rounded-[16px] bg-[#5B605C]/10 animate-pulse"></div>
    </div>
  </div>
</template>
