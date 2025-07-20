<template>
  <UPopover v-model:open="isOpen" :ui="{ content: 'px-[60px] py-[60px] bg-[#EBE4DF] rounded-[30px]' }">
    <div class="cursor-pointer menu-toggle">
      <img src="/assets/img/dots.svg" alt="menu" class="w-[30px] h-[30px]" />
    </div>

    <template #content>
      <div>
        <!-- User Info -->
        <div v-if="authModule.isAuthenticated"
          class="flex items-center bg-[#A0576F] px-[27px] py-[7px] w-full rounded-[20px] gap-[16px]">
          <div class="flex items-center justify-center overflow-hidden w-[81px] h-[81px] rounded-full bg-[#D9D9D91A]">
            <div class="flex items-center justify-center overflow-hidden w-[71px] h-[71px] rounded-full bg-[#D9D9D91A]">
              <img :src="profileStore.getProfileImage" alt="user image" class="w-[59px] h-[59px] rounded-full" />
            </div>
          </div>
          <div>
            <p class="text-[20px] font-medium leading-[100%] tracking-[0] text-[#EBE4DF] mb-[5px]">
              {{ profileStore.getFullName }}
            </p>
            <p class="font-[350] text-[14px] leading-[100%] tracking-[0] text-[#C6C6C7]">
              {{ profileStore.profile?.mobile_number }}
            </p>
          </div>
        </div>

        <!-- Menu Items -->
        <div class="grid grid-cols-2 gap-y-[5px] text-[#A0576F] text-sm my-[40px]">
          <NuxtLink to="/dashboard/profile" v-if="authModule.isAuthenticated" @click="closePopover"
            class="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-70 transition cursor-pointer">
            <img src="/assets/img/menu-icons/Layer.svg" alt="" class="w-[20px] h-[20px]" />
            <span class="text-[15px] font-[350] leading-none">{{ t('menu_my_profile') }}</span>
          </NuxtLink>

          <NuxtLink to="/branches" @click="closePopover"
            class="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-70 transition cursor-pointer">
            <img src="/assets/img/menu-icons/Group.svg" alt="" class="w-[20px] h-[20px]" />
            <span class="text-[15px] font-[350] leading-none">{{ t('menu_branches') }}</span>
          </NuxtLink>

          <NuxtLink to="/dashboard/bookings" v-if="authModule.isAuthenticated" @click="closePopover"
            class="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-70 transition cursor-pointer">
            <img src="/assets/img/menu-icons/Frame-5.svg" alt="" class="w-[20px] h-[20px]" />
            <span class="text-[15px] font-[350] leading-none">{{ t('menu_my_bookings') }}</span>
          </NuxtLink>

          <NuxtLink to="/contact" @click="closePopover"
            class="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-70 transition cursor-pointer">
            <img src="/assets/img/menu-icons/Group-1.svg" alt="" class="w-[20px] h-[20px]" />
            <span class="text-[15px] font-[350] leading-none">{{ t('menu_customer_service') }}</span>
          </NuxtLink>

          <NuxtLink to="/dashboard/wallet" v-if="authModule.isAuthenticated" @click="closePopover"
            class="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-70 transition cursor-pointer">
            <img src="/assets/img/menu-icons/Frame-1.svg" alt="" class="w-[20px] h-[20px]" />
            <span class="text-[15px] font-[350] leading-none">{{ t('menu_my_wallet') }}</span>
          </NuxtLink>

          <div v-if="authModule.isAuthenticated" @click="openInviteModal"
            class="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-70 transition cursor-pointer">
            <img src="/assets/img/menu-icons/Frame-3.svg" alt="" class="w-[20px] h-[20px]" />
            <span class="text-[15px] font-[350] leading-none">{{ t('menu_invite_friends') }}</span>
          </div>

          <NuxtLink to="/dashboard/gift-cards" v-if="authModule.isAuthenticated" @click="closePopover"
            class="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-70 transition cursor-pointer">
            <img src="/assets/img/menu-icons/svgexport-17.svg" alt="" class="w-[20px] h-[20px]" />
            <span class="text-[15px] font-[350] leading-none">{{ t('menu_my_gift_cards') }}</span>
          </NuxtLink>

          <button @click="toggleLocale"
            class="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-70 transition cursor-pointer">
            <img src="/assets/img/menu-icons/Frame-4.svg" alt="" class="w-[20px] h-[20px]" />
            <span class="text-[15px] font-[350] leading-none langClass">
              {{ appModule.locale === 'ar' ? 'English' : 'العربية' }}
            </span>
          </button>

          <NuxtLink to="/dashboard/tickets" v-if="authModule.isAuthenticated" @click="closePopover"
            class="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-70 transition cursor-pointer">
            <img src="/assets/img/menu-icons/Frame-2.svg" alt="" class="w-[20px] h-[20px]" />
            <span class="text-[15px] font-[350] leading-none">{{ t('menu_my_tickets') }}</span>
          </NuxtLink>

          <div @click="openLegal('terms')"
            class="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-70 transition cursor-pointer">
            <img src="/assets/img/menu-icons/terms.svg" alt="" class="w-[20px] h-[20px]" />
            <span class="text-[15px] font-[350] leading-none">{{ t('menu_terms') }}</span>
          </div>

          <div @click="openLegal('privacy')"
            class="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-70 transition cursor-pointer">
            <img src="/assets/img/menu-icons/Layer_1.svg" alt="" class="w-[20px] h-[20px]" />
            <span class="text-[15px] font-[350] leading-none">{{ t('menu_privacy') }}</span>
          </div>
        </div>

        <BaseButton :label="t('menu_login')" v-if="!authModule?.isAuthenticated" @click="handleLogin"
          class="bg-[#A0576F] text-white rounded-[100px] w-full py-[16px] justify-center text-[18px] font-normal leading-[100%] tracking-[0] border border-[#A0576F] hover:bg-[#913E5D] transition cursor-pointer" />

        <BaseButton :label="t('menu_logout')" v-else @click="logout"
          class="bg-[#C44E4E] text-white rounded-[100px] w-full py-[16px] justify-center text-[18px] font-normal leading-[100%] tracking-[0] border border-[#A0576F] hover:bg-[#913E5D] transition cursor-pointer" />
      </div>
    </template>
  </UPopover>

  <LegalDialog v-model:show="showLegalModal" :url="legalUrl" />
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProfile } from '~/stores/profile'
import { useApp } from '~/stores/app'
import { useAuth } from '~/stores/auth'
import { COMPONENTS } from '~/data/constants'
import { useApi } from '~/composables/useApi'
import LegalDialog from '~/components/base/LegalDialog.vue'
import { useI18n } from 'vue-i18n'

