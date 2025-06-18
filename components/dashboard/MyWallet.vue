<template>
  <WalletSkeleton v-if="isLoading" />

  <div
    v-else
    class="py-[34px] px-[15px] md:px-[30px] h-full flex flex-col border border-[#AD7084] border-solid rounded-[20px]"
  >
    <div class="mb-[20px] flex flex-col md:flex-row gap-[10px] justify-between items-center">
      <h2 class="text-[#EBE4DF] text-[20px] font-extrabold leading-normal">Zahra Ahmed</h2>
      <p class="px-[12px] h-[30px] flex items-center justify-center gap-[6px] rounded-[100px] bg-[#EBE4DF] text-[#373A42] text-[14px] font-[350] leading-normal">
        Available Points<span class="text-[#A0576F] font-bold">1987 pts</span>
      </p>
    </div>

    <div class="flex flex-col md:flex-row gap-[35px]">
      <div class="flex-1">
        <FlipCard>
          <template #front>
            <div class="relative">
              <img class="w-full" src="/public/assets/img/card.png" alt="" />
              <div class="absolute inset-0 px-[16px] py-[20px] flex flex-col justify-between">
                <div>
                  <div class="flex justify-between mb-[12px]">
                    <p class="text-white text-end text-[16px] font-bold leading-normal">Regular</p>
                    <InfoFilledIcon />
                  </div>
                  <div class="flex justify-between w-[70%] md:w-[57%]">
                    <span class="text-white text-[16px] font-normal leading-normal">Redeem Points</span>
                    <span class="text-white text-[16px] font-bold leading-normal">800 Pts</span>
                  </div>
                  <div class="flex justify-between w-[70%] md:w-[57%]">
                    <span class="text-white text-[16px] font-normal leading-normal">Expired Points</span>
                    <span class="text-white text-[16px] font-bold leading-normal">400 Pts</span>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between">
                    <span class="text-white text-[16px] font-bold leading-normal">12560 Points</span>
                    <span class="text-white text-[16px] font-bold leading-normal">251.2 SAR</span>
                  </div>
                  <div class="mt-[3px] mb-[7px]">
                    <UProgress
                      v-model="progressvalue"
                      :ui="{ slots: { indicator: 'bg-green-500 h-full rounded' } }"
                    />
                  </div>
                  <div class="flex justify-between">
                    <span class="text-white text-[16px] font-normal leading-normal">500 points till your next level</span>
                    <span class="text-white text-[16px] font-normal leading-normal">Level 3</span>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <template #back>
            <div class="relative">
              <img class="w-full" src="/public/assets/img/card.png" alt="" />
              <div class="absolute inset-0 px-[16px] py-[50px] flex flex-col justify-between">
                <div class="absolute inset-[17px] start-auto">
                  <InfoFilledIcon />
                </div>
                <p class="text-white text-[16px] font-bold leading-normal">Points Scheme</p>
                <p class="text-white text-[16px] font-[500] leading-normal">Spend 1 SAR Earn 1 Point</p>
                <p class="text-white text-[16px] font-[500] leading-normal">Redeem 100 Points Get 2 SAR</p>
              </div>
            </div>
          </template>
        </FlipCard>

        <UButton
          @click="modalOpen = true"
          class="rounded-[100px] border border-[#EBE4DF] bg-transparent hover:bg-[#913E5D] disabled:bg-transparent aria-disabled:bg-transparent text-[#EBE4DF] text-[15px] font-[400] leading-normal w-full h-[60px] justify-center mt-[30px]"
        >
          <InfoFilledIcon />
          <span>Explore the Loyalty Program</span>
        </UButton>

        <!-- Transfer Inputs -->
        <div class="mt-[30px]">
          <p class="text-start text-[18px] font-[500] text-white mb-3">Transfer Points</p>
          <div class="flex items-center gap-[10px] border border-[#EBE4DF] rounded-[13px] px-[23px] bg-transparent">
            <input
              placeholder="Minimum 200 points."
              id="transfer-points"
              class="flex-1 outline-none bg-transparent text-[#BBCACF] placeholder:text-[#D3C9C5] text-[14px] h-[50px]"
              type="text"
            />
          </div>
          <p class="text-[#C6C6C7] text-[14px] font-[350] leading-normal mt-[6px]">
            Maximum amount of points to be transferred is 1000 pts
          </p>
        </div>

        <div class="mt-[30px]">
          <p class="text-start text-[18px] font-[500] text-white mb-3">Transfer To</p>
          <div
            class="flex rounded-[14px] border-[1.2px] border-[#EBE4DF] px-[18px] py-[10px] h-[50px] tracking-[2.61px] text-[#BBCACF]"
          >
            <div class="flex items-center gap-2">
              <img src="/assets/img/sa-flag.svg" alt="saudi-flag" class="w-[35px] h-[23px]" />
              <span class="text-[#BBCACF] font-medium text-[14px]">+966</span>
            </div>
            <div class="mx-[18px] border-l border-[#BBCACF]"></div>
            <input
              type="text"
              placeholder="50 XXXX XXXX"
              class="flex-1 outline-none bg-transparent text-[#BBCACF] placeholder:text-[#D3C9C5] text-[14px]"
            />
          </div>
        </div>

        <BaseButton
          label="Transfer"
          class="flex h-[50px] w-full justify-center items-center self-stretch rounded-[100px] bg-[#EBE4DF] text-[#A0576F] text-[16px] font-normal leading-normal mt-[30px] disabled:bg-[#EBE4DF]"
        />
      </div>

      <!-- Right side: Transactions -->
      <div class="flex-1 rounded-[16px] border border-[#AD7084] px-[14px] py-[16px]">
        <h2 class="text-[#EBE4DF] text-[18px] font-normal leading-normal text-center [mb-10px]">Recent Transactions</h2>
        <template v-for="i in 5" :key="i">
          <div class="mb-[12px] pb-[7px] border-b border-b-[#B29E791A]">
            <div class="flex justify-between items-end">
              <div>
                <p class="text-[#EBE4DF] text-[14px] font-[350] leading-normal mb-[5px]">08/06/2024</p>
                <div class="flex gap-[5px] items-center">
                  <img src="/public/assets/img/earned.svg" alt="" />
                  <span class="text-[#EBE4DF] text-[14px] font-[350] leading-normal">Earned</span>
                </div>
              </div>
              <div>
                <p class="text-[#44BB94] text-end text-[14px] font-[350] leading-normal">240 Pts</p>
                <p class="text-[#EBE4DF] text-[12px] font-[350] leading-normal">Available till 17/09/2024 | 12:00 AM</p>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <Dialog v-model:open="modalOpen" :modalMaxWidth="'max-w-[490px]'">
    <template #body>
      <div class="px-[67px] py-[30px] relative">
        <h2 class="text-[#A0576F] text-center text-[23px] font-bold leading-normal mb-[30px]">Points Scheme</h2>
        <div class="px-[10px] py-[20px] rounded-[16px] bg-[#A0576F] flex flex-col justify-between gap-[25px]">
          <p class="text-[#EBE4DF] text-center text-[16px] font-[350]">
            Order more to get more points and automatically moved into next level.
          </p>
          <p class="text-[#EBE4DF] text-center text-[16px] font-[350]">
            More rewards & discounts are waiting for you!
          </p>
        </div>

        <div class="mt-[30px] overflow-y-auto max-h-[45vh]">
          <div
            v-for="(level, index) in loyaltyLevels"
            :key="index"
            class="border-b border-dashed border-b-[#A0576F80] pb-[8px] pt-[17px]"
          >
            <div class="flex">
              <div class="flex-1">
                <img :src="level.image" alt="" />
              </div>
              <div class="flex-4">
                <h4 class="text-[#A0576F] text-[16px] font-bold leading-normal">{{ level.name }}</h4>
                <p class="text-[#A0576F] text-[16px] font-[400] leading-normal">{{ level.description }}</p>
              </div>
            </div>

            <UCollapsible v-model:open="level.open" class="flex flex-col gap-2">
              <UButton class="more-btn bg-transparent text-[#BBCACF] hover:text-[#A0576F] p-0 mt-[16px] hover:bg-transparent justify-center">
                <span>{{ level.open ? 'Show Less' : 'Read More' }}</span>
              </UButton>
              <template #content>
                <p class="text-[#AD7084] text-[14px] font-[300]">{{ level.details }}</p>
              </template>
            </UCollapsible>
          </div>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import FlipCard from './FlipCard.vue'
import Dialog from '@/components/base/Dialog.vue'
import InfoFilledIcon from '@/components/icons/InfoFilledIcon.vue'
import WalletSkeleton from '@/components/skeletons/WalletSkeleton.vue'

const isLoading = ref(true)
const modalOpen = ref(false)
const progressvalue = ref(50)

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 1500)
})

const loyaltyLevels = ref([
  {
    name: 'Regular',
    image: '/assets/img/point-schema.png',
    description: 'Enjoy 2.5% discount on your next 10 orders.',
    details: 'You earn 1 point per 1 SAR. Redeem 100 points = 2 SAR.',
    open: false
  },
  {
    name: 'Silver',
    image: '/assets/img/point-schema.png',
    description: 'Get free shipping on all orders this month.',
    details: 'Earn faster points and gain shipping perks.',
    open: false
  },
  {
    name: 'Gold',
    image: '/assets/img/point-schema.png',
    description: 'Access exclusive discounts and offers.',
    details: 'Extra rewards, premium access, and vouchers.',
    open: false
  }
])
</script>

<style>
.more-btn:hover svg path {
  stroke: #A0576F !important;
}
</style>
