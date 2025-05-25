<template>
    <nav class="text-white">
        <Container class="px-[62px] py-[30px] flex items-center justify-between">
            <!-- Logo Image -->
            <NuxtLink to="/" class="flex items-center gap-2">
                <img src="~/public/assets/img/lasuran-logo.svg" alt="LASURAN Logo" class="h-10 w-auto" />
            </NuxtLink>

            <!-- Navigation Links -->
            <ul class="flex items-center text-sm font-medium">
                <li>
                    <NuxtLink to="/"
                        class="font-medium py-[11px] px-[35px] text-[17px] leading-[1.03] tracking-normal text-[#EBE4DF] capitalize">
                        Home
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/services"
                        class="font-medium py-[11px] px-[35px] text-[17px] leading-[1.03] tracking-normal text-[#EBE4DF] capitalize">
                        Services</NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/branches"
                        class="font-medium py-[11px] px-[35px] text-[17px] leading-[1.03] tracking-normal text-[#EBE4DF] capitalize">
                        Branches</NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/contact-us"
                        class="font-medium py-[11px] px-[35px] text-[17px] leading-[1.03] tracking-normal text-[#EBE4DF] capitalize">
                        Contact Us</NuxtLink>
                </li>
            </ul>

            <!-- Actions / Icons -->
            <div
                class="flex items-center gap-[30px] text-white font-medium py-[11px] px-[35px] text-[17px] leading-[1.03] tracking-normal capitalize">
                <!-- Language -->
                <div class="flex items-center gap-1 text-sm cursor-pointer">
                    <img src="/public/assets/img/sa-flag.svg" alt="flag" class="w-[29px] h-[20px] rounded-sm" />
                    <span>العربية</span>
                </div>

                <!-- Calendar Icon -->
                <NuxtLink to="/cart" class="relative cursor-pointer">
                    <img src="/public/assets/img/calendar.svg" alt="flag" class="w-[27px] h-[27px] rounded-sm" />
                    <span
                        class="absolute bg-[#DA3C3C] w-[17px] h-[17px] flex items-center justify-center rounded-full text-[11px] font-normal -top-1 -end-1">
                        {{ cartModule.getProductsCount }}
                    </span>
                </NuxtLink>

                <!-- Notifications Icon -->
                <div class="relative cursor-pointer">
                    <img src="/public/assets/img/Huge-icon.svg" alt="flag" class="w-[27px] h-[27px] rounded-sm" />
                    <span
                        class="absolute bg-[#DA3C3C] w-[17px] h-[17px] flex items-center justify-center rounded-full text-[11px] font-normal -top-1 -end-1">3</span>
                </div>


                <UserMenu />


            </div>
        </Container>
    </nav>
</template>

<script setup lang="ts">
import Container from '~/components/base/Container.vue'
import UserMenu from '~/components/base/UserMenu.vue'
import { useCart } from '~/stores/cart'

const cartModule = useCart()

</script>

<style>
li .router-link-exact-active {
    background: #EBE4DF;
    color: #A0576F;
    font-weight: 700;
    border-radius: 100px;
}
</style>