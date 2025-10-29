<template>
  <div class="p-[24px] pb-[40px] rounded-[16px] border border-[#E7E7E7] bg-[#EBE4DF]">
    <h2 class="select-payment text-center text-[#A0576F] mb-[32px] text-[23px] font-bold leading-normal">
      {{ $t('payment_details_title') }}
    </h2>

    <p class="text-center text-[#5B605C] text-[17px] font-[350] mb-[32px]">
      {{ $t('payment_select_method') }}
    </p>

    <div class="payment-selection container">
      <BaseButton
        v-for="pm in paymentMethods"
        :key="pm.id"
        @click="selectPaymentMethod(pm)"
        :loading="isLoading(pm.id)"
        :disabled="false"
        :class="[
          'rounded-[12px] px-[30px] h-[104px] text-[20px] justify-start gap-[27px]',
          selected === pm.id ? ' ring-2 ring-[#A0576F] ring-offset-2' : 'ring-0',
          pm.code === 'ONL' ? 'online_btn--payment' : '',
          pm.code === 'COD' ? 'cod_btn--payment' : ''
        ]"
      ><span>{{ pm.name }}</span>
        
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { COMPONENTS } from '~/data/constants'

const cartModule = useCart()
const appModule = useApp()

const selected = ref<number | null>(null)
const paymentMethods = computed(() => cartModule.getPaymentMethods ?? [])
const buttonsDisabled = computed(() => cartModule.isOrderLoading === true)
const isLoading = (methodId: number) =>
  cartModule.isOrderLoading && methodId === selected.value

const selectPaymentMethod = (pm: any) => {
  selected.value = pm.id
  cartModule.setPaymentMethod(pm.id)

  const code = pm.code?.toUpperCase()

  if (code === 'ONL') {
    cartModule.createOrder({}, () => {
      appModule.setDialogComponent(COMPONENTS.PAYMENT_CREATE_CARD)
      appModule.setDialogShow(true)
    })
  } else if (code === 'COD') {
    cartModule.createOrder({}, () => {
      const toast = useToast?.()
      toast?.add({ title: 'Order created (COD)', description: 'Cash on Delivery selected.' })
    })
  }
}
</script>

<style>
.online_btn--payment {

  margin-bottom: 20px;
  color: #fff;
  background-color: #A0576F;
}


.online_btn--payment::before{
  content: url(/public/assets/img/online-icon.svg);
}
.cod_btn--payment {
  background-color: #bfbfbf; /* Example color for COD */
  color: #A0576F;
  background-color: #EAC1B7;
}

.cod_btn--payment::before{

  content: url(/public/assets/img/cash-icon.svg);

}
</style>
