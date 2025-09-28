<!-- components/booking/GiftedOrderDetailsDialog.vue -->
<template>
  <div v-if="bk" class="bg-decore-modal mx-auto rounded-[30px] overflow-hidden shadow-lg bg-[#EBE4DF] text-[#5F2C3E]">
    <div class="pt-[34px] px-[20px] md:px-[50px] pb-[30px] relative">
      <!-- Header -->
      <h2 class="text-[#A0576F] text-[18px] font-bold leading-normal text-center mb-[20px]">
        {{ t('booking_no_label') }} {{ bk.bookingNumber || bk._originalData?.order_number }}
      </h2>



      <!-- Booking Details -->
      <div class="p-[20px] rounded-[20px] bg-[#A0576F] relative mb-[18px]">
        <div class="flex justify-between mb-[20px]">
          <h3 class="text-[#EBE4DF] text-[17.108px] font-medium leading-normal">{{ t('booking_details_title') }}</h3>
          <span :style="`background-color: ${bk._originalData?.status?.color || '#6B8B9B'}`"
            class="inline-flex px-[18px] h-[24px] rounded-full text-[14px] font-medium items-center justify-center text-white">
            {{ bk._originalData?.status_text || capitalizeFirstLetter(bk.status?.label) }}
          </span>
        </div>

        <div class="space-y-[12px]">
          <div class="flex justify-between pb-[12px] border-b border-b-[#AD7084]">
            <h3 class="text-[#EBE4DF] text-[13.082px] font-[350]">{{ t('booking_username_label') }}</h3>
            <p class="text-[#EBE4DF] text-[13px] font-[350]">{{ authStore.getUserName }}</p>
          </div>

          <div class="flex justify-between pb-[12px] border-b border-b-[#AD7084]">
            <h3 class="text-[#EBE4DF] text-[13.082px] font-[350]">{{ t('booking_visitors_label') }}</h3>
            <p class="text-[#EBE4DF] text-[13px] font-[350]">
              {{ bk.guests ?? bk._originalData?.number_of_users ?? 0 }} {{ t('booking_visitors_label') }}
            </p>
          </div>

          <div class="flex justify-between pb-[12px] border-b border-b-[#AD7084]">
            <h3 class="text-[#EBE4DF] text-[13.082px] font-[350]">{{ t('booking_branch_label') }}</h3>
            <p class="text-[#EBE4DF] text-[13px] font-[350]">{{ bk.branch?.name ?? bk._originalData?.branch_name }}</p>
          </div>

          <div class="flex justify-between pb-[12px] border-b border-b-[#AD7084]">
            <h3 class="text-[#EBE4DF] text-[13.082px] font-[350]">{{ t('booking_time_label') }}</h3>
            <p class="text-[#EBE4DF] text-[13px] font-[350]">{{ bk.time ?? bk._originalData?.time }}</p>
          </div>

          <div class="flex justify-between pb-[12px] border-b border-b-[#AD7084]">
            <h3 class="text-[#EBE4DF] text-[13.082px] font-[350]">{{ t('booking_date_label') }}</h3>
            <p class="text-[#EBE4DF] text-[13px] font-[350]">{{ bk.date ?? formatDate(bk._originalData?.date) }}</p>
          </div>

          <!-- Gifted Info -->
          <div v-if="gift?.is_sender === false && gift?.sender_user"
            class="flex justify-between pb-[12px] border-b border-b-[#AD7084]">
            <h3 class="text-[#EBE4DF] text-[13.082px] font-[350]">{{ t('gifted_by_label') }}</h3>
            <p class="text-[#EBE4DF] text-[13px] font-[350]">{{ gift.sender_user.full_name }}</p>
          </div>
          <div v-else-if="gift?.is_sender === true && gift?.receiver_user"
            class="flex justify-between pb-[12px] border-b border-b-[#AD7084]">
            <h3 class="text-[#EBE4DF] text-[13.082px] font-[350]">{{ t('gifted_to_label') }}</h3>
            <p class="text-[#EBE4DF] text-[13px] font-[350]">{{ gift.receiver_user.full_name }}</p>
          </div>

          <div v-if="gift?.gifted_status" class="flex justify-between pb-[12px] border-b border-b-[#AD7084]">
            <h3 class="text-[#EBE4DF] text-[13.082px] font-[350]">{{ t('gift_status_label') }}</h3>
            <p class="text-[#EBE4DF] text-[13px] font-[350]">
              <span class="inline-flex items-center gap-2">
                <span class="w-2 h-2 rounded-full" :style="`background-color: ${gift.gifted_status.color}`"></span>
                {{ gift.gifted_status.label }}
              </span>
            </p>
          </div>
        </div>
      </div>

      <!-- Payment Summary -->
      <div class="mb-[30px] px-[12px]">
        <h3 class="text-[#A0576F] text-[16px] font-medium mb-[23px]">{{ t('payment_summary_title') }}</h3>

        <div class="space-y-[12px] text-[#5B605C] text-[12px] font-[350]">
          <div class="flex justify-between border-b border-b-[#B2B0B0] pb-[12px]">
            <p>{{ t('payment_subtotal_label', { count: bk.guests ?? 1 }) }}</p>
            <p><span class="sar-icon">&#xe900;</span> {{ bk?.sub_total ?? subtotal }}</p>
          </div>
          <div class="flex justify-between border-b border-b-[#B2B0B0] pb-[12px]">
            <p>{{ t('payment_vat_label') }}</p>
            <p><span class="sar-icon">&#xe900;</span> {{ bk?.tax_amount ?? vat }}</p>
          </div>
          <div class="flex justify-between border-b border-b-[#B2B0B0] pb-[12px]">
            <p>{{ t('payment_service_cost_label') }}</p>
            <p><span class="sar-icon">&#xe900;</span> {{ serviceFee }}</p>
          </div>
          <div class="flex justify-between border-b border-b-[#B2B0B0] pb-[12px]">
            <p>{{ t('payment_discount_label') }}</p>
            <p><span class="sar-icon">&#xe900;</span> {{ promoDiscount }}</p>
          </div>
          <div class="flex justify-between border-b border-b-[#B2B0B0] pb-[12px]">
            <p>{{ t('payment_redeem_points_label') }}</p>
            <p><span class="sar-icon">&#xe900;</span> {{ redeemPoints }}</p>
          </div>
        </div>

        <div class="flex justify-between mt-[28px] text-[#A0576F] text-[21px] font-bold">
          <p>{{ t('payment_total_label') }}</p>
          <p><span class="sar-icon">&#xe900;</span> {{ bk?.total ?? total }}</p>
        </div>
      </div>

      <div class="flex flex-col gap-[15px]">
        <div v-for="service in bk?.products ?? []">
          <div class="flex flex-col md:flex-row gap-[5px] mb-[10px] items-center">
            <div class="flex gap-[15px] items-center flex-4">
              <div class="flex-1">
                <img :src="service.image" />
              </div>
              <div class="flex-3">
                <h3 class="font-medium text-[15px] leading-[100%] text-[#5B605C] mb-[15px]"> {{ service.name }}</h3>
                <h4 class="font-medium text-[13px] leading-[100%] text-[#5B605C]"> {{ service.start_at }} {{
                  service.end_at }}</h4>
              </div>
            </div>

            <BaseButton @click="onSelectService(service)"
              class="mt-[15px] md:mt-0 flex-1 w-full h-[30px] bg-transparent hover:bg-transparent text-[#6B8B9B] border border-[#6B8B9B] rounded-full text-[13px] font-medium">
              {{ t('select_data_time') }}
            </BaseButton>
          </div>
        </div>
      </div>
      <!-- Actions -->
      <div class="flex flex-col space-y-3">
        <!-- Rate -->
        <BaseButton v-if="bk._originalData?.can_rate"
          class="w-full h-[50px] bg-transparent hover:bg-transparent text-[#6B8B9B] border border-[#6B8B9B] rounded-full text-[13px] font-medium"
          @click="onRate?.()">
          {{ t('button_rate_service') }}
        </BaseButton>

        <!-- View Rating -->
        <BaseButton v-if="bk._originalData?.has_rating"
          class="w-full h-[50px] bg-[#6B8B9B] hover:bg-[#6B8B9B] text-[#EBE4DF] border border-[#6B8B9B] rounded-full text-[13px] font-medium"
          @click="onViewRating?.()">
          {{ t('button_view_rating') }}
        </BaseButton>

        <!-- View Invoice (Sender only) -->
        <BaseButton v-if="showInvoice"
          class="w-full h-[50px] bg-[#A0576F] hover:bg-[#A0576F] text-[#EBE4DF] rounded-full text-[13px] font-medium"
          @click="handleInvoice">
          {{ t('button_view_invoice') }}
        </BaseButton>

        <!-- Schedule Gift (Receiver only and not completed) -->
        <BaseButton v-if="showSchedule" :loading="actionLoading" :disabled="actionLoading" :class="[
          'mt-[30px] w-full h-[50px] text-[#EBE4DF] rounded-full text-[13px] font-medium disabled:bg-[#A0576F]',
          actionLoading ? 'bg-[#a0576f69]' : 'bg-[#A0576F] hover:bg-[#A0576F]'
        ]" @click="confirmBooking">
          {{ t('gift_confirm_order') }}
        </BaseButton>

        <!-- Decline Gift (Receiver only & not completed) -->
        <BaseButton v-if="showDecline"
          class="w-full h-[50px] bg-transparent hover:bg-transparent text-[#C44E4E] border border-[#C44E4E] rounded-full text-[13px] font-medium"
          @click="openDeclineGiftConfirm()">
          {{ t('button_decline_gift') || 'Decline Gift' }}
        </BaseButton>

        <!-- Cancel: removed in both cases (sender/receiver) by design -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * GiftedOrderDetailsDialog.vue
 * - Works for both gifted_by (sender) & gifted_to (receiver)
 * - Cancel button intentionally hidden in both cases.
 */

