<template>
  <Container>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:px-6 py-10 bg-[#A0576F1A]">
      <!-- Cart List -->
      <div class="lg:col-span-2 space-y-6 md:h-[450px] md:overflow-y-auto">
        <div class="flex justify-between">
          <h2 class="text-[#EBE4DF] text-[20px] font-medium leading-normal">Cart</h2>
          <!-- <button @click="confirmEmptyCartOpen = true" :disabled="cartModule.isEmptying || cartProducts.length === 0"
            class="text-[#EBE4DF] text-[14px] font-[350] leading-normal cursor-pointer">
            <EmptyCartIcon />
          </button> -->

          <button
            @click="openEmptyCartDialog"
            :disabled="cartModule.isEmptying || cartProducts.length === 0"
            class="text-[#EBE4DF] text-[14px] font-[350] leading-normal cursor-pointer">
            <EmptyCartIcon />
          </button>
        </div>

        <div v-if="!cartModule.isLoading && cartProducts.length > 0">
          <div class="flex justify-between md:px-[29px] border-b border-b-[#AD7084] pb-[14px] mb-[14px]">
            <p class="flex-1 text-[#EBE4DF] text-[14px] font-[350] leading-normal">Package</p>
            <div class="flex flex-1 justify-end">
              <p class="flex-2 text-[#EBE4DF] text-[14px] font-[350] leading-normal hidden md:block">Duration</p>
              <p class="flex-1 text-[#EBE4DF] text-[14px] font-[350] leading-normal hidden md:block">Price</p>
              <p class="md:flex-1 text-[#EBE4DF] text-[14px] font-[350] leading-normal justify-end">Action</p>
            </div>
          </div>

          <div>
            <template v-for="(item, index) in cartProducts" :key="item.cart_product_id || index">
              <CartItem v-if="item?.type !== 'gift_card'" :item="formatCartItem(item)" @toggle="toggleItem(index)"
                @remove="removeCartItem(item)" @edit="editCartItem(item)" />
              <CartItemGiftCard v-else :card="item" @remove="removeCartItem(item)" />
            </template>


          </div>
        </div>

        <div v-else-if="cartModule.isLoading" class="space-y-4">
          <CartItemSkeleton v-for="i in 3" :key="i" />
        </div>

        <div v-else class="flex items-center justify-center h-full">
          <img src="/assets/img/empty-card.svg" alt="empty cart" />
        </div>
      </div>

      <!-- Payment Summary -->
      <template v-if="!cartModule.isLoading">
        <PaymentSummary :services-count="cartProducts.length" :subtotal="cartModule.getSubtotal"
          :vat="cartModule.getVat" :discount="cartModule.getDiscount" :service-cost="cartModule.getServiceCost"
          :total="cartModule.getTotal" @checkout="checkoutModalOpen = true" />
      </template>

      <template v-else>
        <PaymentSummarySkeleton />
      </template>
    </div>

    <!-- Checkout Dialog -->
    <Dialog v-model:open="checkoutModalOpen" :modalMaxWidth="'max-w-[539px]'">
      <template #body>
        <div class="pt-[24px] pb-[50px] px-[28px]">
          <h2 class="font-bold text-[30px] text-[#A0576F] leading-[100%] mb-[25px]">Payment Method</h2>
          <p class="text-[#5B605C] text-[14px] font-[350] mb-[15px]">Select your preferred payment method:</p>

          <URadioGroup v-model="selectedPayment" orientation="vertical" indicator="hidden" variant="card"
            :items="paymentOptions" class="flex flex-col gap-4" :ui="{
              root: 'relative block',
              fieldset: 'flex flex-col gap-4 radiogroup',
              item: 'h-[80px] rounded-[16px] flex items-center gap-3 bg-[#E6CDC7A3] border-0 px-[19px] py-[14px] text-[15px] font-normal leading-normal has-data-[state=checked]:bg-[#A0576F] has-data-[state=checked]:text-[#EBE4DF]',
              container: 'flex items-center gap-3',
              label: 'text-[#A0576F] font-medium'
            }">
            <template #leading="{ item }">
              <img :src="item.icon" alt="icon" class="w-[24px] h-[24px]" />
            </template>
          </URadioGroup>

          <BaseButton label="Continue"
            class="bg-[#A0576F] text-white rounded-[100px] w-full py-[16px] mt-[50px] justify-center text-[18px] font-normal leading-[100%] tracking-[0] border border-[#A0576F] hover:bg-[#913E5D] transition cursor-pointer disabled:bg-[#A0576F]" />
        </div>
      </template>
    </Dialog>


    <!-- Confirm Empty Cart Dialog -->
    <!-- <Dialog v-model:open="confirmEmptyCartOpen" :modalMaxWidth="'max-w-[458px]'">
      <template #body>
        <div class="bg-decore-modal mx-auto rounded-[30px] overflow-hidden shadow-lg bg-[#EBE4DF] text-[#5F2C3E]">
          <div class="pt-[34px] px-[50px] pb-[30px] relative text-center">
            <svg class="mx-auto" xmlns="http://www.w3.org/2000/svg" width="110" height="110" viewBox="0 0 110 110"
              fill="none">
              <path
                d="M55.0001 0.0490723C24.7344 0.0490723 0.170898 24.6125 0.170898 54.8783C0.170898 85.144 24.7344 109.707 55.0001 109.707C85.2658 109.707 109.829 85.144 109.829 54.8783C109.829 24.6125 85.2658 0.0490723 55.0001 0.0490723ZM55.0001 87.7758C50.9793 87.7758 47.6895 84.486 47.6895 80.4652C47.6895 76.4444 50.9793 73.1546 55.0001 73.1546C59.0209 73.1546 62.3106 76.4444 62.3106 80.4652C62.3106 84.486 59.0209 87.7758 55.0001 87.7758ZM63.3707 31.0824L60.9216 60.3977C60.6658 63.4682 58.1071 65.8441 55.0001 65.8441C51.8931 65.8441 49.3344 63.4682 49.0785 60.3977L46.6295 31.0824C46.2274 26.1843 50.0654 21.9807 55.0001 21.9807C56.1041 21.9807 57.1973 22.1982 58.2174 22.6207C59.2374 23.0432 60.1641 23.6625 60.9448 24.4431C61.7255 25.2238 62.3448 26.1506 62.7673 27.1706C63.1898 28.1906 63.4072 29.2838 63.4072 30.3879C63.4072 30.6072 63.4072 30.8631 63.3707 31.0824Z"
                fill="#C44E4E" />
            </svg>
            <h2 class="text-[#A0576F] text-center font-bold text-[22px] leading-normal mt-[16px]">Remove All Services
            </h2>
            <p class="text-[#5B605C] text-center font-normal text-[18px] leading-normal mb-[28px]">Are you sure you want to remove
              all of your services from the cart?</p>

            <div class="space-y-[10px]">
              <BaseButton label="Yes, Remove All" :loading="cartModule.isEmptying" :disabled="cartModule.isEmptying"
                class="h-[49px] bg-[#C44E4E] hover:bg-[#913E5D] rounded-[100px] disabled:opacity-50 disabled:bg-[#A0576F] text-[#EBE4DF] font-normal text-[20px] not-italic leading-normal"
                @click="handleConfirmEmptyCart" />

              <BaseButton label="No, Cancel"
                class="h-[49px] bg-[#6B8B9B] rounded-[100px] hover:bg-[#5a7886] text-[#EBE4DF] font-normal text-[20px] not-italic leading-normal"
                @click="confirmEmptyCartOpen = false" />
            </div>
          </div>
        </div>
      </template>
    </Dialog> -->


  </Container>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Container from '@/components/base/Container.vue'
