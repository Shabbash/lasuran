<template>
  <div class="bg-[#EBE4DF] rounded-[20px] overflow-hidden shadow-md">
    <!-- Image Skeleton -->
    <USkeleton class="w-full h-[200px]" />
    
    <!-- Content Skeleton -->
    <div class="p-4 space-y-3">
      <!-- Title Skeleton -->
      <USkeleton class="h-6 w-3/4" />
      
      <!-- Price and Duration Skeleton -->
      <div class="flex justify-between">
        <USkeleton class="h-5 w-1/3" />
        <USkeleton class="h-5 w-1/4" />
      </div>
      
      <!-- Description Skeleton -->
      <USkeleton class="h-4 w-full" />
      <USkeleton class="h-4 w-5/6" />
      
      <!-- Button Skeleton -->
      <USkeleton class="h-10 w-full rounded-full mt-4" />
    </div>
  </div>
</template>

<script setup lang="ts">
// No props or logic needed for the skeleton component
</script>
