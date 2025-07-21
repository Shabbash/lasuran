<template>
  <div class="bg-decore-modal mx-auto rounded-[30px] overflow-hidden shadow-lg bg-[#EBE4DF] text-[#5F2C3E]">
    <div class="relative z-[1] pt-[42px] px-[80px] pb-[20px]">
      <h2 class="text-center text-[23px] font-bold text-[#A0576F] mb-[40px]">{{ t('book_services') }}</h2>

      <div class="mb-[12px]">
        <h3 class="text-[17px] text-[#A0576F] mb-[12px]">{{ t('select_date') }}</h3>
        <UCalendar v-model="selectedDate" :is-date-unavailable="isDateUnavailable" />
      </div>

      <div>
        <h3 class="text-[17px] text-[#A0576F] mb-[12px]">{{ t('available_time') }}</h3>
        <SelectableSlider
          v-model="form.time"
          :items="selectedDateObject?.slots ?? []"
          value-key="from"
          label-key="from"
        />
      </div>

      <BaseButton
        @click="addToCart"
        class="flex items-center gap-[10px] w-full text-white py-3 rounded-full font-[400] text-[16px] justify-center mt-[35px] transition bg-[#A0576F] hover:bg-[#913E5D]">
        <PriceIcon />
        <span>{{ t('continue') }}</span>
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { CalendarDate, type DateValue } from '@internationalized/date'
import { useToast } from '#imports'
import { useApp } from '~/stores/app'
import { useMenu } from '~/stores/menu'
import { useGiftedOrders } from '~/stores/gifted-orders'
import { useApi } from '~/composables/useApi'
import SelectableSlider from '~/components/base/SelectableSlider.vue'
import BaseButton from '~/components/base/Button.vue'
import PriceIcon from '@/components/icons/PriceIcon.vue'
import { COMPONENTS } from '~/data/constants'


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

const form = ref({ date: null, time: null })
const product_master_id = ref<number | null>(null)
const order_product_id = ref<number | null>(null)
const availableDates = computed(() => menuModule.getService?.times ?? [])

const selectedDateObject = computed(() =>
  availableDates.value.find((el: any) => el.date == form.value.date)
)

const isDateUnavailable = (date: DateValue) => {
  const formatted = `${date.year}-${date.month.toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`
  return !availableDates.value.find((el: any) => el.date == formatted)?.slots
}

const selectedDate = computed({
  get() {
    const date = form.value.date ?? availableDates.value?.[0]?.date
    if (!date) return null
    const convertedDate = new Date(date)
    return new CalendarDate(
      convertedDate.getFullYear(),
      convertedDate.getMonth() + 1,
      convertedDate.getDate()
    )
  },
  set(date: any) {
    form.value.date = date ? `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}` : null
  }
})

const getCurrentTime = () => selectedDateObject.value?.slots?.find((el: any) => el.from == form.value.time)

const addToCart = () => {
  const time = getCurrentTime()
  if (!time || !order_product_id.value) {
    console.error('Missing required data:', {
      time,
      order_product_id: order_product_id.value,
      product_master_id: product_master_id.value
    })
    toast.add({ title: t('select_time_warning'), color: 'error' })
    return
  }

  const requestBody = {
    order_product_id: order_product_id.value,
    start_at: time.from_date_time,
    end_at: time.to_date_time
  }

  console.log('Scheduling gifted order:', {
    gifted_order_id: props.gifted_order_id,  // Used in URL: gifted-orders/{gifted_order_id}/schedule
    requestBody,                             // Contains order_product_id from order details API
    endpoint: `gifted-orders/${props.gifted_order_id}/schedule`
  })

  // API: POST gifted-orders/{gifted_order_id}/schedule
  // Body: { order_product_id: from order details API, start_at, end_at }
  useApi(`gifted-orders/${props.gifted_order_id}/schedule`, {
    method: 'POST',
    body: requestBody
  }, {
    onSuccess: (data) => {
      console.log('Schedule success:', data)
      appStore.setDialogComponent(COMPONENTS.SERVICE_SUCCESS)
      appStore.setDialogShow(true)
    },
    onError: (err) => {
      console.error('Schedule error:', err)
      toast.add({ title: t('something_went_wrong'), description: err?.message || '', color: 'error' })
    }
  })
}

onMounted(async () => {
  console.log('ScheduleGiftedOrder mounted with props:', {
    gifted_order_id: props.gifted_order_id
  })

  try {
    // First fetch the gifted order details
    await giftedOrdersStore.fetchGiftedOrder(props.gifted_order_id)
    const giftedDetails = giftedOrdersStore.giftedOrderDetails
    console.log('Gifted order details:', giftedDetails)

    // Check different possible fields for order_id
    const orderId = giftedDetails?.order_id || giftedDetails?.id || giftedDetails?.order?.id
    console.log('Order ID candidates:', {
      'giftedDetails.order_id': giftedDetails?.order_id,
      'giftedDetails.id': giftedDetails?.id,
      'giftedDetails.order?.id': giftedDetails?.order?.id,
      'selected orderId': orderId
    })

    if (!orderId) {
      console.error('No order ID found in gifted details:', giftedDetails)
      throw new Error('Order ID not found in gifted order details')
    }

    // Fetch the actual order details using the order_id
    const { data: orderResponse } = await useApi(`orders/${orderId}`, {
      method: 'GET'
    })

    console.log('Order details from API:', orderResponse.value)

    if (orderResponse.value?.status && orderResponse.value?.data?.products?.length > 0) {
      const product = orderResponse.value.data.products[0]

      // The order_product_id should come from the order details API
      order_product_id.value = product?.id  // This is the order_product_id from order details
      product_master_id.value = product?.product_master_id

      console.log('Product details from order API:', {
        product: product,
        order_product_id: order_product_id.value,  // This will be sent to schedule API
        product_master_id: product_master_id.value,
        gifted_order_id: props.gifted_order_id     // This is used in the URL
      })

      if (product_master_id.value) {
        await menuModule.fetchServiceAvailableTimes(product_master_id.value)
        form.value.date = availableDates.value?.[0]?.date ?? null
      }
    } else {
      throw new Error('Product details not found in order')
    }
  } catch (e) {
    console.error('Error in onMounted:', e)
    toast.add({ title: t('something_went_wrong'), color: 'error' })
  }
})
</script>
