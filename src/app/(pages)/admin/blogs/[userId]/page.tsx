'use client'

import { useContext, useEffect } from 'react'

import { SidebarContext } from '~/app/_components/admin/aside'
import Calendar from '~/app/_components/calendar'

export default function UserId({ params }: { params: { userId: string } }) {
  const { sidebarOpen, setSidebarOpen } = useContext(SidebarContext) 
  const { userId } = params

  useEffect(() => {
    setSidebarOpen(false)
  }, [setSidebarOpen])

  return <Calendar userId={userId} />
}
