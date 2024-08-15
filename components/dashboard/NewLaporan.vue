<template>
  <Dialog>
    <DialogTrigger as-child>
      <button
        id="addLaporanModalButton"
        class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        Import Laporan
      </button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Upload Laporan</DialogTitle>
        <DialogDescription>
          Upload file format *.csv, *.txt dengan ukuran maksimal 25MB.
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="uploadLaporan">
        <label for="laporan" class="block text-sm font-medium text-gray-900 dark:text-white">Pilih File Laporan</label>
        <input
          id="laporan"
          type="file"
          name="laporan"
          accept=".txt,.csv"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-4"
          required
          @change="validateFile"
        >

        <p v-if="errorMessage" class="my-2 text-sm text-red-500">
          {{ errorMessage }}
        </p>

        <DialogFooter class="sm:justify-start">
          <div class="flex gap-2">
            <button
              :disabled="isLoading"
              type="submit"
              class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {{ isLoading ? "Loading..." : "Upload" }}
            </button>
            <DialogClose as-child>
              <Button id="close-dialog" type="button" variant="secondary" class="hidden" :disabled="isLoading">
                Close
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { initFlowbite } from 'flowbite'
import { getQueryKey } from 'trpc-nuxt/client'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { parseCSV } from '@/utils/csvParser'
import { parseTXT } from '@/utils/txtParser'
const { $client } = useNuxtApp()

const queryKey = getQueryKey($client.akses.getAll)

const isLoading = ref(false)
const errorMessage = ref('')
const MAX_FILE_SIZE = 25 * 1024 * 1024 // 25MB

onMounted(() => {
  initFlowbite()
})

const validateFile = (event) => {
  const file = event.target.files[0]
  if (file && file.size > MAX_FILE_SIZE) {
    errorMessage.value = 'Ukuran file melebihi batas maksimal 2MB.'
    event.target.value = '' // Clear the input
  } else {
    errorMessage.value = ''
  }
}

const uploadLaporan = async (event) => {
  const file = event.target.laporan.files[0]
  if (!file) {
    errorMessage.value = 'Silahkan pilih file laporan terlebih dahulu.'
    return
  }

  isLoading.value = true

  try {
    let laporanData

    // Menentukan parser berdasarkan jenis file
    if (file.name.endsWith('.csv')) {
      laporanData = await parseCSV(file)
    } else if (file.name.endsWith('.txt')) {
      laporanData = await parseTXT(file)
    } else {
      throw new Error('Format file tidak didukung. Hanya file CSV dan TXT yang diizinkan.')
    }

    // Menggunakan fungsi createMany untuk bulk insert
    await $client.reporting.createMany.mutate(laporanData)
    await refreshNuxtData(queryKey)
    document.getElementById('close-dialog').click()
    errorMessage.value = ''
    initFlowbite()
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
    errorMessage.value = ''
  }
}
</script>
