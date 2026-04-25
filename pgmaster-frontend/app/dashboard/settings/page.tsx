'use client'

import React, { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Settings, Bell, CreditCard, Users, Zap } from 'lucide-react'
import { apiClient } from '@/lib/api-client'

const pgSettingsSchema = z.object({
  property_name: z.string().min(3),
  address: z.string().min(5),
  contact_number: z.string().min(10),
  email: z.string().email(),
  rent_due_day: z.number().min(1).max(31),
  late_fee_percentage: z.number().min(0).max(100),
  payment_reminder_days: z.number().min(1).max(30),
  max_staff_members: z.number().min(1),
  auto_email_notifications: z.boolean(),
  auto_payment_reminders: z.boolean(),
})

type PGSettingsFormData = z.infer<typeof pgSettingsSchema>

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'financial' | 'notifications' | 'staff'>('general')
  const [successMessage, setSuccessMessage] = useState('')

  // Fetch PG settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['pgSettings'],
    queryFn: async () => {
      const response = await apiClient.get('/pg/profile/')
      return response.data
    },
  })

  const { register, handleSubmit, formState: { errors }, reset } = useForm<PGSettingsFormData>({
    resolver: zodResolver(pgSettingsSchema),
    defaultValues: {
      property_name: settings?.data?.property_name || '',
      address: settings?.data?.address || '',
      contact_number: settings?.data?.contact_number || '',
      email: settings?.data?.owner?.email || '',
      rent_due_day: settings?.data?.rent_due_day || 1,
      late_fee_percentage: settings?.data?.late_fee_percentage || 5,
      payment_reminder_days: settings?.data?.payment_reminder_days || 3,
      max_staff_members: settings?.data?.max_staff_members || 5,
      auto_email_notifications: true,
      auto_payment_reminders: true,
    },
  })

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (data: PGSettingsFormData) => {
      const response = await apiClient.patch('/pg/profile/', {
        property_name: data.property_name,
        address: data.address,
        contact_number: data.contact_number,
        rent_due_day: data.rent_due_day,
        late_fee_percentage: data.late_fee_percentage,
        payment_reminder_days: data.payment_reminder_days,
        max_staff_members: data.max_staff_members,
      })
      return response.data
    },
    onSuccess: () => {
      setSuccessMessage('Settings updated successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    },
  })

  const onSubmit = (data: PGSettingsFormData) => {
    updateSettingsMutation.mutate(data)
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
        <p className="text-slate-400 mt-2">Configure your property and system preferences</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-700 overflow-x-auto">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap transition ${
            activeTab === 'general'
              ? 'border-indigo-600 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="w-5 h-5" />
          General
        </button>
        <button
          onClick={() => setActiveTab('financial')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap transition ${
            activeTab === 'financial'
              ? 'border-indigo-600 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-5 h-5" />
          Financial
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap transition ${
            activeTab === 'notifications'
              ? 'border-indigo-600 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Bell className="w-5 h-5" />
          Notifications
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap transition ${
            activeTab === 'staff'
              ? 'border-indigo-600 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-5 h-5" />
          Staff
        </button>
      </div>

      {/* General Settings Tab */}
      {activeTab === 'general' && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Property Name</label>
            <input
              {...register('property_name')}
              type="text"
              className="w-full px-4 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            {errors.property_name && <p className="text-red-400 text-sm mt-1">{errors.property_name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Address</label>
            <textarea
              {...register('address')}
              rows={3}
              className="w-full px-4 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            ></textarea>
            {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address.message}</p>}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Contact Number</label>
              <input
                {...register('contact_number')}
                type="tel"
                className="w-full px-4 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              {errors.contact_number && <p className="text-red-400 text-sm mt-1">{errors.contact_number.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-4 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={updateSettingsMutation.isPending}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
          >
            {updateSettingsMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}

      {/* Financial Settings Tab */}
      {activeTab === 'financial' && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Rent Due Day</label>
            <p className="text-sm text-slate-400 mb-2">Day of month when rent is due (1-31)</p>
            <input
              {...register('rent_due_day', { valueAsNumber: true })}
              type="number"
              min="1"
              max="31"
              className="w-full px-4 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            {errors.rent_due_day && <p className="text-red-400 text-sm mt-1">{errors.rent_due_day.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Late Fee (%)</label>
            <p className="text-sm text-slate-400 mb-2">Percentage charged if rent is late</p>
            <input
              {...register('late_fee_percentage', { valueAsNumber: true })}
              type="number"
              min="0"
              max="100"
              step="0.5"
              className="w-full px-4 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            {errors.late_fee_percentage && <p className="text-red-400 text-sm mt-1">{errors.late_fee_percentage.message}</p>}
          </div>

          <button
            type="submit"
            disabled={updateSettingsMutation.isPending}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
          >
            {updateSettingsMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}

      {/* Notifications Settings Tab */}
      {activeTab === 'notifications' && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Payment Reminder Days</label>
            <p className="text-sm text-slate-400 mb-2">How many days before due date to send reminder</p>
            <input
              {...register('payment_reminder_days', { valueAsNumber: true })}
              type="number"
              min="1"
              max="30"
              className="w-full px-4 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            {errors.payment_reminder_days && <p className="text-red-400 text-sm mt-1">{errors.payment_reminder_days.message}</p>}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                {...register('auto_email_notifications')}
                type="checkbox"
                id="auto_email_notifications"
                className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="auto_email_notifications" className="text-white cursor-pointer">
                <span className="font-medium">Automatic Email Notifications</span>
                <p className="text-sm text-slate-400">Send automated emails for payments, notices, and complaints</p>
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                {...register('auto_payment_reminders')}
                type="checkbox"
                id="auto_payment_reminders"
                className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="auto_payment_reminders" className="text-white cursor-pointer">
                <span className="font-medium">Automatic Payment Reminders</span>
                <p className="text-sm text-slate-400">Automatically send payment reminders before due date</p>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={updateSettingsMutation.isPending}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
          >
            {updateSettingsMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}

      {/* Staff Settings Tab */}
      {activeTab === 'staff' && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Maximum Staff Members</label>
            <p className="text-sm text-slate-400 mb-2">Maximum number of staff members you can add to your property</p>
            <input
              {...register('max_staff_members', { valueAsNumber: true })}
              type="number"
              min="1"
              className="w-full px-4 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            {errors.max_staff_members && <p className="text-red-400 text-sm mt-1">{errors.max_staff_members.message}</p>}
          </div>

          <div className="bg-slate-700/50 border border-slate-600 rounded p-4">
            <p className="text-slate-300">
              <strong>Current Plan:</strong> {settings?.data?.subscription?.plan?.name || 'Basic'}
            </p>
            <p className="text-sm text-slate-400 mt-2">Upgrade your plan to add more staff members.</p>
          </div>

          <button
            type="submit"
            disabled={updateSettingsMutation.isPending}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
          >
            {updateSettingsMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}
    </div>
  )
}
