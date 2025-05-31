<template>
  <Container>
    <NuxtLayout name="dashboard">
    </NuxtLayout>
  </Container>
</template>

<script setup lang="ts">
// Apply auth middleware to protect this page
definePageMeta({
  middleware: 'auth'
});

import Container from '@/components/base/Container.vue'
</script>
