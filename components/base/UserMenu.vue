<template>
  <UPopover :ui="{ content: 'px-[60px] py-[60px] bg-[#EBE4DF] rounded-[30px]' }">
    <div class="cursor-pointer menu-toggle">
      <img src="/assets/img/dots.svg" alt="menu" class="w-[30px] h-[30px]" />
    </div>
    <template #content>
      <div>
        <div v-if="authModule.isAuthenticated"
          class="flex items-center bg-[#A0576F] px-[27px] py-[7px] w-full rounded-[20px] gap-[16px]">
          <div class="flex items-center justify-center overflow-hidden w-[81px] h-[81px] rounded-full bg-[#D9D9D91A]">
            <div class="flex items-center justify-center overflow-hidden w-[71px] h-[71px] rounded-full bg-[#D9D9D91A]">
              <img src="/assets/img/pr-img.png" alt="" class="w-[59px] h-[59px] rounded-full">
            </div>
          </div>
          <div>
            <p class="text-[20px] font-medium leading-[100%] tracking-[0] text-[#EBE4DF] mb-[5px]">
              {{ authModule.getUserName }}
              <!--              Zahra Ahmed-->
            </p>
            <p class="font-[350] text-[14px] leading-[100%] tracking-[0] text-[#C6C6C7]">
              {{ authModule.getMobileNumber }}
              <!--              +966 864 777 634-->
            </p>
          </div>
        </div>

        <!-- <div class="grid grid-cols-2 gap-y-[20px] text-[#A0576F] text-sm my-[40px]">
          <div v-for="(item, index) in menuItems" :key="index" class="flex items-center gap-2 cursor-pointer">
            <img :src="item.image_url" />
            <span class="text-[#A0576F] font-[350] text-[15px] leading-[100%] tracking-[0]">{{ item.label }}</span>
          </div>
        </div> -->
        <div class="grid grid-cols-2 gap-y-[5px] text-[#A0576F] text-sm my-[40px]">


          <NuxtLink to="/profile?tab=profile" v-if="authModule.isAuthenticated"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-[#A0576F] hover:opacity-70 transition cursor-pointer">
            <img src="/assets/img/menu-icons/Layer.svg" alt="" class="w-[20px] h-[20px]" />
            <span class="text-[15px] font-[350] leading-none">My Profile</span>
          </NuxtLink>

          <NuxtLink to="/branches"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-[#A0576F] hover:opacity-70 transition cursor-pointer">
            <img src="/assets/img/menu-icons/Group.svg" alt="" class="w-[20px] h-[20px]" />
            <span class="text-[15px] font-[350] leading-none">Branches</span>
          </NuxtLink>

          <NuxtLink to="/profile?tab=bookings" v-if="authModule.isAuthenticated"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-[#A0576F] hover:opacity-70 transition cursor-pointer">
            <img src="/assets/img/menu-icons/Frame-5.svg" alt="" class="w-[20px] h-[20px]" />
            <span class="text-[15px] font-[350] leading-none">My Bookings</span>
          </NuxtLink>

          <NuxtLink to="/support"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-[#A0576F] hover:opacity-70 transition cursor-pointer">
            <img src="/assets/img/menu-icons/Group-1.svg" alt="" class="w-[20px] h-[20px]" />
            <span class="text-[15px] font-[350] leading-none">Customer Service</span>
          </NuxtLink>

          <NuxtLink to="/profile?tab=wallet"  v-if="authModule.isAuthenticated"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-[#A0576F] hover:opacity-70 transition cursor-pointer">
            <img src="/assets/img/menu-icons/Frame-1.svg" alt="" class="w-[20px] h-[20px]" />
            <span class="text-[15px] font-[350] leading-none">My Wallet</span>
          </NuxtLink>

          <NuxtLink to="/invite"  v-if="authModule.isAuthenticated"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-[#A0576F] hover:opacity-70 transition cursor-pointer">
            <img src="/assets/img/menu-icons/Frame-3.svg" alt="" class="w-[20px] h-[20px]" />
            <span class="text-[15px] font-[350] leading-none">Invite Friends</span>
          </NuxtLink>

          <NuxtLink to="/gift-cards"  v-if="authModule.isAuthenticated"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-[#A0576F] hover:opacity-70 transition cursor-pointer">
            <img src="/assets/img/menu-icons/svgexport-17.svg" alt="" class="w-[20px] h-[20px]" />
            <span class="text-[15px] font-[350] leading-none">My Gift Cards</span>
          </NuxtLink>

          <NuxtLink to="/"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-[#A0576F] hover:opacity-70 transition cursor-pointer">
            <img src="/assets/img/menu-icons/Frame-4.svg" alt="" class="w-[20px] h-[20px]" />
            <span class="text-[15px] font-[350] leading-none">العربية</span>
          </NuxtLink>

          <NuxtLink to="/profile?tab=tickets" v-if="authModule.isAuthenticated"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-[#A0576F] hover:opacity-70 transition cursor-pointer">
            <img src="/assets/img/menu-icons/Frame-2.svg" alt="" class="w-[20px] h-[20px]" />
            <span class="text-[15px] font-[350] leading-none">My Tickets</span>
          </NuxtLink>

          <NuxtLink to="/terms"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-[#A0576F] hover:opacity-70 transition cursor-pointer">
            <img src="/assets/img/menu-icons/terms.svg" alt="" class="w-[20px] h-[20px]" />
            <span class="text-[15px] font-[350] leading-none">Terms & Conditions</span>
          </NuxtLink>

          <NuxtLink to="/privacy"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-[#A0576F] hover:opacity-70 transition cursor-pointer">
            <img src="/assets/img/menu-icons/Layer_1.svg" alt="" class="w-[20px] h-[20px]" />
            <span class="text-[15px] font-[350] leading-none">Privacy Policy</span>
          </NuxtLink>

        </div>
      </div>

      <BaseButton label="Log In" v-if="!authModule?.isAuthenticated" @click="showDialog"
        class="bg-[#A0576F] text-white rounded-[100px] w-full py-[16px] justify-center text-[18px] font-normal leading-[100%] tracking-[0] border border-[#A0576F] hover:bg-[#913E5D] transition cursor-pointer" />
      <BaseButton label="Log out" v-else @click="logout"
        class="bg-[#C44E4E] text-white rounded-[100px] w-full py-[16px] justify-center text-[18px] font-normal leading-[100%] tracking-[0] border border-[#A0576F] hover:bg-[#913E5D] transition cursor-pointer" />

    </template>
  </UPopover>
</template>

<script setup>

import { COMPONENTS } from "~/data/constants";
const { setDialogComponent, setDialogShow } = useApp();
const authModule = useAuth();
const showDialog = function () {
  setDialogComponent(COMPONENTS.AUTH_WIZARD);
  authModule.setStepComponent(COMPONENTS.SEND_OTP_STEP);
  setDialogShow(true);
}

const logout = function () {
  authModule.logout();
}


</script>