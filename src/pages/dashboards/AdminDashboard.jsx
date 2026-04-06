import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { analyticsApi } from '../../api/analyticsApi'
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
  LayoutDashboard,
  RefreshCw,
  AlertTriangle,
  UserCheck,
  ShoppingCart
} from 'lucide-react'

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [overview, setOverview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchOverview = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    try {
      const r = await analyticsApi.getOverview()
      setOverview(r.data)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Failed to fetch overview:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchOverview()
    const interval = setInterval(() => fetchOverview(true), 30000)
    return () => clearInterval(interval)
  }, [fetchOverview])

  const kpiCards = [
    { label: 'Total Revenue',    value: '$' + Number(overview?.total_revenue    ?? 0).toFixed(2), icon: DollarSign,   color: 'text-emerald-600' },
    { label: 'Net Profit',       value: '$' + Number(overview?.net_profit       ?? 0).toFixed(2), icon: TrendingUp,    color: 'text-green-600'   },
    { label: 'Total Orders',     value: overview?.total_orders    ?? 0,                           icon: ShoppingBag,   color: 'text-blue-600'    },
    { label: 'Total Customers',  value: overview?.total_customers ?? 0,                           icon: UserCheck,     color: 'text-teal-600'    },
    { label: 'Total Products',   value: overview?.total_products  ?? 0,                           icon: Package,       color: 'text-indigo-600'  },
    { label: 'Low Stock',        value: overview?.low_stock_products ?? 0,                        icon: AlertTriangle, color: 'text-red-600'    },
    { label: 'Active Employees', value: overview?.active_employees ?? 0,                          icon: Users,         color: 'text-orange-600'  },
    { label: 'Total Suppliers',  value: overview?.total_suppliers ?? 0,                           icon: Truck,         color: 'text-purple-600'  },
  ]

  const modules = [
    { name: 'Inventory', desc: 'Manage products and stock', icon: Boxes, path: '/inventory/dashboard' },
    { name: 'Sales', desc: 'Orders, invoices and customers', icon: TrendingUp, path: '/sales/dashboard' },
    { name: 'Purchasing', desc: 'Suppliers and purchase orders', icon: Truck, path: '/purchasing/dashboard' },
    { name: 'HR', desc: 'Employees and job applications', icon: UsersIcon, path: '/hr/dashboard' },
    { name: 'Accounting', desc: 'Expenses, income and reports', icon: BookOpen, path: '/accounting/dashboard' },
    { name: 'Analytics', desc: 'KPIs, graphs and summary reports', icon: BarChart3, path: '/analytics/dashboard' },
  ]

  const stats = [
    { label: 'Total Users', value: '0', icon: Users },
    { label: 'Total Products', value: '0', icon: Package },
    { label: 'Total Orders', value: '0', icon: ShoppingBag },
    { label: 'Total Revenue', value: '0', icon: DollarSign },
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
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <LayoutDashboard className="w-7 h-7 text-emerald-800" />
              <h2 className="text-2xl font-bold text-black drop-shadow-lg">Admin Dashboard</h2>
            </div>
            <p className="text-gray-700 ml-10 drop-shadow-md font-medium">
              Welcome back, {user?.name}!
              {lastUpdated && (
                <span className="text-xs text-gray-500 ml-2">
                  Updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={() => fetchOverview(true)}
            disabled={refreshing}
            className="flex items-center gap-2 border border-gray-200 bg-white/80 backdrop-blur-sm hover:bg-white/90 text-gray-700 text-sm font-medium px-4 py-2 rounded-md transition disabled:opacity-50 shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* KPI Cards */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-md rounded-md border border-gray-200 p-5 animate-pulse">
                <div className="h-3 bg-gray-200 rounded w-24 mb-3"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {kpiCards.map((card) => {
              const Icon = card.icon
              return (
                <div key={card.label} className="bg-white/80 backdrop-blur-md rounded-md border border-gray-200 shadow-sm p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{card.label}</p>
                    <div className="w-8 h-8 rounded-md bg-white/50 flex items-center justify-center">
                      <Icon className={`w-4 h-4 ${card.color}`} />
                    </div>
                  </div>
                  <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
                </div>
              )
            })}
          </div>
        )}

        {/* Modules Section */}
        <div className="mb-4 mt-4">
          <h3 className="text-lg font-semibold text-black drop-shadow-md">System Modules</h3>
          <p className="text-gray-700 mt-0.5 drop-shadow-sm font-medium text-sm">
            Access and manage different modules of your system
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
                className="bg-white/80 backdrop-blur-md rounded-md p-4 border border-gray-200 cursor-pointer transition-all duration-200 hover:bg-white/90 hover:border-emerald-400 hover:shadow-xl group flex flex-col h-[150px]"
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