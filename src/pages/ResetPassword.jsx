import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import axios from 'axios'
import { KeyRound, Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle, Lock, Building2 } from 'lucide-react'

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
})

export default function ResetPassword() {
    const navigate                        = useNavigate()
    const [searchParams]                  = useSearchParams()
    const token                           = searchParams.get('token') ?? ''
    const email                           = searchParams.get('email') ?? ''
    const [password, setPassword]         = useState('')
    const [confirmation, setConfirmation] = useState('')
    const [showPass, setShowPass]         = useState(false)
    const [showConfirmPass, setShowConfirmPass] = useState(false)
    const [loading, setLoading]           = useState(false)
    const [success, setSuccess]           = useState(false)
    const [error, setError]               = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (password !== confirmation) {
            setError('Passwords do not match.')
            return
        }
        setLoading(true)
        setError('')
        try {
            await api.post('/public/reset-password', {
                email,
                token,
                password,
                password_confirmation: confirmation,
            })
            setSuccess(true)
            setTimeout(() => navigate('/login'), 3000)
        } catch (err) {
            const errors = err.response?.data?.errors
            if (errors) {
                setError(Object.values(errors).flat().join(' '))
            } else {
                setError(err.response?.data?.message ?? 'Something went wrong')
            }
        } finally {
            setLoading(false)
        }
    }

    const getPasswordStrength = () => {
        if (!password) return { level: 0, text: '', color: '' }
        if (password.length < 8) return { level: 1, text: 'Weak', color: 'bg-red-500' }
        if (password.length < 12) return { level: 2, text: 'Good', color: 'bg-yellow-500' }
        return { level: 3, text: 'Strong', color: 'bg-green-500' }
    }

    const strength = getPasswordStrength()

    if (!token || !email) {
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
                    <div className="bg-white/95 backdrop-blur-md rounded-md shadow-xl p-8 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <p className="text-gray-700 font-medium">Invalid reset link.</p>
                        <Link to="/forgot-password" className="inline-flex items-center gap-1 text-emerald-600 text-sm mt-4 hover:text-emerald-700 transition">
                            Request a new reset link
                            <ArrowLeft className="w-3 h-3" />
                        </Link>
                    </div>
                </div>
            </div>
        )
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
                <div className="relative z-10 w-full max-w-md mx-auto px-4">
                    <div className="bg-white/95 backdrop-blur-md rounded-md shadow-xl p-8 text-center">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-emerald-700" />
                        </div>
                        <h2 className="text-xl font-bold text-black mb-2">Password Reset!</h2>
                        <p className="text-gray-600 text-sm mb-4">Your password has been reset successfully.</p>
                        <p className="text-xs text-gray-400 mb-4">Redirecting to login in 3 seconds...</p>
                        <Link to="/login" className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2.5 rounded-md text-sm font-medium transition">
                            Go to Login
                        </Link>
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
            {/* Dark green overlay */}
            <div className="absolute inset-0 bg-emerald-900/30"></div>
            
            {/* Reset Password Box */}
            <div className="relative z-10 w-full max-w-md mx-auto px-4">
                <div className="bg-white/95 backdrop-blur-md rounded-md shadow-xl">
                    <div className="p-8">
                        {/* Icon on top center */}
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                                <Building2 className="w-8 h-8 text-emerald-700" />
                            </div>
                        </div>

                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 rounded-full mb-4">
                                <KeyRound className="w-7 h-7 text-emerald-700" />
                            </div>
                            <h1 className="text-2xl font-bold text-black">Reset Password</h1>
                            <p className="text-gray-600 text-sm mt-2">Enter your new password below</p>
                            <p className="text-xs text-emerald-600 mt-1 font-medium">Resetting for: {email}</p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-md flex items-center gap-2 mb-6">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* New Password Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    <Lock className="w-3.5 h-3.5 inline mr-1" />
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPass ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="Minimum 8 characters"
                                        className="w-full border border-gray-200 rounded-md px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPass(!showPass)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>

                                {/* Password strength indicator */}
                                {password && (
                                    <div className="mt-2">
                                        <div className="flex gap-1">
                                            {[...Array(3)].map((_, i) => (
                                                <div 
                                                    key={i} 
                                                    className={`h-1 flex-1 rounded-full transition-all duration-200 ${
                                                        i < strength.level ? strength.color : 'bg-gray-200'
                                                    }`} 
                                                />
                                            ))}
                                        </div>
                                        <p className={`text-xs mt-1 ${
                                            strength.level === 1 ? 'text-red-500' : 
                                            strength.level === 2 ? 'text-yellow-500' : 
                                            strength.level === 3 ? 'text-green-500' : 'text-gray-400'
                                        }`}>
                                            {strength.text}
                                            {strength.level === 1 && ' — Use at least 8 characters'}
                                            {strength.level === 2 && ' — Good, but can be stronger'}
                                            {strength.level === 3 && ' — Strong password!'}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    <Lock className="w-3.5 h-3.5 inline mr-1" />
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPass ? 'text' : 'password'}
                                        required
                                        value={confirmation}
                                        onChange={e => setConfirmation(e.target.value)}
                                        placeholder="Repeat your password"
                                        className={`w-full border rounded-md px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50 ${
                                            confirmation && confirmation !== password
                                                ? 'border-red-300'
                                                : 'border-gray-200'
                                        }`}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {confirmation && confirmation !== password && (
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        Passwords do not match
                                    </p>
                                )}
                                {confirmation && confirmation === password && password && (
                                    <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" />
                                        Passwords match
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-center pt-2">
                                <button
                                    type="submit"
                                    disabled={loading || (confirmation && confirmation !== password) || password.length < 8}
                                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-8 py-2.5 rounded-md text-sm transition disabled:opacity-50 w-auto min-w-[180px] flex items-center justify-center gap-2"
                                >
                                    <KeyRound className="w-4 h-4" />
                                    {loading ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </div>
                        </form>

                        {/* Back to Login Link */}
                        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                            <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition">
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