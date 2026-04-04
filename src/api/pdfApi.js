import api from './axios'

export const pdfApi = {
    exportOrder: (orderId) =>
        api.get(`/pdf/order/${orderId}`, { responseType: 'blob' }),

    exportTransactions: (params = {}) =>
        api.get('/pdf/transactions', { params, responseType: 'blob' }),

    exportEmployees: () =>
        api.get('/pdf/employees', { responseType: 'blob' }),
}

export const downloadPdf = async (blob, filename) => {
    try {
        // Check if response is an error JSON instead of PDF
        const text = await blob.text()
        try {
            const json = JSON.parse(text)
            console.error('PDF API Error:', json)
            alert('PDF Error: ' + (json.message ?? JSON.stringify(json)))
            return
        } catch (e) {
            // Not JSON, it's a real PDF blob — proceed
        }

        const url  = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }))
        const link = document.createElement('a')
        link.href  = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
    } catch (err) {
        console.error('PDF download failed:', err)
        alert('PDF download failed: ' + err.message)
    }
}