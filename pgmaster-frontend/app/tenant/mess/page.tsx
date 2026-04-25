'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import client from '@/lib/api-client'
import { Utensils, Calendar } from 'lucide-react'

export default function TenantMess() {
  const { data: menu, isLoading } = useQuery({
    queryKey: ['mess-menu'],
    queryFn: () => client.get('/mess/menu/'),
  })

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const today = new Date().getDay() // 0 is Sunday
  const todayIndex = today === 0 ? 6 : today - 1 // Convert to 0=Monday, 6=Sunday

  if (isLoading) return <div className="p-8">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-indigo-600 rounded-xl text-white">
            <Utensils className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Weekly Menu</h1>
            <p className="text-gray-600">Check what's cooking in the mess today!</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Today's Special */}
          <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 overflow-hidden">
            <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-white font-bold flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Today's Menu ({days[todayIndex]})
              </h2>
              <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full uppercase tracking-wider font-bold">Live</span>
            </div>
            <div className="p-6 space-y-4">
              {['breakfast', 'lunch', 'snacks', 'dinner'].map(type => {
                const menuList = menu?.data?.results || menu?.data || []
                const item = menuList.find((m: any) => m.day_of_week === todayIndex && m.meal_type === type)
                return (
                  <div key={type} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-400" />
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-wide w-24">{type}</p>
                      <p className={`font-medium ${item ? 'text-gray-900' : 'text-gray-300 italic'}`}>
                        {item ? item.name : 'Not available'}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-indigo-900 rounded-2xl p-8 text-white flex flex-col justify-center relative overflow-hidden">
             <Utensils className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 rotate-12" />
             <h3 className="text-xl font-bold mb-2">Meal Timings</h3>
             <div className="space-y-3 relative z-10">
               <div className="flex justify-between text-indigo-200">
                 <span>Breakfast</span>
                 <span className="font-mono text-white">08:00 AM - 10:00 AM</span>
               </div>
               <div className="flex justify-between text-indigo-200">
                 <span>Lunch</span>
                 <span className="font-mono text-white">01:00 PM - 03:00 PM</span>
               </div>
               <div className="flex justify-between text-indigo-200">
                 <span>Snacks</span>
                 <span className="font-mono text-white">05:30 PM - 06:30 PM</span>
               </div>
               <div className="flex justify-between text-indigo-200">
                 <span>Dinner</span>
                 <span className="font-mono text-white">08:30 PM - 10:30 PM</span>
               </div>
             </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-6">Full Weekly Schedule</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {days.map((day, index) => (
            <div key={day} className={`bg-white border rounded-xl p-4 transition hover:shadow-md ${index === todayIndex ? 'border-indigo-600 ring-1 ring-indigo-600' : 'border-gray-200'}`}>
              <h3 className="font-bold text-gray-900 mb-4 flex items-center justify-between">
                {day}
                {index === todayIndex && <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full uppercase">Today</span>}
              </h3>
              <div className="space-y-3">
                {['breakfast', 'lunch', 'dinner'].map(type => {
                  const menuList = menu?.data?.results || menu?.data || []
                  const item = menuList.find((m: any) => m.day_of_week === index && m.meal_type === type)
                  return (
                    <div key={type} className="text-xs">
                      <span className="text-gray-400 uppercase font-bold block mb-0.5">{type}</span>
                      <p className={item ? 'text-gray-700 font-medium' : 'text-gray-300 italic'}>
                        {item ? item.name : '-'}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
