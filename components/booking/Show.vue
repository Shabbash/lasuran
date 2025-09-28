<template>
  <div v-if="booking"
    class="bg-decore-modal mx-auto rounded-[30px] overflow-hidden shadow-lg bg-[#EBE4DF] text-[#5F2C3E]">
    <div class="pt-[34px] px-[50px] pb-[30px] relative">
      <h2 class="text-[#A0576F] text-[18px] font-bold leading-normal text-center mb-[20px]">
        {{ t('booking_no_label') }} {{ booking.bookingNumber }}
      </h2>

      <!-- Booking Details -->
      <div class="p-[20px] rounded-[20px] bg-[#A0576F] relative mb-[18px]">
        <div class="flex justify-between mb-[20px]">
          <h3 class="text-[#EBE4DF] text-[17.108px] font-medium leading-normal">{{ t('booking_details_title') }}</h3>
          <span :style="`background-color: ${booking._originalData?.status?.color || '#6B8B9B'}`"
            class="inline-flex px-[18px] h-[24px] rounded-full text-[14px] font-medium items-center justify-center text-white">
            {{ booking._originalData?.status_text || capitalizeFirstLetter(booking.status) }}
          </span>
        </div>

        <div class="space-y-[12px]">
          <div class="flex justify-between pb-[12px] border-b border-b-[#AD7084]">
            <h3 class="text-[#EBE4DF] text-[13.082px] font-[350]">{{ t('booking_username_label') }}</h3>
            <p class="text-[#EBE4DF] text-[13px] font-[350]">{{ authStore.getUserName }}</p>
          </div>
          <div class="flex justify-between pb-[12px] border-b border-b-[#AD7084]">
            <h3 class="text-[#EBE4DF] text-[13.082px] font-[350]">{{ t('booking_customer_arrived_label') }}</h3>
            <p class="text-[#EBE4DF] text-[13px] font-[350]">{{ booking._originalData?.customer_arrived ?
              t('booking_customer_arrived_yes') : t('booking_customer_arrived_no') }}</p>
          </div>
          <div class="flex justify-between pb-[12px] border-b border-b-[#AD7084]">
            <h3 class="text-[#EBE4DF] text-[13.082px] font-[350]">{{ t('booking_visitors_label') }}</h3>
            <p class="text-[#EBE4DF] text-[13px] font-[350]">{{ booking.guests }} {{ t('booking_visitors_label') }}</p>
          </div>
          <div class="flex justify-between pb-[12px] border-b border-b-[#AD7084]">
            <h3 class="text-[#EBE4DF] text-[13.082px] font-[350]">{{ t('booking_branch_label') }}</h3>
            <p class="text-[#EBE4DF] text-[13px] font-[350]">{{ booking.branch.name }}</p>
          </div>
          <div class="flex justify-between pb-[12px] border-b border-b-[#AD7084]">
            <h3 class="text-[#EBE4DF] text-[13.082px] font-[350]">{{ t('booking_time_label') }}</h3>
            <p class="text-[#EBE4DF] text-[13px] font-[350]">{{ booking.time }}</p>
          </div>
          <div class="flex justify-between pb-[12px] border-b border-b-[#AD7084]">
            <h3 class="text-[#EBE4DF] text-[13.082px] font-[350]">{{ t('booking_date_label') }}</h3>
            <p class="text-[#EBE4DF] text-[13px] font-[350]">{{ booking.date }}</p>
          </div>

          <!-- Gifter name (only if this is a gifted booking and current user is the receiver) -->
          <div v-if="booking.gifted_info && booking.gifted_info.is_sender === false && booking.gifted_info.sender_user"
            class="flex justify-between pb-[12px] border-b border-b-[#AD7084]">
            <h3 class="text-[#EBE4DF] text-[13.082px] font-[350]">{{ t('gifted_by_label') }}</h3>
            <p class="text-[#EBE4DF] text-[13px] font-[350]">
              {{ booking.gifted_info.sender_user.full_name }}
            </p>
          </div>

        </div>
      </div>

      <!-- Payment Summary -->
      <div class="mb-[30px] px-[12px]">
        <h3 class="text-[#A0576F] text-[16px] font-medium mb-[23px]">{{ t('payment_summary_title') }}</h3>
        <div class="space-y-[12px] text-[#5B605C] text-[12px] font-[350]">
          <div class="flex justify-between border-b border-b-[#B2B0B0] pb-[12px]">
            <p>{{ t('payment_subtotal_label', { count: booking.guests }) }}</p>
            <p><span class="sar-icon">&#xe900;</span> {{ booking._originalData?.total || '00.00' }}</p>
          </div>
          <div class="flex justify-between border-b border-b-[#B2B0B0] pb-[12px]">
            <p>{{ t('payment_vat_label') }}</p>
            <p><span class="sar-icon">&#xe900;</span> 00.00</p>
          </div>
          <div class="flex justify-between border-b border-b-[#B2B0B0] pb-[12px]">
            <p>{{ t('payment_service_cost_label') }}</p>
            <p><span class="sar-icon">&#xe900;</span> {{ booking._originalData?.order_service_fee_price || '00.00' }}</p>
          </div>
          <div class="flex justify-between border-b border-b-[#B2B0B0] pb-[12px]">
            <p>{{ t('payment_discount_label') }}</p>
            <p><span class="sar-icon">&#xe900;</span> {{ booking._originalData?.promo_discount || '00.00' }}</p>
          </div>
          <div class="flex justify-between border-b border-b-[#B2B0B0] pb-[12px]">
            <p>{{ t('payment_redeem_points_label') }}</p>
            <p><span class="sar-icon">&#xe900;</span> {{ booking._originalData?.redeem_points_price || '00.00' }}</p>
          </div>
        </div>

        <div class="flex justify-between mt-[28px] text-[#A0576F] text-[21px] font-bold">
          <p>{{ t('payment_total_label') }}</p>
          <p><span class="sar-icon">&#xe900;</span> {{ booking._originalData?.total || '00.00' }}</p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col space-y-3">
        <!-- Rate Button -->
        <BaseButton v-if="booking._originalData?.can_rate"
          class="w-full h-[50px] bg-transparent hover:bg-transparent text-[#6B8B9B] border border-[#6B8B9B] rounded-full text-[13px] font-medium"
          @click="onRate?.()">
          {{ t('button_rate_service') }}
        </BaseButton>

        <!-- View Rating Button -->
        <BaseButton v-if="booking._originalData?.has_rating"
          class="w-full h-[50px] bg-[#6B8B9B] hover:bg-[#6B8B9B] text-[#EBE4DF] border border-[#6B8B9B] rounded-full text-[13px] font-medium"
          @click="onViewRating?.()">
          {{ t('button_view_rating') }}
        </BaseButton>

        <!-- View Invoice Button (only if not a gifted receiver) -->
        <BaseButton
          v-if="booking._originalData?.invoice_link && !(booking.gifted_info && booking.gifted_info.is_sender === false)"
          class="w-full h-[50px] bg-[#A0576F] hover:bg-[#A0576F] text-[#EBE4DF] rounded-full text-[13px] font-medium"
          @click="onInvoice?.()">
          {{ t('button_view_invoice') }}
        </BaseButton>

        <!-- Schedule Gift Button (for gifted receiver and not yet completed) -->
        <BaseButton
          v-if="booking.gifted_info && booking.gifted_info.is_sender === false && !booking.gifted_info.is_completed"
          class="w-full h-[50px] bg-[#A0576F] hover:bg-[#A0576F] text-[#EBE4DF] rounded-full text-[13px] font-medium"
          @click="openScheduleDialog(booking.id)">
          {{ t('button_schedule_gift') }}
        </BaseButton>

        <!-- Cancel Button -->
        <BaseButton v-if="booking._originalData?.is_cancelable"
          class="w-full h-[50px] bg-[#C44E4E] hover:bg-[#C44E4E] text-[#EBE4DF] rounded-full text-[13px] font-medium"
          @click="onCancel?.()">
          {{ t('button_cancel_booking') }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

// ✅ Define Props
const props = defineProps<{
  booking: any,
  onRate?: () => void,
  onViewRating?: () => void,
  onInvoice?: () => void,
  onCancel?: () => void
}>()

// ✅ Stores
import { useAuth } from '~/stores/auth'
import { useApp } from '~/stores/app'
import { useGiftedOrders } from '~/stores/gifted-orders'
const authStore = useAuth()
const appStore = useApp()

// ✅ I18n
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

// ✅ Constants
import { COMPONENTS } from '~/data/constants'

// ✅ Capitalize helper
function capitalizeFirstLetter(text: string) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : ''
}