import CartItem from '~/components/cart/CartItem.vue'
import CartItemGiftCard from '~/components/cart/CartItemGiftCard.vue'
import CartItemSkeleton from '~/components/cart/CartItemSkeleton.vue'
import EmptyCartIcon from '~/components/icons/EmptyCartIcon.vue'
import PaymentSummary from '~/components/cart/PaymentSummary.vue'
import PaymentSummarySkeleton from '~/components/cart/PaymentSummarySkeleton.vue'
import Dialog from '@/components/base/Dialog.vue'
import BaseButton from '@/components/base/Button.vue'
import { useCart } from '~/stores/cart'
import { useApp } from '~/stores/app'
import { useMenu } from '~/stores/menu'
import { COMPONENTS } from '~/data/constants'

definePageMeta({ middleware: 'auth' })

const cartModule = useCart()
const menuModule = useMenu()
const { setDialogComponent, setDialogShow } = useApp()

const expandedItems = ref<{ [key: string]: boolean }>({})
const checkoutModalOpen = ref(false)
const selectedPayment = ref('cash')

const handleConfirmEmptyCart = async () => {
  await cartModule.emptyCart()
  setDialogShow(false)
}

const openEmptyCartDialog = () => {
  setDialogComponent(COMPONENTS.CONFIRM_DIALOG, {
    title: 'Remove All Services',
    message: 'Are you sure you want to remove all of your services from the cart?',
    confirmText: 'Yes, Remove All',
    cancelText: 'No, Cancel',
    modalMaxWidth: 'max-w-[458px]',
    loading: cartModule.isEmptying,
    confirmButtonClass: 'h-[49px] bg-[#C44E4E] hover:bg-[#913E5D] text-white rounded-[100px] text-[16px]',
    cancelButtonClass: 'h-[49px] bg-[#6B8B9B] text-white hover:bg-[#5a7886] rounded-[100px] text-[16px]',
    onConfirm: handleConfirmEmptyCart
  })
  setDialogShow(true)
}

