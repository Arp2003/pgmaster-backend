'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { reportsAPI } from '@/lib/api-endpoints'

export default function ReportsPage() {
  const { data: occupancy } = useQuery({
    queryKey: ['occupancy-report'],
    queryFn: () => reportsAPI.occupancy(),
  })

  const { data: pendingRent } = useQuery({
    queryKey: ['pending-rent-report'],
    queryFn: () => reportsAPI.pendingRent(),
  })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Occupancy Report</h2>
          <div className="space-y-2">
            <p className="text-sm"><span className="text-muted-foreground">Total Rooms:</span> {occupancy?.data?.total_rooms}</p>
            <p className="text-sm"><span className="text-muted-foreground">Total Beds:</span> {occupancy?.data?.total_beds}</p>
            <p className="text-sm"><span className="text-muted-foreground">Occupied:</span> {occupancy?.data?.occupied_beds}</p>
            <p className="text-sm"><span className="text-muted-foreground">Occupancy %:</span> {occupancy?.data?.occupancy_percentage}%</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Pending Rent</h2>
          <div className="space-y-2">
            <p className="text-sm"><span className="text-muted-foreground">Total Pending:</span> ₹{pendingRent?.data?.total_pending_amount}</p>
            <p className="text-sm"><span className="text-muted-foreground">Count:</span> {pendingRent?.data?.pending_count}</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
          Export as CSV
        </button>
      </div>
    </div>
  )
}
