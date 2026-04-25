'use client'

import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { complaintsAPI } from '@/lib/api-endpoints'
import { Modal } from '@/components/shared/Modal'
import { ComplaintForm } from '@/components/shared/ComplaintForm'
import { Plus } from 'lucide-react'

export default function TenantComplaints() {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const queryClient = useQueryClient()

  const { data: complaints, isLoading } = useQuery({
    queryKey: ['tenant-complaints'],
    queryFn: () => complaintsAPI.myComplaints(),
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => complaintsAPI.create(data),
    onSuccess: () => {
      setIsModalOpen(false)
      queryClient.invalidateQueries({ queryKey: ['tenant-complaints'] })
    },
    onError: (error: any) => {
      const msg = error.response?.data?.error || error.response?.data?.detail || JSON.stringify(error.response?.data)
      alert('Error: ' + msg)
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Complaints</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Complaint
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="space-y-4">
            {(complaints?.data?.results || complaints?.data || [])?.map((complaint: any) => (
              <div key={complaint.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{complaint.title}</h3>
                    <p className="text-gray-600 text-sm mt-2">{complaint.description}</p>
                    <div className="flex gap-2 mt-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-medium">
                        {complaint.category}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded font-medium ${
                        complaint.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {complaint.priority}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded font-medium">
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Complaint"
      >
        <ComplaintForm
          onSubmit={async (data) => {
            await createMutation.mutateAsync(data)
          }}
          isLoading={createMutation.isPending}
        />
      </Modal>
    </div>
  )
}
