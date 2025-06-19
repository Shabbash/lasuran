<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div v-for="n in 6" :key="n" class="relative rounded-[16px] overflow-hidden bg-[#EBE4DF] animate-pulse h-[200px]">
      <div class="absolute inset-0 flex items-center justify-between px-[17px] py-[15px]">
        <div class="flex flex-col justify-between h-full w-full">
          <div>
            <div class="bg-[#D4CFCB] h-[15px] w-[80px] mb-2 rounded"></div>
            <div class="bg-[#D4CFCB] h-[40px] w-[100px] rounded"></div>
          </div>
          <div class="bg-[#D4CFCB] h-[11px] w-[60px] rounded"></div>
        </div>
        <div class="bg-[#D4CFCB] h-[30px] w-[30px] rounded-full"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No logic needed
</script>
