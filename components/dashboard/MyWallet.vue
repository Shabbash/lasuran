<template>
  <WalletSkeleton v-if="isLoading" />

  <div
    v-else
    class="py-[34px] px-[15px] md:px-[30px] h-full flex flex-col border border-[#AD7084] border-solid rounded-[20px]"
  >
    <div class="mb-[20px] flex flex-col md:flex-row gap-[10px] justify-between items-center">
      <h2 class="text-[#EBE4DF] text-[20px] font-extrabold leading-normal">{{ customerName }}</h2>
      <p class="px-[12px] h-[30px] flex items-center justify-center gap-[6px] rounded-[100px] bg-[#EBE4DF] text-[#373A42] text-[14px] font-[350] leading-normal">
        Available Points<span class="text-[#A0576F] font-bold">{{ availablePoints }} pts</span>
      </p>
    </div>

    <div class="flex flex-col md:flex-row gap-[35px]">
      <div class="flex-1">
        <FlipCard>
          <template #front>
            <div class="relative h-full rounded-[12px] overflow-hidden">
              <img class="w-full h-full object-cover" :src="customerClass.front_image || '/public/assets/img/card.png'" alt="" />
              <div class="absolute inset-0 px-[16px] py-[20px] flex flex-col justify-between">
                <div>
                  <div class="flex justify-between mb-[12px]">
                    <p class="text-white text-end text-[16px] font-bold leading-normal">{{ customerClass.class_level || 'Regular' }}</p>
                    <InfoFilledIcon />
                  </div>
                  <div class="flex justify-between w-[70%] md:w-[57%]">
                    <span class="text-white text-[16px] font-normal leading-normal">Redeemed Points</span>
                    <span class="text-white text-[16px] font-bold leading-normal">{{ customerClass.redeemed_points || '0' }} Pts</span>
                  </div>
                  <div class="flex justify-between w-[70%] md:w-[57%]">
                    <span class="text-white text-[16px] font-normal leading-normal">Expired Points</span>
                    <span class="text-white text-[16px] font-bold leading-normal">{{ customerClass.expired_points || '0' }} Pts</span>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between">
                    <span class="text-white text-[16px] font-bold leading-normal">{{ customerClass.total_points || '0' }} Points</span>
                    <span class="text-white text-[16px] font-bold leading-normal">{{ cashbackBalance }} SAR</span>
                  </div>
                  <div class="mt-[3px] mb-[7px]">
                    <UProgress
                      v-model="progressValue"
                      :ui="{ slots: { indicator: 'bg-green-500 h-full rounded' } }"
                    />
                  </div>
                  <div class="flex justify-between">
                    <span class="text-white text-[16px] font-normal leading-normal">{{ customerClass.remaining_to_next_tier || '0' }} points till your next level</span>
                    <span class="text-white text-[16px] font-normal leading-normal">{{ customerClass.class_level || 'Level 1' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <template #back>
            <div class="relative h-full rounded-[12px] overflow-hidden">
              <img class="w-full h-full object-cover" :src="customerClass.back_image || '/public/assets/img/card.png'" alt="" />
              <div class="absolute inset-0 px-[16px] py-[50px] flex flex-col justify-between">
                <div class="absolute inset-[17px] start-auto">
                  <InfoFilledIcon />
                </div>
                <p class="text-white text-[16px] font-bold leading-normal">Points Scheme</p>
                <p class="text-white text-[16px] font-[500] leading-normal">Spend {{ pointSchema.value || '1' }} SAR Earn {{ pointSchema.points || '1 Point' }}</p>
                <p class="text-white text-[16px] font-[500] leading-normal">Redeem {{ pointSchema.point_redeemed || '100' }} Points Get {{ pointSchema.value_spending || '1 Point' }}</p>
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
          <div :class="[
            'flex items-center gap-[10px] border rounded-[13px] px-[23px] bg-transparent',
            pointsValidationError ? 'border-red-400' : 'border-[#EBE4DF]'
          ]">
            <input
              v-model="transferPoints"
              :placeholder="`Minimum ${transferSchema.min_point_to_transfer || '10'} points.`"
              id="transfer-points"
              class="flex-1 outline-none bg-transparent text-[#BBCACF] placeholder:text-[#D3C9C5] text-[14px] h-[50px]"
              type="number"
              :min="transferSchema.min_point_to_transfer || '10'"
              :max="transferSchema.max_point_to_transfer || '1000'"
            />
          </div>
          <p v-if="pointsValidationError" class="text-red-400 text-[12px] font-[350] leading-normal mt-[6px]">
            {{ pointsValidationError }}
          </p>
          <p v-else class="text-[#C6C6C7] text-[14px] font-[350] leading-normal mt-[6px]">
            Maximum amount of points to be transferred is {{ transferSchema.max_point_to_transfer || '1000' }} pts
          </p>
        </div>

        <div class="mt-[30px]">
          <p class="text-start text-[18px] font-[500] text-white mb-3">Transfer To</p>
          <div :class="[
            'flex rounded-[14px] border-[1.2px] px-[18px] py-[10px] h-[50px] tracking-[2.61px] text-[#BBCACF]',
            mobileValidationError ? 'border-red-400' : 'border-[#EBE4DF]'
          ]">
            <div class="flex items-center gap-2">
              <img src="/assets/img/sa-flag.svg" alt="saudi-flag" class="w-[35px] h-[23px]" />
              <span class="text-[#BBCACF] font-medium text-[14px]">+966</span>
            </div>
            <div class="mx-[18px] border-l border-[#BBCACF]"></div>
            <input
              v-model="transferMobile"
              type="text"
              placeholder="50 XXXX XXXX"
              class="flex-1 outline-none bg-transparent text-[#BBCACF] placeholder:text-[#D3C9C5] text-[14px]"
              maxlength="9"
            />
          </div>
          <p v-if="mobileValidationError" class="text-red-400 text-[12px] font-[350] leading-normal mt-[6px]">
            {{ mobileValidationError }}
          </p>
        </div>

        <BaseButton
          label="Transfer"
          @click="handleTransferPoints"
          :disabled="!canTransfer || isTransferring"
          class="flex h-[50px] w-full justify-center items-center self-stretch rounded-[100px] bg-[#EBE4DF] text-[#A0576F] text-[16px] font-normal leading-normal mt-[30px] disabled:bg-[#EBE4DF] disabled:opacity-50"
        >
          <div v-if="isTransferring" class="animate-spin rounded-full h-4 w-4 border-b-2 border-[#A0576F] mr-2"></div>
          {{ isTransferring ? 'Transferring...' : 'Transfer' }}
        </BaseButton>
      </div>

      <!-- Right side: Transactions -->
      <div class="flex-1 rounded-[16px] border border-[#AD7084] px-[14px] py-[16px]">
        <h2 class="text-[#EBE4DF] text-[18px] font-normal leading-normal text-center mb-[10px]">Recent Transactions</h2>

        <!-- Loading state -->
        <div v-if="isLoading" class="flex justify-center items-center py-10">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        </div>

        <!-- Empty state -->
        <div v-else-if="transactions.length === 0" class="text-center py-10">
          <p class="text-[#EBE4DF] text-sm">No transactions found</p>
        </div>

        <!-- Transactions list -->
        <template v-else v-for="transaction in transactions" :key="transaction.id">
          <div class="mb-[12px] pb-[7px] border-b border-b-[#B29E791A]">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <p class="text-[#EBE4DF] text-[14px] font-[350] leading-normal mb-[5px]">{{ transaction.date }}</p>
                <div class="flex gap-[5px] items-center mb-1">
                  <img :src="transaction.icon" :alt="transaction.type" class="w-4 h-4" onerror="this.style.display='none'" />
                  <span class="text-[#EBE4DF] text-[14px] font-[350] leading-normal">{{ transaction.sub_title || transaction.type }}</span>
                </div>
                <p v-if="transaction.note" class="text-[#C6C6C7] text-[12px] font-[300] leading-normal">{{ transaction.note }}</p>
                <p v-if="transaction.order_number" class="text-[#C6C6C7] text-[12px] font-[300] leading-normal">Order: {{ transaction.order_number }}</p>
              </div>
              <div class="text-right">
                <p :class="[
                  'text-end text-[14px] font-[500] leading-normal mb-1',
                  getTransactionColor(transaction.type_status?.class || transaction.type)
                ]">{{ transaction.points }}</p>
                <p v-if="transaction.expired_at" class="text-[#EBE4DF] text-[12px] font-[350] leading-normal">
                  Available till {{ transaction.expired_at }}
                </p>
                <span v-if="transaction.type_status" :class="[
                  'inline-block px-2 py-1 rounded-full text-[10px] font-medium mt-1',
                  getStatusBadgeClass(transaction.type_status.class)
                ]">
                  {{ transaction.type_status.label }}
                </span>
              </div>
            </div>
          </div>
        </template>

        <!-- View All Transactions Button -->
        <div v-if="hasMoreTransactions && !showAllTransactions" class="text-center mt-4">
          <button
            @click="showAllTransactions = true"
            class="text-[#A0576F] text-[14px] font-medium hover:text-[#8B4A63] transition-colors"
          >
            View All Transactions
          </button>
        </div>

        <!-- Show Less Button -->
        <div v-if="showAllTransactions && hasMoreTransactions" class="text-center mt-4">
          <button
            @click="showAllTransactions = false"
            class="text-[#A0576F] text-[14px] font-medium hover:text-[#8B4A63] transition-colors"
          >
            Show Less
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <Dialog v-model:open="modalOpen" :modalMaxWidth="'max-w-[490px]'">
    <template #body>
      <div class="px-[20px] md:px-[67px] py-[30px] relative">
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
            v-for="(level, index) in customerClasses"
            :key="index"
            class="border-b border-dashed border-b-[#A0576F80] pb-[8px] pt-[17px]"
          >
            <div class="flex">
              <div class="flex-1">
                <img :src="level.image || '/assets/img/point-schema.png'" :alt="level.name" class="w-12 h-12 object-contain" />
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
import { ref, onMounted, computed } from 'vue'
import FlipCard from './FlipCard.vue'
import Dialog from '@/components/base/Dialog.vue'
import InfoFilledIcon from '@/components/icons/InfoFilledIcon.vue'
import WalletSkeleton from '@/components/skeletons/WalletSkeleton.vue'

