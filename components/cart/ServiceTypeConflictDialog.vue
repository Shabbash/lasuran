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
      {{ t('conflict_title') }}
    </h3>

    <!-- Message -->
    <p class="text-[#C6C6C7] text-[14px] mb-6 leading-relaxed">
      {{ t('conflict_message_line1') }}
      <br><br>
      <span class="font-medium">{{ t('conflict_current_cart') }}</span> {{ currentServiceTypeLabel }}
      <br>
      <span class="font-medium">{{ t('conflict_new_item') }}</span> {{ newServiceTypeLabel }}
      <br><br>
      {{ t('conflict_message_line2') }}
    </p>

    <!-- Actions -->
    <div class="flex gap-3">
      <button @click="handleCancel"
        class="flex-1 px-4 py-3 bg-transparent border border-[#EBE4DF] text-[#EBE4DF] rounded-[100px] text-[14px] font-medium hover:bg-[#EBE4DF] hover:text-[#A0576F] transition-colors">
        {{ t('conflict_cancel_button') }}
      </button>
      <button @click="handleClearCart" :disabled="isClearing"
        class="flex-1 px-4 py-3 bg-[#EBE4DF] text-[#A0576F] rounded-[100px] text-[14px] font-medium hover:bg-[#D6C5CB] transition-colors disabled:opacity-50">
        <div v-if="isClearing" class="flex items-center justify-center gap-2">
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-[#A0576F]"></div>
          {{ t('conflict_clearing') }}
        </div>
        <span v-else>{{ t('conflict_clear_continue') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { SERVICE_TYPES } from '@/data/constants'

const { t } = useI18n()

// Props & Emits
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

// Dialog open/close binding
const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
})

// Button loading state
const isClearing = ref(false)

// Convert internal service type to label
const getServiceTypeLabel = (serviceType: string | null) => {
  switch (serviceType) {
    case SERVICE_TYPES.ONLINE:
      return t('service_type_online')
    case SERVICE_TYPES.FOOD:
      return t('service_type_food')
    case SERVICE_TYPES.RESERVATION:
      return t('service_type_reservation')
    default:
      return serviceType ?? ''
  }
}

// Labels for current/new types
const currentServiceTypeLabel = computed(() => getServiceTypeLabel(props.currentServiceType))
const newServiceTypeLabel = computed(() => getServiceTypeLabel(props.newServiceType))

// Cancel button handler
const handleCancel = () => {
  emit('cancel')
  isOpen.value = false
}

// Clear cart button handler
const handleClearCart = async () => {
  isClearing.value = true
  try {
    emit('clear-cart')
  } finally {
    isClearing.value = false
  }
}
</script>
