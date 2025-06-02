<template>
  <Container>
    <!-- Loading State -->
    <div v-if="productsStore.isLoading" class="flex justify-center items-center py-20">
      <div class="text-white text-lg">Loading...</div>
    </div>

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
                          class="w-[24px] h-[24px] rounded-full flex items-center justify-center border border-[#A0576F]"
                          :class="{ 'bg-transparent': item.liked, 'bg-[#A0576F]': !item.liked }"
                          @click.stop="productsStore.toggleProductLike(item.id)">
                          <svg v-if="item.liked" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#A0576F]"
                            fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28
                             2 8.5 2 5.42 4.42 3 7.5 3c1.74
                             0 3.41 0.81 4.5 2.09C13.09 3.81
                             14.76 3 16.5 3 19.58 3 22 5.42
                             22 8.5c0 3.78-3.4 6.86-8.55
                             11.54L12 21.35z" />
                          </svg>
                          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none"
                            viewBox="0 0 24 24" stroke="#EBE4DF">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4.318 6.318a4.5 4.5 0 000
                             6.364L12 20.364l7.682-7.682a4.5
                             4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5
                             4.5 0 00-6.364 0z" />
                          </svg>
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
                          class="w-[24px] h-[24px] rounded-full flex items-center justify-center border border-[#A0576F]"
                          :class="{ 'bg-transparent': item.liked, 'bg-[#A0576F]': !item.liked }"
                          @click.stop="productsStore.toggleProductLike(item.id)">
                          <svg v-if="item.liked" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#A0576F]"
                            fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28
                             2 8.5 2 5.42 4.42 3 7.5 3c1.74
                             0 3.41 0.81 4.5 2.09C13.09 3.81
                             14.76 3 16.5 3 19.58 3 22 5.42
                             22 8.5c0 3.78-3.4 6.86-8.55
                             11.54L12 21.35z" />
                          </svg>
                          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none"
                            viewBox="0 0 24 24" stroke="#EBE4DF">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4.318 6.318a4.5 4.5 0 000
                             6.364L12 20.364l7.682-7.682a4.5
                             4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5
                             4.5 0 00-6.364 0z" />
                          </svg>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                  <g clip-path="url(#clip0_2177_6415)">
                    <path
                      d="M5.87173 23.0456C5.60876 23.0456 5.34766 22.9636 5.12481 22.8025C4.92212 22.6558 4.76704 22.4527 4.67884 22.2185C4.59065 21.9844 4.57323 21.7295 4.62876 21.4855L6.17277 14.6843L0.936514 10.0923C0.748191 9.92799 0.61234 9.71192 0.545863 9.47099C0.479385 9.23006 0.485216 8.9749 0.562629 8.73726C0.639567 8.49975 0.784524 8.29004 0.979526 8.13413C1.17453 7.97822 1.411 7.88298 1.65963 7.86021L8.58779 7.23117L11.327 0.820996C11.5289 0.350031 11.9888 0.0458984 12.4999 0.0458984C13.011 0.0458984 13.471 0.350031 13.673 0.819918L16.4121 7.23117L23.3392 7.86011C23.8493 7.90605 24.2792 8.25125 24.4372 8.73721C24.5953 9.22322 24.4491 9.75626 24.0642 10.0923L18.828 14.6834L20.372 21.4844C20.4852 21.9845 20.2911 22.5017 19.8762 22.8016C19.4622 23.1015 18.9101 23.1245 18.4741 22.8625L12.4999 19.2924L6.5258 22.8645C6.32381 22.9845 6.09875 23.0456 5.87173 23.0456ZM12.4999 17.7545C12.727 17.7545 12.9518 17.8154 13.154 17.9354L18.7922 21.3076L17.335 14.8883C17.284 14.6639 17.2946 14.4299 17.3657 14.2111C17.4368 13.9923 17.5658 13.7968 17.739 13.6453L22.6832 9.30924L16.142 8.71527C15.9118 8.69466 15.6915 8.61183 15.5048 8.47564C15.3181 8.33945 15.1719 8.15504 15.082 7.94215L12.4999 1.89296L9.9148 7.94304C9.73278 8.37406 9.32773 8.67018 8.85789 8.71321L2.3157 9.30723L7.25974 13.6433C7.61384 13.9533 7.76872 14.4294 7.66381 14.8874L6.20774 21.3065L11.8459 17.9354C12.0479 17.8154 12.2729 17.7545 12.4999 17.7545ZM8.53486 7.35512C8.53486 7.35512 8.53486 7.35619 8.53378 7.35713L8.53486 7.35512ZM16.463 7.35216L16.4641 7.35418C16.4641 7.3531 16.4641 7.3531 16.463 7.35216H16.463Z"
                      fill="#A0576F" />
                  </g>
                  <defs>
                    <clipPath id="clip0_2177_6415">
                      <rect width="24" height="24" fill="white" transform="translate(0.5)" />
                    </clipPath>
                  </defs>
                </svg>
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
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                <path
                  d="M10 9.875C10.1658 9.875 10.3247 9.94085 10.4419 10.0581C10.5592 10.1753 10.625 10.3342 10.625 10.5V12.375H12.5C12.6658 12.375 12.8247 12.4408 12.9419 12.5581C13.0592 12.6753 13.125 12.8342 13.125 13C13.125 13.1658 13.0592 13.3247 12.9419 13.4419C12.8247 13.5592 12.6658 13.625 12.5 13.625H10.625V15.5C10.625 15.6658 10.5592 15.8247 10.4419 15.9419C10.3247 16.0592 10.1658 16.125 10 16.125C9.83424 16.125 9.67527 16.0592 9.55806 15.9419C9.44085 15.8247 9.375 15.6658 9.375 15.5V13.625H7.5C7.33424 13.625 7.17527 13.5592 7.05806 13.4419C6.94085 13.3247 6.875 13.1658 6.875 13C6.875 12.8342 6.94085 12.6753 7.05806 12.5581C7.17527 12.4408 7.33424 12.375 7.5 12.375H9.375V10.5C9.375 10.3342 9.44085 10.1753 9.55806 10.0581C9.67527 9.94085 9.83424 9.875 10 9.875Z"
                  fill="#EBE4DF" />
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M6.25 5.5V4.875C6.25 2.80406 7.92906 1.125 10 1.125C12.0709 1.125 13.75 2.80406 13.75 4.875V5.5H14.2966C15.5391 5.5 16.59 6.41656 16.765 7.64688L18.0994 17.0219C18.3137 18.525 17.1509 19.875 15.6312 19.875H4.36875C2.84906 19.875 1.68625 18.525 1.90031 17.0219L3.235 7.64688C3.41 6.41656 4.46093 5.5 5.70375 5.5H6.25ZM7.5 8C7.5 8.16576 7.43415 8.32473 7.31694 8.44194C7.19973 8.55915 7.04076 8.625 6.875 8.625C6.70924 8.625 6.55026 8.55915 6.43305 8.44194C6.31584 8.32473 6.25 8.16576 6.25 8V6.75H5.70343C5.40347 6.75064 5.1138 6.8595 4.88767 7.05659C4.66153 7.25367 4.51411 7.52575 4.4725 7.82281L3.13812 17.1978C3.03 17.9534 3.61406 18.625 4.36875 18.625H15.6312C16.3856 18.625 16.9697 17.9534 16.8622 17.1978L15.5275 7.82281C15.4859 7.52569 15.3384 7.25358 15.1122 7.05648C14.886 6.85939 14.5963 6.75056 14.2962 6.75H13.75V8C13.75 8.16576 13.6841 8.32473 13.5669 8.44194C13.4497 8.55915 13.2908 8.625 13.125 8.625C12.9592 8.625 12.8003 8.55915 12.6831 8.44194C12.5658 8.32473 12.5 8.16576 12.5 8V6.75H7.5V8ZM12.5 5.5V4.875C12.5 4.21196 12.2366 3.57607 11.7678 3.10723C11.2989 2.63839 10.663 2.375 10 2.375C9.33696 2.375 8.70107 2.63839 8.23223 3.10723C7.76339 3.57607 7.5 4.21196 7.5 4.875V5.5H12.5Z"
                  fill="#EBE4DF" />
              </svg>
              <span>Total: {{ totalPrice }} SAR</span>


            </BaseButton>

          </div>

        </div>
      </template>
    </Dialog>
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
import { useCart } from '@/stores/cart'
import { useProducts } from '@/stores/products'
import { onMounted, ref, computed, nextTick } from 'vue'

const cartModule = useCart()
const productsStore = useProducts()

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

  // Prepare product data for cart - use the same structure as services
  const productForCart = {
    id: selectedProduct.value.id,
    quantity: quantity.value,
    size: selectedSize.value,
    price: selectedSizePrice.value
  };

  try {
    console.log('Adding product to cart:', productForCart);

    // Use the same method as services - it handles both products and services
    await cartModule.addOrUpdateServiceInCart(productForCart);

    // Close modal and reset form on success
    closeProductModal();

    // Show success message (optional)
    console.log('Product added to cart successfully!');
  } catch (error) {
    console.error('Error adding to cart:', error);
    // Keep modal open on error so user can try again
  }
}



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
