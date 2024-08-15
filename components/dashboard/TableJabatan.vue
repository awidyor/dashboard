<template>
  <!-- Start block -->
  <section class="w-full mt-4 antialiased bg-gray-50 dark:bg-gray-900">
    <!-- Start coding here -->
    <div class="relative bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase dark:text-gray-400">
            <tr class="border-b dark:border-gray-700">
              <th scope="col" class="px-4 py-4">
                Nama Jabatan
              </th>
              <th scope="col" class="px-4 py-3">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(d, index) in props.data" :key="index" class="border-b dark:border-gray-700">
              <td class="px-4 py-3">
                {{ d.nama }}
              </td>
              <td class="flex items-center justify-end px-4 py-3">
                <button :id="`${d.id}-button`" :data-dropdown-toggle="`${d.id}-dropdown`" class="inline-flex items-center text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 dark:hover-bg-gray-800 text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100" type="button">
                  <EllipsisHorizontalIcon class="w-5 h-5" />
                </button>
                <div :id="`${d.id}-dropdown`" class="z-10 hidden bg-white divide-y divide-gray-100 rounded shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                  <ul class="py-1 text-sm" :aria-labelledby="`${d.id}-button`">
                    <li>
                      <button type="button" :data-modal-target="`${d.id}-updateJabatanModal`" :data-modal-toggle="`${d.id}-updateJabatanModal`" class="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white dark:text-gray-200">
                        <PencilSquareIcon class="w-4 h-4 mr-2" />
                        Edit
                      </button>
                    </li>
                    <li>
                      <button type="button" :data-modal-target="`${d.id}-deleteModal`" :data-modal-toggle="`${d.id}-deleteModal`" class="flex items-center w-full px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red-400">
                        <TrashIcon class="w-4 h-4 mr-2" />
                        Delete
                      </button>
                    </li>
                  </ul>
                </div>
                <!-- Update modal -->
                <div :id="`${d.id}-updateJabatanModal`" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                  <div class="relative w-full max-w-2xl max-h-full p-4">
                    <!-- Modal content -->
                    <div class="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                      <!-- Modal header -->
                      <div class="flex items-center justify-between pb-4 mb-4 border-b rounded-t sm:mb-5 dark:border-gray-600">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                          Perbarui Jabatan
                        </h3>
                        <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" :data-modal-toggle="`${d.id}-updateJabatanModal`">
                          <XMarkIcon class="w-5 h-5" />
                          <span class="sr-only">Close modal</span>
                        </button>
                      </div>
                      <!-- Modal body -->
                      <form @submit.prevent="updateJabatan(d.id, $event)">
                        <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                        <input
                          id="name"
                          type="text"
                          name="nama"
                          :value="d.nama"
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Tulis nama jabatan"
                        >
                        <div class="flex items-center mt-4 space-x-4">
                          <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Perbarui Jabatan
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <!-- Delete modal -->
                <div :id="`${d.id}-deleteModal`" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                  <div class="relative w-full max-w-md max-h-full p-4">
                    <!-- Modal content -->
                    <div class="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                      <button type="button" class="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" :data-modal-toggle="`${d.id}-deleteModal`">
                        <XMarkIcon class="w-5 h-5" />
                        <span class="sr-only">Close modal</span>
                      </button>
                      <TrashIcon class="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto" />
                      <p class="mb-4 text-gray-500 dark:text-gray-300">
                        Apakah kamu yakin ingin menghapus jabatan <span class="font-bold">{{ d.nama }}</span>?
                      </p>
                      <div class="flex items-center justify-center space-x-4">
                        <button :data-modal-toggle="`${d.id}-deleteModal`" type="button" class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                          Batal
                        </button>
                        <button type="submit" class="px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900" @click="deleteJabatan(d.id)">
                          Iya, Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
  <!-- End block -->
</template>

<script setup>
import {
  XMarkIcon,
  EllipsisHorizontalIcon,
  PencilSquareIcon,
  TrashIcon
} from '@heroicons/vue/24/solid'
import { getQueryKey } from 'trpc-nuxt/client'
const { $client } = useNuxtApp()
const previousJabatan = ref([])

const queryKey = getQueryKey($client.jabatan.getAll, undefined)

// Access to the cached value of useQuery
const { data: jabatans } = useNuxtData(queryKey)

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

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
    document.querySelector(`[data-modal-toggle="${id}-updateJabatanModal"]`).click()
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
    document.querySelector(`[data-modal-toggle="${id}-deleteModal"]`).click()
    await refreshNuxtData(queryKey)
  } catch (error) {
    // Restore the cached value
    jabatans.value = previousJabatan.value
  }
}
</script>
