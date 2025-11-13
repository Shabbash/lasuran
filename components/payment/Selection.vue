<template>
  <div class="p-[24px] pb-[40px] rounded-[16px] border border-[#E7E7E7] bg-[#EBE4DF]">
    <h2
      class="select-payment text-center text-[#A0576F] mb-[32px] text-[23px] font-bold leading-normal"
    >
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
        :disabled="buttonsDisabled || isLoading(pm.id)"
        :class="[
          'rounded-[12px] px-[30px] h-[104px] text-[20px] justify-start gap-[27px]',
          selected === pm.id ? ' ring-2 ring-[#A0576F] ring-offset-2' : 'ring-0',
          pm.code === 'ONL' ? 'online_btn--payment' : '',
          pm.code === 'COD' ? 'cod_btn--payment' : ''
        ]"
      >
        <span>{{ pm.name }}</span>
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { COMPONENTS } from '~/data/constants'
import { useCart } from '~/stores/cart'
import { useApp } from '~/stores/app'
import { useToast, navigateTo } from '#imports'

const cartModule = useCart()
const appModule = useApp()
const toast = useToast()

const selected = ref<number | null>(null)

const paymentMethods = computed(() => cartModule.getPaymentMethods ?? [])

// Disable all buttons while order is loading
const buttonsDisabled = computed(() => cartModule.isOrderLoading === true)

// Show loading state only on the selected button
const isLoading = (methodId: number) =>
  cartModule.isOrderLoading && methodId === selected.value

const selectPaymentMethod = (pm: any) => {
  if (buttonsDisabled.value) return

  selected.value = pm.id
  cartModule.setPaymentMethod(pm.id)

  const code = pm.code?.toUpperCase()

  // Common success handler after createOrder
  const handleSuccess = (response: any) => {
    const r = response?.data ?? response ?? {}
    const paymentUrl = r?.payment?.create_token_url?.url

    if (code === 'ONL') {
      // ✅ Online payment → go to /secure-payment with iframe
      if (paymentUrl) {
        // Close the dialog first
        appModule.setDialogShow(false)

        navigateTo({
          path: '/secure-payment',
          query: { url: paymentUrl }
        })
      } else {
        toast?.add({
          title: 'Payment error',
          description: 'Missing payment URL from server.',
          color: 'error'
        })
      }
    } else if (code === 'COD') {
      // ✅ Cash on Delivery → create order, clear cart, go to bookings
      toast?.add({
        title: 'Order created successfully',
        description: 'Cash on Delivery selected.',
        color: 'success'
      })

      // Close the dialog
      appModule.setDialogShow(false)

      // Refresh the cart quietly
      cartModule.fetchCart({}, { disableLoading: true })

      // Redirect to bookings
      navigateTo('/dashboard/bookings')
    }
  }

  const handleError = (err: any) => {
    console.error('Order creation failed:', err)
    toast?.add({
      title: 'Order failed',
      description: err?.message || 'Could not create order. Please try again.',
      color: 'error'
    })
  }

  // 🔥 Create order once, behavior depends on payment code
  cartModule.createOrder({}, handleSuccess, handleError)
}
</script>

<style>
.online_btn--payment {
  margin-bottom: 20px;
  color: #fff;
  background-color: #A0576F;
}

.online_btn--payment::before {
  content: url(/public/assets/img/online-icon.svg);
}

.cod_btn--payment {
  color: #A0576F;
  background-color: #EAC1B7;
}

.cod_btn--payment::before {
  content: url(/public/assets/img/cash-icon.svg);
}
</style>
