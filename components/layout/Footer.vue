<template>
    <footer>
        <Container>
            <div class="flex justify-between items-center mt-[55px]">
                <ul class="flex justify-between items-center">
                    <li>
                        <a href="#">
                            <img src="/public/assets/img/google-play-badge.svg" alt="">
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <img src="/public/assets/img/app-store.svg" alt="">
                        </a>
                    </li>
                </ul>

                <p class="font-medium text-[14px] leading-[14px] tracking-normal text-[white]">Copyright © Lasuran All Rights Reserved
                </p>

                <ul class="flex justify-between items-center gap-[30px]">
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
</script>