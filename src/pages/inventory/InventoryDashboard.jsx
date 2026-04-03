import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { inventoryApi } from '../../api/inventoryApi'

export default function InventoryDashboard() {
    const navigate          = useNavigate()
    const [stats, setStats] = useState(null)
    const [low, setLow]     = useState([])

    useEffect(() => {
        inventoryApi.getStats().then(r => setStats(r.data))
        inventoryApi.getLowStock().then(r => setLow(r.data))
    }, [])

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Inventory</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage products and stock levels</p>
                </div>
                <button
                    onClick={() => navigate('/inventory/products')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
                >
                    View All Products
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Total Products',   value: stats?.total_products   ?? 0, color: 'blue'   },
                    { label: 'Active Products',  value: stats?.active_products  ?? 0, color: 'green'  },
                    { label: 'Low Stock Alerts', value: stats?.low_stock        ?? 0, color: 'red'    },
                    { label: 'Categories',       value: stats?.total_categories ?? 0, color: 'purple' },
                ].map((card) => (
                    <div key={card.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <p className="text-sm text-gray-500">{card.label}</p>
                        <p className="text-3xl font-bold text-gray-800 mt-1">{card.value}</p>
                    </div>
                ))}
            </div>

            {/* Low Stock Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800">Low Stock Alerts</h3>
                </div>
                {low.length === 0 ? (
                    <div className="px-6 py-8 text-center text-gray-400 text-sm">No low stock products</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left px-6 py-3 text-gray-500 font-medium">Product</th>
                                <th className="text-left px-6 py-3 text-gray-500 font-medium">SKU</th>
                                <th className="text-left px-6 py-3 text-gray-500 font-medium">Stock</th>
                                <th className="text-left px-6 py-3 text-gray-500 font-medium">Alert Level</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {low.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-3 font-medium text-gray-800">{p.name}</td>
                                    <td className="px-6 py-3 text-gray-500">{p.sku}</td>
                                    <td className="px-6 py-3">
                                        <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
                                            {p.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-gray-500">{p.stock_alert}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}