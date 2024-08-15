<template>
  <NuxtLink
    :to="to"
    :class="linkClasses"
  >
    <slot name="icon" />
    <span class="ml-3">{{ label }}</span>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps<{
  to: String,
  label: String
}>()

const route = useRoute()

const linkClasses = computed(() => {
  return route.path === props.to
    ? 'flex items-center p-2 text-base font-medium bg-gray-100 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
    : 'flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
})
</script>
