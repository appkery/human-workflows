import { relations } from 'drizzle-orm'
import {
  foreignKey,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

import { posts } from '../schema'

const common = {
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }),
}

export const symbols = pgTable(
  'symbol',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }),
    code: varchar('code', { length: 100 }),
    currency: varchar('currency', { length: 100 }),
    buyingPrice: integer('buyingPrice'),
    marketPrice: integer('marketPrice'),
    sellingPrice: integer('sellingPrice'),
    amount: integer('amount'),
    postUserId: varchar('postUserId', { length: 100 }).notNull(),
    postDate: varchar('postDate', { length: 100 }).notNull(),
    ...common,
  },
  symbol => ({
    postReference: foreignKey({
      columns: [symbol.postUserId, symbol.postDate],
      foreignColumns: [posts.userId, posts.date],
    }),
  })
)

export const symbolsRelations = relations(symbols, ({ one }) => ({
  posts: one(posts, {
    fields: [symbols.postUserId, symbols.postDate],
    references: [posts.userId, posts.date],
  }),
}))
