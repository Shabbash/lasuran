<template>
  <Container>
    <Banner :opacity="false" :bannerContent="bannerContent" />


    <div class="flex">
      <div class="flex-1">
        <div>
          <h3 class="text-[#EBE4DF] text-[67px] font-extrabold tracking-[-0.408px] mb-[30px]">Get in Touch</h3>
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
        <div class="rounded-[30px] bg-[#EBE4DF] px-[50px] py-[30px]">

          <USelectMenu v-model="contactForm.feedback" :items="feedbackOptions" valueKey="id" labelKey="name"
            placeholder="Select Feedback"
            class="w-full rounded-[23px] border border-[#A0576F] bg-transparent h-[59px] text-[#90928F] text-[16px] font-[400] leading-normal ps-[28px]"
            :ui="{
              placeholder: 'text-[#90928F] text-[16px] font-[400] leading-normal'
            }" />

          <UInput v-model="value"
            class="w-full rounded-[23px] border border-[#A0576F] bg-transparent h-[59px] text-[#90928F] text-[16px] font-[400] leading-normal ps-[28px]"
            :ui="{
              base: ['w-full h-full p-0 bg-transparent border-0 outline-none shadow-none text-[#90928F] text-[16px] font-normal leading-normal ring-0 ring-transparent focus-visible:ring-none']
            }" />

          <UTextarea v-model="value"
            class="w-full rounded-[23px] border border-[#A0576F] bg-transparent h-[170px] text-[#90928F] text-[16px] font-[400] leading-normal ps-[28px]"
            :ui="{
              base: ['resize-none w-full h-full p-0 bg-transparent border-0 outline-none shadow-none text-[#90928F] text-[16px] font-normal leading-normal ring-0 ring-transparent focus-visible:ring-none']
            }" />

            
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


const contactForm = ref({
  feedback: null
})

const feedbackOptions = [
  { id: 1, name: 'Excellent Service' },
  { id: 2, name: 'Very Good' },
  { id: 3, name: 'Good' },
  { id: 4, name: 'Needs Improvement' },
  { id: 5, name: 'Bad Experience' }
]




</script>
