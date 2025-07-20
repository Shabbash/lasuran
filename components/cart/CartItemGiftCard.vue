<template>
  <div class="flex items-start justify-between border-b border-[#AD7084] pb-[14px] mb-[14px]">
    <div class="flex items-center gap-4">
      <img :src="card.card_image" alt="Gift Card Image" class="w-[65px] h-[65px] rounded-[10px] object-cover" />
      <div>
        <h3 class="text-white text-[15px] font-normal leading-normal">
          🎁 {{ card.name || t('gift_card') }}
        </h3>
        <p class="text-[#D29F8C] text-[14px] font-[350] leading-normal">
          {{ t('serial_number') }}: {{ card.serial_number }}
        </p>
      </div>
    </div>
    <div class="flex flex-col items-end justify-between h-full">
      <p class="text-white text-[15px] font-normal leading-normal"><span class="sar-icon">&#xe900;</span> {{
        card.price_with_tax }}</p>
      <button @click="$emit('remove', card)" class="text-[#C44E4E] text-sm hover:underline">
        {{ t('remove') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

// ✅ Load translation function
const { t } = useI18n()

// ✅ Define props
defineProps({
  card: { type: Object, required: true }
})

// ✅ Define emitted events
defineEmits(['remove'])
</script>
