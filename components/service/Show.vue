<template>
  <div v-if="!isLoading" class="bg-decore-modal mx-auto rounded-[30px] overflow-hidden shadow-lg bg-[#EBE4DF] text-[#5F2C3E]">
    <!-- service details start -->

    <img class="w-full h-[200px] object-cover rounded-[30px]" :src="selectedService.inner_image  ?? selectedService.image" :alt="defaultService.name" />

    <div class="mx-[20px] mt-[20px] mb-[40px] relative">
      <div class="flex justify-between items-center mb-2">
        <h2 class="font-bold text-[30px] text-[#A0576F] leading-[100%]">{{ defaultService.name }}</h2>
        <span class="font-bold text-[19px] text-[#A0576F] leading-[100%]">
                {{ selectedExtension === '' ? 'Price Upon Selection' : selectedService.price + ' SAR' }}
              </span>
      </div>

      <div class="flex items-center text-[14px] text-[#A0576F] font-[500] mb-[10px]">
        {{ selectedService.duration }}
      </div>

      <p class="text-[14px] font-[350] text-[#5F2C3E] leading-[1.6] mb-[18px]">
        {{ defaultService.description }}
      </p>

      <!-- <div class="flex justify-between gap-4">
        <div>
          <p class="font-medium text-[17px] text-[#A0576F] mb-[11px]">Extensions Amount</p>
         <CustomRadio v-model="selectedExtension" :items="selectedService.extensionOptions" />
       </div>

        <div>
          <p class="font-medium text-[17px] text-[#A0576F] mb-[25px]">Guests</p>
          <div @click="addGuest" class="text-center text-[14px] font-normal leading-normal text-[#6B8B9B] h-[42px] px-[20px] rounded-[100px] bg-[#BBCACF] flex items-center justify-between gap-[14px] min-w-[170px] mb-[18px]">
            <span>Yassmin Ahmed</span>
            <span class="close-tag"></span>
          </div>
          <button @click="addGuest"
              class="guest-btn rounded-[100px] border border-dashed border-[#6B8B9B] px-[24px] flex items-center h-[32px] gap-[4px] text-[14px] font-[350] text-[#6B8B9B] min-w-[170px]">
            <span>Add Guest</span>
          </button>
        </div>
      </div> -->

      <BaseButton @click="addToCart" :loading="cartModule.isAddLoading" class="bg-[#A0576F] text-[#EBE4DF] rounded-[100px] w-full py-[16px] justify-center text-[20px] font-normal leading-[100%] tracking-[0] border border-[#A0576F] hover:bg-[#913E5D] transition cursor-pointer mt-[30px]  disabled:bg-[#A0576F]">
        <span>{{ selectedExtension === '' ? '' : selectedService.price + ' SAR - ' }}{{ isEditing ? 'Update' : 'Continue' }}</span>
      </BaseButton>
<!--      <button-->
<!--          @click="addToCart"-->
<!--          :disabled="selectedExtension === ''"-->
<!--          class="cart-btn flex align-center gap-[24px] w-full text-white py-3 rounded-full font-[600] text-[16px] justify-center mt-[35px]"-->
<!--          :class="selectedExtension === '' ? 'bg-[#a0576f69]' : 'bg-[#A0576F]'">-->
<!--        <span>{{ selectedExtension === '' ? '' : selectedService.price + ' SAR - ' }}Continue</span>-->
<!--      </button>-->
    </div>

  </div>
  <div v-else>
    <ServiceDetailSkeleton />
  </div>
</template>

<script setup lang="ts">

import { CalendarDate } from "@internationalized/date";
import CustomRadio from "~/components/base/CustomRadio.vue";
import ServiceDetailSkeleton from "~/components/base/ServiceDetailSkeleton.vue";
import {COMPONENTS} from "~/data/constants";

// Define service type
interface Service {
  id: number | string;
  name: string;
  image?: string;
  inner_image?: string;
  price?: string | number | null;
  duration?: string;
  description?: string;
  products?: Service[];
  is_editing?: boolean;
  cart_product_id?: number | string;
  selectedExtension?: string;
  selectedTime?: string;
  date?: string;
  branch_id?: number | string;
  product_id?: number | string;
  [key: string]: any; // Allow other properties
}
const { setDialogComponent } = useApp();
const menuModule = useMenu();
const cartModule = useCart();
const selectedService = computed<Service>(() => menuModule.service.data as Service);
const isLoading = computed(() => menuModule.service.loading);

// Check for editing flag in multiple possible locations
const isEditing = computed(() => {
  // First check our stored original state
  if (originalIsEditing.value) return true;

  // Check if the cart_product_id is set
  if (originalCartProductId.value) return true;

  // Use our helper function to check the service
  return isServiceInEditMode(selectedService.value);
});

