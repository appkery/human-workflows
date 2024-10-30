import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

import {
  createTRPCRouter,
  publicProcedure,
} from '~/server/api/trpc'
import { posts, symbols } from '~/server/db/schema'

export const symbolRouter = createTRPCRouter({
  getSymbolsByPost: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        postDate: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const postId = await ctx.db.query.posts.findFirst({
        columns: {
          userId: true,
          date: true,
        },
        where: and(
          eq(posts.userId, input.userId),
          eq(posts.date, input.postDate)
        ),
      })

      if (!postId) return []
      return await ctx.db.query.symbols.findMany({
        where: and(
          eq(symbols.postUserId, postId.userId),
          eq(symbols.postDate, postId.date)
        ),
      })
    }),
})
