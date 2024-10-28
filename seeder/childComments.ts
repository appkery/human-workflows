import { fakerKO as faker } from '@faker-js/faker'
import { randomInt } from 'crypto'
import { sql } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { type z } from 'zod'

import { comments, posts, users } from '~/server/db/schema'

import { db } from './index'

const insertCommentSchema = createInsertSchema(comments, {
  content: schema => schema.content.min(1),
  postUserId: schema => schema.postUserId.min(1),
  postDate: schema => schema.postDate.min(1),
  userId: schema => schema.userId.min(1),
  parentId: schema => schema.parentId.optional(),
})

const selectPostSchema = createSelectSchema(posts, {
  userId: schema => schema.userId,
  date: schema => schema.date,
  content: schema => schema.content.optional(),
  createdAt: schema => schema.createdAt.optional(),
  updatedAt: schema => schema.updatedAt.optional(),
})

const selectUserSchema = createSelectSchema(users, {
  id: schema => schema.id,
  email: schema => schema.email.optional(),
  emailVerified: schema => schema.emailVerified.optional(),
  name: schema => schema.name.optional(),
  image: schema => schema.image.optional(),
  about: schema => schema.about.optional(),
  password: schema => schema.password.optional(),
  createdAt: schema => schema.createdAt.optional(),
  updatedAt: schema => schema.updatedAt.optional(),
  signedInAt: schema => schema.signedInAt.optional(),
})

type CommentSchema = z.infer<typeof insertCommentSchema>
type PostSchema = z.infer<typeof selectPostSchema>
type UserSchema = z.infer<typeof selectUserSchema>

const generateComments = (
  post: PostSchema,
  user: UserSchema,
  count: number
): CommentSchema[] => {
  const comments: CommentSchema[] = []

  for (let i = 0; i < count; i++) {
    const createdAt = faker.date.recent({ days: 7 })

    comments.push({
      content: faker.lorem.paragraph(),
      postUserId: post.userId,
      postDate: post.date,
      userId: user.id,
      createdAt,
    })
  }

  return comments
}

export async function main() {
  const allPosts = await db.query.posts.findMany({
    columns: {
      userId: true,
      date: true,
    },
  })

  for (const post of allPosts) {
    const randomUsers = await db.query.users.findMany({
      columns: {
        id: true,
      },
      orderBy: [sql`RANDOM()`],
      limit: randomInt(1, 4),
    })

    for (const user of randomUsers) {
      const fakeComments = generateComments(post, user, 1)

      try {
        const result = await db
          .insert(comments)
          .values(fakeComments)
          .returning()
        console.log(result)
      } catch (err) {
        console.error(err)
      }
    }
  }
}

// main()
//   .then(async () => {
//     console.log('Comments inserted successfully')
//     process.exit()
//   })
//   .catch(async err => {
//     console.error(err)
//     process.exit(1)
//   })
