import { useAuth } from '../../context/AuthContext'

export default function EmployeeDashboard() {
    const { user } = useAuth()

    return (
        <div className="p-8">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Employee Dashboard</h2>
                <p className="text-gray-500 mt-1">Welcome back, {user?.name}! Here's your workspace.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    { name: 'My Tasks',   desc: 'View your assigned tasks',  icon: '✅' },
                    { name: 'My Profile', desc: 'View and update your info', icon: '👤' },
                ].map((module) => (
                    <div
                        key={module.name}
                        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:border-purple-300 cursor-pointer transition"
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