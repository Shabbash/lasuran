<template>
    <div class="relative">
        <!-- Desktop Navigation -->
        <nav class="text-white hidden md:block">
            <Container class="px-[62px] py-[30px] flex items-center justify-between">
                <!-- Logo -->
                <NuxtLink to="/" class="flex items-center gap-2">
                    <img src="~/public/assets/img/lasuran-logo.svg" alt="LASURAN Logo" class="h-10 w-auto" />
                </NuxtLink>

                <!-- Navigation Links -->
                <ul class="flex items-center text-sm font-medium">
                    <li>
                        <NuxtLink to="/" class="font-medium py-[11px] px-[35px] text-[17px] text-[#EBE4DF] capitalize">
                            {{ $t('menu_home') }}
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/services"
                            class="font-medium py-[11px] px-[35px] text-[17px] text-[#EBE4DF] capitalize">
                            {{ $t('menu_services') }}
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/branches"
                            class="font-medium py-[11px] px-[35px] text-[17px] text-[#EBE4DF] capitalize">
                            {{ $t('menu_branches') }}
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/gift-cards"
                            class="font-medium py-[11px] px-[35px] text-[17px] text-[#EBE4DF] capitalize">
                            {{ $t('menu_gift_cards') }}
                        </NuxtLink>
                    </li>
                </ul>

                <!-- Actions -->
                <div
                    class="flex items-center gap-[30px] text-white font-medium py-[11px] px-[35px] text-[17px] capitalize">
                    <!-- Language Switch -->
                    <button @click="toggleLocale" class="flex items-center gap-1 text-sm cursor-pointer">
                        <img :src="locale === 'ar' ? '/assets/img/us-flag.svg' : '/assets/img/sa-flag.svg'" alt="flag"
                            class="w-[29px] h-[20px] rounded-sm" /> <span class="langClass">{{ locale === 'ar' ?
                                'English' : 'العربية'
                            }}</span>
                    </button>

                    <!-- Cart -->
                    <NuxtLink to="/cart" class="relative cursor-pointer" v-if="authModule.isAuthenticated">
                        <img src="/public/assets/img/calendar.svg" alt="calendar" class="w-[27px] h-[27px]" />
                        <span v-if="cartModule.getProductsCount > 0"
                            class="absolute bg-[#DA3C3C] text-white w-[17px] h-[17px] flex items-center justify-center rounded-full text-[11px] font-normal -top-1 -end-1">
                            {{ cartModule.getProductsCount }}
                        </span>
                    </NuxtLink>

                    <!-- Notifications -->
                    <div class="relative cursor-pointer" v-if="authModule.isAuthenticated"
                        @click="navigateToNotifications">
                        <img src="/public/assets/img/Huge-icon.svg" alt="notifications" class="w-[27px] h-[27px]" />
                        <span v-if="homeModule.unreadNotifications > 0"
                            class="absolute bg-[#DA3C3C] text-white w-[17px] h-[17px] flex items-center justify-center rounded-full text-[11px] font-normal -top-1 -end-1">
                            {{ homeModule.unreadNotifications }}
                        </span>
                    </div>

                    <UserMenu />
                </div>
            </Container>
        </nav>

        <!-- Mobile Navigation -->
        <div class="md:hidden">
            <!-- Mobile Header -->
            <div class="flex justify-between bg-[#A0576F] px-[15px] py-[20px]">
                <UButton icon="i-lucide:menu" @click="isOpen = true" size="xs"
                    class="bg-transparent flex items-center justify-center p-0 h-[24px] w-[24px] border border-white" />
                <NuxtLink to="/" class="flex items-center gap-2">
                    <img src="~/public/assets/img/lasuran-logo.svg" alt="LASURAN Logo" class="h-10 w-auto" />
                </NuxtLink>
                <div class="flex gap-[20px]">
                    <NuxtLink to="/cart" class="relative cursor-pointer" v-if="authModule.isAuthenticated">
                        <img src="/public/assets/img/calendar.svg" alt="cart" class="w-[27px] h-[27px]" />
                        <span v-if="cartModule.getProductsCount > 0"
                            class="absolute bg-[#DA3C3C] text-white w-[17px] h-[17px] flex items-center justify-center rounded-full text-[11px] font-normal -top-1 -end-1">
                            {{ cartModule.getProductsCount }}
                        </span>
                    </NuxtLink>

                    <div class="relative cursor-pointer" v-if="authModule.isAuthenticated"
                        @click="navigateToNotifications">
                        <img src="/public/assets/img/Huge-icon.svg" alt="notifications" class="w-[27px] h-[27px]" />
                        <span v-if="homeModule.unreadNotifications > 0"
                            class="absolute bg-[#DA3C3C] text-white w-[17px] h-[17px] flex items-center justify-center rounded-full text-[11px] font-normal -top-1 -end-1">
                            {{ homeModule.unreadNotifications }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Slideover Menu -->

            <USlideover v-model:open="isOpen">
                <template #content>
                    <div class="p-[15px] bg-[#EBE4DF] min-h-screen">
                        <!-- زر إغلاق يدوي -->
                        <div class="flex justify-end">
                            <UButton icon="i-heroicons-x-mark" @click="isOpen = false" variant="ghost" />
                        </div>

                        <!-- محتوى السلايد -->
                        <div class="">


                            <div>
                                <div v-if="authModule.isAuthenticated"
                                    class="flex items-center bg-[#A0576F] p-[5px] w-full rounded-[20px] gap-[10px]">
                                    <div
                                        class="flex items-center justify-center overflow-hidden w-[60px] h-[60px] rounded-full bg-[#D9D9D91A]">
                                        <div
                                            class="flex items-center justify-center overflow-hidden w-[71px] h-[71px] rounded-full bg-[#D9D9D91A]">
                                            <img src="/assets/img/pr-img.png" alt=""
                                                class="w-[59px] h-[59px] rounded-full">
                                        </div>
                                    </div>
                                    <div>
                                        <p
                                            class="text-[16px] font-medium leading-[100%] tracking-[0] text-[#EBE4DF] mb-[5px]">
                                            {{ authModule.getUserName }}
                                            <!--              Zahra Ahmed-->
                                        </p>
                                        <p class="font-[350] text-[14px] leading-[100%] tracking-[0] text-[#C6C6C7]">
                                            {{ authModule.getMobileNumber }}
                                            <!--              +966 864 777 634-->
                                        </p>
                                    </div>
                                </div>

                                <div class="text-[#EBE4DF] text-sm my-[15px]">
                                    <NuxtLink to="/"
                                        class="flex items-center gap-2 px-4 py-[6px] rounded-lg text-[#A0576F] hover:opacity-70 transition cursor-pointer">
                                        <img src="/assets/img/menu-icons/Group.svg" alt="" class="w-[20px] h-[20px]" />
                                        <span class="text-[15px] font-[350] leading-none">{{ $t('menu_home') }}</span>
                                    </NuxtLink>

                                    <NuxtLink to="/services"
                                        class="flex items-center gap-2 px-4 py-[6px] rounded-lg text-[#A0576F] hover:opacity-70 transition cursor-pointer">
                                        <img src="/assets/img/menu-icons/Group.svg" alt="" class="w-[20px] h-[20px]" />
                                        <span class="text-[15px] font-[350] leading-none">{{ $t('menu_services')
                                            }}</span>
                                    </NuxtLink>

                                    <NuxtLink to="/branches"
                                        class="flex items-center gap-2 px-4 py-[6px] rounded-lg text-[#A0576F] hover:opacity-70 transition cursor-pointer">
                                        <img src="/assets/img/menu-icons/Group.svg" alt="" class="w-[20px] h-[20px]" />
                                        <span class="text-[15px] font-[350] leading-none">{{ $t('menu_branches')
                                            }}</span>
                                    </NuxtLink>

                                    <NuxtLink to="/gift-cards"
                                        class="flex items-center gap-2 px-4 py-[6px] rounded-lg text-[#A0576F] hover:opacity-70 transition cursor-pointer">
                                        <img src="/assets/img/menu-icons/Group.svg" alt="" class="w-[20px] h-[20px]" />
                                        <span class="text-[15px] font-[350] leading-none">{{ $t('menu_gift_cards')
                                            }}</span>
                                    </NuxtLink>

                                    <NuxtLink to="/dashboard/profile" v-if="authModule.isAuthenticated"
                                        class="flex items-center gap-2 px-4 py-[6px] rounded-lg text-[#A0576F] hover:opacity-70 transition cursor-pointer">
                                        <img src="/assets/img/menu-icons/Layer.svg" alt="" class="w-[20px] h-[20px]" />
                                        <span class="text-[15px] font-[350] leading-none">{{ $t('menu_my_profile')
                                            }}</span>
                                    </NuxtLink>

                                    <NuxtLink to="/dashboard/bookings" v-if="authModule.isAuthenticated"
                                        class="flex items-center gap-2 px-4 py-[6px] rounded-lg text-[#A0576F] hover:opacity-70 transition cursor-pointer">
                                        <img src="/assets/img/menu-icons/Frame-5.svg" alt=""
                                            class="w-[20px] h-[20px]" />
                                        <span class="text-[15px] font-[350] leading-none">{{ $t('menu_my_bookings')
                                            }}</span>
                                    </NuxtLink>

                                    <NuxtLink to="/contact"
                                        class="flex items-center gap-2 px-4 py-[6px] rounded-lg text-[#A0576F] hover:opacity-70 transition cursor-pointer">
                                        <img src="/assets/img/menu-icons/Group-1.svg" alt=""
                                            class="w-[20px] h-[20px]" />
                                        <span class="text-[15px] font-[350] leading-none">{{ $t('menu_customer_service')
                                            }}</span>
                                    </NuxtLink>

                                    <NuxtLink to="/dashboard/wallet" v-if="authModule.isAuthenticated"
                                        class="flex items-center gap-2 px-4 py-[6px] rounded-lg text-[#A0576F] hover:opacity-70 transition cursor-pointer">
                                        <img src="/assets/img/menu-icons/Frame-1.svg" alt=""
                                            class="w-[20px] h-[20px]" />
                                        <span class="text-[15px] font-[350] leading-none">{{ $t('menu_my_wallet')
                                            }}</span>
                                    </NuxtLink>

                                    <div @click="openInviteModal" v-if="authModule.isAuthenticated"
                                        class="flex items-center gap-2 px-4 py-[6px] rounded-lg text-[#A0576F] hover:opacity-70 transition cursor-pointer">
                                        <img src="/assets/img/menu-icons/Frame-3.svg" alt=""
                                            class="w-[20px] h-[20px]" />
                                        <span class="text-[15px] font-[350] leading-none">{{ $t('menu_invite_friends')
                                            }}</span>
                                    </div>

                                    <NuxtLink to="/dashboard/gift-cards" v-if="authModule.isAuthenticated"
                                        class="flex items-center gap-2 px-4 py-[6px] rounded-lg text-[#A0576F] hover:opacity-70 transition cursor-pointer">
                                        <img src="/assets/img/menu-icons/svgexport-17.svg" alt=""
                                            class="w-[20px] h-[20px]" />
                                        <span class="text-[15px] font-[350] leading-none">{{ $t('menu_my_gift_cards')
                                            }}</span>
                                    </NuxtLink>

                                    <NuxtLink to="/dashboard/tickets" v-if="authModule.isAuthenticated"
                                        class="flex items-center gap-2 px-4 py-[6px] rounded-lg text-[#A0576F] hover:opacity-70 transition cursor-pointer">
                                        <img src="/assets/img/menu-icons/Frame-2.svg" alt=""
                                            class="w-[20px] h-[20px]" />
                                        <span class="text-[15px] font-[350] leading-none">{{ $t('menu_my_tickets')
                                            }}</span>
                                    </NuxtLink>

                                    <div @click="openLegal('terms')"
                                        class="flex items-center gap-2 px-4 py-[6px] rounded-lg text-[#A0576F] hover:opacity-70 transition cursor-pointer">
                                        <img src="/assets/img/menu-icons/terms.svg" alt="" class="w-[20px] h-[20px]" />
                                        <span class="text-[15px] font-[350] leading-none">{{ $t('menu_terms') }}</span>
                                    </div>

                                    <div @click="openLegal('privacy')"
                                        class="flex items-center gap-2 px-4 py-[6px] rounded-lg text-[#A0576F] hover:opacity-70 transition cursor-pointer">
                                        <img src="/assets/img/menu-icons/Layer_1.svg" alt=""
                                            class="w-[20px] h-[20px]" />
                                        <span class="text-[15px] font-[350] leading-none">{{ $t('menu_privacy')
                                            }}</span>
                                    </div>

                                    <button @click="toggleLocale"
                                        class="flex items-center gap-2 px-4 py-[6px] rounded-lg text-[#A0576F] hover:opacity-70 transition cursor-pointer">
                                        <img src="/assets/img/menu-icons/Frame-4.svg" alt=""
                                            class="w-[20px] h-[20px]" />
                                        <span class="text-[15px] font-[350] leading-none">
                                            {{ appModule.locale === 'ar' ? 'English' : 'العربية' }}
                                        </span>
                                    </button>
                                </div>

                            </div>

                            <BaseButton :label="$t('menu_login')" v-if="!authModule?.isAuthenticated"
                                @click="handleLogin"
                                class="bg-[#A0576F] text-white rounded-[100px] w-full py-[16px] justify-center text-[18px] font-normal leading-[100%] tracking-[0] border border-[#A0576F] hover:bg-[#913E5D] transition cursor-pointer" />
                            <BaseButton :label="$t('menu_logout')" v-else @click="logout"
                                class="bg-[#C44E4E] text-white rounded-[100px] w-full py-[16px] justify-center text-[18px] font-normal leading-[100%] tracking-[0] border border-[#A0576F] hover:bg-[#913E5D] transition cursor-pointer" />


                            <!-- Actions / Icons -->
                            <div
                                class="hidden md:flex items-center gap-[30px] text-white font-medium py-[11px] px-[35px] text-[17px]capitalize ">
                                <!-- Language -->
                                <div class="flex items-center gap-1 text-sm cursor-pointer">
                                    <img src="/public/assets/img/sa-flag.svg" alt="flag"
                                        class="w-[29px] h-[20px] rounded-sm" />
                                    <span class="langClass">{{ appModule.locale === 'ar' ? 'English' : 'العربية'
                                        }}</span>
                                </div>


                                <!-- hide cart if not authenticated -->
                                <!-- Calendar Icon -->
                                <NuxtLink to="/cart" class="relative cursor-pointer" v-if="authModule.isAuthenticated">
                                    <img src="/public/assets/img/calendar.svg" alt="flag"
                                        class="w-[27px] h-[27px] rounded-sm" />
                                    <span v-if="cartModule.getProductsCount > 0"
                                        class="absolute bg-[#DA3C3C] text-white w-[17px] h-[17px] flex items-center justify-center rounded-full text-[11px] font-normal -top-1 -end-1">
                                        {{ cartModule.getProductsCount }}
                                    </span>
                                </NuxtLink>

                                <!-- Notifications Icon -->
                                <div class="relative cursor-pointer" v-if="authModule.isAuthenticated"
                                    @click="navigateToNotifications">
                                    <img src="/public/assets/img/Huge-icon.svg" alt="flag"
                                        class="w-[27px] h-[27px] rounded-sm" />
                                    <span v-if="homeModule.unreadNotifications > 0"
                                        class="absolute bg-[#DA3C3C] text-white w-[17px] h-[17px] flex items-center justify-center rounded-full text-[11px] font-normal -top-1 -end-1">
                                        {{ homeModule.unreadNotifications }}
                                    </span>
                                </div>


                                <UserMenu />


                            </div>
                        </div>
                    </div>
                </template>
            </USlideover>

        </div>
    </div>

    <LegalDialog v-model:show="showLegalModal" :url="legalUrl" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useApp } from '~/stores/app'
