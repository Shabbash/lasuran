<template>
  <div class="flex h-screen">
    <div class="w-[320px]">
      <DashboardSideMenu @menu-click="handleMenuClick" />
    </div>

    <div class="flex-1 ps-6">
      <component :is="activeComponent" />
    </div>
  </div>
</template>

<script setup>
import { ref, markRaw, defineAsyncComponent, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DashboardSideMenu from '~/components/dashboard/SideMenu.vue';

// المكونات الديناميكية
const DashboardMyProfile = defineAsyncComponent(() => import('~/components/dashboard/MyProfile.vue'));
const DashboardMyBookings = defineAsyncComponent(() => import('~/components/dashboard/MyBookings.vue'));
const DashboardMyWallet = defineAsyncComponent(() => import('~/components/dashboard/MyWallet.vue'));

// ربط كل تبويب بالمكون الخاص به
const components = {
  'profile': markRaw(DashboardMyProfile),
  'bookings': markRaw(DashboardMyBookings),
  'wallet': markRaw(DashboardMyWallet),
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
    router.push({ path: '/dashboard', query: { tab: menuId } });
  } else {
    console.warn(`Component "${menuId}" not found`);
  }
}
</script>
