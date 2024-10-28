import { fakerKO as faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'
import { createInsertSchema } from 'drizzle-zod'
import { type z } from 'zod'

import { users } from '~/server/db/schema'

import { db } from './index'

const insertUserSchema = createInsertSchema(users, {
  email: schema => schema.email.email(),
  name: schema => schema.name.min(1),
  image: schema => schema.image.url(),
})

type UserSchema = z.infer<typeof insertUserSchema>

const generateUsers = async (count: number): Promise<UserSchema[]> => {
  const users: UserSchema[] = []
  const password = await bcrypt.hash('fortune', 10)

  for (let i = 0; i < count; i++) {
    const createdAt = faker.date.recent({ days: 7 })

    users.push({
      email: faker.internet.email(),
      password,
      name: faker.person.fullName(),
      image: faker.image.avatar(),
      createdAt,
    })
  }

  return users
}

const fakeUsers = generateUsers(30)

export async function main() {
  try {
    const result = await db.insert(users).values(await fakeUsers)
    console.log(result)
  } catch (err) {
    console.error(err)
  }
}

// main()
//   .then(async () => {
//     console.log('Users inserted successfully')
//     process.exit()
//   })
//   .catch(async err => {
//     console.error(err)
//     process.exit(1)
//   })
