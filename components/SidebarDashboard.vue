<template>
  <aside
    id="drawer-navigation"
    class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full bg-white border-r border-gray-200 pt-14 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
    aria-label="Sidenav"
  >
    <div class="h-full px-3 py-5 overflow-y-auto bg-white dark:bg-gray-800">
      <ul class="space-y-2">
        <SidebarLink to="/dashboard" label="Overview">
          <template #icon>
            <ChartPieIcon :class="iconClasses('/dashboard')" />
          </template>
        </SidebarLink>
        <SidebarLink to="/dashboard/kelola-jabatan" label="Kelola Jabatan">
          <template #icon>
            <ChartBarIcon :class="iconClasses('/dashboard/kelola-jabatan')" />
          </template>
        </SidebarLink>
        <SidebarLink to="/dashboard/kelola-user" label="Kelola User">
          <template #icon>
            <UsersIcon :class="iconClasses('/dashboard/kelola-user')" />
          </template>
        </SidebarLink>
        <SidebarLink to="/dashboard/laporan" label="Laporan">
          <template #icon>
            <DocumentIcon :class="iconClasses('/dashboard/laporan')" />
          </template>
        </SidebarLink>
      </ul>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { initFlowbite } from 'flowbite'
import { ChartPieIcon, ChartBarIcon, UsersIcon, DocumentIcon } from '@heroicons/vue/24/solid'

// initialize components based on data attribute selectors
onMounted(() => {
  initFlowbite()
})

const route = useRoute()
const iconClasses = (path: string) => {
  return route.path === path
    ? 'w-6 h-6 text-gray-900 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
    : 'w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
}
</script>
