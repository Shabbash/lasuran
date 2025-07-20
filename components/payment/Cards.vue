<template>
  <div class="payment-cards">
    <div class="card" v-for="card in cartModule.getSavedCards">
       {{ card }}
    </div>
  </div>
  <BaseButton @click="addNewCard">   {{ $t('payment_add_new_card') }} </BaseButton>
</template>

<script setup lang="ts">
import {COMPONENTS} from "~/data/constants";

const appModule = useApp();
const cartModule = useCart()
const addNewCard = function () {
  appModule.setDialogComponent(COMPONENTS.PAYMENT_CREATE_CARD);
}
</script>

<style scoped>

</style>