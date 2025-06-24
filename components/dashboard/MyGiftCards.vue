<template>
  <div class="min-h-screen px-6 py-10 bg-[#A0576F] text-[#C6C6C7] font-sans text-sm">
    <!-- Header -->
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-[20px] pb-7 mb-7 border-b border-[#AD7084]">
      <h1 class="text-lg font-medium text-[#EBE4DF]">My Gift Cards</h1>
      <button class="px-6 py-1.5 bg-[#6B8B9B] text-white rounded-full text-sm font-medium transition-colors"
        @click="goToBooking">
        Buy a new card
      </button>
    </div>
<GiftCardSkeleton v-if="isLoading" />
    <!-- Main Grid -->
    <div v-else  class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Gift Cards List -->
      <!-- <div>
        <div v-for="(group, index) in giftCards" :key="group.id"
          class="gift-card p-[20px] border rounded-[12px] text-[13px] font-[350] mb-[20px] last:mb-0 cursor-pointer"
          :class="{ active: activeCardIndex === index }" @click="activeCardIndex = index">
          <p class="text-[17px] font-medium mb-[20px]">Gift Card: {{ group.total }} {{ group.currency }}</p>
          <div class="flex justify-between mb-[11px] pb-[11px] border-b">
            <span>Number of cards:</span>
            <span>{{ group.items?.length ?? 1 }}</span>
          </div>
          <div class="flex justify-between mb-[11px] pb-[11px] border-b">
            <span>Purchase No:</span>
            <span>{{ group.order_number }}</span>
          </div>
          <div class="flex justify-between">
            <span>Expiry Date</span>
            <span>{{ group.expiry_date || '—' }}</span>
          </div>
        </div>
      </div> -->



<!-- Gift Cards List -->
<div class="h-[210px] md:h-[770px]">
  <Swiper
    :modules="[Mousewheel]"
    direction="vertical"
    :mousewheel="{ forceToAxis: true, releaseOnEdges: true }"
     :breakpoints="{
    0: { slidesPerView: 1 },      // mobile
    768: { slidesPerView: 4 }     // tablets and up
  }"
    :spaceBetween="20"
    class="h-full"
    @activeIndexChange="onActiveCardChange"

  >
    <SwiperSlide v-for="(group, index) in giftCards" :key="group.id">
      <div
        class="gift-card p-[20px] border rounded-[12px] text-[13px] font-[350] cursor-pointer"
        :class="{ active: activeCardIndex === index }"
        @click="activeCardIndex = index"
      >
        <p class="text-[17px] font-medium mb-[20px]">Gift Card: {{ group.total }} {{ group.currency }}</p>
        <div class="flex justify-between mb-[11px] pb-[11px] border-b">
          <span>Number of cards:</span>
          <span>{{ group.items?.length ?? 1 }}</span>
        </div>
        <div class="flex justify-between mb-[11px] pb-[11px] border-b">
          <span>Purchase No:</span>
          <span>{{ group.order_number }}</span>
        </div>
        <div class="flex justify-between">
          <span>Expiry Date</span>
          <span>{{ group.expiry_date || '—' }}</span>
        </div>
      </div>
    </SwiperSlide>
  </Swiper>
