<template>
  <div class="mb-[14px] border-b border-b-[#AD7084]">
    <!-- Top Section -->


    <div class="flex justify-between mt-[14px] mb-[14px] md:px-[29px]">
      <div class="flex-2 md:flex-1">
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
        <p class="flex-2 text-[#EBE4DF] text-[14px] font-normal leading-normal hidden md:block">
          <span class="block">{{ item.date }}</span>
          <span class="block">{{ item.duration }}</span>
        </p>
        
        <p class="flex-1 text-[#EBE4DF] text-[14px] font-normal leading-normal hidden md:block">
          <span class="block line-through text-[12px]">
            <span class="sar-icon">&#xe900;</span> {{ item.unit_price_before_discount }}
          </span>
          <span class="block">
            <span class="sar-icon">&#xe900;</span> {{ item.unit_price_with_tax }}
          </span>
          <!-- <span class="block">
            <span class="sar-icon">&#xe900;</span> {{ item.unit_discount }}
          </span> -->
          
        
        </p>
        <div class="md:flex-1">
          <button class="cursor-pointer"
          @click="$emit('edit', item)">
            <EditIcon/>
          </button>
          <button class="cursor-pointer"
          @click="$emit('remove')">
            <DeleteIcon/>
          </button>

        </div>
      </div>
    </div>
    

    <!-- Expanded Content -->
    <Transition name="fade-slide" enter-active-class="transition-all duration-200 ease-in-out"
      leave-active-class="transition-all duration-200 ease-in-out" enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0" leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2">
      <div v-if="item.expanded" class="mt-[6px] mb-[28px] md:px-[93px] space-y-[5px] md:space-y-[25px]">

        <p class="flex-1 text-[#EBE4DF] text-[14px] font-normal leading-normal md:hidden"><span class="sar-icon">&#xe900;</span> {{ item.price }}</p>

        <p class="text-[#EBE4DF] text-[14px] font-[350] leading-normal md:hidden">{{ item.duration }}</p>


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

import EditIcon from '~/components/icons/EditIcon.vue'
import DeleteIcon from '~/components/icons/DeleteIcon.vue'


defineProps<{
  item: {
    id: number | string
    cart_product_id?: number | string
    image: string
    name: string
    duration: string
    price: number
    unit_price_before_discountce: number
    unit_discount: number
    unit_price_with_tax: number
    expanded?: boolean
    professional?: string
    date?: string
    services?: string
    visitors?: string[]
    phones?: string[]
  }
}>()

defineEmits(['toggle', 'remove', 'edit'])
</script>