const isLoading = ref(true)
const modalOpen = ref(false)
const walletData = ref(null)
const transferPoints = ref('')
const transferMobile = ref('')
const isTransferring = ref(false)

// Fetch wallet data from API
const fetchWalletData = async () => {
  isLoading.value = true
  try {
    const { data } = await useApi('wallets', {
      method: 'GET'
    })

    if (data.value?.status && data.value?.data) {
      walletData.value = data.value.data
    }
  } catch (error) {
    console.error('Error fetching wallet data:', error)
  } finally {
    isLoading.value = false
  }
}

// Computed properties for wallet data
const customerName = computed(() => {
  return walletData.value?.name || 'User'
})

const availablePoints = computed(() => {
  return walletData.value?.customer_class?.total_points || '0'
})

const customerClass = computed(() => {
  return walletData.value?.customer_class || {}
})

const showAllTransactions = ref(false)

const transactions = computed(() => {
  const allTransactions = walletData.value?.transactions || []
  // Show only first 5 transactions unless "View All" is clicked
  return showAllTransactions.value ? allTransactions : allTransactions.slice(0, 5)
})

const hasMoreTransactions = computed(() => {
  const allTransactions = walletData.value?.transactions || []
  return allTransactions.length > 5
})

const pointSchema = computed(() => {
  return walletData.value?.point_schema || {}
})

