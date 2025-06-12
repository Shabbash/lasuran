<template>
  <div class="animate-pulse py-[34px] px-[15px] md:px-[30px] border border-[#AD7084] rounded-[20px] flex flex-col gap-[20px]">

    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-[10px]">
      <div class="h-[24px] w-[160px] bg-[#AD7084] rounded"></div>
      <div class="h-[30px] w-[180px] bg-[#C6C6C7] rounded-full"></div>
    </div>

    <!-- Card -->
    <div class="flex flex-col md:flex-row gap-[35px]">
      <div class="flex-1 space-y-6">
        <div class="h-[220px] w-full bg-[#C6C6C7] rounded-[16px]"></div>

        <div class="h-[60px] bg-[#C6C6C7] rounded-full w-full"></div>

        <div class="space-y-2">
          <div class="h-[18px] w-[180px] bg-[#AD7084] rounded"></div>
          <div class="h-[50px] bg-[#C6C6C7] rounded-[13px]"></div>
          <div class="h-[14px] w-[300px] bg-[#AD7084] rounded"></div>
        </div>

        <div class="space-y-2">
          <div class="h-[18px] w-[100px] bg-[#AD7084] rounded"></div>
          <div class="h-[50px] bg-[#C6C6C7] rounded-[13px]"></div>
        </div>

        <div class="h-[50px] bg-[#C6C6C7] rounded-full mt-[20px]"></div>
      </div>

      <!-- Transactions -->
      <div class="flex-1 border border-[#AD7084] rounded-[16px] p-[14px] space-y-5">
        <div class="h-[24px] w-[200px] bg-[#AD7084] rounded mx-auto"></div>

        <div v-for="i in 5" :key="i" class="space-y-[6px] border-b border-[#AD7084] pb-2">
          <div class="flex justify-between items-center">
            <div class="space-y-1">
              <div class="h-[14px] w-[80px] bg-[#C6C6C7] rounded"></div>
              <div class="h-[14px] w-[100px] bg-[#AD7084] rounded"></div>
            </div>
            <div class="space-y-1 text-end">
              <div class="h-[14px] w-[60px] bg-[#44BB94] rounded"></div>
              <div class="h-[12px] w-[150px] bg-[#C6C6C7] rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
