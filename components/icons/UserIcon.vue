<template>
  <svg :width="width" :height="height" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg"
    :class="[`w-[${width}px]`, `h-[${height}px]`]">
    <path fill-rule="evenodd" clip-rule="evenodd"
      d="M18.7245 8.3226C18.7245 11.3556 16.2657 13.8144 13.2327 13.8144C10.1996 13.8144 7.74088 11.3556 7.74088 8.3226C7.74088 5.28957 10.1996 2.83081 13.2327 2.83081C16.2657 2.83081 18.7245 5.28957 18.7245 8.3226ZM17.0769 8.3226C17.0769 10.4457 15.3558 12.1669 13.2327 12.1669C11.1095 12.1669 9.38841 10.4457 9.38841 8.3226C9.38841 6.19948 11.1095 4.47835 13.2327 4.47835C15.3558 4.47835 17.0769 6.19948 17.0769 8.3226Z"
      :fill="fill" :stroke="stroke" />
    <path fill-rule="evenodd" clip-rule="evenodd"
      d="M22.0195 19.8554C22.0195 22.5851 18.0855 24.798 13.2327 24.798C8.37981 24.798 4.4458 22.5851 4.4458 19.8554C4.4458 17.1256 8.37981 14.9128 13.2327 14.9128C18.0855 14.9128 22.0195 17.1256 22.0195 19.8554ZM20.372 19.8554C20.372 20.3607 19.9905 21.1537 18.6382 21.9144C17.3375 22.646 15.4297 23.1504 13.2327 23.1504C11.0356 23.1504 9.12781 22.646 7.82714 21.9144C6.47483 21.1537 6.09334 20.3607 6.09334 19.8554C6.09334 19.3501 6.47483 18.557 7.82714 17.7964C9.12781 17.0647 11.0356 16.5603 13.2327 16.5603C15.4297 16.5603 17.3375 17.0647 18.6382 17.7964C19.9905 18.557 20.372 19.3501 20.372 19.8554Z"
      :fill="fill" :stroke="stroke" />
  </svg>
</template>

<script setup>
const props = defineProps({
  fill: {
    type: String,
    default: 'currentColor',
  },
  stroke: {
    type: String,
    default: 'none',
  },
  width: {
    type: [String, Number],
    default: 27,
  },
  height: {
    type: [String, Number],
    default: 27,
  },
})

const fill = props.fill
const stroke = props.stroke
const width = props.width
const height = props.height
</script>
