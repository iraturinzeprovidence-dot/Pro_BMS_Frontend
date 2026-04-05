import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import {
  User,
  Package,
  TrendingUp,
  ShoppingCart,
  Users,
  BookOpen,
  BarChart3,
  Briefcase,
  Building2,
  IdCard,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  CheckCircle,
  UserCircle,
  LayoutDashboard
} from 'lucide-react'

const MODULE_MAP = {
    inventory:  { label: 'Inventory',  icon: Package, path: '/inventory/dashboard',  desc: 'Manage products and stock levels' },
    sales:      { label: 'Sales',      icon: TrendingUp, path: '/sales/dashboard',      desc: 'View orders and customer information' },
    purchasing: { label: 'Purchasing', icon: ShoppingCart, path: '/purchasing/dashboard', desc: 'View purchase orders and suppliers' },
    hr:         { label: 'HR',         icon: Users, path: '/hr/dashboard',         desc: 'View employee information' },
    accounting: { label: 'Accounting', icon: BookOpen, path: '/accounting/dashboard', desc: 'View transactions and reports' },
    analytics:  { label: 'Analytics',  icon: BarChart3, path: '/analytics/dashboard',  desc: 'View KPIs and business reports' },
}

export default function EmployeeDashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get('/hr/my-profile')
            .then(r => setProfile(r.data))
            .catch(() => setProfile(null))
            .finally(() => setLoading(false))
    }, [])

    const permissions = profile?.permissions ?? []

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
                {/* Header Section */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <LayoutDashboard className="w-7 h-7 text-emerald-800" />
                        <h2 className="text-2xl font-bold text-black drop-shadow-lg">Employee Dashboard</h2>
                    </div>
                    <p className="text-gray-700 ml-10 drop-shadow-md font-medium">Welcome to your personal workspace</p>
                </div>

                {/* Welcome Card */}
                <div className="bg-white/80 backdrop-blur-md rounded-lg p-5 border border-gray-200 shadow-lg mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                            <UserCircle className="w-8 h-8 text-emerald-800" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-black">Welcome, {user?.name}!</h3>
                            {loading ? (
                                <p className="text-gray-500 text-sm mt-1">Loading profile...</p>
                            ) : profile ? (
                                <div className="flex flex-wrap gap-4 mt-1">
                                    <span className="text-sm text-gray-600 flex items-center gap-1">
                                        <Briefcase className="w-3.5 h-3.5" />
                                        {profile.job_title}
                                    </span>
                                    <span className="text-sm text-gray-600 flex items-center gap-1">
                                        <Building2 className="w-3.5 h-3.5" />
                                        {profile.department}
                                    </span>
                                    <span className="text-sm text-gray-600 flex items-center gap-1">
                                        <IdCard className="w-3.5 h-3.5" />
                                        {profile.employee_number}
                                    </span>
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm mt-1">No employee profile linked yet</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Profile Details and Access */}
                {profile && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
                        {/* Profile Card */}
                        <div className="bg-white/80 backdrop-blur-md rounded-lg p-5 border border-gray-200 shadow-lg">
                            <h3 className="font-semibold text-black text-lg mb-4">My Profile</h3>
                            <div className="space-y-2 text-sm">
                                {[
                                    { label: 'Full Name',  value: `${profile.first_name} ${profile.last_name}`, icon: User },
                                    { label: 'Email',      value: profile.email, icon: Mail },
                                    { label: 'Phone',      value: profile.phone ?? '—', icon: Phone },
                                    { label: 'Department', value: profile.department, icon: Building2 },
                                    { label: 'Job Title',  value: profile.job_title, icon: Briefcase },
                                    { label: 'Hire Date',  value: new Date(profile.hire_date).toLocaleDateString(), icon: Calendar },
                                    { label: 'Status',     value: profile.status, icon: CheckCircle },
                                ].map(item => {
                                    const Icon = item.icon
                                    return (
                                        <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                                            <div className="flex items-center gap-2">
                                                <Icon className="w-3.5 h-3.5 text-emerald-700" />
                                                <span className="text-gray-600 text-xs">{item.label}</span>
                                            </div>
                                            <span className="font-medium text-black text-sm capitalize">{item.value}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Access Card */}
                        <div className="bg-white/80 backdrop-blur-md rounded-lg p-5 border border-gray-200 shadow-lg">
                            <h3 className="font-semibold text-black text-lg mb-4">My Access</h3>
                            {permissions.length === 0 ? (
                                <div className="text-center py-6">
                                    <AlertCircle className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                                    <p className="text-gray-700 text-sm font-medium">No module access assigned yet.</p>
                                    <p className="text-gray-500 text-xs mt-1">Contact your admin to get access.</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {permissions.map(p => {
                                        const mod = MODULE_MAP[p]
                                        if (!mod) return null
                                        const Icon = mod.icon
                                        return (
                                            <div key={p} className="flex items-center gap-3 p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                                                <Icon className="w-4 h-4 text-emerald-700" />
                                                <span className="text-sm font-medium text-emerald-800">{mod.label}</span>
                                                <span className="ml-auto text-xs text-emerald-600 flex items-center gap-1">
                                                    <CheckCircle className="w-3 h-3" />
                                                    Access granted
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Accessible Modules */}
                {permissions.length > 0 && (
                    <div>
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-black drop-shadow-md">My Modules</h3>
                            <p className="text-gray-700 mt-0.5 drop-shadow-sm font-medium text-sm">Access and manage your assigned modules</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {permissions.map(p => {
                                const mod = MODULE_MAP[p]
                                if (!mod) return null
                                const Icon = mod.icon
                                return (
                                    <div
                                        key={p}
                                        onClick={() => navigate(mod.path)}
                                        className="bg-white/80 backdrop-blur-md rounded-lg p-4 border border-gray-200 cursor-pointer transition-all duration-200 hover:bg-white/90 hover:border-emerald-400 hover:shadow-xl group flex flex-col h-[140px]"
                                    >
                                        <div className="flex flex-col items-center text-center flex-1">
                                            <Icon className="w-6 h-6 text-emerald-800 mb-2" />
                                            <h3 className="font-semibold text-black text-base mb-1">
                                                {mod.label}
                                            </h3>
                                            <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                                {mod.desc}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-700 group-hover:text-emerald-800 transition-colors mt-2 pt-2 border-t border-gray-200">
                                            <span>Access Module</span>
                                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* No profile linked */}
                {!loading && !profile && (
                    <div className="bg-yellow-50/90 backdrop-blur-sm border border-yellow-300 rounded-lg p-6 text-center">
                        <AlertCircle className="w-10 h-10 text-yellow-600 mx-auto mb-2" />
                        <p className="text-yellow-800 font-medium">No employee profile linked to your account</p>
                        <p className="text-yellow-600 text-sm mt-1">Please contact your HR admin to link your profile</p>
                    </div>
                )}
            </div>
        </div>
    )
}