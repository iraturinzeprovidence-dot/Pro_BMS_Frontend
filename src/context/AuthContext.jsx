import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser]           = useState(null)
    const [profile, setProfile]     = useState(null)
    const [loading, setLoading]     = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        const saved = localStorage.getItem('user')
        if (token && saved) {
            const parsedUser = JSON.parse(saved)
            setUser(parsedUser)

            // If employee fetch their profile to get permissions
            if (parsedUser.role === 'employee') {
                api.get('/hr/my-profile')
                    .then(r => setProfile(r.data))
                    .catch(() => setProfile(null))
                    .finally(() => setLoading(false))
            } else {
                setLoading(false)
            }
        } else {
            setLoading(false)
        }
    }, [])

    const login = async (email, password) => {
        const response    = await api.post('/auth/login', { email, password })
        const { token, user } = response.data
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        setUser(user)

        // Fetch employee profile after login if employee
        if (user.role === 'employee') {
            try {
                const r = await api.get('/hr/my-profile')
                setProfile(r.data)
            } catch {
                setProfile(null)
            }
        }

        return user
    }

    const logout = async () => {
        try { await api.post('/auth/logout') } catch {}
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
        setProfile(null)
    }

    return (
        <AuthContext.Provider value={{ user, profile, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)