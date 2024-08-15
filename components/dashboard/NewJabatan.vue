<template>
  <Dialog>
    <DialogTrigger as-child>
      <button id="addJabatanModalButton" class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
        Tambah Jabatan
      </button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Form Tambah Jabatan</DialogTitle>
        <DialogDescription>
          Form untuk menambahkan jabatan baru.
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="addJabatan">
        <label for="nama" class="block text-sm font-medium text-gray-900 dark:text-white">Nama</label>
        <input
          id="nama"
          type="text"
          name="nama"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-4"
          placeholder="Tulis nama jabatan"
          required
        >

        <p v-if="errorMessage" class="my-2 text-sm text-red-500">
          {{ errorMessage }}
        </p>

        <DialogFooter class="sm:justify-start">
          <div class="flex gap-2">
            <button :disabled="isLoading" type="submit" class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              <PlusIcon class="w-6 h-6 mr-1 -ml-1" />
              Simpan
            </button>
            <DialogClose as-child>
              <Button id="close-dialog" type="button" variant="secondary" class="hidden">
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
import { getQueryKey } from 'trpc-nuxt/client'
import { initFlowbite } from 'flowbite'
import { PlusIcon } from '@heroicons/vue/24/solid'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger
} from '@/components/ui/dialog'

const { $client } = useNuxtApp()
const previousJabatan = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

const queryKey = getQueryKey($client.jabatan.getAll)

// Access to the cached value of useQuery
const { data: jabatans } = useNuxtData(queryKey)

// initialize components based on data attribute selectors
onMounted(() => {
  initFlowbite()
})

const addJabatan = async (payload) => {
  // Form validation
  if (!payload.target.nama.value) {
    errorMessage.value = 'Please enter a job position.'
    return
  }

  isLoading.value = true

  // Store the previously cached value to restore if mutation fails.
  previousJabatan.value = jabatans.value

  // Optimistically update the cache
  jabatans.value.push({
    id: jabatans.value.length + 1,
    nama: payload.target.nama.value
  })

  try {
    await $client.jabatan.create.mutate({
      nama: payload.target.nama.value
    })
    await refreshNuxtData(queryKey)
    document.getElementById('close-dialog').click()
    errorMessage.value = ''
    initFlowbite()
  } catch (error) {
    // Restore the cached value
    jabatans.value = previousJabatan.value
    errorMessage.value = 'Gagal menambahkan jabatan. Silahkan coba lagi.'
  } finally {
    payload.target.nama.value = ''
    isLoading.value = false
    errorMessage.value = ''
  }
}
</script>
