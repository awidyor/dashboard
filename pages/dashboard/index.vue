<template>
  <div>
    <NuxtLayout>
      <h1 class="mb-4 text-2xl font-semibold tracking-tight scroll-m-20">
        Overview
      </h1>
      <div class="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCardOverview title="Total Jabatan" :value="statsData?.jabatan ?? 0">
          <template #icon>
            <ChartPieIcon class="w-4 h-4 text-muted-foreground" />
          </template>
        </DashboardCardOverview>
        <DashboardCardOverview title="Total User" :value="statsData?.user ?? 0">
          <template #icon>
            <ChartBarIcon class="w-4 h-4 text-muted-foreground" />
          </template>
        </DashboardCardOverview>
        <DashboardCardOverview title="Total Masuk" :value="statsData?.totalIn ?? 0">
          <template #icon>
            <ArrowDownTrayIcon class="w-4 h-4 text-muted-foreground" />
          </template>
        </DashboardCardOverview>
        <DashboardCardOverview title="Total Keluar" :value="statsData?.totalOut ?? 0">
          <template #icon>
            <ArrowUpTrayIcon class="w-4 h-4 text-muted-foreground" />
          </template>
        </DashboardCardOverview>
      </div>
      <div class="grid grid-cols-1 gap-4 mb-4 xl:grid-cols-2">
        <div class="flex flex-col gap-2">
          <h2 class="text-lg font-semibold">
            Chart Total Masuk Bulanan {{ currentYear }}
          </h2>
          <DashboardBarChartOverview
            :key="currentYear"
            chart-id="ChatBulanan"
            :options="chartOptions"
            :data="chartDataBulananMasuk"
          />
        </div>
        <div class="flex flex-col gap-2">
          <h2 class="text-lg font-semibold">
            Chart Total Keluar Bulanan {{ currentYear }}
          </h2>
          <DashboardBarChartOverview
            :key="currentYear"
            chart-id="ChatBulanan"
            :options="chartOptions"
            :data="chartDataBulananKeluar"
          />
        </div>
      </div>
      <div class="grid grid-cols-12">
        <div class="flex flex-col col-span-12 gap-2">
          <h2 class="text-lg font-semibold">
            Chart Mingguan {{ currentMonthWeekly }} {{ currentYearWeekly }}
          </h2>

          <form class="flex items-center gap-x-2" @submit.prevent="filterChartWeekly">
            <select id="month" name="month" class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 max-w-fit">
              <option selected>
                Pilih Bulan
              </option>
              <option v-for="month in listMonth" :key="month.value" :value="month.value">
                {{ month.label }}
              </option>
            </select>
            <select id="year" name="year" class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 max-w-fit">
              <option selected>
                Pilih Tahun
              </option>
              <option v-for="year in listYearWeekly" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
            <button type="submit" class="px-5 py-2.5 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 me-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
              Filter
            </button>
          </form>

          <DashboardPieChartOverview
            :key="chartDataMingguanReactive"
            chart-id="chartMingguan"
            :options="chartOptions"
            :data="chartDataMingguanReactive"
          />
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup>
import { ChartPieIcon, ChartBarIcon, ArrowDownTrayIcon, ArrowUpTrayIcon } from '@heroicons/vue/24/solid'
import { ref, watchEffect, reactive } from 'vue'

const { $client } = useNuxtApp()

const COLORS = {
  faceId: {
    background: 'rgba(255, 99, 132, 0.2)',
    border: 'rgba(255, 99, 132, 1)'
  },
  fingerprint: {
    background: 'rgba(54, 162, 235, 0.2)',
    border: 'rgba(54, 162, 235, 1)'
  },
  tapCard: {
    background: 'rgba(255, 206, 86, 0.2)',
    border: 'rgba(255, 206, 86, 1)'
  }
}

const generateBarChartData = (labels, datasets) => {
  return {
    labels,
    datasets: datasets.map((dataset) => {
      const key = dataset.label

      return {
        ...dataset,
        backgroundColor: COLORS[key].background,
        borderColor: COLORS[key].border,
        borderWidth: 1
      }
    })
  }
}

const generatePieChartData = (labels, datasets) => {
  return {
    labels,
    datasets: [{
      backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
      data: datasets
    }]
  }
}

let chartDataBulananMasuk = reactive({})
let chartDataBulananKeluar = reactive({})
const currentYear = ref(null)

let chartDataMingguanReactive = reactive({})
const currentMonthWeekly = ref(null)
const currentYearWeekly = ref(null)
const listYearWeekly = ref(null)

const filterMonth = ref(undefined)
const filterYear = ref(undefined)

const statsData = ref(null)

watchEffect(async () => {
  const { data } = await $client.stats.getAll.useQuery({
    filterMonth: filterMonth.value,
    filterYear: filterYear.value
  })

  if (data.value) {
    statsData.value = data.value
  }
})

watchEffect(() => {
  if (statsData.value && statsData.value.chartsMonthly) {
    currentYear.value = statsData.value.chartsMonthly.currentYear
    const chartDataMasuk = generateBarChartData(statsData.value.chartsMonthly.listMonthBefore, statsData.value.chartsMonthly.listDataMasuk ? statsData.value.chartsMonthly.listDataMasuk : [])
    const chartDataKeluar = generateBarChartData(statsData.value.chartsMonthly.listMonthBefore, statsData.value.chartsMonthly.listDataKeluar ? statsData.value.chartsMonthly.listDataKeluar : [])
    chartDataBulananMasuk = { ...chartDataMasuk }
    chartDataBulananKeluar = { ...chartDataKeluar }
  }

  if (statsData.value && statsData.value.chartsWeekly) {
    currentMonthWeekly.value = statsData.value.chartsWeekly.currentMonth
    currentYearWeekly.value = statsData.value.chartsWeekly.currentYearWeekly
    listYearWeekly.value = statsData.value.chartsWeekly.listYear
    const chartData = generatePieChartData(statsData.value.chartsWeekly.listWeekBefore, statsData.value.chartsWeekly.listData ? statsData.value.chartsWeekly.listData : [])
    chartDataMingguanReactive = { ...chartData }
  }
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      ticks: {
        stepSize: 1
      }
    }
  }
})

const listMonth = ref([
  { value: 0, label: 'Januari' },
  { value: 1, label: 'Februari' },
  { value: 2, label: 'Maret' },
  { value: 3, label: 'April' },
  { value: 4, label: 'Mei' },
  { value: 5, label: 'Juni' },
  { value: 6, label: 'Juli' },
  { value: 7, label: 'Agustus' },
  { value: 8, label: 'September' },
  { value: 9, label: 'Oktober' },
  { value: 10, label: 'November' },
  { value: 11, label: 'Desember' }
])

const filterChartWeekly = (payload) => {
  filterMonth.value = payload.target.month.value !== 'Pilih Bulan' ? payload.target.month.value : undefined
  filterYear.value = payload.target.year.value !== 'Pilih Tahun' ? payload.target.year.value : undefined
}

useHead({
  title: 'Dashboard'
})

definePageMeta({
  middleware: ['auth-logged-in']
})
</script>
