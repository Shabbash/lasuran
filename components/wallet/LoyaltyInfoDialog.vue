<template>
  <div class="px-[20px] md:px-[67px] py-[30px] relative">
    <h2 class="text-[#A0576F] text-center text-[23px] font-bold leading-normal mb-[30px]">
      {{ $t('loyalty_points_scheme') }}
    </h2>

    <div class="px-[10px] py-[20px] rounded-[16px] bg-[#A0576F] flex flex-col justify-between gap-[25px]">
      <p class="text-[#EBE4DF] text-center text-[16px] font-[350]">
        {{ $t('loyalty_order_more_to_upgrade') }}
      </p>
      <p class="text-[#EBE4DF] text-center text-[16px] font-[350]">
        {{ $t('loyalty_more_rewards_coming') }}
      </p>
    </div>

    <div class="mt-[30px] overflow-y-auto max-h-[45vh]">
      <div v-for="(level, index) in customerClasses" :key="index"
        class="border-b border-dashed border-b-[#A0576F80] pb-[8px] pt-[17px]">
        <div class="flex">
          <div class="flex-1">
            <img :src="level.image || '/assets/img/point-schema.png'" :alt="level.name"
              class="w-12 h-12 object-contain" />
          </div>
          <div class="flex-4">
            <h4 class="text-[#A0576F] text-[16px] font-bold leading-normal">{{ level.name }}</h4>
            <p class="text-[#A0576F] text-[16px] font-[400] leading-normal">{{ level.description }}</p>
          </div>
        </div>

        <UCollapsible v-model:open="level.open" class="flex flex-col gap-2">
          <UButton
            class="more-btn bg-transparent text-[#BBCACF] hover:text-[#A0576F] p-0 mt-[16px] hover:bg-transparent justify-center">
            <span>{{ level.open ? $t('loyalty_show_less') : $t('loyalty_read_more') }}</span>
          </UButton>
          <template #content>
            <p class="text-[#AD7084] text-[14px] font-[300]">{{ level.details }}</p>
          </template>
        </UCollapsible>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  customerClasses: {
    type: Array,
    required: true
  }
})
</script>
