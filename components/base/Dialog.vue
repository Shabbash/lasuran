<template>
  <UModal v-model:open="show" :ui="{
    overlay: 'bg-black/47',
    header: 'border-none justify-between p-0 !p-0 inline-block w-auto absolute end-[28px] top-[24px] min-h-auto z-[2] ',
    body: 'border-none w-full p-0 !p-0 overflow-y-auto',
    footer: 'justify-end max-w-[473px] w-full mx-auto p-0',
    content: `bg-[#EBE4DF] rounded-[30px] ${modalMaxWidth} w-full overflow-hidden`
  }">
    <!-- Close -->
    <template #close>
      <slot name="close">
        <button @click="closeModal"
          class="w-[42px] h-[42px] rounded-full bg-[#A0576F] text-white flex items-center justify-center hover:bg-[#913E5D] transition cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-[20px] h-[20px]" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
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
const show = defineModel('show');

defineProps({
  modalMaxWidth: {
    type: String,
    default: 'max-w-[638px]'
  }
});


</script>

<style></style>
