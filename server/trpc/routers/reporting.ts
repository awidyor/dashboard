import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

export const reportingRouter = router({
  getAll: publicProcedure
    .input(
      z.object({
        monthFilter: z.string().optional().nullable(),
        yearFilter: z.string().optional().nullable()
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { monthFilter, yearFilter } = input

        const yearNow = new Date().getFullYear()

        let waktuMasuk

        if (monthFilter && yearFilter) {
          waktuMasuk = {
            gte: new Date(Number(yearFilter), Number(monthFilter), 1),
            lt: new Date(Number(yearFilter), Number(monthFilter) + 1, 1)
          }
        } else if (monthFilter && !yearFilter) {
          waktuMasuk = {
            gte: new Date(yearNow, Number(monthFilter), 1),
            lt: new Date(yearNow, Number(monthFilter) + 1, 1)
          }
        } else if (!monthFilter && yearFilter) {
          waktuMasuk = {
            gte: new Date(Number(yearFilter), 0, 1),
            lt: new Date(Number(yearFilter) + 1, 0, 1)
          }
        } else {
          waktuMasuk = undefined
        }

        const records = await ctx.prisma.akses.findMany({
          include: {
            user: {
              include: {
                jabatan: true
              }
            }
          },
          where: {
            waktuMasuk
          },
          orderBy: {
            waktuMasuk: 'desc'
          }
        })

        const fullData = await ctx.prisma.akses.findMany()
        const listYear = [...new Set(fullData.flatMap(item => [new Date(item.waktuMasuk).getFullYear(), item.waktuKeluar ? new Date(item.waktuKeluar).getFullYear() : null]))].filter(item => item)

        return {
          listYear,
          records
        }
      } catch (error) {
        console.error(error)
        throw error
      }
    }),

  create: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        tempatMasuk: z.string(),
        metodeMasuk: z.enum(['fingerPrintId', 'TapCard', 'faceId']),
        waktuMasuk: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const user = await ctx.prisma.user.findUnique({
          where: {
            id: input.userId
          }
        })

        if (!user) {
          throw new Error('User not found')
        }

        if (input.metodeMasuk === 'fingerPrintId' && !user.fingerPrintId) {
          return {
            error: 'User tidak memiliki fingerPrintId'
          }
        } else if (input.metodeMasuk === 'TapCard' && !user.tapCardId) {
          return {
            error: 'User tidak memiliki tapCardId'
          }
        } else if (input.metodeMasuk === 'faceId' && !user.faceId) {
          return {
            error: 'User tidak memiliki faceId'
          }
        }

        const akses = await ctx.prisma.akses.create({
          data: {
            user: {
              connect: {
                id: input.userId
              }
            },
            tempatMasuk: input.tempatMasuk,
            metodeMasuk: input.metodeMasuk,
            waktuMasuk: input.waktuMasuk
          }
        })

        return akses
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error)
      }
    }),

  createMany: publicProcedure
    .input(
      z.array(
        z.object({
          userId: z.string(),
          tempatMasuk: z.string(),
          tempatKeluar: z.string(),
          metodeMasuk: z.enum(['fingerPrintId', 'TapCard', 'faceId']),
          metodeKeluar: z.enum(['fingerPrintId', 'TapCard', 'faceId']),
          waktuMasuk: z.string(),
          waktuKeluar: z.string()
        })
      )
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const validData = []
        const errors = []

        for (const item of input) {
          const user = await ctx.prisma.user.findUnique({
            where: {
              id: item.userId
            }
          })

          if (!user) {
            errors.push(`User with ID ${item.userId} not found`)
            continue
          }

          if (item.metodeMasuk === 'fingerPrintId' && !user.fingerPrintId) {
            errors.push(`User with ID ${item.userId} does not have a fingerPrintId`)
            continue
          } else if (item.metodeMasuk === 'TapCard' && !user.tapCardId) {
            errors.push(`User with ID ${item.userId} does not have a tapCardId`)
            continue
          } else if (item.metodeMasuk === 'faceId' && !user.faceId) {
            errors.push(`User with ID ${item.userId} does not have a faceId`)
            continue
          }

          validData.push({
            userId: item.userId,
            tempatMasuk: item.tempatMasuk,
            tempatKeluar: item.tempatKeluar,
            metodeMasuk: item.metodeMasuk,
            metodeKeluar: item.metodeKeluar,
            waktuMasuk: item.waktuMasuk,
            waktuKeluar: item.waktuKeluar
          })
        }

        if (validData.length > 0) {
          const akses = await ctx.prisma.akses.createMany({
            data: validData,
            skipDuplicates: true
          })

          return true
        } else {
          return {
            success: false,
            errors
          }
        }
      } catch (error) {
        console.error(error)
        throw new Error('Failed to create access entries')
      }
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        userId: z.string(),
        tempatKeluar: z.string(),
        metodeKeluar: z.enum(['fingerPrintId', 'TapCard', 'faceId']),
        waktuKeluar: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const user = await ctx.prisma.user.findUnique({
          where: {
            id: input.userId
          }
        })

        if (!user) {
          throw new Error('User not found')
        }

        if (input.metodeKeluar === 'fingerPrintId' && !user.fingerPrintId) {
          return {
            error: 'User tidak memiliki fingerPrintId'
          }
        } else if (input.metodeKeluar === 'TapCard' && !user.tapCardId) {
          return {
            error: 'User tidak memiliki tapCardId'
          }
        } else if (input.metodeKeluar === 'faceId' && !user.faceId) {
          return {
            error: 'User tidak memiliki faceId'
          }
        }

        const akses = await ctx.prisma.akses.update({
          where: {
            id: input.id
          },
          data: {
            user: {
              connect: {
                id: input.userId
              }
            },
            tempatKeluar: input.tempatKeluar,
            metodeKeluar: input.metodeKeluar,
            waktuKeluar: input.waktuKeluar
          }
        })

        return akses
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error)
      }
    })
})