const paymentOptions = [
  { label: 'Cash on Delivery', value: 'cash', icon: '/assets/img/icon-cash.svg' },
  { label: 'Online Payment', value: 'online', icon: '/assets/img/icon-online.svg' }
]

onMounted(() => cartModule.fetchCart())

const cartProducts = computed(() => cartModule.getProducts as any[])

const formatCartItem = (item: any) => ({
  ...item,
  id: item.id,
  product_id: item.product_id || item.id,
  cart_product_id: item.cart_product_id,
  image: item.image || '/assets/img/service-1.png',
  name: item.name || 'Gift Card',
  duration: item.start_time && item.end_time ? `${item.start_time} - ${item.end_time}` : '1 Hour',
  price: item.price_with_tax || item.unit_price_with_tax || item.price || 0,
  professional: item.branch?.name || '',
  date: item.date || '',
  expanded: expandedItems.value[item.id] || false,
  serial_number: item.serial_number,
  expiry_date: item.expiry_date,
  type: item.type
})

const toggleItem = (index: number) => {
  const item = cartProducts.value[index]
  if (item?.id) expandedItems.value[item.id] = !expandedItems.value[item.id]
}

const removeCartItem = (item: any) => {
  if (item?.cart_product_id) cartModule.removeProduct(item.cart_product_id)
}

const editCartItem = (item: any) => {
  const original = cartProducts.value.find(p => p.cart_product_id === item.cart_product_id)
  if (!original) return
  const productData = original.products?.[0] || original
  const serviceData = {
    ...productData,
    id: productData.id || original.id,
    product_id: productData.id,
    cart_product_id: item.cart_product_id,
    image: item.image,
    branch_id: original.branch?.id || original.branch_id,
    selectedExtension: original.selectedExtension || '',
    selectedTime: item.duration?.split('-')?.[0]?.trim() || '',
    date: item.date || '',
    _isEditing: true
  }
  menuModule.setService(serviceData)
  setDialogComponent(COMPONENTS.SERVICE_APPOINTMENT)
  setDialogShow(true)
}

const emptyCart = () => cartModule.emptyCart()
</script>

<style>
.radiogroup label:has(*[data-state="checked"]) p {
  color: #EBE4DF !important;
}
</style>