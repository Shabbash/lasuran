<template>

  <div class="p-[24px] pb-[40px] rounded-[16px] border border-[#E7E7E7] bg-[#EBE4DF]">
    <h2 class="select-payment text-[#A0576F] mb-[16px] text-[20px] font-medium leading-normal">Payment Details</h2>
    <p class="text-[#5B605C] text-[14px] font-[350">Select your preferred payment method</p>

    <div class="payment-selection container p-8 mt-4">
      <BaseButton v-for="paymentMethod in cartModule.getPaymentMethods" @click="selectPaymentMethod(paymentMethod)"
        :loading="isLoading(paymentMethod.id)" class="disabled:bg-transparent">
        {{ paymentMethod.name }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { COMPONENTS } from "~/data/constants";

const cartModule = useCart();
const appModule = useApp();
const selected = ref(null);
const selectPaymentMethod = function (paymentMethod: any) {
  selected.value = paymentMethod.id;
  cartModule.setPaymentMethod(paymentMethod.id);
  cartModule.createOrder({}, (data: any) => {

    appModule.setDialogComponent(COMPONENTS.PAYMENT_CREATE_CARD)
    appModule.setDialogShow(true);
  })
}

const isLoading = function (methodId: any) {
  return cartModule.isOrderLoading && methodId == selected.value;
}

// function openPaymentWindow(url:any) {
//   const loginWindow = window.open(
//       url,
//       'LoginPopup',
//       'width=600,height=700'
// );
//
//   // Listen for postMessage from the popup
//   window.addEventListener('message', function(event) {
//     console.log('EVENT', event)
//     // You can add origin check for security
//     // if (event.origin !== 'http://your-app.com') return;
//
//     if (event.data === 'sso-auth-success') {
//       // Close the popup
//       loginWindow.close();
//
//       // Optionally refresh or redirect
//       window.location.reload();
//     }
//   }, false);
// }
</script>

<style scoped></style>