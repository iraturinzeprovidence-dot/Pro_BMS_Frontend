import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
    const { user }   = useAuth()
    const navigate   = useNavigate()

    return (
        <div className="p-8">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
                <p className="text-gray-500 mt-1">Welcome back, {user?.name}! Here's your system overview.</p>
            </div>

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
                    { name: 'Inventory',  desc: 'Manage products and stock',        icon: '📦', path: '/inventory/dashboard'  },
                    { name: 'Sales',      desc: 'Orders, invoices and customers',   icon: '💰', path: '/sales/dashboard'      },
                    { name: 'Purchasing', desc: 'Suppliers and purchase orders',    icon: '🛒', path: '/purchasing/dashboard' },
                    { name: 'HR',         desc: 'Employees and job applications',   icon: '👥', path: '/hr/dashboard'         },
                    { name: 'Accounting', desc: 'Expenses, income and reports',     icon: '📊', path: '/accounting/dashboard' },
                    { name: 'Analytics',  desc: 'KPIs, graphs and summary reports', icon: '📈', path: '/analytics/dashboard'  },
                ].map((module) => (
                    <div
                        key={module.name}
                        onClick={() => navigate(module.path)}
                        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:border-blue-300 cursor-pointer transition"
                    >
                        <div className="text-3xl mb-3">{module.icon}</div>
                        <h3 className="font-semibold text-gray-800">{module.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{module.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}