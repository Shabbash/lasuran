<template>
  <div class="p-[24px] pb-[40px] max-h-[80vh] overflow-y-auto">
    <h2 class="text-center text-[18px] font-medium text-[#A0576F] mb-[30px]">{{ t('gift_cards_title') }}</h2>

    <div v-if="!loading && giftCards?.length == 0" class="text-center text-[#A0576F]">
      {{ t('gift_cards_empty') }}
    </div>

    <div v-if="!loading">
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
                {{ card.voucher_group_name || t('gift_card_default_name') }}
              </h2>
              <h3 class="text-white text-[40px] font-bold leading-normal">
                <span class="sar-icon">&#xe900;</span> {{ card.value }}
                <!-- <span class="text-[20px]">{{ card.currency || '' }}</span> -->
              </h3>
            </div>
            <p class="text-white text-[11px] font-bold leading-normal">
              {{ card.serial_number }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center text-[#A0576F]">
      {{ t('loading') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useApp } from '~/stores/app'
import { useCart } from '~/stores/cart'
import { useI18n } from 'vue-i18n'
import { useApi } from '~/composables/useApi'

// ✅ i18n instance
const { t } = useI18n()

// ✅ Define emits
const emit = defineEmits(['select'])

// ✅ Stores
const app = useApp()
const cartModule = useCart()

// ✅ API call to load available gift cards
const { data: giftCards, pending: loading } = useApi(
  'vouchers/list_available_vouchers',
  {
    method: 'GET',
    params: { page: 1, per_page: 30 },
    key: 'list_available_vouchers',
    transform: ({ data }) => data?.vouchers ?? []
  }
)

// ✅ Handle gift card selection
const selectCard = (card: any) => {
  emit('select', card.serial_number)
  cartModule.params.gift_card = card.serial_number
  cartModule.isGiftCardApplyLoading = true

  cartModule.fetchCart(cartModule.params, {
    disableLoading: true
  }).then(() => {
    cartModule.isGiftCardApplyLoading = false
  })

  app.setDialogShow(false)
}
</script>
