<template>
  <div class="flex items-center gap-4">
    <button
      @click="decrease"
      class="w-8 h-8 rounded-full flex items-center justify-center bg-[#C4D3DA] text-white font-bold"
    >
      <span class="text-[#A0576F] text-xl">−</span>
    </button>

    <span class="text-[#A0576F] text-xl font-bold min-w-[24px] text-center">
      {{ formattedCount }}
    </span>

    <button
      @click="increase"
      class="w-8 h-8 rounded-full flex items-center justify-center bg-[#A0576F] text-white font-bold"
    >
      <span class="text-white text-xl">+</span>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 1
  },
  min: {
    type: Number,
    default: 1
  },
  max: {
    type: Number,
    default: Infinity
  }
})

const emit = defineEmits(['update:modelValue'])

const increase = () => {
  if (props.modelValue < props.max) {
    emit('update:modelValue', props.modelValue + 1)
  }
}

const decrease = () => {
  if (props.modelValue > props.min) {
    emit('update:modelValue', props.modelValue - 1)
  }
}

const formattedCount = computed(() => String(props.modelValue).padStart(2, '0'))
</script>
