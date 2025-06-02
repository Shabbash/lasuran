
<template>
    <div>
        <div class="py-[22px] px-[30px] h-full flex flex-col border border-[#AD7084] border-solid rounded-[20px] mb-8">
        <div class="text-base font-medium mb-4 text-[#BBCACF] ">Menu</div>

        <ul class="space-y-2">
        <li v-for="item in menuItems" :key="item.id" class="rounded-md">
            <UButton
            block
            :class="activeItem === item.id ? 'text-[#A0576F] bg-[#EBE4DF] hover:bg-[#EBE4DF]  !hover:text-[#A0576F] !hover:opacity-100' : 'text-[#EBE4DF] hover:bg-white opacity-100 !hover:opacity-100'"
            variant="ghost"
            class="flex  gap-3 py-2 px-[40px] rounded-[100px] !hover:opacity-100 justify-start text-base font-medium"
            @click="handleMenuClick(item.id)"
            >
            <UIcon :name="item.icon" class="flex-shrink-0" />
            <span :class="activeItem === item.id ? 'text-[#A0576F] ' : 'text-[#EBE4DF] '">{{ item.label }}</span>
            </UButton>
        </li>
        </ul>
        </div>
        <div>
            <div class="mt-auto mb-6">
            <UButton 
                block 
                variant="solid" 
                class="py-3 bg-[#C44E4E] h-[56px] text-[#EBE4DF]  rounded-[100px] hover:bg-[#C44E4E] hover:text-[#EBE4DF] opacity-100 !hover:opacity-100"
                @click="handleLogout"
            >
                Log Out
            </UButton>
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref } from 'vue';

const menuItems = [
  { id: 'profile', label: 'My Profile', icon: 'i-heroicons-user' },
  { id: 'bookings', label: 'My Bookings', icon: 'i-heroicons-calendar' },
  { id: 'wallet', label: 'My Wallet', icon: 'i-heroicons-wallet' },
  { id: 'gift-cards', label: 'My Gift Cards', icon: 'i-heroicons-gift' },
  { id: 'tickets', label: 'My Tickets', icon: 'i-heroicons-ticket' },
];

import { useRoute } from 'vue-router';
import { watch } from 'vue';

const route = useRoute();
const activeItem = ref(route.query.tab || 'profile');

watch(() => route.query.tab, (tab) => {
  activeItem.value = tab || 'profile';
}, { immediate: true });

const emit = defineEmits(['menu-click']);

function handleMenuClick(menuId) {
  // activeItem.value = menuId;
  emit('menu-click', menuId);
}

function handleLogout() {
  console.log('Logging out...');
}
</script>