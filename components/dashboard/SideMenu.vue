<template>
  <div>
    <div class="py-[22px] px-[30px] h-full flex flex-col border border-[#AD7084] border-solid rounded-[20px] mb-8">
      <div class="text-base font-medium mb-4 text-[#BBCACF] ">{{ $t('menu_title') }}</div>

      <ul class="space-y-2 side-menu">
        <li class="rounded-md" v-for="item in menuItems" :key="item.id">
          <NuxtLink :to="`/dashboard/${item.id}`"
            class="flex gap-3 py-2 px-[40px] rounded-[100px] !hover:opacity-100 justify-start text-base font-medium">
            <div v-html="getIcon(item)"></div>
            <span>{{ $t(item.label) }}</span>
          </NuxtLink>
        </li>
      </ul>
    </div>

    <div class="mt-auto mb-6">
      <BaseButton :label="$t('menu_logout')" @click="handleLogout"
        class="bg-[#C44E4E] text-white rounded-[100px] w-full py-[16px] justify-center text-[18px] font-normal leading-[100%] tracking-[0] border border-[#A0576F] hover:bg-[#913E5D] transition cursor-pointer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'

import MenuProfileIcon from '@/components/icons/MenuProfileIcon.vue'
import MenuBookingIcon from '@/components/icons/MenuBookingIcon.vue'
import MenuWalletIcon from '@/components/icons/MenuWalletIcon.vue'
import MenuCardsIcon from '@/components/icons/MenuCardsIcon.vue'
import MenuTicketsIcon from '@/components/icons/MenuTicketsIcon.vue'

import { icons } from '@/data/icons'

// Apply admin middleware to protect this page
definePageMeta({
  middleware: 'admin'
})

const authStore = useAuth()
const router = useRouter()

const handleLogout = async () => {
  await authStore.logout()
  await router.push('/')
}

const menuItems = [
  { id: 'profile', label: 'menu_profile', icon: 'menu_profile' },
  { id: 'bookings', label: 'menu_bookings', icon: 'menu_booking' },
  { id: 'wallet', label: 'menu_wallet', icon: 'menu_wallet' },
  { id: 'gift-cards', label: 'menu_gift_cards', icon: 'menu_cards' },
  { id: 'tickets', label: 'menu_tickets', icon: 'menu_tickets' }
]

const route = useRoute()
const activeItem = ref(route.query.tab || 'profile')

watch(() => route.query.tab, (tab) => {
  activeItem.value = tab || 'profile'
}, { immediate: true })

const emit = defineEmits(['menu-click'])

function handleMenuClick(menuId) {
  emit('menu-click', menuId)
}

const getIcon = function (item) {
  return icons?.[item.icon] ? icons[item.icon]() : null
}
</script>


<style>

.side-menu li{
  color: #EBE4DF;
}

</style>