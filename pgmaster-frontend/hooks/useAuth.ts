import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface TenantDetails {
  monthly_rent?: number
  room_number?: string
  bed_number?: string
}

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  phone: string
  role: 'super_admin' | 'pg_owner' | 'staff' | 'tenant'
  is_verified: boolean

  // ✅ FIX FOR VERCEL BUILD ERROR
  tenant_details?: TenantDetails | null
}

interface AuthStore {
  user: User | null
  token: string | null
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
)