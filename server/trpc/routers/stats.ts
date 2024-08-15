import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

export const statsRouter = router({
  getAll: publicProcedure
    .input(z.object({
      filterMonth: z.string().optional(),
      filterYear: z.string().optional()
    }))
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.prisma.akses.findMany()

        // Get the unique methods
        const methods = [...new Set(data.flatMap(item => [item.metodeMasuk, item.metodeKeluar]))]

        const quarter1Months = ['January', 'February', 'March', 'April', 'May', 'June']
        const quarter2Months = ['July', 'August', 'September', 'October', 'November', 'December']

        const currentMonth = new Date().getMonth()
        const months = currentMonth <= 5 ? quarter1Months : quarter2Months

        // Initialize the final result with methods as keys and arrays of zeros as values
        const resultMasuk = Object.fromEntries(methods.map(method => [method, Array(6).fill(0)]))
        const resultKeluar = Object.fromEntries(methods.map(method => [method, Array(6).fill(0)]))

        // Get the current year
        const currentYear = new Date().getFullYear()

        // Iterate over the data and increment the corresponding month for each method
        for (const item of data) {
          const dateMasuk = new Date(item.waktuMasuk)

          // Only consider data from the current year
          if (dateMasuk.getFullYear() === currentYear) {
            const monthMasuk = dateMasuk.toLocaleString('default', { month: 'long' })

            if (months.includes(monthMasuk) && item.metodeMasuk) {
              resultMasuk[item.metodeMasuk][months.indexOf(monthMasuk)]++
            }
          }
        }

        delete resultMasuk.null
        resultMasuk.tapCard = resultMasuk.TapCard
        resultMasuk.fingerprint = resultMasuk.fingerPrintId
        delete resultMasuk.TapCard
        delete resultMasuk.fingerPrintId

        for (const item of data) {
          const dateKeluar = item.waktuKeluar ? new Date(item.waktuKeluar) : null

          // Only consider data from the current year
          if (dateKeluar && dateKeluar.getFullYear() === currentYear) {
            const monthKeluar = dateKeluar.toLocaleString('default', { month: 'long' })

            if (months.includes(monthKeluar) && item.metodeKeluar) {
              resultKeluar[item.metodeKeluar][months.indexOf(monthKeluar)]++
            }
          }
        }

        delete resultKeluar.null
        resultKeluar.tapCard = resultKeluar.TapCard
        resultKeluar.fingerprint = resultKeluar.fingerPrintId
        delete resultKeluar.TapCard
        delete resultKeluar.fingerPrintId

        // list minggu
        const listMinggu = ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4']

        let currentMonthWeekly: number

        if (input.filterMonth) {
          currentMonthWeekly = input.filterMonth ? Number(input.filterMonth) : new Date().getMonth()
        } else {
          currentMonthWeekly = new Date().getMonth()
        }
        const currentMonthWeeklyName = input.filterMonth ? new Date(currentYear, currentMonthWeekly).toLocaleString('default', { month: 'long' }) : new Date().toLocaleString('default', { month: 'long' })

        let currentYearWeekly: number

        if (input.filterYear) {
          currentYearWeekly = input.filterYear ? Number(input.filterYear) : currentYear
        } else {
          currentYearWeekly = new Date().getFullYear()
        }
        const fullData = await ctx.prisma.akses.findMany()
        let listYear = [...new Set(fullData.flatMap(item => [new Date(item.waktuMasuk).getFullYear(), item.waktuKeluar ? new Date(item.waktuKeluar).getFullYear() : null]))]
        // delete null
        listYear = listYear.filter(item => item)

        const resultWeekly = Array(4).fill(0)

        for (const item of data) {
          const dateMasuk = new Date(item.waktuMasuk)
          const dateKeluar = item.waktuKeluar ? new Date(item.waktuKeluar) : null

          if (dateKeluar) {
            if (dateMasuk.getMonth() === currentMonthWeekly && dateMasuk.getFullYear() === currentYearWeekly && dateKeluar.getMonth() === currentMonthWeekly && dateKeluar.getFullYear() === currentYearWeekly) {
              // Chart weekly akan dihitung berdasarkan waktu keluar
              // Jika tidak ada waktu keluar, maka tidak akan dihitung
              const week = dateKeluar.getDate() <= 7 ? listMinggu[0] : dateKeluar.getDate() <= 14 ? listMinggu[1] : dateKeluar.getDate() <= 21 ? listMinggu[2] : listMinggu[3]

              if (listMinggu.includes(week)) {
                resultWeekly[listMinggu.indexOf(week)]++
              }
            }
          }
        }

        return {
          user: await ctx.prisma.user.count(),
          jabatan: await ctx.prisma.jabatan.count(),
          totalIn: await ctx.prisma.akses.count(),
          totalOut: await ctx.prisma.akses.count({
            where: {
              waktuKeluar: {
                not: null
              }
            }
          }),
          chartsMonthly: {
            currentYear,
            listMonthBefore: months,
            listDataMasuk: Object.entries(resultMasuk).map(([key, value]) => ({ label: key, data: value })),
            listDataKeluar: Object.entries(resultKeluar).map(([key, value]) => ({ label: key, data: value }))
          },
          chartsWeekly: {
            currentMonth: currentMonthWeeklyName,
            currentYearWeekly,
            listYear,
            listWeekBefore: listMinggu,
            listData: resultWeekly
          }
        }
      } catch (error) {
        console.error(error)
      }
    })
})
