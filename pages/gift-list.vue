<template>
  <Container>
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A0576F]"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex justify-center items-center py-20">
      <div class="text-red-500 text-lg">{{ error }}</div>
    </div>

    <!-- Gift List Content -->
    <div v-else>
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-4">
          <button @click="goBack" class="text-[#EBE4DF] hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-[#EBE4DF] text-[24px] font-bold">{{ $t('gift_list_title') }}</h1>
        </div>
        <div class="text-[#C6C6C7] text-sm">
          {{ giftItems.length }} {{ $t('items') }}
        </div>
      </div>

      <!-- Gift Items List -->
      <div v-if="giftItems.length > 0" class="space-y-4">
        <div v-for="item in giftItems" :key="item.id" 
             class="bg-[#A0576F1A] rounded-[20px] p-6 border border-[#AD7084]">
          
          <!-- Gift Item Header -->
          <div class="flex justify-between items-start mb-4">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-[10px] overflow-hidden bg-[#EBE4DF] flex items-center justify-center">
                <img v-if="item.image" :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
                <GiftIcon v-else class="w-8 h-8 text-[#A0576F]" />
              </div>
              <div>
                <h3 class="text-[#EBE4DF] text-[18px] font-bold">{{ item.name }}</h3>
                <div class="space-y-1">
                  <p v-if="item.sender_name" class="text-[#C6C6C7] text-sm">
                    {{ $t('gift_from') }}: {{ item.sender_name }}
                  </p>
                  <p v-if="item.receiver_name" class="text-[#C6C6C7] text-sm">
                    {{ $t('gift_to') }}: {{ item.receiver_name }}
                  </p>
                </div>
              </div>
            </div>
            <div class="text-right">
              <p class="text-[#EBE4DF] text-[16px] font-bold">{{ item.price }} {{ $t('currency') }}</p>
              <span class="inline-flex px-3 py-1 rounded-full text-xs font-medium text-white"
                    :style="`background-color: ${item.status_color}`">
                {{ item.status }}
              </span>
            </div>
          </div>

          <!-- Gift Details -->
          <div class="space-y-3 mb-4">
            <div v-if="item.message" class="bg-[#EBE4DF] rounded-[10px] p-3">
              <p class="text-[#5F2C3E] text-sm italic">"{{ item.message }}"</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div v-if="item.date" class="flex items-center gap-2 text-[#C6C6C7]">
                <CalendarIcon2 class="w-4 h-4" />
                <span>{{ formatDate(item.date) }}</span>
              </div>
              <div v-if="item.time" class="flex items-center gap-2 text-[#C6C6C7]">
                <ClockIcon class="w-4 h-4" />
                <span>{{ item.time }}</span>
              </div>
              <div v-if="item.branch" class="flex items-center gap-2 text-[#C6C6C7]">
                <LocationIcon class="w-4 h-4" />
                <span>{{ item.branch }}</span>
              </div>
              <div v-if="item.order_number" class="flex items-center gap-2 text-[#C6C6C7]">
                <span class="font-medium">{{ $t('order_number') }}:</span>
                <span>{{ item.order_number }}</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 pt-4 border-t border-[#AD7084]">
            <!-- Schedule Gift Button (for pending gifts) -->
            <button v-if="item.status === 'Pending' && !item.is_completed"
                    @click="scheduleGift(item)"
                    class="flex-1 bg-[#A0576F] hover:bg-[#913E5D] text-white py-3 px-4 rounded-[100px] text-sm font-medium transition-colors">
              {{ $t('schedule_gift') }}
            </button>

            <!-- Reschedule Button (for scheduled gifts) -->
            <button v-if="(item.status === 'Scheduled' || item.status === 'Confirmed') && !item.is_completed"
                    @click="rescheduleGift(item)"
                    class="flex-1 bg-[#6B8B9B] hover:bg-[#5A7A8A] text-white py-3 px-4 rounded-[100px] text-sm font-medium transition-colors">
              {{ $t('reschedule') }}
            </button>

            <!-- Accept Gift Button (for receivers) -->
            <button v-if="!item.is_sender && item.status === 'Pending'"
                    @click="acceptGift(item)"
                    class="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-[100px] text-sm font-medium transition-colors">
              {{ $t('button_accept_gift') }}
            </button>

            <!-- View Details Button -->
            <button @click="viewGiftDetails(item)"
                    class="flex-1 border border-[#EBE4DF] text-[#EBE4DF] hover:bg-[#EBE4DF] hover:text-[#A0576F] py-3 px-4 rounded-[100px] text-sm font-medium transition-colors">
              {{ $t('view_details') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20">
        <GiftIcon class="w-16 h-16 text-[#AD7084] mx-auto mb-4" />
        <h3 class="text-[#EBE4DF] text-xl font-bold mb-2">{{ $t('no_gifts_title') }}</h3>
        <p class="text-[#C6C6C7] mb-6">{{ $t('no_gifts_description') }}</p>
        <button @click="goToServices" 
                class="bg-[#A0576F] hover:bg-[#913E5D] text-white py-3 px-6 rounded-[100px] font-medium transition-colors">
          {{ $t('browse_services') }}
        </button>
      </div>
    </div>
  </Container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import Container from '@/components/base/Container.vue'
import GiftIcon from '@/components/icons/GiftIcon.vue'
import CalendarIcon2 from '@/components/icons/CalendarIcon2.vue'
import ClockIcon from '@/components/icons/ClockIcon.vue'
import LocationIcon from '@/components/icons/LocationIcon.vue'
import { useApi } from '@/composables/useApi'
import { useApp } from '@/stores/app'
import { COMPONENTS } from '@/data/constants'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const appStore = useApp()

// State
const isLoading = ref(true)
const error = ref(null)
const giftItems = ref([])

// Get booking ID from route params
const bookingId = computed(() => route.params.id || route.query.booking_id)

// Fetch gift items for the booking
const fetchGiftItems = async () => {
  try {
    isLoading.value = true
    error.value = null

    // Fetch the specific booking details
    const { data: response } = await useApi(`orders/${bookingId.value}`, {
      method: 'GET'
    })

    if (response.value?.status && response.value?.data) {
      const booking = response.value.data
      
      // Extract gift items from the booking
      if (booking.gifted_info && Array.isArray(booking.gifted_info)) {
        giftItems.value = booking.gifted_info.map((gift: any) => ({
          id: gift.id,
          name: gift.service_name || gift.product_name || booking.service_name || 'Gift Service',
          sender_name: gift.sender_user?.full_name || 'Unknown Sender',
          receiver_name: gift.receiver_user?.full_name || 'Unknown Receiver',
          message: gift.message || '',
          price: gift.price || booking.total || 0,
          status: gift.gifted_status?.label || gift.status || 'pending',
          status_color: gift.gifted_status?.color || '#FFB300',
          is_sender: gift.is_sender || false,
          is_completed: gift.is_completed || false,
          date: gift.scheduled_date || booking.date,
          time: gift.scheduled_time || booking.time,
          branch: booking.branch_name,
          order_number: booking.order_number,
          image: gift.image || booking.service_image,
          gifted_order_id: gift.id,
          order_product_id: booking.products?.[0]?.id,
          product_master_id: booking.products?.[0]?.product_master_id
        }))
      } else if (booking.gifted_info) {
        // Single gift item
        giftItems.value = [{
          id: booking.gifted_info.id,
          name: booking.service_name || booking.product_name || 'Gift Service',
          sender_name: booking.gifted_info.sender_user?.full_name || 'Unknown Sender',
          receiver_name: booking.gifted_info.receiver_user?.full_name || 'Unknown Receiver',
          message: booking.gifted_info.message || '',
          price: booking.total || 0,
          status: booking.gifted_info.gifted_status?.label || booking.gifted_info.status || 'pending',
          status_color: booking.gifted_info.gifted_status?.color || '#FFB300',
          is_sender: booking.gifted_info.is_sender || false,
          is_completed: booking.gifted_info.is_completed || false,
          date: booking.date,
          time: booking.time,
          branch: booking.branch_name,
          order_number: booking.order_number,
          image: booking.service_image,
          gifted_order_id: booking.gifted_info.id,
          order_product_id: booking.products?.[0]?.id,
          product_master_id: booking.products?.[0]?.product_master_id
        }]
      }
    }
  } catch (err) {
    console.error('Error fetching gift items:', err)
    error.value = t('error_loading_gifts')
  } finally {
    isLoading.value = false
  }
}

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const getStatusClass = (status) => {
  switch (status) {
    case 'pending': return 'bg-yellow-500 text-white'
    case 'scheduled': return 'bg-blue-500 text-white'
    case 'completed': return 'bg-green-500 text-white'
    case 'cancelled': return 'bg-red-500 text-white'
    default: return 'bg-gray-500 text-white'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'pending': return t('pending')
    case 'scheduled': return t('scheduled')
    case 'completed': return t('completed')
    case 'cancelled': return t('cancelled')
    default: return status
  }
}

// Actions
const goBack = () => {
  router.back()
}

const goToServices = () => {
  router.push('/services')
}

const scheduleGift = (item) => {
  appStore.setDialogComponent(COMPONENTS.SCHEDULE_GIFTED_ORDER, {
    gifted_order_id: item.gifted_order_id,
    order_product_id: item.order_product_id,
    product_master_id: item.product_master_id
  })
  appStore.setDialogShow(true)
}

const rescheduleGift = (item) => {
  scheduleGift(item) // Same as schedule for now
}

const acceptGift = async (item) => {
  try {
    console.log('Accepting gift:', {
      order_id: bookingId.value,
      gifted_order_id: item.gifted_order_id,
      item: item
    })

    // Call the accept gift API using order_id
    const { data: response } = await useApi(`gifted-orders/${bookingId.value}/accept`, {
      method: 'POST'
    })

    if (response.value?.status) {
      console.log('Gift accepted successfully:', response.value)

      // Refresh the gift items to get updated status
      await fetchGiftItems()

      // Show success message
      // You can add a toast notification here if needed
      console.log('Gift has been accepted successfully!')
    }
  } catch (error) {
    console.error('Error accepting gift:', error)
    // Show error message
    // You can add a toast notification here if needed
  }
}

const viewGiftDetails = (item) => {
  // Open gift details modal or navigate to details page
  console.log('View gift details:', item)
}

// Lifecycle
onMounted(() => {
  if (bookingId.value) {
    fetchGiftItems()
  } else {
    error.value = t('invalid_booking_id')
    isLoading.value = false
  }
})

// SEO
useHead({
  title: t('gift_list_title')
})
</script>
