<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full text-center">
      <div class="mb-8">
        <svg class="mx-auto h-24 w-24 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      
      <h1 class="text-4xl font-bold text-gray-900 mb-4">403</h1>
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">Unauthorized Access</h2>
      <p class="text-gray-600 mb-8">
        You don't have permission to access this page. Please contact your administrator if you believe this is an error.
      </p>
      
      <div class="space-y-4">
        <NuxtLink
          to="/dashboard"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Go to Dashboard
        </NuxtLink>
        
        <div>
          <button
            @click="handleLogout"
            class="text-sm text-gray-500 hover:text-gray-700"
          >
            Logout and switch account
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuth();
const router = useRouter();

const handleLogout = async () => {
  await authStore.logout();
  await router.push('/login');
};
</script>
