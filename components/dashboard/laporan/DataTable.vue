<script setup lang="ts" generic="TData, TValue">
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState
} from '@tanstack/vue-table'
import {
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable
} from '@tanstack/vue-table'

import DataTablePagination from './DataTablePagination.vue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

import { Input } from '@/components/ui/input'

import { valueUpdater } from '@/lib/utils'

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}>()

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])

const table = useVueTable({
  get data () {
    return props.data
  },
  get columns () {
    return props.columns
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: updaterOrValue =>
    valueUpdater(updaterOrValue, columnFilters),
  getFilteredRowModel: getFilteredRowModel(),
  state: {
    get sorting () {
      return sorting.value
    },
    get columnFilters () {
      return columnFilters.value
    }
  }
})
</script>

<template>
  <div class="flex items-center py-4">
    <Input
      class="max-w-sm bg-white"

      placeholder="Filter nama user..."
      :model-value="table.getColumn('nama')?.getFilterValue() as string"
      @update:model-value="table.getColumn('nama')?.setFilterValue($event)"
    />
  </div>
  <div class="border rounded-md">
    <Table class="bg-white">
      <TableHeader>
        <TableRow
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
        >
          <TableHead v-for="header in headerGroup.headers" :key="header.id">
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="table.getRowModel().rows?.length">
          <TableRow
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            :data-state="row.getIsSelected() ? 'selected' : undefined"
          >
            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
              <FlexRender
                :render="cell.column.columnDef.cell"
                :props="cell.getContext()"
              />
            </TableCell>
          </TableRow>
        </template>
        <template v-else>
          <TableRow>
            <TableCell :col-span="columns.length" class="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
  </div>
  <DataTablePagination :table="table" />
</template>
