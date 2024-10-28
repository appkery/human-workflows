import { relations } from 'drizzle-orm'
import {
  type AnyPgColumn,
  foreignKey,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

import { posts, users } from '../schema'

const common = {
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }),
}

export const comments = pgTable(
  'comment',
  {
    id: serial('id').primaryKey(),
    content: text('content'),
    postUserId: varchar('postUserId', { length: 100 }).notNull(),
    postDate: varchar('postDate', { length: 100 }).notNull(),
    userId: varchar('userId', { length: 100 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    parentId: integer('parentId').references((): AnyPgColumn => comments.id, {
      onDelete: 'cascade',
    }),
    ...common,
  },
  comment => ({
    postReference: foreignKey({
      columns: [comment.postUserId, comment.postDate],
      foreignColumns: [posts.userId, posts.date],
    }),
    createdAtIndex: index().on(comment.createdAt),
    createdAtIdIndex: index().on(
      comment.createdAt,
      comment.id
    ),
  })
)

export const commentsRelations = relations(comments, ({ one, many }) => ({
  posts: one(posts, {
    fields: [comments.postUserId, comments.postDate],
    references: [posts.userId, posts.date],
  }),
  users: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  parentComment: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: 'childComments',
  }),
  childComments: many(comments, { relationName: 'childComments' }),
}))
