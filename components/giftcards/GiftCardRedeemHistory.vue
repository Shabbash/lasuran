<template>
  <div class="bg-decore-modal">
    <div class="relative px-[18px] py-[30px]">
      <h2 class="mb-[30px] text-[#A0576F] text-center font-medium text-[21px] not-italic leading-normal">
        {{ $t('gift_card_redeem_history') }}
      </h2>

      <!-- Dynamic Redeem History -->
      <div v-if="redeemHistory.length > 0">
        <div
          v-for="(history, index) in redeemHistory"
          :key="index"
          class="flex border-b border-b-[#0014471A] pb-[10px] gap-[10px] mb-[35px]"
        >
          <div>
            <img src="/assets/img/earned.svg" alt="Earned" />
          </div>
          <div>
            <p class="text-[#5B605C] font-[350] text-[14px] mb-[2px]">{{ history.date || 'N/A' }}</p>
            <p class="text-[#5B605C] font-[350] text-[14px] mb-[2px]">
              {{ $t('gift_card_order_number') }}: {{ history.order_number || 'N/A' }}
            </p>
            <p class="text-[#6B8B9B] font-medium text-[15px]">
              {{ $t('gift_card_redeemed') }}: {{ history.amount || '0' }}
              <template v-if="props.selectedCard?.currency">
                {{ props.selectedCard.currency }}
              </template>
              <template v-else>
                <span class="sar-icon">&#xe900;</span>
              </template>
            </p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-8">
        <p class="text-[#5B605C] font-[350] text-[14px]">
          {{ $t('gift_card_redeem_history_empty') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  selectedCard: any
}>()

const redeemHistory = computed(() => {
  return props.selectedCard?.redeem_history || []
})
</script>
