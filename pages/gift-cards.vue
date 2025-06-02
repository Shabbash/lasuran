<template>
  <Container>
    <Banner :opacity="false" :bannerContent="bannerContent" />

    <div>
      <h2 class="text-white mb-[16px] text-[19px] font-normal">Gifts Cards</h2>
      <p class="hint text-[#C6C6C7] text-[13px] font-[350] flex items-center gap-[10px] mb-[15px]">The gift card is
        valid for one
        time use only.</p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="(card, index) in cardContent" :key="index" class="relative cursor-pointer"
          @click="openCardModal(card)">
          <div class="w-full h-full">
            <img class="w-full h-full cover" :src="card.card_image" alt="gift card image" />
          </div>
          <div class="flex items-center justify-between absolute inset-0 px-[17px] py-[15px]">
            <div class="flex flex-col justify-between h-full">
              <div>
                <h2 class="text-white text-[15px] font-bold leading-normal">{{ card.title }}</h2>
                <h3 class="text-white text-[40px] font-bold leading-normal">
                  {{ card.price }} <span class="text-[20px]">SAR</span>
                </h3>
              </div>
              <p class="text-white text-[11px] font-bold leading-normal">
                expires: {{ card.expiry_date }}
              </p>
            </div>
            <div>
              <img :src="card.logo" alt="logo" />
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- Gift Card Modal -->
    <Dialog v-model:open="modalOpen" :modalMaxWidth="'max-w-[539px]'">
      <template #body>
        <div class="bg-decore-modal mx-auto rounded-[30px] overflow-hidden shadow-lg bg-[#EBE4DF] text-[#5F2C3E]">
          <div class="relative px-[28px] mt-[28px] mb-[40px]">
            <h2 class="text-center text-[23px] font-bold text-[#A0576F] mb-[40px]">Lasuran Gift Card</h2>

            <div v-if="selectedCard" class="relative">
              <div class="w-full h-full">
                <img class="w-full h-full cover" :src="selectedCard.card_image" alt="gift card image" />
              </div>
              <div class="flex items-center justify-between absolute inset-0 px-[17px] py-[15px]">
                <div class="flex flex-col justify-between h-full">
                  <div>
                    <h2 class="text-white text-[15px] font-bold leading-normal">{{ selectedCard.title }}</h2>
                    <h3 class="text-white text-[40px] font-bold leading-normal">
                      {{ selectedCard.price }} <span class="text-[20px]">SAR</span>
                    </h3>
                  </div>
                  <p class="text-white text-[11px] font-bold leading-normal">
                    expires: {{ selectedCard.expiry_date }}
                  </p>
                </div>
                <div>
                  <img :src="selectedCard.logo" alt="logo" />
                </div>
              </div>
            </div>

            <div class="flex justify-between items-center mt-[40px] mb-[15px]">
              <h2 class="text-[30px] font-bold text-[#A0576F] leading-normal">{{ selectedCard.title }}</h2>
              <p class="text-[19px] font-bold text-[#A0576F] leading-normal">{{ selectedCard.price }}</p>
            </div>

            <p class="text-[#5B605C] mb-[16px] text-[14px] font-[350] leading-[23.128px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad ate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>

            <div class="flex justify-between items-center gap-[25px] mt-[55px]">

              <BaseCounter v-model="quantity" />
              <BaseButton @click="addToCart" :loading="cartModule.isAddLoading.value" :disabled="!selectedCard"
                class="cart-btn flex align-center gap-[10px] w-full text-white rounded-full font-[400] text-[16px] justify-center disabled:bg-[#A0576F] hover:bg-[#913E5D]"
                :class="selectedCard ? 'bg-[#A0576F]' : 'bg-[#a0576f69]'">

                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                  <path
                    d="M10 9.875C10.1658 9.875 10.3247 9.94085 10.4419 10.0581C10.5592 10.1753 10.625 10.3342 10.625 10.5V12.375H12.5C12.6658 12.375 12.8247 12.4408 12.9419 12.5581C13.0592 12.6753 13.125 12.8342 13.125 13C13.125 13.1658 13.0592 13.3247 12.9419 13.4419C12.8247 13.5592 12.6658 13.625 12.5 13.625H10.625V15.5C10.625 15.6658 10.5592 15.8247 10.4419 15.9419C10.3247 16.0592 10.1658 16.125 10 16.125C9.83424 16.125 9.67527 16.0592 9.55806 15.9419C9.44085 15.8247 9.375 15.6658 9.375 15.5V13.625H7.5C7.33424 13.625 7.17527 13.5592 7.05806 13.4419C6.94085 13.3247 6.875 13.1658 6.875 13C6.875 12.8342 6.94085 12.6753 7.05806 12.5581C7.17527 12.4408 7.33424 12.375 7.5 12.375H9.375V10.5C9.375 10.3342 9.44085 10.1753 9.55806 10.0581C9.67527 9.94085 9.83424 9.875 10 9.875Z"
                    fill="#EBE4DF" />
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M6.25 5.5V4.875C6.25 2.80406 7.92906 1.125 10 1.125C12.0709 1.125 13.75 2.80406 13.75 4.875V5.5H14.2966C15.5391 5.5 16.59 6.41656 16.765 7.64688L18.0994 17.0219C18.3137 18.525 17.1509 19.875 15.6312 19.875H4.36875C2.84906 19.875 1.68625 18.525 1.90031 17.0219L3.235 7.64688C3.41 6.41656 4.46093 5.5 5.70375 5.5H6.25ZM7.5 8C7.5 8.16576 7.43415 8.32473 7.31694 8.44194C7.19973 8.55915 7.04076 8.625 6.875 8.625C6.70924 8.625 6.55026 8.55915 6.43305 8.44194C6.31584 8.32473 6.25 8.16576 6.25 8V6.75H5.70343C5.40347 6.75064 5.1138 6.8595 4.88767 7.05659C4.66153 7.25367 4.51411 7.52575 4.4725 7.82281L3.13812 17.1978C3.03 17.9534 3.61406 18.625 4.36875 18.625H15.6312C16.3856 18.625 16.9697 17.9534 16.8622 17.1978L15.5275 7.82281C15.4859 7.52569 15.3384 7.25358 15.1122 7.05648C14.886 6.85939 14.5963 6.75056 14.2962 6.75H13.75V8C13.75 8.16576 13.6841 8.32473 13.5669 8.44194C13.4497 8.55915 13.2908 8.625 13.125 8.625C12.9592 8.625 12.8003 8.55915 12.6831 8.44194C12.5658 8.32473 12.5 8.16576 12.5 8V6.75H7.5V8ZM12.5 5.5V4.875C12.5 4.21196 12.2366 3.57607 11.7678 3.10723C11.2989 2.63839 10.663 2.375 10 2.375C9.33696 2.375 8.70107 2.63839 8.23223 3.10723C7.76339 3.57607 7.5 4.21196 7.5 4.875V5.5H12.5Z"
                    fill="#EBE4DF" />
                </svg>
                <span>Total: {{ totalPrice }} SAR</span>


              </BaseButton>

            </div>

          </div>
        </div>


      </template>
    </Dialog>


  </Container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Container from '@/components/base/Container.vue'
