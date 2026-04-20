import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import {
    ShoppingCart, Package, Search, Menu, X,
    Star, ArrowRight, Shield, Truck, RefreshCw,
    ChevronRight, User, LogIn, Building2, Mail,
    Phone, MapPin, Clock, Heart, Check,
    ChevronDown, Filter, Tag, Zap, Briefcase
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
    const currentYear = new Date().getFullYear()

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
{/* ===== NAVBAR - PROFESSIONAL HEADER WITH LOGO ===== */}
<nav className="bg-white shadow-md sticky top-0 z-40">
    <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-6">
            {/* Logo Section - LARGER LOGO, NO BACKGROUND */}
            <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
                {/* Logo Image - Larger, no background */}
                <div className="flex items-center justify-center transition-all duration-300 group-hover:scale-105">
<img 
    src="/src/assets/logo.png" 
    alt="Pro_BMS Logo" 
    className="w-20 h-20 object-contain"
    onError={(e) => {
        e.target.style.display = 'none'
        e.target.nextSibling.style.display = 'flex'
    }}
/>
                    <Building2 className="w-8 h-8 text-emerald-600 hidden" />
                </div>
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-gray-800 tracking-tight">Pro_BMS</h1>
                    <p className="text-xs text-gray-500 leading-tight">Business Solutions</p>
                </div>
            </Link>

            {/* Search Form */}
            <div className="hidden md:flex flex-1 max-w-xl">
                <form onSubmit={(e) => e.preventDefault()} className="relative w-full">
                    <input
                        type="text"
                        placeholder="Search products by name or category..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                    />
                    <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                </form>
            </div>

            {/* Nav Actions */}
            <div className="flex items-center gap-3">
                {/* Cart Button */}
                <button
                    onClick={() => setShowCartDrawer(true)}
                    className="relative flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                >
                    <ShoppingCart className="w-4 h-4" />
                    <span className="hidden sm:inline">Cart</span>
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 min-w-[20px] h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1 font-bold">
                            {cartCount > 99 ? '99+' : cartCount}
                        </span>
                    )}
                </button>

                {/* Auth Buttons */}
                <div className="hidden md:flex items-center gap-2">
                    <Link
                        to="/login"
                        className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-emerald-600 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium border border-transparent hover:border-gray-200"
                    >
                        <LogIn className="w-4 h-4" />
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="flex items-center gap-1.5 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-5 py-2.5 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                    >
                        <User className="w-4 h-4" />
                        Sign Up
                    </Link>
                </div>

                {/* Mobile menu button */}
                <button
                    onClick={() => setMobileMenu(!mobileMenu)}
                    className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-all"
                >
                    {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
            <form onSubmit={(e) => e.preventDefault()} className="relative">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </form>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-200 flex flex-col gap-2">
                <Link to="/login" className="flex items-center gap-2 text-sm text-gray-600 py-2.5 px-3 rounded-lg hover:bg-gray-50 font-medium">
                    <LogIn className="w-4 h-4" /> Login
                </Link>
                <Link to="/register" className="flex items-center gap-2 text-sm bg-emerald-600 text-white py-2.5 px-3 rounded-lg font-medium justify-center">
                    <User className="w-4 h-4" /> Create Account
                </Link>
            </div>
        )}
    </div>
