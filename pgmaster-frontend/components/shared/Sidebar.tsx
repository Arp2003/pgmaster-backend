import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Home,
  Users,
  DoorOpen,
  CreditCard,
  AlertCircle,
  FileText,
  Settings,
  LogOut,
  BarChart3,
} from 'lucide-react'
import { useAuthStore } from '@/hooks/useAuth'

export const Sidebar = () => {
  const { user, logout } = useAuthStore()
  const router = useRouter()

  const ownerLinks = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/dashboard/rooms', icon: DoorOpen, label: 'Rooms' },
    { href: '/dashboard/tenants', icon: Users, label: 'Tenants' },
    { href: '/dashboard/payments', icon: CreditCard, label: 'Payments' },
    { href: '/dashboard/complaints', icon: AlertCircle, label: 'Complaints' },
    { href: '/dashboard/mess', icon: FileText, label: 'Mess/Food' },
    { href: '/dashboard/reports', icon: BarChart3, label: 'Reports' },
    { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ]

  const tenantLinks = [
    { href: '/tenant/home', icon: Home, label: 'Home' },
    { href: '/tenant/payments', icon: CreditCard, label: 'Payments' },
    { href: '/tenant/complaints', icon: AlertCircle, label: 'Complaints' },
    { href: '/tenant/mess', icon: FileText, label: 'Mess/Food' },
    { href: '/tenant/profile', icon: Users, label: 'Profile' },
    { href: '/tenant/settings', icon: Settings, label: 'Settings' },
  ]

  const links = user?.role === 'pg_owner' ? ownerLinks : tenantLinks

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' })
    } catch {}
    logout()
    router.push('/auth/login')
  }

  return (
    <aside className="w-64 border-r border-border bg-card">
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-auto py-6">
          <nav className="px-4 space-y-2">
            {links.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="border-t border-border p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  )
}
