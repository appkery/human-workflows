import { fakerKO as faker } from '@faker-js/faker'
import { randomInt } from 'crypto'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { type z } from 'zod'

import { posts, symbols } from '~/server/db/schema'

import { db } from './index'

const insertSymbolSchema = createInsertSchema(symbols, {
  name: schema => schema.name.min(1),
  code: schema => schema.code.min(1),
  currency: schema => schema.currency.min(1),
  buyingPrice: schema => schema.buyingPrice.nonnegative().nonnegative(),
  marketPrice: schema => schema.marketPrice.nonnegative().nonnegative(),
  sellingPrice: schema => schema.sellingPrice.nonnegative().nonnegative(),
  amount: schema => schema.amount.nonnegative().nonnegative(),
  postUserId: schema => schema.postUserId.min(1),
  postDate: schema => schema.postDate.min(1),
})

const selectPostSchema = createSelectSchema(posts, {
  userId: schema => schema.userId,
  date: schema => schema.date,
  content: schema => schema.content.optional(),
  createdAt: schema => schema.createdAt.optional(),
  updatedAt: schema => schema.updatedAt.optional(),
})

type SymbolSchema = z.infer<typeof insertSymbolSchema>
type PostSchema = z.infer<typeof selectPostSchema>

const generateSymbols = (post: PostSchema, count: number): SymbolSchema[] => {
  const symbols: SymbolSchema[] = []

  for (let i = 0; i < count; i++) {
    const createdAt = faker.date.recent({ days: 7 })

    symbols.push({
      name: faker.company.name(),
      code: faker.finance.bic(),
      currency: faker.finance.currencyCode(),
      buyingPrice: faker.number.int({ min: 1000, max: 1000000 }),
      marketPrice: faker.number.int({ min: 1000, max: 1000000 }),
      sellingPrice: faker.number.int({ min: 1000, max: 1000000 }),
      amount: faker.number.int({ min: 10, max: 10000 }),
      postUserId: post.userId,
      postDate: post.date,
      createdAt,
    })
  }

  return symbols
}

export async function main() {
  const allPosts = await db.query.posts.findMany({
    columns: {
      userId: true,
      date: true,
    },
  })

  for (const post of allPosts) {
    const count = randomInt(10)
    if (count === 0) return
    const fakeSymbols = generateSymbols(post, count)

    try {
      const result = await db.insert(symbols).values(fakeSymbols).returning()
      console.log(result)
    } catch (err) {
      console.error(err)
    }
  }
}

// main()
//   .then(async () => {
//     console.log('Symbols inserted successfully')
//     process.exit()
//   })
//   .catch(async err => {
//     console.error(err)
//     process.exit(1)
//   })
