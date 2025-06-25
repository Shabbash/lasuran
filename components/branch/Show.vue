<!-- Branch Details Dialog -->
<template>
  <!-- Skeleton while loading -->
  <BranchDetailsSkeleton v-if="!branch" />

  <!-- Branch Content -->
  <div
    v-else
    class="bg-decore-modal mx-auto rounded-[30px] overflow-hidden shadow-lg bg-[#EBE4DF] text-[#5F2C3E]"
  >
    <!-- Branch Image -->
    <img
      class="w-full h-[200px] object-cover rounded-[30px]"
      :src="branch.main_image || branch.image || branch.thumpimage_image"
      :alt="branch.name"
    />

    <!-- Branch Info -->
    <div class="mx-[20px] mt-[20px] mb-[40px] relative">
      <!-- Name & Status -->
      <div class="flex justify-between items-center mb-2">
        <h2 class="font-bold text-[30px] text-[#A0576F] leading-[100%]">{{ branch.name }}</h2>
        <div class="flex items-center gap-2">
          <div :class="branch.is_open ? 'bg-green-500' : 'bg-red-500'" class="w-3 h-3 rounded-full"></div>
          <span :class="branch.is_open ? 'text-green-600' : 'text-red-600'" class="text-sm font-medium">
            {{ branch.is_open ? 'Open' : 'Closed' }}
          </span>
        </div>
      </div>

      <!-- Address -->
      <p class="location-modal flex items-center text-[14px] text-[#A0576F] font-[500] mb-[10px] gap-[12px]">
        {{ branch.address || branch.city_name }}
      </p>

      <!-- Phone -->
      <div v-if="branch.phone" class="flex items-center text-[14px] text-[#5B605C] mb-[10px] gap-[8px]">
        <span>📞</span>
        <span>{{ branch.phone }}</span>
      </div>

      <!-- Description -->
      <div v-if="branch.description" class="text-[#5B605C] text-[14px] font-[350] mb-[20px]" v-html="branch.description"></div>

      <!-- Working Times -->
      <div class="mx-[40px] mt-[30px]">
        <div class="p-[20px] rounded-[20px] bg-[#A0576F]">
          <h3 class="text-white text-[16px] font-medium flex items-center gap-[10px] mb-[15px]">
            Opening Times:
          </h3>

          <div class="space-y-3">
            <div v-for="workingTime in branch.working_times" :key="workingTime.day" class="flex justify-between">
              <h4 class="text-white text-[16px] font-[350]">{{ workingTime.day }}</h4>
              <div class="text-[#81F6D0] text-[16px] font-[350]">
                <span v-if="workingTime.is_active">
                  {{ workingTime.start_at }} - {{ workingTime.end_at }}
                </span>
                <span v-else class="text-red-300">Closed</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Get Directions -->
        <BaseButton
          @click="openDirections"
          label="Get Directions"
          class="location-btn bg-[#A0576F] text-white rounded-[100px] w-full h-[50px] py-0 justify-center text-[16px] font-normal leading-[100%] tracking-[0] border border-[#A0576F] hover:bg-[#913E5D] transition cursor-pointer mt-[30px]"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
const props = defineProps({
  branch: {
    type: Object,
    required: true
  }
})

// Methods
function openDirections() {
  if (props.branch.google_map_link) {
    window.open(props.branch.google_map_link, '_blank')
  } else if (props.branch.latitude && props.branch.longitude) {
    const url = `https://www.google.com/maps?q=${props.branch.latitude},${props.branch.longitude}`
    window.open(url, '_blank')
  } else {
    const query = encodeURIComponent(`${props.branch.name} ${props.branch.address || props.branch.city_name}`)
    window.open(`https://www.google.com/maps/search/${query}`, '_blank')
  }
}
</script>
