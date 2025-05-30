<template>

    <div class="base_card">
        <div v-if="title" class="base_card--head flex justify-between align-center mb-[16px] px-[15px]">
            <slot name="head">
                <h2 class="font-normal text-[white] text-[15px] leading-[1] tracking-[0]">{{ title }}</h2>
                <a v-if="withAction" href="#" class="font-medium text-[#D29F8C] text-[14px] leading-[1]  tracking-[0]">See All</a>
            </slot>

        </div>
        <div class="base_card--body">
            <slot></slot>
        </div>

    </div>
</template>
<script lang="ts" setup>
const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    withAction: {
        type: Boolean,
        default: false,
    }

})

</script>