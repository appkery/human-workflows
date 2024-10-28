import { relations } from 'drizzle-orm'
import {
  index,
  jsonb,
  pgTable,
  primaryKey,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import { type SerializedEditorState } from 'lexical'

import { comments, users } from '../schema'

const common = {
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }),
}

export const posts = pgTable(
  'post',
  {
    userId: varchar('userId', { length: 100 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    date: varchar('date', { length: 100 }).notNull(),
    content: jsonb('content').$type<SerializedEditorState>(),
    ...common,
  },
  post => ({
    compoundKey: primaryKey({
      columns: [post.userId, post.date],
    }),
    createdAtIndex: index().on(post.createdAt),
    createdAtIdIndex: index().on(
      post.createdAt,
      post.userId,
      post.date
    ),
  })
)

export const postsRelations = relations(posts, ({ one, many }) => ({
  users: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  comments: many(comments),
}))
