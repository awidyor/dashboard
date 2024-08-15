<template>
  <div>
    <NuxtLayout>
      <h1 class="mb-4 text-2xl font-semibold tracking-tight scroll-m-20">
        Laporan
      </h1>

      <div class="flex flex-wrap gap-2">
        <form class="flex items-center gap-x-2" @submit.prevent="filterDataTable">
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
            <option v-for="year in listYear" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
          <button type="submit" class="px-5 py-2.5 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
            Filter
          </button>
        </form>
        <button
          type="submit"
          class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          @click="exportDataToPdf"
        >
          Export PDF
        </button>
        <ClientOnly>
          <template #fallback>
            <button class="text-white inline-flex items-center bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800 hover:cursor-pointer" disabled>
              Memuat...
            </button>
          </template>
          <download-excel
            :data="dataForExcel"
            class="text-white inline-flex items-center bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800 hover:cursor-pointer"
            @click="exportDataToExcel"
          >
            Export Excel
          </download-excel>
        </ClientOnly>
        <button
            type="submit"
            class="text-white inline-flex items-center bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800"
            @click="printData"
        >
          Print Laporan
        </button>
        <DashboardNewLaporan />
      </div>
      <DashboardLaporanDataTable :key="dataTable" :columns="columns" :data="dataTable" />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import JsonExcel from 'vue-json-excel3'
import { watchEffect, reactive } from 'vue'
import { columns } from '@/components/dashboard/laporan/columns'

const { $client } = useNuxtApp()

const downloadExcel = JsonExcel

useHead({
  title: 'Dashboard | Laporan'
})

definePageMeta({
  middleware: ['auth-logged-in']
})

const monthFilter = ref(undefined)
const yearFilter = ref(undefined)

const data = ref(null)
let dataTable = reactive({})
const listYear = ref(null)

watchEffect(async () => {
  const { data: dataFiltered } = await $client.reporting.getAll.useQuery({
    monthFilter: monthFilter.value,
    yearFilter: yearFilter.value
  })

  if (dataFiltered.value) {
    data.value = dataFiltered
  }
})

watchEffect(() => {
  if (data.value) {
    dataTable = data.value.value.records
    listYear.value = data.value.value.listYear
  }
})

const filterDataTable = (payload) => {
  monthFilter.value = payload.target.month.value !== 'Pilih Bulan' ? payload.target.month.value : undefined
  yearFilter.value = payload.target.year.value !== 'Pilih Tahun' ? payload.target.year.value : undefined
}

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

const dataForExcel = []
const exportDataToExcel = () => {
  if (dataTable) {
    dataTable.forEach((d) => {
      const dataRow = {
        Nama: d.user.nama,
        Jabatan: d.user.jabatan.nama,
        'Jenis Kelamin': d.user.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan',
        'Tempat Masuk': d.tempatMasuk,
        'Metode Masuk': d.metodeMasuk,
        'Metode Keluar': d.metodeKeluar ?? '-',
        'Waktu Masuk': new Date(d.waktuMasuk).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        }),
        'Waktu Keluar': d.waktuKeluar
          ? new Date(d.waktuKeluar).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
          })
          : '-'
      }
      dataForExcel.push(dataRow)
    })
  }
}

const exportDataToPdf = () => {
  // eslint-disable-next-line new-cap
  const doc = new jsPDF()
  const tableColumn = [
    'Nama',
    'Jabatan',
    'Jenis Kelamin',
    'Tempat Masuk',
    'Metode Masuk',
    'Metode Keluar',
    'Waktu Masuk',
    'Waktu Keluar'
  ]
  const tableRows = []

  if (dataTable) {
    dataTable.forEach((d) => {
      const dataRow = [
        d.user.nama,
        d.user.jabatan.nama,
        d.user.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan',
        d.tempatMasuk,
        d.metodeMasuk,
        d.metodeKeluar ?? '-',
        new Date(d.waktuMasuk).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        }),
        d.waktuKeluar
          ? new Date(d.waktuKeluar).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
          })
          : '-'
      ]
      tableRows.push(dataRow)
    })
  }

  doc.autoTable(tableColumn, tableRows, { startY: 20 })

  const date = Date().split(' ')
  const dateStr = date[0] + date[1] + date[2] + date[3] + date[4]
  doc.text('Laporan Riwayat Akses', 14, 15)
  doc.save(`report_${dateStr}.pdf`)
}

const printData = () => {
  const tableRows = []

  if (dataTable) {
    dataTable.forEach((d) => {
      const dataRow = [
        d.user.nama,
        d.user.jabatan.nama,
        d.user.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan',
        d.tempatMasuk,
        d.metodeMasuk,
        d.metodeKeluar ?? '-',
        new Date(d.waktuMasuk).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        }),
        d.waktuKeluar
          ? new Date(d.waktuKeluar).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
          })
          : '-'
      ]
      tableRows.push(dataRow)
    })
  }

  const myWindow = window.open('', '', 'width=800,height=600')
  myWindow.document.write(`
    <html>
      <head>
        <title>Laporan Kehadiran</title>
        <style>
          table {
            border-collapse: collapse;
            width: 100%;
            border: 1px solid black;
          }
          th, td {
            text-align: left;
            padding: 8px;
            border: 1px solid black;
          }
          tr:nth-child(even) {background-color: #f2f2f2;}
        </style>
      </head>
      <body>
        <h1>Laporan Riwayat Akses</h1>
        <table>
          <thead>
            <tr>
              <th>Nama</th>
              <th>Jabatan</th>
              <th>Jenis Kelamin</th>
              <th>Tempat Masuk</th>
              <th>Metode Masuk</th>
              <th>Metode Keluar</th>
              <th>Waktu Masuk</th>
              <th>Waktu Keluar</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows
              .map((row) => {
                return `
                <tr>
                  <td>${row[0]}</td>
                  <td>${row[1]}</td>
                  <td>${row[2]}</td>
                  <td>${row[3]}</td>
                  <td>${row[4]}</td>
                  <td>${row[5]}</td>
                  <td>${row[6]}</td>
                  <td>${row[7]}</td>
                </tr>
              `
              })
              .join('')}
          </tbody>
        </table>
      </body>
    </html>
  `)
  myWindow.document.close()
  myWindow.focus()
  myWindow.print()
  myWindow.close()
}
</script>
