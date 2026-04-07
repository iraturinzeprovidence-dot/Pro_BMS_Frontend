import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { salesApi } from '../../api/salesApi'
import {
  TrendingUp,
  ShoppingCart,
  Clock,
  CheckCircle,
  DollarSign,
  Users,
  Package,
  LayoutDashboard,
  PlusCircle,
  FileText
} from 'lucide-react'

export default function SalesDashboard() {
    const navigate                        = useNavigate()
    const [orderStats, setOrderStats]     = useState(null)
    const [customerStats, setCustomerStats] = useState(null)

    useEffect(() => {
        salesApi.getOrderStats().then(r => setOrderStats(r.data))
        salesApi.getCustomerStats().then(r => setCustomerStats(r.data))
    }, [])

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
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingUp className="w-7 h-7 text-emerald-800" />
                            <h2 className="text-2xl font-bold text-black drop-shadow-lg">Sales</h2>
                        </div>
                        <p className="text-gray-700 ml-10 drop-shadow-md font-medium">
                            Manage orders and customers
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/sales/orders')}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-base font-medium px-6 py-3 rounded-md transition-all duration-200 flex items-center gap-2 shadow-md"
                    >
                        <PlusCircle className="w-5 h-5" />
                        New Order
                    </button>
                </div>

                {/* Welcome Card */}
                <div className="bg-white/80 backdrop-blur-md rounded-md p-5 border border-gray-200 shadow-lg mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                            <ShoppingCart className="w-8 h-8 text-emerald-800" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-black">Sales Management</h3>
                            <p className="text-gray-600 text-sm mt-1">Track orders, revenue, and customer insights</p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    <div className="bg-white/80 backdrop-blur-md rounded-md p-4 border border-gray-200 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <ShoppingCart className="w-5 h-5 text-emerald-700" />
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Orders</span>
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-black mb-0.5">
                            {orderStats?.total_orders ?? 0}
                        </p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-md rounded-md p-4 border border-gray-200 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-yellow-600" />
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pending Orders</span>
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-black mb-0.5">
                            {orderStats?.pending_orders ?? 0}
                        </p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-md rounded-md p-4 border border-gray-200 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Completed Orders</span>
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-black mb-0.5">
                            {orderStats?.completed_orders ?? 0}
                        </p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-md rounded-md p-4 border border-gray-200 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-blue-600" />
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Revenue</span>
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-black mb-0.5">
                            {Number(orderStats?.total_revenue ?? 0).toFixed(2)}
                        </p>
                    </div>
                </div>

                {/* Quick Links Section */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-black drop-shadow-md">Quick Links</h3>
                    <p className="text-gray-700 mt-0.5 drop-shadow-sm font-medium text-sm">
                        Access and manage sales modules
                    </p>
                </div>

                {/* Quick Links Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div
                        onClick={() => navigate('/sales/orders')}
                        className="bg-white/80 backdrop-blur-md rounded-md p-4 border border-gray-200 cursor-pointer transition-all duration-200 hover:bg-white/90 hover:border-emerald-400 hover:shadow-xl group flex flex-col h-[140px]"
                    >
                        <div className="flex flex-col items-center text-center flex-1">
                            <FileText className="w-6 h-6 text-emerald-800 mb-2" />
                            <h3 className="font-semibold text-black text-base mb-1">
                                Orders
                            </h3>
                            <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                Create and manage customer orders
                            </p>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-700 group-hover:text-emerald-800 transition-colors mt-2 pt-2 border-t border-gray-200">
                            <span>Access Module</span>
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                    </div>

                    <div
                        onClick={() => navigate('/sales/customers')}
                        className="bg-white/80 backdrop-blur-md rounded-md p-4 border border-gray-200 cursor-pointer transition-all duration-200 hover:bg-white/90 hover:border-emerald-400 hover:shadow-xl group flex flex-col h-[140px]"
                    >
                        <div className="flex flex-col items-center text-center flex-1">
                            <Users className="w-6 h-6 text-emerald-800 mb-2" />
                            <h3 className="font-semibold text-black text-base mb-1">
                                Customers
                            </h3>
                            <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                {customerStats?.total_customers ?? 0} customers registered
                            </p>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-700 group-hover:text-emerald-800 transition-colors mt-2 pt-2 border-t border-gray-200">
                            <span>Access Module</span>
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                    </div>
                </div>

                {/* Additional Stats Section */}
                <div className="mt-10">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-black drop-shadow-md">Sales Overview</h3>
                        <p className="text-gray-700 mt-0.5 drop-shadow-sm font-medium text-sm">
                            Key metrics at a glance
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        <div className="bg-white/80 backdrop-blur-md rounded-md p-4 border border-gray-200 shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Package className="w-5 h-5 text-purple-600" />
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Avg. Order Value</span>
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-black mb-0.5">
                                
                                {orderStats?.total_orders && orderStats?.total_revenue 
                                    ? (orderStats.total_revenue / orderStats.total_orders).toFixed(2)
                                    : '0.00'}
                            </p>
                            <p className="text-xs text-gray-500">Per order</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-md rounded-md p-4 border border-gray-200 shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-emerald-600" />
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Active Customers</span>
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-black mb-0.5">
                                {customerStats?.active_customers ?? 0}
                            </p>
                            <p className="text-xs text-gray-500">Total: {customerStats?.total_customers ?? 0}</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-md rounded-md p-4 border border-gray-200 shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-blue-600" />
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Completion Rate</span>
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-black mb-0.5">
                                {orderStats?.total_orders && orderStats?.completed_orders
                                    ? Math.round((orderStats.completed_orders / orderStats.total_orders) * 100)
                                    : 0}%
                            </p>
                            <p className="text-xs text-gray-500">Orders completed</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}