<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage></NuxtPage>
    </NuxtLayout>
  </UApp>
</template>
<script lang="ts" setup>
useHead({
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' }
  ]
})
</script>