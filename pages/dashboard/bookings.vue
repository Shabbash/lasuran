<template>
  <DashboardMyBookings />
</template>

<script setup lang="ts">
usePageTitle("titles.bookings")

definePageMeta({
  middleware: 'auth',
  layout:'dashboard'
});
</script>
