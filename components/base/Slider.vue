<template>

  <UCarousel v-slot="{ item }" :dots="dots" :items="items" class="w-full" :ui="uiOptions">
    <slot :item="item"></slot>
  </UCarousel>


</template>


<script setup lang="ts">
const props = defineProps({
  items: {
    type: Array,
    default: []
  },
  dots: {
    type: Boolean,
    default: false,
  },
  dotsClass: {
    type: String,
    default: 'dots'
  },
  slidePerRow: {
    type: Number,
    default: 5
  },
  slidePerRowMobile: {
    type: Number,
    default: 1
  }
});

const uiOptions = computed(() => {
  const isOneMobile = props.slidePerRowMobile === 1;
  const isOneDesktop = props.slidePerRow === 1;

  let options: any = {
    item: `${isOneMobile ? 'basis-full w-full max-w-full' : `basis-1/${props.slidePerRowMobile} w-1/${props.slidePerRowMobile} max-w-[${100 / props.slidePerRowMobile}%]`} md:${isOneDesktop ? 'basis-full w-full max-w-full' : `md:basis-1/${props.slidePerRow} md:w-1/${props.slidePerRow} md:max-w-[${100 / props.slidePerRow}%]`}`
  };

  if (props.dots) options.dots = `${props.dotsClass}`;
  return options;
});

</script>


<style>

.base_card--body .w-1\/2 {
  width: 50%;
  max-width: 50%;
}

.base_card--body .w-1\/3 {
  width: 33.3333333%;
  max-width: 33.3333333%;
}

.base_card--body .w-1\/4 {
  width: 25%;
  max-width: 25%;
}

.base_card--body .w-1\/5 {
  width: 20%;
  max-width: 20%;
}

.base_card--body .w-1\/6 {
  width: 16.66666666666667%;
  max-width: 16.66666666666667%;
}


@media (min-width: 768px) {
  .slide-5 .base_card--body .w-1\/3 {
    width: 20%;
    max-width: 20%;
  }

    .slide-6 .base_card--body .w-1\/2 {
      width: 16.66666666666667%;
      max-width: 16.66666666666667%;
  }


}
</style>