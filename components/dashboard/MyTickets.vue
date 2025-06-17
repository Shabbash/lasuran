<template>
  <div class="min-h-screen px-6 py-10 bg-[#A0576F] text-[#C6C6C7] font-sans text-sm">
    <!-- Header -->
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-[20px] mb-7 border-b border-[#AD7084] bg-[#EBE4DF] rounded-full ps-[30px]">
      <h1 class=" text-[#A0576F] font-medium text-[18.733px] not-italic leading-normal tracking-[0.749px]">My Tickets
      </h1>
      <div class="flex space-x-2">
        <button v-for="filter in filters" :key="filter.id" @click="activeFilter = filter.id" :class="[
          'px-4 py-1.5 text-sm font-medium rounded-full transition-colors',
          activeFilter === filter.id ? 'bg-[#A0576F] text-white' : 'text-[#A0576F] hover:bg-[#d6c5cb]'
        ]" :disabled="isFilterDisabled(filter.id)">
          {{ filter.label }}
        </button>
      </div>
      <BaseButton label="Open a New Ticket" @click="navigateToNewTicket"
        class="bg-[#6B8B9B] hover:bg-[#6B8B9B]/90 text-white rounded-full px-[22px] py-[12px] text-sm font-medium  w-auto inline-block " />
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Tickets List -->
      <div class="space-y-5">
        <div v-for="ticket in filteredTickets" :key="ticket.id" @click="selectTicket(ticket)" :class="[
          'cursor-pointer p-[20px] rounded-[12px] border transition',
          selectedTicket?.id === ticket.id ? 'ring-2 ring-white/40' : '',
          ticket.status === 'open' ? 'bg-[#EBE4DF] text-[#5B605C] border-[#D8D8D8]' : 'bg-[#A0576F] text-[#C6C6C7] border-[#AD7084]'
        ]">
          <div class="flex justify-between items-center mb-3">
            <p
              :class="ticket.status === 'open' ? 'text-[#A0576F] text-[17px] font-medium' : 'text-[#EBE4DF] text-[17px] font-medium'">
              Ticket No. {{ ticket.number }}
            </p>
            <span :class="[
              'px-3 py-1 text-xs rounded-full text-white',
              ticket.status === 'open' ? 'bg-[#6B8B9B]' :
                ticket.status === 'responded' ? 'bg-[#D8A26F]' :
                  ticket.status === 'closed' ? 'bg-[#C44E4E]' : ''
            ]">
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
      </div>

      <!-- Ticket Details -->
      <div class="space-y-6 flex flex-col h-full">
        <div class="p-[20px] bg-[#EBE4DF] rounded-[12px] text-[#5B605C] text-[14px]">
          <div class="mb-[13px] flex justify-between">
            <span>Type</span>
            <span>{{ selectedTicket?.type }}</span>
          </div>
          <div class="mb-[13px] flex justify-between">
            <span>Date</span>
            <span>{{ selectedTicket?.date }}</span>
          </div>
          <div class="mb-[13px] flex justify-between">
            <span>Time</span>
            <span>{{ selectedTicket?.time }}</span>
          </div>
          <div>
            <p class="text-[#5B605C] font-medium text-[13px]">Message:</p>
            <p class="text-[#5B605C] font-[350] text-[13px]">{{ selectedTicket?.message }}</p>
          </div>
        </div>

        <!-- Messages -->
        <ChatBox :messages="selectedTicket?.messages" :isClosed="selectedTicket?.status === 'closed'"
          @send="handleSendMessage" />

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseButton from '@/components/base/Button.vue'
import ChatBox from '@/components/base/ChatBox.vue'


const filters = [
  { id: 'all', label: 'ALL' },
  { id: 'open', label: 'Open' },
  { id: 'responded', label: 'Responded' },
  { id: 'closed', label: 'Closed' }
]

const activeFilter = ref('all')

const tickets = ref([
  {
    id: 1,
    number: 'sU87406',
    status: 'open',
    type: 'Suggestion',
    date: '25 Oct, 2024',
    time: '05:11 pm',
    message: 'Please cancel this reservation. I just wanted to test and discover the app',
    messages: [
      { from: 'Hassan A. (Support)', text: 'Yes, Sure!', time: '09:25 AM', direction: 'inbound' },
      { from: 'User', text: 'Thank you Lasuran', time: '09:25 AM', direction: 'outbound' },
      { from: 'Hassan A. (Support)', text: 'At your service anytime!', time: '09:25 AM', direction: 'inbound' }
    ]
  },
  {
    id: 2,
    number: 'sU87406',
    status: 'responded',
    type: 'Suggestion',
    date: '25 Oct, 2024',
    time: '05:11 pm',
    message: 'شكراً على الخدمة',
    messages: []
  },
  {
    id: 3,
    number: 'sU87406',
    status: 'closed',
    type: 'Suggestion',
    date: '25 Oct, 2024',
    time: '05:11 pm',
    message: 'تم حل المشكلة بنجاح',
    messages: []
  }
])

const selectedTicket = ref(tickets.value[0])

function selectTicket(ticket) {
  selectedTicket.value = ticket
}

const filteredTickets = computed(() => {
  if (activeFilter.value === 'all') return tickets.value
  return tickets.value.filter(t => t.status === activeFilter.value)
})

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function navigateToNewTicket() {
  console.log('Navigate to open new ticket')
}

function isFilterDisabled(filterId) {
  if (filterId === 'all') return false
  return !tickets.value.some(t => t.status === filterId)
}
</script>

<style scoped></style>
