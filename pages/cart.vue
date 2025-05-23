<template>
  <Container>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 py-10 bg-[#A0576F1A]">
      <!-- Cart List -->
      <div class="lg:col-span-2 space-y-6 h-[450px] overflow-y-auto">

          <div class="flex justify-between">
            <h2 class="text-[#EBE4DF] text-[20px] font-medium leading-normal">Cart</h2>
            <button
              @click="emptyCart"
              :disabled="cartModule.isEmptying || cartProducts.length === 0"
              class="text-[#EBE4DF] text-[14px] font-[350] leading-normal">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                <g clip-path="url(#clip0_2106_5409)">
                  <path
                    d="M24.375 30H5.625C2.51818 30 0 27.4818 0 24.375V5.625C0 2.51818 2.51818 0 5.625 0H24.375C27.4818 0 30 2.51818 30 5.625V24.375C30 27.4818 27.4818 30 24.375 30Z"
                    fill="#E4D1C7" />
                  <path
                    d="M15 5.5C9.76209 5.5 5.5 9.76209 5.5 15C5.5 20.2379 9.76209 24.5 15 24.5C20.2379 24.5 24.5 20.2379 24.5 15C24.5 9.76209 20.2379 5.5 15 5.5ZM18.4984 17.3797C18.8072 17.6884 18.8072 18.1897 18.4984 18.4996C18.425 18.5731 18.3378 18.6313 18.2419 18.6711C18.1459 18.7108 18.0431 18.7312 17.9392 18.7312C17.8353 18.7313 17.7324 18.7109 17.6364 18.6711C17.5403 18.6314 17.4531 18.5731 17.3796 18.4996L15 16.12L12.6203 18.4996C12.5469 18.573 12.4596 18.6313 12.3636 18.6711C12.2676 18.7108 12.1647 18.7313 12.0608 18.7312C11.9569 18.7313 11.854 18.711 11.7581 18.6712C11.6621 18.6315 11.5749 18.5732 11.5016 18.4996C11.1928 18.1909 11.1928 17.6895 11.5016 17.3797L13.88 15L11.5004 12.6203C11.1917 12.3116 11.1917 11.8103 11.5004 11.5004C11.8092 11.1905 12.3105 11.1916 12.6204 11.5004L15 13.88L17.3796 11.5004C17.6884 11.1917 18.1897 11.1917 18.4996 11.5004C18.8095 11.8092 18.8083 12.3105 18.4996 12.6204L16.12 15L18.4984 17.3797Z"
                    fill="#C44E4E" />
                </g>
                <defs>
                  <clipPath id="clip0_2106_5409">
                    <rect width="30" height="30" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </button>
          </div>
        <div v-if="!cartModule.isLoading && cartProducts.length > 0">
          <div class="flex justify-between px-[29px] border-b border-b-[#AD7084] pb-[14px] mb-[14px]">
            <p class="flex-1 text-[#EBE4DF] text-[14px] font-[350] leading-normal">Package</p>
            <div class="flex flex-1 justify-end">
              <p class="flex-1 text-[#EBE4DF] text-[14px] font-[350] leading-normal">Duration</p>
              <p class="flex-1 text-[#EBE4DF] text-[14px] font-[350] leading-normal">Price</p>
              <p class="flex-1 text-[#EBE4DF] text-[14px] font-[350] leading-normal">Action</p>
            </div>
          </div>
          <div class="">
            <CartItem
              v-for="(item, index) in cartProducts"
              :key="item.id || index"
              :item="formatCartItem(item)"
              @toggle="toggleItem(index)"
              @remove="removeCartItem(item)"
              @edit="editCartItem(item)"

            />
          </div>
        </div>

        <div v-else-if="cartModule.isLoading" class="space-y-4">
          <CartItemSkeleton v-for="i in 3" :key="i" />
        </div>

        <div v-else class="flex items-center justify-center h-full">
          <img src="/public/assets/img/empty-card.svg" />
        </div>
      </div>
      <!-- Payment Summary -->
      <template v-if="!cartModule.isLoading">
        <PaymentSummary
          :services-count="cartProducts.length"
          :subtotal="cartModule.getSubtotal"
          :vat="cartModule.getVat"
          :discount="cartModule.getDiscount"
          :service-cost="cartModule.getServiceCost"
          :total="cartModule.getTotal"
        />
      </template>
      <template v-else>
        <PaymentSummarySkeleton />
      </template>
    </div>
  </Container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Container from '@/components/base/Container.vue'
import CartItem from '@/components/base/CartItem.vue'
import CartItemSkeleton from '@/components/base/CartItemSkeleton.vue'
import PaymentSummary from '@/components/base/PaymentSummary.vue'
import PaymentSummarySkeleton from '@/components/base/PaymentSummarySkeleton.vue'
import { useCart } from '~/stores/cart'
import { COMPONENTS } from '~/data/constants'

// Initialize cart store
const cartModule = useCart()
const expandedItems = ref<{[key: string]: boolean}>({})
const { setDialogComponent, setDialogShow } = useApp()
const menuModule = useMenu()

// Fetch cart data on component mount
onMounted(() => {
  cartModule.fetchCart()
})

// Get products from cart store
const cartProducts = computed(() => {
  return cartModule.getProducts as any[]
})

// Format cart item for display
const formatCartItem = (item: any) => {
  // Preserve all original data but format for display
  const formattedItem = {
    // Preserve all original properties
    ...item,

    // Format display properties
    id: item.id,
    product_id: item.product_id || item.id,
    cart_product_id: item.cart_product_id,
    image: item.image || '/public/assets/img/service-1.png',
    name: item.name || 'Service',
    duration: item.start_time && item.end_time ? `${item.start_time} - ${item.end_time}` : '1 Hour',
    price: item.price_with_tax || item.unit_price_with_tax || 0,
    professional: item.branch?.name || '',
    date: item.date || '',
    expanded: expandedItems.value[item.id] || false,

    // Preserve these properties for editing
    branch_id: item.branch_id,
    selectedExtension: item.selectedExtension,
    selectedTime: item.selectedTime || (item.start_time || ''),
  };

  return formattedItem;
}

// Toggle expanded state of cart item
const toggleItem = (index: number) => {
  const item = cartProducts.value[index]
  if (item && item.id) {
    expandedItems.value[item.id] = !expandedItems.value[item.id]
  }
}

// Remove item from cart
const removeCartItem = (item: any) => {
  if (item && item.cart_product_id) {
    cartModule.removeProduct(item.cart_product_id)
  }
}
const editCartItem = (item: any) => {
  console.log('Editing cart item:', item);

  // Find the original cart item from the cart products
  const originalItem = cartProducts.value.find(product => product.cart_product_id === item.cart_product_id);

  if (!originalItem) {
    console.error('Original cart item not found:', item.cart_product_id);
    return;
  }

  console.log('Original cart item found:', originalItem);

  // Extract time from duration if available
  let selectedTime = '';
  if (item.duration && item.duration.includes('-')) {
    const times = item.duration.split('-');
    if (times.length > 0) {
      selectedTime = times[0].trim();
    }
  }

  // Get the product data from the original item
  // If the original item has a products array, use the first product
  const productData = originalItem.products && originalItem.products.length > 0
    ? originalItem.products[0]
    : originalItem;

  // Create a properly formatted service object for editing
  const serviceData = {
    // Include essential data for the service
    id: productData.id || originalItem.product_master_id || originalItem.id || item.id,
    product_id: productData.id || originalItem.product_master_id || originalItem.id,
    cart_product_id: item.cart_product_id, // Critical for updating
    name: item.name || productData.name,
    image: item.image || productData.image,
    price: item.price || productData.price,
    duration: item.duration,
    description: productData.description,

    // Include any additional data from the original item
    branch_id: originalItem.branch?.id || originalItem.branch_id,

    // Include editing-specific data
    selectedExtension: originalItem.selectedExtension || '',
    selectedTime: selectedTime || item.start_time || '',
    date: item.date || '',

    // Include any additional data that might be needed for the update
    start_at: item.start_at || null,
    end_at: item.end_at || null,

    // Add a custom property to track that this is an edit operation
    // This won't be sent to the API but will be used by our code
    _isEditing: true
  };

  // Store the edit flag in a way that won't interfere with the API
  // We'll use this in our code but it won't be sent to the server
  Object.defineProperty(serviceData, 'is_editing', {
    value: true,
    enumerable: false, // Make it non-enumerable so it doesn't show up in JSON
    configurable: true,
    writable: true
  });

  // Also store the cart_product_id as a non-enumerable property to ensure it's preserved
  // This is a backup in case the API response doesn't include it
  Object.defineProperty(serviceData, '_original_cart_product_id', {
    value: item.cart_product_id,
    enumerable: false,
    configurable: true,
    writable: true
  });

  // Log the service data we're about to set
  console.log('Setting service data for editing:', serviceData);

  // Make sure the _isEditing flag is set as an enumerable property
  // This ensures it will be preserved when the object is copied
  serviceData._isEditing = true;

  // Set the service in the menu store
  // Our updated setService method will handle preserving the editing state
  menuModule.setService(serviceData);

  setDialogComponent(COMPONENTS.SERVICE_SHOW);
  setDialogShow(true);
};


// Empty the cart
const emptyCart = () => {
  cartModule.emptyCart()
}
</script>
