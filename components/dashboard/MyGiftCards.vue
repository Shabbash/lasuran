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

    <!-- Main Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Gift Cards List -->
      <div>
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
            <span>{{ group.items?.[0]?.expiry_date || '—' }}</span>
          </div>
        </div>
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

        <BaseButton
          class="bg-[#6B8B9B] hover:bg-[#6B8B9B]/70 mt-[27px] text-[#EBE4DF] text-[15px] font-[400] rounded-full w-full py-[12px]">
          View Invoice
        </BaseButton>
      </div>
    </div>
  </div>


  <Dialog v-model:show="modalOpen" :modalMaxWidth="'max-w-[539px]'">
    <template #body>
      <div class="bg-decore-modal mx-auto rounded-[30px] overflow-hidden shadow-lg bg-[#EBE4DF] text-[#5F2C3E]">
        <div class="p-[34px]">
          <h2>Gift Card: 500 SAR</h2>
          <div class="relative rounded-[14px] overflow-hidden bg-[#e9c9ad]">
            <img class="w-full" src="/assets/img/my-gift-card.svg" alt="Gift Card Image" />
            <div class="absolute inset-0 px-[15px] py-[15px] flex flex-col justify-between">
              <!-- Header: لوجو + الحالة -->
              <div class="flex justify-between">
                <div class="max-w-[70px]">
                  <img class="w-full" src="/assets/img/card-laz.svg" alt="Logo" />
                </div>
                <div
                  class="h-[23px] px-[20px] bg-[#CDEAB7] flex items-center justify-center rounded-[100px] text-[#57A06A] text-[13px]">
                  <span>Active</span>
                </div>
              </div>

              <!-- Footer: رقم البطاقة + التاريخ + المبلغ -->
              <div>
                <div class="flex flex-col items-end pe-[20px]">
                  <p class="text-white text-[21.94px] font-normal tracking-[0.52em] text-end">
                    GC-123456
                  </p>
                  <p class="text-white text-[13.96px] font-bold opacity-70 text-end">
                    2025-12-31
                  </p>
                </div>
                <div>
                  <p class="text-white text-[12.97px] font-medium">GIFT CARD</p>
                  <p class="text-white text-[18.53px] font-bold">200.00 SAR</p>
                </div>
              </div>
            </div>
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
const modalOpen = ref(true)
const selectedCard = ref(null)

const openCardModal = (card) => {
  selectedCard.value = card
  modalOpen.value = true
}

const router = useRouter()
const giftCards = ref([])
const activeCardIndex = ref(0)

const goToBooking = () => {
  router.push('/gift-cards')
}

const fetchGiftCards = async () => {
  await useApi('v1/vouchers/list_orders', { method: 'GET' }, {
    onSuccess(data) {
      giftCards.value = data.data?.voucher_groups || []
    },
    onError(err) {
      console.error('Error fetching gift cards', err)
    }
  })
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
