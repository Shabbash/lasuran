<template>
  <Container>

    <div v-if="!homeStore?.isLoading" class="flex flex-row-reverse flex-wrap w-full gap-[24px]">

      <div class="w-full lg:w-[calc(50%-12px)]">
        <BaseCard>
          <template #default>
            <BaseSlider :items="slider?.items ?? homeStore?.homeData?.data?.sliders" dots :slide-per-row="1"
              :slide-per-row-mobile="1" dots-class="dots-style">
              <template #default="{ item }">
                <div class=" w-full">
                  <div class=" w-full overflow-hidden relative rounded-[23px] md:mt-[31px]">
                    <img class="mx-auto h-auto md:h-full w-full object-contain md:object-cover inset-0 relative"
                      :src="item.image_url ?? item.image" />
                  </div>
                </div>
              </template>
            </BaseSlider>
          </template>

        </BaseCard>
      </div>

      <div class="w-full lg:w-[calc(50%-12px)]">

        <!--              {{ widgetComponents }}-->
        <BaseCard v-for="(widget, index) in widgetComponents" :title="widget.title" with-action
          class=" mt-[30px] first:mt-0" @action-click="navigateToServices">
          <template #default>
            <BaseSlider v-if="widget.items_per_slide == 3" :items="widget.items" :slide-per-row="3"
              :slide-per-row-mobile="2">
              <template #default="{ item }">
                <div class="bg-[#EBE4DF] rounded-[23px] overflow-hidden " @click="showService(item)">
                  <div class="rounded-[23px] overflow-hidden">
                    <img class="h-[118px] w-full object-cover" :src="item.image_url ?? '/assets/img/imgg2.png'" />
                  </div>
                  <div class="px-[10px] pt-[10px] pb-[18px]">
                    <h2 class="text-[#A0566E] text-[14px] font-[350] leading-normal">{{ item.title
                    }}</h2>
                    <h3 class="text-[#A0566E] text-[12px] font-normal leading-normal tracking-[-0.241px]">
                      <span class="sar-icon">&#xe900;</span> {{ item.price }}
                    </h3>
                  </div>
                </div>

              </template>
            </BaseSlider>
            <BaseSlider v-else :items="widget.items" :slide-per-row="4" :slide-per-row-mobile="3">
              <template #default="{ item }">
                <div class="rounded-[23px] overflow-hidden relative " @click="showService(item)">
                  <div class=" h-[140px] rounded-[23px] overflow-hidden">
                    <img class=" h-full w-full object-cover" :src="item.image_url ?? '/assets/img/imgg2.png'" />
                    <div class="absolute inset-0 bg-[linear-gradient(to_bottom,_#1B1B1B00,_#615B59)]">
                    </div>

                  </div><a
                    class="text-[white] flex justify-between items-center w-full absolute bottom-0 start-0 after:content-['+'] after:text-[40px] px-[10px]"
                    href="#">
                    {{ item.title }}
                  </a>
                </div>

              </template>
            </BaseSlider>
          </template>

        </BaseCard>


      </div>


      <div class="w-full md:mt-[30px] slide-5">

        <!-- Service Branch Image Filters - Inlined -->
        <!-- Inline Filters Section -->
        <div class="space-y-[20px] mt-0px">
          <h2 class="font-normal text-[white] text-[15px] leading-[1] tracking-[0]">Categories</h2>
          <div>
            <SelectableSlider v-model="menuStore.menu_id" :items="Maincategories" notTransition="1"
              @update:modelValue="onChangeMenu('menu_id', $event)" class="main-category" />
          </div>

          <!-- <div class="flex flex-col md:flex-row justify-between md:items-center gap-[20px]"> -->
          <BaseCard with-action @action-click="navigateToServices">
            <template #default>
              <BaseSlider :items="subCategories" :slide-per-row="5" :slide-per-row-mobile="3" class="w-full">
                <template #default="{ item }">
                  <div>
                    <div class="overflow-hidden relative h-[142px] rounded-[23px] cursor-pointer"
                      @click="goToSubCategory(item)">
                      <div
                        class="absolute h-[105px] bottom-0 w-full rounded-[30px] bg-[linear-gradient(to_bottom,_#E8D5CC,_#E8BBAC)]">
                      </div>
                      <img class="mx-auto h-full object-cover inset-0 relative" :src="item.image" />
                    </div>
                    <h2 class="text-center text-white mt-3 font-medium text-lg cursor-pointer">{{ item.name }}</h2>
                  </div>
                </template>
              </BaseSlider>
            </template>
          </BaseCard>
          <!-- </div> -->
        </div>



        <!-- <ServiceBranchImageFilters  :showBranchSelect="false" class="mt-[40px]" /> -->

      </div>
    </div>

    <HomeSkeleton v-else />

  </Container>
</template>

<script lang="ts" setup>
// ====== Imports ======
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import Container from '~/components/base/Container.vue'
import HomeSkeleton from '@/components/skeletons/HomeSkeleton.vue'
import SelectableSlider from '~/components/base/SelectableSlider.vue'
import { useHome } from '@/stores/home'
import { useMenu } from '~/stores/menu'
import { useApp } from '~/stores/app'
import { COMPONENTS } from '~/data/constants'

// ====== Stores ======
const homeStore = useHome()
const menuStore = useMenu()
const appModule = useApp()

// ====== Router ======
const router = useRouter()

// ====== Keyboard Shortcuts (optional toggle state) ======
const open = ref(false)
defineShortcuts({
  o: () => open.value = !open.value
})

// ====== Computed: Home Page Sections ======
const homeSections = computed(() => homeStore?.settingsData?.data?.template_settings?.home ?? [])
const slider = computed(() => homeSections.value.find(el => el.type === 'slider'))
const widgetComponents = computed(() => homeSections.value.filter(el => el.type === 'widget'))

// ====== Computed: Menu Filters ======
const Maincategories = computed(() => menuStore.getMenus || [])
const subCategories = computed(() => menuStore.getSubCategories || [])
const branches = computed(() => menuStore.getBranches || [])

// ====== Filters State ======
const filters = ref({
  branch: null
})

// ====== Methods ======
const onChangeMenu = (key: string, _: any) => {
  if (key === 'menu_id') {
    menuStore.setDefaultCategory()
    menuStore.setDefaultSubCategory()
  }
  menuStore.fetchServices()
}

const navigateToServices = () => {
  navigateTo({ path: '/services' })
}

const showService = (item: any) => {
  appModule.setDialogShow(true)
  appModule.setDialogComponent(COMPONENTS.SERVICE_SHOW)
  menuStore.fetchService(item)
}

const goToSubCategory = (item: any) => {
  menuStore.sub_category_id = item.id
  router.push({ path: '/services' })
}

// ====== Lifecycle: Fetch Initial Data ======
onMounted(async () => {
  homeStore.initializeHome()
  menuStore.fetchMenus()

  if (!menuStore.menus.data || menuStore.menus.data.length === 0) {
    await menuStore.initMenu()
  } else {
    if (!menuStore.category_id) menuStore.setDefaultCategory()
    if (!menuStore.sub_category_id) menuStore.setDefaultSubCategory()

    const branchesData = branches.value
    if (branchesData && branchesData.length > 0 && !filters.value.branch) {
      filters.value.branch = branchesData[0].id
    }

    menuStore.fetchServices()
  }
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