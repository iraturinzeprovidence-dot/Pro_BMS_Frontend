import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { inventoryApi } from '../../api/inventoryApi'
import {
  Package,
  ShoppingBag,
  AlertTriangle,
  FolderTree,
  Eye,
  Box,
  TrendingUp,
  AlertCircle
} from 'lucide-react'

export default function InventoryDashboard() {
    const navigate          = useNavigate()
    const [stats, setStats] = useState(null)
    const [low, setLow]     = useState([])

    useEffect(() => {
        inventoryApi.getStats().then(r => setStats(r.data))
        inventoryApi.getLowStock().then(r => setLow(r.data))
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
                            <Package className="w-7 h-7 text-emerald-800" />
                            <h2 className="text-2xl font-bold text-black drop-shadow-lg">Inventory</h2>
                        </div>
                        <p className="text-gray-700 ml-10 drop-shadow-md font-medium">Manage products and stock levels</p>
                    </div>
                    <button
                        onClick={() => navigate('/inventory/products')}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-base font-medium px-8 py-3 rounded-md transition-all duration-200 flex items-center gap-2 shadow-md"
                    >
                        <Eye className="w-5 h-5" />
                        View All Products
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    <div className="bg-white/80 backdrop-blur-md rounded-md p-4 border border-gray-200 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-emerald-700" />
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Products</span>
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-black mb-0.5">
                            {stats?.total_products ?? 0}
                        </p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-md rounded-md p-4 border border-gray-200 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Active Products</span>
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-black mb-0.5">
                            {stats?.active_products ?? 0}
                        </p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-md rounded-md p-4 border border-gray-200 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Low Stock Alerts</span>
                            </div>
                        </div>
                        <p className={`text-2xl font-bold mb-0.5 ${(stats?.low_stock ?? 0) > 0 ? 'text-red-600' : 'text-black'}`}>
                            {stats?.low_stock ?? 0}
                        </p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-md rounded-md p-4 border border-gray-200 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <FolderTree className="w-5 h-5 text-purple-600" />
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Categories</span>
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-black mb-0.5">
                            {stats?.total_categories ?? 0}
                        </p>
                    </div>
                </div>
.
                {/* Low Stock Table */}
                <div className="bg-white/80 backdrop-blur-md rounded-md border border-gray-200 shadow-lg overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <h3 className="font-semibold text-black text-lg">Low Stock Alerts</h3>
                        </div>
                        {low.length > 0 && (
                            <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
                                {low.length} items
                            </span>
                        )}
                    </div>
                    {low.length === 0 ? (
                        <div className="px-5 py-8 text-center">
                            <Package className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">No low stock products</p>
                            <p className="text-gray-400 text-xs mt-1">All products have sufficient stock</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-emerald-50/50">
                                    <tr>
                                        <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Product</th>
                                        <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">SKU</th>
                                        <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Stock</th>
                                        <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Alert Level</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {low.map((p) => (
                                        <tr key={p.id} className="hover:bg-white/40 transition-colors">
                                            <td className="px-5 py-3 font-medium text-gray-800">
                                                <div className="flex items-center gap-2">
                                                    <Box className="w-4 h-4 text-gray-500" />
                                                    {p.name}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 text-gray-500 font-mono text-xs">{p.sku}</td>
                                            <td className="px-5 py-3">
                                                <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
                                                    {p.stock} units
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-gray-500">{p.stock_alert}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}