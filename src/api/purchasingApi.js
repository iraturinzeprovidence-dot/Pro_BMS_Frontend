import api from './axios'

export const purchasingApi = {

    getStats:         ()           => api.get('/purchasing/stats'),
    getSupplierStats: ()           => api.get('/purchasing/supplier-stats'),

    getSuppliers:    (params)     => api.get('/purchasing/suppliers', { params }),
    createSupplier:  (data)       => api.post('/purchasing/suppliers', data),
    updateSupplier:  (id, data)   => api.put(`/purchasing/suppliers/${id}`, data),
    deleteSupplier:  (id)         => api.delete(`/purchasing/suppliers/${id}`),

    getOrders:    (params)   => api.get('/purchasing/orders', { params }),
    createOrder:  (data)     => api.post('/purchasing/orders', data),
    updateOrder:  (id, data) => api.put(`/purchasing/orders/${id}`, data),
    deleteOrder:  (id)       => api.delete(`/purchasing/orders/${id}`),
}