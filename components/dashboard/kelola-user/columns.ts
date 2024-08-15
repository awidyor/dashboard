/* eslint-disable semi */
/* eslint-disable arrow-parens */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
import type { User } from "@prisma/client";
import type { ColumnDef } from "@tanstack/vue-table";
import DropdownAction from '@/components/dashboard/kelola-user/DataTableDropdown.vue';

export const columns: ColumnDef<User>[] = [
  {
    id: "sidikJari",
    accessorKey: "fingerPrintId",
    header: "ID Sidik Jari",
    cell: (row) => (!row.getValue() ? "-" : row.getValue()),
  },
  {
    id: "tapCard",
    accessorKey: "tapCardId",
    header: "Tap Card ID",
    cell: (row) => (!row.getValue() ? "-" : row.getValue()),
  },
  {
    accessorKey: "faceId",
    header: "FACE ID",
    cell: (row) => (!row.getValue() ? "-" : row.getValue()),
  },
  {
    id: "nama",
    accessorKey: "nama",
    header: "Nama",
    cell: (row) => (!row.getValue() ? "-" : row.getValue()),
  },
  {
    id: "jabatan",
    accessorKey: "jabatan.nama",
    header: "Jabatan",
    cell: (row) => (!row.getValue() ? "-" : row.getValue()),
  },
  {
    accessorKey: "jenisKelamin",
    header: "Jenis Kelamin",
    cell: (row) => {
      if (row.getValue() === "L") {
        return "Laki-laki";
      } else if (row.getValue() === "P") {
        return "Perempuan";
      } else {
        return "-";
      }
    },
  },
  {
    id: 'actions',
    header: 'Aksi',
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original

      return h('div', { class: 'relative' }, h(DropdownAction, {
        user,
      }))
    },
  },
];
