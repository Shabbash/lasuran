<template>
  <div class="min-h-screen px-6 py-10 bg-[#A0576F] text-[#C6C6C7] font-sans text-sm">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-[20px] pb-7 mb-7 border-b border-[#AD7084] bg-[#EBE4DF] rounded-full px-6 py-3">
      <div class="flex items-center gap-4">
        <h1 class="text-lg font-medium text-[#A0576F]">My Tickets</h1>
        <div class="flex space-x-2">
          <button
            v-for="filter in filters"
            :key="filter.id"
            @click="activeFilter = filter.id"
            :class="[
              'px-4 py-1.5 text-sm font-medium rounded-full transition-colors',
              activeFilter === filter.id ? 'bg-[#A0576F] text-white' : 'text-[#A0576F] hover:bg-[#d6c5cb]'
            ]"
            :disabled="isFilterDisabled(filter.id)"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>
      <BaseButton label="Open a New Ticket" @click="navigateToNewTicket"
        class="bg-[#6B8B9B] hover:bg-[#6B8B9B]/90 text-white rounded-full px-6 py-1.5 text-sm font-medium" />
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Tickets List -->
      <div class="space-y-5">
        <div
          v-for="ticket in filteredTickets"
          :key="ticket.id"
          :class="[
            'p-[20px] rounded-[12px] border',
            ticket.status === 'open' ? 'bg-[#EBE4DF] text-[#5B605C] border-[#D8D8D8]' : 'bg-[#A0576F] text-[#C6C6C7] border-[#AD7084]'
          ]"
        >
          <div class="flex justify-between items-center mb-3">
            <p :class="ticket.status === 'open' ? 'text-[#A0576F] text-[17px] font-medium' : 'text-[#EBE4DF] text-[17px] font-medium'">
              Ticket No. {{ ticket.number }}
            </p>
            <span
              :class="[
                'px-3 py-1 text-xs rounded-full text-white',
                ticket.status === 'open' ? 'bg-[#6B8B9B]' :
                ticket.status === 'responded' ? 'bg-[#D8A26F]' :
                ticket.status === 'closed' ? 'bg-[#C44E4E]' : ''
              ]"
            >
              {{ capitalize(ticket.status) }}
            </span>
          </div>
          <div class="flex justify-between text-[13px] font-[350] border-b pb-2 mb-2" :class="ticket.status === 'open' ? 'border-[#D8D8D8]' : 'border-[#AD7084]'">
            <span>Type</span>
            <span>{{ ticket.type }}</span>
          </div>
          <div class="flex justify-between text-[13px] font-[350] border-b pb-2 mb-2" :class="ticket.status === 'open' ? 'border-[#D8D8D8]' : 'border-[#AD7084]'">
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
      <div class="space-y-6">
        <!-- Message Info -->
        <div class="p-[20px] bg-[#EBE4DF] rounded-[12px] text-[#5B605C] text-[14px]">
          <div class="mb-2 flex justify-between">
            <span>Type</span>
            <span>Suggestion</span>
          </div>
          <div class="mb-2 flex justify-between">
            <span>Date</span>
            <span>25 Oct, 2024</span>
          </div>
          <div class="mb-2 flex justify-between">
            <span>Time</span>
            <span>05:11 pm</span>
          </div>
          <div class="mt-4">
            <p class="mb-1 font-medium">Message:</p>
            <p class="text-sm">Please cancel this reservation. I just wanted to test and discover the app</p>
          </div>
        </div>

        <!-- Messages -->
        <div class="space-y-4">
          <div class="flex gap-3">
            <div class="w-[35px] h-[35px] rounded-full bg-[#EBE4DF] flex items-center justify-center text-[#A0576F] text-sm font-bold">H</div>
            <div>
              <p class="bg-white text-[#5B605C] px-4 py-2 rounded-[12px] mb-1">Yes, Sure!</p>
              <p class="text-xs opacity-50">09:25 AM</p>
            </div>
          </div>
          <div class="flex justify-end gap-3">
            <div>
              <p class="bg-[#6B8B9B] text-white px-4 py-2 rounded-[12px] mb-1">Thank you Lasuran</p>
              <p class="text-xs text-right opacity-50">09:25 AM</p>
            </div>
          </div>
          <div class="flex gap-3">
            <div class="w-[35px] h-[35px] rounded-full bg-[#EBE4DF] flex items-center justify-center text-[#A0576F] text-sm font-bold">H</div>
            <div>
              <p class="bg-white text-[#5B605C] px-4 py-2 rounded-[12px] mb-1">At your service anytime!</p>
              <p class="text-xs opacity-50">09:25 AM</p>
            </div>
          </div>
        </div>

        <!-- Chat Input -->
        <div class="flex items-center gap-2 mt-4">
          <input type="text" placeholder="Type a message" class="flex-1 rounded-full px-4 py-2 text-sm text-[#5B605C] bg-white outline-none" />
          <button class="w-[40px] h-[40px] rounded-full bg-[#6B8B9B] flex items-center justify-center text-white">
            <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 10l9-6 9 6M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-4 0v-4m0 0l-4 4m4-4l4 4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import BaseButton from '@/components/base/Button.vue'

const filters = [
  { id: 'all', label: 'ALL' },
  { id: 'open', label: 'Open' },
  { id: 'responded', label: 'Responded' },
  { id: 'closed', label: 'Closed' }
]

const activeFilter = ref('all')

const tickets = ref([
  { id: 1, number: 'sU87406', status: 'open', type: 'Suggestion', date: '25 Oct, 2024', time: '05:11 pm' },
  { id: 2, number: 'sU87406', status: 'responded', type: 'Suggestion', date: '25 Oct, 2024', time: '05:11 pm' },
  { id: 3, number: 'sU87406', status: 'closed', type: 'Suggestion', date: '25 Oct, 2024', time: '05:11 pm' },
  { id: 4, number: 'sU87406', status: 'closed', type: 'Suggestion', date: '25 Oct, 2024', time: '05:11 pm' }
])

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

<style scoped>
</style>