import api from './axios'

export const accountingApi = {
    getStats:         ()           => api.get('/accounting/stats'),
    getMonthlyReport: ()           => api.get('/accounting/monthly-report'),
    getTransactions:  (params)     => api.get('/accounting/transactions', { params }),
    createTransaction: (data)      => api.post('/accounting/transactions', data),
    updateTransaction: (id, data)  => api.put(`/accounting/transactions/${id}`, data),
    deleteTransaction: (id)        => api.delete(`/accounting/transactions/${id}`),
}