<template>
  <div class="bg-[#EBE4DF] rounded-[20px] p-6 space-y-4">
    <!-- Title Skeleton -->
    <USkeleton class="h-6 w-1/2 mb-6" />
    
    <!-- Price Items Skeleton -->
    <div class="space-y-4">
      <div class="flex justify-between">
        <USkeleton class="h-5 w-1/3" />
        <USkeleton class="h-5 w-1/4" />
      </div>
      
      <div class="flex justify-between">
        <USkeleton class="h-5 w-1/3" />
        <USkeleton class="h-5 w-1/4" />
      </div>
      
      <div class="flex justify-between">
        <USkeleton class="h-5 w-1/3" />
        <USkeleton class="h-5 w-1/4" />
      </div>
      
      <div class="flex justify-between">
        <USkeleton class="h-5 w-1/3" />
        <USkeleton class="h-5 w-1/4" />
      </div>
    </div>
    
    <!-- Divider Skeleton -->
    <USkeleton class="h-[1px] w-full my-4" />
    
    <!-- Total Skeleton -->
    <div class="flex justify-between">
      <USkeleton class="h-6 w-1/3" />
      <USkeleton class="h-6 w-1/4" />
    </div>
    
    <!-- Checkbox Skeleton -->
    <div class="flex items-center gap-2 mt-4">
      <USkeleton class="h-5 w-5 rounded" />
      <USkeleton class="h-5 w-3/4" />
    </div>
    
    <!-- Button Skeleton -->
    <USkeleton class="h-12 w-full rounded-full mt-6" />
  </div>
</template>

<script setup lang="ts">
// No props or logic needed for the skeleton component
</script>
