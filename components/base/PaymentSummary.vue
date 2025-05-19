<template>
  <div class="p-[24px] pb-[40px] rounded-[16px] border border-[#E7E7E7] bg-[#EBE4DF]">
    <h2 class="text-[#A0576F] mb-[16px] text-[20px] font-medium leading-normal">Payment Details</h2>

    <div class="space-y-[16px] text-[#5B605C]text-[14px] font-medium">
      <div class="flex justify-between">
        <span>Subtotal ({{ servicesCount }} Services)</span>
        <span class="font-bold">{{ subtotal.toFixed(2) }} SAR</span>
      </div>
      <div class="flex justify-between">
        <span>VAT (15%)</span>
        <span class="font-bold">{{ vat.toFixed(2) }} SAR</span>
      </div>
      <div class="flex justify-between">
        <span>Services cost</span>
        <span class="font-bold">{{ serviceCost.toFixed(2) }} SAR</span>
      </div>
      <div class="flex justify-between">
        <span>Discount</span>
        <span class="font-bold">{{ discount.toFixed(2) }} SAR</span>
      </div>
    </div>

    <div class="space-y-4 mt-4">

      <div class="flex gap-2 relative border border-[#A0576F] rounded-[100px] overflow-hidden">
        <UInput placeholder="Enter Promo Code"
          class="flex-1 bg-transparent text-[15px] font-normal leading-normal capitalize ps-[24px] h-[44px] summary-input" />
        <UButton
          class="h-full bg-transparent text-[#A0576F] text-[15px] font-normal leading-normal underline p-0 pe-[24px] h-[44px] hover:bg-transparent"
          color="primary" variant="soft">Apply</UButton>
      </div>
      <div class="flex gap-[15px]">
        <div class="flex gap-2 relative border border-[#A0576F] rounded-[100px] overflow-hidden">
          <UInput placeholder="Gift Card SN"
            class="flex-1 bg-transparent text-[15px] font-normal leading-normal capitalize ps-[24px] h-[44px] summary-input" />
          <UButton
            class="h-full bg-transparent text-[#A0576F] text-[15px] font-normal leading-normal underline p-0 pe-[24px] h-[44px] hover:bg-transparent"
            color="primary" variant="soft">Apply</UButton>
        </div>
        <a href="#"
          class="flex items-center justify-center px-[18px] w-[45%] text-[#6B8B9B] bg-[#BBCACF] text-center text-[14px] font-normal leading-normal rounded-[100px] h-[44px]">All
          Cards</a>
      </div>
      <div class="flex items-center gap-2 text-sm text-[#A0576F]">
        <UCheckbox v-model="accepted" />
        <span>Accept terms and conditions</span>
      </div>
      <UButton class="cart-btn flex align-center gap-[24px] w-full text-white py-3 rounded-full font-[600] text-[16px] justify-center bg-[#A0576F] hover:bg-[#913E5D] mt-[35px] disabled:bg-[#A0576F]" :disabled="!accepted || servicesCount === 0">
        {{ total.toFixed(2) }} SAR - Checkout
      </UButton>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  servicesCount: number
  subtotal: number
  vat?: number
  discount?: number
  serviceCost?: number
  total?: number
}>()

// Use provided values or compute defaults
const vat = computed(() => props.vat !== undefined ? props.vat : props.subtotal * 0.15)
const discount = computed(() => props.discount || 0)
const serviceCost = computed(() => props.serviceCost || 0)
const total = computed(() => props.total !== undefined ? props.total : props.subtotal + vat.value - discount.value + serviceCost.value)

const accepted = ref(false)
</script>

<style>
.summary-input input {
  background-color: transparent !important;
  border: 0;
  box-shadow: unset;
  padding: 0;
  height: 100%;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-transform: capitalize;
}
</style>