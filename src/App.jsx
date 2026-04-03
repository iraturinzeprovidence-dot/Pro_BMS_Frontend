import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import AdminDashboard    from './pages/dashboards/AdminDashboard'
import ManagerDashboard  from './pages/dashboards/ManagerDashboard'
import EmployeeDashboard from './pages/dashboards/EmployeeDashboard'

function PrivateRoute({ children, role }) {
    const { user, loading } = useAuth()
    if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>
    if (!user) return <Navigate to="/login" />
    if (role && user.role !== role) return <Navigate to="/login" />
    return children
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/admin/dashboard" element={
                    <PrivateRoute role="admin">
                        <AdminDashboard />
                    </PrivateRoute>
                } />
                <Route path="/manager/dashboard" element={
                    <PrivateRoute role="manager">
                        <ManagerDashboard />
                    </PrivateRoute>
                } />
                <Route path="/employee/dashboard" element={
                    <PrivateRoute role="employee">
                        <EmployeeDashboard />
                    </PrivateRoute>
                } />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App