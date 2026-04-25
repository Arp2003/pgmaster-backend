import React from 'react'

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar will be imported and used by parent */}
      <div className="flex-1 overflow-auto">
        <div className="px-8 py-6">
          {children}
        </div>
      </div>
    </div>
  )
}
