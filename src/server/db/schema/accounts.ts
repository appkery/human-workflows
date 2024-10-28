import { relations } from 'drizzle-orm'
import {
  index,
  integer,
  pgTable,
  primaryKey,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import { type AdapterAccount } from 'next-auth/adapters'

import { users } from '../schema'

const common = {
  createdAt: timestamp('createdAt', {mode: 'date'}).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', {mode: 'date'}),
}

export const accounts = pgTable(
  'account',
  {
    userId: varchar('userId', { length: 100 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: varchar('type', { length: 100 })
      .$type<AdapterAccount['type']>()
      .notNull(),
    provider: varchar('provider', { length: 100 }).notNull(),
    providerAccountId: varchar('providerAccountId', { length: 100 }).notNull(),
    refresh_token: varchar('refresh_token', { length: 200 }),
    access_token: varchar('access_token', { length: 200 }),
    expires_at: integer('expires_at'),
    token_type: varchar('token_type', { length: 100 }),
    scope: varchar('scope', { length: 100 }),
    id_token: varchar('id_token', { length: 200 }),
    session_state: varchar('session_state', { length: 100 }),
    ...common,
  },
  account => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIndex: index().on(account.userId),
  })
)

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}))
