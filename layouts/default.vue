<template >
   <div class="bg-[#A0576F] bg-decore" >
    <LayoutHeader></LayoutHeader>
    <div class="min-h-[calc(100vh-222px)] relative">
    <slot> </slot>
   </div>
    <LayoutFooter></LayoutFooter>

    <BaseDialog v-model:show="isDialogDisplayed" :options="appModule.getDialogOptions" >
      <template #body>
        <component :is="appModule.getDialogComponent" />
      </template>
    </BaseDialog>
   </div>

</template>
<script lang="ts" setup>
const appModule = useApp();

const isDialogDisplayed = computed({
   set:(newValue) => appModule.setDialogShow(newValue),
   get:() => appModule.dialog.show
});
</script>


<style>
</style>