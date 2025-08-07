<template>
  <WalletSkeleton v-if="isLoading" />

  <div v-else
    class="py-[34px] px-[15px] md:px-[30px] h-full flex flex-col border border-[#AD7084] border-solid rounded-[20px]">
    <div class="mb-[20px] flex flex-col md:flex-row gap-[10px] justify-between items-center">
      <h2 class="text-[#EBE4DF] text-[20px] font-extrabold leading-normal">{{ customerName }}</h2>
      <p
        class="px-[12px] h-[30px] flex items-center justify-center gap-[6px] rounded-[100px] bg-[#EBE4DF] text-[#373A42] text-[14px] font-[350] leading-normal">
        {{ $t('wallet_available_points') }}<span class="text-[#A0576F] font-bold">{{ availablePoints }} {{
          $t('wallet_pts') }}</span>
      </p>
    </div>

    <div class="flex flex-col md:flex-row gap-[35px]">
      <div class="flex-1">
        <FlipCard>
          <template #front>
            <div class="relative h-full rounded-[12px] overflow-hidden">
              <img class="w-full h-full object-cover" :src="customerClass.front_image || '/public/assets/img/card.png'"
                alt="" />
              <div class="absolute inset-0 px-[16px] py-[20px] flex flex-col justify-between">
                <div>
                  <div class="flex justify-between mb-[12px]">
                    <p class="text-white text-end text-[16px] font-bold leading-normal">
  {{ customerClassDetails.name__ml || customerClass.class_level || $t('wallet_regular') }}
                      </p>
                    <InfoFilledIcon />
                  </div>
                  <div class="flex justify-between w-[70%] md:w-[57%]">
                    <span class="text-white text-[16px] font-normal leading-normal">{{ $t('wallet_redeemed_points')
                    }}</span>
                    <span class="text-white text-[16px] font-bold leading-normal">
                      {{ customerClass.redeemed_points || '0' }} {{ $t('wallet_pts') }}
                    </span>

                  </div>
                  <div class="flex justify-between w-[70%] md:w-[57%]">
                    <span class="text-white text-[16px] font-normal leading-normal">{{ $t('wallet_expired_points')
                    }}</span>
                    <span class="text-white text-[16px] font-bold leading-normal">
                      {{ customerClass.expired_points || '0' }} {{ $t('wallet_pts') }}
                    </span>

                  </div>
                </div>
                <div>
                  <div class="flex justify-between">
                    <span class="text-white text-[16px] font-bold leading-normal">{{ customerClass.total_points || '0'
                    }} {{ $t('wallet_points') }}</span>
                    <span class="text-white text-[16px] font-bold leading-normal"><span class="sar-icon">&#xe900;</span>
                      {{ customerClass.total_points_value }}</span>
                  </div>
                  <div class="mt-[3px] mb-[7px]">
                    <UProgress v-model="progressValue" :ui="{ slots: { indicator: 'bg-green-500 h-full rounded' } }" />
                  </div>
                  <div class="flex justify-between">
                    <span class="text-white text-[16px] font-normal leading-normal">{{
                      customerClass.remaining_to_next_tier || '0' }} {{ $t('wallet_till_next_level') }}</span>
                    <span class="text-white text-[16px] font-normal leading-normal">{{ customerClass.class_level ||
                      $t('wallet_level_1') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <template #back>
            <div class="relative h-full rounded-[12px] overflow-hidden">
              <img class="w-full h-full object-cover" :src="customerClass.back_image || '/public/assets/img/card.png'"
                alt="" />
              <div class="absolute inset-0 px-[16px] py-[50px] flex flex-col justify-between">
                <div class="absolute inset-[17px] start-auto">
                  <InfoFilledIcon />
                </div>
                <p class="text-white text-[16px] font-bold leading-normal">{{ $t('wallet_points_scheme') }}</p>
                <p class="text-white text-[16px] font-[500] leading-normal">
                  {{ $t('wallet_spend') }} <span class="sar-icon">&#xe900;</span>
                  {{ pointSchema.value || '1' }} {{ $t('wallet_earn') }} {{ pointSchema.points || $t('wallet_point') }}
                </p>

                <p class="text-white text-[16px] font-[500] leading-normal">
                  {{ $t('wallet_redeem') }} {{ pointSchema.point_redeemed || '100' }}
                  {{ $t('wallet_get') }} {{ pointSchema.value_spending || $t('wallet_point') }}
                </p>

              </div>
            </div>
          </template>
        </FlipCard>

        <BaseButton @click="openLoyaltyDialog"
          class="rounded-[100px] border border-[#EBE4DF] bg-transparent hover:bg-[#913E5D] disabled:bg-transparent aria-disabled:bg-transparent text-[#EBE4DF] text-[15px] font-[400] leading-normal w-full h-[60px] justify-center mt-[30px]">
          <InfoFilledIcon />
          <span>{{ $t('wallet_explore_loyalty') }}</span>
        </BaseButton>


        <!-- Transfer Inputs -->
        <div class="mt-[30px]">
          <p class="text-start text-[18px] font-[500] text-white mb-3">{{ $t('wallet_transfer_points') }}</p>
          <div :class="[
            'flex items-center gap-[10px] border rounded-[13px] px-[23px] bg-transparent',
            pointsValidationError ? 'border-red-400' : 'border-[#EBE4DF]'
          ]">
            <input v-model="transferPoints"
              :placeholder="`${$t('wallet_minimum_points', { count: transferSchema.min_point_to_transfer || '10' })}`"
              id="transfer-points"
              class="flex-1 outline-none bg-transparent text-[#BBCACF] placeholder:text-[#D3C9C5] text-[14px] h-[50px]"
              type="number" :min="transferSchema.min_point_to_transfer || '10'"
              :max="transferSchema.max_point_to_transfer || '10000'" />

          </div>
          <p v-if="pointsValidationError" class="text-red-400 text-[12px] font-[350] leading-normal mt-[6px]">
            {{ pointsValidationError }}
          </p>
          <p v-else class="text-[#C6C6C7] text-[14px] font-[350] leading-normal mt-[6px]">
            {{ $t('wallet_maximum_transfer_message', { count: transferSchema.max_point_to_transfer || '1000' }) }}
          </p>

        </div>

        <div class="mt-[30px]">
          <p class="text-start text-[18px] font-[500] text-white mb-3">{{ $t('wallet_transfer_to') }}</p>
          <div :class="[
            'mobile_number flex rounded-[14px] border-[1.2px] px-[18px] py-[10px] h-[50px] tracking-[2.61px] text-[#BBCACF] ',
            mobileValidationError ? 'border-red-400' : 'border-[#EBE4DF]'
          ]">
            <div class="flex items-center gap-2 ">
              <img src="/assets/img/sa-flag.svg" alt="saudi-flag" class="w-[35px] h-[23px]" />
              <span class="text-[#BBCACF] font-medium text-[14px]">+966</span>
            </div>
            <div class="mx-[18px] border-l border-[#BBCACF]"></div>
            <input v-model="transferMobile" type="text" placeholder="50 XXXX XXXX"
              class="flex-1 outline-none bg-transparent text-[#BBCACF] placeholder:text-[#D3C9C5] text-[14px]"
              maxlength="9" />
          </div>
          <p v-if="mobileValidationError" class="text-red-400 text-[12px] font-[350] leading-normal mt-[6px]">
            {{ mobileValidationError }}
          </p>
        </div>

        <BaseButton :label="isTransferring ? $t('wallet_transferring') : $t('wallet_transfer')"
          @click="handleTransferPoints" :disabled="!canTransfer || isTransferring"
          class="flex h-[50px] w-full justify-center items-center self-stretch rounded-[100px] bg-[#EBE4DF] text-[#A0576F] text-[16px] font-normal leading-normal mt-[30px] disabled:bg-[#EBE4DF] disabled:opacity-50">
          <div v-if="isTransferring" class="animate-spin rounded-full h-4 w-4 border-b-2 border-[#A0576F] mr-2"></div>
          {{ isTransferring ? $t('wallet_transferring') : $t('wallet_transfer') }}
        </BaseButton>

      </div>

      <!-- Right side: Transactions -->
      <div class="flex-1 rounded-[16px] border border-[#AD7084] px-[14px] py-[16px]">
        <h2 class="text-[#EBE4DF] text-[18px] font-normal leading-normal text-center mb-[10px]">{{
          $t('wallet_recent_transactions') }}</h2>

        <!-- Loading state -->
        <div v-if="isLoading" class="flex justify-center items-center py-10">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        </div>

        <!-- Empty state -->
        <div v-else-if="transactions.length === 0" class="text-center py-10">
          <p class="text-[#EBE4DF] text-sm">{{ $t('wallet_no_transactions') }}</p>
        </div>

        <!-- Transactions list -->
        <template v-else v-for="transaction in transactions" :key="transaction.id">
          <div class="mb-[12px] pb-[7px] border-b border-b-[#B29E791A]">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <p class="text-[#EBE4DF] text-[14px] font-[350] leading-normal mb-[5px]">{{ transaction.date }}</p>
                <div class="flex gap-[5px] items-center mb-1">
                  <img :src="transaction.icon" :alt="transaction.type" class="w-4 h-4"
                    onerror="this.style.display='none'" />
                  <span class="text-[#EBE4DF] text-[14px] font-[350] leading-normal">{{ transaction.sub_title ||
                    transaction.type }}</span>
                </div>
                <p v-if="transaction.note" class="text-[#C6C6C7] text-[12px] font-[300] leading-normal">{{
                  transaction.note }}</p>
                <p v-if="transaction.order_number" class="text-[#C6C6C7] text-[12px] font-[300] leading-normal">
                  {{ $t('wallet_order_number') }} {{ transaction.order_number }}
                </p>

              </div>
              <div class="text-right">
                <p :class="[
                  'text-end text-[14px] font-[500] leading-normal mb-1',
                  getTransactionColor(transaction.type_status?.class || transaction.type)
                ]">{{ transaction.points }}</p>
                <!-- <p v-if="transaction.expired_at" class="text-[#EBE4DF] text-[12px] font-[350] leading-normal">
                  Available till {{ transaction.expired_at }}
                </p> -->

                <p v-if="transaction.expired_at && transaction.type_status?.class?.toLowerCase() !== 'danger'"
                  class="text-[#EBE4DF] text-[12px] font-[350] leading-normal">
                  {{ $t('wallet_available_till') }} {{ transaction.expired_at }}
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
          <button @click="showAllTransactions = true"
            class="text-[#A0576F] text-[14px] font-medium hover:text-[#8B4A63] transition-colors">
            {{ $t('wallet_view_all') }}
          </button>
        </div>

        <!-- Show Less Button -->
        <div v-if="showAllTransactions && hasMoreTransactions" class="text-center mt-4">
          <button @click="showAllTransactions = false"
            class="text-[#A0576F] text-[14px] font-medium hover:text-[#8B4A63] transition-colors">
            {{ $t('wallet_show_less') }}

          </button>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import FlipCard from './FlipCard.vue'
