<template>
  <DashboardMyGiftCards />
</template>

<script setup lang="ts">
usePageTitle("titles.giftcards")

definePageMeta({
  middleware: 'auth',
  layout:'dashboard'
});
</script>
