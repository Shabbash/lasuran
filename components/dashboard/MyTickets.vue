<template>
  <div class="min-h-screen px-[5px] md:px-6 py-10 bg-[#A0576F] text-[#C6C6C7] font-sans text-sm">
    <!-- Header -->
    <div
      class="flex flex-col gap-4 md:flex-row justify-between md:items-center items-start mb-7 border-b border-[#AD7084] bg-[#EBE4DF] rounded-[12px] md:rounded-[40px] py-[20px] px-[10px] md:p-0 md:ps-[30px]">
      <h1 class="text-[#A0576F] font-medium text-[18.733px] not-italic leading-normal tracking-[0.749px]">
        My Tickets
      </h1>

      <div class="flex flex-wrap gap-2">
        <button v-for="filter in filters" :key="filter.id" @click="onFilterChange(filter.id)" :class="[
          'px-4 py-1.5 text-sm font-medium rounded-full transition-colors',
          activeFilter === filter.id ? 'bg-[#A0576F] text-white' : 'text-[#A0576F] hover:bg-[#d6c5cb]'
        ]">
          {{ filter.label }}
        </button>
      </div>

      <BaseButton label="Open a New Ticket" @click="navigateToNewTicket"
        class="bg-[#6B8B9B] hover:bg-[#6B8B9B]/90 text-white rounded-full px-[22px] py-[12px] text-sm font-medium w-auto" />
    </div>


    <!-- Main Grid -->

    <TicketSkeleton v-if="isLoading" />

    <div else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Tickets List -->
      <!-- <div class="space-y-5">
        <div v-if="isLoading" class="flex justify-center items-center py-10">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>

        <div v-else-if="tickets.length === 0" class="text-center py-10">
          <p class="text-[#EBE4DF] text-lg mb-4">No tickets found</p>
          <BaseButton label="Create New Ticket" @click="navigateToNewTicket"
            class="bg-[#6B8B9B] hover:bg-[#6B8B9B]/90 text-white rounded-full px-[22px] py-[12px] text-sm font-medium" />
        </div>

        <div v-else v-for="ticket in tickets" :key="ticket.id" @click="selectTicket(ticket)"
          :class="[
              'cursor-pointer p-[20px] rounded-[12px] border transition',
              selectedTicket?.id === ticket.id
                ? 'bg-[#EBE4DF] text-[#5B605C] border-[#D8D8D8]'
                : 'bg-[#A0576F] text-[#C6C6C7] border-[#AD7084]'
            ]">
          <div class="flex justify-between items-center mb-3">
            <p :class="ticket.status === 'open' ? 'text-[#A0576F] text-[17px] font-medium' : 'text-[#EBE4DF] text-[17px] font-medium'">
              Ticket No. {{ ticket.number }}
            </p>
            <span :class="['px-3 py-1 text-xs rounded-full', getStatusStyle(ticket.status)]">
              {{ capitalize(ticket.status) }}
            </span>
          </div>
          <div class="flex justify-between text-[13px] font-[350] border-b pb-2 mb-2"
            :class="ticket.status === 'open' ? 'border-[#D8D8D8]' : 'border-[#AD7084]'">
            <span>Type</span>
            <span>{{ ticket.type }}</span>
          </div>
          <div class="flex justify-between text-[13px] font-[350] border-b pb-2 mb-2"
            :class="ticket.status === 'open' ? 'border-[#D8D8D8]' : 'border-[#AD7084]'">
            <span>Date</span>
            <span>{{ ticket.date }}</span>
          </div>
          <div class="flex justify-between text-[13px] font-[350]">
            <span>Time</span>
            <span>{{ ticket.time }}</span>
          </div>
        </div>
      </div> -->



      <!-- Tickets List -->
      <div class="h-[170px] md:h-[720px]">
        <div v-if="isLoading" class="flex justify-center items-center py-10">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>

        <div v-else-if="tickets.length === 0" class="text-center py-10">
          <p class="text-[#EBE4DF] text-lg mb-4">No tickets found</p>
          <BaseButton label="Create New Ticket" @click="navigateToNewTicket"
            class="bg-[#6B8B9B] hover:bg-[#6B8B9B]/90 text-white rounded-full px-[22px] py-[12px] text-sm font-medium" />
        </div>

        <Swiper :modules="[Mousewheel]" direction="vertical" :breakpoints="{
    0: { slidesPerView: 1 },      // mobile
    768: { slidesPerView: 4 }     // tablets and up
  }"
          :mousewheel="{ forceToAxis: true, releaseOnEdges: true }" @activeIndexChange="onActiveTicketChange"
          class="h-full">
          <SwiperSlide v-for="(ticket, index) in tickets" :key="ticket.id">
            <div @click="selectTicketByIndex(index)" :class="[
              'cursor-pointer p-[20px] rounded-[12px] border transition',
              activeTicketIndex === index
                ? 'bg-[#EBE4DF] text-[#5B605C] border-[#D8D8D8]'
                : 'bg-[#A0576F] text-[#C6C6C7] border-[#AD7084]'
            ]">
              <div class="flex justify-between items-center mb-3">
                <p
                  :class="ticket.status === 'open' ? 'text-[#A0576F] text-[17px] font-medium' : 'text-[#EBE4DF] text-[17px] font-medium'">
                  Ticket No. {{ ticket.number }}
                </p>
                <span :class="['px-3 py-1 text-xs rounded-full', getStatusStyle(ticket.status)]">
                  {{ capitalize(ticket.status) }}
                </span>
              </div>
              <div class="flex justify-between text-[13px] font-[350] border-b pb-2 mb-2"
                :class="ticket.status === 'open' ? 'border-[#D8D8D8]' : 'border-[#AD7084]'">
                <span>Type</span>
                <span>{{ ticket.type }}</span>
              </div>
              <div class="flex justify-between text-[13px] font-[350] border-b pb-2 mb-2"
                :class="ticket.status === 'open' ? 'border-[#D8D8D8]' : 'border-[#AD7084]'">
                <span>Date</span>
                <span>{{ ticket.date }}</span>
              </div>
              <div class="flex justify-between text-[13px] font-[350]">
                <span>Time</span>
                <span>{{ ticket.time }}</span>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <!-- Ticket Details -->
      <div class="space-y-6 flex flex-col h-full">
        <div v-if="!selectedTicket" class="flex items-center justify-center h-full">
          <p class="text-[#EBE4DF] text-lg">Select a ticket to view details</p>
        </div>

        <template v-else>
          <div class="p-[20px] bg-[#EBE4DF] rounded-[12px] text-[#5B605C] text-[14px]">
            <div class="mb-[13px] flex justify-between"><span>Type</span><span>{{ selectedTicket.type }}</span></div>
            <div class="mb-[13px] flex justify-between"><span>Date</span><span>{{ selectedTicket.date }}</span></div>
            <div class="mb-[13px] flex justify-between"><span>Time</span><span>{{ selectedTicket.time }}</span></div>
            <div>
              <p class="text-[#5B605C] font-medium text-[13px]">Message:</p>
              <p class="text-[#5B605C] font-[350] text-[13px]">{{ selectedTicket.message }}</p>
            </div>
          </div>

          <ChatBox :messages="selectedTicket.messages || []" :isClosed="selectedTicket.status === 'closed'"
            :loading="isLoadingReplies" @send="handleSendMessage" />
        </template>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import { useToast } from '#imports'

