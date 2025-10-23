<template>
  <div class="rounded-[12px] bg-[#EBE4DF] p-[12px]" @click="$emit('select')"
    tabindex="0"
    role="button">
    <div class="rounded-[9px] p-[10px] bg-[#fff] flex items-center justify-center overflow-hidden relative">
      <img class="max-h-full max-w-full" :src="item.image" />
      <button
        class="w-[24px] h-[24px] rounded-full flex items-center justify-center border border-[#A0576F] bg-[#A0576F] absolute top-[5px] end-[5px] cursor-pointer">
        <OutlineHeartIcon />
      </button>
    </div>
    <div>
      <h3 class="text-[#404553] text-[16px] font-medium capitalize mt-[11px] mb-[18px]">
       {{  item.name}}
      </h3>
      <!-- <div
        class="inline-flex h-[22px] px-[4px] justify-center items-center gap-[6px] bg-[#FCFBF4] rounded-[4px] mb-[16px]">
        <div class="flex items-center gap-[2px]">
          <span class="text-[#231F20] text-center text-[11px] font-bold capitalize">4.4</span>
          <ProductRateIcon />
        </div>
        <span class="text-[#9BA0B1] text-[12px] font-normal capitalize">( 267 )</span>
      </div> -->

      <div class="flex items-center">
        <p class="text-[#A0576F] text-[17px] font-bold capitalize me-[7px]"><span class="sar-icon">&#xe900;</span> {{item.original_price}}</p>
        <p class="text-[#7E859B] text-[11px] font-normal line-through capitalize me-[3px]" v-if="item.discount"><span>{{ item.price_before_discount }}</span></p>
        <!-- <p class="text-[#A0576F] text-[12px] font-bold uppercase"><span>73%</span></p> -->
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">


import OutlineHeartIcon from '@/components/icons/OutlineHeartIcon.vue'
import ProductRateIcon from '@/components/icons/ProductRateIcon.vue'


defineProps({
  item: {
    type: Object,
    required: true
  }
})


</script>


<style></style>