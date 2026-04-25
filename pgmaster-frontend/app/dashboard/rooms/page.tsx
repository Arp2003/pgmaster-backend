'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { roomsAPI } from '@/lib/api-endpoints'
import { RoomForm } from '@/components/dashboard/RoomForm'
import { Modal } from '@/components/shared/Modal'
import { Plus } from 'lucide-react'

export default function RoomsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<any>(null)
  const queryClient = useQueryClient()

  const { data: rooms, isLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => roomsAPI.list(),
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => roomsAPI.create(data),
    onSuccess: () => {
      setIsModalOpen(false)
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: any) => roomsAPI.update(editingRoom.id, data),
    onSuccess: () => {
      setIsModalOpen(false)
      setEditingRoom(null)
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
    },
  })

  const handleOpenModal = (room?: any) => {
    if (room) {
      setEditingRoom(room)
    } else {
      setEditingRoom(null)
    }
    setIsModalOpen(true)
  }

  const handleFormSubmit = async (data: any) => {
    if (editingRoom) {
      await updateMutation.mutateAsync(data)
    } else {
      await createMutation.mutateAsync(data)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Rooms</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          Add Room
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">Room #</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Floor</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Type</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Sharing</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Rent</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Occupancy</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(rooms?.data?.results || rooms?.data || [])?.map((room: any) => (
                <tr key={room.id} className="border-b border-border hover:bg-muted/50">
                  <td className="px-6 py-3 text-sm font-medium">{room.room_number}</td>
                  <td className="px-6 py-3 text-sm">{room.floor}</td>
                  <td className="px-6 py-3 text-sm">{room.room_type}</td>
                  <td className="px-6 py-3 text-sm">{room.sharing_type} Bed</td>
                  <td className="px-6 py-3 text-sm font-semibold">₹{room.monthly_rent}</td>
                  <td className="px-6 py-3 text-sm">
                    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800">
                      {room.occupancy_percentage || 0}%
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm space-x-2">
                    <button
                      onClick={() => handleOpenModal(room)}
                      className="text-indigo-600 hover:text-indigo-900 font-medium"
                    >
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-900 font-medium">Delete</button>
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
          setEditingRoom(null)
        }}
        title={editingRoom ? 'Edit Room' : 'Add New Room'}
      >
        <RoomForm
          onSubmit={handleFormSubmit}
          isLoading={createMutation.isPending || updateMutation.isPending}
          initialData={editingRoom}
        />
      </Modal>
    </div>
  )
}
