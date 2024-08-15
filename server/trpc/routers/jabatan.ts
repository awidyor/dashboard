import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

export const jabatanRouter = router({
  getAll: publicProcedure
    .query(({ ctx }) => {
      return ctx.prisma.jabatan.findMany({
        include: {
          _count: {
            select: {
              user: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    }),

  create: publicProcedure
    .input(
      z.object({
        nama: z.string()
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.jabatan.create({
        data: {
          nama: input.nama
        }
      })
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        nama: z.string()
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.jabatan.update({
        where: {
          id: input.id
        },
        data: {
          nama: input.nama
        }
      })
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.jabatan.delete({
        where: {
          id: input.id
        }
      })
    })
})
