<template>
    <div class="relative overflow-hidden rounded-[20px] mb-[25px]">
        <div class="relative">
            <img :src="bannerContent.image" alt="banner" class="w-full h-full object-cover" />
            <div v-if="opacity" class="absolute inset-0" style="background: #000000ba"></div>
        </div>
        <div class="absolute inset-0 flex flex-col justify-center items-center gap-[27px]">
            <p class="text-[#A0576F] text-center text-[17px] font-bold leading-[22px] tracking-[-0.408px]">
                {{ bannerContent.subtitle }}
            </p>
            <h2 class="text-[#EBE4DF] text-center text-[57px] font-bold leading-[22px] tracking-[-0.408px]">
                {{ bannerContent.title }}
            </h2>
        </div>
    </div>
</template>




<script lang="ts" setup>
const props = defineProps({
    opacity: {
        type: Boolean,
        default: false,
    },
})

const bannerContent = {
    image: "/assets/img/branches-banner.svg",
    subtitle: "Explore Our",
    title: "Branches"
}
</script>
