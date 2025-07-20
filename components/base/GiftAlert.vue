<template>
    <Transition name="fade">
        <div v-if="visible" class="relative p-[18px] rounded-[12px] bg-[#EAC1B7] flex flex-col gap-[10px]">

            <!-- ❌ Close Button -->
            <button @click="visible = false" class="absolute top-4 end-4 cursor-pointer">
                <XIcon />
            </button>

            <!-- 🎁 Top Section -->
            <div class="flex gap-4 items-center">
                <div class="rounded-full bg-[#A0576F] w-[36px] h-[36px] flex items-center justify-center shrink-0">
                    <GiftAlertIcon />
                </div>
                <div>
                    <p class="text-[#A0576F] text-[15px] font-bold leading-normal">Gift from Zahra</p>
                    <p class="text-[#5B605C] text-[14px] font-[350] leading-normal">Zahra has gifted you these services!
                    </p>
                </div>
            </div>

            <!-- 💌 Message  -->
            <p class="text-[#5B605C] text-[14px] font-[350] not-italic leading-normal"><span
                    class="text-[#A0576F] font-[600]">Message:</span> Enjoy your time !! Can’t wait to see your new
                look!</p>
        </div>
    </Transition>
</template>

<script setup>
import { ref } from 'vue'
import GiftAlertIcon from '@/components/icons/GiftAlertIcon.vue'
import XIcon from '@/components/icons/XIcon.vue'

const visible = ref(true)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s ease;
    overflow: hidden;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    max-height: 0;
    padding-top: 0;
    padding-bottom: 0;
    margin-bottom: 0;
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
    max-height: 100vh;
}
</style>
