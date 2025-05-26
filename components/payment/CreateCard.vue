<template>
<!--  <div class="row">-->
<!--    <div class="col-lg-7 my-5">-->
<!--      <h4 class="main-color Yesteryear">-->
<!--        {{ ("Enter your card information") }}-->
<!--      </h4>-->
<!--      <form>-->
<!--        <div class="mb-3">-->
<!--          <UInput-->
<!--              type="text"-->
<!--              class="form-control"-->
<!--              :placeholder="('Card Number')"-->
<!--              v-model="form.card_number"-->
<!--              id="card_number"-->
<!--              name="card_number"-->
<!--              @input="limitInputLength(16, 'card_number', $event)"-->
<!--          />-->

<!--        </div>-->
<!--        <div class="row">-->
<!--          <div class="col-lg-6 mb-3">-->
<!--            <UInput-->
<!--                type="text"-->
<!--                class="form-control"-->
<!--                :placeholder="('Card holder name')"-->
<!--                v-model="form.card_holder_name"-->
<!--            />-->

<!--          </div>-->
<!--          <div class="col-lg-6 mb-3">-->
<!--            <UInput-->
<!--                type="text"-->
<!--                class="form-control"-->
<!--                :placeholder="('CVV')"-->
<!--                v-model="form.card_security_code"-->
<!--            />-->

<!--          </div>-->
<!--        </div>-->
<!--        <div class="row">-->
<!--          <div class="col-lg-6">-->
<!--            <UInput-->
<!--                type="text"-->
<!--                class="form-control mb-3"-->
<!--                :placeholder="('Expiry Date Month Ex: (05)')"-->
<!--                v-model="form.expiry_date_month"-->
<!--                id="expiry_date_month"-->
<!--                name="expiry_date_month"-->
<!--                @input="-->
<!--                            limitInputLength(2, 'expiry_date_month', $event)-->
<!--                          "-->
<!--            />-->

<!--          </div>-->
<!--          <div class="col-lg-6">-->
<!--            <UInput-->
<!--                type="text"-->
<!--                class="form-control mb-3"-->
<!--                :placeholder="('Expiry Date Year Ex: (25)')"-->
<!--                v-model="form.expiry_date_year"-->
<!--                id="expiry_date_year"-->
<!--                name="expiry_date_year"-->
<!--                @input="-->
<!--                            limitInputLength(2, 'expiry_date_year', $event)-->
<!--                          "-->
<!--            />-->

<!--          </div>-->
<!--        </div>-->
<!--        &lt;!&ndash; {{ FormData.remember_me }} &ndash;&gt;-->
<!--        &lt;!&ndash; {{ remember_me_ }} &ndash;&gt;-->
<!--        <div-->
<!--            class="form-check form-switch d-flex align-items-center"-->
<!--        >-->
<!--          <input-->
<!--              class="form-check-input"-->
<!--              type="checkbox"-->
<!--              role="switch"-->
<!--              id="flexSwitchCheckDefault"-->
<!--              v-model="form.remember_me"-->
<!--          />-->
<!--          <label-->
<!--              class="form-check-label ms-3"-->
<!--              for="flexSwitchCheckDefault"-->
<!--          >-->
<!--            {{ ("Remember me") }}</label-->
<!--          >-->
<!--        </div>-->
<!--        <div class="text-end">-->
<!--          <button-->
<!--              type="button"-->
<!--              class="button btn main-bk shadow border btn-lg mt-5 mb-4 px-5 w-100"-->
<!--              @click="doPayment"-->
<!--          >-->
<!--            {{ ("Add Card") }}-->
<!--          </button>-->
<!--        </div>-->
<!--      </form>-->
<!--    </div>-->
<!--  </div>-->

  <div class="payment-frame">
    <iframe
        v-if="iframeUrl"
        :src="iframeUrl"
        frameborder="0"
        width="100%"
        height="600"
        allowpaymentrequest
    ></iframe>
  </div>
</template>

<script setup lang="ts">

const form = ref({
  card_number: null,
})
const cartModule = useCart();
const iframeUrl = computed(() => cartModule.payment?.create_token_url?.url)
function limitInputLength(limit:any, field:any, event) {
  let value = event.target.value;
  // Remove non-digit characters
  value = value.replace(/\D/g, "");
  // Limit length
  value = value.slice(0, limit);
  // Update FormData2
  if (form.value) form.value[field] = value;
}

const doPayment = function (){
  console.log()

}

onMounted(() => {
  window.addEventListener('message', (event) => {
    if (event.data?.type === 'paymob-payment') {
      if (event.data.success) {
        alert('Payment successfully created!');
      } else {
        alert('Payment error!');

      }
    }
  })
})
</script>



<style scoped>

</style>