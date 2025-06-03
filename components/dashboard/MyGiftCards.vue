<template>
  <div>
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-[20px] pb-7 mb-7 border-b border-[#AD7084]">
      <h1 class="text-lg font-medium text-[#EBE4DF]">My Gift Cards</h1>

      <!-- <div class="flex space-x-2">
        <button v-for="filter in filters" :key="filter.id"
          @click="!isFilterDisabled(filter.id) && (activeFilter = filter.id)" :class="[
            'px-4 py-1.5 pt-2 rounded-full text-sm font-medium transition-colors',
            activeFilter === filter.id
              ? filter.id === 'all'
                ? 'bg-gray-200 text-gray-700'
                : filter.id === 'served'
                  ? 'bg-[#6B8B9B] text-white'
                  : filter.id === 'cancelled'
                    ? 'bg-[#C44E4E] text-white'
                    : 'bg-[#6B8B9B] text-white'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200',
            isFilterDisabled(filter.id) ? 'opacity-70 cursor-not-allowed' : ''
          ]" :disabled="isFilterDisabled(filter.id)">
          {{ filter.label }}
        </button>


      </div> -->

      <button class="px-6 py-1.5 bg-[#6B8B9B] text-white rounded-full text-sm font-medium transition-colors"
        @click="goToBooking">
        Buy a new card
      </button>

    </div>



    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <div v-for="(card, index) in giftCards" :key="index"
          class="gift-card p-[20px] border  rounded-[12px] text-[13px] font-[350] mb-[20px] last:mb-0">
          <p class="text-[17px] font-medium mb-[20px]">
            Gift Card: {{ card.price }}
          </p>

          <div class="flex justify-between mb-[11px] pb-[11px] border-b">
            <span>Number of cards:</span>
            <span>{{ card.number_of_cards }}</span>
          </div>

          <div class="flex justify-between mb-[11px] pb-[11px] border-b">
            <span>Purchase No:</span>
            <span>{{ card.purchase_no }}</span>
          </div>

          <div class="flex justify-between">
            <span>Expiry Date</span>
            <span>{{ card.expiry_date }}</span>
          </div>
        </div>
      </div>

      <div>
        <div class="px-[25px] py-[35px] rounded-[12px] text-[15px] font-[400] border border-[#AD7084] text-[#C6C6C7]">
          <h3 class="text-[18px] font-medium mb-[17px] text-[#EBE4DF] text-center">Payment Details</h3>

          <div class="custom-border mb-[18px] relative">
            <div class="flex justify-between mb-[9px]">

              <span>Subtotal</span>
              <span>426.09 SAR</span>

            </div>

            <div class="flex justify-between mb-[9px]">

              <span>VAT (15%)</span>
              <span>63.91 SAR</span>

            </div>

            <div class="flex justify-between pb-[18px]">

              <span>Discount</span>
              <span>0.00 SAR</span>

            </div>

          </div>

          <div class="flex justify-between text-[17px] font-[500]">

            <span>Grant total</span>
            <span>500.00 SAR</span>

          </div>


        </div>

        <BaseButton class="bg-[#6B8B9B] hover:bg-[#6B8B9B]/70 mt-[27px] text-[#EBE4DF] text-[15px] font-[400]">
          View Invoice
        </BaseButton>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useBookings } from '@/stores/bookings';
import { useAuth } from '@/stores/auth';

const bookingsStore = useBookings();
const authStore = useAuth();

const isLoading = ref(false); // مبدئياً
const activeFilter = ref('all');

// Example bookings array
const bookings = ref([]);

// الفلاتر
const filters = [
  { id: 'all', label: 'ALL' },
  { id: 'new', label: 'New' },
  { id: 'used', label: 'Used' },
  { id: 'cancelled', label: 'Cancelled' }
];

// حجزات حسب الفلتر
const filteredBookings = computed(() => {
  if (activeFilter.value === 'all') return bookings.value;
  return bookings.value.filter(b => b.status === activeFilter.value);
});

const showEmptyState = computed(() => !isLoading.value && filteredBookings.value.length === 0);

// دالة تمكين/تعطيل الفلتر
function isFilterDisabled(id) {
  return false; // أو حسب الشروط المطلوبة
}

// زر الحجز
function goToBooking() {
  // مثال: توجيه إلى صفحة الحجز
  // useRouter().push('/booking');
  console.log('Redirecting to booking page...');
}


const giftCards = [
  {
    price: "500 SAR",
    number_of_cards: "2 Cards",
    purchase_no: "#97325-00000000156",
    expiry_date: "Oct, 20th, 2024"
  },
  {
    price: "500 SAR",
    number_of_cards: "2 Cards",
    purchase_no: "#97325-00000000156",
    expiry_date: "Oct, 20th, 2024"
  },
  {
    price: "500 SAR",
    number_of_cards: "2 Cards",
    purchase_no: "#97325-00000000156",
    expiry_date: "Oct, 20th, 2024"
  }
];


</script>


<style>
.gift-card {
  background-color: #A0576F;
  border-color: #AD7084;
  color: #C6C6C7;
}

.gift-card p {
  color: #EBE4DF;
}

.gift-card div {
  border-color: #AD7084;
}

.gift-card:hover,
.gift-card.active {
  background-color: #EBE4DF;
  color: #5B605C;
}

.gift-card:hover p,
.gift-card.active p {
  color: #A0576F;

}

.gift-card:hover div,
.gift-card.active div {
  border-color: #D8D8D8
}


.custom-border::after {
  content: "";
  position: absolute;
  border-bottom: 1px dashed #AD7084;
  width: 90%;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
</style>
