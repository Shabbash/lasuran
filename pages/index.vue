<template>
    <Container>
        <!-- Loading State -->
        <div v-if="homeStore.isLoading" class="flex justify-center items-center py-20">
            <div class="text-white text-lg">Loading...</div>
        </div>

        <!-- Error State -->
        <div v-else-if="homeStore.error" class="flex justify-center items-center py-20">
            <div class="text-red-500 text-lg">{{ homeStore.error }}</div>
        </div>

        <!-- Content -->
        <div v-else class="flex flex-row-reverse flex-wrap w-full gap-[24px]">

            <div class="w-full lg:w-[calc(50%-12px)]">
                <BaseCard>
                    <template #default>
                        <BaseSlider :items="homeStore.transformedSliders" dots :slide-per-row="1" :slide-per-row-mobile="1" dots-class="dots-style">
                            <template #default="{ item }">

                                <div class=" w-full">
                                    <div class=" w-full overflow-hidden relative rounded-[23px]">
                                        <img class="mx-auto h-auto md:h-full w-full object-contain md:object-cover inset-0 relative"
                                            :src="item.image_url" />
                                    </div>
                                </div>

                            </template>
                        </BaseSlider>
                    </template>

                </BaseCard>
            </div>

            <div class="w-full lg:w-[calc(50%-12px)]">

                <BaseCard title="What's new ?" with-action  class="mt-[30px] md:mt-0">
                    <template #default>
                        <BaseSlider
                            :items="homeStore.getTransformedItems(homeStore.homeSections[0]?.id || 3).slice(0, 6)"
                            :slide-per-row="3"
                            :slide-per-row-mobile="2">
                            <template #default="{ item }">

                                <div class="bg-[#EBE4DF] rounded-[23px] overflow-hidden ">
                                    <div class="rounded-[23px] overflow-hidden">
                                        <img class="h-[118px] w-full object-cover" :src="item.image_url" />
                                    </div>
                                    <div class="px-[10px] pt-[10px] pb-[18px]">
                                        <h2 class="text-[#A0566E] text-[14px] font-[350] leading-normal">{{ item.title
                                            }}</h2>
                                        <h3
                                            class="text-[#A0566E] text-[12px] font-normal leading-normal tracking-[-0.241px]">
                                            {{ item.sub_title }}</h3>
                                    </div>
                                </div>

                            </template>
                        </BaseSlider>
                    </template>

                </BaseCard>

                <BaseCard
                    :title="homeStore.homeSections[0]?.title || 'Recommended Services'"
                    with-action
                    class="mt-[30px]">
                    <template #default>
                        <BaseSlider
                            :items="homeStore.getTransformedItems(homeStore.homeSections[0]?.id || 3)"
                            :slide-per-row="homeStore.homeSections[0]?.items_per_row || 4"
                            :slide-per-row-mobile="3">
                            <template #default="{ item }">

                                <div class="rounded-[23px] overflow-hidden relative ">
                                    <div class=" h-[140px] rounded-[23px] overflow-hidden">
                                        <img class=" h-full w-full object-cover" :src="item.image_url" />
                                        <div
                                            class="absolute inset-0 bg-[linear-gradient(to_bottom,_#1B1B1B00,_#615B59)]">
                                        </div>

                                    </div>
                                    <a
                                        class="text-[white] flex justify-between items-center w-full absolute bottom-0 start-0 after:content-['+'] after:text-[40px] px-[10px]"
                                        href="#">{{ item.title }}</a>
                                </div>

                            </template>
                        </BaseSlider>
                    </template>

                </BaseCard>
            </div>
            

            <div class="w-full md:mt-[30px] slide-5">
                <BaseCard
                    :title="homeStore.homeSections[0]?.title || 'Recommended Services'"
                    with-action>
                    <template #default>
                        <BaseSlider
                            :items="homeStore.getTransformedItems(homeStore.homeSections[0]?.id || 3)"
                            :slide-per-row="5"
                            :slide-per-row-mobile="3">
                            <template #default="{ item }">

                                <div class="">
                                    <div class=" overflow-hidden relative h-[142px] rounded-[23px]">
                                        <div
                                            class="absolute h-[105px] bottom-0 w-full rounded-[30px] bg-[linear-gradient(to_bottom,_#E8D5CC,_#E8BBAC)]">
                                        </div>
                                        <img class="mx-auto h-full object-cover inset-0 relative"
                                            :src="item.image_url" />
                                    </div>
                                    <h2 class="text-center text-white mt-3 font-medium text-lg">{{ item.branch }}
                                    </h2>
                                </div>

                            </template>
                        </BaseSlider>
                    </template>

                </BaseCard>
            </div>
        </div>

    </Container>
</template>
<script lang="ts" setup>
import Container from '~/components/base/Container.vue'
import { useHome } from '@/stores/home'
import { onMounted } from 'vue'

const open = ref(false)
const homeStore = useHome()

defineShortcuts({
    o: () => open.value = !open.value
})

// Initialize home data on component mount
onMounted(async () => {
    await homeStore.initializeHome()
})


</script>
<style>
.dots-style button {
    width: 8px;
    height: 8px;
    background-color: #D9D9D9;
}

.dots-style .bg-inverted {
    width: 34px;
    background-color: #EBE4DF;

}
</style>