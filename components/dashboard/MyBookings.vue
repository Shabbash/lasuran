<template>
  <div>
    <!-- Page Header -->
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-[20px] pb-7 mb-7 border-b border-[#AD7084]">
      <h1 class="text-lg font-medium text-[#EBE4DF]">{{ $t('my_bookings_title') }}</h1>
      <BaseButton :label="$t('book_a_service')" @click="navigateTo('/services')"
        class="px-6 py-1.5 bg-[#6B8B9B] hover:bg-[#6B8B9B] hover:opacity-[.9] text-white rounded-full text-sm font-medium transition-colors max-w-[175px]" />
    </div>

    <!-- Booking List or Skeleton -->
    <BookingSkeleton v-if="isLoading" />

    <div v-else-if="filteredBookings.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="booking in filteredBookings" :key="booking.id"
        class="py-[14px] px-[20px] h-full flex flex-col border border-[#AD7084] border-solid rounded-[20px] text-white relative cursor-pointer"
        @click="openBookingDetails(booking)">
        <div class="flex justify-between items-start mb-3">
          <!-- Booking Number with Gift Icon if applicable -->
          <h3 class="text-[#EBE4DF] text-[18px] font-bold flex items-center gap-2">
            {{ $t('booking_no_label') }} {{ booking.bookingNumber }}
          </h3>

          <!-- Booking Status -->
          <span :class="` text-center inline-flex px-3 py-1 rounded-full text-xs font-medium text-white`"
            :style="`background-color: ${booking._originalData?.status?.color || '#6B8B9B'}`">
            {{ booking._originalData?.status_text || capitalizeFirstLetter(booking.status) }}
          </span>
        </div>

        <div class="space-y-2">
          <!-- Guests -->
          <div v-if="Number(booking.guests) > 0" class="flex items-center text-sm text-[#EBE4DF] gap-[6px]">
            <GuestsIcon />
            <span class="text-[#C6C6C7] text-[15px]">
              {{ $t('booking_visitors_label', { count: booking.guests }) }}
            </span>
          </div>
          <!-- Branch -->
          <div v-if="booking.branch" class="flex items-center text-sm text-[#EBE4DF] gap-[6px]">
            <LocationIcon />
            <span class="text-[#C6C6C7] text-[15px]">
              {{ $t('booking_branch_label') }}: {{ booking.branch }}
            </span>
          </div>


          <!-- Date -->
          <div v-if="booking.date" class="flex items-center text-sm text-[#EBE4DF] gap-[6px]">
            <CalendarIcon2 />
            <span class="text-[#C6C6C7] text-[15px]">{{ booking.date }}</span>
          </div>

          <!-- Time -->
          <div v-if="booking.time" class="flex items-center text-sm text-[#EBE4DF] gap-[6px]">
            <ClockIcon />
            <span class="text-[#C6C6C7] text-[15px]">{{ booking.time }}</span>
          </div>

          <!-- Gifted Info (if receiver) -->
          <div v-if="booking.gifted_info && booking.gifted_info.is_sender === false && booking.gifted_info.sender_user"
            class="flex items-center text-sm text-[#EBE4DF] gap-[6px]">
            <GiftIcon />
            <span class="text-[#C6C6C7] text-[15px]">
              {{ $t('gifted_by_label') }} {{ booking.gifted_info.sender_user.full_name }}
            </span>
          </div>
        </div>


      </div>
    </div>

    <!-- Empty State -->
    <div v-if="showEmptyState" class="flex flex-col items-center justify-center py-16 w-[50%] mx-auto">
      <div class="relative w-28 h-28 mb-6">
        <img src="/assets/img/noBooking.png" :alt="$t('no_bookings_alt')" />
      </div>
      <h2 class="text-xl font-bold text-[#EBE4DF] mb-1">{{ $t('no_appointments_title') }}</h2>
      <p class="text-[#C6C6C7] text-center mb-6 font-light">{{ $t('no_appointments_text') }}</p>
      <BaseButton @click="goToServices"
        class="px-8 py-3 bg-[#EBE4DF] rounded-full w-full text-[#A0576F] text-sm font-medium shadow-sm hover:bg-[#EBE4DF]">
        {{ $t('book_service_button') }}
      </BaseButton>
    </div>

    <!-- Dialog for Rating, Canceling, etc... -->
    <Dialog v-model:open="ratingModalOpen" :modalMaxWidth="'max-w-[608px]'">
      <template #body>
        <div
          class="bg-decore-modal mx-auto rounded-[30px] overflow-hidden shadow-lg text-[#5F2C3E] pt-[24px] pb-[45px] px-[100px]">
          <div class="relative">
            <h3 class="text-[#A0576F] text-center text-[22px] font-bold leading-normal mb-[30px]">{{ $t('rating_title')
            }}</h3>
            <!-- Service Quality Rating -->
            <div class="bg-[#A0576F] text-white rounded-[23px] py-[23px] px-[32px] space-y-[12px] mb-[19px]">
              <p class="text-[#EBE4DF] text-[17px] font-normal leading-normal">{{ $t('rating_service_quality') }}</p>
              <StarRating v-model="rating.serviceQuality" :editable="!isRatingReadOnly" />
            </div>
            <!-- Atmosphere Rating -->
            <div class="bg-[#A0576F] text-white rounded-[23px] py-[23px] px-[32px] space-y-[12px] mb-[25px]">
              <p class="text-[#EBE4DF] text-[17px] font-normal leading-normal">{{ $t('rating_atmosphere') }}</p>
              <StarRating v-model="rating.atmosphere" :editable="!isRatingReadOnly" />
            </div>
            <!-- Comment Input -->
            <textarea v-model="rating.comment" :readonly="isRatingReadOnly"
              :placeholder="$t('rating_comment_placeholder')"
              class="w-full h-[170px] p-4 rounded-[23px] border border-[#A0576F] placeholder:text-[#A0576F] text-sm bg-transparent resize-none"
              rows="3" />
            <!-- Submit Button -->
            <button v-if="!isRatingReadOnly" @click="submitRating"
              class="w-full bg-[#A0576F] text-white py-3 rounded-full font-medium hover:opacity-90 transition mt-[35px]">
              {{ $t('submit_rating') }}
            </button>
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useBookings } from '@/stores/bookings';
import { useAuth } from '@/stores/auth';
import { useApp } from '@/stores/app';
import { COMPONENTS } from '~/data/constants';
import BookingSkeleton from '@/components/skeletons/BookingSkeleton.vue';
import ConfirmDialog from '@/components/base/ConfirmDialog.vue';
import BaseButton from '@/components/base/Button.vue';
import GuestsIcon from '@/components/icons/GuestsIcon.vue';
import CalendarIcon2 from '@/components/icons/CalendarIcon2.vue';
import LocationIcon from '@/components/icons/LocationIcon.vue';
import ClockIcon from '@/components/icons/ClockIcon.vue';
import GiftIcon from '@/components/icons/GiftIcon.vue';


