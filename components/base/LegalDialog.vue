<template>
  <Dialog :show="true" modalMaxWidth="max-w-[800px]">
    <template #body>
      <div class="h-[90vh] max-w-[800px] bg-[#EBE4DF] md:rounded-[30px] overflow-hidden pt-[40px] ps-[10px] md:ps-[20px]">
        <iframe
          v-if="url"
          :src="url"
          class="w-full h-full border-none rounded-[30px]"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from '~/components/base/Dialog.vue'

const props = defineProps<{
  url: string
}>()
</script>
