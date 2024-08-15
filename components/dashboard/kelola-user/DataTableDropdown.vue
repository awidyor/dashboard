<script setup>
import { MoreHorizontal } from 'lucide-vue-next'
import { getQueryKey } from 'trpc-nuxt/client'
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
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

const queryKey = getQueryKey($client.user.getAll)
const { data: users } = useNuxtData(queryKey)
const { data: jabatans } = await $client.jabatan.getAll.useQuery()

const jabatanOptions = computed(() => {
  return jabatans.value.map((jabatan) => {
    return {
      value: jabatan.id,
      text: jabatan.nama
    }
  })
})

const errorMessage = ref('')

const updateUser = async (id, payload) => {
  if (!payload.target.fingerPrintId.value && !payload.target.tapCardId.value && !payload.target.faceId.value) {
    errorMessage.value = 'Mohon isi setidaknya salah satu ID (sidik jari, tap card, atau face ID)'
    return
  }

  // Store the previously cached value to restore if mutation fails.
  previousUser.value = users.value

  // Optimistically update the cache
  users.value = users.value.map((d) => {
    if (d.id === id) {
      return {
        ...d,
        fingerPrintId: payload.target.fingerPrintId.value,
        tapCardId: payload.target.tapCardId.value,
        faceId: payload.target.faceId.value,
        nama: payload.target.nama.value,
        jabatanId: payload.target.jabatanId.value,
        jenisKelamin: payload.target.jenisKelamin.value
      }
    }
    return d
  })

  errorMessage.value = ''

  try {
    await $client.user.update.mutate({
      id,
      fingerPrintId: payload.target.fingerPrintId.value,
      tapCardId: payload.target.tapCardId.value,
      faceId: payload.target.faceId.value,
      nama: payload.target.nama.value,
      jabatanId: payload.target.jabatanId.value,
      jenisKelamin: payload.target.jenisKelamin.value
    })
    document.getElementById('close-dialog').click()
    await refreshNuxtData(queryKey)
  } catch (error) {
    // Restore the cached value
    users.value = previousUser.value
  } finally {
    payload.target.fingerPrintId.value = ''
    payload.target.tapCardId.value = ''
    payload.target.faceId.value = ''
    payload.target.nama.value = ''
    payload.target.jabatanId.value = ''
    payload.target.jenisKelamin.value = ''
    errorMessage.value = ''
  }
}

const deleteUser = async (id) => {
  // Store the previously cached value to restore if mutation fails.
  previousUser.value = users.value

  // Optimistically update the cache
  users.value.filter(d => d.id !== id)

  try {
    await $client.user.delete.mutate({
      id
    })
    await refreshNuxtData(queryKey)
  } catch (error) {
    // Restore the cached value
    users.value = previousUser.value
  }
}

defineProps({
  user: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="w-8 h-8 p-0">
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <Dialog :key="`${user.id}-editModal`">
        <DialogTrigger class="relative flex cursor-pointer hover:bg-accent select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full">
          Edit
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Form Edit User</DialogTitle>
            <DialogDescription>
              Edit data user atas nama <span class="font-bold">{{ user.nama }}</span>.
            </DialogDescription>
          </DialogHeader>

          <form @submit.prevent="updateUser(user.id, $event)">
            <div class="flex flex-row gap-2">
              <div class="flex-1">
                <label for="fingerPrintId" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ID Sidik Jari</label>
                <input
                  id="fingerPrintId"
                  type="text"
                  name="fingerPrintId"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-4"
                  placeholder="Tulis ID sidik jari user"
                  :value="user.fingerPrintId"
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
                  :value="user.tapCardId"
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
              :value="user.faceId"
            >

            <label for="nama" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nama</label>
            <input
              id="nama"
              type="text"
              name="nama"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-4"
              placeholder="Tulis nama user"
              :value="user.nama"
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
                  <option v-for="(jab, jindex) in jabatanOptions" :key="jindex" :value="jab.value" :selected="user.jabatanId === jab.value">
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
                  <option value="L" :selected="user.jenisKelamin == 'L'">
                    Laki-Laki
                  </option>
                  <option value="P" :selected="user.jenisKelamin == 'P'">
                    Perempuan
                  </option>
                </select>
              </div>
            </div>

            <DialogFooter class="sm:justify-start">
              <div class="flex gap-2">
                <button type="submit" class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Perbarui
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
      <Dialog :key="`${user.id}-deleteModal`">
        <DialogTrigger class="relative flex cursor-pointer hover:bg-accent select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full">
          Delete
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus User</DialogTitle>
            <DialogDescription>
              Apakah kamu yakin ingin menghapus user dengan nama <span class="font-bold">{{ user.nama }}</span>?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter class="flex gap-2">
            <DialogClose as-child>
              <Button type="button" variant="secondary">
                Batal
              </Button>
            </DialogClose>
            <Button type="button" variant="destructive" @click="deleteUser(user.id)">
              Iya, Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
