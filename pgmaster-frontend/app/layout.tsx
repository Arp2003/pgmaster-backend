'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Navbar } from '@/components/shared/Navbar'
import '@/styles/globals.css'

import { GoogleOAuthProvider } from '@react-oauth/google'

const queryClient = new QueryClient()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <GoogleOAuthProvider clientId="1073348136752-75cnmahs0rnm26cvlrpgifidjtivc2s3.apps.googleusercontent.com">
          <QueryClientProvider client={queryClient}>
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
          </QueryClientProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}
