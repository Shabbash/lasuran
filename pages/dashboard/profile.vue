<template>
   <DashboardMyProfile />
</template>

<script setup lang="ts">

usePageTitle("titles.profile")

definePageMeta({
  middleware: 'auth',
  layout:'dashboard'
});
</script>
