import { useState, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { uploadAvatar } from '../../api/imageApi'
import { Camera, Save, User, Mail, Shield, UserCircle, X, CheckCircle, AlertCircle, Edit2, Calendar, Phone, MapPin, Briefcase } from 'lucide-react'

export default function ProfileSettings() {
    const { user, profile, updateUser } = useAuth()
    const [preview, setPreview] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [isHovering, setIsHovering] = useState(false)
    const fileRef = useRef()

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        
        if (file.size > 2 * 1024 * 1024) {
            setError('File size exceeds 2MB. Please choose a smaller image.')
            return
        }
        
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
        if (!allowedTypes.includes(file.type)) {
            setError('Only JPG, PNG, or WEBP images are allowed.')
            return
        }
        
        setSelectedFile(file)
        setPreview(URL.createObjectURL(file))
        setSuccess('')
        setError('')
    }

    const handleUpload = async () => {
        if (!selectedFile) return
        setUploading(true)
        setError('')
        setSuccess('')
        try {
            const r = await uploadAvatar(selectedFile)
            const updated = { ...user, avatar: r.avatar }
            updateUser(updated)
            setPreview(null)
            setSelectedFile(null)
            setSuccess('Profile picture updated successfully!')
            setTimeout(() => setSuccess(''), 3000)
        } catch (err) {
            setError('Failed to upload image. Please try again.')
            setTimeout(() => setError(''), 3000)
        } finally {
            setUploading(false)
        }
    }

    const avatarUrl = preview ?? user?.avatar ?? null

    const accountDetails = [
        { label: 'Full Name', value: user?.name, icon: User, color: 'text-emerald-600' },
        { label: 'Email Address', value: user?.email, icon: Mail, color: 'text-blue-600' },
        { label: 'Role', value: user?.role, icon: Shield, color: 'text-purple-600' },
        { label: 'Department', value: profile?.department || 'Not assigned', icon: Briefcase, color: 'text-orange-600' },
        { label: 'Job Title', value: profile?.job_title || 'Not assigned', icon: UserCircle, color: 'text-indigo-600' },
        { label: 'Employee ID', value: profile?.employee_number || 'Not assigned', icon: Calendar, color: 'text-gray-600' },
    ]

    return (
        <div 
            className="relative min-h-screen w-full flex items-center justify-center py-12"
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
            
            {/* Content - Centered */}
            <div className="relative z-10 w-full max-w-4xl mx-auto px-4">
                {/* Header Section - Centered */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4 shadow-md">
                        <UserCircle className="w-8 h-8 text-emerald-700" />
                    </div>
                    <h2 className="text-3xl font-bold text-black drop-shadow-lg">Profile Settings</h2>
                    <p className="text-gray-600 mt-2">Manage your account profile and personal information</p>
                </div>

                {/* Two Column Layout with Space Between */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column - Avatar Section */}
                    <div className="bg-white/90 backdrop-blur-md rounded-xl border border-gray-200 shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center gap-2 bg-emerald-50 px-4 py-1.5 rounded-full">
                                <Camera className="w-4 h-4 text-emerald-600" />
                                <span className="text-xs font-medium text-emerald-700">Profile Picture</span>
                            </div>
                        </div>

                        {/* Avatar Preview */}
                        <div className="flex flex-col items-center">
                            <div 
                                className="relative group cursor-pointer"
                                onMouseEnter={() => setIsHovering(true)}
                                onMouseLeave={() => setIsHovering(false)}
                                onClick={() => fileRef.current.click()}
                            >
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                                    {avatarUrl ? (
                                        <img
                                            src={avatarUrl}
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-4xl font-bold text-emerald-700">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                {isHovering && (
                                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center transition-all duration-300">
                                        <Camera className="w-8 h-8 text-white" />
                                    </div>
                                )}
                            </div>
                            
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/jpg"
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            <div className="mt-6 text-center">
                                <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                                <p className="text-xs text-gray-500 capitalize mt-0.5">{user?.role}</p>
                            </div>

                            <div className="mt-4 flex gap-3">
                                <button
                                    onClick={() => fileRef.current.click()}
                                    className="px-4 py-2 text-sm border border-emerald-300 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-all duration-200 font-medium"
                                >
                                    Choose Photo
                                </button>
                                {selectedFile && (
                                    <button
                                        onClick={handleUpload}
                                        disabled={uploading}
                                        className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-200 font-medium disabled:opacity-50 flex items-center gap-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        {uploading ? 'Saving...' : 'Save'}
                                    </button>
                                )}
                            </div>
                            <p className="text-xs text-gray-400 mt-3">JPG, PNG or WebP. Max 2MB.</p>

                            {/* Feedback Messages */}
                            {success && (
                                <div className="mt-4 w-full bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2.5 rounded-lg flex items-center gap-2 animate-fadeIn">
                                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>{success}</span>
                                </div>
                            )}
                            {error && (
                                <div className="mt-4 w-full bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-lg flex items-center gap-2 animate-fadeIn">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Account Information */}
                    <div className="bg-white/90 backdrop-blur-md rounded-xl border border-gray-200 shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="mb-6">
                            <div className="inline-flex items-center gap-2 bg-emerald-50 px-4 py-1.5 rounded-full">
                                <Shield className="w-4 h-4 text-emerald-600" />
                                <span className="text-xs font-medium text-emerald-700">Account Details</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {accountDetails.map((item, index) => {
                                const Icon = item.icon
                                return (
                                    <div 
                                        key={item.label} 
                                        className="group flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-default border-b border-gray-100 last:border-0"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg ${item.color.replace('text', 'bg')?.replace('600', '50')} flex items-center justify-center`}>
                                                <Icon className={`w-4 h-4 ${item.color}`} />
                                            </div>
                                            <span className="text-sm font-medium text-gray-600">{item.label}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-gray-800 capitalize">
                                                {item.value || '—'}
                                            </span>
                                            <button 
                                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-gray-200 rounded"
                                                title="Edit information (Contact Admin)"
                                            >
                                                <Edit2 className="w-3 h-3 text-gray-400" />
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100">
                            <div className="bg-amber-50 rounded-lg p-3 flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-amber-700">
                                    To update your name, email, or password, please contact your system administrator.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Info Footer */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-500">
                        Last login: {new Date().toLocaleString()} • IP Address: Secured
                    </p>
                </div>
            </div>
        </div>
    )
}