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
      <Dialog :key="`${jabatan.id}-editModal`">
        <DialogTrigger class="relative flex cursor-pointer hover:bg-accent select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full">
          Edit
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Form Edit Jabatan</DialogTitle>
          </DialogHeader>

          <form @submit.prevent="updateJabatan(jabatan.id, $event)">
            <label for="nama" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nama</label>
            <input
              id="nama"
              type="text"
              name="nama"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-4"
              placeholder="Tulis nama jabatan"
              :value="jabatan.nama"
              required
            >

            <DialogFooter class="sm:justify-start">
              <div class="flex gap-2">
                <button :disabled="isLoading" type="submit" class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
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
      <Dialog :key="`${jabatan.id}-deleteModal`">
        <DialogTrigger class="relative flex cursor-pointer hover:bg-accent select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full">
          Delete
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Jabatan</DialogTitle>
            <DialogDescription>
              <span v-if="jabatan._count.user == 0">
                Apakah kamu yakin ingin menghapus jabatan <span class="font-bold">{{ jabatan.nama }}</span>?
              </span>
              <span v-else>
                Anda tidak dapat menghapus jabatan <span class="font-bold">{{ jabatan.nama }}</span> karena masih ada user yang memiliki jabatan tersebut.
              </span>
            </DialogDescription>
          </DialogHeader>

          <DialogClose as-child>
            <Button id="close-dialog" type="button" variant="secondary" class="hidden">
              Close
            </Button>
          </DialogClose>

          <DialogFooter class="flex gap-2">
            <Button type="button" variant="destructive" :disabled="jabatan._count.user != 0" @click="jabatan._count.user == 0 ? deleteJabatan(jabatan.id) : () => null">
              Iya, Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
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
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog'

defineProps<{
  jabatan: {
    id: string,
    nama: string,
    _count: { user: number }
  }
}>()

const { $client } = useNuxtApp()
const previousJabatan = ref([])

const queryKey = getQueryKey($client.jabatan.getAll)

// Access to the cached value of useQuery
const { data: jabatans } = useNuxtData(queryKey)

const updateJabatan = async (id, payload) => {
  // Store the previously cached value to restore if mutation fails.
  previousJabatan.value = jabatans.value

  // Optimistically update the cache
  jabatans.value = jabatans.value.map((d) => {
    if (d.id === id) {
      return {
        ...d,
        nama: payload.target.elements.nama.value
      }
    }
    return d
  })

  try {
    await $client.jabatan.update.mutate({
      id,
      nama: payload.target.elements.nama.value
    })
    document.getElementById('close-dialog').click()
    await refreshNuxtData(queryKey)
  } catch (error) {
    // Restore the cached value
    jabatans.value = previousJabatan.value
  }
}

const deleteJabatan = async (id) => {
  // Store the previously cached value to restore if mutation fails.
  previousJabatan.value = jabatans.value

  // Optimistically update the cache
  jabatans.value.filter(d => d.id !== id)

  try {
    await $client.jabatan.delete.mutate({
      id
    })
    document.getElementById('close-dialog').click()
    await refreshNuxtData(queryKey)
  } catch (error) {
    // Restore the cached value
    jabatans.value = previousJabatan.value
  }
}
</script>
