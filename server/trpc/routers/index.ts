import { router } from '../trpc'
import { statsRouter } from './stats'
import { jabatanRouter } from './jabatan'
import { reportingRouter } from './reporting'
import { userRouter } from './user'

export const appRouter = router({
  jabatan: jabatanRouter,
  user: userRouter,
  reporting: reportingRouter,
  stats: statsRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
