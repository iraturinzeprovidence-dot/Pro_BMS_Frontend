import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import {
    ShoppingCart, Package, Plus, Minus,
    Trash2, CheckCircle, LogOut, User,
    ClipboardList, Search, Home, Truck,
    CreditCard, Wallet, X, Clock, MapPin,
    Phone, Mail, Bell, Menu, ChevronDown
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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    // Fetch products and orders
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const [productsRes, ordersRes] = await Promise.all([
                    api.get('/customer/products'),
                    api.get('/customer/my-orders')
                ])
                setProducts(productsRes.data)
                setOrders(ordersRes.data)
            } catch (err) {
                console.error('Failed to fetch data:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const filtered = products.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
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
        if (cart.length === 0) {
            setError('Your cart is empty')
            return
        }
        setPlacing(true)
        setError('')
        try {
            const r = await api.post('/customer/order', {
                items:          cart.map(i => ({ product_id: i.product_id, quantity: i.quantity })),
                payment_method: paymentMethod,
            })
            setSuccess(`Order ${r.data.order_number} placed! Total: $${Number(r.data.total).toFixed(2)}`)
            setCart([])
            
            // Refresh orders
            const ordersRes = await api.get('/customer/my-orders')
            setOrders(ordersRes.data)
            setView('orders')
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
        pending:    { color: 'bg-yellow-100 text-yellow-700', icon: Clock, label: 'Pending' },
        processing: { color: 'bg-blue-100 text-blue-700', icon: Truck, label: 'Processing' },
        completed:  { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Delivered' },
        cancelled:  { color: 'bg-red-100 text-red-700', icon: X, label: 'Cancelled' },
    }[s] ?? { color: 'bg-gray-100 text-gray-600', icon: Package, label: s })

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
                {/* Professional Navbar */}
                <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-md">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo */}
                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('shop')}>
                                <Home className="w-7 h-7 text-emerald-700" />
                                <span className="text-xl font-bold text-emerald-700">Pro BMS Shop</span>
                            </div>

                            {/* Desktop Navigation */}
                            <div className="hidden md:flex items-center gap-1 bg-gray-100/50 rounded-lg p-1">
                                <button
                                    onClick={() => setView('shop')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                        view === 'shop' 
                                            ? 'bg-emerald-700 text-white shadow-sm' 
                                            : 'text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    <Package className="w-4 h-4" />
                                    Products
                                </button>
                                <button
                                    onClick={() => setView('cart')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 relative ${
                                        view === 'cart' 
                                            ? 'bg-emerald-700 text-white shadow-sm' 
                                            : 'text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    Cart
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center px-1 font-bold">
                                            {cartCount > 99 ? '99+' : cartCount}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        setView('orders')
                                        // Refresh orders when clicking My Orders
                                        api.get('/customer/my-orders').then(r => setOrders(r.data))
                                    }}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                        view === 'orders' 
                                            ? 'bg-emerald-700 text-white shadow-sm' 
                                            : 'text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    <ClipboardList className="w-4 h-4" />
                                    My Orders
                                </button>
                            </div>

                            {/* User Menu - Desktop */}
                            <div className="hidden md:flex items-center gap-4">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full">
                                    <User className="w-4 h-4 text-emerald-700" />
                                    <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>

                            {/* Mobile menu button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Mobile Navigation */}
                        {mobileMenuOpen && (
                            <div className="md:hidden py-3 border-t border-gray-200 space-y-2">
                                <button
                                    onClick={() => { setView('shop'); setMobileMenuOpen(false) }}
                                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium ${
                                        view === 'shop' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <Package className="w-4 h-4" />
                                    Products
                                </button>
                                <button
                                    onClick={() => { setView('cart'); setMobileMenuOpen(false) }}
                                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium ${
                                        view === 'cart' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    Cart
                                    {cartCount > 0 && (
                                        <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                            {cartCount}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => { 
                                        setView('orders'); 
                                        setMobileMenuOpen(false);
                                        api.get('/customer/my-orders').then(r => setOrders(r.data));
                                    }}
                                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium ${
                                        view === 'orders' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <ClipboardList className="w-4 h-4" />
                                    My Orders
                                </button>
                                <div className="border-t border-gray-200 pt-2 mt-2">
                                    <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600">
                                        <User className="w-4 h-4" />
                                        {user?.name}
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </nav>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                    {/* Success Banner */}
                    {success && (
                        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6 flex items-center gap-3 animate-fadeIn">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                            <p className="text-green-700 font-medium text-sm flex-1">{success}</p>
                            <button 
                                onClick={() => setSuccess('')} 
                                className="text-green-500 hover:text-green-700 transition"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Error Banner */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6 flex items-center gap-3">
                            <X className="w-5 h-5 text-red-600 flex-shrink-0" />
                            <p className="text-red-700 text-sm flex-1">{error}</p>
                            <button 
                                onClick={() => setError('')} 
                                className="text-red-500 hover:text-red-700 transition"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* ===== SHOP VIEW ===== */}
                    {view === 'shop' && (
                        <div>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                <h2 className="text-2xl font-bold text-black drop-shadow-md">Available Products</h2>
                                <div className="relative w-full sm:w-64">
                                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="w-full border border-gray-200 rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/80 backdrop-blur-sm"
                                    />
                                </div>
                            </div>

                            {loading ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {filtered.map(p => {
                                        const inCart    = cart.find(i => i.product_id === p.id)
                                        const cartQty   = inCart?.quantity ?? 0
                                        return (
                                            <div key={p.id} className="bg-white/80 backdrop-blur-md rounded-md border border-gray-200 shadow-sm overflow-hidden hover:border-emerald-300 hover:shadow-lg transition-all duration-200 group">
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

                                                <div className="p-3">
                                                    {p.category && (
                                                        <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full mb-2 inline-block">
                                                            {p.category.name}
                                                        </span>
                                                    )}
                                                    <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-1">{p.name}</h3>
                                                    <p className="text-emerald-700 font-bold text-base mb-1">${Number(p.price).toFixed(2)}</p>
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
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-2xl font-bold text-black drop-shadow-md mb-6">Your Cart</h2>

                            {cart.length === 0 ? (
                                <div className="text-center py-16 text-gray-500 bg-white/50 backdrop-blur-sm rounded-md">
                                    <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                    <p className="text-lg font-medium">Your cart is empty</p>
                                    <button onClick={() => setView('shop')} className="mt-4 text-emerald-600 text-sm hover:underline">
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-white/80 backdrop-blur-md rounded-md border border-gray-200 shadow-lg overflow-hidden mb-6">
                                        {cart.map((item, i) => (
                                            <div key={item.product_id} className={`flex flex-wrap sm:flex-nowrap items-center gap-4 p-4 ${i < cart.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                                <div className="w-14 h-14 bg-gray-50 rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
                                                    {item.image ? (
                                                        <img src={`http://localhost:8000/storage/${item.image}`} alt={item.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Package className="w-6 h-6 text-gray-300" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-800 text-sm truncate">{item.name}</p>
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
                                                <p className="text-gray-800 font-semibold text-sm w-20 text-right">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </p>
                                                <button onClick={() => removeFromCart(item.product_id)} className="text-red-400 hover:text-red-600">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Summary */}
                                    <div className="bg-white/80 backdrop-blur-md rounded-md border border-gray-200 shadow-lg p-6">
                                        <h3 className="font-semibold text-black text-lg mb-4">Order Summary</h3>

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm text-gray-600">
                                                <span>Subtotal ({cartCount} items)</span>
                                                <span>${cartTotal.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm text-gray-600">
                                                <span>Delivery</span>
                                                <span className="text-green-600">Free</span>
                                            </div>
                                            <div className="flex justify-between font-bold text-gray-800 text-lg border-t border-gray-200 pt-3 mt-2">
                                                <span>Total</span>
                                                <span className="text-emerald-700">${cartTotal.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                                            <select
                                                value={paymentMethod}
                                                onChange={e => setPaymentMethod(e.target.value)}
                                                className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                            >
                                                <option value="cash">💰 Cash on Delivery</option>
                                                <option value="bank_transfer">🏦 Bank Transfer</option>
                                                <option value="card">💳 Card Payment</option>
                                            </select>
                                        </div>

                                        <button
                                            onClick={placeOrder}
                                            disabled={placing}
                                            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 rounded-md transition disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
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
                            <h2 className="text-2xl font-bold text-black drop-shadow-md mb-6">My Orders</h2>

                            {orders.length === 0 ? (
                                <div className="text-center py-16 text-gray-500 bg-white/50 backdrop-blur-sm rounded-md">
                                    <ClipboardList className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                    <p className="text-lg font-medium">No orders yet</p>
                                    <button onClick={() => setView('shop')} className="mt-4 text-emerald-600 text-sm hover:underline">
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {orders.map(o => {
                                        const status = statusConfig(o.status)
                                        const StatusIcon = status.icon
                                        return (
                                            <div key={o.id} className="bg-white/80 backdrop-blur-md rounded-md border border-gray-200 shadow-lg overflow-hidden">
                                                <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-emerald-50/50 to-transparent">
                                                    <div className="flex flex-wrap justify-between items-center gap-3">
                                                        <div>
                                                            <p className="font-bold text-black text-lg">{o.order_number}</p>
                                                            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                {new Date(o.created_at).toLocaleDateString('en-US', { 
                                                                    year: 'numeric', 
                                                                    month: 'long', 
                                                                    day: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className={`text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1 ${status.color}`}>
                                                                <StatusIcon className="w-3 h-3" />
                                                                {status.label}
                                                            </span>
                                                            <span className="font-bold text-emerald-700 text-lg">${Number(o.total).toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Order Items */}
                                                <div className="p-5">
                                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Order Items</p>
                                                    <div className="space-y-2">
                                                        {o.items?.map(item => (
                                                            <div key={item.id} className="flex items-center justify-between text-sm py-2 border-b border-gray-100 last:border-0">
                                                                <div className="flex items-center gap-3">
                                                                    <Package className="w-4 h-4 text-gray-400" />
                                                                    <span className="text-gray-700">{item.product_name}</span>
                                                                </div>
                                                                <span className="text-gray-500">
                                                                    {item.quantity} × ${Number(item.unit_price).toFixed(2)} = 
                                                                    <span className="font-medium text-gray-800 ml-1">${Number(item.total).toFixed(2)}</span>
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Delivery Status Timeline */}
                                                <div className="p-5 pt-0">
                                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Delivery Status</p>
                                                        <div className="flex items-center">
                                                            {[
                                                                { label: 'Order Placed', status: 'pending', step: 1 },
                                                                { label: 'Processing', status: 'processing', step: 2 },
                                                                { label: 'On the Way', status: 'processing', step: 3 },
                                                                { label: 'Delivered', status: 'completed', step: 4 },
                                                            ].map((step, i, arr) => {
                                                                let isCompleted = false
                                                                if (o.status === 'completed') {
                                                                    isCompleted = true
                                                                } else if (o.status === 'processing') {
                                                                    isCompleted = step.step <= 2
                                                                } else if (o.status === 'pending') {
                                                                    isCompleted = step.step === 1
                                                                } else {
                                                                    isCompleted = false
                                                                }
                                                                
                                                                return (
                                                                    <div key={i} className="flex items-center flex-1">
                                                                        <div className="flex flex-col items-center">
                                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                                                                isCompleted ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-200 text-gray-500'
                                                                            }`}>
                                                                                {isCompleted ? <CheckCircle className="w-4 h-4" /> : step.step}
                                                                            </div>
                                                                            <p className={`text-xs mt-1 text-center font-medium ${isCompleted ? 'text-emerald-700' : 'text-gray-400'}`}>
                                                                                {step.label}
                                                                            </p>
                                                                        </div>
                                                                        {i < arr.length - 1 && (
                                                                            <div className={`h-0.5 flex-1 mx-2 mb-5 transition-all ${
                                                                                isCompleted ? 'bg-emerald-600' : 'bg-gray-200'
                                                                            }`} />
                                                                        )}
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
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