import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login                from './pages/Login'
import AdminDashboard       from './pages/dashboards/AdminDashboard'
import ManagerDashboard     from './pages/dashboards/ManagerDashboard'
import EmployeeDashboard    from './pages/dashboards/EmployeeDashboard'
import InventoryDashboard   from './pages/inventory/InventoryDashboard'
import Products             from './pages/inventory/Products'
import Categories           from './pages/inventory/Categories'
import SalesDashboard       from './pages/sales/SalesDashboard'
import Customers            from './pages/sales/Customers'
import Orders               from './pages/sales/Orders'
import PurchasingDashboard  from './pages/purchasing/PurchasingDashboard'
import Suppliers            from './pages/purchasing/Suppliers'
import PurchaseOrders       from './pages/purchasing/PurchaseOrders'
import HRDashboard          from './pages/hr/HRDashboard'
import Employees            from './pages/hr/Employees'
import JobPositions         from './pages/hr/JobPositions'
import Candidates           from './pages/hr/Candidates'
import AccountingDashboard  from './pages/accounting/AccountingDashboard'
import Transactions         from './pages/accounting/Transactions'
import AnalyticsDashboard   from './pages/analytics/AnalyticsDashboard'
import UserManagement from './pages/admin/UserManagement'
import JobApplication    from './pages/public/JobApplication'
import CustomerRegister  from './pages/public/CustomerRegister'
import ProfileSettings from './pages/profile/ProfileSettings'
import CustomerShop from './pages/customer/CustomerShop'

function PrivateRoute({ children, role, permission }) {
    const { user, loading } = useAuth()

    if (loading) return (
        <div className="flex items-center justify-center h-screen text-gray-400">
            Loading...
        </div>
    )

    if (!user) return <Navigate to="/login" />

    // Role-based check
    if (role && user.role !== role) return <Navigate to="/login" />

    return <Layout>{children}</Layout>
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/admin/dashboard"    element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
                <Route path="/manager/dashboard"  element={<PrivateRoute role="manager"><ManagerDashboard /></PrivateRoute>} />
                <Route path="/employee/dashboard" element={<PrivateRoute role="employee"><EmployeeDashboard /></PrivateRoute>} />

                {/* Inventory */}
                <Route path="/inventory/dashboard"  element={<PrivateRoute><InventoryDashboard /></PrivateRoute>} />
                <Route path="/inventory/products"   element={<PrivateRoute><Products /></PrivateRoute>} />
                <Route path="/inventory/categories" element={<PrivateRoute><Categories /></PrivateRoute>} />

                {/* Sales */}
                <Route path="/sales/dashboard" element={<PrivateRoute><SalesDashboard /></PrivateRoute>} />
                <Route path="/sales/customers" element={<PrivateRoute><Customers /></PrivateRoute>} />
                <Route path="/sales/orders"    element={<PrivateRoute><Orders /></PrivateRoute>} />

                {/* Purchasing */}
                <Route path="/purchasing/dashboard" element={<PrivateRoute><PurchasingDashboard /></PrivateRoute>} />
                <Route path="/purchasing/suppliers" element={<PrivateRoute><Suppliers /></PrivateRoute>} />
                <Route path="/purchasing/orders"    element={<PrivateRoute><PurchaseOrders /></PrivateRoute>} />
                {/* Public pages — no login required */}
<Route path="/careers"  element={<JobApplication />} />
<Route path="/register" element={<CustomerRegister />} />

<Route path="/shop" element={<CustomerShop />} />

                {/* HR */}
                <Route path="/hr/dashboard"  element={<PrivateRoute><HRDashboard /></PrivateRoute>} />
                <Route path="/hr/employees"  element={<PrivateRoute><Employees /></PrivateRoute>} />
                <Route path="/hr/jobs"       element={<PrivateRoute><JobPositions /></PrivateRoute>} />
                <Route path="/hr/candidates" element={<PrivateRoute><Candidates /></PrivateRoute>} />

                {/* Accounting */}
                <Route path="/accounting/dashboard"    element={<PrivateRoute><AccountingDashboard /></PrivateRoute>} />
                <Route path="/accounting/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
                {/* User Management */}
<Route path="/admin/users" element={
    <PrivateRoute role="admin"><UserManagement /></PrivateRoute>
} />

<Route path="/profile" element={<PrivateRoute><ProfileSettings /></PrivateRoute>} />

                {/* Analytics */}
                <Route path="/analytics/dashboard" element={<PrivateRoute><AnalyticsDashboard /></PrivateRoute>} />

                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App