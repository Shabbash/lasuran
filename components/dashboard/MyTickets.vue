<template>
  <div class="min-h-screen px-[5px] md:px-6 py-10 bg-[#A0576F] text-[#C6C6C7] font-sans text-sm">
    <!-- Header -->
    <div
      class="flex flex-col gap-4 md:flex-row justify-between md:items-center items-start mb-7 border-b border-[#AD7084] bg-[#EBE4DF] rounded-[12px] md:rounded-[40px] py-[20px] px-[10px] md:p-0 md:ps-[30px]">
      <h1 class="text-[#A0576F] font-medium text-[18.733px] not-italic leading-normal tracking-[0.749px]">
        {{ $t('tickets_title') }}
      </h1>

      <div class="flex flex-wrap gap-2">
        <button v-for="filter in filters" :key="filter.id" @click="onFilterChange(filter.id)" :class="[ 
          'px-4 py-1.5 text-sm font-medium rounded-full transition-colors',
          activeFilter === filter.id ? 'bg-[#A0576F] text-white' : 'text-[#A0576F] hover:bg-[#d6c5cb]' 
        ]">
          {{ $t(filter.label) }}
        </button>
      </div>

      <BaseButton :label="$t('tickets_open_new')" @click="navigateToNewTicket"
        class="bg-[#6B8B9B] hover:bg-[#6B8B9B]/90 text-white rounded-full px-[22px] py-[12px] text-sm font-medium w-auto" />
    </div>

    <!-- Main Grid -->
    <TicketSkeleton v-if="isLoading" />

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Tickets List -->
      <div class="h-[170px] md:h-[720px]">
        <div v-if="isLoading" class="flex justify-center items-center py-10">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>

        <div v-if="!isLoading && tickets.length === 0" class="text-center py-10">
          <p class="text-[#EBE4DF] text-lg mb-4">{{ $t('tickets_not_found') }}</p>
          <BaseButton :label="$t('tickets_create_new')" @click="navigateToNewTicket"
            class="bg-[#6B8B9B] hover:bg-[#6B8B9B]/90 text-white rounded-full px-[22px] py-[12px] text-sm font-medium" />
        </div>

        <Swiper :modules="[Mousewheel]" direction="vertical" :breakpoints="{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 4 }
        }" :mousewheel="{ forceToAxis: true, releaseOnEdges: true }" @activeIndexChange="onActiveTicketChange"
          class="h-full">
          <SwiperSlide v-for="(ticket, index) in tickets" :key="ticket.id">
            <div @click="selectTicketByIndex(index)" :class="[
              'cursor-pointer p-[20px] rounded-[12px] border transition',
              activeTicketIndex === index
                ? 'bg-[#EBE4DF] text-[#5B605C] border-[#D8D8D8]'
                : 'bg-[#A0576F] text-[#C6C6C7] border-[#AD7084]'
            ]">
              <div class="flex justify-between items-center mb-3">
                <p :class="ticket.status === 'open' ? 'text-[#A0576F] text-[17px] font-medium' : 'text-[#EBE4DF] text-[17px] font-medium'">
                  Ticket No. {{ ticket.number }}
                </p>
                <span :class="['px-3 py-1 text-xs rounded-full', getStatusStyle(ticket.status)]">
                  {{ $t(`tickets_status_${ticket.status}`) }}
                </span>
              </div>
              <div class="flex justify-between text-[13px] font-[350] border-b pb-2 mb-2"
                :class="ticket.status === 'open' ? 'border-[#D8D8D8]' : 'border-[#AD7084]'">
                <span>{{ $t('tickets_type') }}</span>
                <span>{{ ticket.type }}</span>
              </div>
              <div class="flex justify-between text-[13px] font-[350] border-b pb-2 mb-2"
                :class="ticket.status === 'open' ? 'border-[#D8D8D8]' : 'border-[#AD7084]'">
                <span>{{ $t('tickets_date') }}</span>
                <span>{{ ticket.date }}</span>
              </div>
              <div class="flex justify-between text-[13px] font-[350]">
                <span>{{ $t('tickets_time') }}</span>
                <span>{{ ticket.time }}</span>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <!-- Ticket Details -->
      <div class="space-y-6 flex flex-col h-full">
        <div v-if="!selectedTicket" class="flex items-center justify-center h-full">
          <p class="text-[#EBE4DF] text-lg">{{ $t('tickets_select_prompt') }}</p>
        </div>

        <template v-else>
          <div class="p-[20px] bg-[#EBE4DF] rounded-[12px] text-[#5B605C] text-[14px]">
            <div class="mb-[13px] flex justify-between"><span>{{ $t('tickets_type') }}</span><span>{{ selectedTicket.type }}</span></div>
            <div class="mb-[13px] flex justify-between"><span>{{ $t('tickets_date') }}</span><span>{{ selectedTicket.date }}</span></div>
            <div class="mb-[13px] flex justify-between"><span>{{ $t('tickets_time') }}</span><span>{{ selectedTicket.time }}</span></div>
            <div>
              <p class="text-[#5B605C] font-medium text-[13px]">{{ $t('tickets_message') }}:</p>
              <p class="text-[#5B605C] font-[350] text-[13px]">{{ selectedTicket.message }}</p>
            </div>
          </div>

          <ChatBox v-if="selectedTicket" :messages="selectedTicket.messages ?? []"
            :isClosed="selectedTicket.status === 'closed'" :ticketId="selectedTicket.id" :loading="isLoadingReplies"
            @refresh="fetchTickets(null,false)" />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import { useToast, useI18n } from '#imports'

