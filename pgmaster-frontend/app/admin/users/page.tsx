'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'

const adminAPI = {
  listUsers: async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/`)
    return response.json()
  },
  listSubscriptions: async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/subscriptions/`)
    return response.json()
  },
  getPlatformAnalytics: async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/analytics/`)
    return response.json()
  },
}

export default function AdminUsers() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminAPI.listUsers(),
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Users Management</h1>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            Add User
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users?.data?.map((user: any) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm">{user.first_name} {user.last_name}</td>
                    <td className="px-6 py-3 text-sm">{user.email}</td>
                    <td className="px-6 py-3 text-sm">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-medium">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <span className={`px-2 py-1 text-xs rounded font-medium ${
                        user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