const selectedExtension = ref('')
const selectedTime = ref('21:30')
const value = ref(new CalendarDate(2022, 2, 3))

const defaultService = computed<Service>(() => selectedService.value?.products?.[0] ?? selectedService.value);
// const selectedService = {
//   id: 1,
//   title: 'Hair Extensions',
//   image: '/assets/img/service-1.png',
//   price: null,
//   duration: '4 Hours',
//   description: 'Enhance length, volume, and style with premium, natural-looking extensions.',
//   extensionOptions: [
//     { label: '10 Extensions', value: '10' },
//     { label: '20 Extensions', value: '20' },
//     { label: '30 Extensions', value: '30' },
//     { label: '40 Extensions', value: '40' },
//     { label: '50 Extensions', value: '50' }
//   ]
// }


// Function removed as it was unused

const addToCart = function () {
  // Create the payload with all necessary data
  const payload = {
    ...defaultService.value,
    selectedExtension: selectedExtension.value,
    selectedTime: selectedTime.value,
    date: value.value.toString(),
  };

  // Use our helper function and computed properties to check if this is an edit operation
  const isEditingOperation = isEditing.value;

  // Get the cart_product_id from the service or our stored value
  const cartProductId = selectedService.value?.cart_product_id || originalCartProductId.value;

  // Check if this is an edit operation
  if (isEditingOperation && cartProductId) {
    // This is an edit operation - ensure we pass the cart_product_id
    payload.cart_product_id = cartProductId;
    console.log('Editing existing cart item with ID:', payload.cart_product_id);

    // Make sure we're using the correct product ID from the original item
    if (selectedService.value?.product_id) {
      payload.id = selectedService.value.product_id;
    } else if (defaultService.value?.id) {
      payload.id = defaultService.value.id;
    }

    // Include any other necessary fields from the original cart item
    if (selectedService.value?.branch_id) {
      payload.branch_id = selectedService.value.branch_id;
    }

    // Log the complete payload for debugging
    console.log('Edit cart payload:', payload);
  } else {
    console.log('Adding new item to cart');
    console.log('Add cart payload:', payload);
    // For new items, don't include cart_product_id
  }

  // Use the same method for both add and update operations
  // The API will detect if it's an update based on the presence of cart_product_id
  cartModule.addOrUpdateServiceInCart(payload).then(() => {
    setDialogComponent(COMPONENTS.SERVICE_APPOINTMENT);
  });
};

// Function removed as it was unused
// Store the original cart_product_id and editing state
const originalCartProductId = ref<string | number | null>(null);
const originalIsEditing = ref(false);

// Function to check if a service is in edit mode
const isServiceInEditMode = (service: any) => {
  if (!service) return false;

  return (
    service._isEditing === true ||
    service.is_editing === true ||
    Object.getOwnPropertyDescriptor(service, 'is_editing')?.value === true
  );
};

onMounted(() => {
  const serviceData = menuModule.service.data as Service
  console.log('Service data on mount:', serviceData);

  // Set extension value
  selectedExtension.value = serviceData.selectedExtension || ''

  // Set time value
  selectedTime.value = serviceData.selectedTime || '21:30'

  // Set date value if available
  if (serviceData.date) {
    try {
      const [year, month, day] = serviceData.date.split('-').map(Number)
      value.value = new CalendarDate(year, month, day)
    } catch (error) {
      console.error('Error parsing date:', error);
      // Use default date if parsing fails
      value.value = new CalendarDate(2022, 2, 3)
    }
  }

  // Check if this is an edit operation
  const isEditingOperation = isServiceInEditMode(serviceData);

  // Get the cart_product_id
  const cartProductId = serviceData.cart_product_id || null;

  // Store the original cart_product_id and editing state
  originalCartProductId.value = cartProductId;
  originalIsEditing.value = isEditingOperation;

  console.log('Cart product ID:', cartProductId);
  console.log('Is editing operation:', isEditingOperation);

  // If this is an edit operation but the editing state is not properly set,
  // update the service data to include the editing state
  if (cartProductId && !isEditingOperation) {
    console.log('Cart product ID found but editing state not set, fixing...');

    // Create an updated service data object with the editing state
    const updatedServiceData = {
      ...serviceData,
      _isEditing: true
    };

    // Update the service data in the store
    menuModule.setService(updatedServiceData);
  }

  // If this is an edit operation, log it
  if (isEditingOperation || cartProductId) {
    console.log('Editing cart item:', cartProductId);
  }
})
</script>

<style scoped>



</style>