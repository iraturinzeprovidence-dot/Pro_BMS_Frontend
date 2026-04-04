import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function ManagerDashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()

    return (
        <div className="p-8">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Manager Dashboard</h2>
                <p className="text-gray-500 mt-1">Welcome back, {user?.name}! Here's your department overview.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { name: 'Sales',     desc: 'Orders, invoices and customers', icon: '💰', path: '/sales/dashboard'    },
                    { name: 'HR',        desc: 'Employees and job applications', icon: '👥', path: '/hr/dashboard'       },
                    { name: 'Analytics', desc: 'KPIs, graphs and reports',       icon: '📈', path: '/analytics/dashboard'},
                ].map((module) => (
                    <div
                        key={module.name}
                        onClick={() => navigate(module.path)}
                        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:border-green-300 cursor-pointer transition"
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