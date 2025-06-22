<template>
  <Container>
    <!-- Loading State -->
    <ShopSkeleton v-if="productsStore.isLoading" />


    <!-- Error State -->
    <div v-else-if="productsStore.error" class="flex justify-center items-center py-20">
      <div class="text-red-500 text-lg">{{ productsStore.error }}</div>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Slider Section -->
      <div>
        <BaseSlider :items="productsStore.sliders" dots :slide-per-row="1" :slide-per-row-mobile="1" dots-class="dots-style"
          class="shop-slider">
          <template #default="{ item }">
            <div class="w-full">
              <div class="w-full overflow-hidden relative rounded-[23px]">
                <img class="mx-auto h-auto md:h-full w-full object-contain md:object-cover inset-0 relative"
                  :src="item.image_url" />
              </div>
            </div>
          </template>
        </BaseSlider>
      </div>





    <!-- Popular Items Section -->
    <div>
      <div class="w-full mt-[60px] slide-6">
        <BaseCard>
          <template #head>
            <h2 class="text-[#EBE4DF] font-[500] text-[24.665px] leading-none">Popular Items</h2>
          </template>
          <template #default>
            <BaseSlider :items="productsStore.getPopularProducts" :slide-per-row-mobile="2" :slide-per-row="6">
              <template #default="{ item }">
                <div class="relative min-h-[215px] cursor-pointer" @click="openProductModal(item)">
                  <div class="absolute inset-0 top-[75px] rounded-[24px] bg-[#EBE4DF]"></div>
                  <div class="absolute inset-0 flex flex-col justify-between h-full">
                    <div>
                      <img class="mx-auto h-full object-cover inset-0 relative" :src="item.image_url" />
                      
                    </div>
                    <div class="pb-[17px] px-[15px] flex items-end justify-between">
                      <div class="flex flex-col justify-between gap-[8px]">
                        <h3 class="text-[#A0566E] text-[15px] font-[350]">{{ item.title }}</h3>
                        <p class="text-[#A0566E] text-[12px] font-bold leading-none tracking-[-0.236px]">{{ item.price }}</p>
                      </div>
                      <div>
                        <button
                          class="w-[24px] h-[24px] rounded-full flex items-center justify-center border border-[#A0576F] bg-[#A0576F]">
                          
                          <OutlineHeartIcon/>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </BaseSlider>
          </template>
        </BaseCard>
      </div>
    </div>

    <!-- New Arrival Section (Same as Popular) -->
    <div>
      <div class="w-full mt-[60px] slide-6">
        <BaseCard>
          <template #head>
            <h2 class="text-[#EBE4DF] font-[500] text-[24.665px] leading-none">New Arrival</h2>
          </template>
          <template #default>
            <BaseSlider :items="productsStore.getNewProducts" :slide-per-row-mobile="2" :slide-per-row="6">
              <template #default="{ item }">
                <div class="relative min-h-[215px]" @click="openProductModal(item)">
                  <div class="absolute inset-0 top-[75px] rounded-[24px] bg-[#EBE4DF]"></div>
                  <div class="absolute inset-0 flex flex-col justify-between h-full">
                    <div>
                      <img class="mx-auto h-full object-cover inset-0 relative" :src="item.image_url" />
                    </div>
                    <div class="pb-[17px] px-[15px] flex items-end justify-between">
                      <div class="flex flex-col justify-between gap-[8px]">
                        <h3 class="text-[#A0566E] text-[15px] font-[350]">{{ item.title }}</h3>
                        <p class="text-[#A0566E] text-[12px] font-bold leading-none tracking-[-0.236px]">{{ item.price }}</p>
                      </div>
                      <div>
                        <button
                          class="w-[24px] h-[24px] rounded-full flex items-center justify-center border border-[#A0576F] bg-[#A0576F]">
                          <OutlineHeartIcon/>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </BaseSlider>
          </template>
        </BaseCard>
      </div>
    </div>
    </div>

    <!-- Product Modal -->
    <Dialog v-model:show="modalOpen" :modalMaxWidth="'max-w-[539px]'">
      <template #body>
        <div v-if="selectedProduct"
          class="bg-decore-modal mx-auto rounded-[30px] overflow-hidden shadow-lg bg-[#EBE4DF] text-[#5F2C3E]">

          <img :src="selectedProduct.image_url" alt="Product Image" class="w-1/2 mx-auto h-auto mt-[20px]" />

          <div class="relative px-[28px] my-[40px]">
            <div class="flex justify-between items-center">
              <h2 class="text-[27px] font-bold text-[#A0576F] leading-normal">{{ selectedProduct.title }}</h2>
              <p class="text-[22px] font-bold text-[#A0576F] leading-normal">{{ selectedSizePrice }}</p>
            </div>

            <div class="flex justify-between items-center mt-[13px]">
              <div class="flex items-center gap-[6px]">
                
                <OutlineStarIcon2 />
                <span class="text-[#A0576F] text-center font-black text-[20px] leading-[27.815px]">4.5</span>
              </div>

              <BaseCounter v-model="quantity" />
            </div>
            <p class="text-[#5B605C] mt-[38px] mb-[16px] text-[14px] font-[350] leading-[23.128px]">
              {{ selectedProduct.description || 'Premium quality product from our collection. Experience the best in beauty and wellness with this carefully crafted item.' }}
            </p>

            <div class="">
              <h3 class="text-[17px] font-normal leading-normal text-[#A0576F] mb-[12px]">Size</h3>
              <SelectableSlider v-model="selectedSize" :items="sizes" value-key="value" label-key="name"
                class="sizechoose" :ui="{
                  container: 'ms-0 gap-[14px]',
                  item: 'basis-1/3 shrink-0 ps-0 category-box'
                }" />

            </div>

            <BaseButton @click="addToCart" :loading="cartModule.isAddLoading" :disabled="!selectedProduct"
              class="cart-btn flex align-center gap-[10px] w-full text-white py-3 rounded-full font-[400] text-[16px] justify-center mt-[35px] disabled:bg-[#A0576F] hover:bg-[#913E5D]"
              :class="selectedProduct ? 'bg-[#A0576F]' : 'bg-[#a0576f69]'">
              <ShopIcon/>
              <span>Total: {{ totalPrice }} SAR</span>


            </BaseButton>

          </div>

        </div>
      </template>
    </Dialog>

    <!-- Service Type Conflict Modal -->
    <ServiceTypeConflictModal
      v-model:open="showServiceTypeModal"
      :current-service-type="getCurrentCartServiceType()"
      :new-service-type="SERVICE_TYPES.ONLINE"
      @clear-cart="handleClearCart"
      @cancel="handleCancelConflict"
    />
  </Container>
