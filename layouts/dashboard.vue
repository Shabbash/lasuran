<template>
<LayoutDefault>
  <div class="flex">
    <div class="w-[320px] hidden md:block">
      <DashboardSideMenu @menu-click="handleMenuClick" />
    </div>

    <div class="flex-1 md:ps-6">
      <!--      <NuxtPage />-->
      <slot>
        <!--        <component :is="activeComponent" />-->
      </slot>
    </div>
  </div>
</LayoutDefault>
</template>

<script setup>

import { ref, markRaw, defineAsyncComponent, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DashboardSideMenu from '~/components/dashboard/SideMenu.vue';

// المكونات الديناميكية
const DashboardMyProfile = defineAsyncComponent(() => import('~/components/dashboard/MyProfile.vue'));
const DashboardMyBookings = defineAsyncComponent(() => import('~/components/dashboard/MyBookings.vue'));
const DashboardMyWallet = defineAsyncComponent(() => import('~/components/dashboard/MyWallet.vue'));
const DashboardMyGiftCards = defineAsyncComponent(() => import('~/components/dashboard/MyGiftCards.vue'));
const DashboardMyTickets = defineAsyncComponent(() => import('~/components/dashboard/MyTickets.vue'));

// ربط كل تبويب بالمكون الخاص به
const components = {
  'profile': markRaw(DashboardMyProfile),
  'bookings': markRaw(DashboardMyBookings),
  'wallet': markRaw(DashboardMyWallet),
  'gift-cards': markRaw(DashboardMyGiftCards),
  'tickets': markRaw(DashboardMyTickets),
};

// إعدادات الراوتر
const route = useRoute();
const router = useRouter();

// تحديد التبويب النشط حسب query param
const activeComponent = ref(components[route.query.tab] || components['profile']);

// راقب تغيّر الـ query tab وغيّر المكون المعروض
watch(
  () => route.query.tab,
  (tab) => {
    activeComponent.value = components[tab] || components['profile'];
  },
  { immediate: true }
);

// عند النقر على عنصر من القائمة
function handleMenuClick(menuId) {
  if (components[menuId]) {
    router.push({ path: `/dashboard/${menuId}` });
    // router.push({ path: `/dashboard/${menuId}`, query: { tab: menuId } });
  } else {
    console.warn(`Component "${menuId}" not found`);
  }
}
</script>
