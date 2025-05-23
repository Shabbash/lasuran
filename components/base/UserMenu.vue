<template>
  <UPopover :ui="{ content: 'px-[60px] py-[60px] bg-[#EBE4DF] rounded-[30px]' }">
    <div class="cursor-pointer menu-toggle">
      <img src="/public/assets/img/dots.svg" alt="menu" class="w-[30px] h-[30px]" />
    </div>
    <template #content>
      <div>
        <div v-if="authModule.isAuthenticated"
          class="flex items-center bg-[#A0576F] px-[27px] py-[7px] w-full rounded-[20px] gap-[16px]">
          <div class="flex items-center justify-center overflow-hidden w-[81px] h-[81px] rounded-full bg-[#D9D9D91A]">
            <div class="flex items-center justify-center overflow-hidden w-[71px] h-[71px] rounded-full bg-[#D9D9D91A]">
              <img src="/public/assets/img/pr-img.png" alt="" class="w-[59px] h-[59px] rounded-full">
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

        <div class="grid grid-cols-2 gap-y-[20px] text-[#A0576F] text-sm my-[40px]">
          <div v-for="(item, index) in menuItems" :key="index" class="flex items-center gap-2 cursor-pointer">
            <img :src="item.image_url" />
            <span class="text-[#A0576F] font-[350] text-[15.63px] leading-[100%] tracking-[0]">{{ item.label }}</span>
          </div>
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

const menuItems = [
  { label: "My Profile", image_url: "/assets/img/menu-icons/Layer.svg" },
  { label: "Branches", image_url: "/assets/img/menu-icons/Group.svg" },
  { label: "My Bookings", image_url: "/assets/img/menu-icons/Frame-5.svg" },
  { label: "Customer Service", image_url: "/assets/img/menu-icons/Group-1.svg" },
  { label: "My Wallet", image_url: "/assets/img/menu-icons/Frame-1.svg" },
  { label: "Invite Friends", image_url: "/assets/img/menu-icons/Frame-3.svg" },
  { label: "My Gift Cards", image_url: "/assets/img/menu-icons/svgexport-17.svg" },
  { label: "العربية", image_url: "/assets/img/menu-icons/Frame-4.svg" },
  { label: "My Tickets", image_url: "/assets/img/menu-icons/Frame-2.svg" },
  { label: "Terms & Conditions", image_url: "/assets/img/menu-icons/vector.svg" },
  { label: "Privacy Policy", image_url: "/assets/img/menu-icons/Layer_1.svg" }
]
</script>