import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Mail, ArrowLeft, KeyRound, CheckCircle, AlertCircle } from 'lucide-react'

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
})

export default function ForgotPassword() {
    const [email, setEmail]       = useState('')
    const [loading, setLoading]   = useState(false)
    const [result, setResult]     = useState(null)
    const [error, setError]       = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setResult(null)
        try {
            const r = await api.post('/public/forgot-password', { email })
            setResult(r.data)
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
            {/* Dark green overlay */}
            <div className="absolute inset-0 bg-emerald-900/30"></div>
            
            {/* Forgot Password Box */}
            <div className="relative z-10 w-full max-w-md mx-auto px-4">
                <div className="bg-white/95 backdrop-blur-md rounded-md shadow-xl">
                    <div className="p-8">
                        
                        {/* Logo */}
                        <div className="flex justify-center mb-6">
                            <img 
                                src="/src/assets/logo.png" 
                                alt="Pro_BMS Logo"
                                className="w-[200px] h-auto object-contain"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/200x80?text=Pro_BMS'
                                }}
                            />
                        </div>

                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <KeyRound className="w-8 h-8 text-emerald-700" />
                            </div>
                            <h1 className="text-2xl font-bold text-black">Forgot Password?</h1>
                            <p className="text-gray-600 text-sm mt-2">
                                Enter your email and we'll send you a reset link.
                            </p>
                        </div>

                        {/* Success Message */}
                        {result && (
                            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <p className="text-green-700 font-medium text-sm">{result.message}</p>
                                </div>

                                {/* Dev mode: show direct link if email fails */}
                                {result.reset_url && (
                                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                        <p className="text-yellow-700 text-xs font-medium mb-2 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            Dev Mode: If email didn't arrive, use this link directly:
                                        </p>
                                        <a 
                                            href={result.reset_url}
                                            className="text-xs text-emerald-600 hover:underline break-all"
                                        >
                                            {result.reset_url}
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-md flex items-center gap-2 mb-6">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        {!result && (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Email Row - Label and Input on same row */}
                                <div className="flex items-center gap-4">
                                    <label className="text-sm font-medium text-gray-700 w-24 flex-shrink-0">
                                        <Mail className="w-3.5 h-3.5 inline mr-1" />
                                        Email
                                    </label>
                                    <div className="flex-1">
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="me@example.com"
                                            className="w-full border-0 border-b-2 border-gray-200 rounded-none px-0 py-2 text-sm focus:outline-none focus:border-emerald-500 bg-transparent transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-center pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-8 py-2.5 rounded-md text-sm transition disabled:opacity-50 w-40 flex items-center justify-center gap-2"
                                    >
                                        <KeyRound className="w-4 h-4" />
                                        {loading ? 'Sending...' : 'Send Link'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Back to Login Link */}
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