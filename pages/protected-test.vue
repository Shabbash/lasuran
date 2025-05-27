<template>
  <Container>
    <div class="min-h-screen bg-gray-50 p-8">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow-lg p-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-6">Protected Page Test</h1>
          
          <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-green-800">
                  Authentication Successful!
                </h3>
                <div class="mt-2 text-sm text-green-700">
                  <p>You have successfully accessed this protected page. The auth middleware is working correctly.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gray-50 rounded-lg p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">User Information</h2>
              <dl class="space-y-2">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Name</dt>
                  <dd class="text-sm text-gray-900">{{ authStore.getUserName }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Mobile</dt>
                  <dd class="text-sm text-gray-900">{{ authStore.getMobileNumber }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Token Status</dt>
                  <dd class="text-sm text-gray-900">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Valid
                    </span>
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Admin Status</dt>
                  <dd class="text-sm text-gray-900">
                    <span v-if="authStore.isAdmin" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Admin
                    </span>
                    <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      User
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Middleware Test Results</h2>
              <div class="space-y-3">
                <div class="flex items-center">
                  <svg class="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-sm text-gray-700">Auth middleware passed</span>
                </div>
                <div class="flex items-center">
                  <svg class="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-sm text-gray-700">Token validation successful</span>
                </div>
                <div class="flex items-center">
                  <svg class="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-sm text-gray-700">Page access granted</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-8 flex space-x-4">
            <NuxtLink
              to="/"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Go to Home
            </NuxtLink>
            
            <NuxtLink
              to="/dashboard"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Go to Dashboard
            </NuxtLink>
            
            <NuxtLink
              v-if="authStore.isAdmin"
              to="/admin"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
            >
              Admin Panel
            </NuxtLink>
            
            <button
              @click="handleLogout"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </Container>
</template>

<script setup lang="ts">
// Apply auth middleware to protect this page
definePageMeta({
  middleware: 'auth'
});

import Container from '@/components/base/Container.vue'

const authStore = useAuth();
const router = useRouter();

const handleLogout = async () => {
  await authStore.logout();
  await router.push('/');
};
</script>
