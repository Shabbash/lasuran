<template>
  <div>
    <SendGiftCard />

    <VipService />
    <div class="p-[24px] pb-[40px] rounded-[16px] border border-[#E7E7E7] bg-[#EBE4DF]">
      <h2 class="text-[#A0576F] mb-[16px] text-[20px] font-medium leading-normal">
        {{ t('payment_details_title') }}
      </h2>

      <!-- Summary values display -->
      <div class="space-y-[16px] text-[#5B605C] text-[14px] font-medium">
        <div class="flex justify-between">
          <span>{{ t('payment_subtotal_label', { count: servicesCount }) }}</span>
          <span class="font-bold"><span class="sar-icon">&#xe900;</span> {{ formattedSubtotal }}</span>
        </div>
        <div class="flex justify-between">
          <span>{{ t('payment_vat_label') }}</span>
          <span class="font-bold"><span class="sar-icon">&#xe900;</span> {{ formattedVat }}</span>
        </div>
        <div class="flex justify-between">
          <span>{{ t('payment_service_cost_label') }}</span>
          <span class="font-bold"><span class="sar-icon">&#xe900;</span> {{ formattedServiceCost }}</span>
        </div>
        <div class="flex justify-between">
          <span>{{ t('payment_discount_label') }}</span>
          <span class="font-bold"><span class="sar-icon">&#xe900;</span> {{ formattedDiscount }}</span>
        </div>
      </div>

      <!-- Promo & Gift Card Inputs -->
      <div class="space-y-4 mt-4">
        <div class="flex gap-2 relative border border-[#A0576F] rounded-[100px] overflow-hidden">
          <UInput v-model="params.promo_code" :placeholder="t('promo_code_placeholder')"
            class="flex-1 bg-transparent text-[15px] font-normal leading-normal capitalize ps-[10px] h-[44px] summary-input"
            :ui="{
              base: 'flex-1 bg-transparent text-[15px] font-normal leading-normal capitalize h-[44px] summary-input border-0 ring-0 focus-visible:ring-0'
            }" />
          <UButton :loading="isApplyingPromo" @click="applyPromoCode"
            class="h-full bg-transparent text-[#A0576F] text-[15px] font-normal leading-normal underline p-0 pe-[24px] h-[44px] hover:bg-transparent"
            color="primary" variant="soft">
            {{ t('promo_code_apply') }}
          </UButton>
        </div>

        <div class="flex gap-[15px]">
          <div class="flex gap-2 relative border border-[#A0576F] rounded-[100px] overflow-hidden">
            <UInput v-model="params.gift_card" :placeholder="t('gift_card_sn_placeholder')"
              class="flex-1 bg-transparent text-[15px] font-normal leading-normal capitalize ps-[10px] h-[44px] summary-input"
              :ui="{
                base: 'flex-1 bg-transparent text-[15px] font-normal leading-normal capitalize h-[44px] summary-input border-0 ring-0 focus-visible:ring-0'
              }" />
            <UButton :loading="isApplyingGiftCard" @click="applyGiftCard"
              class="h-full bg-transparent text-[#A0576F] text-[15px] font-normal leading-normal underline p-0 pe-[24px] h-[44px] hover:bg-transparent"
              color="primary" variant="soft">
              {{ t('promo_code_apply') }}
            </UButton>
          </div>

          <BaseButton @click="openAllGiftCards"
            class="flex items-center justify-center px-[18px] w-[45%] text-[#6B8B9B] bg-[#BBCACF] hover:bg-[#BBCACF] text-center text-[14px] font-normal leading-normal rounded-[100px] h-[44px]">
            {{ t('gift_card_all_cards_button') }}
          </BaseButton>
        </div>

        <div class="flex items-center gap-2 text-sm text-[#A0576F]">
          <UCheckbox v-model="accepted" />
          <span>{{ t('accept_terms_label') }}</span>
        </div>

        <BaseButton :loading="isProcessing" @click="proceedToCheckout"
          class="cart-btn flex align-center gap-[24px] w-full text-white py-3 rounded-full font-[600] text-[16px] justify-center bg-[#A0576F] hover:bg-[#913E5D] mt-[35px] disabled:bg-[#A0576F]"
          :disabled="!accepted || servicesCount === 0">
          <span class="sar-icon">&#xe900;</span> {{ t('checkout_button_label', { total: formattedTotal }) }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCart } from '~/stores/cart'
