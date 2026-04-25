import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const roomSchema = z.object({
  room_number: z.string().min(1, 'Room number is required'),
  floor: z.number().int('Floor must be an integer'),
  sharing_type: z.number().int().min(1).max(4),
  room_type: z.enum(['ac', 'non_ac']),
  monthly_rent: z.number().positive('Rent must be positive'),
  amenities: z.string().optional(),
})

type RoomFormData = z.infer<typeof roomSchema>

interface RoomFormProps {
  onSubmit: (data: RoomFormData) => Promise<void>
  isLoading?: boolean
  initialData?: Partial<RoomFormData>
}

export function RoomForm({ onSubmit, isLoading = false, initialData }: RoomFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: initialData,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
        <input
          type="text"
          {...register('room_number')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="e.g., 101"
        />
        {errors.room_number && <p className="text-red-500 text-xs mt-1">{errors.room_number.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
          <input
            type="number"
            {...register('floor', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.floor && <p className="text-red-500 text-xs mt-1">{errors.floor.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sharing Type</label>
          <select
            {...register('sharing_type', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select</option>
            <option value="1">Single</option>
            <option value="2">Double</option>
            <option value="3">Triple</option>
            <option value="4">Quad</option>
          </select>
          {errors.sharing_type && <p className="text-red-500 text-xs mt-1">{errors.sharing_type.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
          <select
            {...register('room_type')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select</option>
            <option value="ac">AC</option>
            <option value="non_ac">Non-AC</option>
          </select>
          {errors.room_type && <p className="text-red-500 text-xs mt-1">{errors.room_type.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent (₹)</label>
          <input
            type="number"
            {...register('monthly_rent', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.monthly_rent && <p className="text-red-500 text-xs mt-1">{errors.monthly_rent.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Amenities (comma-separated)</label>
        <textarea
          {...register('amenities')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={2}
          placeholder="e.g., WiFi, Cooler, Geyser"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {isLoading ? 'Saving...' : 'Save Room'}
        </button>
      </div>
    </form>
  )
}
