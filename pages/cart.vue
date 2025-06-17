<template>
  <Container>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:px-6 py-10 bg-[#A0576F1A]">
      <!-- Cart List -->
      <div class="lg:col-span-2 space-y-6 md:h-[450px] md:overflow-y-auto">
        <div class="flex justify-between">
          <h2 class="text-[#EBE4DF] text-[20px] font-medium leading-normal">Cart</h2>
          <button @click="emptyCart" :disabled="cartModule.isEmptying || cartProducts.length === 0"
            class="text-[#EBE4DF] text-[14px] font-[350] leading-normal">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
              <path
                d="M24.375 30H5.625C2.51818 30 0 27.4818 0 24.375V5.625C0 2.51818 2.51818 0 5.625 0H24.375C27.4818 0 30 2.51818 30 5.625V24.375C30 27.4818 27.4818 30 24.375 30Z"
                fill="#E4D1C7" />
              <path
                d="M18.4984 17.3797C18.8072 17.6884 18.8072 18.1897 18.4984 18.4996C18.425 18.5731 18.3378 18.6313 18.2419 18.6711C18.1459 18.7108 18.0431 18.7312 17.9392 18.7312C17.7324 18.7109 17.4531 18.5731 17.3796 18.4996L15 16.12L12.6203 18.4996C12.5469 18.573 12.4596 18.6313 12.3636 18.6711C12.2676 18.7108 12.1647 18.7313 12.0608 18.7312C11.854 18.711 11.5749 18.5732 11.5016 18.4996C11.1928 18.1909 11.1928 17.6895 11.5016 17.3797L13.88 15L11.5004 12.6203C11.1917 12.3116 11.1917 11.8103 11.5004 11.5004C11.8092 11.1905 12.3105 11.1916 12.6204 11.5004L15 13.88L17.3796 11.5004C17.6884 11.1917 18.1897 11.1917 18.4996 11.5004C18.8095 11.8092 18.8083 12.3105 18.4996 12.6204L16.12 15L18.4984 17.3797Z"
                fill="#C44E4E" />
            </svg>
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
          <CartItem v-if="item?.type !== 'gift_card'" :item="formatCartItem(item)" @toggle="toggleItem(index)" @remove="removeCartItem(item)" @edit="editCartItem(item)" />
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
  </Container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Container from '@/components/base/Container.vue'
import CartItem from '~/components/cart/CartItem.vue'
import CartItemGiftCard from '~/components/cart/CartItemGiftCard.vue'
import CartItemSkeleton from '~/components/cart/CartItemSkeleton.vue'
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