import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { KeyRound, Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
})

export default function ForgotPassword() {
    const [email, setEmail]     = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError]     = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')
        try {
            const r = await api.post('/public/forgot-password', { email })
            setSuccess(r.data.message)
        } catch (err) {
            setError(err.response?.data?.message ?? 'Something went wrong')
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
            <div className="absolute inset-0 bg-emerald-900/30"></div>
            
            <div className="relative z-10 w-full max-w-md mx-auto px-4">
                <div className="bg-white/95 backdrop-blur-md rounded-md shadow-xl">
                    <div className="p-8">
                        {/* Key Icon on Top Center */}
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                                <KeyRound className="w-8 h-8 text-emerald-700" />
                            </div>
                        </div>

                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-black">Forgot Password?</h1>
                            <p className="text-gray-600 text-sm mt-2">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>
                        </div>

                        {/* Success Message */}
                        {success && (
                            <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-md mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <p className="font-medium">Email sent!</p>
                                </div>
                                <p className="text-xs text-green-600">{success}</p>
                                <p className="text-xs text-green-600 mt-2">
                                    Check your inbox and click the reset link. It expires in 60 minutes.
                                </p>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-md flex items-center gap-2 mb-6">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        {!success && (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        <Mail className="w-3.5 h-3.5 inline mr-1" />
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                    />
                                </div>
                                
                                <div className="flex justify-center pt-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-8 py-2.5 rounded-md text-sm transition disabled:opacity-50 w-auto min-w-[180px] flex items-center justify-center gap-2"
                                    >
                                        <KeyRound className="w-4 h-4" />
                                        {loading ? 'Sending...' : 'Send Reset Link'}
                                    </button>
                                </div>
                            </form>
                        )}

                        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}