// ✅ Open Schedule Dialog (for gifted orders)
async function openScheduleDialog(id : any) {
  if (!props.booking?.gifted_info) return

  const giftedOrdersStore = useGiftedOrders()

  try {
    // 🟡 Fetch gifted order details before opening dialog
    await giftedOrdersStore.fetchGiftedOrder(props.booking.gifted_info.id)

    const giftedDetails = giftedOrdersStore.giftedOrderDetails
    console.log('Gifted details in Show component:', giftedDetails)

    // Check different possible fields for order_id
    const orderId = giftedDetails?.order_id || giftedDetails?.id || giftedDetails?.order?.id
    console.log('Order ID candidates in Show:', {
      'giftedDetails.order_id': giftedDetails?.order_id,
      'giftedDetails.id': giftedDetails?.id,
      'giftedDetails.order?.id': giftedDetails?.order?.id,
      'selected orderId': orderId
    })

    if (!orderId) {
      console.error('No order ID found in gifted details:', giftedDetails)
      throw new Error('Order ID not found in gifted order details')
    }

    // Fetch the actual order details using the order_id to get product_master_id
    const { data: orderResponse } = await useApi(`orders/${orderId}`, {
      method: 'GET'
    })

    if (orderResponse.value?.status && orderResponse.value?.data?.products?.length > 0) {
      const product = orderResponse.value.data.products[0]

      appStore.setDialogComponent(COMPONENTS.SCHEDULE_GIFTED_ORDER, {
        gifted_order_id: props.booking.gifted_info.id,
        order_product_id: product?.order_product_id,  // Use order_product_id (939), not id (23)
        product_master_id: product?.product_master_id
      })

      appStore.setDialogShow(true)
    } else {
      throw new Error('Product details not found in order')
    }
  } catch (e) {
    console.error('❌ Failed to open gifted schedule dialog:', e)
  }
}
</script>