import Banner from '@/components/base/Banner.vue'
import Dialog from '@/components/base/Dialog.vue'
import BaseCounter from '@/components/base/Counter.vue'
import BaseButton from '@/components/base/Button.vue'

// State
const modalOpen = ref(false)
const selectedCard = ref<any>(null)
const quantity = ref(1)

// Dummy cart module (replace with actual store)
const cartModule = {
  isAddLoading: ref(false)
}

// Open modal
function openCardModal(card: any) {
  selectedCard.value = card
  quantity.value = 1
  modalOpen.value = true
}

// Total Price
const totalPrice = computed(() => {
  return selectedCard.value ? quantity.value * Number(selectedCard.value.price) : 0
})

// Fake Add to Cart
function addToCart() {
  cartModule.isAddLoading.value = true
  setTimeout(() => {
    cartModule.isAddLoading.value = false
    modalOpen.value = false
    alert(`Added ${quantity.value} gift card(s) to cart`)
  }, 1000)
}

// Banner Content
const bannerContent = {
  image: "/assets/img/gift-cards.svg",
  subtitle: "Give the Gift of Lasuran",
  title: "Gift Cards"
}

// Cards Data
const cardContent = [
  { price: "500", logo: "assets/img/laz-1.svg", expiry_date: "01/07/22", title: "Gift Card", card_image: "assets/img/13.svg" },
  { price: "1000", logo: "assets/img/laz-2.svg", expiry_date: "01/07/22", title: "Gift Card", card_image: "assets/img/11.svg" },
  { price: "1500", logo: "assets/img/laz-2.svg", expiry_date: "01/07/22", title: "Gift Card", card_image: "assets/img/12.svg" },
  { price: "1000", logo: "assets/img/laz-2.svg", expiry_date: "01/07/22", title: "Gift Card", card_image: "assets/img/11.svg" },
  { price: "1500", logo: "assets/img/laz-2.svg", expiry_date: "01/07/22", title: "Gift Card", card_image: "assets/img/12.svg" },
  { price: "500", logo: "assets/img/laz-1.svg", expiry_date: "01/07/22", title: "Gift Card", card_image: "assets/img/13.svg" }
]


</script>

<style>
.hint::before {
  content: url(/assets/img/info-icon.svg);
}
</style>
