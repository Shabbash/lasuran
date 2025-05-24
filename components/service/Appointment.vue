<template>
  <div class="bg-decore-modal mx-auto rounded-[30px] overflow-hidden shadow-lg bg-[#EBE4DF] text-[#5F2C3E]">


<!--     calendar start -->
    <div class="relative z-[1] pt-[42px] px-[80px] pb-[20px]" v-if="!menuModule.getService?.loading">
      <button @click="onBack"
              class="w-[42px] h-[42px] rounded-full bg-[#A0576F] text-white flex items-center justify-center hover:bg-[#913E5D] transition cursor-pointer fixed top-[24px] start-[28px]">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path
              d="M17.5 22.1666C17.3464 22.1675 17.1942 22.1381 17.0521 22.08C16.91 22.022 16.7807 21.9364 16.6717 21.8283L9.67166 14.8283C9.45436 14.6097 9.3324 14.314 9.3324 14.0058C9.3324 13.6976 9.45436 13.4019 9.67166 13.1833L16.6717 6.1833C16.8948 5.99217 17.1819 5.8923 17.4756 5.90364C17.7692 5.91498 18.0477 6.0367 18.2555 6.24448C18.4633 6.45226 18.585 6.73079 18.5963 7.02441C18.6077 7.31803 18.5078 7.60512 18.3167 7.8283L12.145 14L18.3167 20.1716C18.4805 20.3341 18.5924 20.5415 18.6384 20.7677C18.6843 20.9938 18.6622 21.2284 18.5748 21.442C18.4874 21.6555 18.3386 21.8383 18.1473 21.9673C17.956 22.0963 17.7307 22.1657 17.5 22.1666Z"
              fill="white" />
        </svg>
      </button>

      <h2 class="text-center text-[23px] font-bold leading-normal text-[#A0576F] mb-[40px]">Book Services</h2>

                <!-- <label class="flex items-center gap-[12px] text-[16px] font-normal leading-normal text-[#6B8B9B]">
                  <input type="radio" class="hidden" name="reservation" value="someone-else" v-model="reserveOption" />
                  <span class="w-[20px] h-[20px] rounded-full border border-[#A0576F] flex items-center justify-center">
                    <span v-if="reserveOption === 'someone-else'"
                      class="w-[10px] h-[10px] bg-[#A0576F] rounded-full"></span>
                  </span>
                  Reserve for someone else
                </label> -->

                <!-- <div class="mb-[17px]">
                  <h3 class="text-[21px] font-medium leading-normal text-[#A0576F] mt-[40px] mb-[14px]">Deep Facial Cleanse
                  </h3>

                  <USelect v-model="selectedProfessional" :items="professionals" placeholder="Select professional"
                    class="rounded-[100px] border border-[#A0576F] bg-[#EBE4DF] text-[14px] font-normal leading-normal text-[#90928F] w-full"
                    size="lg" />
                </div> -->

      <div class="mb-[12px]">
        <h3 class="text-[17px] font-normal leading-normal text-[#A0576F] mb-[12px]">Select Date</h3>
        <UCalendar  initial-focus v-model="selectedDate"  :is-date-unavailable="isDateUnavailable"/>
      </div>

      <div class="">
        <h3 class="text-[17px] font-normal leading-normal text-[#A0576F] mb-[12px]">Availabe Time</h3>
         <SelectableSlider  v-model="form.time" :items="selectedDateObject?.slots ?? []" value-key="from" label-key="from" />
<!--                  <URadioGroup v-model="selectedTime" orientation="horizontal" indicator="hidden" variant="card"-->
<!--                    :items="times" class="flex gap-4 flex-wrap" :ui="{-->
<!--                      root: 'relative block time-group',-->
<!--                      fieldset: 'flex justify-between',-->
<!--                      legend: 'mb-1 block font-medium text-default',-->
<!--                      item: 'flex items-start bg-[#E6CDC7A3] rounded-[52px] border-0 flex justify-center items-center px-[19px] py-[14px] text-center text-[15px] font-normal leading-normal has-data-[state=checked]:bg-[#A0576F] has-data-[state=checked]:text-[#EBE4DF]',-->
<!--                      container: 'flex items-center',-->
<!--                      base: 'rounded-full ring ring-inset ring-accented overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2',-->
<!--                      indicator: 'flex items-center justify-center size-full after:bg-default after:rounded-full',-->
<!--                      wrapper: 'w-full',-->
<!--                      label: 'block font-medium text-[#A0576F]',-->
<!--                      description: 'text-muted',-->
<!--                    }" />-->


      </div>

      <BaseButton @click="addToCart" :loading="cartModule.isAddLoading" :disabled="selectedExtension === ''"
              class="cart-btn flex align-center gap-[24px] w-full text-white py-3 rounded-full font-[600] text-[16px] justify-center mt-[35px]"
              :class="selectedExtension === '' ? 'bg-[#a0576f69]' : 'bg-[#A0576F]'">
        <span>{{ selectedExtension === '' ? '' : selectedService.price + ' SAR - ' }}Continue</span>
      </BaseButton>
    </div>
    <div class="relative z-[1] pt-[42px] px-[80px] pb-[20px]" v-else>
      <div class="h-[28px] w-1/3 bg-[#E6CDC7A3] rounded mb-[40px] animate-pulse"></div>
      <div class="h-[20px] w-1/4 bg-[#E6CDC7A3] rounded mb-[12px] animate-pulse"></div>
      <div class="h-[250px] w-full bg-[#E6CDC7A3] rounded-[16px] animate-pulse mb-[24px]"></div>
      <div class="h-[20px] w-1/4 bg-[#E6CDC7A3] rounded mb-[12px] animate-pulse"></div>
      <div class="flex flex-wrap gap-[12px]">
        <div v-for="n in 4" :key="n" class="w-[100px] h-[40px] bg-[#E6CDC7A3] rounded-full animate-pulse"></div>
      </div>
      <div class="w-full h-[48px] bg-[#E6CDC7A3] rounded-full mt-[35px] animate-pulse"></div>
    </div>
    <!-- calendar end -->


  </div>
