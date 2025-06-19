<template>
  <Container>
    <div class="bg-[#A0576F1A] py-10 px-4 min-h-screen">
      <!-- Title -->
      <h2 class="text-[#A0576F] text-[21px] font-medium leading-normal mb-[26px]">Notifications</h2>

      <!-- Loading State -->
      <div v-if="loading" class="space-y-4 max-w-[600px] mx-auto">
        <div v-for="n in 3" :key="n" class="animate-pulse bg-[#EBE4DF] rounded-[30px] p-[24px]">
          <div class="h-4 w-1/2 bg-gray-300 rounded mb-3"></div>
          <div class="h-4 w-1/3 bg-gray-300 rounded"></div>
        </div>
      </div>

      <!-- Notification List -->
      <div v-else-if="notifications?.length > 0" class="space-y-4 max-w-[600px] mx-auto">
        <div
          v-for="(notification, i) in notifications"
          :key="i"
          class="bg-[#EBE4DF] rounded-[30px] p-[24px] cursor-pointer hover:shadow transition"
          @click="showNotification(notification)"
        >
          <div class="flex justify-between items-center mb-1">
            <h3 class="flex items-center gap-[10px] text-[#5F2C3E] text-[15px] font-medium">
              <Icon name="lucide:bell" class="text-[#A0576F] w-[18px] h-[18px]" />
              {{ notification.title }}
            </h3>
            <span class="text-[#90928F] text-[13px]">{{ notification.date }} {{ notification.time }}</span>
          </div>
          <p class="text-[#5B605C] text-[14px] font-[350] leading-[1.6] mt-1">
            {{ notification.sub_title }}
          </p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center mt-12 text-[#A0576F] text-[16px]">
        No notifications available.
      </div>
    </div>

    <!-- Dialog -->
    <Dialog v-model:show="isDialogDisplayed" :modalMaxWidth="'max-w-[539px]'">
      <template #body>
        <div class="bg-[#EBE4DF] text-[#5F2C3E] rounded-[30px] p-[30px]">
          <div class="flex justify-between items-center mb-[15px]">
            <h3 class="flex items-center gap-[10px] text-[#5F2C3E] text-[18px] font-medium">
              <Icon name="lucide:bell" class="text-[#A0576F] w-[20px] h-[20px]" />
              {{ selectedNotification?.title }}
            </h3>
            <span class="text-[#90928F] text-[13px]">{{ selectedNotification?.date }} {{ selectedNotification?.time }}</span>
          </div>
          <p class="text-[14px] leading-[1.6] font-[350]">
            {{ selectedNotification?.sub_title }}
          </p>
        </div>
      </template>
    </Dialog>
  </Container>
</template>

<script setup lang="ts">
const { data: notifications, pending: loading } = useApi('notifications', {
  transform: (data) => data?.data?.notifications,
});

const isDialogDisplayed = ref(false);
const selectedNotification = ref(null);

const showNotification = (notification: any) => {
  selectedNotification.value = notification;
  isDialogDisplayed.value = true;
};
</script>
