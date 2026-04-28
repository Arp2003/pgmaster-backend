'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import client from '@/lib/api-client'
import { Plus, Utensils } from 'lucide-react'

export default function MessPage() {
  const queryClient = useQueryClient()
  
  const { data: mess, isLoading: messLoading } = useQuery({
    queryKey: ['mess-profile'],
    queryFn: () => client.get('/mess/profile/my_mess/'),
  })

  const { data: menu, isLoading: menuLoading } = useQuery({
    queryKey: ['mess-menu'],
    queryFn: () => client.get('/mess/menu/'),
  })

  const [isAddingItem, setIsAddingItem] = useState(false)
  const [newItem, setNewItem] = useState({
    name: '',
    meal_type: 'breakfast',
    day_of_week: 0,
    price: 0,
  })

  const addItemMutation = useMutation({
    mutationFn: (data: any) => client.post('/mess/menu/', { ...data, mess: mess?.data?.id }),
    onSuccess: () => {
      setIsAddingItem(false)
      queryClient.invalidateQueries({ queryKey: ['mess-menu'] })
    },
  })

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  if (messLoading || menuLoading) return <div className="p-8">Loading...</div>

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Utensils className="text-indigo-600" />
            {mess?.data?.name || 'Restaurant Profile'}
          </h1>
          <p className="text-muted-foreground mt-2">Manage your PG's food menu and mess settings.</p>
        </div>
        <button
          onClick={() => setIsAddingItem(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          Add Menu Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {days.map((day, index) => (
          <div key={day} className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-bold text-center mb-4 pb-2 border-b border-border">{day}</h3>
            <div className="space-y-4">
              {['breakfast', 'lunch', 'snacks', 'dinner'].map(type => {
                const menuList = menu?.data?.results || menu?.data || []
                const item = menuList.find((m: any) => m.day_of_week === index && m.meal_type === type)
                return (
                  <div key={type} className="text-sm">
                    <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">{type}</p>
                    {item ? (
                      <div className="p-2 bg-indigo-50 border border-indigo-100 rounded text-indigo-700 font-medium">
                        {item.name}
                      </div>
                    ) : (
                      <div className="p-2 bg-gray-50 border border-gray-100 rounded text-gray-400 italic">
                        Not set
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {isAddingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Menu Item</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Item Name</label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-2"
                  value={newItem.name}
                  onChange={e => setNewItem({...newItem, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Meal Type</label>
                <select
                  className="w-full border rounded-lg p-2"
                  value={newItem.meal_type}
                  onChange={e => setNewItem({...newItem, meal_type: e.target.value})}
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="snacks">Snacks</option>
                  <option value="dinner">Dinner</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Day</label>
                <select
                  className="w-full border rounded-lg p-2"
                  value={newItem.day_of_week}
                  onChange={e => setNewItem({...newItem, day_of_week: parseInt(e.target.value)})}
                >
                  {days.map((day, i) => <option key={day} value={i}>{day}</option>)}
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setIsAddingItem(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => addItemMutation.mutate(newItem)}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Save Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
