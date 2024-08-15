<template>
  <div class="rounded-xl border bg-white text-card-foreground shadow">
    <div class="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
      <h3 class="tracking-tight text-sm font-medium">
        {{ title }}
      </h3>
      <slot name="icon" />
    </div>
    <div class="p-6 pt-0">
      <div class="text-2xl font-bold">
        {{ value }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: String,
  value: Number
}>()
</script>
