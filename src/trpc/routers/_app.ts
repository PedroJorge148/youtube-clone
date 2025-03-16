import { categoriesRouter } from '@/modules/categories/server/procedures'
import { studioRouter } from '@/modules/studio/server/procedures'
import { videosRouter } from '@/modules/videos/server/procedures'

import { createTRPCRouter } from '../init'

export const appRouter = createTRPCRouter({
  studio: studioRouter,
  categories: categoriesRouter,
  videos: videosRouter,
})
// export type definition of API
export type AppRouter = typeof appRouter
