import { DrizzleAdapter } from '@auth/drizzle-adapter'
import authConfig from 'auth.config'
import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import { produce } from 'immer'
import NextAuth, { CredentialsSignin,type DefaultSession } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Nodemailer from 'next-auth/providers/nodemailer'
import { z } from 'zod'

import { db } from '~/server/db'
import { users } from '~/server/db/schema'

/* eslint-disable */
function convertNullToString(obj: any): any {
  for (const key in obj) {
    if (obj[key] === '{}') {
      obj[key] = null
    } else if (typeof obj[key] === 'object') {
      convertNullToString(obj[key])
    }
  }
  return obj
}
/* eslint-disable */

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      // ...other properties
      // role: UserRole;
    } & DefaultSession['user']
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      session = convertNullToString(session)

      return produce(session, draft => {
        if (token.sub) draft.user.id = token.sub
      })
    },
    async signIn({ user }) {
      if (!user.email) return false

      await db
        .update(users)
        .set({
          signedInAt: new Date(),
        })
        .where(eq(users.email, user.email))

      return true
    },
  },
  adapter: DrizzleAdapter(db),
  providers: [
    ...authConfig.providers,
    Nodemailer({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    Credentials({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        const parsedCredentials = await z
          .object({ email: z.string().email(), password: z.string() })
          .safeParseAsync(credentials)

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data
          const user = await db.query.users.findFirst({
            columns: {
              id: true,
              email: true,
              password: true,
            },
            where: eq(users.email, email),
          })

          if (!user?.password) throw new CredentialsSignin()

          const match = await bcrypt.compare(password, user.password)

          if (match) return user
        }

        throw new CredentialsSignin()
      },
    }),
  ],
  pages: {
    signIn: '/signin',
    verifyRequest: '/verify',
  },
})
