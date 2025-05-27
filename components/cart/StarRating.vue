<template>
  <div class="flex justify-center gap-2">
    <button
      v-for="star in 5"
      :key="star"
      :disabled="!props.editable"
      @click="handleClick(star)"
      class="focus:outline-none"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="w-6 h-6 transition"
        :class="modelValue >= star ? 'text-[#FCD7D9]' : 'text-[#F3D5D9]'"
      >
        <path
          d="M12 17.27L18.18 21 16.54 13.97 22 9.24 
             14.81 8.63 12 2 9.19 8.63 2 9.24 
             7.46 13.97 5.82 21z"
        />
      </svg>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: Number,
  editable: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue'])

function handleClick(star) {
  if (!props.editable) return
  emit('update:modelValue', star)
}
</script>
