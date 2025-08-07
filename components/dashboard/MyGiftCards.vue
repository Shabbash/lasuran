<template>
  <div class="min-h-screen px-6 py-10 bg-[#A0576F] text-[#C6C6C7] font-sans text-sm">
    <!-- Header -->
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-[20px] pb-7 mb-7 border-b border-[#AD7084]">
      <h1 class="text-lg font-medium text-[#EBE4DF]">{{ t('my_gift_cards_title') }}</h1>
      <button class="px-6 py-1.5 bg-[#6B8B9B] text-white rounded-full text-sm font-medium transition-colors"
        @click="goToBooking">
        {{ t('buy_new_card_button') }}
      </button>
    </div>

    <!-- Skeleton loader -->
    <GiftCardSkeleton v-if="isLoading" />

    <!-- Main Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">

      <!-- Gift Cards List (Vertical Swiper) -->
      <div class="h-[210px] md:h-[770px]">
        <Swiper :modules="[Mousewheel]" direction="vertical" :mousewheel="{ forceToAxis: true, releaseOnEdges: true }"
          :breakpoints="{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 4 }
          }" :spaceBetween="20" class="h-full" @activeIndexChange="onActiveCardChange">
          <SwiperSlide v-for="(group, index) in giftCards" :key="group.id">
            <div class="gift-card p-[20px] border rounded-[12px] text-[13px] font-[350] cursor-pointer"
              :class="{ active: activeCardIndex === index }" @click="activeCardIndex = index">
              <p class="text-[17px] font-medium mb-[20px]">{{ t('gift_card_label') }}: {{ group.total }} {{
                group.currency }}</p>
              <div class="flex justify-between mb-[11px] pb-[11px] border-b">
                <span>{{ t('gift_card_number_label') }}</span>
                <span>{{ group.items?.length ?? 1 }}</span>
              </div>
              <div class="flex justify-between mb-[11px] pb-[11px] border-b">
                <span>{{ t('gift_card_purchase_no') }}</span>
                <span>{{ group.order_number }}</span>
              </div>
              <div v-if="group.items?.[0]?.expiry_date" class="flex justify-between">
                <span>{{ t('gift_card_expiry_date') }}</span>
                <span>{{ group.items[0].expiry_date }}</span>
              </div>


            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <!-- Swiper Preview + Payment Summary -->
      <div>
        <GiftCardSwiper class="mb-[30px]" :active-index="activeCardIndex" :card="giftCards[activeCardIndex]"
          :count="giftCards[activeCardIndex]?.items?.length ?? 1" @card-click="openCardModal" />

        <div class="px-[25px] py-[35px] rounded-[12px] text-[15px] font-[400] border border-[#AD7084] text-[#C6C6C7]">
          <h3 class="text-[18px] font-medium mb-[17px] text-[#EBE4DF] text-center">{{ t('payment_details_title') }}</h3>
          <div class="custom-border mb-[18px] relative">
            <div class="flex justify-between mb-[9px]">
              <span>{{ t('payment_subtotal_label') }}</span>
              <span>{{ giftCards[activeCardIndex]?.sub_total }} {{ giftCards[activeCardIndex]?.currency }}</span>
            </div>
            <div class="flex justify-between mb-[9px]">
              <span>{{ t('payment_vat_label', { rate: giftCards[activeCardIndex]?.tax_rate }) }}</span>
              <span>{{ giftCards[activeCardIndex]?.tax }} {{ giftCards[activeCardIndex]?.currency }}</span>
            </div>
            <div class="flex justify-between pb-[18px]">
              <span>{{ t('payment_discount_label') }}</span>
              <span>{{ giftCards[activeCardIndex]?.discounts || 0 }} {{ giftCards[activeCardIndex]?.currency }}</span>
            </div>
          </div>
          <div class="flex justify-between text-[17px] font-[500]">
            <span>{{ t('payment_grand_total_label') }}</span>
            <span>{{ giftCards[activeCardIndex]?.total }} {{ giftCards[activeCardIndex]?.currency }}</span>
          </div>
        </div>

        <BaseButton @click="viewInvoice"
          class="bg-[#6B8B9B] hover:bg-[#6B8B9B]/70 mt-[27px] text-[#EBE4DF] text-[15px] font-[400] rounded-full w-full py-[12px]">
          {{ t('payment_view_invoice') }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import GiftCardSwiper from '~/components/giftcards/GiftCardSwiper.vue'
import GiftCardSkeleton from '~/components/skeletons/MyGiftCardSkeleton.vue'
import { useApp } from '~/stores/app'
import { COMPONENTS } from '~/data/constants'

import { Swiper, SwiperSlide } from 'swiper/vue'
import { Mousewheel } from 'swiper/modules'
import 'swiper/css'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

// Stores
const appStore = useApp()

// Router
const router = useRouter()

// State
const isLoading = ref(true)
const selectedCard = ref(null)
const giftCards = ref([])
const activeCardIndex = ref(0)

// Navigate to gift card purchase
const goToBooking = () => {
  router.push('/gift-cards')
}

// Fetch gift cards on mount
onMounted(async () => {
  await fetchGiftCards()
  isLoading.value = false
})

// Fetch gift card data from API
const fetchGiftCards = async () => {
  try {
    const { data: response, error } = await useApi('vouchers/list_orders', {
      method: 'GET'
    })

    if (!error.value && response.value?.status) {
      giftCards.value = response.value.data?.voucher_groups || []

      if (giftCards.value.length > 0) {
        selectCard(0)
      }
    } else {
      console.error('Error fetching gift cards:', error.value)
      giftCards.value = []
    }
  } catch (err) {
    console.error('Error in fetchGiftCards:', err)
    giftCards.value = []
  }
}

// Select active card
const selectCard = (index) => {
  activeCardIndex.value = index
  selectedCard.value = giftCards.value[index] || null
}

// Handle Swiper change
const onActiveCardChange = (swiper) => {
  selectCard(swiper.activeIndex)
}

// Open Gift Card Details Modal
const openCardModal = (card) => {
  selectedCard.value = card
  appStore.setDialogComponent(COMPONENTS.GIFT_CARD_DETAILS, {
    selectedCard: card
  })
  appStore.setDialogShow(true)
}

// Open Redeem History Dialog
const handleRedeemHistoryOpen = () => {
  appStore.setDialogComponent(COMPONENTS.GIFT_CARD_REDEEM_HISTORY, {
    selectedCard: selectedCard.value
  })
  appStore.setDialogShow(true)
}

// Open invoice link
const viewInvoice = () => {
  const card = selectedCard.value
  if (card?.invoice_link) {
    window.open(card.invoice_link, '_blank')
  }
}

// Get redeemed amount
const getRedeemedAmount = () => {
  if (!selectedCard.value) return '0.00'
  const total = parseFloat(selectedCard.value.total || 0)
  const remaining = parseFloat(selectedCard.value.remaining_amount || 0)
  const redeemed = total - remaining
  return redeemed > 0 ? redeemed.toFixed(2) : '0.00'
}

// Get redeem history array
const getRedeemHistory = () => {
  if (!selectedCard.value) return []
  return selectedCard.value.redeem_history || []
}

// Status badge style
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


<style scoped>
.gift-card {
  background-color: #a0576f;
  border-color: #ad7084;
  color: #c6c6c7;
  transition: background-color 0.3s, color 0.3s;
}

.gift-card p {
  color: #ebe4df;
}

.gift-card div {
  border-color: #ad7084;
}

.gift-card.active {
  background-color: #ebe4df;
  color: #5b605c;
}

.gift-card.active p {
  color: #a0576f;
}

.gift-card.active div {
  border-color: #d8d8d8;
}

.custom-border::after {
  content: '';
  position: absolute;
  border-bottom: 1px dashed #ad7084;
  width: 90%;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
</style>
