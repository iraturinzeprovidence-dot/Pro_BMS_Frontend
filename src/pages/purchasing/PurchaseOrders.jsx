import { useState, useEffect } from 'react'
import { purchasingApi } from '../../api/purchasingApi'
import { inventoryApi } from '../../api/inventoryApi'

export default function PurchaseOrders() {
    const [orders, setOrders]         = useState([])
    const [suppliers, setSuppliers]   = useState([])
    const [products, setProducts]     = useState([])
    const [search, setSearch]         = useState('')
    const [loading, setLoading]       = useState(true)
    const [showModal, setShowModal]   = useState(false)
    const [error, setError]           = useState('')
    const [receiving, setReceiving]   = useState(null)
    const [form, setForm]             = useState({
        supplier_id: '', payment_status: 'unpaid',
        tax: '0', expected_date: '', notes: '',
        items: [{ product_id: '', quantity: 1, unit_cost: 0 }],
    })

    const fetchOrders = async () => {
        setLoading(true)
        const r = await purchasingApi.getOrders({ search })
        setOrders(r.data)
        setLoading(false)
    }

    useEffect(() => {
        purchasingApi.getSuppliers({}).then(r => setSuppliers(r.data))
        inventoryApi.getProducts({}).then(r => setProducts(r.data))
    }, [])

    useEffect(() => { fetchOrders() }, [search])

    const openCreate = () => {
        setForm({
            supplier_id: '', payment_status: 'unpaid',
            tax: '0', expected_date: '', notes: '',
            items: [{ product_id: '', quantity: 1, unit_cost: 0 }],
        })
        setError('')
        setShowModal(true)
    }

    const addItem = () => {
        setForm({ ...form, items: [...form.items, { product_id: '', quantity: 1, unit_cost: 0 }] })
    }

    const removeItem = (index) => {
        setForm({ ...form, items: form.items.filter((_, i) => i !== index) })
    }

    const updateItem = (index, field, value) => {
        const items = [...form.items]
        items[index][field] = value
        if (field === 'product_id') {
            const product = products.find(p => p.id == value)
            if (product) items[index].unit_cost = product.cost
        }
        setForm({ ...form, items })
    }

    const getSubtotal = () => form.items.reduce((sum, item) => sum + (item.quantity * item.unit_cost), 0)
    const getTotal    = () => getSubtotal() + Number(form.tax)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            await purchasingApi.createOrder(form)
            setShowModal(false)
            fetchOrders()
        } catch (err) {
            setError(err.response?.data?.message ?? 'Something went wrong')
        }
    }

    const handleReceive = async (order) => {
        setReceiving(order.id)
        try {
            await purchasingApi.updateOrder(order.id, {
                status:         'received',
                payment_status: order.payment_status,
            })
            fetchOrders()
        } catch (err) {
            alert(err.response?.data?.message ?? 'Failed to receive order')
        } finally {
            setReceiving(null)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this purchase order?')) return
        await purchasingApi.deleteOrder(id)
        fetchOrders()
    }

    const statusColor = (s) => ({
        draft:     'bg-gray-100 text-gray-600',
        sent:      'bg-blue-100 text-blue-700',
        received:  'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700',
    }[s] ?? 'bg-gray-100 text-gray-600')

    const paymentColor = (s) => ({
        unpaid:  'bg-red-100 text-red-700',
        paid:    'bg-green-100 text-green-700',
        partial: 'bg-yellow-100 text-yellow-700',
    }[s] ?? 'bg-gray-100 text-gray-600')

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Purchase Orders</h2>
                    <p className="text-gray-500 text-sm mt-1">{orders.length} orders</p>
                </div>
                <button
                    onClick={openCreate}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
                >
                    + New Purchase Order
                </button>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by PO number..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-80 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">PO Number</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Supplier</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Total</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Status</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Payment</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Date</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan="7" className="text-center py-8 text-gray-400">Loading...</td></tr>
                        ) : orders.length === 0 ? (
                            <tr><td colSpan="7" className="text-center py-8 text-gray-400">No purchase orders found</td></tr>
                        ) : orders.map((o) => (
                            <tr key={o.id} className="hover:bg-gray-50">
                                <td className="px-6 py-3 font-medium text-gray-800">{o.po_number}</td>
                                <td className="px-6 py-3 text-gray-500">{o.supplier?.name ?? '—'}</td>
                                <td className="px-6 py-3 font-medium text-gray-800">${Number(o.total).toFixed(2)}</td>
                                <td className="px-6 py-3">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(o.status)}`}>
                                        {o.status}
                                    </span>
                                </td>
                                <td className="px-6 py-3">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${paymentColor(o.payment_status)}`}>
                                        {o.payment_status}
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-gray-500">
                                    {new Date(o.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-3">
                                    <div className="flex gap-2">
                                        {o.status !== 'received' && o.status !== 'cancelled' && (
                                            <button
                                                onClick={() => handleReceive(o)}
                                                disabled={receiving === o.id}
                                                className="text-green-600 hover:underline text-xs font-medium disabled:opacity-50"
                                            >
                                                {receiving === o.id ? 'Receiving...' : 'Receive'}
                                            </button>
                                        )}
                                        {o.status === 'received' && (
                                            <span className="text-green-600 text-xs font-medium">✅ Received</span>
                                        )}
                                        <button
                                            onClick={() => handleDelete(o.id)}
                                            className="text-red-500 hover:underline text-xs"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 max-h-screen overflow-y-auto">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Create Purchase Order</h3>

                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                                    <select
                                        value={form.supplier_id}
                                        onChange={e => setForm({...form, supplier_id: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">No Supplier</option>
                                        {suppliers.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                                    <select
                                        value={form.payment_status}
                                        onChange={e => setForm({...form, payment_status: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="unpaid">Unpaid</option>
                                        <option value="paid">Paid</option>
                                        <option value="partial">Partial</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax ($)</label>
                                    <input
                                        type="number" min="0" step="0.01" value={form.tax}
                                        onChange={e => setForm({...form, tax: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Expected Date</label>
                                    <input
                                        type="date" value={form.expected_date}
                                        onChange={e => setForm({...form, expected_date: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-medium text-gray-700">Order Items</label>
                                    <button
                                        type="button" onClick={addItem}
                                        className="text-blue-600 text-xs hover:underline"
                                    >
                                        + Add Item
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {form.items.map((item, index) => (
                                        <div key={index} className="grid grid-cols-4 gap-2 items-center">
                                            <select
                                                value={item.product_id}
                                                onChange={e => updateItem(index, 'product_id', e.target.value)}
                                                className="col-span-2 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select Product</option>
                                                {products.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </select>
                                            <input
                                                type="number" min="1" value={item.quantity}
                                                onChange={e => updateItem(index, 'quantity', e.target.value)}
                                                placeholder="Qty"
                                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <div className="flex gap-1 items-center">
                                                <input
                                                    type="number" min="0" step="0.01" value={item.unit_cost}
                                                    onChange={e => updateItem(index, 'unit_cost', e.target.value)}
                                                    placeholder="Cost"
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {form.items.length > 1 && (
                                                    <button
                                                        type="button" onClick={() => removeItem(index)}
                                                        className="text-red-400 hover:text-red-600 text-lg font-bold"
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span><span>${getSubtotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax</span><span>${Number(form.tax).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-gray-800 border-t border-gray-200 pt-1 mt-1">
                                    <span>Total</span><span>${getTotal().toFixed(2)}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                <textarea
                                    rows="2" value={form.notes}
                                    onChange={e => setForm({...form, notes: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm"
                                >
                                    Create Purchase Order
                                </button>
                                <button
                                    type="button" onClick={() => setShowModal(false)}
                                    className="flex-1 border border-gray-300 text-gray-700 font-medium py-2 rounded-lg text-sm hover:bg-gray-50"
                                >
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