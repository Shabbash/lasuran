<template>
  <div class="bg-[#A0576F1A] rounded-[20px] p-4 mb-4">
    <div class="flex justify-between items-center">
      <!-- Service Image Skeleton -->
      <div class="flex items-center gap-4">
        <USkeleton class="w-[80px] h-[80px] rounded-[10px]" />
        
        <!-- Service Name Skeleton -->
        <USkeleton class="h-6 w-[120px]" />
      </div>
      
      <!-- Price and Actions Skeleton -->
      <div class="flex items-center gap-6">
        <USkeleton class="h-5 w-[60px]" />
        <USkeleton class="h-5 w-[60px]" />
        <USkeleton class="w-[24px] h-[24px] rounded-md" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props or logic needed for the skeleton component
</script>
