<template>
  <UCarousel v-slot="{ item }" :items="items" :ui="{
    container: 'ms-0 gap-[14px]',
    item: 'basis-auto ps-0 category-box',
  }">
    <slot :item="item">
      <UBadge @click="selectItem(item)"
        :class="{ 'font-medium rounded-full bg-[#E6CDC7A3] text-[#A0576F] px-[19px] py-[14px] cursor-pointer': true, 'active text-[#EBE4DF] bg-[#A0576F]': (getItem(item, 'value') == selectedValue) }">
        {{ getItem(item) }}
      </UBadge>
    </slot>
  </UCarousel>
</template>

<script lang="ts" setup>
const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  valueKey: {
    type: String,
    default: 'id'
  },
  labelKey: {
    type: String,
    default: 'name'
  }
});

const selectedValue = defineModel();

const getItem = function (item: {}, attribute = 'label') {
  if (attribute === 'label') return item[props.labelKey];
  return item[props.valueKey];
}

const selectItem = function (item: any) {
  selectedValue.value = item[props.valueKey];
}
</script>


<style scoped>
/* .active {
  background-color: red;
} */


.main-category {}

.main-category .category-box {}

.main-category .category-box span {
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  height: 50px;
  padding: 0 25px;
  border:1px solid var(--Soft-Wave, #BBCACF);
  color: var(--Soft-Wave, #BBCACF);
  background-color: transparent;
}


.main-category .category-box span.active {
  background: var(--Canada-Goose-Eggs, #EBE4DF);
  border-color: var(--Canada-Goose-Eggs, #EBE4DF);
  color: var(--Floral, #A0576F);

  
}




.sub-category {}

.sub-category .category-box {}

.sub-category .category-box span {
  font-size: 16px;
  font-style: normal;
  font-weight: 200;
  line-height: normal;
  height: 32px;
  padding: 0 16px;
  border: 0;
  color: var(--Soft-Wave, #2B2B2B);
  background: rgba(246, 246, 246, 0.30);
}

.sub-category .category-box span.active {

  color: var(--Floral, #A0576F);
  font-size: 16px;
  font-weight: 500;
  background: var(--Canada-Goose-Eggs, #EBE4DF);
  text-transform: capitalize;
}



</style>