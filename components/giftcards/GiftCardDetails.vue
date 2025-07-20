<template>
  <div class="bg-decore-modal mx-auto rounded-[30px] overflow-hidden shadow-lg bg-[#EBE4DF] text-[#5F2C3E]">
    <div class="px-[20px] md:px-[53px] py-[34px] relative" v-if="props.selectedCard">
      <!-- Title -->
      <h2 class="text-center mb-[43px] text-[#A0576F] text-[18.29px] font-bold leading-normal">
        {{ $t('gift_card_title', { amount: props.selectedCard.total, currency: props.selectedCard.currency }) }}
      </h2>

      <!-- Card visual -->
      <div class="relative rounded-[14px] overflow-hidden bg-[#e9c9ad] h-[127px]">
        <img class="w-full h-full object-cover"
          :src="props.selectedCard.card_image || '/assets/img/my-gift-card.svg'"
          alt="Gift Card Image" />
        <div class="absolute inset-0 px-[15px] py-[15px] flex flex-col justify-between">
          <div class="flex justify-between">
            <div class="max-w-[70px]">
              <img class="w-full" src="/assets/img/card-laz.svg" alt="Logo" />
            </div>
            <div class="h-[23px] px-[20px] flex items-center justify-center rounded-[100px] text-[13px]"
              :class="getStatusClass(props.selectedCard.status)">
              <span>{{ props.selectedCard.status || 'Active' }}</span>
            </div>
          </div>
          <div>
            <p class="text-white text-[12.97px] font-medium">GIFT CARD</p>
            <p class="text-white text-[18.53px] font-bold">
              {{ props.selectedCard.remaining_amount || props.selectedCard.total }} {{ props.selectedCard.currency }}
            </p>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="px-[18px] py-[20px] rounded-[16px] bg-[#A0576F] mt-[10px]">
        <p class="text-[#EBE4DF] font-medium text-[16px] leading-normal">
          {{ $t('gift_card_description_label') }}
        </p>
        <p class="text-[#C6C6C7] font-normal text-[14px]"
          v-html="props.selectedCard.description || $t('gift_card_description_default')">
        </p>
      </div>

      <!-- Details -->
      <div class="px-[18px] py-[20px] rounded-[16px] bg-[#A0576F] mt-[10px]">
        <p class="text-[#EBE4DF] font-medium text-[17px] leading-normal mb-[20px]">
          {{ $t('gift_card_details_label') }}
        </p>

        <div class="flex justify-between pb-[11px] mb-[11px] border-b border-b-[#AD7084]">
          <p class="text-[#C6C6C7] text-[13px]">{{ $t('gift_card_serial') }}</p>
          <p class="text-[#C6C6C7] text-[13px]">{{ props.selectedCard.serial_number || 'N/A' }}</p>
        </div>

        <div class="flex justify-between pb-[11px] mb-[11px] border-b border-b-[#AD7084]">
          <p class="text-[#C6C6C7] text-[13px]">{{ $t('gift_card_expiry') }}</p>
          <p class="text-[#C6C6C7] text-[13px]">{{ props.selectedCard.expiry_date || 'N/A' }}</p>
        </div>

        <div class="flex justify-between pb-[11px] mb-[11px] border-b border-b-[#AD7084]">
          <p class="text-[#C6C6C7] text-[13px]">{{ $t('gift_card_order_number') }}</p>
          <p class="text-[#C6C6C7] text-[13px]">{{ props.selectedCard.voucher_order_number || 'N/A' }}</p>
        </div>

        <div class="flex justify-between pb-[11px] mb-[11px] border-b border-b-[#AD7084]">
          <p class="text-[#C6C6C7] text-[13px]">{{ $t('gift_card_redeemed') }}</p>
          <p class="text-[#C6C6C7] text-[13px]">{{ getRedeemedAmount() }} {{ props.selectedCard.currency }}</p>
        </div>

        <div v-if="props.selectedCard.remaining_amount"
          class="flex justify-between pb-[11px] mb-[11px] border-b border-b-[#AD7084]">
          <p class="text-[#C6C6C7] text-[13px]">{{ $t('gift_card_remaining') }}</p>
          <p class="text-[#C6C6C7] text-[13px]">{{ props.selectedCard.remaining_amount }} {{ props.selectedCard.currency }}</p>
        </div>
      </div>

      <!-- QR + History -->
      <div class="text-center">
        <div class="qr mx-auto w-[160px] h-[165px] my-[22px]">
          <img class="w-full" :src="props.selectedCard.qr_code || '/assets/img/qr.png'" alt="QR Code" />
        </div>

        <BaseButton
          @click="openRedeemHistory"
          class="bg-[#6B8B9B] hover:bg-[#6B8B9B]/70 mt-[27px] text-[#EBE4DF] text-[15px] font-[400] rounded-full w-full py-[12px]">
          {{ $t('gift_card_redeem_history') }}
        </BaseButton>
      </div>

      <!-- Summary -->
      <div class="mt-[34px]">
        <h3 class="text-[#A0576F] text-[18px] font-medium leading-normal mb-[23px]">
          {{ $t('gift_card_payment_summary') }}
        </h3>
        <div class="space-y-[12px]">
          <div class="flex justify-between pb-[12px] border-b border-b-[#B2B0B0]">
            <p class="text-[#5B605C] text-[14px] font-[350]">{{ $t('gift_card_subtotal') }}</p>
            <p class="text-[#5B605C] text-[14px] font-[350]">
              {{ props.selectedCard.sub_total || '0.00' }} {{ props.selectedCard.currency }}
            </p>
          </div>

          <div class="flex justify-between pb-[12px] border-b border-b-[#B2B0B0]">
            <p class="text-[#5B605C] text-[14px] font-[350]">
              {{ $t('gift_card_vat', { rate: props.selectedCard.tax_rate || '15' }) }}
            </p>
            <p class="text-[#5B605C] text-[14px] font-[350]">
              {{ props.selectedCard.tax || '0.00' }} {{ props.selectedCard.currency }}
            </p>
          </div>

          <div class="flex justify-between pb-[12px] border-b border-b-[#B2B0B0]">
            <p class="text-[#5B605C] text-[14px] font-[350]">{{ $t('gift_card_discount') }}</p>
            <p class="text-[#5B605C] text-[14px] font-[350]">
              {{ props.selectedCard.discounts || '0.00' }} {{ props.selectedCard.currency }}
            </p>
          </div>

          <div class="flex justify-between pb-[12px] border-b border-b-[#B2B0B0]">
            <p class="text-[#5B605C] text-[14px] font-[500]">{{ $t('gift_card_total') }}</p>
            <p class="text-[#5B605C] text-[14px] font-[500]">
              {{ props.selectedCard.total || '0.00' }} {{ props.selectedCard.currency }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/base/Button.vue'
import { useApp } from '~/stores/app'
import { COMPONENTS } from '~/data/constants'
import { useI18n } from 'vue-i18n' // ✅ import i18n

// ✅ access translation function
const { t } = useI18n()

const props = defineProps<{
  selectedCard: any
}>()

const appStore = useApp()

const openRedeemHistory = () => {
  appStore.setDialogComponent(COMPONENTS.GIFT_CARD_REDEEM_HISTORY, {
    selectedCard: props.selectedCard
  })
  appStore.setDialogShow(true)
}

const getRedeemedAmount = () => {
  const total = parseFloat(props.selectedCard.total || 0)
  const remaining = parseFloat(props.selectedCard.remaining_amount || 0)
  return (total - remaining).toFixed(2)
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Not Used':
      return 'bg-[#CDEAB7] text-[#57A06A]'
    case 'Used':
      return 'bg-[#FFE4E1] text-[#D32F2F]'
    case 'Expired':
      return 'bg-[#FFF3CD] text-[#856404]'
    default:
      return 'bg-[#CDEAB7] text-[#57A06A]'
  }
}
</script>
