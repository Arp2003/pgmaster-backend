'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/hooks/useAuth'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
    } else if (user.role === 'tenant') {
      router.push('/tenant/home')
    }
  }, [user, router])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard title="Total Rooms" value="12" icon="🏠" />
        <DashboardCard title="Total Beds" value="48" icon="🛏️" />
        <DashboardCard title="Occupied Beds" value="42" icon="👤" />
        <DashboardCard title="Occupancy %" value="87.5%" icon="📊" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/dashboard/rooms')}
              className="flex items-center justify-center gap-2 p-4 border border-border rounded-lg hover:bg-accent transition"
            >
              <span>🏠</span> Add Room
            </button>
            <button
              onClick={() => router.push('/dashboard/tenants')}
              className="flex items-center justify-center gap-2 p-4 border border-border rounded-lg hover:bg-accent transition"
            >
              <span>👤</span> Add Tenant
            </button>
            <button
              onClick={() => router.push('/dashboard/payments')}
              className="flex items-center justify-center gap-2 p-4 border border-border rounded-lg hover:bg-accent transition"
            >
              <span>💰</span> Record Payment
            </button>
            <button
              onClick={() => router.push('/dashboard/complaints')}
              className="flex items-center justify-center gap-2 p-4 border border-border rounded-lg hover:bg-accent transition"
            >
              <span>📢</span> View Complaints
            </button>
            <button
              onClick={() => router.push('/dashboard/mess')}
              className="flex items-center justify-center gap-2 p-4 border border-border rounded-lg hover:bg-accent transition"
            >
              <span>🍴</span> Manage Mess
            </button>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">PG Information</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">PG Name</span>
              <span className="font-medium">{(user as any).pg_profile?.name || 'My PG'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Owner</span>
              <span className="font-medium">{user.first_name} {user.last_name}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">Contact</span>
              <span className="font-medium">{user.phone}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Tenants</h2>
          <p className="text-muted-foreground">No data available</p>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Pending Payments</h2>
          <p className="text-muted-foreground">No data available</p>
        </div>
      </div>
    </div>
  )
}

interface DashboardCardProps {
  title: string
  value: string
  icon: string
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  )
}
