import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
    const { login }               = useAuth()
    const navigate                = useNavigate()
    const [email, setEmail]       = useState('')
    const [password, setPassword] = useState('')
    const [error, setError]       = useState('')
    const [loading, setLoading]   = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const user = await login(email, password)
            if (user.role === 'admin') {
                navigate('/admin/dashboard')
            } else if (user.role === 'manager') {
                navigate('/manager/dashboard')
            } else {
                navigate('/employee/dashboard')
            }
        } catch (err) {
            setError('Invalid email or password. Please try again.')
        } finally {
            setLoading(false)
        }
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
            {/* Dark green overlay */}
            <div className="absolute inset-0 bg-emerald-900/30"></div>
            
            {/* Login Box */}
            <div className="relative z-10 w-full max-w-md mx-auto px-4">
                <div className="bg-white/95 backdrop-blur-md rounded-md shadow-xl">
                    <div className="p-8">
                        {/* Icon on top center */}
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                        </div>
                        
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-black">Pro_BMS</h1>
                            <p className="text-gray-600 text-sm mt-1">Business Management System</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-md flex items-center gap-2 mb-6">
                                <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="admin@probms.com"
                                    className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                />
                            </div>

                            <div className="flex justify-center pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-8 py-2.5 rounded-md text-sm transition disabled:opacity-50 w-auto min-w-[160px]"
                                >
                                    {loading ? 'Signing in...' : 'Sign In'}
                                </button>
                            </div>
                        </form>

                        <div className="border-t border-gray-200 mt-6 pt-5 text-center space-y-2">
                            <p className="text-xs text-gray-600">
                                New customer?{' '}
                                <a href="/register" className="text-emerald-700 hover:text-emerald-800 font-medium transition">
                                    Create an account
                                </a>
                            </p>
                            <p className="text-xs text-gray-600">
                                Looking for a job?{' '}
                                <a href="/careers" className="text-emerald-700 hover:text-emerald-800 font-medium transition">
                                    View open positions
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}