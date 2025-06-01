<template>
  <Container>
    <Banner :opacity="false" :bannerContent="bannerContent" />

    <div>
      <h2 class="text-white mb-[16px] text-[19px] font-normal">Gifts Cards</h2>
      <p class="hint text-[#C6C6C7] text-[13px] font-[350] flex items-center gap-[10px] mb-[15px]">The gift card is
        valid for one
        time use only.</p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="(card, index) in cardContent" :key="index" class="relative">
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
              <img src="public/assets/img/laz-2.svg" alt="logo" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Container>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import Container from '@/components/base/Container.vue'
import Banner from '@/components/base/Banner.vue'
import BaseCard from '@/components/base/Card.vue'
import Dialog from '@/components/base/Dialog.vue'
const bannerContent = {
  image: "/assets/img/gift-cards.svg",
  subtitle: "Give the Gift of Lasuran",
  title: "Gift Cards"
}

const cardContent = [
  {
    "price": "500",
    "logo": "assets/img/laz-1.svg",
    "expiry_date": "01/07/22",
    "title": "Gift Card",
    "card_image": "assets/img/13.svg"
  },
  {
    "price": "1000",
        "logo": "assets/img/laz-2.svg",

    "expiry_date": "01/07/22",
    "title": "Gift Card",
    "card_image": "assets/img/11.svg"
  },
  {
    "price": "1500",
        "logo": "assets/img/laz-2.svg",

    "expiry_date": "01/07/22",
    "title": "Gift Card",
    "card_image": "assets/img/12.svg"
  },
  {
    "price": "1000",
        "logo": "assets/img/laz-2.svg",

    "expiry_date": "01/07/22",
    "title": "Gift Card",
    "card_image": "assets/img/11.svg"
  },
  {
    "price": "1500",
        "logo": "assets/img/laz-2.svg",

    "expiry_date": "01/07/22",
    "title": "Gift Card",
    "card_image": "assets/img/12.svg"
  },
  {
    "price": "500",
        "logo": "assets/img/laz-1.svg",

    "expiry_date": "01/07/22",
    "title": "Gift Card",
    "card_image": "assets/img/13.svg"
  }
]


</script>

<style>
.hint::before {
  content: url(/assets/img/info-icon.svg);
}
</style>
