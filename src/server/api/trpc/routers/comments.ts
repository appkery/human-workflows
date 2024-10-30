import { and, asc, eq, gt } from 'drizzle-orm'
import { z } from 'zod'

import {
  createTRPCRouter,
  publicProcedure,
} from '~/server/api/trpc'
import { comments } from '~/server/db/schema'

export const commentRouter = createTRPCRouter({
  getCommentsByPost: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        postDate: z.string().min(1),
        limit: z.number().min(1).max(100).optional(),
        cursor: z.number().optional(),
      })
    )
    .query(async ({ ctx, input: { userId, postDate, limit, cursor } }) => {
      limit = limit ?? 10

      const items = await ctx.db.query.comments.findMany({
        columns: {
          id: true,
          content: true,
          parentId: true,
          createdAt: true,
          updatedAt: true,
        },
        where: and(
          eq(comments.postUserId, userId),
          eq(comments.postDate, postDate),
          cursor ? gt(comments.id, cursor) : undefined
        ),
        orderBy: [asc(comments.createdAt)],
        limit: limit + 1,
        with: {
          users: {
            columns: {
              id: true,
              name: true,
              image: true,
            },
          },
          childComments: {
            columns: {
              id: true,
              parentId: true,
            },
          },
        },
      })

      let nextCursor: typeof cursor | undefined = undefined
      if (items.length > limit) {
        const nextItem = items.pop()
        nextCursor = nextItem?.id
      }

      return {
        items,
        nextCursor,
      }
    }),
})
