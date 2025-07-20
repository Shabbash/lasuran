<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage :key="appModule.locale" />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useApp } from '~/stores/app'
import { useHead } from '#imports'

const appModule = useApp()
const { locale, setLocaleMessage } = useI18n()

// Load translation file manually
const loadMessages = async (code: string) => {
  const messages = await import(`~/locales/${code}.json`)
  setLocaleMessage(code, messages.default)
  locale.value = code
}

// Update translation when locale changes
watchEffect(async () => {
  await loadMessages(appModule.locale)
})

// ✅ Reactive HTML lang/dir attributes
const htmlAttrs = computed(() => ({
  lang: appModule.locale,
  dir: appModule.locale === 'ar' ? 'rtl' : 'ltr',
}))

useHead({ htmlAttrs })
</script>