</nav>

            {/* ===== FEATURES BAR ===== */}
            <section className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Truck, title: 'Fast Delivery', desc: 'Quick and reliable shipping worldwide' },
                            { icon: Shield, title: 'Secure Payment', desc: 'Multiple payment options with encryption' },
                            { icon: RefreshCw, title: 'Easy Returns', desc: '30-day hassle-free return policy' },
                        ].map(f => {
                            const Icon = f.icon
                            return (
                                <div key={f.title} className="flex flex-col items-center text-center group">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-4 group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                                        <Icon className="w-7 h-7 text-emerald-600" />
                                    </div>
                                    <h3 className="font-bold text-gray-800 text-lg mb-2">{f.title}</h3>
                                    <p className="text-gray-600 text-sm">{f.desc}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ===== PRODUCTS SECTION ===== */}
            <section id="products" className="max-w-7xl mx-auto px-6 py-16">
                {/* Category Filter */}
                <div className="flex gap-3 flex-wrap justify-center mb-12">
                    <button
                        onClick={() => setActiveCategory('all')}
                        className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                            activeCategory === 'all'
                                ? 'bg-emerald-600 text-white shadow-md'
                                : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-emerald-400 hover:shadow-sm'
                        }`}
                    >
                        All Products
                    </button>
                    {categories.map(c => (
                        <button
                            key={c.id}
                            onClick={() => setActiveCategory(c.name)}
                            className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                activeCategory === c.name
                                    ? 'bg-emerald-600 text-white shadow-md'
                                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-emerald-400 hover:shadow-sm'
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
                            <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
                                <div className="h-48 bg-gray-200"></div>
                                <div className="p-4">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                                    <div className="h-10 bg-gray-200 rounded"></div>
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
                                    className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-xl hover:border-emerald-300 transition-all duration-300 group"
                                >
                                    <div className="relative h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
                                        {p.image ? (
                                            <img
                                                src={p.image}
                                                alt={p.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                            />
                                        ) : (
                                            <Package className="w-16 h-16 text-gray-300" />
                                        )}
                                        {p.category && (
                                            <span className="absolute top-3 left-3 bg-white/95 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-lg shadow-sm">
                                                {p.category}
                                            </span>
                                        )}
                                        {p.stock <= 5 && p.stock > 0 && (
                                            <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-lg shadow-sm">
                                                Only {p.stock} left
                                            </span>
                                        )}
                                        {p.stock === 0 && (
                                            <span className="absolute top-3 right-3 bg-gray-600 text-white text-xs font-semibold px-2.5 py-1 rounded-lg shadow-sm">
                                                Out of Stock
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-4">
                                        <h4 className="font-bold text-gray-800 text-base mb-2 line-clamp-2 min-h-[48px]">{p.name}</h4>
                                        {p.description && (
                                            <p className="text-xs text-gray-500 line-clamp-2 mb-3 min-h-[32px]">{p.description}</p>
                                        )}

                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-xl font-bold text-emerald-700">
                                                {Number(p.price).toLocaleString()} Frw
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => addToCart(p)}
                                            disabled={p.stock === 0}
                                            className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                                justAdded
                                                    ? 'bg-green-500 text-white shadow-md'
                                                    : inCart
                                                    ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-200 hover:bg-emerald-100'
                                                    : p.stock === 0
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow-md'
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
            <section className="bg-gradient-to-br from-emerald-700 to-emerald-900 text-white py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h3 className="text-3xl md:text-4xl font-bold mb-4">Ready to place your order?</h3>
                    <p className="text-emerald-100 text-lg mb-10 max-w-2xl mx-auto">
                        Create a free account to complete your purchase, track orders, and enjoy exclusive benefits.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-5 justify-center">
                        <Link
                            to="/register"
                            className="bg-white text-emerald-700 font-bold px-8 py-3.5 rounded-lg hover:bg-gray-100 transition-all duration-200 flex items-center gap-2 justify-center shadow-lg hover:shadow-xl text-base"
                        >
                            <User className="w-5 h-5" />
                            Create Free Account
                        </Link>
                        <Link
                            to="/login"
                            className="bg-emerald-600 bg-opacity-20 backdrop-blur-sm border-2 border-emerald-400 text-white font-bold px-8 py-3.5 rounded-lg hover:bg-opacity-30 transition-all duration-200 flex items-center gap-2 justify-center text-base"
                        >
                            <LogIn className="w-5 h-5" />
                            Login to Your Account
                        </Link>
                    </div>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="bg-gray-900 text-gray-400 py-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        <div className="text-center md:text-left">
                            <h4 className="text-white font-semibold mb-4 text-lg">Quick Links</h4>
                            <ul className="space-y-3 text-sm">
                                <li><Link to="/login" className="hover:text-emerald-400 transition flex items-center gap-2 justify-center md:justify-start"><LogIn className="w-3.5 h-3.5" /> Login</Link></li>
                                <li><Link to="/register" className="hover:text-emerald-400 transition flex items-center gap-2 justify-center md:justify-start"><User className="w-3.5 h-3.5" /> Register</Link></li>
                                <li><Link to="/careers" className="hover:text-emerald-400 transition flex items-center gap-2 justify-center md:justify-start"><Briefcase className="w-3.5 h-3.5" /> Careers</Link></li>
                            </ul>
                        </div>

                        <div className="text-center md:text-left">
                            <h4 className="text-white font-semibold mb-4 text-lg">Contact Us</h4>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-center gap-2 justify-center md:justify-start"><Mail className="w-3.5 h-3.5" /><a href="mailto:support@probms.com" className="hover:text-emerald-400 transition">support@probms.com</a></li>
                                <li className="flex items-center gap-2 justify-center md:justify-start"><Phone className="w-3.5 h-3.5" /><span>+1 (555) 123-4567</span></li>
                                <li className="flex items-center gap-2 justify-center md:justify-start"><MapPin className="w-3.5 h-3.5" /><span>New York, NY 10001</span></li>
                            </ul>
                        </div>

                        <div className="text-center md:text-left">
                            <h4 className="text-white font-semibold mb-4 text-lg">Support</h4>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-center gap-2 justify-center md:justify-start"><Clock className="w-3.5 h-3.5" /><span>24/7 Customer Support</span></li>
                                <li className="flex items-center gap-2 justify-center md:justify-start"><Shield className="w-3.5 h-3.5" /><span>Secure Transactions</span></li>
                                <li className="flex items-center gap-2 justify-center md:justify-start"><Truck className="w-3.5 h-3.5" /><span>Fast Delivery</span></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8 text-center text-sm">
                        <p>&copy; {currentYear} Pro_BMS. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* ===== CART DRAWER ===== */}
            {showCartDrawer && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="fixed inset-0 bg-black/40" onClick={() => setShowCartDrawer(false)} />
                    <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-white">
                            <h3 className="font-bold text-gray-800 text-xl flex items-center gap-2">
                                <ShoppingCart className="w-6 h-6 text-emerald-600" />
                                Your Cart
                                {cartCount > 0 && <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">{cartCount}</span>}
                            </h3>
                            <button onClick={() => setShowCartDrawer(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-all"><X className="w-5 h-5" /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-5">
                            {cart.length === 0 ? (
                                <div className="text-center py-20 text-gray-400">
                                    <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                    <p className="font-medium text-gray-600">Your cart is empty</p>
                                    <button onClick={() => setShowCartDrawer(false)} className="mt-6 text-emerald-600 text-sm font-semibold hover:underline">Continue Shopping →</button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {cart.map(item => (
                                        <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:shadow-md transition-all">
                                            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 flex-shrink-0">
                                                {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <Package className="w-7 h-7 text-gray-300" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-800 text-sm truncate">{item.name}</p>
                                                <p className="text-emerald-700 font-bold text-sm mt-1">{Number(item.price).toLocaleString()} Frw</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-8 h-8 flex items-center justify-center border-2 border-gray-200 rounded-lg text-gray-600 hover:bg-white hover:border-emerald-300 text-lg font-bold transition-all">−</button>
                                                <span className="w-8 text-center text-sm font-semibold text-gray-700">{item.qty}</span>
                                                <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-8 h-8 flex items-center justify-center border-2 border-gray-200 rounded-lg text-gray-600 hover:bg-white hover:border-emerald-300 text-lg font-bold transition-all">+</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="px-6 py-5 border-t border-gray-200 bg-gray-50">
                                <div className="flex justify-between items-center mb-5">
                                    <span className="text-gray-600 font-medium">Subtotal</span>
                                    <span className="text-2xl font-bold text-gray-800">{cartTotal.toLocaleString()} Frw</span>
                                </div>
                                <button onClick={handleCheckout} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mb-3 shadow-md hover:shadow-lg text-base">
                                    <User className="w-5 h-5" /> Sign Up to Complete Order <ChevronRight className="w-5 h-5" />
                                </button>
                                <Link to="/login" onClick={() => setShowCartDrawer(false)} className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm transition-all duration-200">
                                    <LogIn className="w-4 h-4" /> Already have an account? Login
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes slide-in-right {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in-right {
                    animation: slide-in-right 0.3s ease-out;
                }
            `}</style>
        </div>
    )
}