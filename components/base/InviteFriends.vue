<template>
  <div class="bg-decore-modal mx-auto rounded-[30px] overflow-hidden shadow-lg bg-[#EBE4DF] text-[#5F2C3E]">
    <div class="pt-[34px] px-[30px] pb-[30px] relative">
      <!-- Title -->
      <h2 class="text-[#A0576F] text-[18px] font-bold leading-normal text-center mb-[20px]">Invite a Friend</h2>

      <!-- Loading State -->
    <InviteFriendSkeleton v-if="isLoading" />

      <!-- Content -->
      <template v-else-if="data">
        <!-- Illustration -->
        <div class="flex justify-center mb-4">
          <img :src="data.image_page" alt="Invite Illustration" class="w-[120px] h-[120px]" />
        </div>

        <!-- Description -->
        <p class="px-[10px] py-[20px] rounded-[16px] bg-[#A0576F] text-[#EBE4DF] text-center text-[16px] font-[350] whitespace-pre-line">
          {{ data.content_page }}
        </p>

        <!-- Invite Box -->
        <div class="bg-[#EBE4DF] text-[#A0576F] rounded-[20px] px-4 py-3 flex items-center justify-between gap-2 mt-[20px]">
          <div class="text-left">
            <p class="text-xs font-medium">Your Code</p>
            <p class="text-sm font-bold tracking-wide">{{ data.invitation_code }}</p>
          </div>

          <BaseButton @click="copyCode"
            class="bg-[#A0576F] text-white rounded-full px-5 py-2 text-sm font-medium hover:bg-[#913E5D] transition whitespace-nowrap">
            {{ copied ? 'Copied!' : 'INVITE' }}
          </BaseButton>
        </div>
      </template>

      <!-- Error -->
      <div v-else class="text-center text-red-500">Failed to load data.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast, useApi, useAuth } from '#imports'
import BaseButton from '@/components/base/Button.vue'
import InviteFriendSkeleton from '@/components/skeletons/InviteFriendSkeleton.vue'

const toast = useToast()
const auth = useAuth()
const data = ref<any>(null)
const copied = ref(false)
const isLoading = ref(true)

onMounted(async () => {
  try {
    const { data: res } = await useApi('settings/invite-friend', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${auth.getToken}`
      }
    })
    if (res.value?.status) {
      data.value = res.value.data
    } else {
      toast.add({ title: 'Failed to load invite data', color: 'error' })
    }
  } catch (err) {
    console.error('Error loading invite friend data:', err)
    toast.add({ title: 'API Error', color: 'error' })
  } finally {
    isLoading.value = false
  }
})

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(data.value?.invitation_code)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    toast.add({ title: 'Copy failed', color: 'error' })
  }
}
</script>
