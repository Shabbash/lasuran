<template>
    <Transition name="fade">
        <div v-if="visible" class="relative p-[18px] rounded-[12px] bg-[#EAC1B7] flex flex-col gap-[10px] mb-2" @click="onBookingClick">

            <!-- ❌ Close Button -->
            <button @click="visible = false" class="absolute top-4 end-4 cursor-pointer">
                <XIcon />
            </button>

            <!-- 🎁 Top Section -->
            <div class="flex gap-4 items-center">
                <div class="rounded-full bg-[#A0576F] w-[36px] h-[36px] flex items-center justify-center shrink-0">
                    <GiftAlertIcon />
                </div>
                <div>
                    <p class="text-[#A0576F] text-[15px] font-bold leading-normal">
                      {{ $t("Gift from {Name}", { name : senderData?.first_name })}}
                    </p>
                    <p class="text-[#5B605C] text-[14px] font-[350] leading-normal">
                      {{ $t("{Name} has gifted you these services!", { name : senderData?.first_name })}}

<!--                      Zahra has gifted you these services!-->
                    </p>
                </div>
            </div>

            <!-- 💌 Message  -->
            <p v-if="item?.gifted_info?.message" class="text-[#5B605C] text-[14px] font-[350] not-italic leading-normal">
              <span class="text-[#A0576F] font-[600]">{{$t('Message')}}:</span>
              {{ item?.gifted_info?.message}}
            </p>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GiftAlertIcon from '@/components/icons/GiftAlertIcon.vue'
import XIcon from '@/components/icons/XIcon.vue'
import {COMPONENTS} from "~/data/constants";
import {useApp} from "~/stores/app";

const { setDialogComponent, setDialogShow , setDialogOptions} = useApp()

const props = defineProps({
  item: {
    type: Object,
    default :{ }
  }
});

const senderData = computed(() => {
  return props.item?.gifted_info?.sender_user ?? {}
});
const visible = ref(true);

const onBookingClick = async function () {
  setDialogComponent(COMPONENTS.SERVICE_APPOINTMENT_SKELETON);
  setDialogShow(true, { modalMaxWidth: '900px' })

  let booking = props.item ?? {};
  const { data } = await fetchOrder(booking?.id);
  if (data.value?.data ) booking = data.value?.data;

  setDialogOptions({ booking })
  if (booking.gifted_info) {
    setDialogComponent(COMPONENTS.GIFTED_ORDER_DETAILS, {
      booking,
      gifted_order_id: booking.gifted_info.id ?? undefined,
      order_id: booking.id
    })
    setDialogShow(true, { modalMaxWidth: '900px' })
    return
  }

  // // Otherwise, open the normal booking details modal
  // selectedBooking.value = booking
  // setDialogComponent(COMPONENTS.BOOKING_SHOW, {
  //   booking,
  //   onRate: () => handleRateService(),
  //   onViewRating: () => handleViewRating(),
  //   onInvoice: () => handleMakeService(),
  //   onCancel: () => openCancelBookingConfirm()
  // })
  // setDialogShow(true)
}

const fetchOrder =  function (id: any) {
 return  useApi(`orders/${id}`, {

  });
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s ease;
    overflow: hidden;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    max-height: 0;
    padding-top: 0;
    padding-bottom: 0;
    margin-bottom: 0;
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
    max-height: 100vh;
}
</style>
