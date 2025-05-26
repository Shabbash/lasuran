// components/dashboard/MyBookings.vue
<template>
  <div>
    <div class="flex justify-between items-center pb-7 mb-7 border-b border-[#AD7084]">
      <h1 class="text-lg font-medium text-[#EBE4DF]">My Bookings</h1>

      <div class="flex space-x-2">
        <button v-for="filter in filters" :key="filter.id" @click="activeFilter = filter.id" :class="[
          'px-4 py-1.5 pt-2 rounded-full text-sm font-medium transition-colors',
          activeFilter === filter.id
            ? filter.id === 'all' ? 'bg-gray-200 text-gray-700' :
              filter.id === 'served' ? 'bg-[#6B8B9B] text-white' :
                filter.id === 'cancelled' ? 'bg-[#C44E4E] text-white' :
                  'bg-[#6B8B9B] text-white'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200',
          isFilterDisabled(filter.id) ? 'opacity-70 cursor-not-allowed' : ''
        ]" :disabled="isFilterDisabled(filter.id)">
          {{ filter.label }}
        </button>

        <button class="px-6 py-1.5 bg-[#6B8B9B] text-white rounded-full text-sm font-medium transition-colors">
          Book A Table
        </button>
      </div>
    </div>

    <div v-if="filteredBookings.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="booking in filteredBookings" :key="booking.id"
        class="py-[14px] px-[20px] h-full flex flex-col border border-[#AD7084] border-solid rounded-[20px] text-white relative cursor-pointer"
        @click="openBookingDetails(booking)">
        <!-- Close Button -->

        <div class="flex justify-between items-start mb-3">
          <h3 class="text-[#EBE4DF] text-[18px] font-bold">Booking No. {{ booking.bookingNumber }}</h3>

          <span :class="[
            'px-3 h-[18px] rounded-full text-xs font-medium',
            booking.status === 'active' ? 'bg-[#6B8B9B] text-white' :
              booking.status === 'served' ? 'bg-[#D29F8C] text-white' :
                'bg-[#C44E4E] text-white'
          ]">
            {{ capitalizeFirstLetter(booking.status) }}
          </span>
        </div>

        <div class="space-y-2">
          <div class="flex items-center text-sm text-[#EBE4DF]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span class="text-[#C6C6C7] text-[14px]">No. of Guests: {{ booking.guests }} Guests</span>
          </div>

          <div class="flex items-center text-sm text-[#EBE4DF]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="text-[#C6C6C7] text-[14px]">Branch: {{ booking.branch }}</span>
          </div>

          <div class="flex items-center text-sm text-[#EBE4DF]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="text-[#C6C6C7] text-[14px]">{{ booking.date }}</span>
          </div>

          <div class="flex items-center text-sm text-[#EBE4DF]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-[#C6C6C7] text-[14px]">{{ booking.time }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- No Appointments Screen - Show when no bookings are available -->
    <div v-if="showEmptyState" class="flex flex-col items-center justify-center py-16 w-[50%] mx-auto">
      <!-- Empty Calendar/Appointment Illustration -->
      <div class="relative w-28 h-28 mb-6">
        <img src="/assets/img/noBooking.png" alt="No Bookings" />
      </div>

      <!-- Text Messages -->
      <h2 class="text-xl font-bold text-[#EBE4DF] mb-1">No Appointments</h2>
      <p class="text-[#C6C6C7] text-center mb-6 font-light">
        Your upcoming and past appointment<br>
        will appear here when you book
      </p>

      <!-- Book a Service Button -->
      <button
        class="px-8 py-3 bg-[#EBE4DF] rounded-full w-full text-[#A0576F] text-sm font-medium shadow-sm hover:bg-[#EBE4DF]">
        Book a Service
      </button>
    </div>

    <!-- Dialog component for booking details -->
    <Dialog v-model:open="modalOpen"  :modalMaxWidth="'max-w-[467px]'">
      <template #body>
        <div v-if="selectedBooking"
          class="bg-decore-modal mx-auto rounded-[30px] overflow-hidden shadow-lg bg-[#EBE4DF] text-[#5F2C3E]">
          <!-- Header -->
          <div class="pt-[34px] px-[50px] pb-[30px] relative">
            <h2 class="text-[#A0576F] text-[18px] font-bold leading-normal text-center mb-[20px]">Booking No. {{
              selectedBooking.bookingNumber }}</h2>

            <!-- Booking Info Grid -->
            <div class="p-[20px] rounded-[20px] bg-[#A0576F] relative mb-[18px]">
              <div class="flex justify-between mb-[20px]">
                <h3 class="text-[#EBE4DF] text-[17.108px] font-medium leading-normal">Booking Details </h3>

                <span :class="[
                  'px-[18px] h-[24px] rounded-full text-[14px] font-medium flex items-center justify-center',
                  selectedBooking.status === 'active' ? 'bg-[#6B8B9B] text-white' :
                    selectedBooking.status === 'served' ? 'bg-[#D29F8C] text-white' :
                      'bg-[#C44E4E] text-white'
                ]">
                  {{ capitalizeFirstLetter(selectedBooking.status) }}
                </span>


              </div>
              <div class="space-y-[12px]">

                <div class="flex justify-between pb-[12px] border-b border-b-[#AD7084] last:border-b-0 last:pb-0">
                  <h3 class="text-[#EBE4DF] text-[13.082px] font-[350] leading-normal">Username</h3>
                  <p class="text-[#EBE4DF] text-[13px] font-[350] leading-normal">Zahra Ahmed</p>
                </div>
                <div
                  class="flex justify-between pb-[12px] mb-[12px] border-b border-b-[#AD7084] last:border-b-0 last:pb-0">
                  <h3 class="text-[#EBE4DF] text-[13.082px] font-[350] leading-normal">Zahra Arrived</h3>
                  <p class="text-[#EBE4DF] text-[13px] font-[350] leading-normal">Yes</p>
                </div>
                <div class="flex justify-between pb-[12px] border-b border-b-[#AD7084] last:border-b-0 last:pb-0">
                  <h3 class="text-[#EBE4DF] text-[13.082px] font-[350] leading-normal">Visitors</h3>
                  <p class="text-[#EBE4DF] text-[13px] font-[350] leading-normal">{{ selectedBooking.guests }} Visitors
                  </p>
                </div>
                <div class="flex justify-between pb-[12px] border-b border-b-[#AD7084] last:border-b-0 last:pb-0">
                  <h3 class="text-[#EBE4DF] text-[13.082px] font-[350] leading-normal">Branch</h3>
                  <p class="text-[#EBE4DF] text-[13px] font-[350] leading-normal">{{ selectedBooking.branch }}</p>
                </div>
                <div class="flex justify-between pb-[12px] border-b border-b-[#AD7084] last:border-b-0 last:pb-0">
                  <h3 class="text-[#EBE4DF] text-[13.082px] font-[350] leading-normal">Booking Time</h3>
                  <p class="text-[#EBE4DF] text-[13px] font-[350] leading-normal">{{ selectedBooking.time }}</p>
                </div>
                <div class="flex justify-between pb-[12px] border-b border-b-[#AD7084] last:border-b-0 last:pb-0">
                  <h3 class="text-[#EBE4DF] text-[13.082px] font-[350] leading-normal">Booking Date</h3>
                  <p class="text-[#EBE4DF] text-[13px] font-[350] leading-normal">{{ selectedBooking.date }}</p>
                </div>
              </div>
            </div>

            <!-- Payment Summary -->
            <div class="mb-[30px] px-[12px]">
              <h3 class="text-[#A0576F] text-[16px] font-medium leading-normal mb-[23px]">Payment Summary</h3>

              <div class="space-y-[12px]">
                <div class="flex justify-between pb-[12px] border-b border-b-[#B2B0B0]">
                  <p class="text-[#5B605C] text-[12px] font-[350] leading-normal">Subtotal ({{ selectedBooking.guests }}
                    Persons)</p>
                  <p class="text-[#5B605C] text-[12px] font-[350] leading-normal">00.00 SAR</p>
                </div>
                <div class="flex justify-between pb-[12px] border-b border-b-[#B2B0B0]">
                  <p class="text-[#5B605C] text-[12px] font-[350] leading-normal">VAT Amount (15%)</p>
                  <p class="text-[#5B605C] text-[12px] font-[350] leading-normal">00.00 SAR</p>
                </div>
                <div class="flex justify-between pb-[12px] border-b border-b-[#B2B0B0]">
                  <p class="text-[#5B605C] text-[12px] font-[350] leading-normal">Service Cost</p>
                  <p class="text-[#5B605C] text-[12px] font-[350] leading-normal">00.00 SAR</p>
                </div>
                <div class="flex justify-between pb-[12px] border-b border-b-[#B2B0B0]">
                  <p class="text-[#5B605C] text-[12px] font-[350] leading-normal">Discount</p>
                  <p class="text-[#5B605C] text-[12px] font-[350] leading-normal">00.00 SAR</p>
                </div>
                <div class="flex justify-between pb-[12px] border-b border-b-[#B2B0B0]">
                  <p class="text-[#5B605C] text-[12px] font-[350] leading-normal">Bookmarked points (-100 Pts.)</p>
                  <p class="text-[#5B605C] text-[12px] font-[350] leading-normal">00.00 SAR</p>
                </div>
              </div>

              <div class="mt-[28px]">
                <div class="flex justify-between">
                  <p class="text-[#A0576F] text-[21px] font-bold leading-normal">Total</p>
                  <p class="text-[#A0576F] text-[21px] font-bold leading-normal">00.00 SAR</p>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col space-y-3">
              <!-- ✅ الحالة: served && لم يتم التقييم -->
              <BaseButton v-if="selectedBooking.status === 'served' && selectedBooking.rating_status === false"
                class="rate w-full h-[50px] bg-transparent hover:bg-transparent text-[#6B8B9B] border border-[#6B8B9B] rounded-full text-[13px] font-medium"
                @click="handleRateService">
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18" fill="none">
                  <g clip-path="url(#clip0_2107_4719)">
                    <path
                      d="M3.80403 16.6538C3.61776 16.6538 3.43281 16.5957 3.27496 16.4815C3.13139 16.3776 3.02154 16.2338 2.95907 16.0679C2.8966 15.9021 2.88426 15.7215 2.9236 15.5487L4.01727 10.7311L0.308253 7.47851C0.174858 7.36212 0.07863 7.20907 0.0315419 7.03841C-0.0155463 6.86775 -0.0114162 6.68702 0.0434181 6.51869C0.0979159 6.35045 0.200593 6.2019 0.33872 6.09147C0.476847 5.98104 0.644349 5.91357 0.820457 5.89744L5.7279 5.45188L7.66818 0.911332C7.81119 0.577732 8.13698 0.362305 8.49901 0.362305C8.86103 0.362305 9.18683 0.577732 9.3299 0.910569L11.2701 5.45188L16.1768 5.89737C16.5381 5.92991 16.8427 6.17443 16.9546 6.51865C17.0666 6.86291 16.963 7.24047 16.6904 7.47848L12.9814 10.7305L14.0751 15.5479C14.1552 15.9022 14.0177 16.2685 13.7238 16.4809C13.4306 16.6933 13.0395 16.7097 12.7307 16.5241L8.49901 13.9953L4.26733 16.5255C4.12425 16.6105 3.96484 16.6538 3.80403 16.6538ZM8.49901 12.9059C8.65985 12.9059 8.81909 12.9491 8.9623 13.034L12.956 15.4227L11.9238 10.8756C11.8877 10.7167 11.8952 10.551 11.9456 10.396C11.996 10.241 12.0874 10.1025 12.21 9.99521L15.7122 6.92384L11.0788 6.50311C10.9157 6.48851 10.7597 6.42984 10.6275 6.33337C10.4952 6.2369 10.3917 6.10628 10.3279 5.95548L8.49901 1.67064L6.66787 5.95611C6.53894 6.26142 6.25203 6.47117 5.91922 6.50165L1.28518 6.92241L4.7872 9.99378C5.03802 10.2134 5.14773 10.5506 5.07342 10.875L4.04204 15.4219L8.03571 13.034C8.17879 12.9491 8.3382 12.9059 8.49901 12.9059ZM5.69042 5.53967C5.69042 5.53967 5.69042 5.54043 5.68965 5.54109L5.69042 5.53967ZM11.3062 5.53757L11.307 5.539C11.307 5.53824 11.307 5.53824 11.3062 5.53757H11.3062Z"
                      fill="#6B8B9B" />
                  </g>
                  <defs>
                    <clipPath id="clip0_2107_4719">
                      <rect width="17" height="17" fill="white" transform="translate(-0.000976562 0.32959)" />
                    </clipPath>
                  </defs>
                </svg><span>Rate Service</span>
              </BaseButton>

              <!-- ✅ الحالة: served && تم التقييم -->
              <BaseButton v-if="selectedBooking.status === 'served' && selectedBooking.rating_status === true"
                class="rated w-full h-[50px] bg-[#6B8B9B] hover:bg-[#6B8B9B] text-[#EBE4DF] border border-[#6B8B9B] rounded-full text-[13px] font-medium"
                @click="handleViewRating">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <g clip-path="url(#clip0_2107_4979)">
                    <path
                      d="M4.10799 16.6538C3.92171 16.6538 3.73677 16.5957 3.57892 16.4815C3.43535 16.3776 3.3255 16.2338 3.26303 16.0679C3.20055 15.9021 3.18822 15.7215 3.22755 15.5487L4.32122 10.7311L0.612208 7.47851C0.478813 7.36212 0.382585 7.20907 0.335497 7.03841C0.288409 6.86775 0.292539 6.68702 0.347373 6.51869C0.401871 6.35045 0.504549 6.2019 0.642675 6.09147C0.780802 5.98104 0.948304 5.91357 1.12441 5.89744L6.03186 5.45188L7.97213 0.911332C8.11514 0.577732 8.44094 0.362305 8.80296 0.362305C9.16498 0.362305 9.49078 0.577732 9.63386 0.910569L11.5741 5.45188L16.4807 5.89737C16.8421 5.92991 17.1466 6.17443 17.2585 6.51865C17.3705 6.86291 17.267 7.24047 16.9943 7.47848L13.2854 10.7305L14.379 15.5479C14.4592 15.9022 14.3217 16.2685 14.0278 16.4809C13.7345 16.6933 13.3435 16.7097 13.0347 16.5241L8.80296 13.9953L4.57128 16.5255C4.42821 16.6105 4.26879 16.6538 4.10799 16.6538ZM8.80296 12.9059C8.9638 12.9059 9.12305 12.9491 9.26626 13.034L13.26 15.4227L12.2278 10.8756C12.1916 10.7167 12.1992 10.551 12.2496 10.396C12.2999 10.241 12.3913 10.1025 12.514 9.99521L16.0161 6.92384L11.3827 6.50311C11.2197 6.48851 11.0637 6.42984 10.9314 6.33337C10.7992 6.2369 10.6956 6.10628 10.6319 5.95548L8.80296 1.67064L6.97183 5.95611C6.8429 6.26142 6.55598 6.47117 6.22318 6.50165L1.58913 6.92241L5.09116 9.99378C5.34198 10.2134 5.45169 10.5506 5.37738 10.875L4.34599 15.4219L8.33967 13.034C8.48274 12.9491 8.64215 12.9059 8.80296 12.9059ZM5.99437 5.53967C5.99437 5.53967 5.99437 5.54043 5.99361 5.54109L5.99437 5.53967ZM11.6102 5.53757L11.6109 5.539C11.6109 5.53824 11.6109 5.53824 11.6101 5.53757H11.6102Z"
                      fill="#EBE4DF" />
                  </g>
                  <defs>
                    <clipPath id="clip0_2107_4979">
                      <rect width="17" height="17" fill="white" transform="translate(0.302979 0.32959)" />
                    </clipPath>
                  </defs>
                </svg>
                <span>View Rating</span>
              </BaseButton>

              <!-- ✅ View Invoice للحالات: active, served, cancelled -->
              <BaseButton v-if="['active', 'served', 'cancelled'].includes(selectedBooking.status)"
                class="w-full h-[50px] bg-[#A0576F] hover:bg-[#A0576F] text-[#EBE4DF] rounded-full text-[13px] font-medium"
                @click="handleMakeService">
                View Invoice
              </BaseButton>

              <!-- ✅ Cancel Booking فقط إذا كانت active -->
              <BaseButton v-if="selectedBooking.status === 'active'"
                class="w-full h-[50px] bg-[#C44E4E] hover:bg-[#C44E4E] text-[#EBE4DF] rounded-full text-[13px] font-medium"
                @click="handleCancelBooking">
                Cancel Booking
              </BaseButton>
            </div>


          </div>
        </div>
      </template>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog v-model:open="deleteModalOpen" :modalMaxWidth="'max-w-[356px]'">
      <template #body>
        <div class="mx-auto rounded-[30px] overflow-hidden shadow-lg bg-[#EBE4DF] text-[#5F2C3E]">
          <div class="pt-[34px] px-[50px] pb-[30px] relative text-center">

            <svg class="mx-auto" xmlns="http://www.w3.org/2000/svg" width="106" height="105" viewBox="0 0 106 105"
              fill="none">
              <path
                d="M53.4121 3.28125C26.2434 3.28125 4.19336 25.3313 4.19336 52.5C4.19336 79.6687 26.2434 101.719 53.4121 101.719C80.5809 101.719 102.631 79.6687 102.631 52.5C102.631 25.3313 80.5809 3.28125 53.4121 3.28125ZM53.4121 82.0312C49.8027 82.0312 46.8496 79.0781 46.8496 75.4688C46.8496 71.8594 49.8027 68.9062 53.4121 68.9062C57.0215 68.9062 59.9746 71.8594 59.9746 75.4688C59.9746 79.0781 57.0215 82.0312 53.4121 82.0312ZM60.9262 31.1391L58.7277 57.4547C58.4981 60.2109 56.2012 62.3438 53.4121 62.3438C50.623 62.3438 48.3262 60.2109 48.0965 57.4547L45.898 31.1391C45.5371 26.7422 48.9824 22.9688 53.4121 22.9688C54.4032 22.9688 55.3845 23.164 56.3002 23.5432C57.2158 23.9225 58.0478 24.4784 58.7486 25.1792C59.4493 25.88 60.0052 26.7119 60.3845 27.6276C60.7638 28.5432 60.959 29.5246 60.959 30.5156C60.959 30.7125 60.959 30.9422 60.9262 31.1391Z"
                fill="#C44E4E" />
            </svg>
            <h2 class="text-[#A0576F] text-center mt-[15px] mb-[5px] text-[20px] font-bold leading-normal">Cancel Reservation</h2>
            <p class="text-[#5B605C] text-center mb-[24px] text-[16px] font-normal leading-normal">Are You sure you want
              to cancel your reservation</p>


            <div class="space-y-[10px]">


              <BaseButton
                class="h-[49px] bg-[#C44E4E] hover:bg-[#913E5D] text-white text-[16px] font-normal rounded-[100px] leading-normal"
                @click="confirmDeleteBooking">
                Delete
              </BaseButton>

              <BaseButton
                class="h-[49px] bg-[#6B8B9B] text-white text-[16px] font-normal rounded-[100px] leading-normal hover:bg-[#5a7886] transition"
                @click="deleteModalOpen = false">
                Cancel
              </BaseButton>


            </div>
          </div>
        </div>
      </template>
    </Dialog>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Dialog from '@/components/base/Dialog.vue';


const showEmptyState = computed(() => filteredBookings.value.length === 0);


// Filter options
const filters = [
  { id: 'all', label: 'ALL' },
  { id: 'served', label: 'Served' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'active', label: 'Active' }
];

// Currently active filter
const activeFilter = ref('all');

// Bookings data
const bookings = ref([
  {
    id: 1,
    bookingNumber: '05585',
    status: 'active',
    guests: 3,
    branch: 'Riyadh',
    date: 'Sep 18th, 2024',
    time: '7:30 PM',
    rating_status: false

  },
  {
    id: 2,
    bookingNumber: '05586',
    status: 'served',
    guests: 2,
    branch: 'Jeddah',
    date: 'Sep 15th, 2024',
    time: '7:30 PM',
    rating_status: true

  },
  {
    id: 3,
    bookingNumber: '05587',
    status: 'cancelled',
    guests: 4,
    branch: 'Riyadh',
    date: 'Sep 10th, 2024',
    time: '7:30 PM',
    rating_status: true

  }
]);

// Selected booking for details popup
const selectedBooking = ref(null);
const modalOpen = ref(false);

// Booking to delete (for confirmation dialog)
const bookingToDelete = ref(null);
const deleteModalOpen = ref(true);

// Check if there are any bookings
const hasAnyBookings = computed(() => bookings.value.length > 0);

// Check if there are bookings with a specific status
const hasBookingsWithStatus = (status) => {
  return bookings.value.some(booking => booking.status === status);
};

// Check if a filter should be disabled
const isFilterDisabled = (filterId) => {
  if (filterId === 'all') return false;
  return !hasBookingsWithStatus(filterId);
};

// Get filtered bookings based on active filter
const filteredBookings = computed(() => {
  if (activeFilter.value === 'all') {
    return bookings.value;
  }
  return bookings.value.filter(booking => booking.status === activeFilter.value);
});

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Open booking details popup
function openBookingDetails(booking) {
  selectedBooking.value = booking;
  modalOpen.value = true;
}

// Handle rate service button
function handleRateService() {
  // Logic for rating service
  console.log('Rating service for booking:', selectedBooking.value.id);
  // Close the popup after action
  modalOpen.value = false;
}

// Handle make service button
function handleMakeService() {
  // Logic for making service
  console.log('Making service for booking:', selectedBooking.value.id);
  // Close the popup after action
  modalOpen.value = false;
}

function handleCancelBooking() {
  // نعمل clone حتى Vue يشوفه كـ new value
  bookingToDelete.value = { ...selectedBooking.value };
  modalOpen.value = false;
}


// Open delete confirmation dialog
watch(bookingToDelete, (newValue) => {
  if (newValue) {
    deleteModalOpen.value = true;
  }
});

function confirmDeleteBooking() {
  if (!bookingToDelete.value) return;

  const bookingIndex = bookings.value.findIndex(
    (b) => b.id === bookingToDelete.value.id
  );

  if (bookingIndex !== -1) {
    bookings.value[bookingIndex].status = 'cancelled';
  }

  deleteModalOpen.value = false;
  bookingToDelete.value = null;
}

</script>
