<template>

      <div class="bg-[#A0576F] rounded-[20px] p-6 text-center">
        <!-- Icon -->
        <div class="mx-auto w-16 h-16 bg-[#EBE4DF] rounded-full flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-[#A0576F]" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd" />
          </svg>
        </div>

        <!-- Title -->
        <h3 class="text-[#EBE4DF] text-[18px] font-bold mb-2">
          Service Type Conflict
        </h3>

        <!-- Message -->
        <p class="text-[#C6C6C7] text-[14px] mb-6 leading-relaxed">
          Your cart contains items from a different service type.
          <br><br>
          <span class="font-medium">Current cart:</span> {{ currentServiceTypeLabel }}
          <br>
          <span class="font-medium">New item:</span> {{ newServiceTypeLabel }}
          <br><br>
          You must clear your cart to add items from a different service type.
        </p>

        <!-- Actions -->
        <div class="flex gap-3">
          <button @click="handleCancel"
            class="flex-1 px-4 py-3 bg-transparent border border-[#EBE4DF] text-[#EBE4DF] rounded-[100px] text-[14px] font-medium hover:bg-[#EBE4DF] hover:text-[#A0576F] transition-colors">
            Cancel
          </button>
          <button @click="handleClearCart" :disabled="isClearing"
            class="flex-1 px-4 py-3 bg-[#EBE4DF] text-[#A0576F] rounded-[100px] text-[14px] font-medium hover:bg-[#D6C5CB] transition-colors disabled:opacity-50">
            <div v-if="isClearing" class="flex items-center justify-center gap-2">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-[#A0576F]"></div>
              Clearing...
            </div>
            <span v-else>Clear Cart & Continue</span>
          </button>
        </div>
      </div>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import Dialog from '@/components/base/Dialog.vue'
import { SERVICE_TYPES } from '@/data/constants'

interface Props {
  open: boolean
  currentServiceType: string | null
  newServiceType: string | null
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'clear-cart'): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

watch(() => props.currentServiceType, (val) => {
  console.log('🧪 currentServiceType updated:', val)
}, { immediate: true })

watch(() => props.newServiceType, (val) => {
  console.log('🧪 newServiceType updated:', val)
}, { immediate: true })


console.log('currentServiceType:', props.currentServiceType)
console.log('newServiceType:', props.newServiceType)

const isClearing = ref(false)

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
})

// Get service type labels
const getServiceTypeLabel = (serviceType: string) => {
  switch (serviceType) {
    case SERVICE_TYPES.ONLINE:
      return 'Online Store'
    case SERVICE_TYPES.FOOD:
      return 'Food Ordering'
    case SERVICE_TYPES.RESERVATION:
      return 'Service Reservation'
    default:
      return serviceType
  }
}

const currentServiceTypeLabel = computed(() => getServiceTypeLabel(props.currentServiceType))
const newServiceTypeLabel = computed(() => getServiceTypeLabel(props.newServiceType))

const handleCancel = () => {
  emit('cancel')
  isOpen.value = false
}

const handleClearCart = async () => {
  isClearing.value = true
  try {
    emit('clear-cart')
  } finally {
    isClearing.value = false
  }
}
</script>