</template>

<script setup lang="ts">
/**
 * SHOP PAGE - Retail Products
 *
 * This page displays retail products (items you can buy) like:
 * - Hair oils, shampoos, conditioners
 * - Face creams, serums, moisturizers
 * - Body lotions, scrubs, treatments
 *
 * Different from SERVICES PAGE which shows:
 * - Spa treatments, massages, facials
 * - Hair styling, cuts, coloring
 * - Beauty services you book appointments for
 *
 * Both use /api/v1/products but with different parameters:
 * - Shop: product_type='retail', is_shop=true
 * - Services: no special filters (default services)
 */

import Container from '@/components/base/Container.vue'
import BaseCard from '@/components/base/Card.vue'
import BaseSlider from '@/components/base/Slider.vue'
import Dialog from '@/components/base/Dialog.vue'
import BaseCounter from '@/components/base/Counter.vue'
import SelectableSlider from '@/components/base/SelectableSlider.vue'
import OutlineHeartIcon from '@/components/icons/OutlineHeartIcon.vue'
import OutlineStarIcon2 from '@/components/icons/OutlineStarIcon2.vue'
import ShopSkeleton from '@/components/skeletons/ShopSkeleton.vue'
import ShopIcon from '@/components/icons/ShopIcon.vue'
import ServiceTypeConflictModal from '@/components/modals/ServiceTypeConflictModal.vue'
import { useCart } from '@/stores/cart'
import { useProducts } from '@/stores/products'
import { useApp } from '@/stores/app'
import { onMounted, ref, computed, nextTick } from 'vue'
import { SERVICE_TYPES } from '~/data/constants'
  const { setServiceType , getServiceType  } = useApp();

const cartModule = useCart()
const productsStore = useProducts()
const appModule = useApp()

// Initialize shop data on component mount
onMounted(async () => {
    console.log('Shop page mounted, initializing...')

    // Initialize shop with API call and fallback data
    await productsStore.initializeShop()

    console.log('Shop initialized, products loaded:', productsStore.products.length)
})



// Modal Logic
const selectedProduct = ref<any>(null)
const modalOpen = ref(false)

function openProductModal(product: any) {
  console.log('Opening product modal for:', product);
  selectedProduct.value = product;
  modalOpen.value = true;

  // Reset form values when opening modal
  quantity.value = 1;
  selectedSize.value = '30ml';
}

function closeProductModal() {
  modalOpen.value = false;
  selectedProduct.value = null;
  // Reset form values
  quantity.value = 1;
  selectedSize.value = '30ml';
}

// Service type conflict modal
const showServiceTypeModal = ref(false)
const pendingCartItem = ref(null)



const quantity = ref(1)

const selectedSize = ref('30ml') // القيمة الابتدائية

