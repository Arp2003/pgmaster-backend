'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

const pricingPlans = [
  {
    name: 'Starter',
    price: '₹999',
    period: '/month',
    description: 'Perfect for small properties',
    features: [
      'Up to 5 rooms',
      'Up to 20 tenants',
      'Basic payment tracking',
      'Email support',
      'Monthly reports',
      'Single user account',
    ],
    cta: 'Start Free Trial',
    highlighted: false,
  },
  {
    name: 'Growth',
    price: '₹1,999',
    period: '/month',
    description: 'For growing PG businesses',
    features: [
      'Up to 20 rooms',
      'Unlimited tenants',
      'Advanced payment tracking',
      'Priority email support',
      'Real-time analytics',
      'Up to 5 staff members',
      'Complaint management',
      'Notice system',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Premium',
    price: '₹4,999',
    period: '/month',
    description: 'For large operations',
    features: [
      'Unlimited rooms',
      'Unlimited tenants',
      'Full payment suite',
      '24/7 phone & email support',
      'Advanced analytics & AI insights',
      'Unlimited staff members',
      'Custom integrations',
      'API access',
      'White-label option',
      'Dedicated account manager',
    ],
    cta: 'Start Free Trial',
    highlighted: false,
  },
]

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState('monthly')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
            PGMaster
          </Link>
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

      {/* Pricing Header */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-slate-300 mb-8">Choose the perfect plan for your PG business. All plans include a 14-day free trial.</p>

          {/* Billing Toggle */}
          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                billingCycle === 'monthly'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                billingCycle === 'annual'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Annual (Save 20%)
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg p-8 border transition ${
                plan.highlighted
                  ? 'bg-indigo-600/20 border-indigo-500 ring-2 ring-indigo-500/50 scale-105'
                  : 'bg-slate-800/50 border-slate-700 hover:border-indigo-500/50'
              }`}
            >
              {plan.highlighted && (
                <div className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4 inline-block">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-slate-300 mb-6">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-slate-400">{plan.period}</span>
              </div>

              <Link
                href="/auth/register"
                className={`w-full block text-center py-3 rounded-lg font-semibold transition mb-8 ${
                  plan.highlighted
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-white'
                }`}
              >
                {plan.cta}
              </Link>

              <ul className="space-y-4">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-12 mb-16">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Frequently Asked Questions</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Can I change plans anytime?</h4>
              <p className="text-slate-300">Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Do you offer discounts for annual billing?</h4>
              <p className="text-slate-300">Yes! Annual plans come with 20% discount compared to monthly billing.</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-2">What payment methods do you accept?</h4>
              <p className="text-slate-300">We accept all major credit/debit cards, UPI, and bank transfers for Indian customers.</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Is there a contract or lock-in period?</h4>
              <p className="text-slate-300">No! Our plans are month-to-month with no contracts. Cancel anytime, no questions asked.</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Do you offer a free trial?</h4>
              <p className="text-slate-300">Yes! Every plan includes a 14-day free trial. No credit card required to start.</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-2">What if I exceed my plan limits?</h4>
              <p className="text-slate-300">We'll notify you before you hit the limit and help you upgrade to an appropriate plan.</p>
            </div>
          </div>
        </div>

        {/* Enterprise Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg p-12 text-center mb-16">
          <h3 className="text-3xl font-bold text-white mb-4">Need a Custom Plan?</h3>
          <p className="text-lg text-indigo-100 mb-6">For large enterprises or specific requirements, we offer custom plans.</p>
          <button className="px-8 py-3 bg-white text-indigo-600 hover:bg-slate-100 rounded-lg font-semibold transition">
            Contact Sales
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-400">
          <p>&copy; 2024 PGMaster. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
