import { and, desc, eq, lt, or } from 'drizzle-orm'
import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { posts, users } from '~/server/db/schema'

export const postRouter = createTRPCRouter({
  getAllPosts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).optional(),
        cursor: z
          .object({
            userId: z.string(),
            date: z.string(),
            createdAt: z.date(),
          })
          .optional(),
      })
    )
    .query(async ({ ctx, input: { limit, cursor } }) => {
      limit = limit ?? 10

      const items = await ctx.db
        .select()
        .from(posts)
        .innerJoin(users, eq(posts.userId, users.id))
        .where(
          cursor
            ? or(
                lt(posts.createdAt, cursor.createdAt),
                and(
                  eq(posts.createdAt, cursor.createdAt),
                  lt(posts.date, cursor.date)
                )
              )
            : undefined
        )
        .orderBy(desc(posts.createdAt))
        .limit(limit + 1)

      let nextCursor: typeof cursor | undefined = undefined
      if (items.length > limit) {
        const nextItem = items.pop()
        nextCursor = nextItem?.post
      }

      return {
        items,
        nextCursor,
      }
    }),

  getPostsByUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.posts.findMany({
        columns: {
          userId: true,
          date: true,
          content: true,
          createdAt: true,
        },
        where: eq(posts.userId, input.userId),
        orderBy: (posts, { desc }) => [desc(posts.createdAt)],
      })
    }),

  getPostByUserAndDate: publicProcedure
    .input(z.object({ userId: z.string(), postDate: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.posts.findFirst({
        where: and(
          eq(posts.userId, input.userId),
          eq(posts.date, input.postDate)
        ),
      })
    }),
})
