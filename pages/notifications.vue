<template>
  <Container>
    <div class="bg-[#A0576F1A] min-h-screen py-10 px-4 lg:px-0">
      <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">Notifications</h1>

      <div class="max-w-3xl mx-auto space-y-4">
        <!-- Loading Skeleton -->
        <template v-if="loading">
          <div
              v-for="n in 2"
              :key="n"
              class="animate-pulse bg-white rounded-xl shadow-md p-5"
          >
            <div class="flex justify-between items-center mb-2">
              <div class="flex items-center gap-2">
                <div class="h-4 w-6 bg-gray-300 rounded"></div>
                <div class="h-4 w-32 bg-gray-300 rounded"></div>
              </div>
              <div class="h-4 w-24 bg-gray-300 rounded"></div>
            </div>
            <div class="h-4 w-2/3 bg-gray-300 rounded"></div>
          </div>
        </template>

        <!-- Notifications -->
        <template v-else>
          <div
              v-for="(notification, i) in notifications"
              :key="i"
              class="bg-white rounded-xl shadow-md p-5 flex flex-col gap-2"
              @click="showNotification(notification)"
          >
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2 font-semibold text-gray-800">
                <Icon name="lucide:bell" class="text-pink-500 w-5 h-5" />
                {{ notification.title }}
              </div>
              <div class="text-sm text-gray-500">{{ notification.date }} {{ notification.time }}</div>
            </div>
            <p class="text-sm text-gray-600">{{ notification.sub_title }}</p>
          </div>
        </template>
      </div>
    </div>

    <BaseDialog v-model:show="isDialogDisplayed">
      <template #body>
        <div class="bg-white rounded-xl shadow-md p-5 flex flex-col gap-2 py-4" style="padding: 80px 30px;">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2 font-semibold text-gray-800">
              <Icon name="lucide:bell" class="text-pink-500 w-5 h-5" />
              {{ selectedNotification?.title }}
            </div>
            <div class="text-sm text-gray-500">{{ selectedNotification?.date }} {{ selectedNotification?.time }}</div>
          </div>
          <p class="text-sm text-gray-600">{{ selectedNotification?.sub_title }}</p>
        </div>
      </template>
    </BaseDialog>
  </Container>
</template>


<script setup lang="ts">

const { data : notifications , pending : loading } = useApi('notifications', { transform : (data) => data?.data?.notifications });
const isDialogDisplayed = ref(false);
const selectedNotification = ref(null);
const showNotification = function (notification:any) {
  isDialogDisplayed.value = true;
  selectedNotification.value = notification;
}
</script>
