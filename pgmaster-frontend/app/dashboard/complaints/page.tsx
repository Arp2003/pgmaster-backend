'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { complaintsAPI } from '@/lib/api-endpoints'

export default function ComplaintsPage() {
  const { data: complaints, isLoading } = useQuery({
    queryKey: ['complaints'],
    queryFn: () => complaintsAPI.openComplaints(),
  })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Complaints</h1>

      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="space-y-4">
          {complaints?.data?.map((complaint: any) => (
            <div key={complaint.id} className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{complaint.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{complaint.description}</p>
                  <div className="flex gap-4 mt-4">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {complaint.category}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      complaint.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {complaint.priority}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      {complaint.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
