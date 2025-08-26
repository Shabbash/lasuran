<template>
   <DashboardMyTickets/>
</template>

<script setup lang="ts">
usePageTitle("titles.tickets")

definePageMeta({
  middleware: 'auth',
  layout:'dashboard'
});
</script>
