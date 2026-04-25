'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tenantsAPI, roomsAPI } from '@/lib/api-endpoints'
import { TenantForm } from '@/components/dashboard/TenantForm'
import { Modal } from '@/components/shared/Modal'
import { Plus, Eye } from 'lucide-react'

export default function TenantsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTenant, setEditingTenant] = useState<any>(null)
  const queryClient = useQueryClient()

  const { data: tenants, isLoading } = useQuery({
    queryKey: ['tenants'],
    queryFn: () => tenantsAPI.list(),
  })

  const { data: beds } = useQuery({
    queryKey: ['beds', 'vacant'],
    queryFn: () => roomsAPI.listBeds({ occupied: false }),
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => tenantsAPI.create(data),
    onSuccess: () => {
      setIsModalOpen(false)
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: any) => tenantsAPI.update(editingTenant.id, data),
    onSuccess: () => {
      setIsModalOpen(false)
      setEditingTenant(null)
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
    },
  })

  const handleOpenModal = (tenant?: any) => {
    if (tenant) {
      setEditingTenant(tenant)
    } else {
      setEditingTenant(null)
    }
    setIsModalOpen(true)
  }

  const handleFormSubmit = async (data: any) => {
    if (editingTenant) {
      await updateMutation.mutateAsync(data)
    } else {
      await createMutation.mutateAsync(data)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Tenants</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          Add Tenant
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Phone</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Room</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Join Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(tenants?.data?.results || tenants?.data || [])?.map((tenant: any) => (
                <tr key={tenant.id} className="border-b border-border hover:bg-muted/50">
                  <td className="px-6 py-3 text-sm font-medium">{tenant.tenant_name}</td>
                  <td className="px-6 py-3 text-sm">{tenant.phone}</td>
                  <td className="px-6 py-3 text-sm">
                    {tenant.room_details?.room_number || 'N/A'}
                  </td>
                  <td className="px-6 py-3 text-sm">{tenant.join_date}</td>
                  <td className="px-6 py-3 text-sm">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                      tenant.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : tenant.status === 'notice_period'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {tenant.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-900 font-medium">
                      <Eye className="w-4 h-4 inline" /> View
                    </button>
                    <button
                      onClick={() => handleOpenModal(tenant)}
                      className="text-indigo-600 hover:text-indigo-900 font-medium ml-2"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingTenant(null)
        }}
        title={editingTenant ? 'Edit Tenant' : 'Add New Tenant'}
      >
        <TenantForm
          onSubmit={handleFormSubmit}
          isLoading={createMutation.isPending || updateMutation.isPending}
          initialData={editingTenant}
          beds={beds?.data?.results || beds?.data || []}
        />
      </Modal>
    </div>
  )
}
