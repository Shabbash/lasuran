<template>
  <UModal v-model:open="show" :ui="{
    overlay: 'bg-black/47',
    header: 'border-none justify-between p-0 !p-0 inline-block w-auto absolute end-[28px] top-[24px] min-h-auto z-[2] ',
    body: 'border-none w-full p-0 !p-0 overflow-y-auto',
    footer: 'justify-end max-w-[473px] w-full mx-auto p-0',
    content: `bg-[#EBE4DF] rounded-[30px] ${modalMaxWidth} w-full overflow-hidden`
  }" v-bind="options">
    <!-- Close -->

    <template #close  v-if="!(options.hasOwnProperty('close') && !options.close)" >
      <slot name="close" >
        <button @click="closeModal"
          class="w-[42px] h-[42px] rounded-full bg-[#A0576F] text-white flex items-center justify-center hover:bg-[#913E5D] transition cursor-pointer">
          <CloseModalIcon/>
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

import CloseModalIcon from '~/components/icons/CloseModalIcon.vue'
const show = defineModel('show');
defineProps({
  modalMaxWidth: {
    type: String,
    default: 'max-w-[638px]'
  },
  options : {
    type: Object,
    default: {}
  }
});


</script>

<style></style>
