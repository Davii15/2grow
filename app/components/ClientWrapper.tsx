'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const Navbar = dynamic(() => import('../../components/Navbar'), { ssr: false })

interface ClientWrapperProps {
  children: React.ReactNode
}

const ClientWrapper: React.FC<ClientWrapperProps> = ({ children }) => {
  const pathname = usePathname()
  const isAdminDashboard = pathname?.startsWith('/admin/dashboard')

  return (
    <>
      {!isAdminDashboard && (
        <Suspense fallback={<div>Loading...</div>}>
          <Navbar />
        </Suspense>
      )}
      {children}
    </>
  )
}

export default ClientWrapper

