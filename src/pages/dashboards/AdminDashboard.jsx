import { useAuth } from '../../context/AuthContext'

export default function AdminDashboard() {
    const { user, logout } = useAuth()

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Navbar */}
            <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-blue-600">Pro_BMS</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">👤 {user?.name}</span>
                    <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
                        Admin
                    </span>
                    <button
                        onClick={logout}
                        className="text-sm text-red-500 hover:text-red-700 font-medium"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* Content */}
            <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h2>
                <p className="text-gray-500 mb-8">Welcome back, {user?.name}! Here's your system overview.</p>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: 'Total Users',    value: '0', color: 'blue'   },
                        { label: 'Total Products', value: '0', color: 'green'  },
                        { label: 'Total Orders',   value: '0', color: 'purple' },
                        { label: 'Total Revenue',  value: '$0', color: 'amber' },
                    ].map((card) => (
                        <div key={card.label} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <p className="text-sm text-gray-500">{card.label}</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{card.value}</p>
                        </div>
                    ))}
                </div>

                {/* Modules Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { name: 'Inventory',  desc: 'Manage products and stock',         icon: '📦' },
                        { name: 'Sales',      desc: 'Orders, invoices and customers',    icon: '💰' },
                        { name: 'Purchasing', desc: 'Suppliers and purchase orders',     icon: '🛒' },
                        { name: 'HR',         desc: 'Employees and job applications',    icon: '👥' },
                        { name: 'Accounting', desc: 'Expenses, income and reports',      icon: '📊' },
                        { name: 'Analytics',  desc: 'KPIs, graphs and summary reports',  icon: '📈' },
                    ].map((module) => (
                        <div
                            key={module.name}
                            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:border-blue-300 cursor-pointer transition"
                        >
                            <div className="text-3xl mb-3">{module.icon}</div>
                            <h3 className="font-semibold text-gray-800">{module.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">{module.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}