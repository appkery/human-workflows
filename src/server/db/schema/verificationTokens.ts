import { pgTable, primaryKey, timestamp, varchar } from 'drizzle-orm/pg-core'

const common = {
  createdAt: timestamp('createdAt', {mode: 'date'}).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', {mode: 'date'}),
}

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: varchar('identifier', { length: 100 }).notNull(),
    token: varchar('token', { length: 200 }).notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
    ...common,
  },
  token => ({
    compoundKey: primaryKey({ columns: [token.identifier, token.token] }),
  })
)
