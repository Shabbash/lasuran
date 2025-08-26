<template>
  <Container>
    <Banner :opacity="false" :bannerContent="bannerContent" />


    <div class="flex flex-col md:flex-row">
      <div class="flex-1">
        <div class="mb-[30px] md:mb-0">
          <h3 class="text-[#EBE4DF] text-[30px] md:text-[67px] font-extrabold tracking-[-0.408px] mb-[30px]">Get in Touch</h3>
          <p class="text-white text-[20px] font-[350] tracking-[-0.408px] mb-[30px]">We’d love to hear from you! Whether
            you have a question, a project in mind, or just want to say hello, feel
            free to reach out.</p>

          <ul class="grid grid-cols-3 gap-[10px] max-w-[400px]">
            <li v-for="contact in contacts" :key="contact.name">
              <a :href="contact.link">
                <img class="w-full" :src="`${contact.icon}`" :alt="contact.name" />
              </a>
            </li>
          </ul>

        </div>
      </div>
      <div class="flex-1">
        <div class="rounded-[30px] bg-[#EBE4DF] px-[15px] md:px-[50px] py-[30px]">

          <USelectMenu v-model="contactForm.category" :items="customerServiceOptions?.feedbacks ?? []" valueKey="id" labelKey="name"
            placeholder="Select Feedback Type"
            class="w-full rounded-[23px] border border-[#A0576F] bg-transparent h-[59px] text-[#90928F] text-[16px] font-[400] leading-normal ps-[28px] mb-[20px]"
            :ui="{
              placeholder: 'text-[#90928F] text-[16px] font-[400] leading-normal'
            }" />

          <USelectMenu v-model="contactForm.order_id" :items="customerServiceOptions?.orders ?? []" valueKey="id" labelKey="order_number"
                       placeholder="Select Order"
                       class="w-full rounded-[23px] border border-[#A0576F] bg-transparent h-[59px] text-[#90928F] text-[16px] font-[400] leading-normal ps-[28px] mb-[20px]"
                       :ui="{
              placeholder: 'text-[#90928F] text-[16px] font-[400] leading-normal'
            }" />

<!--          <UInput v-model="contactForm.order_id" placeholder="Order ID (Optional)"-->
<!--            class="w-full rounded-[23px] border border-[#A0576F] bg-transparent h-[59px] text-[#90928F] text-[16px] font-[400] leading-normal ps-[28px] mb-[20px]"-->
<!--            :ui="{-->
<!--              base: ['w-full h-full p-0 bg-transparent border-0 outline-none shadow-none text-[#90928F] text-[16px] font-normal leading-normal ring-0 ring-transparent focus-visible:ring-none']-->
<!--            }" />-->

          <UTextarea v-model="contactForm.message" placeholder="Leave your comment"
            class="w-full rounded-[23px] border border-[#A0576F] bg-transparent h-[170px] text-[#90928F] text-[16px] font-[400] leading-normal ps-[28px] py-[23px] mb-[20px]"
            :ui="{
              base: ['resize-none w-full h-full p-0 bg-transparent border-0 outline-none shadow-none text-[#90928F] text-[16px] font-normal leading-normal ring-0 ring-transparent focus-visible:ring-none']
            }" />


          <div class="inline-flex justify-center items-center gap-[17px] relative py-[10px] px-[22px] rounded-full bg-[#C6C6C7] text-[16px] font-normal text-[#6B8B9B] cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="28" viewBox="0 0 19 28" fill="none">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M10.5217 27.5293C12.6408 27.2135 14.5715 26.1344 15.9509 24.4951C17.3303 22.8558 18.0634 20.769 18.0124 18.6271V8.14112C18.0027 7.82297 17.8695 7.5211 17.641 7.29948C17.4125 7.07787 17.1068 6.95393 16.7885 6.95393C16.4702 6.95393 16.1644 7.07787 15.9359 7.29948C15.7075 7.5211 15.5743 7.82297 15.5646 8.14112V18.9616C15.5644 19.8691 15.3624 20.7652 14.9733 21.5851C14.5842 22.405 14.0176 23.1281 13.3147 23.7021C12.6118 24.2761 11.79 24.6867 10.9089 24.9041C10.0278 25.1215 9.10944 25.1403 8.22018 24.9591C6.81145 24.6412 5.55531 23.8476 4.6634 22.7118C3.77148 21.5759 3.29828 20.1674 3.32353 18.7235V6.7228C3.32279 6.1823 3.44137 5.64831 3.67081 5.15892C3.90026 4.66954 4.2349 4.23684 4.65086 3.89171C5.06681 3.54657 5.55383 3.29752 6.07715 3.16231C6.60046 3.02711 7.14717 3.00909 7.67825 3.10955C8.53978 3.29632 9.30939 3.77722 9.85495 4.46967C10.4005 5.16211 10.688 6.02289 10.6679 6.9042V16.5127C10.6583 16.8308 10.5251 17.1327 10.2966 17.3543C10.0681 17.5759 9.76235 17.6999 9.44406 17.6999C9.12577 17.6999 8.81999 17.5759 8.59152 17.3543C8.36306 17.1327 8.22987 16.8308 8.22018 16.5127V9.16942C8.22517 9.00557 8.1972 8.84238 8.13794 8.68953C8.07868 8.53669 7.98933 8.3973 7.87519 8.27963C7.76105 8.16196 7.62444 8.06841 7.47347 8.00453C7.3225 7.94064 7.16024 7.90772 6.9963 7.90772C6.83237 7.90772 6.67011 7.94064 6.51913 8.00453C6.36816 8.06841 6.23156 8.16196 6.11742 8.27963C6.00328 8.3973 5.91393 8.53669 5.85466 8.68953C5.7954 8.84238 5.76744 9.00557 5.77242 9.16942V16.5138C5.7628 17.0596 5.87498 17.6007 6.1008 18.0977C6.32661 18.5947 6.66038 19.035 7.07783 19.3868C7.49527 19.7385 7.98588 19.9928 8.51396 20.131C9.04203 20.2693 9.59429 20.2881 10.1305 20.186C11.003 19.999 11.7813 19.5096 12.3278 18.8042C12.8743 18.0988 13.1538 17.2229 13.1168 16.3313V6.7228C13.1166 5.81528 12.9146 4.91915 12.5255 4.09928C12.1364 3.27941 11.5699 2.5563 10.867 1.98229C10.164 1.40827 9.34229 0.997706 8.46119 0.780307C7.58009 0.562909 6.66168 0.544114 5.77242 0.725283C4.36562 1.04275 3.11096 1.83476 2.21925 2.96823C1.32755 4.1017 0.853154 5.50755 0.875773 6.94955V18.9616C0.866077 20.1835 1.11784 21.3934 1.61417 22.51C2.11051 23.6267 2.83992 24.6242 3.75348 25.4358C4.66704 26.2473 5.74362 26.8541 6.91096 27.2154C8.0783 27.5767 9.30941 27.6841 10.5217 27.5304V27.5293Z"
                fill="#6B8B9B" />
            </svg>
            <span>{{ selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : 'Upload Photos' }}</span>
            <UInput
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              @change="handleFileUpload"
              class="absolute inset-0 opacity-0 cursor-pointer"
              :ui="{
                base: 'p-0 h-full cursor-pointer'
              }" />
          </div>

          <!-- Display selected files -->
          <div v-if="selectedFiles.length > 0" class="mt-[10px] mb-[20px]">
            <div v-for="(file, index) in selectedFiles" :key="index" class="flex items-center justify-between bg-gray-100 rounded-lg p-2 mb-2">
              <span class="text-sm text-gray-700">{{ file.name }}</span>
              <button @click="removeFile(index)" class="text-red-500 hover:text-red-700">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          <BaseButton 
            :label="contactStore.isSubmitting ? 'Submitting...' : 'Submit'"
            :disabled="contactStore.isSubmitting || !isFormValid"
            @click="submitForm"
            class="bg-[#A0576F] disabled:bg-[#A0576F] text-white rounded-[100px] w-full py-[16px] justify-center text-[18px] font-normal leading-[100%] tracking-[0] border border-[#A0576F] hover:bg-[#913E5D] transition cursor-pointer mt-[30px] disabled:opacity-50 disabled:cursor-not-allowed" />

        </div>
      </div>

    </div>

  </Container>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import Container from '@/components/base/Container.vue'
