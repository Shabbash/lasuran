<template>
  <div class="base_card">
    <div v-if="title || $slots.head" class="base_card--head flex justify-between items-center mb-[16px] px-[15px]">
      <slot name="head">
        <h2 class="font-normal text-[white] text-[15px] leading-[1] tracking-[0]">{{ title }}</h2>
        <a
          v-if="withAction"
          @click="onActionClick"
          href="javascript:;"
          class="font-medium text-[#D29F8C] text-[14px] leading-[1] tracking-[0]"
        >
          {{ t('see_all') }}
        </a>
      </slot>
    </div>

    <div class="base_card--body">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

// Access translation function
const { t } = useI18n()

// Define props
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  withAction: {
    type: Boolean,
    default: false
  }
})

// Emit action-click event
const emit = defineEmits(['action-click'])

const onActionClick = (event: Event) => {
  emit('action-click', event)
}
</script>
