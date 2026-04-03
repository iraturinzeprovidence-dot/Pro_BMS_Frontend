import { useAuth } from '../../context/AuthContext'

export default function ManagerDashboard() {
    const { user, logout } = useAuth()

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-blue-600">Pro_BMS</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">👤 {user?.name}</span>
                    <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                        Manager
                    </span>
                    <button
                        onClick={logout}
                        className="text-sm text-red-500 hover:text-red-700 font-medium"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Manager Dashboard</h2>
                <p className="text-gray-500 mb-8">Welcome back, {user?.name}! Here's your department overview.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { name: 'Sales',      desc: 'Orders, invoices and customers',  icon: '💰' },
                        { name: 'HR',         desc: 'Employees and job applications',  icon: '👥' },
                        { name: 'Analytics',  desc: 'KPIs, graphs and reports',        icon: '📈' },
                    ].map((module) => (
                        <div
                            key={module.name}
                            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:border-green-300 cursor-pointer transition"
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