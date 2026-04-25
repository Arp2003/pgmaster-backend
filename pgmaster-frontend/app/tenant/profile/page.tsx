'use client'

import React from 'react'
import { useProfile } from '@/hooks/useAuthMutations'

export default function TenantProfile() {
  const { data: profile, isLoading } = useProfile()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {profile?.data?.first_name?.[0]}{profile?.data?.last_name?.[0]}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{profile?.data?.first_name} {profile?.data?.last_name}</h2>
                  <p className="text-indigo-600 font-medium capitalize">{profile?.data?.role}</p>
                </div>
              </div>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Account Information</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Username</p>
                    <p className="text-gray-900">{profile?.data?.username}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Email Address</p>
                    <p className="text-gray-900">{profile?.data?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Phone Number</p>
                    <p className="text-gray-900">{profile?.data?.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">PG & Room Details</h3>
                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                  <p className="text-xs text-indigo-500 font-bold uppercase mb-2">Current Stay</p>
                  <p className="text-gray-700 text-sm italic">Room details will appear here once assigned by the PG owner.</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gray-50 flex gap-4">
              <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition">
                Edit Profile
              </button>
              <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition">
                Change Password
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
