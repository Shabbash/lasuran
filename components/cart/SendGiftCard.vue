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
/* =========================
 * Gift switch logic (strict order):
 * 1) When turned ON: set is_gifted_order = 1 → refresh cart → then open the dialog.
 * 2) When turned OFF: reset gifted params → refresh cart (no dialog).
 * 3) Dialog emits:
 *    - 'giftConfirmed'  → ensure confirmed, optionally refresh cart again.
 *    - 'giftNotConfirmed' → if not confirmed, revert the switch.
 * All comments in English as requested.
 * ========================= */

import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useApp } from '~/stores/app'
import { useCart } from '~/stores/cart'
import { COMPONENTS } from '~/data/constants'

import EditIcon from '@/components/icons/EditIcon.vue'
import DeleteIcon from '@/components/icons/DeleteIcon.vue'
import GiftIcon from '@/components/icons/GiftIcon.vue'

const { t } = useI18n()
const appStore = useApp()
const cartStore = useCart()

// Local UI state
const isGifted = ref(cartStore.params?.is_gifted_order === 1)
const confirmed = ref(false)

// Derived data from cart store
const giftedOrderData = computed(() => cartStore.params?.gifted_order_data ?? null)

/** Open the Gift dialog */
function openGiftDialog() {
  appStore.setDialogComponent(COMPONENTS.GIFTED_ORDER_DIALOG, {
    modalMaxWidth: 'max-w-[430px]'
  })
  appStore.setDialogShow(true)
}

/** Quiet cart refresh (no spinner) while preserving query params */
function fetchCartQuiet(): Promise<any> {
  return cartStore.fetchCart(
    {
      promo_code: cartStore.params?.promo_code ?? null,
      gift_card: cartStore.params?.gift_card ?? null
    } as any,
    { disableLoading: true }
  )
}

/** Clear all gifted fields and sync with store */
function clearGiftParams() {
  cartStore.params.is_gifted_order = 0
  cartStore.params.gifted_order_data = null as any
  cartStore.params.gift_message = null as any
}

/** Toggle watcher — enforce “refresh cart first, then dialog” when ON */
watch(isGifted, async (val) => {
  if (val) {
    // 1) Mark as gifted in store first
    cartStore.params.is_gifted_order = 1

    // 2) Refresh cart before opening dialog (ensures summary reflects gift state)
    await fetchCartQuiet()

    // 3) Open dialog AFTER cart refresh (no popup/dialog before this)
    confirmed.value = false
    openGiftDialog()
  } else {
    // Turned OFF → reset gifted params and refresh immediately
    clearGiftParams()
    fetchCartQuiet()
  }
})

/** Keep local switch in sync if store changes elsewhere */
watch(
  () => cartStore.params?.is_gifted_order,
  (val) => {
    isGifted.value = val === 1
  }
)

/** Global events from the dialog */
function onGiftConfirmed() {
  // Dialog has validated and set gifted_order_data inside the store
  confirmed.value = true
  // Optional: refresh cart again in case totals/messages depend on recipient fields
  fetchCartQuiet()
}

function onGiftNotConfirmed() {
  // If user closed/canceled without confirming, revert the switch
  if (!confirmed.value) {
    isGifted.value = false // Will trigger watcher to clear & refresh
  }
}

onMounted(() => {
  if (process.client) {
    window.addEventListener('giftConfirmed', onGiftConfirmed)
    window.addEventListener('giftNotConfirmed', onGiftNotConfirmed)
  }
})

onBeforeUnmount(() => {
  if (process.client) {
    window.removeEventListener('giftConfirmed', onGiftConfirmed)
    window.removeEventListener('giftNotConfirmed', onGiftNotConfirmed)
  }
})

/** Expose to template (icons are imported above and used in template) */
</script>
