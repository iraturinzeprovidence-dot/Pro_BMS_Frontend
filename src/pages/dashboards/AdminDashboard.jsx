import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  Package,
  ShoppingBag,
  DollarSign,
  Boxes,
  TrendingUp,
  Truck,
  Users as UsersIcon,
  BookOpen,
  BarChart3,
  LayoutDashboard
} from 'lucide-react'

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const stats = [
    { label: 'Total Users', value: '0', icon: Users },
    { label: 'Total Products', value: '0', icon: Package },
    { label: 'Total Orders', value: '0', icon: ShoppingBag },
    { label: 'Total Revenue', value: '0', icon: DollarSign },
  ]

  const modules = [
    { name: 'Inventory', desc: 'Manage products and stock', icon: Boxes, path: '/inventory/dashboard' },
    { name: 'Sales', desc: 'Orders, invoices and customers', icon: TrendingUp, path: '/sales/dashboard' },
    { name: 'Purchasing', desc: 'Suppliers and purchase orders', icon: Truck, path: '/purchasing/dashboard' },
    { name: 'HR', desc: 'Employees and job applications', icon: UsersIcon, path: '/hr/dashboard' },
    { name: 'Accounting', desc: 'Expenses, income and reports', icon: BookOpen, path: '/accounting/dashboard' },
    { name: 'Analytics', desc: 'KPIs, graphs and summary reports', icon: BarChart3, path: '/analytics/dashboard' },
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
      {/* Dark green overlay for better contrast */}
      <div className="absolute inset-0 bg-emerald-900/30"></div>
      
      {/* Content */}
      <div className="relative z-10 p-8">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <LayoutDashboard className="w-7 h-7 text-emerald-800" />
            <h2 className="text-2xl font-bold text-black drop-shadow-lg">Admin Dashboard</h2>
          </div>
          <p className="text-gray-700 ml-10 drop-shadow-md font-medium">Welcome back, {user?.name}! Here's your system overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="bg-white/80 backdrop-blur-md rounded-lg p-4 border border-gray-200 hover:bg-white/90 hover:border-emerald-300 transition-all duration-200 shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon className="w-5 h-5 text-emerald-800" />
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Current</span>
                </div>
                <p className="text-2xl font-bold text-black mb-0.5 drop-shadow-sm">{stat.value}</p>
                <p className="text-xs text-gray-600 font-medium">{stat.label}</p>
              </div>
            )
          })}
        </div>

        {/* Modules Section */}
        <div className="mb-4 mt-4">
          <h3 className="text-lg font-semibold text-black drop-shadow-md">System Modules</h3>
          <p className="text-gray-700 mt-0.5 drop-shadow-sm font-medium text-sm">Access and manage different modules of your system</p>
        </div>

        {/* Compact Modules Grid with Vertical Centered Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((module) => {
            const Icon = module.icon
            return (
              <div
                key={module.name}
                onClick={() => navigate(module.path)}
                className="bg-white/80 backdrop-blur-md rounded-lg p-4 border border-gray-200 cursor-pointer transition-all duration-200 hover:bg-white/90 hover:border-emerald-400 hover:shadow-xl group flex flex-col h-[150px]"
              >
                <div className="flex flex-col items-center text-center flex-1">
                  <Icon className="w-6 h-6 text-emerald-800 mb-2" />
                  <h3 className="font-semibold text-black text-base mb-1 drop-shadow-sm">
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