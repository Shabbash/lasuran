<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold">{{ $t('admin_panel_title') }}</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-gray-700">{{ $t('admin_label') }}: {{ authStore.getUserName }}</span>
            <NuxtLink
              to="/dashboard"
              class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              {{ $t('admin_back_to_dashboard') }}
            </NuxtLink>
            <button
              @click="handleLogout"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              {{ $t('admin_logout') }}
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="border-4 border-dashed border-gray-200 rounded-lg h-96 p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">{{ $t('admin_dashboard_heading') }}</h2>

          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-medium text-gray-900 mb-4">{{ $t('admin_controls_title') }}</h3>
            <p class="text-gray-600 mb-4">
              {{ $t('admin_access_notice') }}
            </p>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div class="bg-blue-50 p-4 rounded-lg">
                <h4 class="font-medium text-blue-900">{{ $t('admin_user_management') }}</h4>
                <p class="text-sm text-blue-700 mt-1">{{ $t('admin_user_management_desc') }}</p>
              </div>
              <div class="bg-green-50 p-4 rounded-lg">
                <h4 class="font-medium text-green-900">{{ $t('admin_system_settings') }}</h4>
                <p class="text-sm text-green-700 mt-1">{{ $t('admin_system_settings_desc') }}</p>
              </div>
              <div class="bg-purple-50 p-4 rounded-lg">
                <h4 class="font-medium text-purple-900">{{ $t('admin_reports') }}</h4>
                <p class="text-sm text-purple-700 mt-1">{{ $t('admin_reports_desc') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuth } from '~/stores/auth'
import { useI18n } from 'vue-i18n'

// 🧠 Translation composables
const { t } = useI18n()

// ✅ Store access
const authStore = useAuth()

// ✅ Router instance
const router = useRouter()

// 🔒 Admin-only access
definePageMeta({
  middleware: 'admin'
})

// 🚪 Handle logout and redirect
const handleLogout = async () => {
  await authStore.logout()
  await router.push('/login')
}
</script>
