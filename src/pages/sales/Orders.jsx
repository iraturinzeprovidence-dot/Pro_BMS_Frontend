import { useState, useEffect } from 'react'
import { salesApi } from '../../api/salesApi'
import { inventoryApi } from '../../api/inventoryApi'
import { pdfApi, downloadPdf } from '../../api/pdfApi'
import {
    Plus, Search, FileDown, CheckCircle,
    Trash2, Truck, Clock, XCircle, Package,
    ShoppingCart, Users, DollarSign, Calendar,
    FileText, CreditCard, X, AlertCircle, Send,
    PlusCircle, Eye, TrendingUp, RefreshCw
} from 'lucide-react'

export default function Orders() {
    const [orders, setOrders]         = useState([])
    const [customers, setCustomers]   = useState([])
    const [products, setProducts]     = useState([])
    const [search, setSearch]         = useState('')
    const [loading, setLoading]       = useState(true)
    const [showModal, setShowModal]   = useState(false)
    const [error, setError]           = useState('')
    const [pdfLoading, setPdfLoading] = useState(null)
    const [form, setForm]             = useState({
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

    const addItem    = () => setForm({ ...form, items: [...form.items, { product_id: '', quantity: 1, unit_price: 0 }] })
    const removeItem = (i) => setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) })

    const updateItem = (index, field, value) => {
        const items = [...form.items]
        items[index][field] = value
        if (field === 'product_id') {
            const p = products.find(p => p.id == value)
            if (p) items[index].unit_price = p.price
        }
        setForm({ ...form, items })
    }

    const getSubtotal = () => form.items.reduce((s, i) => s + i.quantity * i.unit_price, 0)
    const getTotal    = () => getSubtotal() + Number(form.tax) - Number(form.discount)

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

    const handleStatusUpdate = async (id, status, payment_status) => {
        await salesApi.updateOrder(id, { status, payment_status })
        fetchOrders()
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this order?')) return
        await salesApi.deleteOrder(id)
        fetchOrders()
    }

    const handleExportPdf = async (id, orderNumber) => {
        setPdfLoading(id)
        try {
            const r = await pdfApi.exportOrder(id)
            downloadPdf(r.data, `order-${orderNumber}.pdf`)
        } catch {
            alert('Failed to export PDF')
        } finally {
            setPdfLoading(null)
        }
    }

    const STAGES = [
        { status: 'pending',    label: 'Pending',    icon: Clock,        color: 'bg-yellow-100 text-yellow-700' },
        { status: 'processing', label: 'Processing', icon: RefreshCw,    color: 'bg-blue-100 text-blue-700'    },
        { status: 'delivering', label: 'Delivering', icon: Truck,        color: 'bg-purple-100 text-purple-700'},
        { status: 'completed',  label: 'Completed',  icon: CheckCircle,  color: 'bg-green-100 text-green-700'  },
    ]

    const stageColor = (s) => ({
        pending:    'bg-yellow-100 text-yellow-700',
        processing: 'bg-blue-100 text-blue-700',
        delivering: 'bg-purple-100 text-purple-700',
        completed:  'bg-green-100 text-green-700',
        cancelled:  'bg-red-100 text-red-700',
    }[s] ?? 'bg-gray-100 text-gray-600')

    const stageIcon = (s) => ({
        pending:    Clock,
        processing: RefreshCw,
        delivering: Truck,
        completed:  CheckCircle,
        cancelled:  XCircle,
    }[s] ?? Clock)

    const paymentColor = (s) => ({
        unpaid:  'bg-red-100 text-red-700',
        paid:    'bg-green-100 text-green-700',
        partial: 'bg-yellow-100 text-yellow-700',
    }[s] ?? 'bg-gray-100 text-gray-600')

    const nextStage = (current) => ({
        pending:    'processing',
        processing: 'delivering',
        delivering: 'completed',
    }[current] ?? null)

    const nextStageLabel = (current) => ({
        pending:    'Start Processing',
        processing: 'Mark Delivering',
        delivering: 'Mark Completed',
    }[current] ?? null)

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
            <div className="absolute inset-0 bg-emerald-900/30"></div>
            
            <div className="relative z-10 p-8">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <ShoppingCart className="w-7 h-7 text-emerald-800" />
                            <h2 className="text-2xl font-bold text-black drop-shadow-lg">Orders</h2>
                        </div>
                        <p className="text-gray-700 ml-10 drop-shadow-md font-medium">
                            {orders.length} orders total
                        </p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-base font-medium px-6 py-3 rounded-md transition-all duration-200 flex items-center gap-2 shadow-md"
                    >
                        <PlusCircle className="w-5 h-5" />
                        New Order
                    </button>
                </div>

                {/* Stage Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                    {[...STAGES, { status: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'bg-red-100 text-red-700' }].map(s => {
                        const Icon = s.icon
                        const count = orders.filter(o => o.status === s.status).length
                        return (
                            <div key={s.status} className={`${s.color} rounded-md p-3 text-center shadow-sm`}>
                                <Icon className="w-5 h-5 mx-auto mb-1" />
                                <p className="text-xl font-bold">{count}</p>
                                <p className="text-xs font-medium">{s.label}</p>
                            </div>
                        )
                    })}
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative md:w-96">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by order number..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-white/80 backdrop-blur-md border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white/80 backdrop-blur-md rounded-md border border-gray-200 shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-emerald-50/50">
                                <tr>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Order #</th>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Customer</th>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Total</th>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Stage</th>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Payment</th>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Date</th>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-8 text-gray-500">
                                            <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                            Loading orders...
                                        </td>
                                    </tr>
                                ) : orders.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-8">
                                            <ShoppingCart className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                                            <p className="text-gray-500 text-sm">No orders found</p>
                                            <p className="text-gray-400 text-xs mt-1">Click "New Order" to get started</p>
                                        </td>
                                    </tr>
                                ) : orders.map((o) => {
                                    const next = nextStage(o.status)
                                    const StageIcon = stageIcon(o.status)
                                    const nextIcon = next === 'processing' ? RefreshCw : next === 'delivering' ? Truck : CheckCircle
                                    return (
                                        <tr key={o.id} className="hover:bg-white/40 transition-colors">
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-emerald-600" />
                                                    <span className="font-medium text-gray-800">{o.order_number}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-1">
                                                    <Users className="w-3.5 h-3.5 text-gray-400" />
                                                    <span className="text-gray-600">{o.customer?.name ?? 'Walk-in'}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                                                    <span className="font-semibold text-gray-800">${Number(o.total).toFixed(2)}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 w-fit ${stageColor(o.status)}`}>
                                                    <StageIcon className="w-3 h-3" />
                                                    {o.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 w-fit ${paymentColor(o.payment_status)}`}>
                                                    {o.payment_status === 'paid' ? <CheckCircle className="w-3 h-3" /> : o.payment_status === 'unpaid' ? <XCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                    {o.payment_status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                    <span className="text-gray-500">{new Date(o.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex gap-1 flex-wrap">
                                                    {next && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(o.id, next, o.payment_status)}
                                                            className="flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-md text-xs font-medium transition"
                                                            title={nextStageLabel(o.status)}
                                                        >
                                                            <Send className="w-3 h-3" />
                                                            {nextStageLabel(o.status)}
                                                        </button>
                                                    )}
                                                    {o.status !== 'cancelled' && o.status !== 'completed' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(o.id, 'cancelled', o.payment_status)}
                                                            className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-600 hover:bg-red-200 rounded-md text-xs font-medium transition"
                                                        >
                                                            <XCircle className="w-3 h-3" />
                                                            Cancel
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleExportPdf(o.id, o.order_number)}
                                                        disabled={pdfLoading === o.id}
                                                        className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-600 hover:bg-purple-200 rounded-md text-xs font-medium transition disabled:opacity-50"
                                                    >
                                                        <FileDown className="w-3 h-3" />
                                                        {pdfLoading === o.id ? '...' : 'PDF'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(o.id)}
                                                        className="p-1 text-red-400 hover:text-red-600 transition"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    {o.payment_status !== 'paid' && o.status !== 'cancelled' && (
    <button
        onClick={async () => {
            await salesApi.markOrderPaid(o.id)
            fetchOrders()
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 text-xs font-medium rounded-md transition-all duration-200 border border-emerald-200 hover:border-emerald-300 shadow-sm hover:shadow"
    >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Mark Paid
    </button>
)}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Create Order Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
                        <div className="bg-white/95 backdrop-blur-md rounded-md shadow-xl w-full max-w-3xl mx-auto max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center px-8 py-5 border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur-md z-10">
                                <h3 className="text-xl font-bold text-black">Create New Order</h3>
                                <button onClick={() => setShowModal(false)} className="p-2 rounded-md hover:bg-gray-100 transition">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                            
                            {error && (
                                <div className="mx-8 mt-5 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-md flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit} className="p-8 space-y-5">
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Users className="w-3.5 h-3.5 inline mr-1" />
                                            Customer
                                        </label>
                                        <select value={form.customer_id} onChange={e => setForm({...form, customer_id: e.target.value})}
                                            className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50">
                                            <option value="">Walk-in Customer</option>
                                            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <CreditCard className="w-3.5 h-3.5 inline mr-1" />
                                            Payment Method
                                        </label>
                                        <select value={form.payment_method} onChange={e => setForm({...form, payment_method: e.target.value})}
                                            className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50">
                                            <option value="cash">Cash</option>
                                            <option value="bank_transfer">Bank Transfer</option>
                                            <option value="card">Card</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Payment Status
                                        </label>
                                        <select value={form.payment_status} onChange={e => setForm({...form, payment_status: e.target.value})}
                                            className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50">
                                            <option value="unpaid">Unpaid</option>
                                            <option value="paid">Paid</option>
                                            <option value="partial">Partial</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <DollarSign className="w-3.5 h-3.5 inline mr-1" />
                                            Tax ($)
                                        </label>
                                        <input type="number" min="0" step="0.01" value={form.tax}
                                            onChange={e => setForm({...form, tax: e.target.value})}
                                            className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <TrendingUp className="w-3.5 h-3.5 inline mr-1" />
                                            Discount ($)
                                        </label>
                                        <input type="number" min="0" step="0.01" value={form.discount}
                                            onChange={e => setForm({...form, discount: e.target.value})}
                                            className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="text-sm font-medium text-gray-700">
                                            <Package className="w-3.5 h-3.5 inline mr-1" />
                                            Order Items
                                        </label>
                                        <button type="button" onClick={addItem} className="text-emerald-600 text-xs hover:text-emerald-700 flex items-center gap-1">
                                            <PlusCircle className="w-3.5 h-3.5" />
                                            Add Item
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {form.items.map((item, index) => (
                                            <div key={index} className="grid grid-cols-4 gap-2 items-center">
                                                <select value={item.product_id} onChange={e => updateItem(index, 'product_id', e.target.value)}
                                                    className="col-span-2 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50">
                                                    <option value="">Select Product</option>
                                                    {products.map(p => <option key={p.id} value={p.id}>{p.name} (${Number(p.price).toFixed(2)})</option>)}
                                                </select>
                                                <input type="number" min="1" value={item.quantity}
                                                    onChange={e => updateItem(index, 'quantity', e.target.value)}
                                                    placeholder="Qty"
                                                    className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" />
                                                <div className="flex gap-1 items-center">
                                                    <input type="number" min="0" step="0.01" value={item.unit_price}
                                                        onChange={e => updateItem(index, 'unit_price', e.target.value)}
                                                        placeholder="Price"
                                                        className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" />
                                                    {form.items.length > 1 && (
                                                        <button type="button" onClick={() => removeItem(index)} className="text-red-400 hover:text-red-600">
                                                            <XCircle className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-emerald-50 rounded-md p-4 text-sm space-y-1 border border-emerald-200">
                                    <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>${getSubtotal().toFixed(2)}</span></div>
                                    <div className="flex justify-between text-gray-600"><span>Tax</span><span>${Number(form.tax).toFixed(2)}</span></div>
                                    <div className="flex justify-between text-gray-600"><span>Discount</span><span>-${Number(form.discount).toFixed(2)}</span></div>
                                    <div className="flex justify-between font-bold text-gray-800 border-t border-emerald-200 pt-2 mt-1"><span>Total</span><span className="text-emerald-700">${getTotal().toFixed(2)}</span></div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FileText className="w-3.5 h-3.5 inline mr-1" />
                                        Notes
                                    </label>
                                    <textarea rows="2" value={form.notes}
                                        onChange={e => setForm({...form, notes: e.target.value})}
                                        className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                        placeholder="Optional notes..." />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button type="submit" className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2.5 rounded-md text-sm transition">
                                        Create Order
                                    </button>
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-md text-sm hover:bg-gray-50 transition">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}