</div>

      <!-- Swiper + Payment Details -->
      <div>
        <GiftCardSwiper class="mb-[30px]" :active-index="activeCardIndex" :card="giftCards[activeCardIndex]"
          :count="giftCards[activeCardIndex]?.items?.length ?? 1" @card-click="openCardModal" />

        <div class="px-[25px] py-[35px] rounded-[12px] text-[15px] font-[400] border border-[#AD7084] text-[#C6C6C7]">
          <h3 class="text-[18px] font-medium mb-[17px] text-[#EBE4DF] text-center">Payment Details</h3>
          <div class="custom-border mb-[18px] relative">
            <div class="flex justify-between mb-[9px]">
              <span>Subtotal</span>
              <span>{{ giftCards[activeCardIndex]?.sub_total }} {{ giftCards[activeCardIndex]?.currency }}</span>
            </div>
            <div class="flex justify-between mb-[9px]">
              <span>VAT ({{ giftCards[activeCardIndex]?.tax_rate }}%)</span>
              <span>{{ giftCards[activeCardIndex]?.tax }} {{ giftCards[activeCardIndex]?.currency }}</span>
            </div>
            <div class="flex justify-between pb-[18px]">
              <span>Discount</span>
              <span>{{ giftCards[activeCardIndex]?.discounts || 0 }} {{ giftCards[activeCardIndex]?.currency }}</span>
            </div>
          </div>
          <div class="flex justify-between text-[17px] font-[500]">
            <span>Grand total</span>
            <span>{{ giftCards[activeCardIndex]?.total }} {{ giftCards[activeCardIndex]?.currency }}</span>
          </div>
        </div>

        <BaseButton @click="viewInvoice"
          class="bg-[#6B8B9B] hover:bg-[#6B8B9B]/70 mt-[27px] text-[#EBE4DF] text-[15px] font-[400] rounded-full w-full py-[12px]">
          View Invoice
        </BaseButton>
      </div>
    </div>
  </div>


  <Dialog v-model:show="modalOpen" :modalMaxWidth="'max-w-[467px]'">
    <template #body>
      <div class="bg-decore-modal mx-auto rounded-[30px] overflow-hidden shadow-lg bg-[#EBE4DF] text-[#5F2C3E]"
        v-if="selectedCard">
        <div class="px-[20px] md:px-[53px] py-[34px] relative">
          <h2 class="text-center mb-[43px] text-[#A0576F] text-[18.29px] font-bold leading-normal">Gift Card: {{
            selectedCard.total }} {{ selectedCard.currency }}</h2>
          <div class="relative rounded-[14px] overflow-hidden bg-[#e9c9ad] h-[127px]">
            <img class="w-full h-full object-cover"
              :src="selectedCard.card_image || '/assets/img/my-gift-card.svg'" alt="Gift Card Image" />
            <div class="absolute inset-0 px-[15px] py-[15px] flex flex-col justify-between">
              <!-- Header: لوجو + الحالة -->
              <div class="flex justify-between">
                <div class="max-w-[70px]">
                  <img class="w-full" src="/assets/img/card-laz.svg" alt="Logo" />
                </div>
                <div class="h-[23px] px-[20px] flex items-center justify-center rounded-[100px] text-[13px]"
                  :class="getStatusClass(selectedCard.status)">
                  <span>{{ selectedCard.status || 'Active' }}</span>
                </div>
              </div>

              <!-- Footer: رقم البطاقة + التاريخ + المبلغ -->
              <div>
                <!-- <div class="flex flex-col items-end pe-[20px]">
                  <p class="text-white text-[21.94px] font-normal tracking-[0.52em] text-end">
                    {{ selectedCard.serial_number || 'N/A' }}
                  </p>
                  <p class="text-white text-[13.96px] font-bold opacity-70 text-end">
                    {{ selectedCard.expiry_date || 'N/A' }}
                  </p>
                </div> -->
                <div>
                  <p class="text-white text-[12.97px] font-medium">GIFT CARD</p>
                  <p class="text-white text-[18.53px] font-bold">{{ selectedCard.remaining_amount ||
                    selectedCard.total }} {{ selectedCard.currency }}</p>
                </div>
              </div>
            </div>
          </div>


          <div class="px-[18px] py-[20px] rounded-[16px] bg-[#A0576F] mt-[10px]">
            <p class="text-[#EBE4DF] font-medium text-[16px] leading-normal">
              Gift Card Description
            </p>
            <p class="text-[#C6C6C7] font-normal text-[14px]" v-html="selectedCard.description || selectedCard.description || 'No description available for this gift card.' ">
            </p>
          </div>

          <div class="px-[18px] py-[20px] rounded-[16px] bg-[#A0576F] mt-[10px]">
            <p class="text-[#EBE4DF] font-medium text-[17px] leading-normal mb-[20px]">
              Gift Card Details
            </p>
            <div>
              <div
                class="flex justify-between pb-[11px] mb-[11px] border-b border-b-[#AD7084] last:border-b-0 last:mb-0 last:pb-0">
                <p class="text-[#C6C6C7] font-[350] text-[13px] leading-normal">Serial Number</p>
                <p class="text-[#C6C6C7] font-[350] text-[13px] leading-normal">{{ selectedCard.serial_number || 'N/A' }}</p>
              </div>

              <div
                class="flex justify-between pb-[11px] mb-[11px] border-b border-b-[#AD7084] last:border-b-0 last:mb-0 last:pb-0">
                <p class="text-[#C6C6C7] font-[350] text-[13px] leading-normal">Expiry Date</p>
                <p class="text-[#C6C6C7] font-[350] text-[13px] leading-normal">{{ selectedCard.expiry_date || 'N/A' }}</p>
              </div>

              <div
                class="flex justify-between pb-[11px] mb-[11px] border-b border-b-[#AD7084] last:border-b-0 last:mb-0 last:pb-0">
                <p class="text-[#C6C6C7] font-[350] text-[13px] leading-normal">Purchase No</p>
                <p class="text-[#C6C6C7] font-[350] text-[13px] leading-normal">{{ selectedCard.voucher_order_number || 'N/A' }}</p>
              </div>

              <div
                class="flex justify-between pb-[11px] mb-[11px] border-b border-b-[#AD7084] last:border-b-0 last:mb-0 last:pb-0">
                <p class="text-[#C6C6C7] font-[350] text-[13px] leading-normal">Redeemed Amount</p>
                <p class="text-[#C6C6C7] font-[350] text-[13px] leading-normal">{{ getRedeemedAmount() }} {{ selectedCard.currency }}</p>
              </div>

              <div v-if="selectedCard.remaining_amount"
                class="flex justify-between pb-[11px] mb-[11px] border-b border-b-[#AD7084] last:border-b-0 last:mb-0 last:pb-0">
                <p class="text-[#C6C6C7] font-[350] text-[13px] leading-normal">Remaining Amount</p>
                <p class="text-[#C6C6C7] font-[350] text-[13px] leading-normal">{{ selectedCard.remaining_amount }} {{ selectedCard.currency }}</p>
              </div>

            </div>
          </div>

          <div class="text-center">
            <div class="qr mx-auto w-[160px] h-[165px] my-[22px]">
              <img class="w-full" :src="selectedCard.qr_code || '/assets/img/qr.png'" alt="Gift Card QR Code">
            </div>

            <!-- <button
              class="px-6 py-1.5 bg-[#6B8B9B] text-white rounded-full text-sm font-medium transition-colors cursor-pointer">
              Redeem History
            </button> -->

            <BaseButton @click="handleRedeemHistoryOpen"
              class="bg-[#6B8B9B] hover:bg-[#6B8B9B]/70 mt-[27px] text-[#EBE4DF] text-[15px] font-[400] rounded-full w-full py-[12px]">
              Redeem History
            </BaseButton>



          </div>

          <div class="mt-[34px]">
            <h3 class="text-[#A0576F] text-[18px] font-medium leading-normal mb-[23px]">Payment Summary</h3>
            <div class="space-y-[12px]">
              <div class="flex justify-between pb-[12px] border-b border-b-[#B2B0B0]">
                <p class="text-[#5B605C] text-[14px] font-[350] leading-normal">Subtotal</p>
                <p class="text-[#5B605C] text-[14px] font-[350] leading-normal">{{ selectedCard.sub_total || '0.00' }} {{ selectedCard.currency }}</p>
              </div>

              <div class="flex justify-between pb-[12px] border-b border-b-[#B2B0B0]">
                <p class="text-[#5B605C] text-[14px] font-[350] leading-normal">VAT amount {{ selectedCard.tax_rate || '15' }}%*</p>
                <p class="text-[#5B605C] text-[14px] font-[350] leading-normal">{{ selectedCard.tax || '0.00' }} {{ selectedCard.currency }}</p>
              </div>

              <div class="flex justify-between pb-[12px] border-b border-b-[#B2B0B0]">
                <p class="text-[#5B605C] text-[14px] font-[350] leading-normal">Discount</p>
                <p class="text-[#5B605C] text-[14px] font-[350] leading-normal">{{ selectedCard.discounts || '0.00' }} {{ selectedCard.currency }}</p>
              </div>

              <div class="flex justify-between pb-[12px] border-b border-b-[#B2B0B0]">
                <p class="text-[#5B605C] text-[14px] font-[500] leading-normal">Total</p>
                <p class="text-[#5B605C] text-[14px] font-[500] leading-normal">{{ selectedCard.total || '0.00' }} {{ selectedCard.currency }}</p>
              </div>

            </div>

          </div>

          <div class="mt-[63px] flex justify-between gap-[9px]">
            <BaseButton
              class="bg-[#A0576F] border-0 flex align-center gap-[10px] w-full text-white h-[50px] rounded-full font-[400] text-[16px] justify-center mt-[35px] disabled:bg-[#A0576F] hover:bg-[#913E5D]">
              <QrIcon />
              <span>Download QR</span>
            </BaseButton>


            <BaseButton
              class="bg-[#A8904A] border-0 flex align-center text-start gap-[10px] w-full text-white h-[50px] rounded-full font-[400] text-[16px] justify-center mt-[35px] disabled:bg-[#a8904ad6] hover:bg-[#a8904ad6]">
              <AppleWalletIcon />
              <span>Add to<br>Apple Wallet</span>
            </BaseButton>

          </div>

        </div>

      </div>
    </template>
  </Dialog>
  <Dialog v-model:show="showRedeemModal" :modalMaxWidth="'max-w-[356px]'">
    <template #body>
      <div class="bg-decore-modal">
        <div class="relative px-[18px] py-[30px]">
          <h2 class="mb-[30px] text-[#A0576F] text-center font-medium text-[21px] not-italic leading-normal">Redeem
            History</h2>

          <!-- Dynamic Redeem History -->
          <div v-if="getRedeemHistory().length > 0">
            <div v-for="(history, index) in getRedeemHistory()" :key="index"
                 class="flex border-b border-b-[#0014471A] pb-[10px] gap-[10px] mb-[35px]">
              <div class="">
                <img src="/assets/img/earned.svg" alt="">
              </div>
              <div class="">
                <p class="text-[#5B605C] font-[350] text-[14px] mb-[2px]">{{ history.date || 'N/A' }}</p>
                <p class="text-[#5B605C] font-[350] text-[14px] mb-[2px]">Order No.: {{ history.order_number || 'N/A' }}</p>
                <p class="text-[#6B8B9B] font-medium text-[15px]">Redeemed Amount: {{ history.amount || '0' }} {{ selectedCard?.currency || '<span class="sar-icon">&#xe900;</span>' }}</p>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-8">
            <p class="text-[#5B605C] font-[350] text-[14px]">No redeem history available</p>
          </div>
          
        </div>
      </div>
    </template>
  </Dialog>



