import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

export const userRouter = router({
  getAll: publicProcedure
    .query(({ ctx }) => {
      return ctx.prisma.user.findMany({
        include: {
          jabatan: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    }),

  create: publicProcedure
    .input(
      z.object({
        fingerPrintId: z.string().optional(),
        tapCardId: z.string().optional(),
        faceId: z.string().optional(),
        nama: z.string(),
        jabatanId: z.string(),
        jenisKelamin: z.string()
      })
    )
    .mutation(({ input, ctx }) => {
      if (input.fingerPrintId === '' && input.tapCardId === '' && input.faceId === '') {
        throw new Error('Should be filled at least once (fingerPrintId, tapCardId, faceId)')
      }

      return ctx.prisma.user.create({
        data: {
          fingerPrintId: input.fingerPrintId === '' ? null : input.fingerPrintId,
          tapCardId: input.tapCardId === '' ? null : input.tapCardId,
          faceId: input.faceId === '' ? null : input.faceId,
          nama: input.nama,
          jabatanId: input.jabatanId,
          jenisKelamin: input.jenisKelamin
        }
      })
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        fingerPrintId: z.string().optional(),
        tapCardId: z.string().optional(),
        faceId: z.string().optional(),
        nama: z.string(),
        jabatanId: z.string(),
        jenisKelamin: z.string()
      })
    )
    .mutation(({ input, ctx }) => {
      if (input.fingerPrintId === '' && input.tapCardId === '' && input.faceId === '') {
        throw new Error('Should be filled at least once (fingerPrintId, tapCardId, faceId)')
      }

      return ctx.prisma.user.update({
        where: {
          id: input.id
        },
        data: {
          fingerPrintId: input.fingerPrintId === '' ? null : input.fingerPrintId,
          tapCardId: input.tapCardId === '' ? null : input.tapCardId,
          faceId: input.faceId === '' ? null : input.faceId,
          nama: input.nama,
          jabatanId: input.jabatanId,
          jenisKelamin: input.jenisKelamin
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
      return ctx.prisma.user.delete({
        where: {
          id: input.id
        }
      })
    })
})
