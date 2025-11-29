<template>
  <div class="max-w-[473px] mx-auto py-[100px]">
    <div class="text-center">
      <img src="/assets/img/register-logo.svg" class="mx-auto max-w-[214px] mb-[56px]" alt="" />
    </div>

    <p class="text-start text-[19.15px] font-medium leading-[31.28px] tracking-[0] text-[#5B605C] mb-[18px]">
      {{ t('enter_mobile_number') }}
    </p>

    <div
      class="flex rounded-[14.37px] border-[1.2px] px-[18px] py-[15px] text-[16.76px] font-normal leading-[31.28px] tracking-[2.61px] text-[#A0576F] mobile_number"
    >
      <div class="flex items-center gap-2">
        <img src="/public/assets/img/sa-flag.svg" alt="saudi-flag" class="w-[35px] h-[23px]" />
        <span class="text-[#A0576F] font-medium">+966</span>
      </div>
      <div class="mx-[18px] border-l border-[#BBCACF]"></div>
      <input
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"
        maxlength="11"
        v-model="form.mobile_number"
        @input="formatMobileNumber"
        :placeholder="t('mobile_placeholder')"
        class="flex-1 outline-none bg-transparent text-[#5B605C] placeholder:text-[#D3C9C5] text-[16px]"
      />
    </div>

    <div class="flex items-center gap-[10px] mt-[20px]">
      <label class="relative flex items-center cursor-pointer select-none">
        <input type="checkbox" class="sr-only peer" value="1" v-model="form.accept_terms" />
        <div
          class="w-[20px] h-[20px] rounded-full border-2 border-[#A0576F] flex items-center justify-center peer-checked:bg-[#A0576F] transition"
        >
          <div
            class="w-[10px] h-[10px] rounded-full bg-[#EBE4DF] scale-0 peer-checked:scale-100 transition-transform duration-200"
          ></div>
        </div>
      </label>

      <span class="text-[16.76px] font-normal leading-[100%] tracking-[0] text-[#5B605C]">
        {{ t('i_accept') }}
        <button type="button" @click="openTerms" class="text-[#A0576F] underline hover:opacity-80">
          {{ t('terms') }}
        </button>
        {{ t('and') }}
        <button type="button" @click="openPrivacy" class="text-[#A0576F] underline hover:opacity-80">
          {{ t('privacy_policy') }}
        </button>
      </span>
    </div>

    <div class="w-full space-y-3">
      <BaseButton
        :loading="authModule.loading"
        :label="t('continue')"
        @click="onContinueClick"
        class="bg-[#A0576F] text-white rounded-[100px] w-full py-[16px] justify-center text-[18px] font-normal leading-[100%] tracking-[0] border border-[#A0576F] hover:bg-[#913E5D] transition cursor-pointer mt-[30px] disabled:bg-[#A0576F]"
      />

      <BaseButton
        :label="t('continue_as_guest')"
        @click="continueAsGuest"
        class="bg-transparent text-[#A0576F] border border-[#A0576F] rounded-[100px] w-full py-[16px] justify-center text-[18px] font-normal hover:bg-[#F4EAEA] transition cursor-pointer leading-[100%] tracking-[0]"
      />
    </div>
  </div>

  <!-- Local Legal Dialog فوق مودال اللوجين بدون ما يطفّيه -->
  <LegalDialog v-model:show="showLegalModal" :url="legalUrl" />
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue"
import { useI18n } from "vue-i18n"
import { COMPONENTS } from "~/data/constants"
import { useAuth } from "~/stores/auth"
import { useApp } from "~/stores/app"
import { useToast } from "#imports"
import { useApi } from "~/composables/useApi"
import LegalDialog from "~/components/base/LegalDialog.vue"

const { t } = useI18n()
const authModule = useAuth()
const { setDialogShow } = useApp()
const toast = useToast()

const form = ref({
  mobile_number: "",
  mobile_code: "966",
  accept_terms: 0
})

// Legal URLs
const pagesUrls = ref<Record<string, string>>({})
const showLegalModal = ref(false)
const legalUrl = ref("")

// Load legal URLs once for this step
useApi(
  "settings/pages-url",
  {
    key: "pages-url-auth",
    immediate: true
  },
  {
    onSuccess: (data: any) => {
      // data = { status, status_code, message, data: { privacy_policy_url, terms_and_condition_url, ... } }
      pagesUrls.value = data?.data || {}
    }
  }
)

const continueAsGuest = () => {
  authModule.setStepComponent(COMPONENTS.INTRO_STEP)
  nextTick(() => setDialogShow(false))
}

const onContinueClick = () => {
  if (!form.value.mobile_number) {
    toast.add({ title: t("error_enter_mobile"), color: "error" })
    return
  }

  if (!form.value.accept_terms) {
    toast.add({ title: t("error_accept_terms"), color: "error" })
    return
  }

  const cleanedForm = {
    ...form.value,
    mobile_number: form.value.mobile_number.replace(/\s/g, "")
  }

  authModule.sendOtp(cleanedForm)
}

const formatMobileNumber = (e: Event) => {
  let raw = (e.target as HTMLInputElement).value

  // Keep only digits and limit to 9 numbers
  raw = raw.replace(/\D/g, "").slice(0, 9)

  let formatted = ""

  if (raw.length <= 3) {
    formatted = raw
  } else if (raw.length <= 6) {
    formatted = `${raw.slice(0, 3)} ${raw.slice(3)}`
  } else {
    formatted = `${raw.slice(0, 3)} ${raw.slice(3, 6)} ${raw.slice(6)}`
  }

  form.value.mobile_number = formatted
}

// Use local LegalDialog here (لا نستخدم setDialogComponent حتى لا يطفي مودال اللوجين)
const openTerms = () => {
  legalUrl.value =
    pagesUrls.value?.terms_and_condition_url || "https://lasuran.com/terms"
  showLegalModal.value = true
}

const openPrivacy = () => {
  legalUrl.value =
    pagesUrls.value?.privacy_policy_url || "https://lasuran.com/privacy"
  showLegalModal.value = true
}
</script>
