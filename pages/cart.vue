<template>
  <Container>
    <!-- Main Grid Layout for Cart Page -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:px-6 py-10 bg-[#A0576F1A]">

      <!-- 🧼 Cart Items List Section -->
      <div class="lg:col-span-2 space-y-6 md:h-[450px] md:overflow-y-auto">
        <!-- Header with Empty Cart Button -->
        <div class="flex justify-between">
          <h2 class="text-[#EBE4DF] text-[20px] font-medium leading-normal">
            {{ $t('cart_title') }}
          </h2>
          <button
            @click="openEmptyCartDialog"
            :disabled="cartModule.isEmptying || cartProducts.length === 0"
            class="text-[#EBE4DF] text-[14px] font-[350] leading-normal cursor-pointer">
            <EmptyCartIcon />
          </button>
        </div>

        <!-- 📦 Cart Items Table Header -->
        <div v-if="!cartModule.isLoading && cartProducts.length > 0">
          <div class="flex justify-between md:px-[29px] border-b border-b-[#AD7084] pb-[14px] mb-[14px]" v-if="cartModule.getServiceType == SERVICE_TYPES.RESERVATION">
            <p class="flex-1 text-[#EBE4DF] text-[14px] font-[350] leading-normal">{{ $t('cart_package') }}</p>
            <div class="flex flex-1 justify-end">
              <p class="flex-2 text-[#EBE4DF] text-[14px] font-[350] hidden md:block">{{ $t('cart_duration') }}</p>
              <p class="flex-1 text-[#EBE4DF] text-[14px] font-[350] hidden md:block">{{ $t('cart_price') }}</p>
              <p class="md:flex-1 text-[#EBE4DF] text-[14px] font-[350] justify-end">{{ $t('cart_action') }}</p>
            </div>
          </div>

          <div class="flex justify-between md:px-[29px] border-b border-b-[#AD7084] pb-[14px] mb-[14px]" v-if="cartModule.getServiceType == SERVICE_TYPES.ONLINE">
            <p class="flex-1 text-[#EBE4DF] text-[14px] font-[350] leading-normal">{{ $t('cart_item') }}</p>
            <div class="flex flex-1 justify-end">
              <p class="flex-2 text-[#EBE4DF] text-[14px] font-[350] hidden md:block">{{ $t('cart_quantity') }}</p>
              <p class="flex-1 text-[#EBE4DF] text-[14px] font-[350] hidden md:block">{{ $t('cart_price') }}</p>
              <p class="md:flex-1 text-[#EBE4DF] text-[14px] font-[350] justify-end">{{ $t('cart_action') }}</p>
            </div>
          </div>

          <!-- 🔀 Loop through cart items -->
          <div>
            <template v-for="(item, index) in cartProducts" :key="item.cart_product_id || index">
              <CartItem
                v-if="item?.type !== 'gift_card'"
                :item="formatCartItem(item)"
                @toggle="toggleItem(index)"
                @remove="removeCartItem(item)"
                @edit="editCartItem(item)"
              />
              <CartItemGiftCard
                v-else
                :card="item"
                @remove="removeCartItem(item)"
              />
            </template>
          </div>
        </div>

        <!-- 🔄 Skeleton Loading State -->
        <div v-else-if="cartModule.isLoading" class="space-y-4">
          <CartItemSkeleton v-for="i in 3" :key="i" />
        </div>

        <!-- ❌ Empty Cart Placeholder -->
        <div v-else class="flex items-center justify-center h-full">
          <img src="/assets/img/empty-card.svg" :alt="$t('cart_empty_alt')" />
        </div>
      </div>

      <!-- 💳 Payment Summary Panel -->
      <template v-if="!cartModule.isLoading">
        <PaymentSummary
          :services-count="cartProducts.length"
          :subtotal="cartModule.getSubtotal"
          :vat="cartModule.getVat"
          :discount="cartModule?.getDiscount"
          :service-cost="cartModule.getServiceCost"
          :total="cartModule.getTotal"
          @checkout="openCheckoutDialog"
        />
      </template>
      <template v-else>
        <PaymentSummarySkeleton />
      </template>
    </div>
  </Container>
</template>

<script setup lang="ts">
// 🔁 Vue
import { ref, onMounted, computed } from 'vue'

// 🥩 Components
import Container from '@/components/base/Container.vue'
import CartItem from '~/components/cart/CartItem.vue'
import CartItemGiftCard from '~/components/cart/CartItemGiftCard.vue'
import CartItemSkeleton from '~/components/cart/CartItemSkeleton.vue'
import EmptyCartIcon from '~/components/icons/EmptyCartIcon.vue'
import PaymentSummary from '~/components/cart/PaymentSummary.vue'
import PaymentSummarySkeleton from '~/components/cart/PaymentSummarySkeleton.vue'

// 🧪 Stores
import { useCart } from '~/stores/cart'
import { useApp } from '~/stores/app'
import { useMenu } from '~/stores/menu'
import { usePageTitle } from '~/composables/usePageTitle'
import { SERVICE_TYPES } from '~/data/constants'
usePageTitle("titles.cart")

// 🗷 Constants
import { COMPONENTS } from '~/data/constants'

// 🔐 Auth middleware
definePageMeta({ middleware: 'auth' })

// 📆 Store Instances
const cartModule = useCart()
const menuModule = useMenu()
const { setDialogComponent, setDialogShow  ,setDialogOptions } = useApp()

// 📌 Reactive State
const expandedItems = ref<{ [key: string]: boolean }>({})

// 📅 Fetch cart data
onMounted(() => cartModule.fetchCart())

// 🛂 Cart Products
const cartProducts = computed(() => cartModule.getProducts as any[])

// 🗒️ Format cart item
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

// ⬇️ Toggle item expansion
const toggleItem = (index: number) => {
  const item = cartProducts.value[index]
  if (item?.id) expandedItems.value[item.id] = !expandedItems.value[item.id]
}

// 🗑️ Remove item
const removeCartItem = (item: any) => {
  if (item?.cart_product_id) cartModule.removeProduct(item.cart_product_id)
}

// ✏️ Edit item
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
  setDialogOptions({})
  setDialogShow(true)
}

// 🧼 Open empty cart confirmation dialog
const openEmptyCartDialog = () => {
  setDialogComponent(COMPONENTS.CONFIRM_DIALOG, {
    dialogTitle: 'cart_remove_all_title',
    message: 'cart_remove_all_message',
    confirmText: 'cart_remove_all_confirm',
    cancelText: 'cart_remove_all_cancel',
    modalMaxWidth: 'max-w-[458px]',
    loading: cartModule.isEmptying,
    confirmButtonClass: 'h-[49px] bg-[#C44E4E] hover:bg-[#913E5D] text-white rounded-[100px] text-[16px]',
    cancelButtonClass: 'h-[49px] bg-[#6B8B9B] text-white hover:bg-[#5a7886] rounded-[100px] text-[16px]',
    onConfirm: async () => {
      await cartModule.emptyCart()
      setDialogShow(false)
    }
  })
  setDialogShow(true)
}

// 💳 Open checkout payment method dialog
const openCheckoutDialog = () => {
  setDialogComponent(COMPONENTS.CHECKOUT_PAYMENT_DIALOG)
  setDialogShow(true)
}
</script>

<style>
/* ✅ Override radio label color if selected */
.radiogroup label:has(*[data-state="checked"]) p {
  color: #EBE4DF !important;
}
</style>
