<template>
  <div class="bg-decore-modal mx-auto rounded-[30px] overflow-hidden shadow-lg bg-[#EBE4DF] text-[#5F2C3E]">
    <div class="px-[20px] md:px-[53px] py-[34px] relative">
      <h2 class="text-center mb-[32px] text-[#A0576F] text-[23px] font-bold leading-normal">
        {{ $t('addresses.title') }}
      </h2>

      <!-- Loading / Error -->
      <AddressesSkeleton v-if="isLoading" />
      <div v-else-if="addr.error" class="text-center py-6 text-sm text-red-600">
        {{ addr.error }}
      </div>

      <!-- Address list -->
      <div v-else>
        <div
          v-for="item in addr.sorted"
          :key="item.id"
          class="px-[30px] py-[20px] border-[2px] border-[#A0576F] rounded-[12px] mb-[10px] flex justify-between cursor-pointer transition"
          :class="item.is_preferred ? 'bg-[#A0576F]' : 'hover:bg-[#0000000b]'"
          @click="pickAddress(item)"
        >
          <div class="md:flex-2">
            <h3
              class="text-[18px] font-medium leading-normal mb-[5px]"
              :class="item.is_preferred ? 'text-[#EBE4DF]' : 'text-[#A0576F]'"
            >
              {{ item.title || 'Address' }}
            </h3>

            <p
              class="text-[14px] font-[350] flex gap-[10px]"
              :class="[item.is_preferred ? 'text-[#EBE4DF] address-class-selected' : 'text-[#5B605C] address-class']"
            >
              <span>{{ item.full_address || '—' }}</span>
            </p>
          </div>

          <div class="md:flex-1 flex gap-3 justify-end items-start z-10" @click.stop>
            <!-- Edit -->
            <button class="cursor-pointer" @click="onEdit(item)">
              <EditIcon />
            </button>

            <!-- Delete (directly without confirm) -->
            <button class="cursor-pointer" @click="removeAddress(item)">
              <DeleteIcon />
            </button>
          </div>
        </div>

        <div v-if="!addr.sorted.length" class="text-center text-sm opacity-70 py-6">
          No addresses yet.
        </div>
      </div>

      <!-- Add new address -->
      <BaseButton
        class="mt-[20px] flex-1 w-full h-[50px] bg-transparent hover:bg-transparent text-[#6B8B9B] border border-dashed border-[#6B8B9B] rounded-full text-[13px] font-medium"
        @click="openAddAddressDialog"
      >
        <span>{{ t('addresses_add_new') }}</span>
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
// Imports
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import BaseButton from '@/components/base/Button.vue'
import EditIcon from '@/components/icons/EditIcon.vue'
import DeleteIcon from '@/components/icons/DeleteIcon.vue'
import { useApp } from '~/stores/app'
import { useAddresses, type Address } from '~/stores/address'
import AddressesSkeleton from '~/components/skeletons/AddressesSkeleton.vue'
import { COMPONENTS } from '~/data/constants'
const { t } = useI18n()

// Props and emits
const props = defineProps<{
  onSelected?: (address: Address | undefined) => void
}>()

const emit = defineEmits<{
  (e: 'add'): void
  (e: 'edit', item: Address): void
  (e: 'remove', id: number): void
  (e: 'selected', item: Address | undefined): void
}>()

// Stores
const app = useApp()
const addr = useAddresses()
// Use storeToRefs to keep reactivity for primitives
const { isLoading } = storeToRefs(addr)

// Fetch addresses on mount
onMounted(() => {
  addr.fetchAddresses()
})

// Select preferred address then close modal
const pickAddress = async (item: Address) => {
  await addr.setPreferred(item.id)
  const selected = addr.preferred || item
  emit('selected', selected)
  props.onSelected?.(selected)
  app.setDialogShow(false)
}

// Direct delete (no confirm)
const removeAddress = async (item: Address) => {
  await addr.deleteAddress(item.id)
  emit('remove', item.id)
}

// Open add dialog (create flow)
// Open add dialog (create flow)
const openAddAddressDialog = () => {
  app.setDialogComponent(COMPONENTS.ADD_ADDRESS, {
    modalMaxWidth: 'max-w-[1000px]',
    mode: 'add',
    // Child will call onSave(payload) and await it to show "Saving…"
    onSave: async (payload: {
      title: string
      full_address: string
      latitude: number
      longitude: number
    }) => {
      // 1) Create
      const created = await addr.createAddress({
        ...payload,
        // if your API requires this on create, keep 0 (not preferred by default)
        is_preferred: 0 as any
      })

      // 2) Refresh to get the new id in store
      await addr.fetchAddresses(true)

      // 3) Resolve newly created address id robustly
      const createdId =
        (created as any)?.id ??
        addr.items.find(a =>
          (a.title || '').trim() === payload.title.trim() &&
          Math.abs((a.latitude ?? 0) - payload.latitude) < 1e-6 &&
          Math.abs((a.longitude ?? 0) - payload.longitude) < 1e-6
        )?.id

      // 4) Select it (this will also close the big modal via pickAddress)
      if (createdId) {
        const added = addr.byId(createdId)
        if (added) {
          await pickAddress(added)
          return
        }
      }

      // Fallback: close if we couldn't resolve it for any reason
      app.setDialogShow(false)
    }
  })
  app.setDialogShow(true)
}


// Open add dialog in edit mode with initial values
const onEdit = (item: Address) => {
  app.setDialogComponent(COMPONENTS.ADD_ADDRESS, {
    modalMaxWidth: 'max-w-[1000px]',
    mode: 'edit',
    initial: {
      id: item.id,
      title: item.title ?? '',
      full_address: item.full_address ?? '',
      latitude: item.latitude ?? undefined,
      longitude: item.longitude ?? undefined
    },
    // Called by child on save
    onSave: async (payload: {
      title: string
      full_address: string
      latitude: number
      longitude: number
    }) => {
      await addr.updateAddress(item.id, {
        title: payload.title,
        full_address: payload.full_address,
        latitude: payload.latitude,
        longitude: payload.longitude
      })
      await addr.fetchAddresses(true)
      app.setDialogShow(false)
      emit('edit', { ...item, ...payload } as Address)
    }
  })
  app.setDialogShow(true)
}
</script>

<style>
.address-class::before {
  content: url(/assets/img/address-icon.svg);
  margin-inline-end: 8px;
}
.address-class-selected::before {
  content: url(/assets/img/address-icon-selected.svg);
  margin-inline-end: 8px;
}
</style>
