import { useState, useEffect } from 'react'
import { inventoryApi } from '../../api/inventoryApi'

export default function Products() {
    const [products, setProducts]     = useState([])
    const [categories, setCategories] = useState([])
    const [search, setSearch]         = useState('')
    const [loading, setLoading]       = useState(true)
    const [showModal, setShowModal]   = useState(false)
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
        setShowModal(true)
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
        setShowModal(true)
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
            setShowModal(false)
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
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Products</h2>
                    <p className="text-gray-500 text-sm mt-1">{products.length} products found</p>
                </div>
                <button
                    onClick={openCreate}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
                >
                    + Add Product
                </button>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by name or SKU..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-80 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Product</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">SKU</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Category</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Price</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Stock</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Status</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan="7" className="text-center py-8 text-gray-400">Loading...</td></tr>
                        ) : products.length === 0 ? (
                            <tr><td colSpan="7" className="text-center py-8 text-gray-400">No products found</td></tr>
                        ) : products.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50">
                                <td className="px-6 py-3 font-medium text-gray-800">{p.name}</td>
                                <td className="px-6 py-3">
                                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded font-mono">
                                        {p.sku}
                                    </span>
                                </td>
                                <td className="px-6 py-3">
                                    {p.category ? (
                                        <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                                            {p.category.name}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400 text-xs">No category</span>
                                    )}
                                </td>
                                <td className="px-6 py-3 text-gray-800">${Number(p.price).toFixed(2)}</td>
                                <td className="px-6 py-3">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                        p.stock <= p.stock_alert
                                            ? 'bg-red-100 text-red-700'
                                            : 'bg-green-100 text-green-700'
                                    }`}>
                                        {p.stock}
                                    </span>
                                </td>
                                <td className="px-6 py-3">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                        p.status === 'active'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {p.status}
                                    </span>
                                </td>
                                <td className="px-6 py-3 flex gap-3">
                                    <button onClick={() => openEdit(p)} className="text-blue-600 hover:underline text-xs">Edit</button>
                                    <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 max-h-screen overflow-y-auto">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">
                            {editing ? 'Edit Product' : 'Add New Product'}
                        </h3>

                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
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
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        SKU
                                        {!editing && (
                                            <button
                                                type="button"
                                                onClick={() => setForm({...form, sku: generateSku(form.name || 'PRD')})}
                                                className="ml-2 text-xs text-blue-600 hover:underline"
                                            >
                                                Auto-generate
                                            </button>
                                        )}
                                    </label>
                                    <input
                                        type="text" required value={form.sku}
                                        onChange={e => setForm({...form, sku: e.target.value})}
                                        placeholder="e.g. PRD-1234"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                    <input
                                        type="number" required min="0" step="0.01" value={form.price}
                                        onChange={e => setForm({...form, price: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cost ($)</label>
                                    <input
                                        type="number" required min="0" step="0.01" value={form.cost}
                                        onChange={e => setForm({...form, cost: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                    <input
                                        type="number" required min="0" value={form.stock}
                                        onChange={e => setForm({...form, stock: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Alert</label>
                                    <input
                                        type="number" required min="0" value={form.stock_alert}
                                        onChange={e => setForm({...form, stock_alert: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        value={form.category_id}
                                        onChange={e => setForm({...form, category_id: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">No Category</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        value={form.status}
                                        onChange={e => setForm({...form, status: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    rows="2" value={form.description}
                                    onChange={e => setForm({...form, description: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm">
                                    {editing ? 'Update Product' : 'Create Product'}
                                </button>
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-300 text-gray-700 font-medium py-2 rounded-lg text-sm hover:bg-gray-50">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}