const customerClasses = computed(() => {
  return walletData.value?.customer_classes?.map(cls => ({
    name: cls.name,
    image: cls.icon,
    description: cls.title?.replace(/<[^>]*>/g, '') || cls.description, // Remove HTML tags
    details: cls.description2?.replace(/<[^>]*>/g, '') || '', // Remove HTML tags
    open: false
  })) || []
})

const transferSchema = computed(() => {
  return walletData.value?.transferred_point_schema || {}
})

const progressValue = computed(() => {
  const tierPercent = customerClass.value?.tier_percent || 0
  return Math.min(Math.max(tierPercent, 0), 100)
})

const cashbackBalance = computed(() => {
  return walletData.value?.cashback?.balance || '0.00'
})

// Validation computed properties
const pointsValidationError = computed(() => {
  if (!transferPoints.value) return ''

  const points = parseInt(transferPoints.value)
  const minPoints = parseInt(transferSchema.value.min_point_to_transfer || '10')
  const maxPoints = parseInt(transferSchema.value.max_point_to_transfer || '10000')
  const userAvailablePoints = parseInt(availablePoints.value || '0')

  if (isNaN(points)) return 'Please enter a valid number'
  if (points < minPoints) return `Minimum ${minPoints} points required`
  if (points > maxPoints) return `Maximum ${maxPoints} points allowed`
  if (points > userAvailablePoints) return `Insufficient points. Available: ${userAvailablePoints}`

  return ''
})

