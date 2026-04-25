'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLogin, useGoogleLogin } from '@/hooks/useAuthMutations'
import { useAuthStore } from '@/hooks/useAuth'
import { GoogleLogin } from '@react-oauth/google'

export default function LoginPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { mutate: login, isPending } = useLogin()
  const { mutate: googleLogin, isPending: isGooglePending } = useGoogleLogin()

  const [role, setRole] = useState('pg_owner')
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  React.useEffect(() => {
    if (user) {
      if (user.role === 'pg_owner') {
        router.push('/dashboard')
      } else {
        router.push('/tenant/home')
      }
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    login(formData, {
      onSuccess: (response) => {
        const userRole = response.data.user.role
        if (userRole === 'pg_owner') {
          router.push('/dashboard')
        } else {
          router.push('/tenant/home')
        }
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">PGMaster</h1>
            <p className="text-gray-600 mt-2">Login to your account</p>
          </div>

          <div className="flex gap-4 mb-6 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setRole('pg_owner')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
                role === 'pg_owner' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              PG Owner
            </button>
            <button
              onClick={() => setRole('tenant')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
                role === 'tenant' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Tenant
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition duration-200 disabled:opacity-50"
            >
              {isPending ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  if (credentialResponse.credential) {
                    googleLogin({ 
                      token: credentialResponse.credential,
                      role 
                    }, {
                      onSuccess: () => router.push('/dashboard'),
                    })
                  }
                }}
                onError={() => {
                  console.error('Login Failed')
                }}
              />
            </div>
          </div>

          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
