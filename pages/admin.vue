<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold">Admin Panel</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-gray-700">Admin: {{ authStore.getUserName }}</span>
            <NuxtLink
              to="/dashboard"
              class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Back to Dashboard
            </NuxtLink>
            <button
              @click="handleLogout"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
    
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="border-4 border-dashed border-gray-200 rounded-lg h-96 p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Admin Dashboard</h2>
          
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Admin Controls</h3>
            <p class="text-gray-600 mb-4">
              This page is only accessible to users with admin privileges.
            </p>
            
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div class="bg-blue-50 p-4 rounded-lg">
                <h4 class="font-medium text-blue-900">User Management</h4>
                <p class="text-sm text-blue-700 mt-1">Manage user accounts and permissions</p>
              </div>
              <div class="bg-green-50 p-4 rounded-lg">
                <h4 class="font-medium text-green-900">System Settings</h4>
                <p class="text-sm text-green-700 mt-1">Configure system-wide settings</p>
              </div>
              <div class="bg-purple-50 p-4 rounded-lg">
                <h4 class="font-medium text-purple-900">Reports</h4>
                <p class="text-sm text-purple-700 mt-1">View system reports and analytics</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// Apply admin middleware to protect this page
definePageMeta({
  middleware: 'admin'
});

const authStore = useAuth();
const router = useRouter();

const handleLogout = async () => {
  await authStore.logout();
  await router.push('/login');
};
</script>
