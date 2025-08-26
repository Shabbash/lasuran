<template>
  <DashboardMyWallet />
</template>

<script setup lang="ts">
usePageTitle("titles.wallet")

definePageMeta({
  middleware: 'auth',
  layout:'dashboard'
});
</script>
