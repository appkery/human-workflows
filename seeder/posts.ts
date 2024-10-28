import { fakerKO as faker } from '@faker-js/faker'
import { randomInt } from 'crypto'
import { format } from 'date-fns'
import { sql } from 'drizzle-orm'
import { type jsonb } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { type z } from 'zod'

import { posts, users } from '~/server/db/schema'

import { db } from './index'

const insertPostSchema = createInsertSchema(posts, {
  date: schema => schema.date.min(1),
  content: schema => schema.content,
  userId: schema => schema.userId.min(1),
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

type PostSchema = z.infer<typeof insertPostSchema>
type UserSchema = z.infer<typeof selectUserSchema>

const generatePosts = (user: UserSchema, count: number): PostSchema[] => {
  const posts: PostSchema[] = []

  for (let i = 0; i < count; i++) {
    const createdAt = faker.date.recent({ days: 7 })
    const content = {
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: faker.lorem.paragraph(),
                type: 'text',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
            textFormat: 0,
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: faker.lorem.paragraph(),
                type: 'text',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
            textFormat: 0,
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: faker.lorem.paragraph(),
                type: 'text',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: 'right',
            indent: 0,
            type: 'paragraph',
            version: 1,
            textFormat: 0,
          },
          {
            children: [],
            direction: null,
            format: 'left',
            indent: 0,
            type: 'paragraph',
            version: 1,
            textFormat: 0,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    }

    posts.push({
      date: format(createdAt, 'yyyy-MM-dd'),
      content: JSON.stringify(content),
      userId: user.id,
      createdAt,
    })
  }

  return posts
}

export async function main() {
  const allUsers = await db.query.users.findMany({
    columns: {
      id: true,
    },
  })

  for (const user of allUsers) {
    const count = randomInt(4)
    if (count === 0) return
    const fakePosts = generatePosts(user, count)

    try {
      const result = await db
        .insert(posts)
        .values(
          fakePosts.map(post => ({
            ...post,
            content: sql<typeof jsonb>`${post.content}`,
          }))
        )
        .returning()
      console.log(result)
    } catch (err) {
      console.error(err)
    }
  }
}

// main()
//   .then(async () => {
//     console.log('Posts inserted successfully')
//     process.exit()
//   })
//   .catch(async err => {
//     console.error(err)
//     process.exit(1)
//   })
