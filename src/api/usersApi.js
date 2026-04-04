import api from './axios'

export const usersApi = {
    getUsers:    (params)     => api.get('/users', { params }),
    createUser:  (data)       => api.post('/users', data),
    updateUser:  (id, data)   => api.put(`/users/${id}`, data),
    deleteUser:  (id)         => api.delete(`/users/${id}`),
    getStats:    ()           => api.get('/users/stats'),
}