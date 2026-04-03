import api from './axios'

export const inventoryApi = {

    // Stats
    getStats: () => api.get('/inventory/stats'),

    // Categories
    getCategories:       ()           => api.get('/inventory/categories'),
    createCategory:      (data)       => api.post('/inventory/categories', data),
    updateCategory:      (id, data)   => api.put(`/inventory/categories/${id}`, data),
    deleteCategory:      (id)         => api.delete(`/inventory/categories/${id}`),

    // Products
    getProducts:         (params)     => api.get('/inventory/products', { params }),
    createProduct:       (data)       => api.post('/inventory/products', data),
    updateProduct:       (id, data)   => api.put(`/inventory/products/${id}`, data),
    deleteProduct:       (id)         => api.delete(`/inventory/products/${id}`),
    getLowStock:         ()           => api.get('/inventory/low-stock'),
}