import { Swiper, SwiperSlide } from 'swiper/vue'
import { Mousewheel } from 'swiper/modules'
import 'swiper/css'

import ChatBox from '@/components/base/ChatBox.vue'
import BaseButton from '@/components/base/Button.vue'
import TicketSkeleton from '@/components/skeletons/TicketSkeleton.vue'
const isLoading = ref(true)

const filters = [
  { id: 'all', label: 'ALL', type: null },
  { id: 'open', label: 'Open', type: 1 },
  { id: 'responded', label: 'Responded', type: 2 },
  { id: 'closed', label: 'Closed', type: 3 }
]

const activeFilter = ref('all')
const tickets = ref([])
const selectedTicket = ref(null)
const activeTicketIndex = ref(0)

// const isLoading = ref(false)
const isLoadingReplies = ref(false)
const lastFetchTime = ref(0)
const FETCH_COOLDOWN = 2000

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)
const getStatusStyle = (status) => {
  switch (status) {
    case 'open': return 'bg-[#6B8B9B] text-white'
    case 'responded': return 'bg-[#D8A26F] text-white'
    case 'closed': return 'bg-[#C44E4E] text-white'
    default: return 'bg-gray-400 text-white'
  }
}

const extractDate = (str) => str?.split(' - ')[0]?.replace(/^\w+,\s*/, '') || ''
const extractTime = (str) => str?.split(' - ')[1] || ''

const mapStatus = (val) => {
  switch (val) {
    case 1: return 'open'
    case 2: return 'responded'
    case 3: return 'closed'
    default: return 'open'
  }
}

// تحديث selectedTicket حسب السلايد
const onActiveTicketChange = (swiper) => {
  selectTicketByIndex(swiper.activeIndex)
}

// التحديد اليدوي (اختياري)
const selectTicketByIndex = (index) => {
  activeTicketIndex.value = index
  selectedTicket.value = tickets.value[index] || null
  fetchTicketDetails(selectedTicket.value?.id)
}

