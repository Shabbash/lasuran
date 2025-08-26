// composables/usePageTitle.ts
// Helper composable to set a localized <title> for each page.
// Usage example in a page: usePageTitle('titles.services')

import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '#imports'

export function usePageTitle(key: string) {
  const { t } = useI18n()

  // Create a computed title that reacts to locale changes
  const title = computed(() => t(key))

  // Apply the title to the page head
  useHead({ title })

  return title
}
