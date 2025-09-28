<template>
    <div class="bg-[#A0576F] bg-decore">
        <div class="max-w-[95%] h-screen md:max-w-[1200px] mx-auto">

            <div class="mt-[40px] mb-[20px] text-center">
                <div>
                    <img src="~/public/assets/img/lasuran-logo.svg" alt="LASURAN Logo" class="h-10 w-auto m-auto" />
                </div>
                <h2 class="text-center mt-[20px] text-[#EBE4DF] text-[20px] capitalize">Lasuran Secure payment</h2>
            </div>

            <NuxtPage />
        </div>
    </div>

</template>

<script setup lang="ts">
// no header / no footer
</script>

<style scoped>
/* optional: prevent overscroll glow on mobile */
:global(html, body) {
    height: 100%;
}
</style>
