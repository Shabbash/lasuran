<template>

  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
    <g clip-path="url(#clip0_4460_13221)">
      <path
        d="M8.10231 14.4703C8.59092 14.4703 9.03473 14.2242 9.28963 13.812C11.0757 10.9235 13.2046 7.11666 13.2046 5.38442C13.2046 2.60337 10.9158 0.34082 8.10231 0.34082C5.28887 0.34082 3 2.60337 3 5.38442C3 7.11666 5.129 10.9235 6.91499 13.812C7.16989 14.2242 7.61374 14.4703 8.10231 14.4703ZM6.05147 5.03812C6.05147 3.92034 6.97149 3.01094 8.10231 3.01094C9.23313 3.01094 10.1532 3.92034 10.1532 5.03812C10.1532 6.15594 9.23313 7.06534 8.10231 7.06534C6.97149 7.06534 6.05147 6.15597 6.05147 5.03812Z"
        fill="#6B8B9B" />
    </g>
    <defs>
      <clipPath id="clip0_4460_13221">
        <rect width="16" height="16" fill="white" transform="translate(0 0.34082)" />
      </clipPath>
    </defs>
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