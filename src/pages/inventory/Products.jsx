import { useState, useEffect } from 'react'
import { inventoryApi } from '../../api/inventoryApi'
import { uploadProductImage } from '../../api/imageApi'
import {
  Package,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Box,
  Tag,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  X,
  AlertCircle,
  Hash,
  Layers,
  FileText,
  RefreshCw
} from 'lucide-react'

export default function Products() {
    const [products, setProducts]     = useState([])
    const [categories, setCategories] = useState([])
    const [search, setSearch]         = useState('')
    const [loading, setLoading]       = useState(true)
    const [showDrawer, setShowDrawer] = useState(false)
    const [editing, setEditing]       = useState(null)
    const [error, setError]           = useState('')
    const [form, setForm]             = useState({
        name: '', sku: '', description: '', price: '',
        cost: '', stock: '', stock_alert: '10',
        category_id: '', status: 'active',
    })

    const fetchProducts = async () => {
        setLoading(true)
        const r = await inventoryApi.getProducts({ search })
        setProducts(r.data)
        setLoading(false)
    }

    const fetchCategories = async () => {
        const r = await inventoryApi.getCategories()
        setCategories(r.data)
    }

    useEffect(() => { fetchCategories() }, [])
    useEffect(() => { fetchProducts() }, [search])

    const generateSku = (name) => {
        const prefix = name.substring(0, 3).toUpperCase().replace(/\s/g, '')
        const rand   = Math.floor(1000 + Math.random() * 9000)
        return `${prefix}-${rand}`
    }

    const openCreate = () => {
        setEditing(null)
        setForm({
            name: '', sku: '', description: '', price: '',
            cost: '', stock: '', stock_alert: '10',
            category_id: '', status: 'active',
        })
        setError('')
        setShowDrawer(true)
    }

    const openEdit = (product) => {
        setEditing(product)
        setForm({
            name:        product.name,
            sku:         product.sku,
            description: product.description ?? '',
            price:       product.price,
            cost:        product.cost,
            stock:       product.stock,
            stock_alert: product.stock_alert,
            category_id: product.category_id ?? '',
            status:      product.status,
        })
        setError('')
        setShowDrawer(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            if (editing) {
                await inventoryApi.updateProduct(editing.id, form)
            } else {
                await inventoryApi.createProduct(form)
            }
            setShowDrawer(false)
            fetchProducts()
        } catch (err) {
            setError(err.response?.data?.message ?? 'Something went wrong')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this product?')) return
        await inventoryApi.deleteProduct(id)
        fetchProducts()
    }

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
                            <h2 className="text-2xl font-bold text-black drop-shadow-lg">Products</h2>
                        </div>
                        <p className="text-gray-700 ml-10 drop-shadow-md font-medium">
                            {products.length} products found
                        </p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-base font-medium px-8 py-3 rounded-[5px] transition-all duration-200 flex items-center gap-2 shadow-md"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Add Product
                    </button>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative md:w-96">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or SKU..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-white/80 backdrop-blur-md border border-gray-200 rounded-[5px] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white/80 backdrop-blur-md rounded-[5px] border border-gray-200 shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-emerald-50/50">
                                <tr>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Product</th>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">SKU</th>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Category</th>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Price</th>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Stock</th>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Status</th>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-8 text-gray-500">
                                            <Package className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                            Loading products...
                                        </td>
                                    </tr>
                                ) : products.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-8">
                                            <Package className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                                            <p className="text-gray-500 text-sm">No products found</p>
                                            <p className="text-gray-400 text-xs mt-1">Click "Add Product" to get started</p>
                                        </td>
                                    </tr>
                                ) : products.map((p) => (
                                    <tr key={p.id} className="hover:bg-white/40 transition-colors">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-[5px] bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                    {p.image ? (
                                                        <img
                                                            src={`http://localhost:8000/storage/${p.image}`}
                                                            alt={p.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <Package className="w-5 h-5 text-gray-300" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">{p.name}</p>
                                                    <label className="text-xs text-emerald-600 hover:text-emerald-700 cursor-pointer">
                                                        {p.image ? 'Change image' : 'Add image'}
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={async (e) => {
                                                                const file = e.target.files[0]
                                                                if (!file) return
                                                                try {
                                                                    await uploadProductImage(p.id, file)
                                                                    fetchProducts()
                                                                } catch {
                                                                    alert('Failed to upload image')
                                                                }
                                                            }}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-[5px] font-mono">
                                                {p.sku}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            {p.category ? (
                                                <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded-[5px] flex items-center gap-1 w-fit">
                                                    <Tag className="w-3 h-3" />
                                                    {p.category.name}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 text-xs">No category</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-1">
                                                <DollarSign className="w-3.5 h-3.5 text-gray-500" />
                                                <span className="text-gray-800 font-medium">${Number(p.price).toFixed(2)}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={`text-xs px-2 py-1 rounded-[5px] font-medium flex items-center gap-1 w-fit ${
                                                p.stock <= p.stock_alert
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-green-100 text-green-700'
                                            }`}>
                                                {p.stock <= p.stock_alert ? (
                                                    <AlertTriangle className="w-3 h-3" />
                                                ) : (
                                                    <CheckCircle className="w-3 h-3" />
                                                )}
                                                {p.stock} units
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={`text-xs px-2 py-1 rounded-[5px] font-medium flex items-center gap-1 w-fit ${
                                                p.status === 'active'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {p.status === 'active' ? (
                                                    <CheckCircle className="w-3 h-3" />
                                                ) : (
                                                    <XCircle className="w-3 h-3" />
                                                )}
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex gap-1">
                                                <button 
                                                    onClick={() => openEdit(p)} 
                                                    className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-[5px] transition"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(p.id)} 
                                                    className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-[5px] transition"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Side Drawer - Add/Edit Product (like cart drawer on homepage) */}
                {showDrawer && (
                    <div className="fixed inset-0 z-50 flex justify-end">
                        <div className="fixed inset-0 bg-black/40" onClick={() => setShowDrawer(false)} />
                        <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
                            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-white">
                                <h3 className="font-bold text-gray-800 text-xl flex items-center gap-2">
                                    {editing ? (
                                        <>
                                            <Edit className="w-6 h-6 text-emerald-600" />
                                            Edit Product
                                        </>
                                    ) : (
                                        <>
                                            <PlusCircle className="w-6 h-6 text-emerald-600" />
                                            Add New Product
                                        </>
                                    )}
                                </h3>
                                <button
                                    onClick={() => setShowDrawer(false)}
                                    className="w-8 h-8 flex items-center justify-center rounded-[5px] hover:bg-gray-100 text-gray-500 transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-6 py-5">
                                {error && (
                                    <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-[5px] flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        {error}
                                    </div>
                                )}
                                
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Package className="w-3.5 h-3.5 inline mr-1" />
                                            Product Name
                                        </label>
                                        <input
                                            type="text" required value={form.name}
                                            onChange={e => {
                                                const name = e.target.value
                                                setForm({
                                                    ...form,
                                                    name,
                                                    sku: !editing && !form.sku ? generateSku(name) : form.sku
                                                })
                                            }}
                                            placeholder="Enter product name"
                                            className="w-full border border-gray-200 rounded-[5px] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Hash className="w-3.5 h-3.5 inline mr-1" />
                                            SKU
                                            {!editing && (
                                                <button
                                                    type="button"
                                                    onClick={() => setForm({...form, sku: generateSku(form.name || 'PRD')})}
                                                    className="ml-2 text-xs text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
                                                >
                                                    <RefreshCw className="w-3 h-3" />
                                                    Auto-generate
                                                </button>
                                            )}
                                        </label>
                                        <input
                                            type="text" required value={form.sku}
                                            onChange={e => setForm({...form, sku: e.target.value})}
                                            placeholder="e.g. PRD-1234"
                                            className="w-full border border-gray-200 rounded-[5px] px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <DollarSign className="w-3.5 h-3.5 inline mr-1" />
                                                Price ($)
                                            </label>
                                            <input
                                                type="number" required min="0" step="0.01" value={form.price}
                                                onChange={e => setForm({...form, price: e.target.value})}
                                                placeholder="0.00"
                                                className="w-full border border-gray-200 rounded-[5px] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <TrendingUp className="w-3.5 h-3.5 inline mr-1" />
                                                Cost ($)
                                            </label>
                                            <input
                                                type="number" required min="0" step="0.01" value={form.cost}
                                                onChange={e => setForm({...form, cost: e.target.value})}
                                                placeholder="0.00"
                                                className="w-full border border-gray-200 rounded-[5px] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Package className="w-3.5 h-3.5 inline mr-1" />
                                                Stock
                                            </label>
                                            <input
                                                type="number" required min="0" value={form.stock}
                                                onChange={e => setForm({...form, stock: e.target.value})}
                                                placeholder="0"
                                                className="w-full border border-gray-200 rounded-[5px] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <AlertTriangle className="w-3.5 h-3.5 inline mr-1" />
                                                Stock Alert
                                            </label>
                                            <input
                                                type="number" required min="0" value={form.stock_alert}
                                                onChange={e => setForm({...form, stock_alert: e.target.value})}
                                                placeholder="10"
                                                className="w-full border border-gray-200 rounded-[5px] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Layers className="w-3.5 h-3.5 inline mr-1" />
                                                Category
                                            </label>
                                            <select
                                                value={form.category_id}
                                                onChange={e => setForm({...form, category_id: e.target.value})}
                                                className="w-full border border-gray-200 rounded-[5px] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                            >
                                                <option value="">No Category</option>
                                                {categories.map(c => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Status
                                            </label>
                                            <select
                                                value={form.status}
                                                onChange={e => setForm({...form, status: e.target.value})}
                                                className="w-full border border-gray-200 rounded-[5px] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FileText className="w-3.5 h-3.5 inline mr-1" />
                                            Description
                                        </label>
                                        <textarea
                                            rows="3" value={form.description}
                                            onChange={e => setForm({...form, description: e.target.value})}
                                            placeholder="Optional product description..."
                                            className="w-full border border-gray-200 rounded-[5px] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-4 pb-6">
                                        <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-[5px] text-sm transition-all duration-200 shadow-md hover:shadow-lg">
                                            {editing ? 'Update Product' : 'Create Product'}
                                        </button>
                                        <button type="button" onClick={() => setShowDrawer(false)} className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-[5px] text-sm hover:bg-gray-50 transition-all duration-200">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes slide-in-right {
                    from {
                        transform: translateX(100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }
                .animate-slide-in-right {
                    animation: slide-in-right 0.3s ease-out;
                }
            `}</style>
        </div>
    )
}