<template>
  <div>
    <div class="py-[22px] px-[30px] h-full flex flex-col border border-[#AD7084] border-solid rounded-[20px] mb-8">
      <div class="text-base font-medium mb-4 text-[#BBCACF] ">Menu</div>

      <ul class="space-y-2 side-menu">

        <li class="rounded-md" v-for="item in menuItems">

          <NuxtLink :to="`/dashboard/${item.id}`" class="flex gap-3 py-2 px-[40px] rounded-[100px] !hover:opacity-100 justify-start text-base font-medium">

            <div v-html="getIcon(item)" ></div>
<!--            <MenuProfileIcon />-->
            <span :class="activeItem === 'profile' ? 'text-[#A0576F]' : 'text-[#EBE4DF]'">{{  item.label }}</span>
          </NuxtLink>
<!--          <UButton block-->
<!--            :class="activeItem === 'profile' ? 'active text-[#A0576F] bg-[#EBE4DF] hover:bg-[#EBE4DF] !hover:text-[#A0576F] !hover:opacity-100' : 'text-[#EBE4DF] hover:bg-white opacity-100 !hover:opacity-100'"-->
<!--            variant="ghost"-->
<!--            class="flex gap-3 py-2 px-[40px] rounded-[100px] !hover:opacity-100 justify-start text-base font-medium"-->
<!--            @click="handleMenuClick('profile')">-->
<!--            <MenuProfileIcon />-->
<!--            <span :class="activeItem === 'profile' ? 'text-[#A0576F]' : 'text-[#EBE4DF]'">My Profile</span>-->
<!--          </UButton>-->
        </li>

<!--        <li class="rounded-md">-->
<!--          <UButton block-->
<!--            :class="activeItem === 'profile' ? 'active text-[#A0576F] bg-[#EBE4DF] hover:bg-[#EBE4DF] !hover:text-[#A0576F] !hover:opacity-100' : 'text-[#EBE4DF] hover:bg-white opacity-100 !hover:opacity-100'"-->
<!--            variant="ghost"-->
<!--            class="flex gap-3 py-2 px-[40px] rounded-[100px] !hover:opacity-100 justify-start text-base font-medium"-->
<!--            @click="handleMenuClick('profile')">-->
<!--            <MenuProfileIcon />-->
<!--            <span :class="activeItem === 'profile' ? 'text-[#A0576F]' : 'text-[#EBE4DF]'">My Profile</span>-->
<!--          </UButton>-->
<!--        </li>-->

<!--        <li class="rounded-md">-->
<!--          <UButton block-->
<!--            :class="activeItem === 'bookings' ? 'active text-[#A0576F] bg-[#EBE4DF] hover:bg-[#EBE4DF] !hover:text-[#A0576F] !hover:opacity-100' : 'text-[#EBE4DF] hover:bg-white opacity-100 !hover:opacity-100'"-->
<!--            variant="ghost"-->
<!--            class="flex gap-3 py-2 px-[40px] rounded-[100px] !hover:opacity-100 justify-start text-base font-medium"-->
<!--            @click="handleMenuClick('bookings')">-->
<!--            <MenuBookingIcon />-->
<!--            <span :class="activeItem === 'bookings' ? 'text-[#A0576F]' : 'text-[#EBE4DF]'">My Bookings</span>-->
<!--          </UButton>-->
<!--        </li>-->

<!--        <li class="rounded-md">-->
<!--          <UButton block-->
<!--            :class="activeItem === 'wallet' ? 'active text-[#A0576F] bg-[#EBE4DF] hover:bg-[#EBE4DF] !hover:text-[#A0576F] !hover:opacity-100' : 'text-[#EBE4DF] hover:bg-white opacity-100 !hover:opacity-100'"-->
<!--            variant="ghost"-->
<!--            class="flex gap-3 py-2 px-[40px] rounded-[100px] !hover:opacity-100 justify-start text-base font-medium"-->
<!--            @click="handleMenuClick('wallet')">-->
<!--            <MenuWalletIcon />-->
<!--            <span :class="activeItem === 'wallet' ? 'text-[#A0576F]' : 'text-[#EBE4DF]'">My Wallet</span>-->
<!--          </UButton>-->
<!--        </li>-->

