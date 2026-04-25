import client from './api-client'

export const authAPI = {
  register: (data: any) => client.post('/auth/register/', data),
  login: (data: any) => client.post('/auth/login/', data),
  googleLogin: (data: { token: string; role: string }) => client.post('/auth/google-login/', data),
  logout: (data: any) => client.post('/auth/logout/', data),
  profile: () => client.get('/auth/profile/me/'),
  updateProfile: (data: any) => client.put('/auth/profile/update_profile/', data),
  passwordReset: (data: any) => client.post('/auth/password-reset/', data),
  passwordResetRequest: (data: any) => client.post('/auth/password-reset-request/', data),
}

export const pgAPI = {
  getProfile: () => client.get('/pg/profile/my_pg/'),
  createProfile: (data: any) => client.post('/pg/profile/', data),
  updateProfile: (id: number, data: any) => client.put(`/pg/profile/${id}/`, data),
  getStaff: () => client.get('/pg/staff/'),
  createStaff: (data: any) => client.post('/pg/staff/', data),
}

export const roomsAPI = {
  list: (params?: any) => client.get('/rooms/', { params }),
  create: (data: any) => client.post('/rooms/', data),
  update: (id: number, data: any) => client.put(`/rooms/${id}/`, data),
  delete: (id: number) => client.delete(`/rooms/${id}/`),
  occupancySummary: () => client.get('/rooms/occupancy_summary/'),
  beds: (params?: any) => client.get('/rooms/beds/', { params }),
  listBeds: (params?: any) => client.get('/rooms/beds/', { params }),
}

export const tenantsAPI = {
  list: (params?: any) => client.get('/tenants/', { params }),
  create: (data: any) => client.post('/tenants/', data),
  update: (id: number, data: any) => client.put(`/tenants/${id}/`, data),
  delete: (id: number) => client.delete(`/tenants/${id}/`),
  moveToRoom: (id: number, data: any) => client.post(`/tenants/${id}/move_to_room/`, data),
  vacate: (id: number) => client.post(`/tenants/${id}/vacate/`, {}),
  active: () => client.get('/tenants/active_tenants/'),
}

export const paymentsAPI = {
  list: (params?: any) => client.get('/payments/', { params }),
  create: (data: any) => client.post('/payments/', data),
  recordPayment: (id: number, data: any) => client.post(`/payments/${id}/record_payment/`, data),
  generateMonthlyRent: (data: any) => client.post('/payments/generate_monthly_rent/', data),
  pendingPayments: () => client.get('/payments/pending_payments/'),
  myPayments: () => client.get('/payments/my_payments/'),
}

export const complaintsAPI = {
  list: (params?: any) => client.get('/complaints/', { params }),
  create: (data: any) => {
    const formData = new FormData()
    Object.keys(data).forEach(key => {
      formData.append(key, data[key])
    })
    return client.post('/complaints/', formData)
  },
  updateStatus: (id: number, data: any) => client.post(`/complaints/${id}/update_status/`, data),
  myComplaints: () => client.get('/complaints/my_complaints/'),
  openComplaints: () => client.get('/complaints/open_complaints/'),
}

export const reportsAPI = {
  occupancy: () => client.get('/reports/occupancy_report/'),
  pendingRent: () => client.get('/reports/rent_pending_report/'),
  monthlyIncome: () => client.get('/reports/monthly_income_report/'),
  tenantRegister: () => client.get('/reports/tenant_register_report/'),
  exportOccupancyCSV: () => client.get('/reports/export_occupancy_csv/'),
}

export const noticesAPI = {
  list: (params?: any) => client.get('/notices/', { params }),
  create: (data: any) => client.post('/notices/', data),
  send: (id: number) => client.post(`/notices/${id}/send_notice/`, {}),
}

export const subscriptionsAPI = {
  plans: () => client.get('/subscriptions/plans/'),
  current: () => client.get('/subscriptions/current_subscription/'),
  create: (data: any) => client.post('/subscriptions/', data),
}
