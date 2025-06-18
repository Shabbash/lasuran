<template>
  <div class="min-h-screen px-6 py-10 bg-[#A0576F] text-[#C6C6C7] font-sans text-sm">
    <!-- Header -->
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-[20px] mb-7 border-b border-[#AD7084] bg-[#EBE4DF] rounded-full ps-[30px]">
      <h1 class=" text-[#A0576F] font-medium text-[18.733px] not-italic leading-normal tracking-[0.749px]">My Tickets
      </h1>
      <div class="flex space-x-2">
        <button v-for="filter in filters" :key="filter.id" @click="onFilterChange(filter.id)" :class="[
          'px-4 py-1.5 text-sm font-medium rounded-full transition-colors',
          activeFilter === filter.id ? 'bg-[#A0576F] text-white' : 'text-[#A0576F] hover:bg-[#d6c5cb]'
        ]">
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
        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-10">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>

        <!-- Empty State -->
        <div v-else-if="tickets.length === 0" class="text-center py-10">
          <p class="text-[#EBE4DF] text-lg mb-4">No tickets found</p>
          <BaseButton label="Create New Ticket" @click="navigateToNewTicket"
            class="bg-[#6B8B9B] hover:bg-[#6B8B9B]/90 text-white rounded-full px-[22px] py-[12px] text-sm font-medium" />
        </div>

        <!-- Tickets List -->
        <div v-else v-for="ticket in tickets" :key="ticket.id" @click="selectTicket(ticket)" :class="[
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
        <!-- No ticket selected state -->
        <div v-if="!selectedTicket" class="flex items-center justify-center h-full">
          <p class="text-[#EBE4DF] text-lg">Select a ticket to view details</p>
        </div>

        <!-- Ticket details when selected -->
        <template v-else>
          <div class="p-[20px] bg-[#EBE4DF] rounded-[12px] text-[#5B605C] text-[14px]">
            <div class="mb-[13px] flex justify-between">
              <span>Type</span>
              <span>{{ selectedTicket.type }}</span>
            </div>
            <div class="mb-[13px] flex justify-between">
              <span>Date</span>
              <span>{{ selectedTicket.date }}</span>
            </div>
            <div class="mb-[13px] flex justify-between">
              <span>Time</span>
              <span>{{ selectedTicket.time }}</span>
            </div>
            <div>
              <p class="text-[#5B605C] font-medium text-[13px]">Message:</p>
              <p class="text-[#5B605C] font-[350] text-[13px]">{{ selectedTicket.message }}</p>
            </div>
          </div>

          <!-- Messages -->
          <ChatBox :messages="selectedTicket.messages || []" :isClosed="selectedTicket.status === 'closed'"
            @send="handleSendMessage" />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BaseButton from '@/components/base/Button.vue'
import ChatBox from '@/components/base/ChatBox.vue'

const filters = [
  { id: 'all', label: 'ALL', type: null },
  { id: 'open', label: 'Open', type: 1 },
  { id: 'responded', label: 'Responded', type: 2 },
  { id: 'closed', label: 'Closed', type: 2 }
]

const activeFilter = ref('all')
const tickets = ref([])
const selectedTicket = ref(null)
const isLoading = ref(false)
const isLoadingReplies = ref(false)
const lastFetchTime = ref(0)
const FETCH_COOLDOWN = 2000 // 2 seconds cooldown between API calls

// Fetch tickets from API
const fetchTickets = async (filterType = null) => {
  isLoading.value = true
  try {
    // Build params object
    const params = {}

    // Add type parameter based on filter
    if (filterType !== null) {
      params.type = filterType
    } else {
      // Default to type 1 (Opened) if no specific filter
      params.type = 1
    }

    const { data } = await useApi('customer-service/feedbacks', {
      method: 'GET',
      params: params
    })

    if (data.value?.status && data.value?.data?.feedbacks) {
      // Transform API data to match component structure
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

      // Set first ticket as selected if available
      if (tickets.value.length > 0) {
        selectedTicket.value = tickets.value[0]
      }
    }
  } catch (error) {
    console.error('Error fetching tickets:', error)
  } finally {
    isLoading.value = false
  }
}

