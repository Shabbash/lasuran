<template>
    <div class="relative">
        <nav class="text-white  hidden md:block">
            <Container class="px-[62px] py-[30px] flex items-center justify-between">
                <!-- Logo Image -->
                <NuxtLink to="/" class="flex items-center gap-2">
                    <img src="~/public/assets/img/lasuran-logo.svg" alt="LASURAN Logo" class="h-10 w-auto" />
                </NuxtLink>

                <!-- Navigation Links -->
                <ul class="flex items-center text-sm font-medium">
                    <li>
                        <NuxtLink to="/" class="font-medium py-[11px] px-[35px] text-[17px]text-[#EBE4DF] capitalize">
                            Home
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/services"
                            class="font-medium py-[11px] px-[35px] text-[17px]text-[#EBE4DF] capitalize">
                            Services</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/branches"
                            class="font-medium py-[11px] px-[35px] text-[17px]text-[#EBE4DF] capitalize">
                            Branches</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/gift-cards"
                            class="font-medium py-[11px] px-[35px] text-[17px]text-[#EBE4DF] capitalize">
                            Gift Cards</NuxtLink>
                    </li>

                    <!-- <li>
                        <NuxtLink to="/shop"
                            class="font-medium py-[11px] px-[35px] text-[17px]text-[#EBE4DF] capitalize">
                            Shop</NuxtLink>
                    </li> -->
                </ul>

                <!-- Actions / Icons -->
                <div
                    class="flex items-center gap-[30px] text-white font-medium py-[11px] px-[35px] text-[17px] capitalize">
                    <!-- Language -->
                    <div class="flex items-center gap-1 text-sm cursor-pointer">
                        <img src="/public/assets/img/sa-flag.svg" alt="flag" class="w-[29px] h-[20px] rounded-sm" />
                        <span>العربية</span>
                    </div>


                    <!-- hide cart if not authenticated -->
                    <!-- Calendar Icon -->
                    <NuxtLink to="/cart" class="relative cursor-pointer" v-if="authModule.isAuthenticated">
                        <img src="/public/assets/img/calendar.svg" alt="flag" class="w-[27px] h-[27px] rounded-sm" />
                        <span v-if="cartModule.getProductsCount > 0"
                            class="absolute bg-[#DA3C3C] text-white w-[17px] h-[17px] flex items-center justify-center rounded-full text-[11px] font-normal -top-1 -end-1">
                            {{ cartModule.getProductsCount }}
                        </span>
                    </NuxtLink>

                    <!-- Notifications Icon -->
                    <div class="relative cursor-pointer" v-if="authModule.isAuthenticated"
                        @click="navigateToNotifications">
                        <img src="/public/assets/img/Huge-icon.svg" alt="flag" class="w-[27px] h-[27px] rounded-sm" />
                        <span v-if="homeModule.unreadNotifications > 0"
                            class="absolute bg-[#DA3C3C] text-white w-[17px] h-[17px] flex items-center justify-center rounded-full text-[11px] font-normal -top-1 -end-1">
                            {{ homeModule.unreadNotifications }}
                        </span>
                    </div>


                    <UserMenu />


                </div>
            </Container>
        </nav>

        <div class="md:hidden">
            <div class="flex justify-between bg-[#A0576F] px-[15px] py-[20px] ">
                <UButton icon="i-lucide:menu" @click="isOpen = true" size="xs"
                    class="bg-transparent flex items-center justify-center p-0 h-[24px] w-[24px] border border-white" />



                <NuxtLink to="/" class="flex items-center gap-2">
                    <img src="~/public/assets/img/lasuran-logo.svg" alt="LASURAN Logo" class="h-10 w-auto" />
                </NuxtLink>
                <div class="flex gap-[20px]">
                    <NuxtLink to="/cart" class="relative cursor-pointer" v-if="authModule.isAuthenticated">
                        <img src="/public/assets/img/calendar.svg" alt="flag" class="w-[27px] h-[27px] rounded-sm" />
                        <span v-if="cartModule.getProductsCount > 0"
                            class="absolute bg-[#DA3C3C] text-white w-[17px] h-[17px] flex items-center justify-center rounded-full text-[11px] font-normal -top-1 -end-1">
                            {{ cartModule.getProductsCount }}
                        </span>
                    </NuxtLink>

                    <div class="relative cursor-pointer" v-if="authModule.isAuthenticated"
                        @click="navigateToNotifications">
                        <img src="/public/assets/img/Huge-icon.svg" alt="flag" class="w-[27px] h-[27px] rounded-sm" />
                        <span v-if="homeModule.unreadNotifications > 0"
                            class="absolute bg-[#DA3C3C] text-white w-[17px] h-[17px] flex items-center justify-center rounded-full text-[11px] font-normal -top-1 -end-1">
                            {{ homeModule.unreadNotifications }}
                        </span>
                    </div>
                </div>
            </div>
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
                                        <span class="text-[15px] font-[350] leading-none">Home</span>
                                    </NuxtLink>

                                    <NuxtLink to="/services"
                                        class="flex items-center gap-2 px-4 py-[6px] rounded-lg text-[#A0576F] hover:opacity-70 transition cursor-pointer">
                                        <img src="/assets/img/menu-icons/Group.svg" alt="" class="w-[20px] h-[20px]" />
                                        <span class="text-[15px] font-[350] leading-none">Services</span>
                                    </NuxtLink>

                                    <NuxtLink to="/branches"
                                        class="flex items-center gap-2 px-4 py-[6px] rounded-lg text-[#A0576F] hover:opacity-70 transition cursor-pointer">
                                        <img src="/public/assets/img/menu-icons/Group.svg" alt=""
                                            class="w-[20px] h-[20px]" />
                                        <span class="text-[15px] font-[350] leading-none">Branches</span>
                                    </NuxtLink>

                                    <NuxtLink to="/gift-cards"
                                        class="flex items-center gap-2 px-4 py-[6px] rounded-lg text-[#A0576F] hover:opacity-70 transition cursor-pointer">
                                        <img src="/assets/img/menu-icons/Group.svg" alt="" class="w-[20px] h-[20px]" />
                                        <span class="text-[15px] font-[350] leading-none">Gift Cards</span>
                                    </NuxtLink>


                                    <!-- <NuxtLink to="/shop"
                                        class="flex items-center gap-2 px-4 py-[6px] rounded-lg text-[#A0576F] hover:opacity-70 transition cursor-pointer">
                                        <img src="/assets/img/menu-icons/Group.svg" alt="" class="w-[20px] h-[20px]" />
                                        <span class="text-[15px] font-[350] leading-none">Shop</span>
                                    </NuxtLink> -->

                                    <NuxtLink to="/profile?tab=profile" v-if="authModule.isAuthenticated"
                                        class="flex items-center gap-2 px-4 py-[6px] rounded-lg text-[#A0576F] hover:opacity-70 transition cursor-pointer">
                                        <img src="/assets/img/menu-icons/Layer.svg" alt="" class="w-[20px] h-[20px]" />
                                        <span class="text-[15px] font-[350] leading-none">My Profile</span>
                                    </NuxtLink>



                                    <NuxtLink to="/profile?tab=bookings" v-if="authModule.isAuthenticated"
                                        class="flex items-center gap-2 px-4 py-[6px] rounded-lg text-[#A0576F] hover:opacity-70 transition cursor-pointer">
                                        <img src="/assets/img/menu-icons/Frame-5.svg" alt=""
                                            class="w-[20px] h-[20px]" />
                                        <span class="text-[15px] font-[350] leading-none">My Bookings</span>
                                    </NuxtLink>

                                    <NuxtLink to="/contact-us"
                                        class="flex items-center gap-2 px-4 py-[6px] rounded-lg text-[#A0576F] hover:opacity-70 transition cursor-pointer">
                                        <img src="/assets/img/menu-icons/Group-1.svg" alt=""
                                            class="w-[20px] h-[20px]" />
                                        <span class="text-[15px] font-[350] leading-none">Customer Service</span>
                                    </NuxtLink>

                                    <NuxtLink to="/profile?tab=wallet" v-if="authModule.isAuthenticated"
                                        class="flex items-center gap-2 px-4 py-[6px] rounded-lg text-[#A0576F] hover:opacity-70 transition cursor-pointer">
                                        <img src="/assets/img/menu-icons/Frame-1.svg" alt=""
                                            class="w-[20px] h-[20px]" />
                                        <span class="text-[15px] font-[350] leading-none">My Wallet</span>
                                    </NuxtLink>

                                    <NuxtLink to="/invite" v-if="authModule.isAuthenticated"
                                        class="flex items-center gap-2 px-4 py-[6px] rounded-lg text-[#A0576F] hover:opacity-70 transition cursor-pointer">
                                        <img src="/assets/img/menu-icons/Frame-3.svg" alt=""
                                            class="w-[20px] h-[20px]" />
                                        <span class="text-[15px] font-[350] leading-none">Invite Friends</span>
                                    </NuxtLink>

                                    <NuxtLink to="/gift-cards" v-if="authModule.isAuthenticated"
                                        class="flex items-center gap-2 px-4 py-[6px] rounded-lg text-[#A0576F] hover:opacity-70 transition cursor-pointer">
                                        <img src="/assets/img/menu-icons/svgexport-17.svg" alt=""
                                            class="w-[20px] h-[20px]" />
                                        <span class="text-[15px] font-[350] leading-none">My Gift Cards</span>
                                    </NuxtLink>


                                    <NuxtLink to="/profile?tab=tickets" v-if="authModule.isAuthenticated"
                                        class="flex items-center gap-2 px-4 py-[6px] rounded-lg text-[#A0576F] hover:opacity-70 transition cursor-pointer">
                                        <img src="/assets/img/menu-icons/Frame-2.svg" alt=""
                                            class="w-[20px] h-[20px]" />
                                        <span class="text-[15px] font-[350] leading-none">My Tickets</span>
                                    </NuxtLink>

                                    <div @click="openLegal('terms')"
                                        class="flex items-center gap-2 px-4 py-[6px] rounded-lg text-[#A0576F] hover:opacity-70 transition cursor-pointer">
                                        <img src="/assets/img/menu-icons/terms.svg" alt="" class="w-[20px] h-[20px]" />
                                        <span class="text-[15px] font-[350] leading-none">Terms & Conditions</span>
                                    </div>

                                    <div @click="openLegal('privacy')"
                                        class="flex items-center gap-2 px-4 py-[6px] rounded-lg text-[#A0576F] hover:opacity-70 transition cursor-pointer">
                                        <img src="/assets/img/menu-icons/Layer_1.svg" alt=""
                                            class="w-[20px] h-[20px]" />
                                        <span class="text-[15px] font-[350] leading-none">Privacy Policy</span>
                                    </div>


                                    <NuxtLink to="/"
                                        class="flex items-center gap-2 px-4 py-[6px] rounded-lg text-[#A0576F] hover:opacity-70 transition cursor-pointer">
                                        <img src="/assets/img/menu-icons/Frame-4.svg" alt=""
                                            class="w-[20px] h-[20px]" />
                                        <span class="text-[15px] font-[350] leading-none">العربية</span>
                                    </NuxtLink>

                                </div>
                            </div>

                            <BaseButton label="Log In" v-if="!authModule?.isAuthenticated" @click="showDialog"
                                class="bg-[#A0576F] text-white rounded-[100px] w-full py-[16px] justify-center text-[18px] font-normal leading-[100%] tracking-[0] border border-[#A0576F] hover:bg-[#913E5D] transition cursor-pointer" />
                            <BaseButton label="Log out" v-else @click="logout"
                                class="bg-[#C44E4E] text-white rounded-[100px] w-full py-[16px] justify-center text-[18px] font-normal leading-[100%] tracking-[0] border border-[#A0576F] hover:bg-[#913E5D] transition cursor-pointer" />


                            <!-- Actions / Icons -->
                            <div
                                class="hidden md:flex items-center gap-[30px] text-white font-medium py-[11px] px-[35px] text-[17px]capitalize ">
                                <!-- Language -->
                                <div class="flex items-center gap-1 text-sm cursor-pointer">
                                    <img src="/public/assets/img/sa-flag.svg" alt="flag"
                                        class="w-[29px] h-[20px] rounded-sm" />
                                    <span>العربية</span>
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

