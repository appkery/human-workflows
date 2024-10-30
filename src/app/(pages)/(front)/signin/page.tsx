import { redirect } from 'next/navigation'

import { auth } from '~/server/api/auth'

import SignIn from './signin'

export default async function SignInPage() {
  const session = await auth()

  if (session) {
    redirect('/admin')
  }

  return <SignIn />
}
