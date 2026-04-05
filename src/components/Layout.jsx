import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  ShoppingCart,
  Users,
  BookOpen,
  BarChart3,
  Shield,
  LogOut,
  X,
  Menu,
  UserCircle,
  Building2
} from 'lucide-react'

const adminNav = [
    { label: 'Dashboard',       path: '/admin/dashboard',        icon: LayoutDashboard },
    { label: 'Inventory',       path: '/inventory/dashboard',    icon: Package },
    { label: 'Sales',           path: '/sales/dashboard',        icon: TrendingUp },
    { label: 'Purchasing',      path: '/purchasing/dashboard',   icon: ShoppingCart },
    { label: 'HR',              path: '/hr/dashboard',           icon: Users },
    { label: 'Accounting',      path: '/accounting/dashboard',   icon: BookOpen },
    { label: 'Analytics',       path: '/analytics/dashboard',    icon: BarChart3 },
    { label: 'Users',           path: '/admin/users',            icon: Shield },
]

const managerNav = [
    { label: 'Dashboard',  path: '/manager/dashboard',      icon: LayoutDashboard },
    { label: 'Sales',      path: '/sales/dashboard',        icon: TrendingUp },
    { label: 'HR',         path: '/hr/dashboard',           icon: Users },
    { label: 'Analytics',  path: '/analytics/dashboard',    icon: BarChart3 },
]

const employeeNav = [
    { label: 'Dashboard',  path: '/employee/dashboard',     icon: LayoutDashboard },
]

export default function Layout({ children }) {
    const { user, logout } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    const nav = user?.role === 'admin'
        ? adminNav
        : user?.role === 'manager'
        ? managerNav
        : employeeNav

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside 
                className={`bg-white/95 backdrop-blur-md border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out ${
                    isSidebarOpen ? 'w-64' : 'w-16'
                }`}
            >
                {/* Logo Section with X/Menu Button */}
                <div className={`px-4 py-4 border-b border-gray-200 flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
                    {isSidebarOpen ? (
                        <>
                            <div>
                                <h1 className="text-xl font-bold text-emerald-700">Pro_BMS</h1>
                                <p className="text-xs text-gray-500 mt-0.5">Business Management</p>
                            </div>
                            <button
                                onClick={toggleSidebar}
                                className="p-1.5 rounded-lg hover:bg-gray-100 transition"
                                title="Collapse Menu"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={toggleSidebar}
                            className="p-1.5 rounded-lg hover:bg-gray-100 transition"
                            title="Expand Menu"
                        >
                            <Menu className="w-5 h-5 text-gray-600" />
                        </button>
                    )}
                </div>

                {/* Navigation - Only appears when sidebar is open */}
                {isSidebarOpen && (
                    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                        {nav.map((item) => {
                            const Icon = item.icon
                            const isActive = location.pathname === item.path
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                                        isActive
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-700' : 'text-gray-500 group-hover:text-gray-700'}`} />
                                    <span>{item.label}</span>
                                </Link>
                            )
                        })}
                    </nav>
                )}

                {/* User & Logout Section */}
                <div className={`px-4 py-4 border-t border-gray-200 ${!isSidebarOpen && 'px-2'}`}>
                    {isSidebarOpen ? (
                        <>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                    <UserCircle className="w-5 h-5 text-emerald-700" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">{user?.name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium transition w-full"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-3">

                            <button
                                onClick={handleLogout}
                                className="text-red-600 hover:text-red-700 transition"
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}