// Map status value to status string
const mapStatus = (statusValue) => {
  switch (statusValue) {
    case 1:
      return 'open'
    case 2:
      return 'responded'
    case 3:
      return 'closed'
    default:
      return 'open'
  }
}

// Transform nested replies structure to flat messages array
const transformReplies = (replies) => {
  if (!replies || !Array.isArray(replies)) return []

  const messages = []

  // Iterate through each date group
  replies.forEach(dateGroup => {
    if (dateGroup.messages && Array.isArray(dateGroup.messages)) {
      // Add all messages from this date group
      dateGroup.messages.forEach(message => {
        messages.push({
          id: message.id,
          from: message.sender_name || 'Unknown',
          text: message.message,
          time: extractTime(message.date_time),
          direction: message.sender_type === 'support' ? 'inbound' : 'outbound',
          sender_type: message.sender_type,
          sender_image: message.sender_image,
          attachments: message.attachments || []
        })
      })
    }
  })

  return messages
}

// Transform replies from dedicated replies endpoint
const transformRepliesFromEndpoint = (repliesData) => {
  if (!repliesData) return []

  const messages = []

  // Handle different possible response structures
  if (Array.isArray(repliesData)) {
    // If repliesData is directly an array of messages
    repliesData.forEach(message => {
      messages.push(transformSingleMessage(message))
    })
  } else if (repliesData.replies && Array.isArray(repliesData.replies)) {
    // If repliesData has a replies property with nested structure
    messages.push(...transformReplies(repliesData.replies))
  } else if (repliesData.messages && Array.isArray(repliesData.messages)) {
    // If repliesData has a messages property
    repliesData.messages.forEach(message => {
      messages.push(transformSingleMessage(message))
    })
  } else if (repliesData.data && Array.isArray(repliesData.data)) {
    // If repliesData has a data property
    repliesData.data.forEach(message => {
      messages.push(transformSingleMessage(message))
    })
  }

  return messages
}

// Transform a single message object
const transformSingleMessage = (message) => {
  return {
    id: message.id,
    from: message.sender_name || message.from || 'Unknown',
    text: message.message || message.text,
    time: extractTime(message.date_time || message.time),
    direction: message.sender_type === 'support' ? 'inbound' : 'outbound',
    sender_type: message.sender_type,
    sender_image: message.sender_image,
    attachments: message.attachments || []
  }
}

// Extract date from API format: "Sun, 01 Jun 2025 - 07:50 AM"
const extractDate = (dateTimeString) => {
  if (!dateTimeString) return ''
  // Split by " - " and take the first part, then remove the day name
  const datePart = dateTimeString.split(' - ')[0]
  // Remove day name (e.g., "Sun, ") and return the rest
  return datePart.replace(/^\w+,\s*/, '')
}

// Extract time from API format: "Sun, 01 Jun 2025 - 07:50 AM"
const extractTime = (dateTimeString) => {
  if (!dateTimeString) return ''
  // Split by " - " and take the second part (time)
  return dateTimeString.split(' - ')[1] || ''
}

// Handle filter change
const onFilterChange = (filterId) => {
  activeFilter.value = filterId

  // Find the selected filter and get its type
  const selectedFilter = filters.find(f => f.id === filterId)
  const filterType = selectedFilter ? selectedFilter.type : null

  // Fetch tickets with the selected filter type
  fetchTickets(filterType)
}

// Initialize data on component mount
onMounted(() => {
  fetchTickets()
})

function selectTicket(ticket) {
  // If the same ticket is already selected, don't fetch again
  if (selectedTicket.value && selectedTicket.value.id === ticket.id) {
    return
  }

  selectedTicket.value = ticket

  // Only fetch detailed ticket info if we don't have messages or if enough time has passed
  const now = Date.now()
  if (!ticket.messages || ticket.messages.length === 0 || (now - lastFetchTime.value) > FETCH_COOLDOWN) {
    fetchTicketDetails(ticket.id)
  }
}

