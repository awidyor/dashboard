/* eslint-disable semi */
/* eslint-disable arrow-parens */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
import type { Jabatan } from "@prisma/client";
import type { ColumnDef } from "@tanstack/vue-table";
import DropdownAction from '@/components/dashboard/jabatan/DataTableDropdown.vue'

export const columns: ColumnDef<Jabatan & {_count: {user: number}}>[] = [
  {
    id: "nama",
    accessorKey: "nama",
    header: "Nama",
    cell: (row) => (!row.getValue() ? "-" : row.getValue()),
  },
  {
    id: 'actions',
    header: 'Aksi',
    cell: ({ row }) => {
      const jabatan = row.original

      return h('div', { class: 'relative' }, h(DropdownAction, {
        jabatan,
      }))
    },
  },
];
