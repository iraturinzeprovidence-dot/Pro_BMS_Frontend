import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login               from './pages/Login'
import AdminDashboard      from './pages/dashboards/AdminDashboard'
import ManagerDashboard    from './pages/dashboards/ManagerDashboard'
import EmployeeDashboard   from './pages/dashboards/EmployeeDashboard'
import InventoryDashboard  from './pages/inventory/InventoryDashboard'
import Products            from './pages/inventory/Products'
import Categories          from './pages/inventory/Categories'

function PrivateRoute({ children, role }) {
    const { user, loading } = useAuth()
    if (loading) return <div className="flex items-center justify-center h-screen text-gray-400">Loading...</div>
    if (!user) return <Navigate to="/login" />
    if (role && user.role !== role) return <Navigate to="/login" />
    return <Layout>{children}</Layout>
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                {/* Admin */}
                <Route path="/admin/dashboard" element={
                    <PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>
                } />

                {/* Manager */}
                <Route path="/manager/dashboard" element={
                    <PrivateRoute role="manager"><ManagerDashboard /></PrivateRoute>
                } />

                {/* Employee */}
                <Route path="/employee/dashboard" element={
                    <PrivateRoute role="employee"><EmployeeDashboard /></PrivateRoute>
                } />

                {/* Inventory */}
                <Route path="/inventory/dashboard" element={
                    <PrivateRoute><InventoryDashboard /></PrivateRoute>
                } />
                <Route path="/inventory/products" element={
                    <PrivateRoute><Products /></PrivateRoute>
                } />
                <Route path="/inventory/categories" element={
                    <PrivateRoute><Categories /></PrivateRoute>
                } />

                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App