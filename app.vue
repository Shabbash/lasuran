<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage :key="appModule.getLocale" />
    </NuxtLayout>
  </UApp>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useHead } from '#imports'
import { useI18n } from 'vue-i18n'
const appModule = useApp()


const { locale } = useI18n()

locale.value=appModule.getLocale

// Compute html attributes reactively based on current locale
const htmlAttrs = computed(() => ({
  lang: locale.value,
  dir: locale.value === 'ar' ? 'rtl' : 'ltr'
}))

useHead({
  htmlAttrs, // pass the computed ref directly for reactivity
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' }
  ]
})
</script>
