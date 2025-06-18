<template>
  <UPopover v-model:open="isOpen" :ui="{ content: 'px-[60px] py-[60px] bg-[#EBE4DF] rounded-[30px]' }">
    <div class="cursor-pointer menu-toggle">
      <img src="/assets/img/dots.svg" alt="menu" class="w-[30px] h-[30px]" />
    </div>

    <template #content>
      <div>
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

        <div class="grid grid-cols-2 gap-y-[5px] text-[#A0576F] text-sm my-[40px]">
          <NuxtLink to="/profile?tab=profile" v-if="authModule.isAuthenticated" @click="closePopover" class="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-70 transition cursor-pointer">
            <img src="/assets/img/menu-icons/Layer.svg" alt="" class="w-[20px] h-[20px]" />
            <span class="text-[15px] font-[350] leading-none">My Profile</span>
          </NuxtLink>

          <NuxtLink to="/branches" @click="closePopover" class="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-70 transition cursor-pointer">
            <img src="/assets/img/menu-icons/Group.svg" alt="" class="w-[20px] h-[20px]" />
            <span class="text-[15px] font-[350] leading-none">Branches</span>
          </NuxtLink>

          <NuxtLink to="/profile?tab=bookings" v-if="authModule.isAuthenticated" @click="closePopover" class="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-70 transition cursor-pointer">
            <img src="/assets/img/menu-icons/Frame-5.svg" alt="" class="w-[20px] h-[20px]" />
            <span class="text-[15px] font-[350] leading-none">My Bookings</span>
          </NuxtLink>

          <NuxtLink to="/contact-us" @click="closePopover" class="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-70 transition cursor-pointer">
            <img src="/assets/img/menu-icons/Group-1.svg" alt="" class="w-[20px] h-[20px]" />
            <span class="text-[15px] font-[350] leading-none">Customer Service</span>
          </NuxtLink>

          <NuxtLink to="/profile?tab=wallet" v-if="authModule.isAuthenticated" @click="closePopover" class="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-70 transition cursor-pointer">
            <img src="/assets/img/menu-icons/Frame-1.svg" alt="" class="w-[20px] h-[20px]" />
            <span class="text-[15px] font-[350] leading-none">My Wallet</span>
          </NuxtLink>

          <NuxtLink to="/invite" v-if="authModule.isAuthenticated" @click="closePopover" class="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-70 transition cursor-pointer">
            <img src="/assets/img/menu-icons/Frame-3.svg" alt="" class="w-[20px] h-[20px]" />
            <span class="text-[15px] font-[350] leading-none">Invite Friends</span>
          </NuxtLink>

          <NuxtLink to="/profile?tab=gift-cards" v-if="authModule.isAuthenticated" @click="closePopover" class="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-70 transition cursor-pointer">
            <img src="/assets/img/menu-icons/svgexport-17.svg" alt="" class="w-[20px] h-[20px]" />
            <span class="text-[15px] font-[350] leading-none">My Gift Cards</span>
          </NuxtLink>

          <NuxtLink to="/" @click="closePopover" class="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-70 transition cursor-pointer">
            <img src="/assets/img/menu-icons/Frame-4.svg" alt="" class="w-[20px] h-[20px]" />
            <span class="text-[15px] font-[350] leading-none">العربية</span>
          </NuxtLink>

          <NuxtLink to="/profile?tab=tickets" v-if="authModule.isAuthenticated" @click="closePopover" class="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-70 transition cursor-pointer">
            <img src="/assets/img/menu-icons/Frame-2.svg" alt="" class="w-[20px] h-[20px]" />
            <span class="text-[15px] font-[350] leading-none">My Tickets</span>
          </NuxtLink>

          <div @click="openTerms" class="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-70 transition cursor-pointer">
            <img src="/assets/img/menu-icons/terms.svg" alt="" class="w-[20px] h-[20px]" />
            <span class="text-[15px] font-[350] leading-none">Terms & Conditions</span>
          </div>

          <div @click="openPrivacy" class="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-70 transition cursor-pointer">
            <img src="/assets/img/menu-icons/Layer_1.svg" alt="" class="w-[20px] h-[20px]" />
            <span class="text-[15px] font-[350] leading-none">Privacy Policy</span>
          </div>
        </div>

        <BaseButton label="Log In" v-if="!authModule?.isAuthenticated" @click="handleLogin"
          class="bg-[#A0576F] text-white rounded-[100px] w-full py-[16px] justify-center text-[18px] font-normal leading-[100%] tracking-[0] border border-[#A0576F] hover:bg-[#913E5D] transition cursor-pointer" />

        <BaseButton label="Log out" v-else @click="logout"
          class="bg-[#C44E4E] text-white rounded-[100px] w-full py-[16px] justify-center text-[18px] font-normal leading-[100%] tracking-[0] border border-[#A0576F] hover:bg-[#913E5D] transition cursor-pointer" />
      </div>
    </template>
  </UPopover>

  <!-- Terms Modal -->
  <Dialog v-model:show="showTermsModal" :modalMaxWidth="'max-w-[800px]'">
    <template #body>
      <div class="w-[90vw] h-[90vh] max-w-[800px] bg-[#EBE4DF] rounded-[30px] overflow-hidden pt-[40px] ps-[20px]">
        <iframe v-if="pagesUrls?.terms_and_condition_url" :src="pagesUrls.terms_and_condition_url"
          class="w-full h-full border-none rounded-[30px]"></iframe>
      </div>
    </template>
  </Dialog>

  <!-- Privacy Modal -->
  <Dialog v-model:show="showPrivacyModal" :modalMaxWidth="'max-w-[800px]'">
    <template #body>
      <div class="w-[90vw] h-[90vh] max-w-[800px] bg-[#EBE4DF] rounded-[30px] overflow-hidden pt-[40px] ps-[20px]">
        <iframe v-if="pagesUrls?.privacy_policy_url" :src="pagesUrls.privacy_policy_url"
          class="w-full h-full border-none rounded-[30px]"></iframe>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProfile } from '~/stores/profile'
import { useApp } from '~/stores/app'
import { useAuth } from '~/stores/auth'
import { COMPONENTS } from '~/data/constants'
import { useApi } from '~/composables/useApi'
import Dialog from '~/components/base/Dialog.vue'

const profileStore = useProfile()
const authModule = useAuth()
const { setDialogComponent, setDialogShow } = useApp()

const isOpen = ref(false)
const showTermsModal = ref(false)
const showPrivacyModal = ref(false)
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

const closePopover = () => {
  isOpen.value = false
}

const openTerms = () => {
  closePopover()
  setTimeout(() => {
    showTermsModal.value = true
  }, 150)
}

const openPrivacy = () => {
  closePopover()
  setTimeout(() => {
    showPrivacyModal.value = true
  }, 150)
}

const handleLogin = () => {
  setDialogComponent(COMPONENTS.AUTH_WIZARD)
  authModule.setStepComponent(COMPONENTS.SEND_OTP_STEP)
  setDialogShow(true)
  closePopover()
}

const logout = () => {
  authModule.logout()
  closePopover()
}
</script>
