<template>
  <div class="space-y-8">
    <!-- Slider Placeholder -->
    <div class="w-full h-[374px] bg-[#EBE4DF] animate-pulse rounded-[23px]"></div>

    <!-- Popular Items Skeleton -->
    <div>
      <div class="h-6 w-[150px] bg-[#EBE4DF] animate-pulse mb-4 rounded"></div>
      <div class="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div
          v-for="i in 6"
          :key="'popular-' + i"
          class="h-[215px] bg-[#EBE4DF] animate-pulse rounded-[24px] relative overflow-hidden"
        >
          <div class="absolute inset-0 flex flex-col justify-between h-full p-4">
            <div class="h-[90px] bg-white/40 rounded"></div>
            <div class="space-y-2">
              <div class="h-4 w-3/4 bg-white/40 rounded"></div>
              <div class="h-3 w-1/2 bg-white/40 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Arrival Skeleton -->
    <div>
      <div class="h-6 w-[150px] bg-[#EBE4DF] animate-pulse mb-4 rounded"></div>
      <div class="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div
          v-for="i in 6"
          :key="'new-' + i"
          class="h-[215px] bg-[#EBE4DF] animate-pulse rounded-[24px] relative overflow-hidden"
        >
          <div class="absolute inset-0 flex flex-col justify-between h-full p-4">
            <div class="h-[90px] bg-white/40 rounded"></div>
            <div class="space-y-2">
              <div class="h-4 w-3/4 bg-white/40 rounded"></div>
              <div class="h-3 w-1/2 bg-white/40 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