import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/base/Button.vue'

// Stores & utils
import { useAuth } from '~/stores/auth'
import { useApp } from '~/stores/app'
import { useGiftedOrders } from '~/stores/gifted-orders'
import { COMPONENTS } from '~/data/constants'
import { useApi } from '~/composables/useApi'

// Props
const props = defineProps<{
  booking?: any,
  gifted_order_id?: number,
  order_id?: number,
  onRate?: () => void,
  onViewRating?: () => void,
  onInvoice?: () => void,
  onCancel?: () => void
}>()

const { t } = useI18n()
const authStore = useAuth()
const appStore = useApp()
const giftedStore = useGiftedOrders()
const showDecline = computed(() => isSender.value === false && !isCompleted.value)

// Local state
const actionLoading = ref(false)

// Normalized booking & gift info
const bk = computed(() => props.booking ?? null)
const gift = computed(() => bk.value?._originalData?.gifted_info ?? bk.value?.gifted_info ?? null)

const isSender = computed(() => !!gift.value?.is_sender)
const isCompleted = computed(() => !!gift.value?.is_completed)

// Payment summary
const subtotal = computed(() => (bk.value?._originalData?.sub_total ?? bk.value?._originalData?.total ?? '00.00'))
const vat = computed(() => (bk.value?._originalData?.tax_amount ?? '00.00'))
const serviceFee = computed(() => (bk.value?._originalData?.order_service_fee_price ?? '00.00'))
const promoDiscount = computed(() => (bk.value?._originalData?.promo_discount ?? '00.00'))
const redeemPoints = computed(() => (bk.value?._originalData?.redeem_points_price ?? '00.00'))
const total = computed(() => (bk.value?._originalData?.total ?? '00.00'))

