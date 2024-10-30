import { redirect } from 'next/navigation'

import { auth } from '~/server/api/auth'

import SignUp from './signup'

export default async function SignUpPage() {
  const session = await auth()

  if (session) {
    redirect('/admin/profile')
  }

  return <SignUp />
}