import { useCart } from '~/stores/cart'
import { useHome } from '~/stores/home'
import { useAuth } from '~/stores/auth'
import { useProfile } from '~/stores/profile'
import { useApi } from '~/composables/useApi'
import Container from '~/components/base/Container.vue'
import UserMenu from '~/components/base/UserMenu.vue'
import LegalDialog from '~/components/base/LegalDialog.vue'
import { COMPONENTS } from '~/data/constants'

// Stores
const appModule = useApp()
const authModule = useAuth()
const cartModule = useCart()
const homeModule = useHome()
const profileStore = useProfile()

// i18n
const { t, locale, setLocaleMessage } = useI18n()

// Slideover state
const isOpen = ref(false)

// Dialogs
const { setDialogComponent, setDialogShow } = useApp()
const showLegalModal = ref(false)
const legalUrl = ref('')
const pagesUrls = ref<Record<string, string>>({})

// Fetch legal URLs
useApi('settings/pages-url', {
  key: 'pages-url',
  immediate: true
}, {
  onSuccess(res) {
    pagesUrls.value = res.data
  }
})

// Toggle Language
const toggleLocale = async () => {
  const newLocale = appModule.locale === 'ar' ? 'en' : 'ar'
  const messages = await import(`~/locales/${newLocale}.json`)
  setLocaleMessage(newLocale, messages.default)
  locale.value = newLocale
  appModule.setLocale(newLocale)
  isOpen.value = false
}