// Visibility logic
const showInvoice = computed(() => {
  if (!bk.value?._originalData?.invoice_link) return false
  return isSender.value === true
})
const showSchedule = computed(() => isSender.value === false && !isCompleted.value)

// Helpers
function capitalizeFirstLetter(text?: string) {
  return typeof text == 'string' ? text.charAt(0).toUpperCase() + text.slice(1) : ''
}
function formatDate(dateString?: string) {
  if (!dateString) return ''
  const d = new Date(dateString)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const menuModule = useMenu();
const appModule = useApp();
const { setDialogComponent, setDialogShow } = useApp()

const onSelectService = function (item) {
  const productData = item;
  const serviceData = {
    ...productData,
    id: productData.id,
    product_id: productData.id,
    cart_product_id: item.cart_product_id,
    order_product_id: item.order_product_id,
    image: item.image,
    branch_id: item.branch?.id || item.branch_id,
    date: item.date || '',
    _isEditing: true
  }
  appModule.dialog.data.service = item;
  setDialogComponent(COMPONENTS.SERVICE_APPOINTMENT_SKELETON);
  setDialogShow(true);
  menuModule.setService(serviceData, () => {
    setDialogComponent(COMPONENTS.SERVICE_APPOINTMENT)
  });
}

// Actions
function handleInvoice() {
  if (props.onInvoice) return props.onInvoice()
  const link = bk.value?._originalData?.invoice_link
  if (link) window.open(link, '_blank')
}


const confirmBooking = function () {
  actionLoading.value = true

  const response = useApi(`gifted-orders/${appModule.dialog?.data?.booking?.id}/accept`, {
    method: 'POST'
  }, {
    onSuccess: (res) => {
      actionLoading.value = false
      setDialogComponent(COMPONENTS.SERVICE_APPOINTMENT);
      let locale = appModule.locale;
      appModule.locale = null;
      appModule.locale = locale;
      setDialogShow(false);

    },
    onError: (err) => {
      actionLoading.value = false


    }
  })
}

async function openScheduleDialog() {
  if (!gift.value?.id) return
  try {
    actionLoading.value = true

    // 1) Fetch gifted order details
    await giftedStore.fetchGiftedOrder(gift.value.id)
    const giftedDetails = giftedStore.giftedOrderDetails

    // 2) Resolve orderId
    const orderId =
      props.order_id ??
      giftedDetails?.order_id ??
      giftedDetails?.order?.id ??
      bk.value?._originalData?.id ??
      bk.value?.id

    if (!orderId) throw new Error('Order ID not found for scheduling')

    // 3) Resolve product ids
    let productMasterId: number | null = bk.value?.product_master_id ?? null
    let orderProductId: number | null = bk.value?.order_product_id ?? null

    if (!productMasterId || !orderProductId) {
      const { data: orderResponse } = await useApi(`orders/${orderId}`, { method: 'GET' })
      const products = orderResponse.value?.data?.products ?? []
      if (!products.length) throw new Error('No products found in order')

      // Select the first product (can be refined if needed)
      const product = products[0]
      orderProductId = product?.order_product_id ?? null
      productMasterId = product?.product_master_id ?? null
    }

    // 4) Open scheduling dialog
    appStore.setDialogComponent(COMPONENTS.SCHEDULE_GIFTED_ORDER, {
      gifted_order_id: gift.value.id,
      order_product_id: orderProductId,
      product_master_id: productMasterId
    })
    appStore.setDialogShow(true)
  } catch (e) {
    console.error('❌ Failed to open gifted schedule dialog:', e)
  } finally {
    actionLoading.value = false
  }
}

// Open a confirm dialog before declining a gifted order
function openDeclineGiftConfirm() {
  if (!showDecline.value) return;

  appStore.setDialogComponent(COMPONENTS.CONFIRM_DIALOG, {
    // i18n text
    dialogTitle: t('gift_decline_title'),
    message: t('gift_decline_message'),
    confirmText: t('gift_decline_confirm'),
    cancelText: t('gift_decline_cancel'),

    modalMaxWidth: 'max-w-[356px]',

    // Buttons style
    confirmButtonClass: 'h-[49px] bg-[#C44E4E] hover:bg-[#913E5D] text-white rounded-[100px] text-[16px]',
    cancelButtonClass: 'h-[49px] bg-[#6B8B9B] text-white hover:bg-[#5a7886] rounded-[100px] text-[16px]',

    onConfirm: () => confirmDeclineGift()
  });

  appStore.setDialogShow(true);
}

// Actually decline (cancel) the gifted order as receiver
async function confirmDeclineGift() {
  try {
    actionLoading.value = true;

    // Resolve order id (prefer prop -> booking original -> fallback)
    const orderId =
      props.order_id ??
      bk.value?._originalData?.id ??
      bk.value?.id;

    if (!orderId) throw new Error('Order ID not found');

    // Resolve current user id
    const userId = authStore.getUser?.id || authStore.getUserId || authStore.user?.id;
    if (!userId) throw new Error('User ID not found');

    // Call cancel endpoint (GET) with user_id as query
    const { data: response } = await useApi(`orders/${orderId}/cancel`, {
      method: 'GET',
      params: { user_id: userId }
    });

    // Handle success (backend shapes may vary)
    const ok = response.value?.success ?? response.value?.status === true ?? true;

    if (ok) {
      // Close confirm + details dialogs
      appStore.setDialogShow(false);

      // (Optional) You can refresh bookings outside this dialog
      // e.g., emit an event or trigger a store fetch at parent level
      // bookingsStore.fetchOrders()
    } else {
      console.error('Decline gift failed:', response.value);
    }
  } catch (err) {
    console.error('❌ Error declining gift:', err);
  } finally {
    actionLoading.value = false;
  }
}

</script>
