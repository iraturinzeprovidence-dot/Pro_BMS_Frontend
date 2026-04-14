import api from './axios'

export const salesApi = {

    // Stats
    getOrderStats:    () => api.get('/sales/stats'),
    getCustomerStats: () => api.get('/sales/customer-stats'),

    // Customers
    getCustomers:    (params)   => api.get('/sales/customers', { params }),
    createCustomer:  (data)     => api.post('/sales/customers', data),
    updateCustomer:  (id, data) => api.put(`/sales/customers/${id}`, data),
    deleteCustomer:  (id)       => api.delete(`/sales/customers/${id}`),

    // Orders
    getOrders:    (params)   => api.get('/sales/orders', { params }),
    createOrder:  (data)     => api.post('/sales/orders', data),
    updateOrder:  (id, data) => api.put(`/sales/orders/${id}`, data),
    deleteOrder:  (id)       => api.delete(`/sales/orders/${id}`),
    getOrder:     (id)       => api.get(`/sales/orders/${id}`),
    markOrderPaid: (id) => api.post(`/sales/orders/${id}/mark-paid`),
}