const mobileValidationError = computed(() => {
  if (!transferMobile.value) return ''

  const mobile = transferMobile.value.trim()
  if (mobile.length < 9) return 'Mobile number must be at least 9 digits'
  if (!/^\d+$/.test(mobile)) return 'Mobile number must contain only digits'

  return ''
})

// Transfer validation
const canTransfer = computed(() => {
  return (
    transferPoints.value &&
    transferMobile.value &&
    !pointsValidationError.value &&
    !mobileValidationError.value &&
    !isTransferring.value
  )
})

// Handle transfer points
const handleTransferPoints = async () => {
  if (!canTransfer.value) return

  isTransferring.value = true

  try {
    const payload = {
      points: parseInt(transferPoints.value),
      mobile_number: transferMobile.value.trim()
    }

    const { data } = await useApi('wallets/transfare-points', {
      method: 'POST',
      body: payload
    })

    if (data.value?.status) {
      // Show success message
      const toast = useToast()
      toast.add({
        title: 'Points transferred successfully!',
        description: `${payload.points} points transferred to ${payload.mobile_number}`,
        color: 'success'
      })

      // Clear form
      transferPoints.value = ''
      transferMobile.value = ''

      // Refresh wallet data
      await fetchWalletData()
    } else {
      // Show error message
      const toast = useToast()
      toast.add({
        title: 'Transfer failed',
        description: data.value?.message || 'Unable to transfer points. Please try again.',
        color: 'error'
      })
    }
  } catch (error) {
    console.error('Error transferring points:', error)
    const toast = useToast()
    toast.add({
      title: 'Transfer failed',
      description: 'Network error. Please check your connection and try again.',
      color: 'error'
    })
  } finally {
    isTransferring.value = false
  }
}

// Helper function to get transaction color based on type
const getTransactionColor = (type) => {
  switch (type?.toLowerCase()) {
    case 'earned':
    case 'success':
      return 'text-[#44BB94]' // Green for earned points
    case 'redeemed':
    case 'danger':
      return 'text-[#FF6B6B]' // Red for redeemed/expired points
    case 'pending':
    case 'warning':
      return 'text-[#FFA726]' // Orange for pending
    default:
      return 'text-[#EBE4DF]' // Default white
  }
}

// Helper function to get status badge class
const getStatusBadgeClass = (statusClass) => {
  switch (statusClass?.toLowerCase()) {
    case 'success':
      return 'bg-[#44BB94] text-white'
    case 'danger':
      return 'bg-[#FF6B6B] text-white'
    case 'warning':
      return 'bg-[#FFA726] text-white'
    case 'primary':
      return 'bg-[#A0576F] text-white'
    default:
      return 'bg-[#6B7280] text-white'
  }
}

onMounted(() => {
  fetchWalletData()
})
</script>

<style>
.more-btn:hover svg path {
  stroke: #A0576F !important;
}
</style>
