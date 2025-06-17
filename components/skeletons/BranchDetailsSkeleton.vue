<template>
  <div class="bg-decore-modal mx-auto rounded-[30px] overflow-hidden shadow-lg bg-[#EBE4DF] text-[#5F2C3E] animate-pulse">
    <!-- صورة الفرع -->
    <div class="w-full h-[200px] bg-[#D9D9D9] rounded-[30px]"></div>

    <!-- تفاصيل الفرع -->
    <div class="mx-[20px] mt-[20px] mb-[40px] relative">
      <!-- اسم الفرع والسهم -->
      <div class="flex justify-between items-center mb-2">
        <div class="bg-[#D9D9D9] h-[32px] w-[180px] rounded"></div>
        <div class="flex items-center gap-2">
          <div class="bg-[#D9D9D9] w-3 h-3 rounded-full"></div>
          <div class="bg-[#D9D9D9] h-[16px] w-[60px] rounded"></div>
        </div>
      </div>

      <!-- العنوان -->
      <div class="h-[18px] w-[120px] bg-[#D9D9D9] rounded mb-[10px]"></div>

      <!-- الهاتف -->
      <div class="h-[18px] w-[100px] bg-[#D9D9D9] rounded mb-[10px]"></div>

      <!-- الوصف -->
      <div class="space-y-2 mb-[20px]">
        <div class="h-[14px] w-full bg-[#D9D9D9] rounded"></div>
        <div class="h-[14px] w-2/3 bg-[#D9D9D9] rounded"></div>
      </div>

      <!-- جدول المواعيد -->
      <div class="mx-[40px] mt-[30px]">
        <div class="p-[20px] rounded-[20px] bg-[#A0576F] space-y-4">
          <div class="h-[16px] w-[140px] bg-[#D9D9D9] rounded"></div>
          <div class="space-y-2">
            <div v-for="i in 5" :key="i" class="flex justify-between">
              <div class="h-[16px] w-[80px] bg-[#D9D9D9] rounded"></div>
              <div class="h-[16px] w-[100px] bg-[#D9D9D9] rounded"></div>
            </div>
          </div>
        </div>

        <!-- الزر -->
        <div class="h-[50px] w-full bg-[#D9D9D9] rounded-[100px] mt-[30px]"></div>
      </div>
    </div>
  </div>
</template>
