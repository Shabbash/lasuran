<template>
  <div class="chat-box flex flex-col justify-between flex-1">
    <!-- Messages List -->
    <div class="space-y-4">
      <div v-for="(msg, index) in messages" :key="index">
        <!-- Inbound Message -->
        <div v-if="msg.direction === 'inbound'" class="flex gap-[15px]">
          <div
            class="w-[35px] h-[35px] rounded-full bg-[#EBE4DF] flex items-center justify-center text-[#A0576F] text-sm font-bold">
            H</div>
          <div>
            <p class="text-[#EBE4DF] font-medium text-[14.119px] mb-[10px]">{{ msg.from }}</p>
            <p
              class="text-[#5B605C] text-[14px] bg-[#F2F7FB] p-[12px] rounded-[16px] rounded-ss-none ms-[10px] mb-[7px] inline-block">
              {{ msg.text }}</p>
            <p class="text-white text-[10.085px] ms-[17px]">{{ msg.time }}</p>
          </div>
        </div>

        <!-- Outbound Message -->
        <div v-else class="flex justify-end gap-3">
          <div class="text-end">
            <p
              class="text-white text-[14px] bg-[#6B8B9B] p-[12px] rounded-[16px] rounded-se-none mb-[7px]">
              {{ msg.text }}</p>
            <p class="text-white text-[10.085px] ms-[17px] inline-block">{{ msg.time }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Chat Input -->
    <div v-if="!isClosed" class="flex items-center gap-2 mt-4">
      <div class="flex-1 relative h-[50px] rounded-[13px] overflow-hidden">
        <input
          v-model="newMessage"
          type="text"
          placeholder="Type a message"
          class="ps-[23px] w-full h-full text-sm outline-none border border-[#D8D8D8] bg-white text-[#959595] font-light text-[14px] leading-normal" />
        <button class="absolute h-full end-0 px-[19px]" @click="attach">
          <AttachIcon />
        </button>
      </div>
      <button
        class="w-[48px] h-[50px] rounded-[13px] bg-[#EBE4DF] flex items-center justify-center text-white"
        @click="send">
        <SendIcon />
      </button>
    </div>

    <div v-else class="text-center"> 
        <ClosedIcon class="mx-auto" />
        <p class="text-[#C6C6C7] font-medium text-[18px] leading-normal">This chat has been closed</p>
        <p class="text-[#C6C6C7] font-[400] text-[15px] leading-normal">You cannot reply to this chat</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SendIcon from '~/components/icons/SendIcon.vue'
import AttachIcon from '~/components/icons/AttachIcon.vue'
import ClosedIcon from '~/components/icons/ClosedIcon.vue'

const props = defineProps({
  messages: {
    type: Array,
    default: () => []
  },
   isClosed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['send'])

const newMessage = ref('')

function send() {
  if (newMessage.value.trim()) {
    emit('send', newMessage.value.trim())
    newMessage.value = ''
  }
}

function attach() {
  console.log('Attach clicked')
}
</script>

<style scoped>
</style>