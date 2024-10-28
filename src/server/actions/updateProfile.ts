'use server'

import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import fs from 'fs/promises'
import sharp from 'sharp'
import { z } from 'zod'

import { auth } from '~/server/api/auth'
import { db } from '~/server/db'
import { users } from '~/server/db/schema'

const schema = z
  .object({
    name: z.string(),
    image: z.instanceof(File),
    about: z.string(),
    currentPassword: z.string(),
    newPassword: z.string(),
    confirmedPassword: z.string(),
  })
  .superRefine(async (val, ctx) => {
    if (val.currentPassword || val.newPassword || val.confirmedPassword) {
      if (!val.currentPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['currentPassword'],
          message: '현재 비밀번호를 입력해주세요.',
        })
      }

      if (!val.newPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['newPassword'],
          message: '새 비밀번호를 입력해주세요.',
        })
      } else if (val.currentPassword === val.newPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['newPassword'],
          message: '현재 비밀번호와 새 비밀번호가 같습니다.',
        })
      }

      if (!val.confirmedPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['confirmedPassword'],
          message: '새 비밀번호를 확인해주세요.',
        })
      } else if (val.newPassword !== val.confirmedPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['confirmedPassword'],
          message: '새 비밀번호와 확인한 비밀번호가 다릅니다.',
        })
      }
    }
  })

export async function updateProfile(
  prevState: {
    path: string[]
    message: string
  }[],
  formData: FormData
) {
  const session = await auth()
  if (!session)
    return [
      {
        path: ['default'],
        message: '로그인이 필요합니다.',
      },
    ]

  try {
    const {
      name,
      image,
      about,
      currentPassword,
      newPassword,
      confirmedPassword,
    } = await schema.parseAsync({
      name: formData.get('username'),
      image: formData.get('photo'),
      about: formData.get('about'),
      currentPassword: formData.get('currentPassword'),
      newPassword: formData.get('newPassword'),
      confirmedPassword: formData.get('confirmedPassword'),
    })

    let uuid = ''
    let user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    })
    const imageName = user?.image

    do {
      uuid = '/' + crypto.randomUUID()
      user = await db.query.users.findFirst({
        where: eq(users.image, uuid),
      })
    } while (user !== undefined)

    const arrayBuffer = await image.arrayBuffer()
    await sharp(arrayBuffer)
      .toFormat('jpg')
      .toFile(`public/images/photos${uuid}.jpg`)
    await fs.rm(`public/images/photos/${imageName}.jpg`)

    const hash = await bcrypt.hash(confirmedPassword ?? '', 10)
    await db
      .update(users)
      .set({
        name,
        image: uuid,
        about,
        password: hash,
      })
      .where(eq(users.id, session.user.id))

    return [
      {
        path: ['success'],
        message: '저장 되었습니다.',
      },
    ]
  } catch (err) {
    if (err instanceof z.ZodError) {
      return err.issues.map(issue => ({
        path: issue.path as string[],
        message: issue.message,
      }))
    }
    throw err
  }
}