<!--        <li class="rounded-md">-->
<!--          <UButton block-->
<!--            :class="activeItem === 'gift-cards' ? 'active text-[#A0576F] bg-[#EBE4DF] hover:bg-[#EBE4DF] !hover:text-[#A0576F] !hover:opacity-100' : 'text-[#EBE4DF] hover:bg-white opacity-100 !hover:opacity-100'"-->
<!--            variant="ghost"-->
<!--            class="flex gap-3 py-2 px-[40px] rounded-[100px] !hover:opacity-100 justify-start text-base font-medium"-->
<!--            @click="handleMenuClick('gift-cards')">-->
<!--            <MenuCardsIcon />-->
<!--            <span :class="activeItem === 'gift-cards' ? 'text-[#A0576F]' : 'text-[#EBE4DF]'">My Gift Cards</span>-->
<!--          </UButton>-->
<!--        </li>-->

<!--        <li class="rounded-md">-->
<!--          <UButton block-->
<!--            :class="activeItem === 'tickets' ? 'active text-[#A0576F] bg-[#EBE4DF] hover:bg-[#EBE4DF] !hover:text-[#A0576F] !hover:opacity-100' : 'text-[#EBE4DF] hover:bg-white opacity-100 !hover:opacity-100'"-->
<!--            variant="ghost"-->
<!--            class="flex gap-3 py-2 px-[40px] rounded-[100px] !hover:opacity-100 justify-start text-base font-medium"-->
<!--            @click="handleMenuClick('tickets')">-->
<!--            <MenuTicketsIcon />-->
<!--            <span :class="activeItem === 'tickets' ? 'text-[#A0576F]' : 'text-[#EBE4DF]'">My Tickets</span>-->
<!--          </UButton>-->
<!--        </li>-->




        <!-- <li v-for="item in menuItems" :key="item.id" class="rounded-md">
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
        </li> -->


      </ul>
    </div>
    <div>
      <div class="mt-auto mb-6">

        <BaseButton label="Log Out" @click="handleLogout"
          class="bg-[#C44E4E] text-white rounded-[100px] w-full py-[16px] justify-center text-[18px] font-normal leading-[100%] tracking-[0] border border-[#A0576F] hover:bg-[#913E5D] transition cursor-pointer" />


      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref } from 'vue';


import MenuProfileIcon from '@/components/icons/MenuProfileIcon.vue';
import MenuBookingIcon from '@/components/icons/MenuBookingIcon.vue';
import MenuWalletIcon from '@/components/icons/MenuWalletIcon.vue';
import MenuCardsIcon from '@/components/icons/MenuCardsIcon.vue';
import MenuTicketsIcon from '@/components/icons/MenuTicketsIcon.vue';

import { icons } from '@/data/icons';


// Apply admin middleware to protect this page
definePageMeta({
  middleware: 'admin'
});

const authStore = useAuth();
const router = useRouter();

const handleLogout = async () => {
  await authStore.logout();
  await router.push('/');
};



const menuItems = [
  { id: 'profile', label: 'My Profile', icon: 'menu_profile' },
  { id: 'bookings', label: 'My Bookings', icon: 'menu_booking' },
  { id: 'wallet', label: 'My Wallet', icon: 'menu_wallet' },
  { id: 'gift-cards', label: 'My Gift Cards', icon: 'menu_cards' },
  { id: 'tickets', label: 'My Tickets', icon: 'menu_tickets' },
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

const getIcon = function (item) {
  return icons?.[item.icon] ? icons[item.icon]() : null
}

</script>


<style>
.side-menu button:hover span {
  color: #A0576F;
}
</style>