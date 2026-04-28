'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useRegister, useGoogleLogin } from '@/hooks/useAuthMutations'
import { GoogleLogin } from '@react-oauth/google'

export default function RegisterPage() {
  const router = useRouter()
  const { mutate: register, isPending } = useRegister()
  const { mutate: googleLogin, isPending: isGooglePending } = useGoogleLogin()

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    password: '',
    password2: '',
    role: 'tenant',
  })

  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.password2) {
      setError('Passwords do not match')
      return
    }

    register(formData, {
      onSuccess: () => {
        router.push('/auth/login?registered=true')
      },
      onError: (error: any) => {
        const errorData = error.response?.data
        if (typeof errorData === 'object') {
          const firstError = Object.values(errorData)[0]
          setError(Array.isArray(firstError) ? firstError[0] : 'Registration failed')
        } else {
          setError('Registration failed. Please check your connection.')
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
            <p className="text-gray-600 mt-2">Create your account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-4 mb-6 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setFormData({ ...formData, role: 'pg_owner' })}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
                formData.role === 'pg_owner' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              PG Owner
            </button>
            <button
              onClick={() => setFormData({ ...formData, role: 'tenant' })}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
                formData.role === 'tenant' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Tenant
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={formData.password2}
                onChange={(e) => setFormData({ ...formData, password2: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition duration-200 disabled:opacity-50"
            >
              {isPending ? 'Registering...' : 'Register'}
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

            <div className="mt-6 flex justify-center flex-col items-center gap-2">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  if (credentialResponse.credential) {
                    googleLogin({ 
                      token: credentialResponse.credential,
                      role: formData.role 
                    }, {
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
                }}
                onError={() => {
                  console.error('Login Failed')
                }}
              />
              {isGooglePending && (
                <p className="text-sm text-gray-500">
                  Signing up with Google...
                </p>
              )}
            </div>
          </div>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
