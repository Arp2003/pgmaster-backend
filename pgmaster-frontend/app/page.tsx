'use client'

import React from 'react'
import Link from 'next/link'
import { CheckCircle, Users, TrendingUp, Shield, Zap, BarChart3 } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
            ThePGMaster
          </div>
          <div className="flex gap-4">
            <Link href="/auth/login" className="px-4 py-2 text-slate-300 hover:text-white transition">
              Login
            </Link>
            <Link href="/auth/register" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Manage Your PG Like Never Before
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            PGMaster is the all-in-one platform for managing paying guest homes in India.
            Handle rooms, tenants, payments, and complaints with ease.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/register" className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition">
              Start Free Trial
            </Link>
            <a href="#pricing" className="px-8 py-3 border border-indigo-400 text-indigo-400 hover:bg-indigo-400/10 rounded-lg font-semibold transition">
              View Pricing
            </a>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-indigo-500/50 transition">
            <Users className="w-12 h-12 text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Tenant Management</h3>
            <p className="text-slate-300">Complete tenant lifecycle from join to vacate with automated workflows.</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-indigo-500/50 transition">
            <TrendingUp className="w-12 h-12 text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Rent Collection</h3>
            <p className="text-slate-300">Automated monthly rent generation with payment tracking and receipts.</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-indigo-500/50 transition">
            <BarChart3 className="w-12 h-12 text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Analytics & Reports</h3>
            <p className="text-slate-300">Real-time occupancy, income reports, and business intelligence.</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-indigo-500/50 transition">
            <Shield className="w-12 h-12 text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Secure & Reliable</h3>
            <p className="text-slate-300">Enterprise-grade security with encrypted data and automated backups.</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-indigo-500/50 transition">
            <Zap className="w-12 h-12 text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Fast & Easy</h3>
            <p className="text-slate-300">Intuitive interface that saves you hours every week on operations.</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-indigo-500/50 transition">
            <CheckCircle className="w-12 h-12 text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Support & Training</h3>
            <p className="text-slate-300">24/7 support team and comprehensive documentation to help you succeed.</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-8 mb-20 text-center">
          <div>
            <div className="text-4xl font-bold text-indigo-400 mb-2">500+</div>
            <p className="text-slate-300">Active Users</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-indigo-400 mb-2">5000+</div>
            <p className="text-slate-300">Properties Managed</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-indigo-400 mb-2">₹50Cr+</div>
            <p className="text-slate-300">Rent Processed</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-indigo-400 mb-2">99.9%</div>
            <p className="text-slate-300">Uptime</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your PG?</h2>
          <p className="text-lg text-indigo-100 mb-8">Join hundreds of PG owners already using PGMaster to streamline operations.</p>
          <Link href="/auth/register" className="px-8 py-3 bg-white text-indigo-600 hover:bg-slate-100 rounded-lg font-semibold transition inline-block">
            Start Your Free Trial Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-slate-400">
            <p>&copy; 2026 PGMaster. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
