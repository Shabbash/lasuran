<template>
  <Container>
    <div class="min-h-screen bg-gray-50 p-8">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow-lg p-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-6">Authentication Test Page</h1>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <h2 class="text-xl font-semibold text-gray-900">Authentication Status</h2>
              
              <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-sm text-gray-600 mb-2">Current Status:</p>
                <span v-if="isAuthenticated()" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  ✓ Authenticated
                </span>
                <span v-else class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  ✗ Not Authenticated
                </span>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-sm text-gray-600 mb-2">Admin Status:</p>
                <span v-if="isAdmin()" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  ✓ Admin User
                </span>
                <span v-else class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  ✗ Regular User
                </span>
              </div>
            </div>
            
            <div class="space-y-4">
              <h2 class="text-xl font-semibold text-gray-900">Test Actions</h2>
              
              <button
                @click="testRequireAuth"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Test Require Auth
              </button>
              
              <button
                @click="testRequireAdmin"
                class="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Test Require Admin
              </button>
              
              <button
                @click="showAuthDialog"
                class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Show Auth Dialog
              </button>
              
              <button
                @click="testAddToCart"
                class="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Test Add to Cart (with Auth Check)
              </button>
            </div>
          </div>
          
          <div class="mt-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Test Results</h2>
            <div class="bg-gray-50 rounded-lg p-4 min-h-[100px]">
              <div v-if="testResults.length === 0" class="text-gray-500 text-center py-8">
                Click a test button to see results here
              </div>
              <div v-else class="space-y-2">
                <div
                  v-for="(result, index) in testResults"
                  :key="index"
                  class="text-sm p-2 rounded"
                  :class="{
                    'bg-green-100 text-green-800': result.type === 'success',
                    'bg-red-100 text-red-800': result.type === 'error',
                    'bg-blue-100 text-blue-800': result.type === 'info'
                  }"
                >
                  <span class="font-medium">{{ result.timestamp }}:</span> {{ result.message }}
                </div>
              </div>
              <button
                v-if="testResults.length > 0"
                @click="clearResults"
                class="mt-4 text-sm text-gray-500 hover:text-gray-700"
              >
                Clear Results
              </button>
            </div>
          </div>
          
          <div class="mt-8 flex space-x-4">
            <NuxtLink
              to="/"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Go to Home
            </NuxtLink>
            
            <NuxtLink
              to="/protected-test"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Go to Protected Test
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </Container>
</template>

<script setup lang="ts">
import Container from '@/components/base/Container.vue'

const { requireAuth, requireAdmin, isAuthenticated, isAdmin, showAuthDialog } = useAuthCheck();

const testResults = ref<Array<{type: string, message: string, timestamp: string}>>([]);

const addResult = (type: string, message: string) => {
  const timestamp = new Date().toLocaleTimeString();
  testResults.value.unshift({ type, message, timestamp });
};

const clearResults = () => {
  testResults.value = [];
};

const testRequireAuth = () => {
  const result = requireAuth(
    () => addResult('success', 'User is authenticated! Action would proceed.'),
    () => addResult('info', 'User not authenticated. Login modal should have appeared.')
  );
  
  if (!result) {
    addResult('info', 'requireAuth returned false - user needs to login');
  }
};

const testRequireAdmin = () => {
  const result = requireAdmin(
    () => addResult('success', 'User is admin! Admin action would proceed.'),
    () => addResult('error', 'User is not admin or not authenticated.')
  );
  
  if (!result) {
    addResult('info', 'requireAdmin returned false - user needs admin privileges');
  }
};

const testAddToCart = () => {
  addResult('info', 'Testing add to cart with authentication check...');
  
  requireAuth(() => {
    addResult('success', 'Add to cart would proceed - user is authenticated!');
    // Simulate cart operation
    setTimeout(() => {
      addResult('success', 'Cart item added successfully (simulated)');
    }, 500);
  });
};
</script>
