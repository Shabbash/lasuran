<template>
  <h1>Product Details</h1>

  <div v-if="loading">Loading...</div>
  <div v-else>
    <h2>{{ product.data.name }}</h2>
    <p>{{ product.data.description }}</p>
  </div>


</template>

<script setup lang="ts">
// Imports
import { useApi } from '~/composables/useApi'
import { useRoute } from 'vue-router'
import { ref } from 'vue'
const route = useRoute()
const productId = route.params.id
const { data: product, pending: loading } = useApi(
`products/${productId}`,
  {
    method: 'GET',
  }

)

</script>
