

<template>
<h1> this is payment selection </h1>
  <div class="payment-selection container p-8 mt-4">
    <BaseButton v-for="paymentMethod in cartModule.getPaymentMethods" @click="selectPaymentMethod(paymentMethod)"  :loading="isLoading(paymentMethod.id)">
      {{ paymentMethod.name }}
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import {COMPONENTS} from "~/data/constants";

const cartModule = useCart();
const appModule = useApp();
const selected = ref(null);
const selectPaymentMethod = function (paymentMethod:any) {
  selected.value = paymentMethod.id;
  cartModule.setPaymentMethod(paymentMethod.id);
  cartModule.createOrder({} , (data: any) => {

    appModule.setDialogComponent(COMPONENTS.PAYMENT_CREATE_CARD)
    // appModule.setDialogShow(true);
  })
}

const isLoading = function (methodId : any) {
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

<style scoped>

</style>