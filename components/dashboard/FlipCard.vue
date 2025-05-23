<template>
  <div class=" perspective cursor-pointer" @click="flipped = !flipped">
    <div
      class="relative w-full h-full min-h-[210px] transition-transform duration-500 transform-style-preserve-3d"
      :class="{ 'rotate-y-180': flipped }"
    >
      <!-- Front Side -->
      <div
        class="absolute w-full h-full backface-hidden"
      >
        <slot name="front" />
      </div>

      <!-- Back Side -->
      <div
        class="absolute w-full h-full backface-hidden rotate-y-180"
      >
        <slot name="back" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const flipped = ref(false)
</script>

<style scoped>
.perspective {
  perspective: 1000px;
}
.transform-style-preserve-3d {
  transform-style: preserve-3d;
}
.backface-hidden {
  backface-visibility: hidden;
}
.rotate-y-180 {
  transform: rotateY(180deg);
}
</style>
