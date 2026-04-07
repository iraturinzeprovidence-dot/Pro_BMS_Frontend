import { useState, useEffect } from 'react'
import { salesApi } from '../../api/salesApi'
import { inventoryApi } from '../../api/inventoryApi'
import { pdfApi, downloadPdf } from '../../api/pdfApi'
import {
  ShoppingCart,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Users,
  Package,
  Truck,
  Calendar,
  FileText,
  Printer,
  Eye,
  X,
  AlertCircle,
  Send,
  RefreshCw,
  CreditCard,
  TrendingUp
} from 'lucide-react'

export default function Orders() {
    const [currency, setCurrency] = useState('USD')

    const currencies = [
        { code: 'USD', symbol: '$', name: 'US Dollar' },
        { code: 'EUR', symbol: '€', name: 'Euro' },
        { code: 'GBP', symbol: '£', name: 'British Pound' },
        { code: 'RWF', symbol: 'RWF', name: 'Rwandan Franc' },
        { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
        { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling' },
        { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling' },
        { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
        { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
    ]

    const currencySymbol = currencies.find(c => c.code === currency)?.symbol ?? '$'

    const [orders, setOrders]       = useState([])
    const [customers, setCustomers] = useState([])
    const [products, setProducts]   = useState([])
    const [search, setSearch]       = useState('')
    const [loading, setLoading]     = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [error, setError]         = useState('')
    const [pdfLoading, setPdfLoading] = useState(null)
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
        salesApi.getCustomers({}).then(r => {
            setCustomers(r.data)
        }).catch(err => {
            console.error('Failed to load customers:', err)
        })
        inventoryApi.getProducts({}).then(r => setProducts(r.data))
        fetchOrders()
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

    const getSubtotal = () => form.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
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

    const handleUpdateStatus = async (id, status, payment_status) => {
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
        } catch (err) {
            alert('Failed to export PDF. Please try again.')
        } finally {
            setPdfLoading(null)
        }
    }

    const statusConfig = (s) => ({
        pending:    { color: 'bg-yellow-100 text-yellow-700', icon: Clock, label: 'Pending' },
        processing: { color: 'bg-blue-100 text-blue-700', icon: RefreshCw, label: 'Processing' },
        completed:  { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Completed' },
        cancelled:  { color: 'bg-red-100 text-red-700', icon: XCircle, label: 'Cancelled' },
    }[s] ?? { color: 'bg-gray-100 text-gray-600', icon: Clock, label: s })

    const paymentConfig = (s) => ({
        unpaid:  { color: 'bg-red-100 text-red-700', icon: XCircle, label: 'Unpaid' },
        paid:    { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Paid' },
        partial: { color: 'bg-yellow-100 text-yellow-700', icon: Clock, label: 'Partial' },
    }[s] ?? { color: 'bg-gray-100 text-gray-600', icon: Clock, label: s })

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

                {/* Currency Selector */}
                <div className="mb-4 flex justify-end">
                    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md rounded-md px-3 py-1.5 border border-gray-200">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="bg-transparent text-sm focus:outline-none text-gray-700"
                        >
                            {currencies.map(c => (
                                <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                            ))}
                        </select>
                    </div>
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
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Status</th>
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
                                    const status = statusConfig(o.status)
                                    const StatusIcon = status.icon
                                    const payment = paymentConfig(o.payment_status)
                                    const PaymentIcon = payment.icon
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
                                                    <span className="font-semibold text-gray-800">{currencySymbol}{Number(o.total).toFixed(2)}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 w-fit ${status.color}`}>
                                                    <StatusIcon className="w-3 h-3" />
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 w-fit ${payment.color}`}>
                                                    <PaymentIcon className="w-3 h-3" />
                                                    {payment.label}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                    <span className="text-gray-500">{new Date(o.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex gap-1">
                                                    {o.status !== 'completed' && o.status !== 'cancelled' && (
                                                        <button
                                                            onClick={() => handleUpdateStatus(o.id, 'completed', 'paid')}
                                                            className="p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition"
                                                            title="Complete Order"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleExportPdf(o.id, o.order_number)}
                                                        disabled={pdfLoading === o.id}
                                                        className="p-1.5 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-md transition disabled:opacity-50"
                                                        title="Export PDF"
                                                    >
                                                        <Printer className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(o.id)}
                                                        className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                                                        title="Delete Order"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
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
                                            Tax
                                        </label>
                                        <input type="number" min="0" step="0.01" value={form.tax}
                                            onChange={e => setForm({...form, tax: e.target.value})}
                                            className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <TrendingUp className="w-3.5 h-3.5 inline mr-1" />
                                            Discount
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
                                                    {products.map(p => (
                                                        <option key={p.id} value={p.id}>{p.name} ({currencySymbol}{Number(p.price).toFixed(2)})</option>
                                                    ))}
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
                                                        <button type="button" onClick={() => removeItem(index)}
                                                            className="text-red-400 hover:text-red-600">
                                                            <XCircle className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-emerald-50 rounded-md p-4 text-sm space-y-1 border border-emerald-200">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>{currencySymbol}{getSubtotal().toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tax</span>
                                        <span>{currencySymbol}{Number(form.tax).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Discount</span>
                                        <span>-{currencySymbol}{Number(form.discount).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-gray-800 border-t border-emerald-200 pt-2 mt-1">
                                        <span>Total</span>
                                        <span className="text-emerald-700">{currencySymbol}{getTotal().toFixed(2)}</span>
                                    </div>
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
                                    <button type="button" onClick={() => setShowModal(false)}
                                        className="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-md text-sm hover:bg-gray-50 transition">
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