// Fetch detailed ticket information and replies
const fetchTicketDetails = async (ticketId) => {
  // Prevent multiple simultaneous calls
  if (isLoadingReplies.value) {
    return
  }

  // Check cooldown period to prevent rate limiting
  const now = Date.now()
  if ((now - lastFetchTime.value) < FETCH_COOLDOWN) {
    console.log('Skipping API call due to cooldown period')
    return
  }

  isLoadingReplies.value = true
  lastFetchTime.value = now

  try {
    // Only fetch replies since we already have basic ticket info from the list
    const { data: repliesData } = await useApi(`customer-service/feedbacks/${ticketId}`, {
      method: 'GET'
    })

    if (repliesData.value?.status && repliesData.value?.data) {
      // Transform replies from the dedicated replies endpoint
      const messages = transformRepliesFromEndpoint(repliesData.value.data)

      // Update selected ticket with messages
      if (selectedTicket.value && selectedTicket.value.id === ticketId) {
        selectedTicket.value = {
          ...selectedTicket.value,
          messages: messages
        }
      }
    }
  } catch (error) {
    console.error('Error fetching ticket details:', error)

    // Handle rate limiting specifically
    if (error.status === 429) {
      const toast = useToast()
      toast.add({
        title: 'Too many requests. Please wait a moment.',
        color: 'warning'
      })

      // Increase cooldown period after rate limit
      lastFetchTime.value = now + 5000 // Add extra 5 seconds
    }
  } finally {
    isLoadingReplies.value = false
  }
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function navigateToNewTicket() {
  // Navigate to contact-us page to create new ticket
  navigateTo('/contact-us')
}

// Handle sending new message/reply to ticket
const handleSendMessage = async (message) => {
  if (!selectedTicket.value || !message.trim()) return

  // Create the new message object for immediate display
  const newMessage = {
    id: Date.now(), // Temporary ID until we get the real one from API
    from: 'You',
    text: message,
    time: extractTime(new Date().toISOString()),
    direction: 'outbound',
    sender_type: 'user',
    sender_image: null,
    attachments: [],
    isTemporary: true // Flag to identify temporary messages
  }

  // Immediately append the message to the chat for instant feedback
  if (!selectedTicket.value.messages) {
    selectedTicket.value.messages = []
  }
  selectedTicket.value.messages.push(newMessage)

  try {
    const formData = new FormData()
    formData.append('category', selectedTicket.value.type)
    formData.append('message', message)
    // Add ticket ID to associate the reply with the specific ticket
    formData.append('ticket_id', selectedTicket.value.id)

    const { data } = await useApi(`customer-service/feedbacks/${selectedTicket.value.id}/replies`, {
      method: 'POST',
      body: formData
    })

    if (data.value?.status) {
      // Show success message
      const toast = useToast()
      toast.add({
        title: 'Message sent successfully',
        color: 'success'
      })

      // Remove the temporary message and keep it as permanent
      // Convert temporary message to permanent without API call to avoid rate limiting
      const tempMessage = selectedTicket.value.messages.find(msg => msg.isTemporary)
      if (tempMessage) {
        tempMessage.isTemporary = false
        tempMessage.id = data.value.data?.id || tempMessage.id
      }
    } else {
      // Remove the temporary message if API call failed
      selectedTicket.value.messages = selectedTicket.value.messages.filter(msg => !msg.isTemporary)
      const toast = useToast()
      toast.add({
        title: 'Failed to send message',
        color: 'error'
      })
    }
  } catch (error) {
    console.error('Error sending message:', error)

    // Remove the temporary message on error
    selectedTicket.value.messages = selectedTicket.value.messages.filter(msg => !msg.isTemporary)

    const toast = useToast()
    toast.add({
      title: 'Failed to send message',
      color: 'error'
    })
  }
}
</script>

<style scoped></style>
