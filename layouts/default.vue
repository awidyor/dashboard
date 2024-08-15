<template>
  <div>
    <div class="antialiased bg-gray-50 dark:bg-gray-900">
      <TopbarDashboard :name="$auth.user.name" :email="$auth.user.email" />

      <SidebarDashboard />

      <main class="min-h-screen p-4 pt-20 pb-10 md:ml-64">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { initFlowbite } from 'flowbite'

// initialize components based on data attribute selectors
onMounted(() => {
  initFlowbite()
})
</script>
