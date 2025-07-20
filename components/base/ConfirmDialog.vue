<template>
  <div class="px-[50px] pt-[34px] pb-[30px] text-center bg-[#EBE4DF] rounded-[30px] text-[#5F2C3E]">
    <!-- Icon -->
    <svg class="mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" width="106" height="105" viewBox="0 0 106 105" fill="none">
      <path d="M53.4121 3.28125C26.2434 3.28125 4.19336 25.3313 4.19336 52.5C4.19336 79.6687 26.2434 101.719 53.4121 101.719C80.5809 101.719 102.631 79.6687 102.631 52.5C102.631 25.3313 80.5809 3.28125 53.4121 3.28125ZM53.4121 82.0312C49.8027 82.0312 46.8496 79.0781 46.8496 75.4688C46.8496 71.8594 49.8027 68.9062 53.4121 68.9062C57.0215 68.9062 59.9746 71.8594 59.9746 75.4688C59.9746 79.0781 57.0215 82.0312 53.4121 82.0312ZM60.9262 31.1391L58.7277 57.4547C58.4981 60.2109 56.2012 62.3438 53.4121 62.3438C50.623 62.3438 48.3262 60.2109 48.0965 57.4547L45.898 31.1391C45.5371 26.7422 48.9824 22.9688 53.4121 22.9688C54.4032 22.9688 55.3845 23.164 56.3002 23.5432C57.2158 23.9225 58.0478 24.4784 58.7486 25.1792C59.4493 25.88 60.0052 26.7119 60.3845 27.6276C60.7638 28.5432 60.959 29.5246 60.959 30.5156C60.959 30.7125 60.959 30.9422 60.9262 31.1391Z" fill="#C44E4E"/>
    </svg>

    <!-- Title + Message -->
    <h2 class="text-[#A0576F] text-[20px] font-bold mb-[5px] leading-normal">{{ t(dialogTitle) }}</h2>
    <p class="text-[#5B605C] text-[16px] mb-[24px] leading-normal">{{ t(message) }}</p>

    <!-- Buttons -->
    <div class="space-y-[10px]">
      <BaseButton
        :label="t(confirmText)"
        :loading="loading"
        :disabled="loading"
        :class="confirmButtonClass"
        @click="handleConfirm"
      />
      <BaseButton
        :label="t(cancelText)"
        :class="cancelButtonClass"
        @click="show = false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const show = defineModel<boolean>('show')

const props = defineProps({
  dialogTitle: String,
  message: String,
  confirmText: { type: String, default: 'confirm' },
  cancelText: { type: String, default: 'cancel' },
  loading: { type: Boolean, default: false },
  confirmButtonClass: { type: String, default: '' },
  cancelButtonClass: { type: String, default: '' },
  modalMaxWidth: { type: String, default: 'max-w-[356px]' },
  onConfirm: Function
})

const handleConfirm = () => {
  if (props.onConfirm) props.onConfirm()
  show.value = false
}
</script>
