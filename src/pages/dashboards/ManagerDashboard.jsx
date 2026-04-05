import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import {
  TrendingUp,
  Users,
  BarChart3,
  LayoutDashboard,
  UserCircle
} from 'lucide-react'

export default function ManagerDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const modules = [
    { name: 'Sales', desc: 'Orders, invoices and customers', icon: TrendingUp, path: '/sales/dashboard' },
    { name: 'HR', desc: 'Employees and job applications', icon: Users, path: '/hr/dashboard' },
    { name: 'Analytics', desc: 'KPIs, graphs and reports', icon: BarChart3, path: '/analytics/dashboard' },
  ]

  return (
    <div 
      className="relative min-h-screen w-full"
      style={{
        backgroundImage: `url('/src/assets/istockphoto-1477198926-612x612.jpg')`,
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark green overlay */}
      <div className="absolute inset-0 bg-emerald-900/30"></div>
      
      {/* Content */}
      <div className="relative z-10 p-8">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <LayoutDashboard className="w-7 h-7 text-emerald-800" />
            <h2 className="text-2xl font-bold text-black drop-shadow-lg">Manager Dashboard</h2>
          </div>
          <p className="text-gray-700 ml-10 drop-shadow-md font-medium">
            Welcome back, {user?.name}! Here's your department overview.
          </p>
        </div>

        {/* Welcome Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-lg p-5 border border-gray-200 shadow-lg mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
              <UserCircle className="w-8 h-8 text-emerald-800" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-black">Department Overview</h3>
              <p className="text-gray-600 text-sm mt-1">Manage and monitor your team's performance</p>
            </div>
          </div>
        </div>

        {/* Quick Stats Section */}
        <div className="mb-8">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-black drop-shadow-md">Quick Overview</h3>
            <p className="text-gray-700 mt-0.5 drop-shadow-sm font-medium text-sm">
              Key metrics at a glance
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white/80 backdrop-blur-md rounded-lg p-4 border border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-5 h-5 text-emerald-800" />
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">This Month</span>
              </div>
              <p className="text-2xl font-bold text-black mb-0.5">0</p>
              <p className="text-xs text-gray-600 font-medium">Total Sales</p>
            </div>
            <div className="bg-white/80 backdrop-blur-md rounded-lg p-4 border border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-5 h-5 text-emerald-800" />
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Department</span>
              </div>
              <p className="text-2xl font-bold text-black mb-0.5">0</p>
              <p className="text-xs text-gray-600 font-medium">Team Members</p>
            </div>
            <div className="bg-white/80 backdrop-blur-md rounded-lg p-4 border border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <BarChart3 className="w-5 h-5 text-emerald-800" />
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Performance</span>
              </div>
              <p className="text-2xl font-bold text-black mb-0.5">0%</p>
              <p className="text-xs text-gray-600 font-medium">KPI Achievement</p>
            </div>
          </div>
        </div>

        {/* Modules Section */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-black drop-shadow-md">Management Modules</h3>
          <p className="text-gray-700 mt-0.5 drop-shadow-sm font-medium text-sm">
            Access and manage your department modules
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((module) => {
            const Icon = module.icon
            return (
              <div
                key={module.name}
                onClick={() => navigate(module.path)}
                className="bg-white/80 backdrop-blur-md rounded-lg p-4 border border-gray-200 cursor-pointer transition-all duration-200 hover:bg-white/90 hover:border-emerald-400 hover:shadow-xl group flex flex-col h-[140px]"
              >
                <div className="flex flex-col items-center text-center flex-1">
                  <Icon className="w-6 h-6 text-emerald-800 mb-2" />
                  <h3 className="font-semibold text-black text-base mb-1">
                    {module.name}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed font-medium">
                    {module.desc}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-700 group-hover:text-emerald-800 transition-colors mt-2 pt-2 border-t border-gray-200">
                  <span>Access Module</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}