</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import GiftCardSwiper from '~/components/giftcards/GiftCardSwiper.vue'
import Dialog from '~/components/base/Dialog.vue'
import QrIcon from '@/components/icons/QrIcon.vue'
import AppleWalletIcon from '@/components/icons/AppleWalletIcon.vue'

import GiftCardSkeleton from '~/components/skeletons/MyGiftCardSkeleton.vue'
const isLoading = ref(true)

onMounted(async () => {
  await fetchGiftCards()
  isLoading.value = false
})


import { Swiper, SwiperSlide } from 'swiper/vue'
import { Mousewheel } from 'swiper/modules'
import 'swiper/css'

// Dialog States
const showRedeemModal = ref(false)
const modalOpen = ref(false)
const selectedCard = ref(null)

// Router
const router = useRouter()

// Gift Card Data
const giftCards = ref([])
const activeCardIndex = ref(0)

// Navigate to buy gift card
const goToBooking = () => {
  router.push('/gift-cards')
}

// Open Redeem History Dialog
const handleRedeemHistoryOpen = () => {
  modalOpen.value = false
  showRedeemModal.value = true
}

// Handle View Invoice
const viewInvoice = () => {
  const card = selectedCard.value
  if (card?.invoice_link) {
    window.open(card.invoice_link, '_blank')
  }
}

