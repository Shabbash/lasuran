<template>
  <div class="chat-box flex flex-col justify-between flex-1">
    <!-- Hidden File Input -->
    <input ref="fileInput" type="file" class="hidden" multiple @change="handleFileUpload" />


    <!-- Messages List -->
    <div class="overflow-y-auto pe-[10px] space-y-4 max-h-[540px]">
      <template v-if="messages && messages.length">
        <div v-for="(msg, index) in messages" :key="index">
          <!-- Inbound Message -->
          <div v-if="msg.direction === 'inbound'" class="flex gap-[15px]">
            <div
                class="w-[35px] h-[35px] rounded-full bg-[#EBE4DF] flex items-center justify-center text-[#A0576F] text-sm font-bold">
              H
            </div>

            <div>
              <p class="text-[#EBE4DF] font-medium text-[14.119px] mb-[10px]">{{ msg.from }}</p>

              <p
                  class="text-[#5B605C] text-[14px] bg-[#F2F7FB] p-[12px] rounded-[16px] rounded-ss-none ms-[10px] mb-[7px] inline-block">
                {{ msg.text }}
              </p>


              <!-- Attachments Preview -->
              <div v-if="msg.attachments?.length" class="ms-[10px] mb-[7px] grid grid-cols-2 gap-3">
                <div
                    v-for="(attachment, index) in msg.attachments"
                    :key="index"
                    class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">

                  <!-- Image preview -->
                  <a target="_blank" v-if="isImage(attachment)" :href="attachment">
                    <img  :src="attachment"
                         alt="Attachment"
                         class="w-full h-[100px] object-cover rounded-xl"
                    />
                  </a>
                  <!-- File download preview -->
                  <div v-else class="flex items-center p-3 gap-2">
                    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" stroke-width="2"
                         viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round"
                            d="M12 4v16m8-8H4"/>
                    </svg>
                    <a :href="attachment" target="_blank" class="text-sm text-blue-600 underline truncate max-w-[120px]">
                      {{ getFilename(attachment) }}
                    </a>
                  </div>
                </div>
              </div>

              <p class="text-white text-[10.085px] ms-[17px]">{{ msg.time }}</p>
            </div>
          </div>


          <!-- Outbound Message -->
          <div v-else class="flex justify-end gap-3">
            <div class="text-end">
              <p class="text-white text-[14px] bg-[#6B8B9B] p-[12px] rounded-[16px] rounded-se-none mb-[7px]">
                {{ msg.text }}

                <div v-if="msg.attachments?.length" class="ms-[10px] mb-[7px] grid grid-cols-2 gap-3">
                  <div
                      v-for="(attachment, index) in msg.attachments"
                      :key="index"
                      class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">

                    <!-- Image preview -->

                    <a target="_blank"  v-if="isImage(attachment)" :href="attachment">
                      <img :src="attachment"
                          alt="Attachment"
                          class="w-full h-[100px] object-cover rounded-xl"
                      />
                    </a>

                    <!-- File download preview -->
                    <div v-else class="flex items-center p-3 gap-2">
                      <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" stroke-width="2"
                           viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="M12 4v16m8-8H4"/>
                      </svg>
                      <a :href="attachment" target="_blank" class="text-sm text-blue-600 underline truncate max-w-[120px]">
                        {{ getFilename(attachment) }}
                      </a>
                    </div>
                  </div>
                </div>
              </p>
              <p class="text-white text-[10.085px] ms-[17px] inline-block">{{ msg.time }}</p>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <p class="text-center text-[#C6C6C7] text-sm mt-10">No messages yet.</p>
      </template>
    </div>

    <!-- Chat Input -->
    <div v-if="!isClosed" class="flex items-center gap-2 mt-4">
      <div class="flex-1 relative h-[50px] rounded-[13px] overflow-hidden">
        <input v-model="newMessage" type="text" placeholder="Type a message"
          class="ps-[23px] w-full h-full text-sm outline-none border border-[#D8D8D8] bg-white text-[#959595] font-light text-[14px] leading-normal" />
        <button class="absolute h-full end-0 px-[19px] cursor-pointer" @click="attach">
          <AttachIcon />
        </button>
      </div>
      <button :disabled="!newMessage.trim()"
        class="w-[48px] h-[50px] rounded-[13px] bg-[#EBE4DF] flex items-center justify-center text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        @click="send">
        <SendIcon />
      </button>

    </div>

    <!-- Closed Message -->
    <div v-else class="text-center mt-6">
      <ClosedIcon class="mx-auto mb-2" />
      <p class="text-[#C6C6C7] font-medium text-[18px] leading-normal">This chat has been closed</p>
      <p class="text-[#C6C6C7] font-[400] text-[15px] leading-normal">You cannot reply to this chat</p>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useToast, useApi } from '#imports'
import SendIcon from '~/components/icons/SendIcon.vue'
import AttachIcon from '~/components/icons/AttachIcon.vue'
import ClosedIcon from '~/components/icons/ClosedIcon.vue'

const props = defineProps({
  messages: Array,
  isClosed: Boolean,
  ticketId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['send','refresh'])

const newMessage = ref('')
const fileInput = ref(null)
const selectedFiles = ref([])
const toast = useToast()

function attach() {
  fileInput.value?.click()
}

async function handleFileUpload(event) {
  const file = event.target.files?.[0]
  console.log('file',file)
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    toast.add({ title: 'File must be under 5MB', color: 'error' })
    return
  }

  const formData = new FormData()
  formData.append('message', '') // أو أي رسالة تبيها
  formData.append('attachments[0]', file)

  try {
    const { data } = await useApi(`customer-service/feedbacks/${props.ticketId}/replies`, {
      method: 'POST',
      body: formData
    })

    if (data.value?.status) {
      toast.add({ title: 'File uploaded successfully', color: 'success' })
      emit('refresh') // عشان تضيفها بالشاشة
    } else {
      toast.add({ title: 'Upload failed', color: 'error' })
    }
  } catch (err) {
    console.error('Upload error:', err)
    toast.add({ title: 'Upload error occurred', color: 'error' })
  }
}


async function send() {
  if (!newMessage.value.trim() && selectedFiles.value.length === 0) return

  const formData = new FormData()
  formData.append('ticket_id', props.ticketId)
  if (newMessage.value.trim()) {
    formData.append('message', newMessage.value.trim())
  }
  selectedFiles.value.forEach((file) => {
    formData.append('file[]', file)
  })

  try {
    const { data } = await useApi(`customer-service/feedbacks/${props.ticketId}/replies`, {
      method: 'POST',
      body: formData
    })

    if (data.value?.status) {
      toast.add({ title: 'Message sent successfully', color: 'success' })
      emit('refresh') // عشان تضيفها بالشاشة
      newMessage.value = ''
      selectedFiles.value = []
      fileInput.value.value = '' // reset input
    } else {
      toast.add({ title: 'Failed to send message', color: 'error' })
    }
  } catch (err) {
    console.error('Send error:', err)
    toast.add({ title: 'Send error occurred', color: 'error' })
  }
}

const isImage = (url) => {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
};

const getFilename = (url) => {
  try {
    return decodeURIComponent(url.split('/').pop());
  } catch {
    return 'File';
  }
};
</script>
