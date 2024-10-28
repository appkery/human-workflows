import { relations } from 'drizzle-orm'
import { index, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'

import { accounts, comments, posts } from '../schema'

const common = {
  createdAt: timestamp('createdAt', {mode: 'date'}).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', {mode: 'date'}),
}

export const users = pgTable(
  'user',
  {
    id: varchar('id', { length: 100 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    email: varchar('email', { length: 100 }).notNull(),
    emailVerified: timestamp('emailVerified', {
      mode: 'date',
    }),
    name: varchar('name', { length: 100 }),
    image: varchar('image', { length: 200 }).unique(),
    about: text('about'),
    password: varchar('password', { length: 100 }),
    signedInAt: timestamp('signedInAt', {
      mode: 'date',
    }),
    ...common,
  },
  user => ({
    createdAtIndex: index().on(user.createdAt),
    createdAtIdIndex: index().on(
      user.createdAt,
      user.id
    ),
  })
)

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  posts: many(posts),
  comments: many(comments),
}))
