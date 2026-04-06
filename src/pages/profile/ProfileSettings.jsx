import { useState, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { uploadAvatar } from '../../api/imageApi'
import { Camera, User, Save, UserCircle, Mail, Shield } from 'lucide-react'

export default function ProfileSettings() {
    const { user, login }             = useAuth()
    const [preview, setPreview]       = useState(null)
    const [uploading, setUploading]   = useState(false)
    const [success, setSuccess]       = useState('')
    const [error, setError]           = useState('')
    const fileRef                     = useRef()

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setPreview(URL.createObjectURL(file))
    }

    const handleUpload = async () => {
        const file = fileRef.current.files[0]
        if (!file) return
        setUploading(true)
        setError('')
        setSuccess('')
        try {
            const r = await uploadAvatar(file)
            setSuccess('Profile picture updated successfully!')
            const updated = { ...user, avatar: r.avatar }
            localStorage.setItem('user', JSON.stringify(updated))
        } catch (err) {
            setError('Failed to upload image. Max size is 2MB.')
        } finally {
            setUploading(false)
        }
    }

    const avatarUrl = preview
        ?? (user?.avatar ? user.avatar : null)

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
            
            {/* Content - Centered */}
            <div className="relative z-10 w-full max-w-2xl mx-auto px-4">
                {/* Header - Centered */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-3">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                            <UserCircle className="w-8 h-8 text-emerald-700" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-black drop-shadow-lg">Profile Settings</h2>
                    <p className="text-gray-700 mt-1 drop-shadow-sm font-medium">
                        Manage your account profile
                    </p>
                </div>

                {/* Avatar Section - Centered */}
                <div className="bg-white/80 backdrop-blur-md rounded-md border border-gray-200 shadow-lg p-6 mb-6">
                    <h3 className="font-semibold text-black text-lg mb-4 text-center">Profile Picture</h3>

                    <div className="flex flex-col items-center gap-4">
                        {/* Avatar Preview - Centered */}
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden border-2 border-emerald-200">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-10 h-10 text-emerald-700" />
                                )}
                            </div>
                            <button
                                onClick={() => fileRef.current.click()}
                                className="absolute bottom-0 right-0 w-7 h-7 bg-emerald-700 rounded-full flex items-center justify-center border-2 border-white hover:bg-emerald-800 transition"
                            >
                                <Camera className="w-3 h-3 text-white" />
                            </button>
                        </div>

                        {/* Upload Info - Centered */}
                        <div className="text-center">
                            <p className="text-sm font-medium text-gray-800 mb-1">{user?.name}</p>
                            <p className="text-xs text-gray-500 mb-3 capitalize">{user?.role}</p>
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <button
                                onClick={() => fileRef.current.click()}
                                className="text-xs border border-gray-300 rounded-md px-4 py-1.5 text-gray-600 hover:bg-gray-50 transition"
                            >
                                Choose Photo
                            </button>
                        </div>
                    </div>

                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2.5 rounded-md flex items-center justify-center gap-2 mt-4">
                            <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                            {success}
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-md flex items-center justify-center gap-2 mt-4">
                            <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                            {error}
                        </div>
                    )}

                    {preview && (
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={handleUpload}
                                disabled={uploading}
                                className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium px-5 py-2.5 rounded-md transition disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {uploading ? 'Uploading...' : 'Save Profile Picture'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Account Info - Centered */}
                <div className="bg-white/80 backdrop-blur-md rounded-md border border-gray-200 shadow-lg p-6">
                    <h3 className="font-semibold text-black text-lg mb-4 text-center">Account Information</h3>
                    <div className="space-y-3">
                        {[
                            { label: 'Full Name', value: user?.name, icon: User },
                            { label: 'Email', value: user?.email, icon: Mail },
                            { label: 'Role', value: user?.role, icon: Shield },
                        ].map(item => {
                            const Icon = item.icon
                            return (
                                <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <Icon className="w-3.5 h-3.5 text-gray-400" />
                                        <span className="text-sm text-gray-600">{item.label}</span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-800 capitalize">{item.value}</span>
                                </div>
                            )
                        })}
                    </div>
                    <div className="bg-gray-50 rounded-md p-3 mt-4 border border-gray-100 text-center">
                        <p className="text-xs text-gray-500">
                            To change your name, email or password contact your admin.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}