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
    toast.add({ title: t('select_time_warning'), color: 'error' })
    return
  }

  useApi(`/gifted-orders/${props.gifted_order_id}/schedule`, {
    method: 'POST',
    body: {
      order_product_id: order_product_id.value,
      start_at: time.from_date_time,
      end_at: time.to_date_time
    }
  }, {
    onSuccess: () => {
      appStore.setDialogComponent(COMPONENTS.SERVICE_SUCCESS)
      appStore.setDialogShow(true)
    },
    onError: (err) => {
      toast.add({ title: t('something_went_wrong'), description: err?.response?._data?.message || '', color: 'error' })
    }
  })
}

onMounted(async () => {
  try {
    await giftedOrdersStore.fetchGiftedOrder(props.gifted_order_id)
    const product = giftedOrdersStore.giftedOrderDetails?.order_product
    console.log(giftedOrdersStore.giftedOrderDetails)
    order_product_id.value = product?.id
    alert(props.gifted_order_id)
    product_master_id.value = product?.product_master_id

    if (product_master_id.value) {
      await menuModule.fetchServiceAvailableTimes(product_master_id.value)
      form.value.date = availableDates.value?.[0]?.date ?? null
    }
  } catch (e) {
    toast.add({ title: t('something_went_wrong'), color: 'error' })
  }
})
</script>
