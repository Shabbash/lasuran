<template>
  <div class="p-8 bg-gray-100 min-h-screen">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">Authentication Status</h1>

      <div class="bg-white p-6 rounded-lg shadow mb-6">
        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <span class="font-semibold">Status:</span>
            <span :class="authStore.isAuthenticated ? 'text-green-600' : 'text-red-600'">
              {{ authStore.isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated' }}
            </span>
          </div>

          <div class="flex items-center gap-4">
            <span class="font-semibold">Has Token:</span>
            <span :class="!!authStore.getToken ? 'text-green-600' : 'text-red-600'">
              {{ !!authStore.getToken ? '✅ Yes' : '❌ No' }}
            </span>
          </div>

          <div v-if="authStore.getToken" class="flex items-center gap-4">
            <span class="font-semibold">Token Preview:</span>
            <code class="bg-gray-100 px-2 py-1 rounded text-sm">
              {{ authStore.getToken.substring(0, 50) }}...
            </code>
          </div>

          <div class="flex items-center gap-4">
            <span class="font-semibold">Token Valid:</span>
            <span :class="authStore.isTokenValid ? 'text-green-600' : 'text-red-600'">
              {{ authStore.isTokenValid ? '✅ Valid' : '❌ Invalid/Expired' }}
            </span>
          </div>

          <div class="flex items-center gap-4">
            <span class="font-semibold">User Data:</span>
            <span :class="Object.keys(authStore.getUser).length > 0 ? 'text-green-600' : 'text-red-600'">
              {{ Object.keys(authStore.getUser).length > 0 ? '✅ Loaded' : '❌ No User Data' }}
            </span>
          </div>
        </div>

        <div class="mt-6 space-x-4">
          <button
            v-if="!authStore.isAuthenticated"
            @click="showLogin"
            class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>

          <button
            v-if="authStore.isAuthenticated"
            @click="logout"
            class="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>

          <button
            @click="initAuth"
            class="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600"
          >
            Refresh Auth
          </button>

          <button
            @click="testAPI"
            class="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            Test Profile API
          </button>
        </div>

        <div v-if="result" class="mt-6 p-4 bg-gray-100 rounded">
          <h3 class="font-semibold mb-2">Result:</h3>
          <pre class="text-sm whitespace-pre-wrap">{{ result }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '@/stores/auth';
import { useApp } from '@/stores/app';
import { COMPONENTS } from '~/data/constants';

const authStore = useAuth();
const { setDialogComponent, setDialogShow } = useApp();
const result = ref('');

const showLogin = () => {
  authStore.setStepComponent(COMPONENTS.INTRO_STEP);
  setDialogComponent(COMPONENTS.AUTH_WIZARD);
  setDialogShow(true);
};

const logout = () => {
  authStore.forgetAuth();
  result.value = 'Logged out successfully';
};

const initAuth = async () => {
  try {
    await authStore.initAuth();
    result.value = 'Auth refreshed successfully';
  } catch (error: any) {
    result.value = `Auth refresh failed: ${error.message}`;
  }
};

const testAPI = async () => {
  try {
    result.value = 'Testing profile API...';

    // First, let's check what token we have
    const token = authStore.getToken;
    console.log('🔍 Testing with token:', token ? token.substring(0, 50) + '...' : 'NO TOKEN');

    if (!token) {
      result.value = '❌ No token available. Please log in first.';
      return;
    }

    // Test the API call
    const response = await $fetch('https://lasuran-dev.jigsawme.io/api/v1/account/info', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    result.value = `✅ API Success:\n${JSON.stringify(response, null, 2)}`;
  } catch (error: any) {
    console.error('API Error:', error);
    result.value = `❌ API Failed:\nStatus: ${error.status || 'Unknown'}\nMessage: ${error.message || 'Unknown error'}\nData: ${JSON.stringify(error.data || error, null, 2)}`;
  }
};
</script>
