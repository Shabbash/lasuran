<template>
  <div class="p-[24px] pb-[40px] max-h-[80vh] overflow-y-auto">
    <h2 class="text-center text-[18px] font-medium text-[#A0576F] mb-[30px]">My Gift Cards</h2>

    <div v-if="giftCards.length === 0" class="text-center text-[#A0576F]">No gift cards available.</div>

    <div
      v-for="(card, index) in giftCards"
      :key="index"
      @click="selectCard(card)"
      class="relative cursor-pointer mb-4 rounded-[14px] overflow-hidden transition hover:scale-[1.01]"
    >
      <div class="w-full h-full">
        <img
          class="w-full h-full object-cover"
          :src="card.card_image"
          alt="gift"
        />
      </div>

      <div class="flex items-center justify-between absolute inset-0 px-[17px] py-[15px]">
        <div class="flex flex-col justify-between h-full">
          <div>
            <h2 class="text-white text-[15px] font-bold leading-normal">
              {{ card.voucher_group_name || 'Gift Card' }}
            </h2>
            <h3 class="text-white text-[40px] font-bold leading-normal">
              <span class="sar-icon">&#xe900;</span> {{ card.value }}
              <span class="text-[20px]">{{ card.currency || '' }}</span>
            </h3>
          </div>
          <p class="text-white text-[11px] font-bold leading-normal">
            {{ card.serial_number }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useApp } from '~/stores/app'

const emit = defineEmits(['select'])
const app = useApp()

const { giftCards } = defineProps({
  giftCards: {
    type: Array,
    default: () => []
  }
})

const selectCard = (card) => {
  emit('select', card.serial_number)
  app.setDialogShow(false)
}
</script>
