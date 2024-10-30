import { eq } from 'drizzle-orm'

import {
  createTRPCRouter,
  protectedProcedure,
} from '~/server/api/trpc'
import { users } from '~/server/db/schema'

export const userRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.users.findFirst({
      columns: {
        email: true,
        name: true,
        image: true,
        about: true,
      },
      where: eq(users.id, ctx.session.user.id),
    })
  }),
})
