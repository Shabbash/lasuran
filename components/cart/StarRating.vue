<template>
  <div class="flex justify-between">
    <button
      v-for="star in 5"
      :key="star"
      :disabled="!editable"
      @click="handleClick(star)"
      class="focus:outline-none w-[43px] h-[39px] p-0 m-0"
    >
      <component :is="modelValue >= star ? FilledStar : OutlineStar" />
    </button>
  </div>
</template>

<script setup>
import FilledStar from '~/components/icons/FilledStar.vue'
import OutlineStar from '~/components/icons/OutlineStar.vue'

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  editable: { type: Boolean, default: true },
})

const emit = defineEmits(['update:modelValue'])

function handleClick(star) {
  if (props.editable) emit('update:modelValue', star)
}
</script>
