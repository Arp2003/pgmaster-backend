import React from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/hooks/useAuth'

export const Navbar = () => {
  const { user } = useAuthStore()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="hidden sm:inline font-bold text-lg">PGMaster</span>
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-6">
          {!user && (
            <>
              <Link href="/pricing" className="text-sm text-slate-300 hover:text-white transition">
                Pricing
              </Link>
            </>
          )}
          {user ? (
            <>
              <span className="text-sm text-slate-300">Welcome, {user.first_name}</span>
              <Link href={user.role === 'tenant' ? '/tenant/settings' : '/dashboard/settings'} className="text-sm text-slate-300 hover:text-white transition">
                Settings
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm text-slate-300 hover:text-white transition">
                Login
              </Link>
              <Link href="/auth/register" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
