'use server'

import { AuthError } from 'next-auth'
import { z } from 'zod'

import { signIn } from '~/server/api/auth'

export async function authenticate(
  prevState: {
    path: string[]
    message: string
  }[],
  formData: FormData
) {
  try {
    const provider = formData.get('provider')

    let schema = z.object({})
    let parsed = {}
    switch (provider) {
      case 'credentials':
        schema = z.object({
          email: z.string().email(),
          password: z.string(),
        })
        parsed = await schema.parseAsync({
          email: formData.get('email'),
          password: formData.get('password'),
        })
        break
      case 'nodemailer':
        schema = z.object({
          email: z.string().email(),
        })
        parsed = await schema.parseAsync({
          email: formData.get('email'),
        })
        break
    }

    await signIn(provider?.toString(), {
      ...parsed,
      callbackUrl: '/admin',
    })

    return [
      {
        path: ['success'],
        message: '인증 성공',
      },
    ]
  } catch (err) {
    if (err instanceof z.ZodError) {
      return err.issues.map(issue => ({
        path: issue.path as string[],
        message: issue.message,
      }))
    } else if (err instanceof AuthError) {
      return [
        {
          path: [err.type],
          message: '이메일 또는 비밀번호가 없거나 다릅니다.',
        },
      ]
    }
    throw err
  }
}
