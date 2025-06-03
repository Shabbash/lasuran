<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="22" viewBox="0 0 24 22" fill="none">
    <rect x="2.25253" y="0.17041" width="19.8803" height="19.0077" rx="4.32182" fill="#6B8B9B" />
    <path
      d="M13.0501 6.25297L8.15967 11.0543C7.97122 11.2393 7.79219 11.6001 7.7545 11.8592L7.49066 13.6909C7.39643 14.357 7.86757 14.8195 8.54601 14.727L10.4117 14.468C10.6755 14.431 11.043 14.2552 11.2315 14.0702L16.1219 9.26884C16.9606 8.44548 17.3657 7.48337 16.1219 6.26222C14.8781 5.03182 13.8981 5.42037 13.0501 6.25297Z"
      stroke="white" stroke-width="1.29654" stroke-miterlimit="10" stroke-linecap="round"
      stroke-linejoin="round" />
    <path d="M12.353 6.9375C12.7676 8.38993 13.9266 9.53707 15.4154 9.94412" stroke="white"
      stroke-width="1.29654" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
  </svg>



</template>

<!-- :fill="props.color" -->

<script setup>
const props = defineProps({
    color: {
        type: String,
        default: '#A0576F'
    }
});
</script>