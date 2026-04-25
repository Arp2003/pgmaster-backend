'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { paymentsAPI } from '@/lib/api-endpoints'

export default function TenantPayments() {
  const { data: payments, isLoading } = useQuery({
    queryKey: ['tenant-payments'],
    queryFn: () => paymentsAPI.myPayments(),
  })

  const handleDownloadReceipt = (payment: any) => {
    const receiptContent = `
      <html>
        <head>
          <title>Payment Receipt - ${payment.month}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; }
            .receipt-box { border: 2px solid #eee; padding: 30px; max-width: 600px; margin: auto; }
            .header { text-align: center; border-bottom: 2px solid #f97316; padding-bottom: 20px; margin-bottom: 30px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
            .label { color: #666; }
            .value { font-weight: bold; }
            .footer { margin-top: 40px; text-align: center; color: #999; font-size: 12px; }
            .status { color: green; font-weight: bold; text-transform: uppercase; }
          </style>
        </head>
        <body>
          <div class="receipt-box">
            <div class="header">
              <h1>PGMaster</h1>
              <p>Official Payment Receipt</p>
            </div>
            <div class="row"><span class="label">Receipt No:</span> <span class="value">#PAY-${payment.id}-${Date.now()}</span></div>
            <div class="row"><span class="label">Date:</span> <span class="value">${new Date().toLocaleDateString()}</span></div>
            <div class="row"><span class="label">Tenant Name:</span> <span class="value">${payment.tenant_details?.name || 'Tenant'}</span></div>
            <div class="row"><span class="label">Month:</span> <span class="value">${payment.month}</span></div>
            <div class="row"><span class="label">Amount Paid:</span> <span class="value">₹${payment.amount}</span></div>
            <div class="row"><span class="label">Payment Status:</span> <span class="status">${payment.status}</span></div>
            <div class="footer">
              <p>This is a computer-generated receipt and does not require a signature.</p>
              <p>Thank you for your stay!</p>
            </div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `
    const win = window.open('', '_blank')
    win?.document.write(receiptContent)
    win?.document.close()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Payment History</h1>

        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Month</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Due Date</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(payments?.data?.results || payments?.data || [])?.map((payment: any) => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm">{payment.month}</td>
                    <td className="px-6 py-3 text-sm font-medium">₹{payment.amount}</td>
                    <td className="px-6 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm">{payment.due_date}</td>
                    <td className="px-6 py-3 text-sm">
                      {payment.status === 'paid' && (
                        <button
                          onClick={() => handleDownloadReceipt(payment)}
                          className="text-indigo-600 hover:text-indigo-900 font-medium text-xs flex items-center gap-1"
                        >
                          Download Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
