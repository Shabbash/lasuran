<template>
  <div v-if="pagination?.total > pagination?.per_page" class="mt-10 flex justify-center">
    <UPagination
      v-model:page="localPage"
      :total="pagination.total"
      :page-count="pagination.per_page"
      @update:page="handlePageChange"
      :ui="{
        root: '',
        list: '',
        ellipsis: '',
        label: '',
        first: 'cursor-pointer text-[#EBE4DF] bg-transparent disabled:text-[#EBE4DF] disabled:bg-transparent disabled:opacity-[.5]',
        prev: 'cursor-pointer text-[#EBE4DF] bg-transparent disabled:text-[#EBE4DF] disabled:bg-transparent disabled:opacity-[.5]',
        item: 'cursor-pointer text-[#EBE4DF] bg-transparent hover:text-[#A0576F] hover:bg-[#EBE4DF] data-[selected=true]:text-[#A0576F] data-[selected=true]:bg-[#EBE4DF]',
        next: 'cursor-pointer text-[#EBE4DF] bg-transparent disabled:text-[#EBE4DF] disabled:bg-transparent disabled:opacity-[.5]',
        last: 'cursor-pointer text-[#EBE4DF] bg-transparent disabled:text-[#EBE4DF] disabled:bg-transparent disabled:opacity-[.5]'
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = defineProps<{
  pagination: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}>()

const emit = defineEmits<{
  (event: 'change', page: number): void
}>()

// Local page state synced with props
const localPage = ref(props.pagination.current_page || 1)

// Watch for external updates to pagination and sync
watch(
  () => props.pagination.current_page,
  (newVal) => {
    if (newVal !== localPage.value) {
      localPage.value = newVal
    }
  }
)

// Emit to parent when changed
const handlePageChange = (page: number) => {
  emit('change', page)
}
</script>
