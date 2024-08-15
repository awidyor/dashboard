<template>
  <div>
    <NuxtLayout>
      <h1 class="mb-4 text-2xl font-semibold tracking-tight scroll-m-20">
        Kelola User
      </h1>

      <DashboardNewUser />

      <DashboardKelolaUserDataTable :columns="columns" :data="data" />
    </NuxtLayout>
  </div>
</template>

<script setup type="ts">
import { initFlowbite } from 'flowbite'
import { columns } from '@/components/dashboard/kelola-user/columns'
const { $client } = useNuxtApp()

const { data } = await $client.user.getAll.useQuery()

// initialize components based on data attribute selectors
onMounted(() => {
  initFlowbite()
})

useHead({
  title: 'Dashboard | Kelola User'
})

definePageMeta({
  middleware: ['auth-logged-in']
})
</script>