</template>

<script setup lang="ts">

import {COMPONENTS} from "~/data/constants";
import {CalendarDate, type DateValue} from "@internationalized/date";

import {useMenu} from "~/stores/menu";
import SelectableSlider from "~/components/base/SelectableSlider.vue";

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
  [key: string]: any; // Allow other properties
}
const cartModule = useCart();
const availableDates = computed(() => menuModule.getService?.times ?? []);

const selectedDateObject = computed(() => ( menuModule.getService?.times?? []).find((el: any) => el.date == form.value.date))
const isDateUnavailable = (date: DateValue) => {
  let currentDate = `${date.year}-${date.month <= 9 ? '0'+ date.month : date.month }-${date.day <= 9 ? '0'+ date.day : date.day}`;
 let item =  availableDates.value.find((el: any) => {
    return el.date == currentDate
  });
  console.log('isDateUnavailable',item,currentDate);
  return !item?.slots ;
}
const form = ref({
  date: null,
  time: null,
})
const menuModule = useMenu();

const selectedDate = computed({
  get() {
    let date = form.value.date ?? availableDates.value?.[0]?.date

    if (!date) return null

    const convertedDate = new Date(date)
    return new CalendarDate(
        convertedDate.getFullYear(),
        convertedDate.getMonth() + 1,
        convertedDate.getDate()
    )
  },

  set(date: any) {
    if (date) {
      const yyyy = date.year
      const mm = date.month <= 9 ? `0${date.month}` : `${date.month}`
      const dd = date.day <= 9 ? `0${date.day}` : `${date.day}`
      form.value.date = `${yyyy}-${mm}-${dd}`
    } else {
      form.value.date = date
    }
  }
})
// const selectedDate = computed({
//   set(date: any) {
//     if (date) form.value.date = `${date.year}-${date.month <= 9 ? '0'+ date.month : date.month }-${date.day <= 9 ? '0'+ date.day : date.day}`
//     else form.value.date = date;
//   },
//   get() {
//     let date = form.value.date ?? availableDates.value?.[0]?.date;
//     let convertedDate = new Date(date);
//    return  date ? new CalendarDate(convertedDate.getFullYear, convertedDate.getMonth, convertedDate.getDay) : null
//     // return date ? toStructuredDate(date) :null;
//   }
// })
menuModule.fetchServiceAvailableTimes().then((availableTimes) => {
  form.value.date = availableDates.value?.[0]?.date;

});

const getCurrentTime = function () {
  return (selectedDateObject.value.slots ?? []).find((el: any) => el.from == form.value.time);
}

const  { setDialogComponent} :any = useApp();

const submitAddToGuest = function() {
  setDialogComponent(COMPONENTS.SERVICE_SHOW);
}


const selectedService = ref<Service>({} as Service);
selectedService.value = menuModule.service.data as Service;
const reserveOption = ref('');

// --------------calender start ------//
const professionals = [
  { label: 'John Doe', value: 'john' },
  { label: 'Jane Smith', value: 'jane' }
]

const selectedExtension = ref(null)
const selectedProfessional = ref(null)
const value = ref(new CalendarDate(2022, 2, 3))


const times = [
  { label: '09:30 PM', value: '21:30' },
  { label: '10:00 PM', value: '22:00' },
  { label: '10:30 PM', value: '22:30' }
]

const selectedTime = ref('21:30')


const addToCart = function(){
  if ( reserveOption.value)
    setDialogComponent(COMPONENTS.SERVICE_GUEST);
  else {
    let time = getCurrentTime();
    let body =  {
      start_at: time?.from_date_time,
      end_at: time?.to_date_time,
    }
    console.log('selectedDateObject.value.slots ',selectedDateObject.value.slots ,body)
    cartModule.updateServiceAvailableSlot(body)
    // setDialogComponent(COMPONENTS.SERVICE_SUCCESS);

  }
}

const onBack = function(){
  setDialogComponent(COMPONENTS.SERVICE_SHOW);
}


</script>

<style>

  .time-group label:has([data-state="checked"]) p{
    color: #EBE4DF;
  }

</style>