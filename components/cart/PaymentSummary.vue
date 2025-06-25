<template>
  <div class="p-[24px] pb-[40px] rounded-[16px] border border-[#E7E7E7] bg-[#EBE4DF]">
    <h2 class="text-[#A0576F] mb-[16px] text-[20px] font-medium leading-normal">Payment Details</h2>

    <!-- Summary values display -->
    <div class="space-y-[16px] text-[#5B605C] text-[14px] font-medium">
      <div class="flex justify-between">
        <span>Subtotal ({{ servicesCount }} Services)</span>
        <span class="font-bold"><span class="sar-icon">&#xe900;</span> {{ formattedSubtotal }}</span>
      </div>
      <div class="flex justify-between">
        <span>VAT (15%)</span>
        <span class="font-bold"><span class="sar-icon">&#xe900;</span> {{ formattedVat }}</span>
      </div>
      <div class="flex justify-between">
        <span>Services cost</span>
        <span class="font-bold"><span class="sar-icon">&#xe900;</span> {{ formattedServiceCost }}</span>
      </div>
      <div class="flex justify-between">
        <span>Discount</span>
        <span class="font-bold"><span class="sar-icon">&#xe900;</span> {{ formattedDiscount }}</span>
      </div>
    </div>

    <!-- Promo code and gift card inputs -->
    <div class="space-y-4 mt-4">
      <!-- Promo Code Input -->
      <div class="flex gap-2 relative border border-[#A0576F] rounded-[100px] overflow-hidden">
        <UInput v-model="params.promo_code" placeholder="Enter Promo Code"
          class="flex-1 bg-transparent text-[15px] font-normal leading-normal capitalize ps-[10px] h-[44px] summary-input"
          :ui="{
            base:'flex-1 bg-transparent text-[15px] font-normal leading-normal capitalize h-[44px] summary-input border-0 ring-0 focus-visible:ring-0'
          }"
        />

        <UButton :loading="isApplyingPromo" @click="applyPromoCode"
          class="h-full bg-transparent text-[#A0576F] text-[15px] font-normal leading-normal underline p-0 pe-[24px] h-[44px] hover:bg-transparent"
          color="primary" variant="soft">
          Apply
        </UButton>
      </div>

      <!-- Gift Card Input -->
      <div class="flex gap-[15px]">
        <div class="flex gap-2 relative border border-[#A0576F] rounded-[100px] overflow-hidden">
          <UInput v-model="params.gift_card" placeholder="Gift Card SN"
            class="flex-1 bg-transparent text-[15px] font-normal leading-normal capitalize ps-[10px] h-[44px] summary-input" 
            :ui="{
              base:'flex-1 bg-transparent text-[15px] font-normal leading-normal capitalize h-[44px] summary-input border-0 ring-0 focus-visible:ring-0'
            }"
          />
          <UButton :loading="isApplyingGiftCard" @click="applyGiftCard"
            class="h-full bg-transparent text-[#A0576F] text-[15px] font-normal leading-normal underline p-0 pe-[24px] h-[44px] hover:bg-transparent"
            color="primary" variant="soft">
            Apply
          </UButton>
        </div>

        <!-- Open All Gift Cards Dialog -->
        <BaseButton @click="openAllGiftCards"
          class="flex items-center justify-center px-[18px] w-[45%] text-[#6B8B9B] bg-[#BBCACF] hover:bg-[#BBCACF] text-center text-[14px] font-normal leading-normal rounded-[100px] h-[44px]">
          All Cards
        </BaseButton>
      </div>

      <!-- Terms and Conditions Checkbox -->
      <div class="flex items-center gap-2 text-sm text-[#A0576F]">
        <UCheckbox v-model="accepted" />
        <span>Accept terms and conditions</span>
      </div>

      <!-- Checkout Button -->
      <BaseButton :loading="isProcessing" @click="proceedToCheckout"
        class="cart-btn flex align-center gap-[24px] w-full text-white py-3 rounded-full font-[600] text-[16px] justify-center bg-[#A0576F] hover:bg-[#913E5D] mt-[35px] disabled:bg-[#A0576F]"
        :disabled="!accepted || servicesCount === 0">
        <span class="sar-icon">&#xe900;</span> {{ formattedTotal }} - Checkout
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { COMPONENTS } from "~/data/constants"
import { useApp } from '~/stores/app'
import { useApi } from '~/composables/useApi'
import { useCart } from '~/stores/cart'
import { useToast } from '#imports'

import {formatNumber} from '~/utils/helper';

const toast = useToast()
const cartModule = useCart();

// Props for incoming payment data
const props = defineProps<{
  servicesCount: number
  subtotal: number
  vat?: number
  discount?: number
  serviceCost?: number
  total?: number
}>()

const appModule = useApp()

// const params  = ref({
//   gift_card: null,
//   promo_code: null,
// })

const params = computed({
  set(newValue){
    cartModule.params = newValue ?? {}
  },
  get() {
    return cartModule.params ?? {};
  }
})

// Main reactive payment-related values
// const subtotal = ref(props.subtotal)
// const vat = ref(props.vat ?? props.subtotal * 0.15)
// const discount = ref(props.discount ?? 0)
// const serviceCost = ref(props.serviceCost ?? 0)
// const total = ref(props.total ?? (props.subtotal + vat.value - discount.value + serviceCost.value))

// Gift Card logic
const giftCardSerial = ref('')
const giftCards = ref([])
const isLoadingCards = ref(false)
const isProcessing = ref(false)
const accepted = ref(false)
const isApplyingGiftCard = computed({
  set:(value) => cartModule.isGiftCardApplyLoading = value,
  get:() => cartModule.isGiftCardApplyLoading,
})

