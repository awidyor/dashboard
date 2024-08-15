<template>
  <nav class="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50">
    <div class="flex flex-wrap items-center justify-between">
      <div class="flex items-center justify-start">
        <button
          data-drawer-target="drawer-navigation"
          data-drawer-toggle="drawer-navigation"
          aria-controls="drawer-navigation"
          class="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer md:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <Bars3Icon class="w-6 h-6" />
          <span class="sr-only">Toggle sidebar</span>
        </button>
        <NuxtLink to="/dashboard" class="flex items-center justify-between mr-4">
          <!-- <img
            src="~/assets/images/logoasdp.png"
            class="h-8 mr-3"
            alt="ASDP Logo"
          > -->
          <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Dashboard Laporan</span>
        </NuxtLink>
      </div>
      <div class="flex items-center lg:order-2">
        <button
          id="user-menu-button"
          type="button"
          class="flex mx-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
          aria-expanded="false"
          data-dropdown-toggle="dropdown"
        >
          <span class="sr-only">Open user menu</span>
          <img
            class="w-8 h-8 rounded-full"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gough.png"
            alt="user photo"
          >
        </button>
        <!-- Dropdown menu -->
        <div
          id="dropdown"
          class="z-50 hidden w-56 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600 rounded-xl"
        >
          <div class="px-4 py-3">
            <span
              class="block text-sm font-semibold text-gray-900 dark:text-white"
            />
            {{ name }}
            <span
              class="block text-sm text-gray-900 truncate dark:text-white"
            >
              {{ email }}
            </span>
          </div>
          <ul
            class="py-1 text-gray-700 dark:text-gray-300"
            aria-labelledby="dropdown"
          >
            <li>
              <NuxtLink
                to="/api/logout"
                class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                external
              >
                Sign out
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { initFlowbite } from 'flowbite'
import { Bars3Icon } from '@heroicons/vue/24/solid'

// initialize components based on data attribute selectors
onMounted(() => {
  initFlowbite()
})

defineProps<{
  name: string
  email: string
}>()
</script>