import Banner from '@/components/base/Banner.vue'
import BaseCard from '@/components/base/Card.vue'
import Dialog from '@/components/base/Dialog.vue'
import { useContact } from '@/stores/contact'
import { usePageTitle } from '~/composables/usePageTitle'
usePageTitle("titles.customerservice")

// Store
const contactStore = useContact()

const bannerContent = {
  image: "/assets/img/contact-us.png",
  subtitle: "We are happy to help",
  title: "Contact Us"
}

const contacts = [
  { name: 'phone', icon: '/assets/img/contact-phone.svg', link: '#' },
  { name: 'email', icon: '/assets/img/contact-email.svg', link: '#' },
  { name: 'whatsapp', icon: '/assets/img/contact-whats.svg', link: '#' },
  { name: 'web', icon: '/assets/img/contact-web.svg', link: '#' },
  { name: 'instagram', icon: '/assets/img/contact-insta.svg', link: '#' },
  { name: 'x', icon: '/assets/img/contact-x.svg', link: '#' }
]

// Form data
const contactForm = ref({
  category: null,
  order_id: '',
  message: ''
})

// File handling
const selectedFiles = ref<File[]>([])

// Feedback options based on API categories
const { data: customerServiceOptions, pending: isFetchLoading } = useApi('customer-service', {
  transform: (response) => response?.data ?? {}
});

// Form validation
const isFormValid = computed(() => {
  return contactForm.value.category &&
         contactForm.value.message &&
         contactForm.value.message.trim().length > 0
})

// File upload handler
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    const newFiles = Array.from(target.files)
    selectedFiles.value = [...selectedFiles.value, ...newFiles]
  }
}

// Remove file
const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1)
}

// Submit form
const submitForm = async () => {
  if (!isFormValid.value) return

  const formData = {
    category: contactForm.value.category,
    order_id: contactForm.value.order_id,
    message: contactForm.value.message,
    attachments: selectedFiles.value
  }

  const result =  contactStore.submitFeedback(formData, (response) => {
    console.log('submitFeedback',result)
    // Reset form on success
    contactForm.value = {
      category: null,
      order_id: '',
      message: ''
    }
    selectedFiles.value = []

    // Redirect to dashboard tickets tab after successful submission
    navigateTo('/dashboard/tickets')
  })
}

</script>
