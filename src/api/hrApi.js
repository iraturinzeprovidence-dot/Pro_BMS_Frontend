import api from './axios'

export const hrApi = {

    getStats:          ()           => api.get('/hr/stats'),
    getJobStats:       ()           => api.get('/hr/job-stats'),
    getCandidateStats: ()           => api.get('/hr/candidate-stats'),
    getDepartments:    ()           => api.get('/hr/departments'),

    getEmployees:    (params)     => api.get('/hr/employees', { params }),
    createEmployee:  (data)       => api.post('/hr/employees', data),
    updateEmployee:  (id, data)   => api.put(`/hr/employees/${id}`, data),
    deleteEmployee:  (id)         => api.delete(`/hr/employees/${id}`),

    getJobPositions:    (params)     => api.get('/hr/job-positions', { params }),
    createJobPosition:  (data)       => api.post('/hr/job-positions', data),
    updateJobPosition:  (id, data)   => api.put(`/hr/job-positions/${id}`, data),
    deleteJobPosition:  (id)         => api.delete(`/hr/job-positions/${id}`),

    getCandidates:    (params)     => api.get('/hr/candidates', { params }),
    createCandidate:  (data)       => api.post('/hr/candidates', data),
    updateCandidate:  (id, data)   => api.put(`/hr/candidates/${id}`, data),
    deleteCandidate:  (id)         => api.delete(`/hr/candidates/${id}`),
    hireCandidate:    (id, data)   => api.post(`/hr/candidates/${id}/hire`, data),
}