const { t } = useI18n()
const router = useRouter()
const authStore = useAuth()
const bookingsStore = useBookings()
const { setDialogComponent, setDialogShow } = useApp()

const ratingModalOpen = ref(false)
const isRatingReadOnly = ref(false)
const rating = ref({ serviceQuality: 3, atmosphere: 0, comment: '' })

const activeFilter = ref('all')
const selectedBooking = ref(null)
const modalOpen = ref(false)
const bookingToDelete = ref(null)

const showEmptyState = computed(() => !isLoading.value && filteredBookings.value.length === 0)
const isLoading = computed(() => bookingsStore.isLoading)

const bookings = computed(() => {
  return bookingsStore.orders.map(order => ({
    id: order.id,
    bookingNumber: order.order_number,
    status: mapApiStatusToUIStatus(order.status.value),
    guests: order.number_of_users > 0 ? order.number_of_users : null,
    branch: order.branch_name || null,
    date: order.date ? formatDate(order.date) : null,
    time: order.time || null,
    rating_status: !order.can_rate,
    _originalData: order,
    is_gifted_order: order.is_gifted_order === 1,
    is_gift_pending: order.is_gifted_order === 1 && order.status.value === 1 && !order.is_scheduled,
    gifted_order_id: order.gifted_order_id,
    order_product_id: order.order_product_id,
    product_master_id: order.product_master_id,
    gifted_info: order.gifted_info
  }))
})


const filteredBookings = computed(() => {
  if (activeFilter.value === 'all') return bookings.value
  return bookings.value.filter(booking => {
    const isPendingGiftedOrder = booking.gifted_info && !booking.gifted_info.is_completed
    return isPendingGiftedOrder || booking.status === activeFilter.value
  })
})

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

function mapApiStatusToUIStatus(apiStatus) {
  const statusMap = {
    1: 'active',
    2: 'served',
    3: 'cancelled'
  }
  return statusMap[apiStatus] || 'active'
}

function handleViewRating() {
  rating.value = {
    serviceQuality: selectedBooking.value.serviceQuality ?? 4,
    atmosphere: selectedBooking.value.atmosphere ?? 3,
    comment: selectedBooking.value.comment ?? 'Service was great!'
  }
  isRatingReadOnly.value = true
  ratingModalOpen.value = true
}

function handleRateService() {
  isRatingReadOnly.value = false
  ratingModalOpen.value = true
  modalOpen.value = false
}

function handleMakeService() {
  if (selectedBooking.value?._originalData?.invoice_link) {
    window.open(selectedBooking.value._originalData.invoice_link, '_blank')
  } else {
    console.log('No invoice available for booking:', selectedBooking.value.id)
  }
  modalOpen.value = false
}

function goToServices() {
  router.push('/services')
}

function openCancelBookingConfirm() {
  setDialogComponent(COMPONENTS.CONFIRM_DIALOG, {
    dialogTitle: 'Cancel Reservation',
    message: 'Are you sure you want to cancel your reservation?',
    confirmText: 'Yes, Cancel',
    cancelText: 'No, Keep',
    modalMaxWidth: 'max-w-[356px]',
    loading: bookingsStore.isLoading,
    confirmButtonClass: 'h-[49px] bg-[#C44E4E] hover:bg-[#913E5D] text-white rounded-[100px] text-[16px]',
    cancelButtonClass: 'h-[49px] bg-[#6B8B9B] text-white hover:bg-[#5a7886] rounded-[100px] text-[16px]',
    onConfirm: () => confirmDeleteBooking()
  })
  setDialogShow(true)
  modalOpen.value = false
}

async function confirmDeleteBooking() {
  if (!selectedBooking.value) return
  try {
    const result = await bookingsStore.cancelOrder(selectedBooking.value.id)
    if (result.success) {
      setDialogShow(false)
      selectedBooking.value = null
    } else {
      console.error('Failed to cancel order:', result.error)
    }
  } catch (error) {
    console.error('Error cancelling order:', error)
  }
}

function openBookingDetails(booking) {
  selectedBooking.value = booking
  setDialogComponent(COMPONENTS.BOOKING_SHOW, {
    booking,
    onRate: () => handleRateService(),
    onViewRating: () => handleViewRating(),
    onInvoice: () => handleMakeService(),
    onCancel: () => openCancelBookingConfirm()
  })
  setDialogShow(true)
}

onMounted(async () => {
  if (!authStore.getToken) {
    await authStore.initAuth()
  }
  if (authStore.getToken) {
    bookingsStore.fetchOrders()
  }
})
</script>
