<script setup lang="ts">

</script>

<template>
  <div class="p-10">
    <div class="flex items-center justify-center flex-col gap-4 p-6 rounded-xl bg-white text-gray-800">
      <div class="relative w-10 h-10">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin w-full h-full text-primary" />
      </div>
      <p class="text-lg font-semibold text-center">
        {{ $t('payment_loading') }}
      </p>
    </div>
  </div>
</template>

<style scoped>

</style>