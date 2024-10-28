import { relations } from 'drizzle-orm'
import { index, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'

import { users } from '../schema'

const common = {
  createdAt: timestamp('createdAt', {mode: 'date'}).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', {mode: 'date'}),
}

export const sessions = pgTable(
  'session',
  {
    sessionToken: varchar('sessionToken', { length: 200 }).primaryKey(),
    userId: varchar('userId', { length: 100 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
    ...common,
  },
  session => ({
    userIdIndex: index().on(session.userId),
  })
)

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}))
