<template>
  <UButton
    :label="label"
    :loading="loading"
    :disabled="disabled"
    class="w-full justify-center transition cursor-pointer leading-[100%] tracking-[0]"
    v-bind="attrs"
  >
    <slot />
  </UButton>
</template>

<script lang="ts" setup>
defineOptions({ inheritAttrs: false })

import { useAttrs } from 'vue'

const attrs = useAttrs()

const props = defineProps({
  label: {
    type: String,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>
