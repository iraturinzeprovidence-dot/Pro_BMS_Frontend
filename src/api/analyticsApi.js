import api from './axios'

export const analyticsApi = {
    getOverview:       () => api.get('/analytics/overview'),
    getSalesChart:     () => api.get('/analytics/sales-chart'),
    getExpensesChart:  () => api.get('/analytics/expenses-chart'),
    getTopProducts:    () => api.get('/analytics/top-products'),
    getTopCustomers:   () => api.get('/analytics/top-customers'),
    getOrderStatus:    () => api.get('/analytics/order-status'),
    getInventoryChart: () => api.get('/analytics/inventory-chart'),
}