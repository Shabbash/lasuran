<template>
  <div class="flex flex-col gap-[24px]">
    <div class="relative min-h-[222px] cursor-pointer">
      <!-- Background Layer -->
      <div class="absolute inset-0 top-[85px] rounded-[24px] linear_bg--shop"></div>

      <!-- branch Content -->
      <div class="absolute inset-0 flex flex-col justify-end h-full">
        <!-- Image -->
        <div>
          <img class="mx-auto h-full object-cover inset-0 relative" src="public/assets/img/product-1.svg" alt="" />
        </div>



      </div>
    </div>
    <h3 class="text-white text-center text-[23px] font-medium">
      Bridal Collection
    </h3>

  </div>
</template>

<script setup lang="ts">

</script>


<style>
.linear_bg--shop {
  background: linear-gradient(95deg, rgba(232, 213, 204, 0.00) -2.03%, #E8BBAC 45.84%), linear-gradient(0deg, #E8D5CC 0%, #E8D5CC 100%), #D9D9D9;


}
</style>