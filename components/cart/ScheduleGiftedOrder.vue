<template>
  <div class="bg-decore-modal mx-auto rounded-[30px] overflow-hidden shadow-lg bg-[#EBE4DF] text-[#5F2C3E]">
    <!-- Main content (only when initial data is ready) -->
    <div v-if="!initialLoading" class="relative z-[1] pt-[42px] px-[80px] pb-[20px]">
      <h2 class="text-center text-[23px] font-bold text-[#A0576F] mb-[40px]">
        {{ t('book_services') }}
      </h2>

      <!-- Date -->
      <div class="mb-[12px]">
        <h3 class="text-[17px] text-[#A0576F] mb-[12px]">{{ t('select_date') }}</h3>
        <UCalendar
          v-model="selectedDate"
          :is-date-unavailable="isDateUnavailable"
          :locale="'ar-EG'"
        />
      </div>

      <!-- Time slots -->
      <div>
        <h3 class="text-[17px] text-[#A0576F] mb-[12px]">{{ t('available_time') }}</h3>
        <SelectableSlider
          v-model="form.time"
          :items="selectedDateObject?.slots ?? []"
          value-key="from"
          label-key="from"
        />
      </div>

      <!-- Confirm -->
      <BaseButton
        :loading="actionLoading"
        :disabled="actionLoading || !form.date || !form.time || !order_product_id || !actual_order_id"
        @click="confirmSchedule"
        :class="[
          'flex items-center gap-[10px] w-full text-white py-3 rounded-full font-[400] text-[16px] justify-center mt-[35px] transition disabled:bg-[#A0576F] ',
          actionLoading ? 'bg-[#a0576f69]' : 'bg-[#A0576F] hover:bg-[#913E5D]',
          (!form.date || !form.time || !order_product_id || !actual_order_id) ? 'disabled:bg-[#A0576F] disabled:opacity-60' : ''
        ]"
      >
        <PriceIcon />
        <span>{{ actionLoading ? (t('saving') || 'Saving...') : (t('confirm') || 'Confirm') }}</span>
      </BaseButton>
    </div>

    <!-- Skeleton while initial data loads -->
    <div class="relative z-[1] pt-[42px] px-[80px] pb-[20px]" v-else>
      <div class="h-[28px] w-1/3 bg-[#E6CDC7A3] rounded mb-[40px] animate-pulse"></div>
      <div class="h-[20px] w-1/4 bg-[#E6CDC7A3] rounded mb-[12px] animate-pulse"></div>
      <div class="h-[250px] w-full bg-[#E6CDC7A3] rounded-[16px] animate-pulse mb-[24px]"></div>
      <div class="h-[20px] w-1/4 bg-[#E6CDC7A3] rounded mb-[12px] animate-pulse"></div>
      <div class="flex flex-wrap gap-[12px]">
        <div v-for="n in 4" :key="n" class="w-[100px] h-[40px] bg-[#E6CDC7A3] rounded-full animate-pulse"></div>
      </div>
      <div class="w-full h-[48px] bg-[#E6CDC7A3] rounded-full mt-[35px] animate-pulse"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * ScheduleGiftedOrder.vue
 * - Schedules a gifted order (receiver flow).
 * - Does NOT navigate to cart; just schedules and closes the dialog.
 * - Shows initial skeleton while fetching gifted + order + slots.
 * - Uses same loading style as "Add to cart" button (dim background + spinner).
 */

import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { CalendarDate, type DateValue } from '@internationalized/date'
import { useToast } from '#imports'

// Stores & helpers
import { useApp } from '~/stores/app'
import { useMenu } from '~/stores/menu'
import { useGiftedOrders } from '~/stores/gifted-orders'
import { useBookings } from '~/stores/bookings'
import { useApi } from '~/composables/useApi'
import { COMPONENTS } from '~/data/constants'

// UI
import SelectableSlider from '~/components/base/SelectableSlider.vue'
import BaseButton from '~/components/base/Button.vue'
import PriceIcon from '@/components/icons/PriceIcon.vue'

// Props
const props = defineProps({
  gifted_order_id: {
    type: Number,
    required: true
  }
})

const { t } = useI18n()
const toast = useToast()
const appStore = useApp()
const menuModule = useMenu()
const giftedOrdersStore = useGiftedOrders()
const bookingsStore = useBookings()

// UI/loading states
const initialLoading = ref(true)   // controls the skeleton
const actionLoading = ref(false)   // controls the button spinner/dimming

// Form state
const form = ref<{ date: string | null; time: string | null }>({ date: null, time: null })

// IDs resolved from APIs
const product_master_id = ref<number | null>(null)
const order_product_id = ref<number | null>(null)
const actual_order_id = ref<number | null>(null)
// Holds VIP-related service fee IDs for the current product
const feeIdsForThisProduct = ref<number[]>([])

