import '~/styles/globals.css'

import { type ReactNode } from 'react'

import Aside from '~/app/_components/admin/aside'

export default async function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <Aside>
      <main className='py-10'>
        <div className='max-w-7xl px-4 sm:px-6 lg:px-8'>{children}</div>
      </main>
    </Aside>
  )
}
