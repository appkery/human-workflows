'use server'

import { format } from 'date-fns'
import { sql } from 'drizzle-orm'
import { type jsonb } from 'drizzle-orm/pg-core'
import { z } from 'zod'

import { auth } from '~/server/api/auth'
import { db } from '~/server/db'
import { posts } from '~/server/db/schema'

const schema = z.object({
  content: z.string(),
})

export async function updatePost(
  postDate: string,
  prevState: {
    path: string[]
    message: string
  }[],
  formData: FormData
) {
  const session = await auth()
  if (!session)
    return [
      {
        path: ['default'],
        message: '로그인이 필요합니다.',
      },
    ]

  try {
    const { content } = await schema.parseAsync({
      content: formData.get('content'),
    })

    await db
      .insert(posts)
      .values({
        userId: session.user.id,
        date: postDate ?? format(new Date(), 'yyyy-MM-dd'),
        content: sql<typeof jsonb>`${JSON.parse(content)}`,
      })
      .onConflictDoUpdate({
        target: [posts.userId, posts.date],
        set: { content: sql<typeof jsonb>`${JSON.parse(content)}`, updatedAt: new Date() },
      })

    return [
      {
        path: ['success'],
        message: '저장 되었습니다.',
      },
    ]
  } catch (err) {
    if (err instanceof z.ZodError) {
      return err.issues.map(issue => ({
        path: issue.path as string[],
        message: issue.message,
      }))
    }
    throw err
  }
}
