<template>
  <UModal
    v-model:open="show"
    :class="modalMaxWidth"
    :ui="{
      overlay: 'bg-black/47 ',
      header: 'border-none justify-between p-0 !p-0 inline-block w-auto absolute end-[28px] top-[24px] min-h-auto z-[2] ',
      body: 'border-none w-full p-0 !p-0 overflow-y-auto',
      footer: 'justify-end max-w-[473px] w-full mx-auto p-0 ',
      content: `bg-[#EBE4DF] rounded-[30px] ${modalMaxWidth} w-full overflow-hidden lasuran-modal`
    }"
    :prevent-close="disableClose"
    v-bind="options"
  >
    <!-- Header (we keep it empty, close button is in #close slot) -->
    <template #header></template>

    <!-- Close button -->
    <template
      #close
      v-if="!(options.hasOwnProperty('close') && !options.close)"
    >
      <slot name="close">
        <button
          @click="closeModal"
          :disabled="disableClose"
          class="w-[42px] h-[42px] rounded-full bg-[#A0576F] text-white flex items-center justify-center transition"
          :class="disableClose
            ? 'opacity-40 cursor-not-allowed pointer-events-none'
            : 'hover:bg-[#913E5D] cursor-pointer'"
        >
          <CloseModalIcon />
        </button>
      </slot>
    </template>

    <!-- Body -->
    <template #body>
      <slot name="body"></slot>
    </template>

    <!-- Footer -->
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CloseModalIcon from '~/components/icons/CloseModalIcon.vue'
import { useCart } from '~/stores/cart'

const props = defineProps({
  options: {
    type: Object,
    default: () => ({})
  }
})

// v-model:show from parent → we forwardه إلى UModal v-model:open
const show = defineModel<boolean>('show')

// Modal max width comes from options, with a default
const modalMaxWidth = computed(
  () => props.options?.modalMaxWidth ?? 'max-w-[638px]'
)

// Order loading state from cart store
const cart = useCart()
const isOrderProcessing = computed(() => cart.isOrderLoading === true)

// Control close availability per-modal
// - disableClose: true  → لا يمكن إغلاق المودال بأي طريقة
// - lockCloseOnOrderLoading + isOrderProcessing → يمنع الإغلاق فقط أثناء الدفع في المودال الذي يطلب ذلك
const disableClose = computed(() => {
  if (props.options?.disableClose === true) {
    return true
  }

  if (props.options?.lockCloseOnOrderLoading === true && isOrderProcessing.value) {
    return true
  }

  return false
})

const emit = defineEmits(['close'])

const closeModal = () => {
  // Do not allow closing while disabled
  if (disableClose.value) return

  show.value = false
  emit('close')
}
</script>

<style></style>
