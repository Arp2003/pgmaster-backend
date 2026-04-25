'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { paymentsAPI } from '@/lib/api-endpoints'

export default function PaymentsPage() {
  const queryClient = useQueryClient()
  
  const { data: payments, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: () => paymentsAPI.pendingPayments(),
  })

  const markAsPaidMutation = useMutation({
    mutationFn: ({ id, amount }: { id: number, amount: number }) => 
      paymentsAPI.recordPayment(id, { amount, payment_method: 'cash' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
    },
  })

  const handleMarkAsPaid = (id: number, amount: number) => {
    if (confirm('Mark this payment as paid?')) {
      markAsPaidMutation.mutate({ id, amount })
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Payments</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-2">Pending Amount</p>
          <p className="text-3xl font-bold">₹0</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-2">This Month Collection</p>
          <p className="text-3xl font-bold">₹0</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-2">Total Tenants</p>
          <p className="text-3xl font-bold">0</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">Tenant</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Month</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Due Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(payments?.data?.results || payments?.data || [])?.map((payment: any) => (
                <tr key={payment.id} className="border-b border-border hover:bg-muted/50">
                  <td className="px-6 py-3 text-sm">{payment.tenant_details?.name}</td>
                  <td className="px-6 py-3 text-sm">{payment.month}</td>
                  <td className="px-6 py-3 text-sm">₹{payment.amount}</td>
                  <td className="px-6 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm">{payment.due_date}</td>
                  <td className="px-6 py-3 text-sm">
                    {payment.status !== 'paid' && (
                      <button
                        onClick={() => handleMarkAsPaid(payment.id, payment.amount)}
                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                      >
                        Mark as Paid
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
  )
}
