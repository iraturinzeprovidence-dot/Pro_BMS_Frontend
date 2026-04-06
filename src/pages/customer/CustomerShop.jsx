import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import {
    ShoppingCart, Package, Plus, Minus,
    Trash2, CheckCircle, LogOut, User,
    ClipboardList, Search, Home, Truck,
    CreditCard, Wallet, X
} from 'lucide-react'

export default function CustomerShop() {
    const { user, logout }            = useAuth()
    const navigate                    = useNavigate()
    const [products, setProducts]     = useState([])
    const [orders, setOrders]         = useState([])
    const [cart, setCart]             = useState([])
    const [search, setSearch]         = useState('')
    const [view, setView]             = useState('shop')
    const [loading, setLoading]       = useState(true)
    const [placing, setPlacing]       = useState(false)
    const [success, setSuccess]       = useState('')
    const [error, setError]           = useState('')
    const [paymentMethod, setPaymentMethod] = useState('cash')

    useEffect(() => {
        api.get('/customer/products').then(r => setProducts(r.data)).finally(() => setLoading(false))
        api.get('/customer/my-orders').then(r => setOrders(r.data))
    }, [])

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.name?.toLowerCase().includes(search.toLowerCase())
    )

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(i => i.product_id === product.id)
            if (existing) {
                return prev.map(i =>
                    i.product_id === product.id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                )
            }
            return [...prev, {
                product_id: product.id,
                name:       product.name,
                price:      product.price,
                image:      product.image,
                stock:      product.stock,
                quantity:   1,
            }]
        })
    }

    const updateQty = (productId, qty) => {
        if (qty < 1) {
            setCart(prev => prev.filter(i => i.product_id !== productId))
            return
        }
        setCart(prev => prev.map(i =>
            i.product_id === productId ? { ...i, quantity: qty } : i
        ))
    }

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(i => i.product_id !== productId))
    }

    const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0)
    const cartCount = cart.reduce((s, i) => s + i.quantity, 0)

    const placeOrder = async () => {
        setPlacing(true)
        setError('')
        try {
            const r = await api.post('/customer/order', {
                items:          cart.map(i => ({ product_id: i.product_id, quantity: i.quantity })),
                payment_method: paymentMethod,
            })
            setSuccess(`Order ${r.data.order_number} placed! Total: $${Number(r.data.total).toFixed(2)}`)
            setCart([])
            setView('orders')
            const ro = await api.get('/customer/my-orders')
            setOrders(ro.data)
        } catch (err) {
            setError(err.response?.data?.message ?? 'Failed to place order')
        } finally {
            setPlacing(false)
        }
    }

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    const statusConfig = (s) => ({
        pending:    { color: 'bg-yellow-100 text-yellow-700', icon: Clock },
        processing: { color: 'bg-blue-100 text-blue-700', icon: Truck },
        completed:  { color: 'bg-green-100 text-green-700', icon: CheckCircle },
        cancelled:  { color: 'bg-red-100 text-red-700', icon: X },
    }[s] ?? { color: 'bg-gray-100 text-gray-600', icon: Package })

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
            <div className="relative z-10">
                {/* Navbar */}
                <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 shadow-sm">
                    <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Home className="w-6 h-6 text-emerald-700" />
                            <h1 className="text-xl font-bold text-emerald-700">Pro_BMS Shop</h1>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setView('shop')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${
                                    view === 'shop' 
                                        ? 'bg-emerald-100 text-emerald-700' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <Package className="w-4 h-4" />
                                Products
                            </button>
                            <button
                                onClick={() => setView('cart')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition relative ${
                                    view === 'cart' 
                                        ? 'bg-emerald-100 text-emerald-700' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <ShoppingCart className="w-4 h-4" />
                                Cart
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => setView('orders')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${
                                    view === 'orders' 
                                        ? 'bg-emerald-100 text-emerald-700' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <ClipboardList className="w-4 h-4" />
                                My Orders
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <User className="w-4 h-4 text-emerald-600" />
                                {user?.name}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </nav>

                <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* Success Banner */}
                    {success && (
                        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6 flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                            <p className="text-green-700 font-medium text-sm">{success}</p>
                            <button onClick={() => setSuccess('')} className="ml-auto text-green-500 hover:text-green-700">✕</button>
                        </div>
                    )}

                    {/* ===== SHOP VIEW ===== */}
                    {view === 'shop' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-black drop-shadow-md">Available Products</h2>
                                <div className="relative">
                                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="border border-gray-200 rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/80 backdrop-blur-sm w-56"
                                    />
                                </div>
                            </div>

                            {loading ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[...Array(8)].map((_, i) => (
                                        <div key={i} className="bg-white/80 backdrop-blur-md rounded-md border border-gray-200 p-4 animate-pulse">
                                            <div className="h-32 bg-gray-200 rounded-md mb-3"></div>
                                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : filtered.length === 0 ? (
                                <div className="text-center py-16 text-gray-500">
                                    <Package className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                    <p>No products available</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {filtered.map(p => {
                                        const inCart    = cart.find(i => i.product_id === p.id)
                                        const cartQty   = inCart?.quantity ?? 0
                                        return (
                                            <div key={p.id} className="bg-white/80 backdrop-blur-md rounded-md border border-gray-200 shadow-sm overflow-hidden hover:border-emerald-300 transition group">
                                                <div className="h-40 bg-gray-50 flex items-center justify-center overflow-hidden">
                                                    {p.image ? (
                                                        <img
                                                            src={`http://localhost:8000/storage/${p.image}`}
                                                            alt={p.name}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                                        />
                                                    ) : (
                                                        <Package className="w-12 h-12 text-gray-300" />
                                                    )}
                                                </div>

                                                <div className="p-4">
                                                    {p.category && (
                                                        <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full mb-2 inline-block">
                                                            {p.category.name}
                                                        </span>
                                                    )}
                                                    <h3 className="font-semibold text-gray-800 text-sm mb-1">{p.name}</h3>
                                                    <p className="text-emerald-700 font-bold mb-1">${Number(p.price).toFixed(2)}</p>
                                                    <p className="text-xs text-gray-400 mb-3">{p.stock} in stock</p>

                                                    {cartQty === 0 ? (
                                                        <button
                                                            onClick={() => addToCart(p)}
                                                            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium py-2 rounded-md flex items-center justify-center gap-1 transition"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                            Add to Cart
                                                        </button>
                                                    ) : (
                                                        <div className="flex items-center justify-between bg-emerald-50 rounded-md px-2 py-1">
                                                            <button onClick={() => updateQty(p.id, cartQty - 1)} className="w-6 h-6 flex items-center justify-center text-emerald-700 hover:bg-emerald-100 rounded">
                                                                <Minus className="w-3 h-3" />
                                                            </button>
                                                            <span className="text-sm font-bold text-emerald-700">{cartQty}</span>
                                                            <button onClick={() => updateQty(p.id, cartQty + 1)} className="w-6 h-6 flex items-center justify-center text-emerald-700 hover:bg-emerald-100 rounded">
                                                                <Plus className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ===== CART VIEW ===== */}
                    {view === 'cart' && (
                        <div className="max-w-2xl mx-auto">
                            <h2 className="text-xl font-bold text-black drop-shadow-md mb-6">Your Cart</h2>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-md mb-4">{error}</div>
                            )}

                            {cart.length === 0 ? (
                                <div className="text-center py-16 text-gray-500">
                                    <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                    <p>Your cart is empty</p>
                                    <button onClick={() => setView('shop')} className="mt-4 text-emerald-600 text-sm hover:underline">
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-white/80 backdrop-blur-md rounded-md border border-gray-200 shadow-lg overflow-hidden mb-4">
                                        {cart.map((item, i) => (
                                            <div key={item.product_id} className={`flex items-center gap-4 p-4 ${i < cart.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                                <div className="w-14 h-14 bg-gray-50 rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
                                                    {item.image ? (
                                                        <img src={`http://localhost:8000/storage/${item.image}`} alt={item.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Package className="w-6 h-6 text-gray-300" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                                                    <p className="text-emerald-700 text-sm font-bold">${Number(item.price).toFixed(2)}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => updateQty(item.product_id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50">
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                    <button onClick={() => updateQty(item.product_id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50">
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <p className="text-gray-800 font-semibold text-sm w-16 text-right">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </p>
                                                <button onClick={() => removeFromCart(item.product_id)} className="text-red-400 hover:text-red-600 ml-2">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Summary */}
                                    <div className="bg-white/80 backdrop-blur-md rounded-md border border-gray-200 shadow-lg p-6">
                                        <h3 className="font-semibold text-black text-lg mb-4">Order Summary</h3>

                                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                                            <span>Subtotal ({cartCount} items)</span>
                                            <span>${cartTotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600 mb-3">
                                            <span>Delivery</span>
                                            <span className="text-green-600">Free</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-gray-800 text-lg border-t border-gray-200 pt-3 mb-4">
                                            <span>Total</span>
                                            <span className="text-emerald-700">${cartTotal.toFixed(2)}</span>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                                            <select
                                                value={paymentMethod}
                                                onChange={e => setPaymentMethod(e.target.value)}
                                                className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                            >
                                                <option value="cash">Cash on Delivery</option>
                                                <option value="bank_transfer">Bank Transfer</option>
                                                <option value="card">Card Payment</option>
                                            </select>
                                        </div>

                                        <button
                                            onClick={placeOrder}
                                            disabled={placing}
                                            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 rounded-md transition disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                            {placing ? 'Placing Order...' : `Place Order — $${cartTotal.toFixed(2)}`}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* ===== MY ORDERS VIEW ===== */}
                    {view === 'orders' && (
                        <div>
                            <h2 className="text-xl font-bold text-black drop-shadow-md mb-6">My Orders</h2>

                            {orders.length === 0 ? (
                                <div className="text-center py-16 text-gray-500">
                                    <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                    <p>No orders yet</p>
                                    <button onClick={() => setView('shop')} className="mt-4 text-emerald-600 text-sm hover:underline">
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map(o => {
                                        const status = statusConfig(o.status)
                                        const StatusIcon = status.icon
                                        return (
                                            <div key={o.id} className="bg-white/80 backdrop-blur-md rounded-md border border-gray-200 shadow-lg p-5">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div>
                                                        <p className="font-bold text-black">{o.order_number}</p>
                                                        <p className="text-xs text-gray-500 mt-0.5">
                                                            {new Date(o.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1 ${status.color}`}>
                                                            <StatusIcon className="w-3 h-3" />
                                                            {o.status === 'completed' ? 'Delivered' : o.status === 'pending' ? 'Pending' : o.status === 'processing' ? 'Processing' : o.status}
                                                        </span>
                                                        <span className="font-bold text-emerald-700">${Number(o.total).toFixed(2)}</span>
                                                    </div>
                                                </div>

                                                {/* Order Items */}
                                                <div className="space-y-2">
                                                    {o.items?.map(item => (
                                                        <div key={item.id} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-100 last:border-0">
                                                            <span className="text-gray-700">{item.product_name}</span>
                                                            <span className="text-gray-500">
                                                                {item.quantity} × ${Number(item.unit_price).toFixed(2)} = <span className="font-medium text-gray-800">${Number(item.total).toFixed(2)}</span>
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Delivery Status Timeline */}
                                                <div className="mt-4 pt-4 border-t border-gray-100">
                                                    <div className="flex items-center gap-0">
                                                        {[
                                                            { label: 'Order Placed', status: 'pending' },
                                                            { label: 'Processing', status: 'processing' },
                                                            { label: 'On the Way', status: 'processing' },
                                                            { label: 'Delivered', status: 'completed' },
                                                        ].map((step, i, arr) => {
                                                            const current = ['pending', 'processing', 'completed'].indexOf(o.status)
                                                            const done = o.status === 'completed' ? true : current >= i
                                                            return (
                                                                <div key={i} className="flex items-center flex-1">
                                                                    <div className="flex flex-col items-center">
                                                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${done ? 'bg-emerald-700 text-white' : 'bg-gray-200 text-gray-400'}`}>
                                                                            {done ? '✓' : i + 1}
                                                                        </div>
                                                                        <p className="text-xs text-gray-500 mt-1 text-center w-16">{step.label}</p>
                                                                    </div>
                                                                    {i < arr.length - 1 && (
                                                                        <div className={`h-0.5 flex-1 mb-5 ${done ? 'bg-emerald-700' : 'bg-gray-200'}`} />
                                                                    )}
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}