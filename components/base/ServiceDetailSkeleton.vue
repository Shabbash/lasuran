<template>
  <div class="bg-[#A0576F1A] rounded-[20px] p-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Image Skeleton -->
      <div>
        <USkeleton class="w-full h-[300px] rounded-[20px]" />
      </div>
      
      <!-- Content Skeleton -->
      <div class="space-y-6">
        <!-- Title Skeleton -->
        <USkeleton class="h-8 w-3/4" />
        
        <!-- Price Skeleton -->
        <USkeleton class="h-6 w-1/3" />
        
        <!-- Duration Skeleton -->
        <div class="flex items-center gap-2">
          <USkeleton class="h-5 w-5 rounded-full" />
          <USkeleton class="h-5 w-1/4" />
        </div>
        
        <!-- Description Skeleton -->
        <div class="space-y-2">
          <USkeleton class="h-4 w-full" />
          <USkeleton class="h-4 w-full" />
          <USkeleton class="h-4 w-3/4" />
        </div>
        
        <!-- Options Skeleton -->
        <div class="space-y-3">
          <USkeleton class="h-6 w-1/3" />
          <div class="grid grid-cols-2 gap-3">
            <USkeleton class="h-12 w-full rounded-full" />
            <USkeleton class="h-12 w-full rounded-full" />
            <USkeleton class="h-12 w-full rounded-full" />
            <USkeleton class="h-12 w-full rounded-full" />
          </div>
        </div>
        
        <!-- Button Skeleton -->
        <USkeleton class="h-12 w-full rounded-full mt-6" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props or logic needed for the skeleton component
</script>
