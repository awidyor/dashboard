<template>
  <div>
    <NuxtLink to="/api/login" external>
      Sign in
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
// will redirect successfully with the 'external' parameter set to 'true'
definePageMeta({
  middleware: [
    function (to) {
      if (to.path === '/') {
        return navigateTo('/api/login', { external: true })
      }
    }
  ]
})
</script>