import { Swiper, SwiperSlide } from 'swiper/vue'
import { Mousewheel } from 'swiper/modules'
import 'swiper/css'

import ChatBox from '@/components/base/ChatBox.vue'
import BaseButton from '@/components/base/Button.vue'
import TicketSkeleton from '@/components/skeletons/TicketSkeleton.vue'

const { t } = useI18n()
const toast = useToast()

const isLoading = ref(true)
const currentTicketFetchId = ref(null)

const filters = [
  { id: 'all', label: 'tickets_filter_all', type: null },
  { id: 'open', label: 'tickets_filter_open', type: 1 },
  { id: 'responded', label: 'tickets_filter_responded', type: 2 },
  { id: 'closed', label: 'tickets_filter_closed', type: 3 }
]

const activeFilter = ref('all')
const tickets = ref([])
const selectedTicket = ref(null)
const activeTicketIndex = ref(0)
const isLoadingReplies = ref(false)
const lastFetchTime = ref(0)
const FETCH_COOLDOWN = 2000

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

const onActiveTicketChange = (swiper) => {
  selectTicketByIndex(swiper.activeIndex)
}

const selectTicketByIndex = (index) => {
  activeTicketIndex.value = index
  selectedTicket.value = tickets.value[index] || null
  if (selectedTicket.value?.id) {
    currentTicketFetchId.value = selectedTicket.value.id
    fetchTicketDetails(selectedTicket.value.id)
  }
}

const onFilterChange = (id) => {
  activeFilter.value = id
  const type = filters.find(f => f.id === id)?.type ?? null
  fetchTickets(type)
  selectedTicket.value = null
  activeTicketIndex.value = 0
}

const fetchTickets = async (filterType = null, withLoading = true) => {
  if (withLoading) isLoading.value = true
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

      if (tickets.value.length > 0) {
        selectTicketByIndex(0)
      } else {
        selectedTicket.value = null
      }
    }
  } catch (error) {
    console.error('Error fetching tickets:', error)
  } finally {
    isLoading.value = false
  }
}

const fetchTicketDetails = async (id) => {
  if (!id || isLoadingReplies.value) return

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
      if (
        selectedTicket.value?.id === id &&
        currentTicketFetchId.value === id &&
        Array.isArray(messages) &&
        messages.length > 0
      ) {
        selectedTicket.value.messages = messages
      }
    }
  } catch (error) {
    console.error('Error fetching replies:', error)
    if (error.status === 429) {
      toast.add({ title: t('tickets_too_many_requests'), color: 'warning' })
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
      toast.add({ title: t('tickets_message_sent'), color: 'success' })

      const temp = selectedTicket.value.messages.find(m => m.isTemporary)
      if (temp) {
        temp.isTemporary = false
        temp.id = data.value.data?.id || temp.id
      }
    } else {
      selectedTicket.value.messages = selectedTicket.value.messages.filter(m => !m.isTemporary)
      toast.add({ title: t('tickets_message_failed'), color: 'error' })
    }
  } catch (err) {
    console.error('Error sending message:', err)
    selectedTicket.value.messages = selectedTicket.value.messages.filter(m => !m.isTemporary)
    toast.add({ title: t('tickets_message_failed'), color: 'error' })
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
  navigateTo('/contact')
}

onMounted(() => {
  fetchTickets()
})
</script>


<style scoped></style>
