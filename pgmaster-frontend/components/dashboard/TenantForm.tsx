import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const tenantSchema = z.object({
  tenant_name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number required'),
  email: z.string().email('Valid email required'),
  aadhar_number: z.string().min(12, 'Valid Aadhar required'),
  permanent_address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().length(6, 'Pincode must be 6 digits'),
  institution_name: z.string().optional(),
  join_date: z.string().min(1, 'Join date is required'),
  monthly_rent: z.number().positive('Rent must be positive'),
  security_deposit: z.number().nonnegative('Security deposit required'),
  bed: z.number().int('Bed is required'),
})

type TenantFormData = z.infer<typeof tenantSchema>

interface TenantFormProps {
  onSubmit: (data: TenantFormData) => Promise<void>
  isLoading?: boolean
  initialData?: Partial<TenantFormData>
  beds?: Array<{ id: number; bed_number: string; room_number: string; sharing_type: number }>
}

export function TenantForm({ onSubmit, isLoading = false, initialData, beds = [] }: TenantFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<TenantFormData>({
    resolver: zodResolver(tenantSchema),
    defaultValues: initialData,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tenant Name</label>
          <input
            type="text"
            {...register('tenant_name')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Full name"
          />
          {errors.tenant_name && <p className="text-red-500 text-xs mt-1">{errors.tenant_name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            {...register('phone')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="10-digit number"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number</label>
          <input
            type="text"
            {...register('aadhar_number')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="12-digit Aadhar"
          />
          {errors.aadhar_number && <p className="text-red-500 text-xs mt-1">{errors.aadhar_number.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Permanent Address</label>
        <textarea
          {...register('permanent_address')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={2}
          placeholder="Complete home address"
        />
        {errors.permanent_address && <p className="text-red-500 text-xs mt-1">{errors.permanent_address.message}</p>}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input
            type="text"
            {...register('city')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
          <input
            type="text"
            {...register('state')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
          <input
            type="text"
            {...register('pincode')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">College/Company Name</label>
        <input
          type="text"
          {...register('institution_name')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Where the tenant works/studies"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
          <input
            type="date"
            {...register('join_date')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.join_date && <p className="text-red-500 text-xs mt-1">{errors.join_date.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bed</label>
          <select
            {...register('bed', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Bed</option>
            {beds.map((bed: any) => (
              <option key={bed.id} value={bed.id}>
                Room {bed.room_number} ({bed.sharing_type} Sharing) - Bed {bed.bed_number}
              </option>
            ))}
          </select>
          {errors.bed && <p className="text-red-500 text-xs mt-1">{errors.bed.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent (₹)</label>
          <input
            type="number"
            {...register('monthly_rent', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.monthly_rent && <p className="text-red-500 text-xs mt-1">{errors.monthly_rent.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Security Deposit (₹)</label>
          <input
            type="number"
            {...register('security_deposit', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.security_deposit && <p className="text-red-500 text-xs mt-1">{errors.security_deposit.message}</p>}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {isLoading ? 'Saving...' : 'Save Tenant'}
        </button>
      </div>
    </form>
  )
}
