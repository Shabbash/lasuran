<template>
  <div class="w-full">
    <!-- Title comes from parent -->
    <h2 v-if="title" class="text-[#EBE4DF] text-[17px] font-medium leading-normal mb-[16px]">
      {{ title }}
    </h2>
    <!-- Radio Group -->
    <URadioGroup
      v-model="model"
      :items="items"
      :ui="uiMerged"
    />
  </div>
</template>

<script setup lang="ts">
import type { RadioGroupItem, RadioGroupValue } from '@nuxt/ui'

/** Props */
const props = defineProps<{
  modelValue: RadioGroupValue
  items: RadioGroupItem[]
  /** Pass 'ordermethod-option' or 'gender-option' */
  variantClass?: string
  /** Title shown above the group */
  title?: string
}>()

/** Emits */
const emit = defineEmits<{
  (e: 'update:modelValue', value: RadioGroupValue): void
  (e: 'change', value: RadioGroupValue): void
}>()

/** Computed v-model */
const model = computed<RadioGroupValue>({
  get: () => props.modelValue,
  set: v => { emit('update:modelValue', v); emit('change', v) }
})

/** Default UI config */
const defaultUi = {
  root: 'root',
  fieldset: 'flex-row w-full items-center bg-[#EBE4DF] rounded-full py-[5px] px-[6px]',
  item: 'flex items-start flex-row text-sm flex-1 text-[#5B605C] text-[15px] font-normal leading-normal',
  container: 'hidden',
  base: 'ring ring-inset ring-accented overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary size-4 relative isolate flex w-full rounded-[24px] transition-all',
  indicator: 'indicator',
  wrapper: 'w-full m-0',
  label: 'h-[43px] rounded-full flex items-center justify-center text-[#5B605C] text-[15px] font-normal leading-normal',
  description: 'description'
}

/** Merge UI */
const uiMerged = computed(() => ({
  ...defaultUi,
  item: [defaultUi.item, props.variantClass || 'radio-item'].join(' ')
}))
</script>


<style>
  .gender-option:has(span[data-state="checked"]) label {
    background-color: #6B8B9B;
    color: #fff;
}

  .menu-option:has(span[data-state="checked"]) label {
    background-color: #6B8B9B;
    color: #fff;
}

  .ordermethod-option:has(span[data-state="checked"]) label {
    background-color: #A0576F;
    color: #fff;

}

</style>