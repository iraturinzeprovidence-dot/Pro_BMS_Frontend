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
  Building2,
  Boxes,
  Tag,
  ShoppingBag,
  Truck,
  UserPlus,
  Briefcase,
  FileText,
  Wallet,
  ChevronDown,
  ChevronRight
} from 'lucide-react'

const adminNav = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { 
        label: 'Inventory', path: '/inventory/dashboard', icon: Package,
        sub: [
            { label: 'Products', path: '/inventory/products', icon: Boxes },
            { label: 'Categories', path: '/inventory/categories', icon: Tag },
        ]
    },
    { 
        label: 'Sales', path: '/sales/dashboard', icon: ShoppingBag,
        sub: [
            { label: 'Orders', path: '/sales/orders', icon: ShoppingCart },
            { label: 'Customers', path: '/sales/customers', icon: Users },
        ]
    },
    { 
        label: 'Purchasing', path: '/purchasing/dashboard', icon: ShoppingCart,
        sub: [
            { label: 'Purchase Orders', path: '/purchasing/orders', icon: FileText },
            { label: 'Suppliers', path: '/purchasing/suppliers', icon: Truck },
        ]
    },
    { 
        label: 'HR', path: '/hr/dashboard', icon: Users,
        sub: [
            { label: 'Employees', path: '/hr/employees', icon: UserCircle },
            { label: 'Job Positions', path: '/hr/jobs', icon: Briefcase },
            { label: 'Candidates', path: '/hr/candidates', icon: UserPlus },
        ]
    },
    { 
        label: 'Accounting', path: '/accounting/dashboard', icon: BookOpen,
        sub: [
            { label: 'Transactions', path: '/accounting/transactions', icon: Wallet },
        ]
    },
    { label: 'Analytics', path: '/analytics/dashboard', icon: BarChart3 },
    { label: 'Users', path: '/admin/users', icon: Shield },
]

const managerNav = [
    { label: 'Dashboard', path: '/manager/dashboard', icon: LayoutDashboard },
    { label: 'Sales', path: '/sales/dashboard', icon: TrendingUp },
    { label: 'HR', path: '/hr/dashboard', icon: Users },
    { label: 'Analytics', path: '/analytics/dashboard', icon: BarChart3 },
]

const employeeNav = [
    { label: 'Dashboard', path: '/employee/dashboard', icon: LayoutDashboard },
]

export default function Layout({ children }) {
    const { user, profile, logout } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [openSubmenus, setOpenSubmenus] = useState({})

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

    const toggleSubmenu = (label) => {
        setOpenSubmenus(prev => ({ ...prev, [label]: !prev[label] }))
    }

    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/')
    }

    // Get profile picture URL from user or profile
    const getProfilePicture = () => {
        if (user?.avatar) {
            return user.avatar
        }
        if (profile?.avatar) {
            return profile.avatar
        }
        return null
    }

    const profilePicture = getProfilePicture()
    const userInitial = user?.name?.charAt(0).toUpperCase() || 'U'

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
                                <h1 className="text-xl font-bold text-emerald-700">Pro BMS</h1>
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
                            const active = isActive(item.path)
                            const hasSub = item.sub && item.sub.length > 0
                            const isSubmenuOpen = openSubmenus[item.label]
                            
                            return (
                                <div key={item.path}>
                                    <Link
                                        to={item.path}
                                        onClick={(e) => {
                                            if (hasSub) {
                                                e.preventDefault()
                                                toggleSubmenu(item.label)
                                            }
                                        }}
                                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                                            active
                                                ? 'bg-emerald-50 text-emerald-700'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className={`w-5 h-5 ${active ? 'text-emerald-700' : 'text-gray-500 group-hover:text-gray-700'}`} />
                                            <span>{item.label}</span>
                                        </div>
                                        {hasSub && (
                                            isSubmenuOpen ? 
                                                <ChevronDown className="w-4 h-4" /> : 
                                                <ChevronRight className="w-4 h-4" />
                                        )}
                                    </Link>
                                    
                                    {hasSub && isSubmenuOpen && (
                                        <div className="ml-9 mt-1 space-y-1">
                                            {item.sub.map((subItem) => {
                                                const SubIcon = subItem.icon
                                                const subActive = location.pathname === subItem.path
                                                return (
                                                    <Link
                                                        key={subItem.path}
                                                        to={subItem.path}
                                                        className={`flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                                                            subActive
                                                                ? 'bg-emerald-50 text-emerald-700'
                                                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                                        }`}
                                                    >
                                                        <SubIcon className={`w-3.5 h-3.5 ${subActive ? 'text-emerald-700' : 'text-gray-400'}`} />
                                                        <span>{subItem.label}</span>
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </nav>
                )}

                {/* User Section - Sidebar Open */}
                {isSidebarOpen && (
                    <div className="px-4 py-4 border-t border-gray-200">
                        <button
                            onClick={() => navigate('/profile')}
                            className="flex items-center gap-3 w-full hover:bg-emerald-50 rounded-md p-2 transition group"
                        >
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold overflow-hidden flex-shrink-0">
                                {profilePicture ? (
                                    <img 
                                        src={profilePicture} 
                                        alt="Profile" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    userInitial
                                )}
                            </div>
                            <div className="flex-1 text-left">
                                <p className="text-sm font-medium text-gray-800 truncate">{user?.name}</p>
                                <p className="text-xs text-gray-500 capitalize truncate">
                                    {user?.role === 'employee' && profile ? profile.job_title : user?.role}
                                </p>
                            </div>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium transition py-1.5 rounded-md hover:bg-red-50 mt-2"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                )}

                {/* User Section - Sidebar Collapsed - Only Profile Picture and Logout Icon */}
                {!isSidebarOpen && (
                    <div className="px-2 py-4 border-t border-gray-200 mt-auto">
                        <button
                            onClick={() => navigate('/profile')}
                            className="flex justify-center w-full mb-3 hover:opacity-80 transition"
                            title={user?.name}
                        >
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold overflow-hidden">
                                {profilePicture ? (
                                    <img 
                                        src={profilePicture} 
                                        alt="Profile" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    userInitial
                                )}
                            </div>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex justify-center w-full text-red-600 hover:text-red-700 transition p-1.5 rounded-md hover:bg-red-50"
                            title="Logout"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}