// Open Legal Modal
const openLegal = (type: 'terms' | 'privacy') => {
  legalUrl.value = type === 'terms' ? pagesUrls.value?.terms_and_condition_url : pagesUrls.value?.privacy_policy_url
  isOpen.value = false
  setTimeout(() => showLegalModal.value = true, 150)
}

// Open Invite Friends Modal
const openInviteModal = () => {
  isOpen.value = false
  setDialogComponent(COMPONENTS.INVITE_FRIENDS, {
    modalMaxWidth: 'max-w-[430px]'
  })
  setDialogShow(true)
}

// Handle Login
const handleLogin = () => {
  setDialogComponent(COMPONENTS.AUTH_WIZARD, {
    modalMaxWidth: 'max-w-[638px]'
  })
  authModule.setStepComponent(COMPONENTS.SEND_OTP_STEP)
  setDialogShow(true)
  isOpen.value = false
}

// Handle Logout
const logout = () => {
  authModule.logout()
  profileStore.clearProfile()
  localStorage.removeItem('pinia-profile')
  isOpen.value = false
}

// Notifications redirect
const navigateToNotifications = () => {
  navigateTo({ path: '/notifications' })
}

// Watch route changes to close slideover
const route = useRoute()
watch(() => route.fullPath, () => {
  isOpen.value = false
})
</script>


<style>
li .router-link-exact-active {
    background: #EBE4DF;
    color: #A0576F;
    font-weight: 700;
    border-radius: 100px;
}
</style>
