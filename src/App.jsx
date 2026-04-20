import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'

import Homepage          from './pages/public/Homepage'
import Login             from './pages/Login'
import ForgotPassword    from './pages/ForgotPassword'
import ResetPassword     from './pages/ResetPassword'
import CustomerRegister  from './pages/public/CustomerRegister'
import JobApplication    from './pages/public/JobApplication'
import CustomerShop      from './pages/customer/CustomerShop'
import ProfileSettings   from './pages/profile/ProfileSettings'

import AdminDashboard      from './pages/dashboards/AdminDashboard'
import ManagerDashboard    from './pages/dashboards/ManagerDashboard'
import EmployeeDashboard   from './pages/dashboards/EmployeeDashboard'

import InventoryDashboard  from './pages/inventory/InventoryDashboard'
import Products            from './pages/inventory/Products'
import Categories          from './pages/inventory/Categories'

import SalesDashboard      from './pages/sales/SalesDashboard'
import Customers           from './pages/sales/Customers'
import Orders              from './pages/sales/Orders'

import PurchasingDashboard from './pages/purchasing/PurchasingDashboard'
import Suppliers           from './pages/purchasing/Suppliers'
import PurchaseOrders      from './pages/purchasing/PurchaseOrders'

import HRDashboard         from './pages/hr/HRDashboard'
import Employees           from './pages/hr/Employees'
import JobPositions        from './pages/hr/JobPositions'
import Candidates          from './pages/hr/Candidates'

import AccountingDashboard from './pages/accounting/AccountingDashboard'
import Transactions        from './pages/accounting/Transactions'

import AnalyticsDashboard  from './pages/analytics/AnalyticsDashboard'
import UserManagement      from './pages/admin/UserManagement'

function PrivateRoute({ children, role }) {
    const { user, loading } = useAuth()
    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
    )
    if (!user) return <Navigate to="/login" />
    if (role && user.role !== role) return <Navigate to="/login" />
    return <Layout>{children}</Layout>
}

function CustomerShopRoute({ children }) {
    const { user, loading } = useAuth()
    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
    )
    if (!user) return <Navigate to="/login" />
    if (user.role !== 'customer') return <Navigate to="/admin/dashboard" />
    return children
}

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* ===== PUBLIC PAGES ===== */}
                <Route path="/"                element={<Homepage />}         />
                <Route path="/home"            element={<Homepage />}         />
                <Route path="/login"           element={<Login />}            />
                <Route path="/register"        element={<CustomerRegister />} />
                <Route path="/careers"         element={<JobApplication />}   />
                <Route path="/forgot-password" element={<ForgotPassword />}   />
                <Route path="/reset-password"  element={<ResetPassword />}    />

                {/* ===== CUSTOMER SHOP ===== */}
                <Route path="/shop" element={
                    <CustomerShopRoute><CustomerShop /></CustomerShopRoute>
                } />

                {/* ===== PROFILE ===== */}
                <Route path="/profile" element={
                    <PrivateRoute><ProfileSettings /></PrivateRoute>
                } />

                {/* ===== ADMIN ===== */}
                <Route path="/admin/dashboard" element={
                    <PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>
                } />
                <Route path="/admin/users" element={
                    <PrivateRoute role="admin"><UserManagement /></PrivateRoute>
                } />

                {/* ===== MANAGER ===== */}
                <Route path="/manager/dashboard" element={
                    <PrivateRoute role="manager"><ManagerDashboard /></PrivateRoute>
                } />

                {/* ===== EMPLOYEE ===== */}
                <Route path="/employee/dashboard" element={
                    <PrivateRoute role="employee"><EmployeeDashboard /></PrivateRoute>
                } />

                {/* ===== INVENTORY ===== */}
                <Route path="/inventory/dashboard"  element={<PrivateRoute><InventoryDashboard /></PrivateRoute>} />
                <Route path="/inventory/products"   element={<PrivateRoute><Products /></PrivateRoute>}          />
                <Route path="/inventory/categories" element={<PrivateRoute><Categories /></PrivateRoute>}        />

                {/* ===== SALES ===== */}
                <Route path="/sales/dashboard" element={<PrivateRoute><SalesDashboard /></PrivateRoute>} />
                <Route path="/sales/customers" element={<PrivateRoute><Customers /></PrivateRoute>}      />
                <Route path="/sales/orders"    element={<PrivateRoute><Orders /></PrivateRoute>}         />

                {/* ===== PURCHASING ===== */}
                <Route path="/purchasing/dashboard" element={<PrivateRoute><PurchasingDashboard /></PrivateRoute>} />
                <Route path="/purchasing/suppliers" element={<PrivateRoute><Suppliers /></PrivateRoute>}           />
                <Route path="/purchasing/orders"    element={<PrivateRoute><PurchaseOrders /></PrivateRoute>}      />

                {/* ===== HR ===== */}
                <Route path="/hr/dashboard"  element={<PrivateRoute><HRDashboard /></PrivateRoute>}  />
                <Route path="/hr/employees"  element={<PrivateRoute><Employees /></PrivateRoute>}    />
                <Route path="/hr/jobs"       element={<PrivateRoute><JobPositions /></PrivateRoute>} />
                <Route path="/hr/candidates" element={<PrivateRoute><Candidates /></PrivateRoute>}   />

                {/* ===== ACCOUNTING ===== */}
                <Route path="/accounting/dashboard"    element={<PrivateRoute><AccountingDashboard /></PrivateRoute>} />
                <Route path="/accounting/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>}         />

                {/* ===== ANALYTICS ===== */}
                <Route path="/analytics/dashboard" element={<PrivateRoute><AnalyticsDashboard /></PrivateRoute>} />

                {/* ===== FALLBACK ===== */}
                <Route path="*" element={<Navigate to="/" />} />

            </Routes>
        </BrowserRouter>
    )
}

export default App