<template>
  <div class="mb-[18px] relative min-h-[47px]">
    <!-- 🎁 Gift Toggle -->
    <div
      class="flex items-center justify-between bg-[#EBE4DF] rounded-full px-[25px] py-0 h-[47px] absolute start-0 end-0">
      <div class="flex items-center gap-[10px]">
        <GiftIcon />
        <span class="text-[#A0576F] text-[15px] font-[400]">
          {{ t('give_as_gift_label') }}
        </span>
      </div>
      <USwitch v-model="isGifted" :ui="{
        base: 'data-[state=unchecked]:bg-[#BFBFBF] data-[state=checked]:bg-[#D99EB2] h-[22px]',
        thumb: 'bg-[#90928F] data-[state=checked]:bg-[#A0576F]'
      }" />
    </div>

    <!-- 🎁 Gifted Info Summary -->
    <div v-if="giftedOrderData"
      class="bg-[#EBE4DFE5] mx-[5px] px-[26px] pb-[17px] pt-[62px] rounded-[16px] flex items-center justify-between">
      <div class="text-[#A0576F] text-[15px] font-medium">
        {{ t('gift_to_label') }}: {{ giftedOrderData.first_name }} {{ giftedOrderData.last_name }}
      </div>
      <div class="flex items-center gap-[7px] justify-end">
        <button class="cursor-pointer" @click="openGiftDialog">
          <EditIcon />
        </button>
        <button class="cursor-pointer" @click="clearGiftData">
          <DeleteIcon />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useApp } from '~/stores/app'
import { useCart } from '~/stores/cart'
import { COMPONENTS } from '~/data/constants'
import { useI18n } from 'vue-i18n'

import EditIcon from '@/components/icons/EditIcon.vue'
import DeleteIcon from '@/components/icons/DeleteIcon.vue'
import GiftIcon from '@/components/icons/GiftIcon.vue'

const { t } = useI18n()
const appStore = useApp()
const cartStore = useCart()

const isGifted = ref(cartStore.params?.is_gifted_order === 1)
const confirmed = ref(false)

const giftedOrderData = computed(() => cartStore.params?.gifted_order_data ?? null)

const openGiftDialog = () => {
  appStore.setDialogComponent(COMPONENTS.GIFTED_ORDER_DIALOG, {
    modalMaxWidth: 'max-w-[430px]'
  })
  appStore.setDialogShow(true)
}


const clearGiftData = () => {
  isGifted.value = false
}

// ✅ Watch switch toggle
watch(isGifted, (val) => {
  if (val && !cartStore.params?.gifted_order_data) {
    confirmed.value = false
    openGiftDialog()
  }

  if (!val) {
    cartStore.params.is_gifted_order = 0
    cartStore.params.gifted_order_data = null
    cartStore.params.gift_message = null
  }
})

// ✅ Sync isGifted when cart store changes
watch(() => cartStore.params?.is_gifted_order, (val) => {
  isGifted.value = val === 1
})

// ✅ Listen for gift confirm/cancel events
if (process.client) {
  window.addEventListener('giftConfirmed', () => {
    confirmed.value = true
  })

  window.addEventListener('giftNotConfirmed', () => {
    if (!confirmed.value) {
      isGifted.value = false
    }
  })
}
</script>