import { useApp } from '~/stores/app'
import { useToast } from '#imports'
import { COMPONENTS } from '~/data/constants'
import { formatNumber } from '~/utils/helper'
import SendGiftCard from '@/components/cart/SendGiftCard.vue'
import { navigateTo } from '#imports'

import VipService from '@/components/cart/VipService.vue'
import { useAddresses } from '~/stores/address'
const addresses = useAddresses()

const { t } = useI18n()
const toast = useToast()
const appModule = useApp()
const cartModule = useCart()

// Props
const props = defineProps<{
  servicesCount: number
  subtotal: number
  vat?: number
  discount?: number
  serviceCost?: number
  total?: number
}>()

// State
const isProcessing = ref(false)
const accepted = ref(false)
const appliedPromoCode = ref<string | null>(null)
const appliedGiftCard = ref<string | null>(null)

// Cart params
const params = computed({
  get: () => cartModule.params ?? {},
  set: (val) => { cartModule.params = val ?? {} }
})

// Formatters
const formattedSubtotal = computed(() => formatNumber(props.subtotal))
const formattedVat = computed(() => formatNumber(props.vat))
const formattedDiscount = computed(() => formatNumber(props.discount))
// Always read service cost from the cart store (kept in sync with API)
const formattedServiceCost = computed(() =>
  formatNumber((cartModule as any).service_cost ?? 0)
)

// Always compute the final total on the client for display:
// total = subtotal + VAT + service fees - discount
// const formattedTotal = computed(() => {
//   // Ensure numeric values
//   const s  = Number(props.subtotal ?? 0)
//   const v  = Number(props.vat ?? 0)
//   const d  = Number(props.discount ?? 0)
//   const sc = Number(props.serviceCost ?? 0)

//   // Clamp to >= 0 and format
//   const total = Math.max(0, s + v + sc - d)
//   return formatNumber(total)
// })
const formattedTotal = computed(() => {
  // Always trust the backend total coming from /cart
  return formatNumber(props.total ?? 0)
})

// Gift card logic
const isApplyingGiftCard = computed({
  get: () => cartModule.isGiftCardApplyLoading,
  set: (val) => cartModule.isGiftCardApplyLoading = val
})

const applyGiftCard = async () => {
  isApplyingGiftCard.value = true
  await cartModule.fetchCart(params.value, { disableLoading: true })
  appliedGiftCard.value = params.value.gift_card
  isApplyingGiftCard.value = false
}

// Promo code logic
const isApplyingPromo = ref(false)

const applyPromoCode = async () => {
  isApplyingPromo.value = true
  await cartModule.fetchCart(params.value, { disableLoading: true })
  appliedPromoCode.value = params.value.promo_code
  isApplyingPromo.value = false
}

// Open gift cards modal
const openAllGiftCards = () => {
  appModule.setDialogComponent(COMPONENTS.MY_GIFT_CARDS_DIALOG, {
    onSelect(serial: string) {
      params.value.gift_card = serial
      applyGiftCard()
      appModule.setDialogShow(false)
    },
    modalMaxWidth: 'max-w-[400px]'
  })
  appModule.setDialogShow(true)
}

// Watchers
watch(() => params.value.promo_code, (newVal) => {
  if (appliedPromoCode.value && newVal !== appliedPromoCode.value) {
    appliedPromoCode.value = null
    cartModule.fetchCart({ promo_code: null, gift_card: params.value.gift_card }, { disableLoading: true })
  }
})

watch(() => params.value.gift_card, (newVal) => {
  if (appliedGiftCard.value && newVal !== appliedGiftCard.value) {
    appliedGiftCard.value = null
    cartModule.fetchCart({ promo_code: params.value.promo_code, gift_card: null }, { disableLoading: true })
  }
})
// Refresh cart when VIP fee or its address changes so API recalculates service_cost
const refreshCartWithVip = async () => {
  await cartModule.fetchCart({}, { disableLoading: true }) // Store already injects bracketed params
}

watch(() => (cartModule as any).selectedServiceFeeId, refreshCartWithVip)
watch(() => (cartModule as any).selectedServiceFeeAddressId, refreshCartWithVip)