import Dialog from '@/components/base/Dialog.vue'
import InfoFilledIcon from '@/components/icons/InfoFilledIcon.vue'
import WalletSkeleton from '@/components/skeletons/WalletSkeleton.vue'
import { useApp } from '@/stores/app'
import { COMPONENTS } from '@/data/constants'
import { useToast } from '#imports'

const { t } = useI18n()

const isLoading = ref(true)
const modalOpen = ref(false)
const walletData = ref(null)
const transferPoints = ref('')
const transferMobile = ref('')
const isTransferring = ref(false)
const customerClassDetails = computed(() => walletData.value?.customer_class_details || {})

const { setDialogComponent, setDialogShow } = useApp()

const openLoyaltyDialog = () => {
  setDialogComponent(COMPONENTS.LOYALTY_INFO, {
    customerClasses: customerClasses.value
  })
  setDialogShow(true)
}

const fetchWalletData = async () => {
  isLoading.value = true
  try {
    const { data } = await useApi('wallets', { method: 'GET' })
    if (data.value?.status && data.value?.data) {
      walletData.value = data.value.data
    }
  } catch (error) {
    console.error('Error fetching wallet data:', error)
  } finally {
    isLoading.value = false
  }
}

const customerName = computed(() => walletData.value?.name || t('wallet_customer_default'))
const availablePoints = computed(() => {
  const rawPoints = walletData.value?.customer_class?.total_points || '0'
  return parseInt(rawPoints.replace(/,/g, ''), 10) || 0
})

