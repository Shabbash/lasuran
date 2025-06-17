<template>

  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path
      d="M8.75 9.99976V7.81643C8.75 5.19143 10.8617 2.6131 13.4867 2.3681C16.6133 2.06477 19.25 4.52643 19.25 7.59477V8.49976"
      stroke="#EBE4DF" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
    <path
      d="M10.4998 25.6666H17.4998C22.1898 25.6666 23.0298 23.7883 23.2748 21.5016L24.1498 14.5016C24.4648 11.6549 23.4812 10.5 18.4995 10.5H9C4.01833 10.5 3.53481 11.6549 3.84981 14.5016L4.72481 21.5016C4.96981 23.7883 5.80981 25.6666 10.4998 25.6666Z"
      stroke="#EBE4DF" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>



<script setup>
const props = defineProps({
  color: {
    type: String,
    default: '#A0576F'
  }
});
</script>