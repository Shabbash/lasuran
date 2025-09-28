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
    <!-- <div v-if="giftedOrderData" -->

    <div v-if="isGifted || hasGiftData"
      class="bg-[#EBE4DFE5] mx-[5px] px-[26px] pb-[17px] pt-[62px] rounded-[16px] flex items-center justify-between">
      <div class="text-[#A0576F] text-[15px] font-medium">
        {{ t('gift_to_label') }}: {{ fullName || '-' }}
      </div>
      <div class="flex items-center gap-[7px] justify-end">
        <button class="cursor-pointer" @click="openGiftDialog">
          <EditIcon />
        </button>
        <button class="cursor-pointer" @click="clearGiftParams">
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

/* ---------- Local UI state ---------- */

// Reflect current gifted state from the store (1 => ON, 0 => OFF)
const isGifted = ref(cartStore.params?.is_gifted_order === 1)

// Whether the dialog completed with a confirmed payload
const confirmed = ref(false)

/* ---------- Derived data from store ---------- */

// Current gifted recipient data (safe fallback to empty object)
const giftedOrderData = computed(() => cartStore.params?.gifted_order_data || {})

/* ---------- Helpers ---------- */

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
// === Add these ===
const hasGiftData = computed(() => {
  const d = cartStore.params?.gifted_order_data || {}
  const msg = (cartStore.params?.gift_message || '').trim()
  return Boolean(
    (d.first_name && d.first_name.trim()) ||
    (d.last_name && d.last_name.trim()) ||
    (d.mobile_number && d.mobile_number.trim()) ||
    (d.email && d.email.trim()) ||
    msg
  )
})

const fullName = computed(() => {
  const d = cartStore.params?.gifted_order_data || {}
  return [d.first_name, d.last_name].filter(Boolean).join(' ')
})

// (اختياري) لو ما عندك resetGiftState في الـstore
function clearGiftParams() {
  if (typeof (cartStore as any).resetGiftState === 'function') {
    (cartStore as any).resetGiftState()
  } else {
    cartStore.params.is_gifted_order = 0
    cartStore.params.gifted_order_data = {
      first_name: '', last_name: '', mobile_code: '966', mobile_number: '', email: ''
    } as any
    cartStore.params.gift_message = ''
  }
}


/* ---------- Main toggle flow ---------- */

/** Toggle watcher — enforce “refresh cart first, then dialog” when turned ON */
watch(isGifted, async (val) => {
  if (val) {
    // 1) Mark as gifted in store first
    cartStore.params.is_gifted_order = 1

    // 2) Refresh cart before opening dialog (ensures summary reflects gift state)
    await fetchCartQuiet()

    // 3) Open dialog AFTER cart refresh
    confirmed.value = false
    openGiftDialog()
  } else {
    // Turned OFF → reset gifted params and refresh immediately (no dialog)
    clearGiftParams()
    fetchCartQuiet()
  }
})

/** Keep local switch in sync if store changes elsewhere (avoid feedback loops) */
watch(
  () => cartStore.params?.is_gifted_order,
  (val) => {
    const next = val === 1
    if (next !== isGifted.value) isGifted.value = next
  }
)

/* ---------- Global events from the dialog ---------- */

function onGiftConfirmed() {
  // Dialog has validated and set gifted_order_data inside the store
  confirmed.value = true
  // Optional: refresh cart again in case totals/messages depend on recipient fields
  fetchCartQuiet()
}

function onGiftNotConfirmed() {
  // If user closed/canceled without confirming, revert the switch
  if (!confirmed.value) {
    isGifted.value = false // triggers watcher → clears + refreshes
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
