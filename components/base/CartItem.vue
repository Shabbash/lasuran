<template>
  <div class="mb-[14px] border-b border-b-[#AD7084]">
    <!-- Top Section -->


    <div class="flex justify-between mt-[14px] mb-[14px] px-[29px]">
      <div class="flex-1">
        <div class="flex items-center gap-[11px]">
          <div class="w-[53px] h-[53px] rounded-[10px] overflow-hidden">
            <img :src="item.image" alt="service" class="w-full h-full object-cover" />
          </div>
          <div>
            <h3 class="text-white text-[15px] font-normal leading-normal">{{ item.name }}</h3>
            <button class="text-[#D29F8C] text-[14px] font-[350] leading-normal"
              :class="{ 'arrow-down': !item.expanded, 'arrow-up': item.expanded }" @click="$emit('toggle')">
              {{ item.expanded ? 'View Less' : 'View More' }}
            </button>
          </div>
        </div>

      </div>
      <div class="flex flex-1 justify-end">
        <p class="flex-1 text-[#EBE4DF] text-[14px] font-normal leading-normal">{{ item.duration }}</p>
        <p class="flex-1 text-[#EBE4DF] text-[14px] font-normal leading-normal">{{ item.price }} SAR</p>
        <div class="flex-1">
          <button>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="22" viewBox="0 0 24 22" fill="none">
              <rect x="2.25253" y="0.17041" width="19.8803" height="19.0077" rx="4.32182" fill="#6B8B9B" />
              <path
                d="M13.0501 6.25297L8.15967 11.0543C7.97122 11.2393 7.79219 11.6001 7.7545 11.8592L7.49066 13.6909C7.39643 14.357 7.86757 14.8195 8.54601 14.727L10.4117 14.468C10.6755 14.431 11.043 14.2552 11.2315 14.0702L16.1219 9.26884C16.9606 8.44548 17.3657 7.48337 16.1219 6.26222C14.8781 5.03182 13.8981 5.42037 13.0501 6.25297Z"
                stroke="white" stroke-width="1.29654" stroke-miterlimit="10" stroke-linecap="round"
                stroke-linejoin="round" />
              <path d="M12.353 6.9375C12.7676 8.38993 13.9266 9.53707 15.4154 9.94412" stroke="white"
                stroke-width="1.29654" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <button @click="$emit('remove')">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="22" viewBox="0 0 24 22" fill="none">
              <rect x="1.86719" y="0.17041" width="19.8803" height="19.0077" rx="4.32182" fill="#C44E4E" />
              <path
                d="M12.4026 10.2727L14.8926 7.55636C15.0126 7.42545 15.0126 7.22909 14.8926 7.09818C14.7726 6.96727 14.5926 6.96727 14.4726 7.09818L11.9826 9.81455L9.4926 7.09818C9.3726 6.96727 9.1926 6.96727 9.0726 7.09818C8.9526 7.22909 8.9526 7.42545 9.0726 7.55636L11.5626 10.2727L9.0726 12.9891C8.9526 13.12 8.9526 13.3164 9.0726 13.4473C9.1926 13.5782 9.3726 13.5782 9.4926 13.4473L11.9826 10.7309L14.4726 13.4473C14.5926 13.5782 14.7726 13.5782 14.8926 13.4473C15.0126 13.3164 15.0126 13.12 14.8926 12.9891L12.4026 10.2727Z"
                fill="white" stroke="white" stroke-width="1.29654" />
            </svg>
          </button>

        </div>
      </div>
    </div>

    <!-- Expanded Content -->
    <Transition name="fade-slide" enter-active-class="transition-all duration-200 ease-in-out"
      leave-active-class="transition-all duration-200 ease-in-out" enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0" leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2">
      <div v-if="item.expanded" class="mt-[6px] mb-[28px] px-[93px] space-y-[25px]">
        <div class="text-[#EBE4DF] text-[14px] font-[350] leading-normal" v-if="item.professional">
          <span class="text-[#C6C6C7]">Branch:</span> {{ item.professional }}
        </div>
        <div class="text-[#EBE4DF] text-[14px] font-[350] leading-normal" v-if="item.date">
          <span class="text-[#C6C6C7]">Date:</span> {{ item.date }}
        </div>
        <!-- <div class="" v-if="item.services">
          <span class="font-semibold">Services:</span> {{ item.services }} — <span class="text-gray-500">00.00
            SAR</span>
        </div>
        <div v-if="item.visitors && item.phones">
          <span class="font-semibold">Visitors:</span>
          <ul class="ml-4 text-xs list-disc">
            <li v-for="(name, index) in item.visitors" :key="index">
              {{ name }} — {{ item.phones[index] }}
            </li>
          </ul>
        </div> -->
      </div>
    </Transition>
  </div>

</template>

<script setup lang="ts">
defineProps<{
  item: {
    id: number | string
    cart_product_id?: number | string
    image: string
    name: string
    duration: string
    price: number
    expanded?: boolean
    professional?: string
    date?: string
    services?: string
    visitors?: string[]
    phones?: string[]
  }
}>()

defineEmits(['toggle', 'remove'])
</script>
