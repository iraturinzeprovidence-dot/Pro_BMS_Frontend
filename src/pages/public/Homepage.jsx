import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import {
    ShoppingCart, Package, Search, Menu, X,
    Star, ArrowRight, Shield, Truck, RefreshCw,
    ChevronRight, User, LogIn, Home, Building2,
    CheckCircle, Clock, Phone, Mail, MapPin,
    Facebook, Twitter, Linkedin, Instagram
} from 'lucide-react'

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
})

export default function Homepage() {
    const navigate                      = useNavigate()
    const [products, setProducts]       = useState([])
    const [categories, setCategories]   = useState([])
    const [cart, setCart]               = useState(() => {
        try { return JSON.parse(localStorage.getItem('guest_cart') || '[]') } catch { return [] }
    })
    const [search, setSearch]           = useState('')
    const [activeCategory, setActiveCategory] = useState('all')
    const [loading, setLoading]         = useState(true)
    const [mobileMenu, setMobileMenu]   = useState(false)
    const [showCartDrawer, setShowCartDrawer] = useState(false)
    const [addedId, setAddedId]         = useState(null)

    useEffect(() => {
        Promise.all([
            api.get('/public/homepage-products'),
            api.get('/public/homepage-categories'),
        ]).then(([p, c]) => {
            setProducts(p.data)
            setCategories(c.data)
        }).finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        localStorage.setItem('guest_cart', JSON.stringify(cart))
    }, [cart])

    const filtered = products.filter(p => {
        const matchSearch   = p.name.toLowerCase().includes(search.toLowerCase()) ||
                              p.category?.toLowerCase().includes(search.toLowerCase())
        const matchCategory = activeCategory === 'all' || p.category === activeCategory
        return matchSearch && matchCategory
    })

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === product.id)
            if (existing) {
                return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
            }
            return [...prev, { ...product, qty: 1 }]
        })
        setAddedId(product.id)
        setTimeout(() => setAddedId(null), 1500)
        setShowCartDrawer(true)
    }

    const updateQty = (id, qty) => {
        if (qty < 1) {
            setCart(prev => prev.filter(i => i.id !== id))
            return
        }
        setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i))
    }

    const cartTotal = cart.reduce((s, i) => s + Number(i.price) * i.qty, 0)
    const cartCount = cart.reduce((s, i) => s + i.qty, 0)

    const handleCheckout = () => {
        localStorage.setItem('guest_cart', JSON.stringify(cart))
        navigate('/register')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ===== NAVBAR ===== */}
            <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-3">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-9 h-9 bg-emerald-600 rounded-md flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-emerald-700">Pro_BMS</h1>
                                <p className="text-xs text-gray-500 leading-none">Shop</p>
                            </div>
                        </Link>

                        {/* Search — desktop */}
                        <div className="hidden md:flex flex-1 max-w-lg mx-8">
                            <div className="relative w-full">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full border border-gray-200 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/80"
                                />
                            </div>
                        </div>

                        {/* Nav Actions */}
                        <div className="flex items-center gap-3">
                            {/* Cart Button */}
                            <button
                                onClick={() => setShowCartDrawer(true)}
                                className="relative flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                <span className="hidden sm:inline">Cart</span>
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 min-w-[20px] h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1 font-bold">
                                        {cartCount > 99 ? '99+' : cartCount}
                                    </span>
                                )}
                            </button>

                            {/* Auth Buttons — desktop */}
                            <div className="hidden md:flex items-center gap-2">
                                <Link
                                    to="/login"
                                    className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-emerald-600 px-3 py-2 rounded-md hover:bg-gray-50 transition font-medium"
                                >
                                    <LogIn className="w-4 h-4" />
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="flex items-center gap-1.5 text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition font-medium"
                                >
                                    <User className="w-4 h-4" />
                                    Sign Up
                                </Link>
                            </div>

                            {/* Mobile menu button */}
                            <button
                                onClick={() => setMobileMenu(!mobileMenu)}
                                className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100"
                            >
                                {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Search */}
                    <div className="md:hidden mt-3">
                        <div className="relative">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full border border-gray-200 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/80"
                            />
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenu && (
                        <div className="md:hidden mt-3 pt-3 border-t border-gray-200 flex flex-col gap-2">
                            <Link to="/login" className="flex items-center gap-2 text-sm text-gray-600 py-2 font-medium hover:text-emerald-600">
                                <LogIn className="w-4 h-4" /> Login
                            </Link>
                            <Link to="/register" className="flex items-center gap-2 text-sm text-emerald-600 py-2 font-medium">
                                <User className="w-4 h-4" /> Create Account
                            </Link>
                        </div>
                    )}
                </div>
            </nav>

            {/* ===== HERO SECTION ===== */}
            <section className="relative bg-gradient-to-br from-emerald-700 to-emerald-900 text-white py-16 px-6 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                </div>
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
                        <ShoppingCart className="w-4 h-4" />
                        <span className="text-sm">Online Shopping Made Easy</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Shop Premium Products
                    </h2>
                    <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
                        Browse our catalog, add to cart and get fast delivery.
                        Create a free account to place your order.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
                            className="bg-white text-emerald-700 font-semibold px-8 py-3 rounded-md hover:bg-gray-100 transition flex items-center gap-2 justify-center"
                        >
                            Browse Products
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <Link
                            to="/register"
                            className="bg-emerald-600 bg-opacity-30 border border-emerald-400 text-white font-semibold px-8 py-3 rounded-md hover:bg-opacity-50 transition flex items-center gap-2 justify-center"
                        >
                            <User className="w-4 h-4" />
                            Create Free Account
                        </Link>
                    </div>
                </div>
            </section>

            {/* ===== FEATURES BAR ===== */}
            <section className="bg-white border-b border-gray-200 py-6">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            { icon: Truck, title: 'Fast Delivery', desc: 'Quick and reliable shipping' },
                            { icon: Shield, title: 'Secure Payment', desc: 'Multiple payment options' },
                            { icon: RefreshCw, title: 'Easy Returns', desc: 'Hassle-free return policy' },
                        ].map(f => {
                            const Icon = f.icon
                            return (
                                <div key={f.title} className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-emerald-50 rounded-md flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm">{f.title}</p>
                                        <p className="text-gray-500 text-xs">{f.desc}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ===== PRODUCTS SECTION ===== */}
            <section id="products" className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800">Our Products</h3>
                        <p className="text-gray-500 text-sm mt-1">{filtered.length} products available</p>
                    </div>
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 flex-wrap mb-8">
                    <button
                        onClick={() => setActiveCategory('all')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                            activeCategory === 'all'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white border border-gray-200 text-gray-600 hover:border-emerald-300'
                        }`}
                    >
                        All Products
                    </button>
                    {categories.map(c => (
                        <button
                            key={c.id}
                            onClick={() => setActiveCategory(c.name)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                                activeCategory === c.name
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-white border border-gray-200 text-gray-600 hover:border-emerald-300'
                            }`}
                        >
                            {c.name}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-md border border-gray-200 overflow-hidden animate-pulse">
                                <div className="h-48 bg-gray-200"></div>
                                <div className="p-4">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                                    <div className="h-9 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <Package className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-medium">No products found</p>
                        <p className="text-sm mt-1">Try a different search or category</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filtered.map(p => {
                            const inCart = cart.find(i => i.id === p.id)
                            const justAdded = addedId === p.id
                            return (
                                <div
                                    key={p.id}
                                    className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden hover:shadow-md hover:border-emerald-300 transition group"
                                >
                                    <div className="relative h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
                                        {p.image ? (
                                            <img
                                                src={p.image}
                                                alt={p.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                            />
                                        ) : (
                                            <Package className="w-16 h-16 text-gray-200" />
                                        )}
                                        {p.category && (
                                            <span className="absolute top-2 left-2 bg-white/90 text-emerald-700 text-xs font-medium px-2 py-1 rounded-md shadow-sm">
                                                {p.category}
                                            </span>
                                        )}
                                        {p.stock <= 5 && p.stock > 0 && (
                                            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-md">
                                                Only {p.stock} left
                                            </span>
                                        )}
                                        {p.stock === 0 && (
                                            <span className="absolute top-2 right-2 bg-gray-500 text-white text-xs font-medium px-2 py-1 rounded-md">
                                                Out of Stock
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-4">
                                        <h4 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">{p.name}</h4>
                                        {p.description && (
                                            <p className="text-xs text-gray-500 line-clamp-2 mb-2">{p.description}</p>
                                        )}

                                        <div className="flex items-center gap-1 mb-3">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            ))}
                                            <span className="text-xs text-gray-400 ml-1">(4.8)</span>
                                        </div>

                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-lg font-bold text-emerald-700">
                                                ${Number(p.price).toFixed(2)}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {p.stock} in stock
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => addToCart(p)}
                                            disabled={p.stock === 0}
                                            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition ${
                                                justAdded
                                                    ? 'bg-green-500 text-white'
                                                    : inCart
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                                    : p.stock === 0
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                            }`}
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            {justAdded ? '✓ Added!' : inCart ? `In Cart (${inCart.qty})` : p.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </section>

            {/* ===== CTA SECTION ===== */}
            <section className="bg-emerald-700 text-white py-16 px-6 mt-8">
                <div className="max-w-3xl mx-auto text-center">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to place your order?</h3>
                    <p className="text-emerald-100 mb-8">
                        Create a free account to complete your purchase and track your orders.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register"
                            className="bg-white text-emerald-700 font-semibold px-8 py-3 rounded-md hover:bg-gray-100 transition flex items-center gap-2 justify-center"
                        >
                            <User className="w-4 h-4" />
                            Create Free Account
                        </Link>
                        <Link
                            to="/login"
                            className="border border-emerald-400 text-white font-semibold px-8 py-3 rounded-md hover:bg-emerald-600 transition flex items-center gap-2 justify-center"
                        >
                            <LogIn className="w-4 h-4" />
                            Login to Shop
                        </Link>
                    </div>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="bg-gray-900 text-gray-400 py-10 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Building2 className="w-6 h-6 text-emerald-500" />
                                <span className="text-white font-bold text-lg">Pro_BMS</span>
                            </div>
                            <p className="text-sm">Complete Business Management System for modern enterprises.</p>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/login" className="hover:text-emerald-400 transition">Login</Link></li>
                                <li><Link to="/register" className="hover:text-emerald-400 transition">Register</Link></li>
                                <li><Link to="/careers" className="hover:text-emerald-400 transition">Careers</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Contact</h4>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> support@probms.com</li>
                                <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +1 (555) 123-4567</li>
                                <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> New York, NY 10001</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
                            <div className="flex gap-4">
                                <a href="#" className="hover:text-emerald-400 transition"><Facebook className="w-5 h-5" /></a>
                                <a href="#" className="hover:text-emerald-400 transition"><Twitter className="w-5 h-5" /></a>
                                <a href="#" className="hover:text-emerald-400 transition"><Linkedin className="w-5 h-5" /></a>
                                <a href="#" className="hover:text-emerald-400 transition"><Instagram className="w-5 h-5" /></a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 text-center text-xs">
                        <p>&copy; 2026 Pro_BMS. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* ===== CART DRAWER ===== */}
            {showCartDrawer && (
                <div className="fixed inset-0 z-50 flex">
                    <div className="flex-1 bg-black/40" onClick={() => setShowCartDrawer(false)} />
                    <div className="w-full max-w-md bg-white/95 backdrop-blur-md flex flex-col shadow-xl rounded-l-md">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                                <ShoppingCart className="w-5 h-5 text-emerald-600" />
                                Your Cart
                                {cartCount > 0 && (
                                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                        {cartCount}
                                    </span>
                                )}
                            </h3>
                            <button
                                onClick={() => setShowCartDrawer(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-500"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            {cart.length === 0 ? (
                                <div className="text-center py-16 text-gray-400">
                                    <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p className="font-medium">Your cart is empty</p>
                                    <p className="text-sm mt-1">Add some products to get started</p>
                                    <button
                                        onClick={() => setShowCartDrawer(false)}
                                        className="mt-4 text-emerald-600 text-sm hover:underline"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {cart.map(item => (
                                        <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-md">
                                            <div className="w-14 h-14 bg-white rounded-md flex items-center justify-center overflow-hidden border border-gray-100 flex-shrink-0">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Package className="w-6 h-6 text-gray-300" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-800 text-sm truncate">{item.name}</p>
                                                <p className="text-emerald-700 font-bold text-sm">${Number(item.price).toFixed(2)}</p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => updateQty(item.id, item.qty - 1)}
                                                    className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md text-gray-600 hover:bg-white text-lg font-bold"
                                                >
                                                    −
                                                </button>
                                                <span className="w-7 text-center text-sm font-medium">{item.qty}</span>
                                                <button
                                                    onClick={() => updateQty(item.id, item.qty + 1)}
                                                    className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md text-gray-600 hover:bg-white text-lg font-bold"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="px-6 py-5 border-t border-gray-200">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="text-xl font-bold text-gray-800">${cartTotal.toFixed(2)}</span>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-md transition flex items-center justify-center gap-2 mb-3"
                                >
                                    <User className="w-4 h-4" />
                                    Sign Up to Complete Order
                                    <ChevronRight className="w-4 h-4" />
                                </button>

                                <Link
                                    to="/login"
                                    onClick={() => setShowCartDrawer(false)}
                                    className="w-full border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium py-3 rounded-md flex items-center justify-center gap-2 text-sm transition"
                                >
                                    <LogIn className="w-4 h-4" />
                                    Already have an account? Login
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}