'use client'

import { useContext, useEffect } from 'react'

import { SidebarContext } from '~/app/_components/admin/aside'
import Users from '~/app/_components/list'

export default function Blogs() {
  const { sidebarOpen, setSidebarOpen } = useContext(SidebarContext)

  useEffect(() => {
    setSidebarOpen(false)
  }, [setSidebarOpen])

  return <Users />
}
