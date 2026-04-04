import { useState, useEffect } from 'react'
import { salesApi } from '../../api/salesApi'
import { inventoryApi } from '../../api/inventoryApi'
import { pdfApi, downloadPdf } from '../../api/pdfApi'

export default function Orders() {
    const handleExportOrder = async (id, orderNumber) => {
    const r = await pdfApi.exportOrder(id)
    downloadPdf(r.data, `order-${orderNumber}.pdf`)
}
    const [orders, setOrders]       = useState([])
    const [customers, setCustomers] = useState([])
    const [products, setProducts]   = useState([])
    const [search, setSearch]       = useState('')
    const [loading, setLoading]     = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [viewing, setViewing]     = useState(null)
    const [error, setError]         = useState('')
    const [form, setForm]           = useState({
        customer_id: '', payment_method: 'cash',
        payment_status: 'unpaid', tax: '0', discount: '0', notes: '',
        items: [{ product_id: '', quantity: 1, unit_price: 0 }],
    })

    const fetchOrders = async () => {
        setLoading(true)
        const r = await salesApi.getOrders({ search })
        setOrders(r.data)
        setLoading(false)
    }

    useEffect(() => {
        salesApi.getCustomers({}).then(r => setCustomers(r.data))
        inventoryApi.getProducts({}).then(r => setProducts(r.data))
    }, [])

    useEffect(() => { fetchOrders() }, [search])

    const openCreate = () => {
        setForm({
            customer_id: '', payment_method: 'cash',
            payment_status: 'unpaid', tax: '0', discount: '0', notes: '',
            items: [{ product_id: '', quantity: 1, unit_price: 0 }],
        })
        setError('')
        setShowModal(true)
    }

    const addItem = () => {
        setForm({ ...form, items: [...form.items, { product_id: '', quantity: 1, unit_price: 0 }] })
    }

    const removeItem = (index) => {
        setForm({ ...form, items: form.items.filter((_, i) => i !== index) })
    }

    const updateItem = (index, field, value) => {
        const items = [...form.items]
        items[index][field] = value
        if (field === 'product_id') {
            const product = products.find(p => p.id == value)
            if (product) items[index].unit_price = product.price
        }
        setForm({ ...form, items })
    }

    const getSubtotal = () => {
        return form.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
    }

    const getTotal = () => {
        return getSubtotal() + Number(form.tax) - Number(form.discount)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            await salesApi.createOrder(form)
            setShowModal(false)
            fetchOrders()
        } catch (err) {
            setError(err.response?.data?.message ?? 'Something went wrong')
        }
    }

    const handleUpdateStatus = async (id, status, payment_status) => {
        await salesApi.updateOrder(id, { status, payment_status })
        fetchOrders()
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this order?')) return
        await salesApi.deleteOrder(id)
        fetchOrders()
    }

    const statusColor = (s) => ({
        pending:    'bg-yellow-100 text-yellow-700',
        processing: 'bg-blue-100 text-blue-700',
        completed:  'bg-green-100 text-green-700',
        cancelled:  'bg-red-100 text-red-700',
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
                    <h2 className="text-2xl font-bold text-gray-800">Orders</h2>
                    <p className="text-gray-500 text-sm mt-1">{orders.length} orders</p>
                </div>
                <button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg">
                    + New Order
                </button>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by order number..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-80 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Order #</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Customer</th>
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
                            <tr><td colSpan="7" className="text-center py-8 text-gray-400">No orders found</td></tr>
                        ) : orders.map((o) => (
                            <tr key={o.id} className="hover:bg-gray-50">
                                <td className="px-6 py-3 font-medium text-gray-800">{o.order_number}</td>
                                <td className="px-6 py-3 text-gray-500">{o.customer?.name ?? 'Walk-in'}</td>
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
                                <td className="px-6 py-3 text-gray-500">{new Date(o.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-3 flex gap-2">
                                    <button
                                        onClick={() => handleUpdateStatus(o.id, 'completed', 'paid')}
                                        className="text-green-600 hover:underline text-xs"
                                    >
                                        Complete
                                    </button>
                                    <button onClick={() => handleDelete(o.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                                </td>
                                <button onClick={() => handleExportOrder(o.id, o.order_number)}
                                  className="text-purple-600 hover:underline text-xs">PDF </button>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create Order Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 max-h-screen overflow-y-auto">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Create New Order</h3>

                        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                                    <select value={form.customer_id} onChange={e => setForm({...form, customer_id: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">Walk-in Customer</option>
                                        {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                                    <select value={form.payment_method} onChange={e => setForm({...form, payment_method: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="cash">Cash</option>
                                        <option value="bank_transfer">Bank Transfer</option>
                                        <option value="card">Card</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                                    <select value={form.payment_status} onChange={e => setForm({...form, payment_status: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="unpaid">Unpaid</option>
                                        <option value="paid">Paid</option>
                                        <option value="partial">Partial</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax ($)</label>
                                    <input type="number" min="0" step="0.01" value={form.tax} onChange={e => setForm({...form, tax: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount ($)</label>
                                    <input type="number" min="0" step="0.01" value={form.discount} onChange={e => setForm({...form, discount: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-medium text-gray-700">Order Items</label>
                                    <button type="button" onClick={addItem} className="text-blue-600 text-xs hover:underline">+ Add Item</button>
                                </div>
                                <div className="space-y-2">
                                    {form.items.map((item, index) => (
                                        <div key={index} className="grid grid-cols-4 gap-2 items-center">
                                            <select value={item.product_id} onChange={e => updateItem(index, 'product_id', e.target.value)}
                                                className="col-span-2 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                <option value="">Select Product</option>
                                                {products.map(p => <option key={p.id} value={p.id}>{p.name} (${Number(p.price).toFixed(2)})</option>)}
                                            </select>
                                            <input type="number" min="1" value={item.quantity} onChange={e => updateItem(index, 'quantity', e.target.value)}
                                                placeholder="Qty"
                                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                            <div className="flex gap-1 items-center">
                                                <input type="number" min="0" step="0.01" value={item.unit_price} onChange={e => updateItem(index, 'unit_price', e.target.value)}
                                                    placeholder="Price"
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                                {form.items.length > 1 && (
                                                    <button type="button" onClick={() => removeItem(index)} className="text-red-400 hover:text-red-600 text-lg font-bold">×</button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Totals */}
                            <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>${getSubtotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax</span>
                                    <span>${Number(form.tax).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Discount</span>
                                    <span>-${Number(form.discount).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-gray-800 border-t border-gray-200 pt-1 mt-1">
                                    <span>Total</span>
                                    <span>${getTotal().toFixed(2)}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                <textarea rows="2" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm">
                                    Create Order
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