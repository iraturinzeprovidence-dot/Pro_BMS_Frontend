import axios from 'axios'

const imageApi = axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: false,
})

imageApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

export const uploadAvatar = async (file) => {
    const formData = new FormData()
    formData.append('avatar', file)
    const r = await imageApi.post('/upload/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return r.data
}

export const uploadProductImage = async (productId, file) => {
    const formData = new FormData()
    formData.append('image', file)
    const r = await imageApi.post(`/upload/product/${productId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return r.data
}