<template>
    <footer>
        <Container>
            <div class="flex flex-col md:flex-row justify-between items-center mt-[55px]">
                <ul class="flex justify-between items-center">
                    <li>
                        <a href="https://play.google.com/store/apps/details?id=com.jigsaw.lasuran">
                            <img src="/public/assets/img/google-play-badge.svg" alt="">
                        </a>
                    </li>
                    <li>
                        <a href="https://apps.apple.com/us/app/lasuran/id6738307980">
                            <img src="/public/assets/img/app-store.svg" alt="">
                        </a>
                    </li>
                </ul>

                <p class="font-medium text-[14px] leading-[14px] tracking-normal text-[white] py-[15px] md:py-0">
                    {{ t('copyright') }}
                </p>

                <ul class="hidden md:flex justify-between items-center gap-[30px]">
                    <li>
                        <a href="#">
                            <img src="/public/assets/img/FB.svg" alt="">
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <img src="/public/assets/img/Linkedin.svg" alt="">
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <img src="/public/assets/img/Instagram.svg" alt="">
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <img src="/public/assets/img/Twitter.svg" alt="">
                        </a>
                    </li>

                </ul>
            </div>
        </Container>
    </footer>
</template>


<script setup lang="ts">
import Container from '~/components/base/Container.vue'
import { useI18n } from 'vue-i18n'

// Access translation function
const { t } = useI18n()


</script>