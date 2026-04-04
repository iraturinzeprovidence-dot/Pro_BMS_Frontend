import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { salesApi } from '../../api/salesApi'

export default function SalesDashboard() {
    const navigate                        = useNavigate()
    const [orderStats, setOrderStats]     = useState(null)
    const [customerStats, setCustomerStats] = useState(null)

    useEffect(() => {
        salesApi.getOrderStats().then(r => setOrderStats(r.data))
        salesApi.getCustomerStats().then(r => setCustomerStats(r.data))
    }, [])

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Sales</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage orders and customers</p>
                </div>
                <button
                    onClick={() => navigate('/sales/orders')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
                >
                    + New Order
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Total Orders',     value: orderStats?.total_orders     ?? 0        },
                    { label: 'Pending Orders',   value: orderStats?.pending_orders   ?? 0        },
                    { label: 'Completed Orders', value: orderStats?.completed_orders ?? 0        },
                    { label: 'Total Revenue',    value: '$' + Number(orderStats?.total_revenue ?? 0).toFixed(2) },
                ].map((card) => (
                    <div key={card.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <p className="text-sm text-gray-500">{card.label}</p>
                        <p className="text-3xl font-bold text-gray-800 mt-1">{card.value}</p>
                    </div>
                ))}
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                    onClick={() => navigate('/sales/orders')}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:border-blue-300 cursor-pointer transition"
                >
                    <div className="text-3xl mb-3">🧾</div>
                    <h3 className="font-semibold text-gray-800">Orders</h3>
                    <p className="text-sm text-gray-500 mt-1">Create and manage customer orders</p>
                </div>
                <div
                    onClick={() => navigate('/sales/customers')}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:border-blue-300 cursor-pointer transition"
                >
                    <div className="text-3xl mb-3">👤</div>
                    <h3 className="font-semibold text-gray-800">Customers</h3>
                    <p className="text-sm text-gray-500 mt-1">{customerStats?.total_customers ?? 0} customers registered</p>
                </div>
            </div>
        </div>
    )
}