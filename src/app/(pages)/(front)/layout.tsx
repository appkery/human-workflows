import '~/styles/globals.css'

import { type ReactNode } from 'react'

import Footer from '~/app/_components/front/footer'
import SignedIn from '~/app/_components/front/header/signedIn'
import SignedOut from '~/app/_components/front/header/signedOut'
import { auth } from '~/server/api/auth'

export default async function RootLayout({
  children,
  modal,
}: {
  children: ReactNode
  modal: ReactNode
}) {
  const session = await auth()

  return (
    <>
      {session ? <SignedIn /> : <SignedOut />}
      <div className='py-10'>
        <div className='mx-auto max-w-7xl sm:px-6 lg:px-8'>{children}</div>
      </div>
      <Footer />
      {modal}
    </>
  )
}
