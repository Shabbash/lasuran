<template>
  <div v-if="product" class="bg-decore-modal mx-auto rounded-[30px] overflow-hidden shadow-lg bg-[#EBE4DF] text-[#5F2C3E]">
    <!-- Product Image -->
    <img :src="product.image_url" alt="Product Image" class="w-1/2 mx-auto h-auto mt-[20px]" />

    <!-- Product Content -->
    <div class="relative px-[28px] my-[40px]">
      <div class="flex justify-between items-center">
        <h2 class="text-[27px] font-bold text-[#A0576F] leading-normal">{{ product.title }}</h2>
        <p class="text-[22px] font-bold text-[#A0576F] leading-normal">{{ selectedSizePrice }}</p>
      </div>

      <!-- Rating & Quantity -->
      <div class="flex justify-between items-center mt-[13px]">
        <div class="flex items-center gap-[6px]">
          <OutlineStarIcon2 />
          <span class="text-[#A0576F] text-center font-black text-[20px] leading-[27.815px]">4.5</span>
        </div>
        <BaseCounter v-model="quantity" />
      </div>

      <!-- Description -->
      <p class="text-[#5B605C] mt-[38px] mb-[16px] text-[14px] font-[350] leading-[23.128px]">
        {{ product.description || 'Premium quality product from our collection.' }}
      </p>

      <!-- Size Selection -->
      <div>
        <h3 class="text-[17px] font-normal leading-normal text-[#A0576F] mb-[12px]">Size</h3>
        <SelectableSlider
          v-model="selectedSize"
          :items="sizes"
          value-key="value"
          label-key="name"
          class="sizechoose"
          :ui="{
            container: 'ms-0 gap-[14px]',
            item: 'basis-1/3 shrink-0 ps-0 category-box'
          }"
        />
      </div>

      <!-- Add to Cart Button -->
      <BaseButton
        @click="addToCart"
        :loading="cartModule.isAddLoading"
        :disabled="!product"
        class="cart-btn flex align-center gap-[10px] w-full text-white py-3 rounded-full font-[400] text-[16px] justify-center mt-[35px] disabled:bg-[#A0576F] hover:bg-[#913E5D]"
        :class="product ? 'bg-[#A0576F]' : 'bg-[#a0576f69]'"
      >
        <ShopIcon />
        <span>Total: <span class="sar-icon">&#xe900;</span> {{ totalPrice }}</span>
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseCounter from '@/components/base/Counter.vue'
import BaseButton from '@/components/base/Button.vue'
import SelectableSlider from '@/components/base/SelectableSlider.vue'
import OutlineStarIcon2 from '@/components/icons/OutlineStarIcon2.vue'
import ShopIcon from '@/components/icons/ShopIcon.vue'
import { useCart } from '@/stores/cart'
import { SERVICE_TYPES } from '@/data/constants'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const cartModule = useCart()
const quantity = ref(1)
const selectedSize = ref('30ml')

// Dynamic sizes and pricing
const sizes = computed(() => {
  const base = parseFloat(props.product?.price) || 100
  return [
    { value: '30ml', name: '30 ML', price: base },
    { value: '50ml', name: '50 ML', price: Math.round(base * 1.5) },
    { value: '100ml', name: '100 ML', price: Math.round(base * 2) }
  ]
})

const selectedSizePrice = computed(() => {
  return sizes.value.find(s => s.value === selectedSize.value)?.price || 0
})

const totalPrice = computed(() => selectedSizePrice.value * quantity.value)

const addToCart = async () => {

  // get carts products 
  const cartProducts = cartModule.getProducts
  
  const existingProduct = cartProducts.find((p: any) => p.service_type != SERVICE_TYPES.ONLINE)

  if (existingProduct) {
    alert('You must clear your cart to add items from a different service type.')
    return
  }


  const item = {
    id: props.product.id,
    quantity: quantity.value,
    size: selectedSize.value,
    price: selectedSizePrice.value
  }
  await cartModule.addOrUpdateServiceInCart(item, null, SERVICE_TYPES.ONLINE)
}
</script>

<style>
.sizechoose .category-box {
  flex: none;
  width: calc(100% / 3);
  max-width: calc(93% / 3);
}
.sizechoose .category-box > span {
  display: flex;
  justify-content: center;
  align-items: center;
}
@media screen and (max-width: 767px) {
  .sizechoose .category-box {
    max-width: calc(88% / 3);
  }
}
</style>
