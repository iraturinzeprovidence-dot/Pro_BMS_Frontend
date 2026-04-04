import api from './axios'

export const pdfApi = {
    exportOrder: (orderId) =>
        api.get(`/pdf/order/${orderId}`, { responseType: 'blob' }),

    exportTransactions: (params) =>
        api.get('/pdf/transactions', { params, responseType: 'blob' }),

    exportEmployees: () =>
        api.get('/pdf/employees', { responseType: 'blob' }),
}

export const downloadPdf = (blob, filename) => {
    const url  = window.URL.createObjectURL(new Blob([blob]))
    const link = document.createElement('a')
    link.href  = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
}