const customerClass = computed(() => walletData.value?.customer_class || {})
const showAllTransactions = ref(false)

const transactions = computed(() => {
  const allTransactions = walletData.value?.transactions || []
  return showAllTransactions.value ? allTransactions : allTransactions.slice(0, 5)
})

const hasMoreTransactions = computed(() => {
  const allTransactions = walletData.value?.transactions || []
  return allTransactions.length > 5
})

const pointSchema = computed(() => walletData.value?.point_schema || {})
const customerClasses = computed(() => {
  return walletData.value?.customer_classes?.map(cls => ({
    name: cls.name,
    image: cls.icon,
    description: cls.title?.replace(/<[^>]*>/g, '') || cls.description,
    details: cls.description2?.replace(/<[^>]*>/g, '') || '',
    open: false
  })) || []
})

const transferSchema = computed(() => walletData.value?.transferred_point_schema || {})
const progressValue = computed(() => Math.min(Math.max(customerClass.value?.tier_percent || 0, 0), 100))
const cashbackBalance = computed(() => walletData.value?.cashback?.balance || '0.00')

const pointsValidationError = computed(() => {
  if (!transferPoints.value) return ''
  const points = parseInt(transferPoints.value)
  const minPoints = parseInt(transferSchema.value.min_point_to_transfer || '10')
  const maxPoints = parseInt(transferSchema.value.max_point_to_transfer || '10000')
  const userAvailablePoints = parseInt(availablePoints.value || '0')

  if (isNaN(points)) return t('wallet_error_invalid_number')
  if (points < minPoints) return t('wallet_error_min_required', { min: minPoints })
  if (points > maxPoints) return t('wallet_error_max_allowed', { max: maxPoints })
  if (points > userAvailablePoints) return t('wallet_error_insufficient_points', { available: userAvailablePoints })

  return ''
})

