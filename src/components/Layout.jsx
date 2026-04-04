import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const adminNav = [
    { label: 'Dashboard',  path: '/admin/dashboard',        icon: '🏠' },
    { label: 'Inventory',  path: '/inventory/dashboard',    icon: '📦' },
    { label: 'Sales',      path: '/sales/dashboard',        icon: '💰' },
    { label: 'Purchasing', path: '/purchasing/dashboard',   icon: '🛒' },
    { label: 'HR',         path: '/hr/dashboard',           icon: '👥' },
    { label: 'Accounting', path: '/accounting/dashboard',   icon: '📊' },
    { label: 'Analytics',  path: '/analytics/dashboard',    icon: '📈' },
]

const managerNav = [
    { label: 'Dashboard',  path: '/manager/dashboard',      icon: '🏠' },
    { label: 'Sales',      path: '/sales/dashboard',        icon: '💰' },
    { label: 'HR',         path: '/hr/dashboard',           icon: '👥' },
    { label: 'Analytics',  path: '/analytics/dashboard',    icon: '📈' },
]

const employeeNav = [
    { label: 'Dashboard',  path: '/employee/dashboard',     icon: '🏠' },
]

export default function Layout({ children }) {
    const { user, logout } = useAuth()
    const location         = useLocation()
    const navigate         = useNavigate()

    const nav = user?.role === 'admin'
        ? adminNav
        : user?.role === 'manager'
        ? managerNav
        : employeeNav

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    return (
        <div className="flex h-screen bg-gray-100">

            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col">
                <div className="px-6 py-5 border-b border-gray-100">
                    <h1 className="text-xl font-bold text-blue-600">Pro_BMS</h1>
                    <p className="text-xs text-gray-400 mt-0.5">Business Management</p>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1">
                    {nav.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                                location.pathname === item.path
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <span>{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="px-4 py-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full text-left text-sm text-red-500 hover:text-red-700 font-medium"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}