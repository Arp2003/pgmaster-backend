'use client'

import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/hooks/useAuth'
import { paymentsAPI, complaintsAPI } from '@/lib/api-endpoints'
import client from '@/lib/api-client'
import { CreditCard, AlertCircle, Utensils, ArrowRight } from 'lucide-react'

export default function TenantHome() {
  const { user } = useAuthStore()

  const { data: menu } = useQuery({
    queryKey: ['mess-menu'],
    queryFn: () => client.get('/mess/menu/'),
  })

  const { data: complaints } = useQuery({
    queryKey: ['tenant-complaints'],
    queryFn: () => complaintsAPI.myComplaints(),
  })

  const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
  const menuList = menu?.data?.results || menu?.data || []
  const todayLunch = menuList.find((m: any) => m.day_of_week === todayIndex && m.meal_type === 'lunch')
  const activeComplaints = (complaints?.data?.results || complaints?.data || [])?.filter((c: any) => c.status !== 'resolved')

  return (
    <div className="p-8 bg-gray-50/50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Welcome back, {user?.first_name}! 👋</h1>
          <p className="text-gray-500 mt-2 text-lg">Here's what's happening at your PG today.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-50 rounded-lg text-green-600">
                <CreditCard className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Current Rent</p>
            </div>
            <p className="text-4xl font-black text-gray-900">₹{user?.tenant_details?.monthly_rent || '0'}</p>
            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-sm">
              <span className="text-gray-500">Status</span>
              <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full">Paid</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <ArrowRight className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Current Stay</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              Room {user?.tenant_details?.room_number || 'TBD'}
            </p>
            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-sm">
              <span className="text-gray-500">Bed</span>
              <span className="font-bold">{user?.tenant_details?.bed_number || 'N/A'}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                <Utensils className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Today's Lunch</p>
            </div>
            <p className="text-2xl font-bold text-gray-900 truncate">
              {todayLunch ? todayLunch.name : 'Menu not set'}
            </p>
            <a href="/tenant/mess" className="mt-4 text-sm text-indigo-600 font-bold flex items-center gap-1 hover:underline">
              View full menu <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-indigo-600 rounded-3xl p-10 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
              <p className="text-indigo-100 mb-8 max-w-sm">Facing any issues with water, electricity, or cleaning? Register a complaint and we'll fix it ASAP.</p>
              <a 
                href="/tenant/complaints"
                className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold hover:bg-indigo-50 transition inline-block shadow-lg"
              >
                Raise a Complaint
              </a>
            </div>
            <AlertCircle className="absolute -right-10 -bottom-10 w-64 h-64 text-white/10 -rotate-12" />
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-10 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Payment Receipt', icon: CreditCard, href: '/tenant/payments', color: 'bg-green-50 text-green-600' },
                { label: 'Mess Schedule', icon: Utensils, href: '/tenant/mess', color: 'bg-orange-50 text-orange-600' },
                { label: 'My Profile', icon: ArrowRight, href: '/tenant/profile', color: 'bg-blue-50 text-blue-600' },
                { label: 'Settings', icon: ArrowRight, href: '/tenant/settings', color: 'bg-gray-50 text-gray-600' },
              ].map((item) => (
                <a 
                  key={item.label}
                  href={item.href}
                  className="flex flex-col gap-4 p-6 rounded-2xl border border-gray-50 hover:bg-gray-50 transition group"
                >
                  <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center group-hover:scale-110 transition`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-gray-900">{item.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
