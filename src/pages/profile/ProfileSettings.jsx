import { useState, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { uploadAvatar } from '../../api/imageApi'
import { Camera, Save, User, Mail, Shield, UserCircle, X, CheckCircle, AlertCircle } from 'lucide-react'

export default function ProfileSettings() {
    const { user, updateUser } = useAuth()
    const [preview, setPreview] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const fileRef = useRef()

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        
        // Validate file size (2MB max)
        if (file.size > 2 * 1024 * 1024) {
            setError('File size exceeds 2MB. Please choose a smaller image.')
            return
        }
        
        // Validate file type
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
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(''), 3000)
        } catch (err) {
            setError('Failed to upload image. Please try again.')
        } finally {
            setUploading(false)
        }
    }

    const avatarUrl = preview ?? user?.avatar ?? null

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
            <div className="relative z-10 p-8">
                <div className="max-w-2xl mx-auto">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <UserCircle className="w-7 h-7 text-emerald-800" />
                            <h2 className="text-2xl font-bold text-black drop-shadow-lg">Profile Settings</h2>
                        </div>
                        <p className="text-gray-700 ml-10 drop-shadow-md font-medium">
                            Manage your account profile picture
                        </p>
                    </div>

                    {/* Avatar Section */}
                    <div className="bg-white/80 backdrop-blur-md rounded-md border border-gray-200 shadow-lg p-6 mb-6">
                        <h3 className="font-semibold text-black text-lg mb-5">Profile Picture</h3>

                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            {/* Avatar Preview */}
                            <div className="relative flex-shrink-0">
                                <div className="w-28 h-28 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                                    {avatarUrl ? (
                                        <img
                                            src={avatarUrl}
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-3xl font-bold text-emerald-700">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => fileRef.current.click()}
                                    className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center border-2 border-white hover:bg-emerald-700 transition shadow-md"
                                >
                                    <Camera className="w-4 h-4 text-white" />
                                </button>
                            </div>

                            {/* Upload Controls */}
                            <div className="flex-1 text-center sm:text-left">
                                <p className="text-base font-semibold text-black">{user?.name}</p>
                                <p className="text-sm text-gray-500 capitalize mb-3">{user?.role}</p>

                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/jpg"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />

                                <button
                                    onClick={() => fileRef.current.click()}
                                    className="text-sm border border-gray-300 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-50 transition"
                                >
                                    Choose Photo
                                </button>
                                <p className="text-xs text-gray-400 mt-2">JPG, PNG or WebP. Max 2MB.</p>
                            </div>
                        </div>

                        {/* Feedback Messages */}
                        {success && (
                            <div className="mt-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-md flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                {success}
                            </div>
                        )}
                        {error && (
                            <div className="mt-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-md flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        {/* Save Button */}
                        {selectedFile && (
                            <button
                                onClick={handleUpload}
                                disabled={uploading}
                                className="mt-4 flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium px-5 py-2.5 rounded-md disabled:opacity-50 transition"
                            >
                                <Save className="w-4 h-4" />
                                {uploading ? 'Uploading...' : 'Save Profile Picture'}
                            </button>
                        )}
                    </div>

                    {/* Account Info */}
                    <div className="bg-white/80 backdrop-blur-md rounded-md border border-gray-200 shadow-lg p-6">
                        <h3 className="font-semibold text-black text-lg mb-4">Account Information</h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Full Name', value: user?.name, icon: User },
                                { label: 'Email', value: user?.email, icon: Mail },
                                { label: 'Role', value: user?.role, icon: Shield },
                            ].map(item => {
                                const Icon = item.icon
                                return (
                                    <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Icon className="w-4 h-4" />
                                            {item.label}
                                        </div>
                                        <span className="text-sm font-medium text-gray-800 capitalize">{item.value || '—'}</span>
                                    </div>
                                )
                            })}
                        </div>
                        <p className="text-xs text-gray-400 mt-4 pt-2 border-t border-gray-100">
                            To change your name, email or password, please contact your administrator.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}