const mobileValidationError = computed(() => {
  if (!transferMobile.value) return ''
  const mobile = transferMobile.value.trim()
  if (mobile.length < 9) return t('wallet_error_mobile_length')
  if (!/^\d+$/.test(mobile)) return t('wallet_error_mobile_digits')
  return ''
})

const canTransfer = computed(() => {
  return (
    transferPoints.value &&
    transferMobile.value &&
    !pointsValidationError.value &&
    !mobileValidationError.value &&
    !isTransferring.value
  )
})

const handleTransferPoints = async () => {
  if (!canTransfer.value) return
  isTransferring.value = true

  try {
    const payload = {
      points: parseInt(transferPoints.value),
      mobile_number: `966${transferMobile.value.trim()}`
    }

    const { data } = await useApi('wallets/transfare-points', {
      method: 'POST',
      body: payload
    })

    const toast = useToast()

    if (data.value?.status) {
      toast.add({
        title: t('wallet_transfer_success_title'),
        description: t('wallet_transfer_success_desc', { points: payload.points, mobile: payload.mobile_number }),
        color: 'success'
      })

      transferPoints.value = ''
      transferMobile.value = ''
      await fetchWalletData()
    } else {
      toast.add({
        title: t('wallet_transfer_failed_title'),
        description: data.value?.message || t('wallet_transfer_failed_desc'),
        color: 'error'
      })
    }
  } catch (error) {
    const toast = useToast()
    toast.add({
      title: t('wallet_transfer_failed_title'),
      description: t('wallet_network_error'),
      color: 'error'
    })
  } finally {
    isTransferring.value = false
  }
}

const getTransactionColor = (type) => {
  switch (type?.toLowerCase()) {
    case 'earned':
    case 'success':
      return 'text-[#44BB94]'
    case 'redeemed':
    case 'danger':
      return 'text-[#FF6B6B]'
    case 'pending':
    case 'warning':
      return 'text-[#FFA726]'
    default:
      return 'text-[#EBE4DF]'
  }
}

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