// i18n composables
const { locale, setLocaleMessage, t } = useI18n()

// Access app state
const appModule = useApp()
const profileStore = useProfile()
const authModule = useAuth()
const { setDialogComponent, setDialogShow } = useApp()

// UI state
const isOpen = ref(false)
const showLegalModal = ref(false)
const legalUrl = ref('')

// Load legal pages URLs from API
const pagesUrls = ref<Record<string, string>>({})
onMounted(() => {
  useApi('settings/pages-url', {
    key: 'pages-url',
    immediate: true
  }, {
    onSuccess(res) {
      pagesUrls.value = res.data
    }
  })
})

// Switch locale dynamically between Arabic and English
const toggleLocale = async () => {
  const newLocale = locale.value === 'ar' ? 'en' : 'ar'
  const messages = await import(`~/locales/${newLocale}.json`)
  setLocaleMessage(newLocale, messages.default)
  locale.value = newLocale
  appModule.setLocale(newLocale)
  closePopover()
}

// Close the language/user popover
const closePopover = () => {
  isOpen.value = false
}

// Show terms or privacy modal based on type
const openLegal = (type: 'terms' | 'privacy') => {
  legalUrl.value = type === 'terms'
    ? pagesUrls.value?.terms_and_condition_url
    : pagesUrls.value?.privacy_policy_url

  closePopover()
  setTimeout(() => {
    showLegalModal.value = true
  }, 150)
}

// Open login modal
const handleLogin = () => {
  setDialogComponent(COMPONENTS.AUTH_WIZARD, {
    modalMaxWidth: 'max-w-[638px]'
  })
  authModule.setStepComponent(COMPONENTS.SEND_OTP_STEP)
  setDialogShow(true)
  closePopover()
}

// Log the user out
const logout = () => {
  authModule.logout()
  profileStore.clearProfile()
  localStorage.removeItem('pinia-profile')
  closePopover()
}

// Open the invite friends modal
const openInviteModal = () => {
  closePopover()
  setDialogComponent(COMPONENTS.INVITE_FRIENDS, {
    modalMaxWidth: 'max-w-[430px]'
  })
  setDialogShow(true)
}
</script>