// Dynamic sizes based on product price
const sizes = computed(() => {
  // Extract numeric price from string format like "40 SAR" or use number directly
  const rawPrice = selectedProduct.value?.price;
  let basePrice = 100; // Default fallback

  if (typeof rawPrice === 'number' && !isNaN(rawPrice)) {
    basePrice = rawPrice;
  } else if (typeof rawPrice === 'string') {
    // Extract number from string like "40 SAR"
    const numericPrice = parseFloat(rawPrice.replace(/[^\d.]/g, ''));
    if (!isNaN(numericPrice)) {
      basePrice = numericPrice;
    }
  }

  console.log('Product price calculation:', {
    product: selectedProduct.value?.name,
    rawPrice,
    basePrice,
    type: typeof rawPrice
  });

  return [
    { value: '30ml', name: '30 ML', price: basePrice },
    { value: '50ml', name: '50 ML', price: Math.round(basePrice * 1.5) },
    { value: '100ml', name: '100 ML', price: Math.round(basePrice * 2) }
  ];
});

const selectedSizePrice = computed(() => {
  const size = sizes.value.find((s) => s.value === selectedSize.value);
  const price = size ? size.price : (selectedProduct.value?.price || 0);

  console.log('Selected size price:', {
    selectedSize: selectedSize.value,
    size,
    price,
    isNumber: typeof price === 'number' && !isNaN(price)
  });

  return typeof price === 'number' && !isNaN(price) ? price : 0;
});

const totalPrice = computed(() => {
  const price = selectedSizePrice.value;
  const qty = quantity.value;
  const total = price * qty;

  console.log('Total price calculation:', {
    price,
    quantity: qty,
    total,
    isValidTotal: typeof total === 'number' && !isNaN(total)
  });

  return typeof total === 'number' && !isNaN(total) ? total : 0;
})

// Add to cart function
const addToCart = async () => {
  if (!selectedProduct.value) return;

  // Check for service type conflict
  const newServiceType = SERVICE_TYPES.ONLINE;

  // If cart is not empty, check if any product has different service_type
  if (cartModule.getProductsCount > 0) {
    const cartProducts = cartModule.getProducts;
    const hasConflict = cartProducts.getCurrentServiceType !== newServiceType;
    if (hasConflict) {
      const currentServiceType = cartProducts.getCurrentServiceType


    // Store the pending cart item
    pendingCartItem.value = {
      id: selectedProduct.value.id,
      quantity: quantity.value,
      size: selectedSize.value,
      price: selectedSizePrice.value
    };

      // Show conflict modal
      showServiceTypeModal.value = true;
      return;
    }
  }

  // Prepare product data for cart - use the same structure as services
  const productForCart = {
    id: selectedProduct.value.id,
    quantity: quantity.value,
    size: selectedSize.value,
    price: selectedSizePrice.value
  };

  try {
    console.log('Adding product to cart:', productForCart);

    // Pass service type as parameter - it will be sent as header
    await cartModule.addOrUpdateServiceInCart(productForCart, null, SERVICE_TYPES.ONLINE);

    // Close modal and reset form on success
    closeProductModal();

    // Show success message (optional)
    console.log('Product added to cart successfully!');
  } catch (error) {
    console.error('Error adding to cart:', error);
    // Keep modal open on error so user can try again
  }
}


// Handle service type conflict modal actions
const handleClearCart = async () => {
  try {
    await cartModule.clearCart();

    // After clearing cart, add the pending item
    if (pendingCartItem.value) {
      await cartModule.addOrUpdateServiceInCart(pendingCartItem.value, null, SERVICE_TYPES.ONLINE);
      pendingCartItem.value = null;
    }

    // Close modals
    showServiceTypeModal.value = false;
    closeProductModal();

    console.log('Cart cleared and new item added successfully!');
  } catch (error) {
    console.error('Error clearing cart:', error);
  }
}

const handleCancelConflict = () => {
  showServiceTypeModal.value = false;
  pendingCartItem.value = null;
}

// Get current service type from cart products
const getCurrentCartServiceType = () => {
  const cartProducts = cartModule.getProducts;
  if (cartProducts.length === 0) return null;
  return cartProducts[0]?.service_type || null;
}

onMounted(() => {
  console.log('Shop page mounted, initializing...');
  setServiceType(SERVICE_TYPES.ONLINE);

});


</script>

<style>
/* Add custom styles if needed */

.sizechoose .category-box {
  flex: none;
  width: calc(100% / 3);
  /* يظهر فقط 3 عناصر */
  max-width: calc(100% / 3);
  max-width: calc(93% / 3);
}

.sizechoose .category-box>span {
  display: flex;
  justify-content: center;
  align-items: center;
}

@media screen and (max-width:767px) {
  .sizechoose .category-box {

    max-width: calc(88% / 3);
  }
}
</style>