const onFilterChange = (id) => {
  activeFilter.value = id
  const type = filters.find(f => f.id === id)?.type ?? null
  fetchTickets(type)
}

const fetchTickets = async (filterType = null) => {
  isLoading.value = true
  try {
    const params = {}
    if (filterType !== null) {
      params.status = filterType
    }

    const { data } = await useApi('customer-service/feedbacks', {
      method: 'GET',
      params
    })

    if (data.value?.status && data.value?.data?.feedbacks) {
      tickets.value = data.value.data.feedbacks.map(ticket => ({
        id: ticket.id,
        number: `T${ticket.id}`,
        status: mapStatus(ticket.status?.value || 1),
        type: ticket.category || 'General',
        date: extractDate(ticket.date_time),
        time: extractTime(ticket.date_time),
        message: ticket.message,
        messages: transformReplies(ticket.replies || []),
        attachments: ticket.attachments || []
      }))

      // أول بطاقة هي المختارة
      if (tickets.value.length > 0) {
        selectTicketByIndex(0)
      }
    }
  } catch (error) {
    console.error('Error fetching tickets:', error)
  } finally {
    isLoading.value = false
  }
}

const fetchTicketDetails = async (id) => {
  if (isLoadingReplies.value || !id) return

  const now = Date.now()
  if (now - lastFetchTime.value < FETCH_COOLDOWN) return

  isLoadingReplies.value = true
  lastFetchTime.value = now

  try {
    const { data } = await useApi(`customer-service/feedbacks/${id}`, {
      method: 'GET'
    })

    if (data.value?.status && data.value?.data) {
      const messages = transformRepliesFromEndpoint(data.value.data)
      if (selectedTicket.value?.id === id) {
        selectedTicket.value.messages = messages
      }
    }
  } catch (error) {
    console.error('Error fetching replies:', error)
    if (error.status === 429) {
      const toast = useToast()
      toast.add({ title: 'Too many requests. Please wait.', color: 'warning' })
      lastFetchTime.value = Date.now() + 5000
    }
  } finally {
    isLoadingReplies.value = false
  }
}

const handleSendMessage = async (msg) => {
  if (!selectedTicket.value || !msg.trim() || isLoadingReplies.value) return

  const tempMsg = {
    id: Date.now(),
    from: 'You',
    text: msg,
    time: extractTime(new Date().toISOString()),
    direction: 'outbound',
    sender_type: 'user',
    sender_image: null,
    attachments: [],
    isTemporary: true
  }

  selectedTicket.value.messages ||= []
  selectedTicket.value.messages.push(tempMsg)

  try {
    const formData = new FormData()
    formData.append('category', selectedTicket.value.type)
    formData.append('message', msg)
    formData.append('ticket_id', selectedTicket.value.id)

    const { data } = await useApi(`customer-service/feedbacks/${selectedTicket.value.id}/replies`, {
      method: 'POST',
      body: formData
    })

    if (data.value?.status) {
      const toast = useToast()
      toast.add({ title: 'Message sent successfully', color: 'success' })

      const temp = selectedTicket.value.messages.find(m => m.isTemporary)
      if (temp) {
        temp.isTemporary = false
        temp.id = data.value.data?.id || temp.id
      }
    } else {
      selectedTicket.value.messages = selectedTicket.value.messages.filter(m => !m.isTemporary)
      const toast = useToast()
      toast.add({ title: 'Failed to send message', color: 'error' })
    }
  } catch (err) {
    console.error('Error sending message:', err)
    selectedTicket.value.messages = selectedTicket.value.messages.filter(m => !m.isTemporary)
    const toast = useToast()
    toast.add({ title: 'Failed to send message', color: 'error' })
  }
}

const transformSingleMessage = (message) => ({
  id: message.id,
  from: message.sender_name || message.from || 'Unknown',
  text: message.message || message.text,
  time: extractTime(message.date_time || message.time),
  direction: message.sender_type === 'support' ? 'inbound' : 'outbound',
  sender_type: message.sender_type,
  sender_image: message.sender_image,
  attachments: message.attachments || []
})

const transformReplies = (replies) => {
  const messages = []
  replies?.forEach(group => {
    group.messages?.forEach(msg => {
      messages.push(transformSingleMessage(msg))
    })
  })
  return messages
}

const transformRepliesFromEndpoint = (data) => {
  if (!data) return []
  if (Array.isArray(data)) return data.map(transformSingleMessage)
  if (data.replies) return transformReplies(data.replies)
  if (data.messages) return data.messages.map(transformSingleMessage)
  if (data.data) return data.data.map(transformSingleMessage)
  return []
}

const navigateToNewTicket = () => {
  navigateTo('/contact-us')
}

onMounted(() => {
  fetchTickets()
})
</script>


<style scoped></style>
