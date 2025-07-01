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
                            Home
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/services"
                            class="font-medium py-[11px] px-[35px] text-[17px] text-[#EBE4DF] capitalize">
                            Services
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/branches"
                            class="font-medium py-[11px] px-[35px] text-[17px] text-[#EBE4DF] capitalize">
                            Branches
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/gift-cards"
                            class="font-medium py-[11px] px-[35px] text-[17px] text-[#EBE4DF] capitalize">
                            Gift Cards
                        </NuxtLink>
                    </li>
                </ul>

                <!-- Actions -->
                <div
                    class="flex items-center gap-[30px] text-white font-medium py-[11px] px-[35px] text-[17px] capitalize">
                    <!-- Language Switch -->
                    <button @click="toggleLocale" class="flex items-center gap-1 text-sm cursor-pointer">
                        <img :src="locale === 'ar' ? '/assets/img/us-flag.svg' : '/assets/img/sa-flag.svg'" alt="flag"
                            class="w-[29px] h-[20px] rounded-sm" /> <span>{{ locale === 'ar' ? 'English' : 'ةالعربية'
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
                        <!-- Close Button -->
                        <div class="flex justify-end">
                            <UButton icon="i-heroicons-x-mark" @click="isOpen = false" variant="ghost" />
                        </div>

                        <!-- Language Switch in Slideover -->
                        <button @click="toggleLocale"
                            class="flex items-center gap-2 px-4 py-[6px] rounded-lg text-[#A0576F] hover:opacity-70 transition cursor-pointer">
                            <img src="/assets/img/menu-icons/Frame-4.svg" alt="" class="w-[20px] h-[20px]" />
                            <span class="text-[15px] font-[350] leading-none">
                                {{ locale === 'ar' ? 'English' : 'العربية' }}
                            </span>
                        </button>

                        <!-- You can keep other menu items here unchanged -->
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
import { useApi } from '~/composables/useApi'
import Container from '~/components/base/Container.vue'
import UserMenu from '~/components/base/UserMenu.vue'
import LegalDialog from '~/components/base/LegalDialog.vue'
import { COMPONENTS } from '~/data/constants'
import { useCookie } from '#imports'

// Stores

const appModule = useApp()
const authModule = useAuth()
const cartModule = useCart()
const homeModule = useHome()

// i18n
const { locale } = useI18n()

// const localeCookie = useCookie('i18n_redirected')

const toggleLocale = () => {
  const newLocale = locale.value === 'ar' ? 'en' : 'ar'
  locale.value = newLocale
appModule.setLocale(newLocale)

//   localeCookie.value = newLocale  // Save selected locale in cookie

}
// if (localeCookie.value) {
//   locale.value = localeCookie.value
// }


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

const openLegal = (type: 'terms' | 'privacy') => {
    legalUrl.value = type === 'terms' ? pagesUrls.value?.terms_and_condition_url : pagesUrls.value?.privacy_policy_url
    isOpen.value = false
    setTimeout(() => showLegalModal.value = true, 150)
}

// Slideover state
const isOpen = ref(false)

// Watch route changes to close slideover
const route = useRoute()
watch(() => route.fullPath, () => {
    isOpen.value = false
})

// Notifications redirect
const navigateToNotifications = () => {
    navigateTo({ path: '/notifications' })
}
</script>


<style>
li .router-link-exact-active {
    background: #EBE4DF;
    color: #A0576F;
    font-weight: 700;
    border-radius: 100px;
}
</style>
