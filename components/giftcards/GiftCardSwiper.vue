<script setup>
import { computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import InfoOutlinedIcon from '@/components/icons/InfoOutlinedIcon.vue'

const props = defineProps({
  card: {
    type: Object,
    required: true
  }
})

const cards = computed(() => props.card?.items || [])

// Get status class for gift card status
const getStatusClass = (status) => {
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

<template>
  <div class="border border-[#AD7084] rounded-[12px] p-[20px] bg-[#A0576F] text-[#C6C6C7]">
    <div class="flex items-center gap-[15px] text-[12px] text-[#BBCACF] mb-[20px]">
      <InfoOutlinedIcon />
      <span>{{ props.card?.single_use_message || 'This card is valid for one time use only.' }}</span>
    </div>

    <Swiper
      direction="vertical"
      loop
      :slides-per-view="1"
      grab-cursor
      class="max-h-[210px] w-full max-w-[330px] mx-auto"
    >
      <SwiperSlide v-for="(voucher, index) in cards" :key="index">
        <div class="relative rounded-[14px] overflow-hidden cursor-pointer transition hover:scale-[1.01]" @click="$emit('card-click', voucher)">
          <img class="w-full" :src="voucher.card_image || '/assets/img/my-gift-card.svg'" alt="Gift Card Image" />
          <div class="absolute inset-0 px-[15px] py-[15px] flex flex-col justify-between">
            <div class="flex justify-between">
              <div class="max-w-[70px]">
                <img class="w-full" src="/assets/img/card-laz.svg" alt="" />
              </div>
              <div
                class="h-[23px] px-[20px] flex items-center justify-center rounded-[100px] text-[13px]"
                :class="getStatusClass(voucher.status)">
                <span>{{ voucher.status || 'Active' }}</span>
              </div>
            </div>
            <div>
              <div class="flex flex-col items-end pe-[20px]">
                <p class="text-white text-[21.94px] font-normal tracking-[0.52em] text-end">
                  {{ voucher.serial_number || 'GC-' + (100000 + index) }}
                </p>
                <p class="text-white text-[13.96px] font-bold opacity-70 text-end">
                  {{ voucher.expiry_date || '—' }}
                </p>
              </div>
              <div>
                <p class="text-white text-[12.97px] font-medium">GIFT CARD</p>
                <p class="text-white text-[18.53px] font-bold">{{ voucher.remaining_amount || voucher.price }} {{ voucher.currency || 'SAR' }}</p>
              </div>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
</template>