import Container from '~/components/base/Container.vue'
import UserMenu from '~/components/base/UserMenu.vue'
import LegalDialog from '~/components/base/LegalDialog.vue'

import { useCart } from '~/stores/cart'
import { useHome } from '~/stores/home'
import { useAuth } from '~/stores/auth'
import { useApi } from '~/composables/useApi'

// auth, cart, home modules
const authModule = useAuth()
const cartModule = useCart()
const homeModule = useHome()

// dialog state for legal modal
const showLegalModal = ref(false)
const legalUrl = ref('')
const pagesUrls = ref<Record<string, string>>({})

// fetch page URLs for iframe modals
useApi('settings/pages-url', {
  key: 'pages-url',
  immediate: true
}, {
  onSuccess(res) {
    pagesUrls.value = res.data
  }
})

// mobile menu slide state
const isOpen = ref(false)

// open legal modal with dynamic URL
const openLegal = (type: 'terms' | 'privacy') => {
  legalUrl.value = type === 'terms'
    ? pagesUrls.value?.terms_and_condition_url
    : pagesUrls.value?.privacy_policy_url

  isOpen.value = false

  setTimeout(() => {
    showLegalModal.value = true
  }, 150)
}

// close slideover on route change
const route = useRoute()
watch(() => route.fullPath, () => {
  isOpen.value = false
})

// go to notifications page
const navigateToNotifications = () => {
  navigateTo({
    path: '/notifications'
  })
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