'use client'

import React, { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Bell, Lock, User, Eye, EyeOff } from 'lucide-react'
import client from '@/lib/api-client'

const settingsSchema = z.object({
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  current_password: z.string().optional(),
  new_password: z.string().optional(),
  confirm_password: z.string().optional(),
  email_notifications: z.boolean(),
  sms_notifications: z.boolean(),
  rent_reminders: z.boolean(),
  complaint_updates: z.boolean(),
}).refine((data) => {
  if (data.new_password && !data.current_password) return false
  return true
}, {
  message: 'Current password required to set new password',
  path: ['current_password'],
}).refine((data) => {
  if (data.new_password !== data.confirm_password) return false
  return true
}, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
})

type SettingsFormData = z.infer<typeof settingsSchema>

export default function TenantSettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Fetch current user profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await client.get('/auth/profile/')
      return response.data
    },
  })

  const { register, handleSubmit, formState: { errors }, reset } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      first_name: profile?.data?.first_name || '',
      last_name: profile?.data?.last_name || '',
      email: profile?.data?.email || '',
      phone: profile?.data?.phone || '',
      email_notifications: true,
      sms_notifications: false,
      rent_reminders: true,
      complaint_updates: true,
    },
  })

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: SettingsFormData) => {
      const response = await client.patch('/auth/profile/', {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
      })
      return response.data
    },
    onSuccess: () => {
      setSuccessMessage('Profile updated successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    },
  })

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: SettingsFormData) => {
      const response = await client.post('/auth/change-password/', {
        current_password: data.current_password,
        new_password: data.new_password,
      })
      return response.data
    },
    onSuccess: () => {
      setSuccessMessage('Password changed successfully!')
      reset()
      setTimeout(() => setSuccessMessage(''), 3000)
    },
  })

  const onSubmit = (data: SettingsFormData) => {
    if (activeTab === 'profile') {
      updateProfileMutation.mutate(data)
    } else if (activeTab === 'security' && data.new_password) {
      changePasswordMutation.mutate(data)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-2">Manage your account and preferences</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-4 border-b border-slate-700">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition ${
            activeTab === 'profile'
              ? 'border-indigo-600 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <User className="w-5 h-5" />
          Profile
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition ${
            activeTab === 'security'
              ? 'border-indigo-600 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Lock className="w-5 h-5" />
          Security
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition ${
            activeTab === 'notifications'
              ? 'border-indigo-600 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Bell className="w-5 h-5" />
          Notifications
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">First Name</label>
              <input
                {...register('first_name')}
                type="text"
                className="w-full px-4 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              {errors.first_name && <p className="text-red-400 text-sm mt-1">{errors.first_name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Last Name</label>
              <input
                {...register('last_name')}
                type="text"
                className="w-full px-4 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              {errors.last_name && <p className="text-red-400 text-sm mt-1">{errors.last_name.message}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-4 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
              <input
                {...register('phone')}
                type="tel"
                className="w-full px-4 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
          >
            {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Current Password</label>
            <div className="relative">
              <input
                {...register('current_password')}
                type={showPassword ? 'text' : 'password'}
                className="w-full px-4 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.current_password && <p className="text-red-400 text-sm mt-1">{errors.current_password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
            <input
              {...register('new_password')}
              type="password"
              className="w-full px-4 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            {errors.new_password && <p className="text-red-400 text-sm mt-1">{errors.new_password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
            <input
              {...register('confirm_password')}
              type="password"
              className="w-full px-4 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            {errors.confirm_password && <p className="text-red-400 text-sm mt-1">{errors.confirm_password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={changePasswordMutation.isPending}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
          >
            {changePasswordMutation.isPending ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                {...register('email_notifications')}
                type="checkbox"
                id="email_notifications"
                className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="email_notifications" className="text-white cursor-pointer">
                <span className="font-medium">Email Notifications</span>
                <p className="text-sm text-slate-400">Receive email notifications for important events</p>
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                {...register('rent_reminders')}
                type="checkbox"
                id="rent_reminders"
                className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="rent_reminders" className="text-white cursor-pointer">
                <span className="font-medium">Rent Reminders</span>
                <p className="text-sm text-slate-400">Get notified before your rent is due</p>
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                {...register('complaint_updates')}
                type="checkbox"
                id="complaint_updates"
                className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="complaint_updates" className="text-white cursor-pointer">
                <span className="font-medium">Complaint Updates</span>
                <p className="text-sm text-slate-400">Get notified when your complaint status changes</p>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition"
          >
            Save Preferences
          </button>
        </form>
      )}
    </div>
  )
}
