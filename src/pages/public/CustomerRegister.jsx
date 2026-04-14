import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  UserPlus,
  Mail,
  Phone,
  Building2,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  ArrowRight,
  User,
  Smartphone,
  Globe,
  MapPin
} from 'lucide-react'

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
})

export default function CustomerRegister() {
    const navigate        = useNavigate()
    const [error, setError]   = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [form, setForm] = useState({
        name: '', email: '', phone: '',
        address: '', city: '', country: '',
        password: '', password_confirmation: '',
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await api.post('/public/customer-register', form)
            setSuccess(true)
        } catch (err) {
            const errors = err.response?.data?.errors
            if (errors) {
                const first = Object.values(errors)[0]
                setError(Array.isArray(first) ? first[0] : first)
            } else {
                setError(err.response?.data?.message ?? 'Something went wrong')
            }
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div 
                className="relative min-h-screen w-full flex items-center justify-center"
                style={{
                    backgroundImage: `url('/src/assets/istockphoto-1477198926-612x612.jpg')`,
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed'
                }}
            >
                <div className="absolute inset-0 bg-emerald-900/30"></div>
                <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-md shadow-xl w-full max-w-md mx-4">
                    <div className="p-8">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-emerald-700" />
                        </div>
                        <h2 className="text-2xl font-bold text-black text-center mb-2">Account Created!</h2>
                        <p className="text-gray-600 text-center mb-6">Your customer account has been created successfully.</p>
                        <div className="flex justify-center">
                            <button
                                onClick={() => navigate('/login')}
                                className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-6 py-2.5 rounded-md transition flex items-center justify-center gap-2 w-auto min-w-[200px]"
                            >
                                Login to Your Account
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div 
            className="relative min-h-screen w-full flex items-center justify-center"
            style={{
                backgroundImage: `url('/src/assets/istockphoto-1477198926-612x612.jpg')`,
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed'
            }}
        >
            <div className="absolute inset-0 bg-emerald-900/30"></div>
            
            <div className="relative z-10 w-full max-w-md mx-auto px-4">
                <div className="bg-white/95 backdrop-blur-md rounded-md shadow-xl">
                    <div className="p-8">
                        {/* Icon on top center */}
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                                <UserPlus className="w-8 h-8 text-emerald-700" />
                            </div>
                        </div>
                        
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-black mb-1">Create Customer Account</h2>
                            <p className="text-gray-600 text-sm">Register to access our services</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-md flex items-center gap-2 mb-5">
                                <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    <User className="w-3.5 h-3.5 inline mr-1" />
                                    Full Name
                                </label>
                                <input
                                    type="text" required value={form.name}
                                    onChange={e => setForm({...form, name: e.target.value})}
                                    placeholder="Names"
                                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    <Mail className="w-3.5 h-3.5 inline mr-1" />
                                    Email
                                </label>
                                <input
                                    type="email" required value={form.email}
                                    onChange={e => setForm({...form, email: e.target.value})}
                                    placeholder="me@example.com"
                                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        <Smartphone className="w-3.5 h-3.5 inline mr-1" />
                                        Phone
                                    </label>
                                    <input
                                        type="text" value={form.phone}
                                        onChange={e => setForm({...form, phone: e.target.value})}
                                        placeholder="+250 70000000"
                                        className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        <Building2 className="w-3.5 h-3.5 inline mr-1" />
                                        City
                                    </label>
                                    <input
                                        type="text" value={form.city}
                                        onChange={e => setForm({...form, city: e.target.value})}
                                        placeholder="City"
                                        className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    <Globe className="w-3.5 h-3.5 inline mr-1" />
                                    Country
                                </label>
                                <input
                                    type="text" value={form.country}
                                    onChange={e => setForm({...form, country: e.target.value})}
                                    placeholder="Country"
                                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    <MapPin className="w-3.5 h-3.5 inline mr-1" />
                                    Address
                                </label>
                                <input
                                    type="text" value={form.address}
                                    onChange={e => setForm({...form, address: e.target.value})}
                                    placeholder="123 Main Street"
                                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    <Lock className="w-3.5 h-3.5 inline mr-1" />
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"} required value={form.password}
                                        onChange={e => setForm({...form, password: e.target.value})}
                                        placeholder="Minimum 8 characters"
                                        className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50 pr-9"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    <Lock className="w-3.5 h-3.5 inline mr-1" />
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"} required value={form.password_confirmation}
                                        onChange={e => setForm({...form, password_confirmation: e.target.value})}
                                        className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50 pr-9"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex justify-center pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-6 py-2 rounded-md text-sm transition disabled:opacity-50 flex items-center justify-center gap-2 w-auto min-w-[160px]"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="w-4 h-4" />
                                            Create Account
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="text-center pt-4 mt-2 border-t border-gray-200">
                                <p className="text-sm text-gray-600">
                                    Already have an account?{' '}
                                    <a href="/login" className="text-emerald-700 hover:text-emerald-800 font-medium transition">
                                        Login here
                                    </a>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}