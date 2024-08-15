<template>
  <Dialog>
    <DialogTrigger as-child>
      <button id="addUserModalButton" class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
        Tambah User
      </button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Form Tambah User</DialogTitle>
        <DialogDescription>
          Form untuk menambahkan user baru.
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="addUser">
        <div class="flex flex-row gap-2">
          <div class="flex-1">
            <label for="fingerPrintId" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ID Sidik Jari</label>
            <input
              id="fingerPrintId"
              type="text"
              name="fingerPrintId"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-4"
              placeholder="Tulis ID sidik jari user"
            >
          </div>

          <div class="flex-1">
            <label for="tapCardId" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tap Card ID</label>
            <input
              id="tapCardId"
              type="text"
              name="tapCardId"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-4"
              placeholder="Tulis tap card ID user"
            >
          </div>
        </div>

        <label for="faceId" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Face ID</label>
        <input
          id="faceId"
          type="text"
          name="faceId"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-4"
          placeholder="Tulis face ID user"
        >

        <label for="nama" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nama</label>
        <input
          id="nama"
          type="text"
          name="nama"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-4"
          placeholder="Tulis nama user"
          required
        >

        <div class="flex flex-row gap-2">
          <div class="flex-1">
            <label for="jabatanId" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Jabatan</label>
            <select
              id="jabatanId"
              name="jabatanId"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-4"
              required
            >
              <option value="" selected>
                Pilih Jabatan
              </option>
              <option v-for="(jab, index) in jabatanOptions" :key="index" :value="jab.value">
                {{ jab.text }}
              </option>
            </select>
          </div>

          <div class="flex-1">
            <label for="jenisKelamin" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Jenis Kelamin</label>
            <select
              id="jenisKelamin"
              name="jenisKelamin"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-4"
              required
            >
              <option value="" selected>
                Pilih Jenis Kelamin
              </option>
              <option value="L">
                Laki-Laki
              </option>
              <option value="P">
                Perempuan
              </option>
            </select>
          </div>
        </div>

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
          <p v-if="errorMessage" class="mt-2 text-sm text-red-500">
            {{ errorMessage }}
          </p>
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

const previousUser = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

const queryKey = getQueryKey($client.user.getAll)

const { data: jabatans } = await $client.jabatan.getAll.useQuery()
// Access to the cached value of useQuery
const { data: users } = useNuxtData(queryKey)

// initialize components based on data attribute selectors
onMounted(() => {
  initFlowbite()
})

const addUser = async (payload) => {
  if (!payload.target.fingerPrintId.value && !payload.target.tapCardId.value && !payload.target.faceId.value) {
    errorMessage.value = 'Mohon isi setidaknya salah satu ID (sidik jari, tap card, atau face ID)'
    return
  }

  isLoading.value = true

  previousUser.value = users.value

  users.value.push({
    id: users.value.length + 1,
    fingerPrintId: payload.target.fingerPrintId.value === '' ? null : payload.target.tapCardId.value,
    tapCardId: payload.target.tapCardId.value === '' ? null : payload.target.tapCardId.value,
    faceId: payload.target.faceId.value === '' ? null : payload.target.tapCardId.value,
    nama: payload.target.nama.value,
    jabatanId: payload.target.jabatanId.value,
    jenisKelamin: payload.target.jenisKelamin.value
  })

  try {
    await $client.user.create.mutate({
      fingerPrintId: payload.target.fingerPrintId.value,
      tapCardId: payload.target.tapCardId.value,
      faceId: payload.target.faceId.value,
      nama: payload.target.nama.value,
      jabatanId: payload.target.jabatanId.value,
      jenisKelamin: payload.target.jenisKelamin.value
    })
    await refreshNuxtData(queryKey)
    document.getElementById('close-dialog').click()
    errorMessage.value = ''
    initFlowbite()
  } catch (error) {
    errorMessage.value = error.message
    users.value = previousUser.value
  } finally {
    payload.target.fingerPrintId.value = ''
    payload.target.tapCardId.value = ''
    payload.target.faceId.value = ''
    payload.target.nama.value = ''
    payload.target.jabatanId.value = ''
    payload.target.jenisKelamin.value = ''
    isLoading.value = false
  }
}

const jabatanOptions = computed(() => {
  return jabatans.value.map((jabatan) => {
    return {
      value: jabatan.id,
      text: jabatan.nama
    }
  })
})
</script>
