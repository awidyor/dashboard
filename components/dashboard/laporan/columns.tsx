/* eslint-disable semi */
/* eslint-disable arrow-parens */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
import type { Jabatan } from "@prisma/client";
import type { ColumnDef } from "@tanstack/vue-table";
import { ArrowDown01Icon, ArrowUp01Icon, ArrowUpDown } from "lucide-vue-next";
import { Button } from "~/components/ui/button";

export const columns: ColumnDef<Jabatan>[] = [
  {
    id: "nama",
    accessorKey: "user.nama",
    header: "Nama",
    cell: (row) => (!row.getValue() ? "-" : row.getValue()),
  },
  {
    accessorKey: "user.jabatan.nama",
    header: "Jabatan",
    cell: (row) => (!row.getValue() ? "-" : row.getValue()),
  },
  {
    accessorKey: "user.jenisKelamin",
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
    accessorKey: "tempatMasuk",
    header: "Tempat Masuk",
    cell: (row) => (!row.getValue() ? "-" : row.getValue()),
  },
  {
    accessorKey: "tempatKeluar",
    header: "Tempat Keluar",
    cell: (row) => (!row.getValue() ? "-" : row.getValue()),
  },
  {
    accessorKey: "metodeMasuk",
    header: "Metode Masuk",
    cell: (row) => (!row.getValue() ? "-" : row.getValue()),
  },
  {
    accessorKey: "metodeKeluar",
    header: "Metode Keluar",
    cell: (row) => (!row.getValue() ? "-" : row.getValue()),
  },
  {
    accessorKey: "waktuMasuk",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => {
          if (column.getIsSorted() === "asc") {
            return ["Waktu Masuk", h(ArrowUp01Icon, { class: "ml-2 h-4 w-4" })];
          } else if (column.getIsSorted() === "desc") {
            return [
              "Waktu Masuk",
              h(ArrowDown01Icon, {
                class: "ml-2 h-4 w-4 transform rotate-180",
              }),
            ];
          } else {
            return ["Waktu Masuk", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })];
          }
        }
      );
    },
    cell: (row) => {
      return !row.getValue()
        ? "-"
        : new Date(row.getValue() as string).toLocaleString("id-ID");
    },
  },
  {
    accessorKey: "waktuKeluar",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => {
          if (column.getIsSorted() === "asc") {
            return [
              "Waktu Keluar",
              h(ArrowUp01Icon, { class: "ml-2 h-4 w-4" }),
            ];
          } else if (column.getIsSorted() === "desc") {
            return [
              "Waktu Keluar",
              h(ArrowDown01Icon, {
                class: "ml-2 h-4 w-4 transform rotate-180",
              }),
            ];
          } else {
            return ["Waktu Keluar", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })];
          }
        }
      );
    },
    cell: (row) => {
      return !row.getValue()
        ? "-"
        : new Date(row.getValue() as string).toLocaleString("id-ID");
    },
  },
];
