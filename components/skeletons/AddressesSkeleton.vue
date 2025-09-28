<template>
  <div
    class="bg-decore-modal mx-auto rounded-[30px] overflow-hidden shadow-lg bg-[#EBE4DF] text-[#5F2C3E]"
    modalMaxWidth="max-w-[539px]"
    show="true"
  >
    <div class="px-[20px] md:px-[53px] py-[34px] relative">
      <!-- Title -->
      <div class="animate-pulse">
        <div class="h-[28px] w-[180px] bg-[#d6d0cc] rounded mx-auto mb-[32px]"></div>
      </div>

      <!-- Address list skeleton -->
      <div class="space-y-3">
        <div
          v-for="i in 3"
          :key="i"
          class="px-[30px] py-[20px] border-[2px] border-[#A0576F] rounded-[12px] flex justify-between bg-[#EDE7E3] animate-pulse"
        >
          <!-- Left block -->
          <div class="flex-1">
            <div class="h-[20px] w-[120px] bg-[#d6d0cc] rounded mb-[8px]"></div>
            <div class="h-[16px] w-[220px] bg-[#d6d0cc] rounded"></div>
          </div>

          <!-- Right block (buttons) -->
          <div class="flex gap-3 justify-end items-start">
            <div class="h-[22px] w-[24px] bg-[#cbbab6] rounded"></div>
            <div class="h-[22px] w-[24px] bg-[#cbbab6] rounded"></div>
          </div>
        </div>
      </div>

      <!-- Add new address button skeleton -->
      <div class="mt-[20px] flex justify-center animate-pulse">
        <div class="h-[50px] w-full bg-[#d6d0cc] rounded-full"></div>
      </div>
    </div>
  </div>
</template>