// Available dates (after fetchServiceAvailableTimes)
const availableDates = computed<any[]>(() => menuModule.getService?.times ?? [])

// Selected date object (contains slots)
const selectedDateObject = computed(() =>
  availableDates.value.find((el: any) => el.date === form.value.date)
)

// Disable calendar days that don't have slots
const isDateUnavailable = (date: DateValue) => {
  const formatted = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`
  const day = availableDates.value.find((el: any) => el.date === formatted)
  return !(day && Array.isArray(day.slots) && day.slots.length > 0)
}

// Bind UCalendar to form.date
const selectedDate = computed({
  get() {
    const date = form.value.date ?? availableDates.value?.[0]?.date
    if (!date) return null
    const d = new Date(date)
    return new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate())
  },
  set(date: any) {
    form.value.date = date
      ? `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`
      : null
    // Reset time when date changes
    form.value.time = null
  }
})

// Get the full slot object by the currently selected time value
const getCurrentTime = () =>
  selectedDateObject.value?.slots?.find((el: any) => el.from === form.value.time)

// Confirm schedule — NO cart navigation
const confirmSchedule = async () => {
  const time = getCurrentTime()
  if (!time || !order_product_id.value || !actual_order_id.value) {
    console.error('Missing data:', {
      time,
      order_product_id: order_product_id.value,
      product_master_id: product_master_id.value,
      actual_order_id: actual_order_id.value
    })
    toast.add({ title: t('select_time_warning'), color: 'error' })
    return
  }

  const requestBody = {
    order_product_id: order_product_id.value,
    start_at: time.from_date_time,
    end_at: time.to_date_time
  }

  try {
    actionLoading.value = true

    // POST gifted-orders/{order_id}/schedule  (using actual order ID)
    await useApi(
      `gifted-orders/${actual_order_id.value}/schedule`,
      { method: 'POST', body: requestBody },
      {
        onSuccess: async () => {
          // Show success, close dialog, refresh bookings
          toast.add({ title: t('success'), description: t('scheduled_successfully'), color: 'success' })
          appStore.setDialogShow(false)
          try { await bookingsStore.fetchOrders() } catch { /* no-op */ }
        },
        onError: (err: any) => {
          console.error('Schedule error:', err)
          toast.add({ title: t('something_went_wrong'), description: err?.message || '', color: 'error' })
        }
      }
    )
  } finally {
    actionLoading.value = false
  }
}

// Initial load: fetch gifted details -> order details -> service slots
// Initial load: fetch gifted details -> order details -> service slots
onMounted(async () => {
  try {
    // 1) Fetch gifted order details
    await giftedOrdersStore.fetchGiftedOrder(props.gifted_order_id)
    const giftedDetails = giftedOrdersStore.giftedOrderDetails

    // 2) Resolve the real order ID
    const orderId = giftedDetails?.order_id || giftedDetails?.id || giftedDetails?.order?.id
    if (!orderId) throw new Error('Order ID not found in gifted order details')
    actual_order_id.value = orderId

    // 3) Fetch order products to get order_product_id and product_master_id
    const { data: orderResponse } = await useApi(`orders/${orderId}`, { method: 'GET' })
    const products = orderResponse.value?.data?.products ?? []
    if (!products.length) throw new Error('Product details not found in order')

    // For now, pick the first product (you can refine selection later)
    const product = products[0]
    order_product_id.value = product?.order_product_id
    product_master_id.value = product?.product_master_id

    // 🔽 NEW: extract VIP service fee IDs for this product
    const serviceFees = orderResponse.value?.data?.service_fees ?? []
    feeIdsForThisProduct.value = serviceFees
      .filter((fee: any) => Array.isArray(fee.products))
      .filter((fee: any) =>
        fee.products?.some((p: any) =>
          p?.product_master_id === product_master_id.value ||
          p?.product_id === order_product_id.value
        )
      )
      .map((fee: any) => Number(fee.id))
      .filter(Boolean)

    // 4) Fetch service available times for the product (+ pass VIP fee IDs)
    if (product_master_id.value) {
      await menuModule.fetchServiceAvailableTimes(product_master_id.value, {
        feeIds: feeIdsForThisProduct.value.length ? feeIdsForThisProduct.value : null
      })
      // Auto-select the first day if available
      form.value.date = availableDates.value?.[0]?.date ?? null
      form.value.time = null
    }
  } catch (e) {
    console.error('Error in onMounted:', e)
    toast.add({ title: t('something_went_wrong'), color: 'error' })
  } finally {
    initialLoading.value = false
  }
})

</script>
