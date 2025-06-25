<!-- components/cart/CheckoutPaymentDialog.vue -->
<template>
  <div class="pt-[24px] pb-[50px] px-[28px]">
    <h2 class="font-bold text-[30px] text-[#A0576F] leading-[100%] mb-[25px]">Payment Method</h2>
    <p class="text-[#5B605C] text-[14px] font-[350] mb-[15px]">Select your preferred payment method:</p>

    <!-- Payment Options as Radio Cards -->
    <URadioGroup v-model="selectedPayment" orientation="vertical" indicator="hidden" variant="card"
      :items="paymentOptions" class="flex flex-col gap-4" :ui="{
        root: 'relative block',
        fieldset: 'flex flex-col gap-4 radiogroup',
        item: 'h-[80px] rounded-[16px] flex items-center gap-3 bg-[#E6CDC7A3] border-0 px-[19px] py-[14px] text-[15px] font-normal leading-normal has-data-[state=checked]:bg-[#A0576F] has-data-[state=checked]:text-[#EBE4DF]',
        container: 'flex items-center gap-3',
        label: 'text-[#A0576F] font-medium'
      }">
      <template #leading="{ item }">
        <img :src="item.icon" alt="icon" class="w-[24px] h-[24px]" />
      </template>
    </URadioGroup>

    <!-- Continue Button -->
    <BaseButton label="Continue"
      class="bg-[#A0576F] text-white rounded-[100px] w-full py-[16px] mt-[50px] justify-center text-[18px] font-normal leading-[100%] tracking-[0] border border-[#A0576F] hover:bg-[#913E5D] transition cursor-pointer disabled:bg-[#A0576F]"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectedPayment = ref('cash')

const paymentOptions = [
  { label: 'Cash on Delivery', value: 'cash', icon: '/assets/img/icon-cash.svg' },
  { label: 'Online Payment', value: 'online', icon: '/assets/img/icon-online.svg' }
]
</script>
