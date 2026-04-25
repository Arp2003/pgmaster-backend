'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'

const adminAPI = {
  listSubscriptions: async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/subscriptions/`)
    return response.json()
  },
}

export default function AdminSubscriptions() {
  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ['admin-subscriptions'],
    queryFn: () => adminAPI.listSubscriptions(),
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Subscriptions Management</h1>

        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subscriptions?.data?.map((sub: any) => (
              <div key={sub.id} className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-lg mb-2">{sub.plan?.name}</h3>
                <p className="text-2xl font-bold text-indigo-600 mb-4">₹{sub.plan?.price}</p>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">PG:</span> {sub.pg_details?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Start:</span> {sub.start_date}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">End:</span> {sub.end_date}
                  </p>
                </div>
                <span className={`inline-block px-3 py-1 text-xs rounded font-medium ${
                  sub.is_paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {sub.is_paid ? 'Paid' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
