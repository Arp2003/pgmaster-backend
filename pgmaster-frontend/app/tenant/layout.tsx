'use client'

import React from 'react'
import { Sidebar } from '@/components/shared/Sidebar'
import { DashboardLayout } from '@/components/shared/Layout'

export default function TenantRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex">
      <Sidebar />
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </div>
  )
}
