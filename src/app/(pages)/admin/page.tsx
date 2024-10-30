'use client'

import { useContext, useEffect } from 'react'

import { SidebarContext } from '~/app/_components/admin/aside'
import LinePlot from '~/app/_components/linePlot'

export default function Dashboard() {
  const { sidebarOpen, setSidebarOpen } = useContext(SidebarContext)

  useEffect(() => {
    setSidebarOpen(false)
  }, [setSidebarOpen])
  
  return (
    <>
      <LinePlot />
    </>
  )
}
