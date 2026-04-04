import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { purchasingApi } from '../../api/purchasingApi'

export default function PurchasingDashboard() {
    const navigate        = useNavigate()
    const [stats, setStats] = useState(null)
    const [supplierStats, setSupplierStats] = useState(null)

    useEffect(() => {
        purchasingApi.getStats().then(r => setStats(r.data))
        purchasingApi.getSupplierStats().then(r => setSupplierStats(r.data))
    }, [])

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Purchasing</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage suppliers and purchase orders</p>
                </div>
                <button
                    onClick={() => navigate('/purchasing/orders')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
                >
                    + New Purchase Order
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Total Orders',    value: stats?.total_orders    ?? 0 },
                    { label: 'Draft Orders',    value: stats?.draft_orders    ?? 0 },
                    { label: 'Received Orders', value: stats?.received_orders ?? 0 },
                    { label: 'Total Spent',     value: '$' + Number(stats?.total_spent ?? 0).toFixed(2) },
                ].map((card) => (
                    <div key={card.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <p className="text-sm text-gray-500">{card.label}</p>
                        <p className="text-3xl font-bold text-gray-800 mt-1">{card.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                    onClick={() => navigate('/purchasing/orders')}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:border-blue-300 cursor-pointer transition"
                >
                    <div className="text-3xl mb-3">📋</div>
                    <h3 className="font-semibold text-gray-800">Purchase Orders</h3>
                    <p className="text-sm text-gray-500 mt-1">Create and manage purchase orders</p>
                </div>
                <div
                    onClick={() => navigate('/purchasing/suppliers')}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:border-blue-300 cursor-pointer transition"
                >
                    <div className="text-3xl mb-3">🏭</div>
                    <h3 className="font-semibold text-gray-800">Suppliers</h3>
                    <p className="text-sm text-gray-500 mt-1">{supplierStats?.total_suppliers ?? 0} suppliers registered</p>
                </div>
            </div>
        </div>
    )
}