// Formatted computed currency values to avoid crash on .toFixed()
const formattedSubtotal = computed(() => formatNumber(props.subtotal) )
const formattedVat = computed(() => formatNumber(props.vat))
const formattedDiscount = computed(() => formatNumber(props.discount))
const formattedServiceCost = computed(() => formatNumber(props.serviceCost))
const formattedTotal = computed(() => formatNumber(props.total))


// const { data: availableVouchers, pending: isLoadingCards , refresh: fetchGiftCards} = await useApi('vouchers/list_available_vouchers', { method: 'GET', params: {page: 1, per_page: 30}, immediate: false });

// Fetch and open gift card selector dialog
const openAllGiftCards = async () => {
  // if (giftCards.value.length === 0) {
  //   isLoadingCards.value = true
  //   try {
  //     const { data } = await useApi('vouchers/list_available_vouchers?page=1', { method: 'GET' })
  //     giftCards.value = data.value?.data?.vouchers || []
  //   } catch (err) {
  //     console.error('❌ Failed to fetch gift cards:', err)
  //   } finally {
  //     isLoadingCards.value = false
  //   }
  // }

  appModule.setDialogComponent(COMPONENTS.MY_GIFT_CARDS_DIALOG, {
    onSelect(serial: string) {
      giftCardSerial.value = serial
      appModule.setDialogShow(false)
    },
    modalMaxWidth: 'max-w-[400px]'
  })
  appModule.setDialogShow(true)
}

// watch(()=> cartModule.params.gift_card , (newValue) => {
//   applyGiftCard();
// })
// Apply selected gift card to cart
const applyGiftCard = async () => {
  // if (!params.value?.gift_card) {
  //   return toast.add({ title: "Please enter a gift card serial number", color: 'warning' })
  // }
  isApplyingGiftCard.value = true
  cartModule.fetchCart(
      params.value,
      {
        disableLoading: true,
      }
  ).then(() => {
    isApplyingGiftCard.value = false
  });

  // isApplyingGiftCard.value = true
  //
  // try {
  //   const { data } = await useApi(`cart?gift_card=${giftCardSerial.value}`, { method: 'GET' })
  //
  //   if (data.value?.status && data.value?.data) {
  //     const cartData = data.value.data
  //
  //     subtotal.value = cartData.sub_total
  //     vat.value = cartData.tax_amount
  //     discount.value = (cartData.promo_discount || 0) + (cartData.gift_card_discount || 0)
  //     serviceCost.value = cartData.order_service_fees_price || 0
  //     total.value = cartData.total
  //
  //     toast.add({ title: "Gift card applied successfully!", color: 'green' })
  //   } else {
  //     // toast.add({ title: "Invalid or expired gift card", color: 'error' })
  //   }
  // } catch (err) {
  //   console.error('Failed to apply gift card:', err)
  //   toast.add({ title: "An error occurred", color: 'error' })
  // } finally {
  //   isApplyingGiftCard.value = false
  // }
}

// Promo code logic
const promoCode = ref('')
const isApplyingPromo = ref(false)

// Apply promo code to cart
const applyPromoCode = async () => {
  // if (!params.value?.promo_code) {
  //   return toast.add({ title: "Please enter a promo code", color: 'warning' })
  // }

  isApplyingPromo.value = true
  cartModule.fetchCart(
      params.value,
      {
        disableLoading: true,
      }
  ).then(() => {
    isApplyingPromo.value = false
  });

  // isApplyingPromo.value = true
  //
  // try {
  //   const { data } = await useApi(`cart?promo_code=${promoCode.value}`, { method: 'GET' , activateSuccessToast: true })
  //
  //   if (data.value?.status && data.value?.data) {
  //     const cartData = data.value.data
  //
  //     subtotal.value = cartData.sub_total
  //     vat.value = cartData.tax_amount
  //     discount.value = (cartData.promo_discount || 0) + (cartData.gift_card_discount || 0)
  //     serviceCost.value = cartData.order_service_fees_price || 0
  //     total.value = cartData.total
  //
  //     // toast.add({ title: "Promo code applied successfully!", color: 'green' })
  //   } else {
  //     // toast.add({ title: "Invalid or expired promo code", color: 'error' })
  //   }
  // } catch (err) {
  //   console.error('Failed to apply promo code:', err)
  //   toast.add({ title: "An error occurred", color: 'error' })
  // } finally {
  //   isApplyingPromo.value = false
  // }
}

// Finalize checkout flow
const proceedToCheckout = () => {
  if (isProcessing.value) return
  isProcessing.value = true

  try {
    const cartModule = useCart()
    if (cartModule.getPaymentMethods.length > 1) {
      appModule.setDialogComponent(COMPONENTS.PAYMENT_SELECTION)
      appModule.setDialogShow(true)
      isProcessing.value = false
    } else {
      cartModule.setPaymentMethod(cartModule.getPaymentMethods?.[0]?.id)

      const timeoutId = setTimeout(() => {
        isProcessing.value = false
        console.warn('Order creation timeout - resetting loading state')
      }, 10000)

      cartModule.createOrder({},
        (_data: any) => {
          clearTimeout(timeoutId)
          appModule.setDialogComponent(COMPONENTS.PAYMENT_LOADING)
          appModule.setDialogShow(true, {
            dismissible: false,
            close: false
          })
          isProcessing.value = false
        },
        (error: any) => {
          clearTimeout(timeoutId)
          console.error('Order creation failed:', error)
          isProcessing.value = false
        }
      )
    }
  } catch (error) {
    console.error('Error in checkout process:', error)
    isProcessing.value = false
  }
}
</script>
