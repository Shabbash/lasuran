<template>
  <div v-if="!isDisabled" class="mb-[18px] relative min-h-[47px]">
    <!-- Header row with switch -->
    <div class="flex items-center justify-between bg-[#EBE4DF] rounded-full px-[25px] h-[47px]">
      
        <div class="flex items-center gap-[10px]">
          <!-- Icon from API -->
<div
  v-if="vipFee?.icon"
  class="w-[24px] h-[24px] flex items-center justify-center"
>
  <img
    :src="vipFee.icon"
    :alt="vipFee.name || 'VIP Service'"
    class="w-full h-full object-contain"
  />
</div>

<!-- fallback local icon -->
<VipServiceIcon v-else />

<!-- Name from API -->
<div class="text-[#A0576F] text-[15px] font-[400]">
  {{ vipFee?.name || t('vip_title') }}
</div>

          </div>
      <USwitch v-model="isOn" :disabled="isDisabled" :ui="{
        base: 'data-[state=unchecked]:bg-[#BFBFBF] data-[state=checked]:bg-[#D99EB2] h-[22px]',
        thumb: 'bg-[#90928F] data-[state=checked]:bg-[#A0576F]'
      }" @update:modelValue="onToggle" />


    </div>

    <!-- Selected address chip (title only) -->
    <div v-if="isOn && selectedAddressTitle"
      class="bg-[#EBE4DFE5] mx-[5px] px-[26px] pb-[12px] pt-[14px] mt-[8px] rounded-[16px] flex items-center justify-between">
      
      
        <div class="text-[#A0576F] text-[15px] font-medium">
          {{ t('vip_address_label') }}: {{ selectedAddressTitle }}
        </div>

     
     
      <div class="flex items-center gap-[7px]">
        <button class="cursor-pointer" @click="openAddressPicker" :aria-label="t('addresses.btn_edit_aria')">
          <EditIcon />
        </button>
        <button class="cursor-pointer" @click="clearVip" :aria-label="t('addresses.btn_delete_aria')">
          <DeleteIcon />
        </button>
      </div>
    </div>
  </div>
</template>



<script setup lang="ts">

import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useApp } from '~/stores/app'
import { useCart } from '~/stores/cart'
import { useAddresses } from '~/stores/address'
import { COMPONENTS } from '~/data/constants'
import EditIcon from '@/components/icons/EditIcon.vue'
import DeleteIcon from '@/components/icons/DeleteIcon.vue'
import VipServiceIcon from '@/components/icons/VipServiceIcon.vue'

const { t } = useI18n()
const appStore = useApp()
const cart = useCart()
const addresses = useAddresses()

// Local switch state
const isOn = ref(false)

// Disable if cart empty or no fees
// Disable only when cart is empty
const isDisabled = computed(() => {
  const noItems = (cart.getProductsCount ?? 0) === 0
  const noFees = (cart.available_service_fees?.length ?? 0) === 0
  return noItems || noFees
})


// Selected fee/address from store
const chosenFeeId = computed(() => cart.selectedServiceFeeId)
const chosenAddressId = computed(() => cart.selectedServiceFeeAddressId)

const selectedAddressTitle = computed(() => {
  if (!chosenAddressId.value) return ''
  const a = addresses.byId?.(chosenAddressId.value) || addresses.items?.find(x => x.id === chosenAddressId.value)
  return a?.title || ''
})
// Extract the first service fee (or the specific VIP fee later)
// VIP service fee from API (for now: first available fee)
const vipFee = computed(() => {
  return cart.available_service_fees?.[0] ?? null
})

// Whether we actually have a VIP fee → used to show/hide component
const hasVip = computed(() => !!vipFee.value)


function requiresLocation(fee: any) {
  const cond = fee?.applied_condition ?? fee?.condition
  return String(cond) === 'trigger_by_location'
}

function pickDefaultFee() {
  // Use the VIP fee computed from API
  return vipFee.value
}

function openAddressPicker(feeId?: number) {
  appStore.setDialogComponent(COMPONENTS.ADDRESSES_DIALOG, {
    modalMaxWidth: 'max-w-[539px]',

    // when user picks an existing address
    onSelected: async (addr: any) => {
      const idToApply = feeId ?? chosenFeeId.value
      if (idToApply) {
        await cart.applyServiceFee(idToApply, addr?.id)
      }
      appStore.setDialogShow(false)
    },

    // when user chooses to add a new address
    onAdd: () => {
      appStore.setDialogComponent(COMPONENTS.ADD_ADDRESS, {
        modalMaxWidth: 'max-w-[1000px]',
        mode: 'add',
        // After adding, apply VIP immediately with the new address
        onSave: async (payload: {
          title: string
          full_address: string
          latitude: number
          longitude: number
        }) => {
          const created = await addresses.createAddress(payload)
          await addresses.fetchAddresses(true)

          const createdId =
            (created as any)?.id
            ?? addresses.items.find(a =>
                a.title?.trim() === payload.title.trim()
                && Math.abs((a.latitude ?? 0) - payload.latitude) < 1e-6
                && Math.abs((a.longitude ?? 0) - payload.longitude) < 1e-6
              )?.id
            ?? addresses.sorted?.[0]?.id

          const idToApply = feeId ?? chosenFeeId.value
          if (idToApply && createdId) {
            await cart.applyServiceFee(idToApply, createdId)
          }

          appStore.setDialogShow(false)
        }
      })
      appStore.setDialogShow(true)
    },

    // if user closes without selecting/adding -> revert switch if nothing applied
    onCancel: () => {
      // Only turn switch off if VIP wasn't actually applied (no params.service_fees)
      if (!(cart.params?.service_fees?.length > 0)) {
        isOn.value = false
        cart.selectedServiceFeeId = null
        cart.selectedServiceFeeAddressId = null
      }
    }
  })

  appStore.setDialogShow(true)
}


async function enableVip() {
  if (isDisabled.value) { isOn.value = false; return }

  // Decide which fee to apply
  const fee = pickDefaultFee()
  if (!fee) { isOn.value = false; return }

  // Pre-set fee id so the address modal knows what to apply
  // cart.selectedServiceFeeId = fee.id

  if (requiresLocation(fee) && !chosenAddressId.value) {
    // Must pick an address → open modal
openAddressPicker(fee.id)
  } else {
    // Apply immediately (no address needed or already selected)
    await cart.applyServiceFee(fee.id, chosenAddressId.value ?? undefined)
  }
}

async function clearVip() {
  isOn.value = false
  await cart.clearServiceFee()
}

/** Handle only user toggles (not programmatic sync) */
const onToggle = async (val: boolean) => {
  isOn.value = val
  if (val) {
    // If already applied (e.g., persisted), do nothing
    if (chosenFeeId.value || (cart.params?.service_fees?.length ?? 0) > 0) return
    await enableVip()
  } else {
    if (chosenFeeId.value || (cart.params?.service_fees?.length ?? 0) > 0) {
      await clearVip()
    }
  }
}

/** Programmatic sync on mount & when cart changes */
const isVipApplied = computed(() =>
  (!!cart.selectedServiceFeeId || (cart.params?.service_fees?.length ?? 0) > 0) &&
  (cart.getProductsCount ?? 0) > 0
)

onMounted(() => { isOn.value = isVipApplied.value })

watch(
  [() => cart.selectedServiceFeeId, () => cart.selectedServiceFeeAddressId, () => cart.params?.service_fees, () => cart.getProductsCount],
  () => { isOn.value = isVipApplied.value }
)

</script>
