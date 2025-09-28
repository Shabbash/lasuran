<template>
  <div class="relative min-h-[215px] cursor-pointer" @click="$emit('select', product)">
    <!-- Background Layer -->
    <div class="absolute inset-0 top-[75px] rounded-[24px] bg-[#EBE4DF]"></div>

    <!-- Product Content -->
    <div class="absolute inset-0 flex flex-col justify-between h-full">
      <!-- Image -->
      <div>
        <img
          class="mx-auto h-full object-cover inset-0 relative"
          :src="product.image_url"
          :alt="product.title"
        />
      </div>

      <!-- Info & Favorite -->
      <div class="pb-[17px] px-[15px] flex items-end justify-between">
        <div class="flex flex-col gap-[8px]">
          <h3 class="text-[#A0566E] text-[15px] font-[350] leading-none line-clamp-1">
            {{ product.title }}
          </h3>
          <p class="text-[#A0566E] text-[12px] font-bold tracking-[-0.236px] leading-none">
            {{ product.price }}
          </p>
        </div>

        <!-- Favorite Button -->
        <button
          class="w-[24px] h-[24px] rounded-full flex items-center justify-center border border-[#A0576F] bg-[#A0576F]"
        >
          <OutlineHeartIcon />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
defineProps({
  product: {
    type: Object,
    required: true
  }
})

// Emits
defineEmits(['select'])

// Icon
import OutlineHeartIcon from '@/components/icons/OutlineHeartIcon.vue'
</script>