// Handle Select (from click or swiper)
const selectCard = (index) => {
  activeCardIndex.value = index
  selectedCard.value = giftCards.value[index] || null
}

// Update active card on swiper scroll
const onActiveCardChange = (swiper) => {
  selectCard(swiper.activeIndex)
}

// Open Modal with selected card
const openCardModal = (card) => {
  selectedCard.value = card
    console.log('🔍 selectedCard.value', selectedCard.value)

  modalOpen.value = true
}

// Card Status Badge
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

// Calculate redeemed amount
const getRedeemedAmount = () => {
  if (!selectedCard.value) return '0.00'

  const total = parseFloat(selectedCard.value.total || 0)
  const remaining = parseFloat(selectedCard.value.remaining_amount || 0)
  const redeemed = total - remaining

  return redeemed > 0 ? redeemed.toFixed(2) : '0.00'
}

// Get redeem history for selected card
const getRedeemHistory = () => {
  if (!selectedCard.value) return []

  // Check if the card has redeem history data
  return selectedCard.value.redeem_history ||
         selectedCard.value.redeem_history ||
         []
}

// Load Gift Cards
const fetchGiftCards = async () => {
  try {
    const { data: response, error } = await useApi('vouchers/list_orders', {
      method: 'GET'
    })

    if (!error.value && response.value?.status) {
      giftCards.value = response.value.data?.voucher_groups || []

      // Select first card as default
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

onMounted(fetchGiftCards)
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