// Reset on reload
onMounted(() => {
  if (process.client && window.performance?.navigation?.type === 1) {
    params.value.promo_code = null
    params.value.gift_card = null
    appliedPromoCode.value = null
    appliedGiftCard.value = null
  }
})

// ✅ Checkout logic
const proceedToCheckout = async () => {
  // Guard against double clicks
  if (isProcessing.value) return
  isProcessing.value = true

  try {
    // ✅ Ensure VIP address if required
    const ok = await ensureVipAddressBeforeCheckout()
    if (!ok) {
      isProcessing.value = false
      toast.add({ title: t('error_title'), description: 'Please select an address for VIP service.' })
      return
    }

    // ✅ Choose payment method (or open selector)
    if (cartModule.getPaymentMethods.length > 1) {
      appModule.setDialogComponent(COMPONENTS.PAYMENT_SELECTION, {


    modalMaxWidth: 'max-w-[539px]',
    })
      appModule.setDialogShow(true)
      isProcessing.value = false
      return
    }
    cartModule.setPaymentMethod(cartModule.getPaymentMethods?.[0]?.id)

    const timeoutId = setTimeout(() => {
      // Safety: never keep the button stuck if API hangs
      isProcessing.value = false
    }, 10000)

const orderPayload = {
  // Let the store attach service_fees from params.service_fees internally
  payment_method_id: (cartModule as any).selectedPaymentMethodId ?? cartModule.getPaymentMethods?.[0]?.id,
  is_scheduled: cartModule.params?.is_scheduled ?? 0,
  promo_code: params.value?.promo_code ?? null,
  gift_card: params.value?.gift_card ?? null,
  is_gifted_order: cartModule.params?.is_gifted_order ?? 0,
  gift_message: cartModule.params?.gift_message ?? ''
  // Do NOT include service_fees here to avoid duplication
}


    cartModule.createOrder(
      orderPayload,
      (response) => {
        clearTimeout(timeoutId)
        isProcessing.value = false

        const r = response?.data ?? response ?? {}
        const paymentUrl = r?.payment?.create_token_url?.url

        if (paymentUrl) {
          navigateTo({ path: '/secure-payment', query: { url: paymentUrl } })
        } else {
          toast.add({ title: t('error_title'), description: t('missing_payment_url') })
        }
      },

    )
  } catch (e) {
    isProcessing.value = false
    toast.add({ title: t('error_title'), description: t('checkout_failed') })
  }
}


// Open saved-addresses modal and resolve selected id (or null on cancel)
const pickExistingAddress = (): Promise<number | null> =>
  new Promise((resolve) => {
    appModule.setDialogComponent(COMPONENTS.ADDRESSES_DIALOG, {
      modalMaxWidth: 'max-w-[539px]',
      onSelected: (addr: any) => {
        appModule.setDialogShow(false)
        resolve(addr?.id ?? null)
      },
    })
    appModule.setDialogShow(true)
  })

// Ensure we have an address when selected VIP fee requires location
const ensureVipAddressBeforeCheckout = async (): Promise<boolean> => {
  const feeId = (cartModule as any).selectedServiceFeeId
  if (!feeId) return true // VIP not selected

  const fees = (cartModule as any).available_service_fees || []
  const fee = fees.find((f: any) => f.id === feeId)
  const needsLocation = fee?.applied_condition === 'trigger_by_location'
  if (!needsLocation) return true

  if ((cartModule as any).selectedServiceFeeAddressId) return true

  await addresses.fetchAddresses()
  if (addresses.preferredId) {
    (cartModule as any).selectedServiceFeeAddressId = addresses.preferredId
    return true
  }

  const chosenId = await pickExistingAddress()
  if (chosenId) {
    (cartModule as any).selectedServiceFeeAddressId = chosenId
    return true
  }

  // User canceled picking an address
  return false
}

// Build VIP extras for order/cart payload
// const buildVipExtras = () => {
//   const extras: Record<string, any> = {}
//   const feeId = (cartModule as any).selectedServiceFeeId
//   const addrId = (cartModule as any).selectedServiceFeeAddressId

//   if (feeId) {
//     extras['service_fees[0][id]'] = feeId
//     if (addrId) extras['service_fees[0][address_id]'] = addrId
//   }
//   return extras
// }

</script>

<style>
.summary-input::placeholder {
  font-size: 12px;
}
</style>