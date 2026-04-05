import { useState, useEffect } from 'react'
import { usersApi } from '../../api/usersApi'
import { hrApi } from '../../api/hrApi'
import {
    Users, Shield, UserCheck, UserCog,
    Plus, Search, Edit, Trash2,
    Package, TrendingUp, ShoppingCart,
    BookOpen, BarChart3, Eye, EyeOff,
    LayoutDashboard, X, AlertCircle, CheckCircle, Key, Mail, User
} from 'lucide-react'

const ALL_PERMISSIONS = [
    { key: 'inventory',  label: 'Inventory',  icon: Package,      desc: 'Products and stock management'     },
    { key: 'sales',      label: 'Sales',      icon: TrendingUp,   desc: 'Orders and customer management'    },
    { key: 'purchasing', label: 'Purchasing', icon: ShoppingCart, desc: 'Suppliers and purchase orders'     },
    { key: 'hr',         label: 'HR',         icon: Users,        desc: 'Employees and job applications'    },
    { key: 'accounting', label: 'Accounting', icon: BookOpen,     desc: 'Transactions and financial reports' },
    { key: 'analytics',  label: 'Analytics',  icon: BarChart3,    desc: 'KPIs and business analytics'       },
]

export default function UserManagement() {
    const [users, setUsers]               = useState([])
    const [stats, setStats]               = useState(null)
    const [search, setSearch]             = useState('')
    const [loading, setLoading]           = useState(true)
    const [showModal, setShowModal]       = useState(false)
    const [showPermModal, setShowPermModal] = useState(false)
    const [editing, setEditing]           = useState(null)
    const [permUser, setPermUser]         = useState(null)
    const [permEmployee, setPermEmployee] = useState(null)
    const [tempPermissions, setTempPermissions] = useState([])
    const [error, setError]               = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [form, setForm]                 = useState({
        name: '', email: '', password: '', role: 'employee',
    })

    const fetchUsers = async () => {
        setLoading(true)
        const r = await usersApi.getUsers({ search })
        setUsers(r.data)
        setLoading(false)
    }

    const fetchStats = async () => {
        const r = await usersApi.getStats()
        setStats(r.data)
    }

    useEffect(() => {
        fetchUsers()
        fetchStats()
    }, [search])

    const openCreate = () => {
        setEditing(null)
        setForm({ name: '', email: '', password: '', role: 'employee' })
        setError('')
        setShowPassword(false)
        setShowModal(true)
    }

    const openEdit = (u) => {
        setEditing(u)
        setForm({ name: u.name, email: u.email, password: '', role: u.role?.name ?? 'employee' })
        setError('')
        setShowPassword(false)
        setShowModal(true)
    }

    const openPermissions = async (u) => {
        setPermUser(u)
        setTempPermissions([])
        setShowPermModal(true)

        try {
            const r = await hrApi.getEmployees({ search: u.email })
            const emp = r.data.find(e => e.email === u.email)
            if (emp) {
                setPermEmployee(emp)
                setTempPermissions(emp.permissions ?? [])
            } else {
                setPermEmployee(null)
            }
        } catch {
            setPermEmployee(null)
        }
    }

    const togglePermission = (key) => {
        setTempPermissions(prev =>
            prev.includes(key)
                ? prev.filter(p => p !== key)
                : [...prev, key]
        )
    }

    const savePermissions = async () => {
        if (!permEmployee) {
            alert('This user has no linked employee profile. Hire them through HR → Candidates first.')
            return
        }
        try {
            await hrApi.updateEmployee(permEmployee.id, {
                ...permEmployee,
                permissions: tempPermissions,
            })
            setShowPermModal(false)
            fetchUsers()
        } catch {
            alert('Failed to save permissions')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            if (editing) {
                await usersApi.updateUser(editing.id, form)
            } else {
                await usersApi.createUser(form)
            }
            setShowModal(false)
            fetchUsers()
            fetchStats()
        } catch (err) {
            const errors = err.response?.data?.errors
            if (errors) {
                const first = Object.values(errors)[0]
                setError(Array.isArray(first) ? first[0] : first)
            } else {
                setError(err.response?.data?.message ?? 'Something went wrong')
            }
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this user?')) return
        try {
            await usersApi.deleteUser(id)
            fetchUsers()
            fetchStats()
        } catch (err) {
            alert(err.response?.data?.message ?? 'Cannot delete user')
        }
    }

    const roleConfig = (role) => ({
        admin:    { color: 'bg-blue-100 text-blue-700', icon: Shield },
        manager:  { color: 'bg-emerald-100 text-emerald-700', icon: UserCog },
        employee: { color: 'bg-gray-100 text-gray-600', icon: UserCheck },
    }[role] ?? { color: 'bg-gray-100 text-gray-600', icon: UserCheck })

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
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Users className="w-7 h-7 text-emerald-800" />
                            <h2 className="text-2xl font-bold text-black drop-shadow-lg">User Management</h2>
                        </div>
                        <p className="text-gray-700 ml-10 drop-shadow-md font-medium">
                            Manage all system users, roles and permissions
                        </p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-base font-medium px-6 py-3 rounded-md transition-all duration-200 flex items-center gap-2 shadow-md"
                    >
                        <Plus className="w-5 h-5" />
                        Add User
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-6">
                    <div className="bg-white/80 backdrop-blur-md rounded-md p-4 border border-gray-200 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <Users className="w-5 h-5 text-emerald-700" />
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Users</span>
                        </div>
                        <p className="text-2xl font-bold text-black">{stats?.total_users ?? 0}</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-md rounded-md p-4 border border-gray-200 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <Shield className="w-5 h-5 text-purple-600" />
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Admins</span>
                        </div>
                        <p className="text-2xl font-bold text-black">{stats?.admin_users ?? 0}</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-md rounded-md p-4 border border-gray-200 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <UserCog className="w-5 h-5 text-emerald-600" />
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Managers</span>
                        </div>
                        <p className="text-2xl font-bold text-black">{stats?.manager_users ?? 0}</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-md rounded-md p-4 border border-gray-200 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <UserCheck className="w-5 h-5 text-gray-500" />
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Employees</span>
                        </div>
                        <p className="text-2xl font-bold text-black">{stats?.employee_users ?? 0}</p>
                    </div>
                </div>.
                {/* Search */}
                <div className="mb-6">
                    <div className="relative md:w-96">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full border border-gray-200 rounded-md pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/80 backdrop-blur-md"
                        />
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white/80 backdrop-blur-md rounded-md border border-gray-200 shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-emerald-50/50">
                                <tr>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">User</th>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Email</th>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Role</th>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Permissions</th>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Created</th>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-8 text-gray-500">
                                            <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                            Loading users...
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-8">
                                            <Users className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                                            <p className="text-gray-500 text-sm">No users found</p>
                                            <p className="text-gray-400 text-xs mt-1">Click "Add User" to get started</p>
                                        </td>
                                    </tr>
                                ) : users.map((u) => {
                                    const role = roleConfig(u.role?.name)
                                    const RoleIcon = role.icon
                                    return (
                                        <tr key={u.id} className="hover:bg-white/40 transition-colors">
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                                        <User className="w-4 h-4 text-emerald-700" />
                                                    </div>
                                                    <span className="font-medium text-gray-800">{u.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-1">
                                                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                                                    <span className="text-gray-600">{u.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium capitalize ${role.color}`}>
                                                    <RoleIcon className="w-3 h-3" />
                                                    {u.role?.name ?? 'No role'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3">
                                                {u.role?.name === 'employee' ? (
                                                    <button
                                                        onClick={() => openPermissions(u)}
                                                        className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-medium border border-purple-200 px-2 py-1 rounded-md hover:bg-purple-50 transition"
                                                    >
                                                        <Key className="w-3 h-3" />
                                                        Manage Access
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                                        <CheckCircle className="w-3 h-3 text-green-600" />
                                                        {u.role?.name === 'admin' ? 'Full access' : 'Dept access'}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3 text-gray-500">
                                                {new Date(u.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => openEdit(u)}
                                                        className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(u.id)}
                                                        className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Add/Edit User Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
                        <div className="bg-white/95 backdrop-blur-md rounded-md shadow-xl w-full max-w-md mx-auto">
                            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200">
                                <h3 className="text-xl font-bold text-black">
                                    {editing ? 'Edit User' : 'Add New User'}
                                </h3>
                                <button 
                                    onClick={() => setShowModal(false)}
                                    className="p-2 rounded-md hover:bg-gray-100 transition"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                            
                            {error && (
                                <div className="mx-6 mt-5 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-md flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <User className="w-3.5 h-3.5 inline mr-1" />
                                        Full Name
                                    </label>
                                    <input
                                        type="text" required value={form.name}
                                        onChange={e => setForm({...form, name: e.target.value})}
                                        className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Mail className="w-3.5 h-3.5 inline mr-1" />
                                        Email
                                    </label>
                                    <input
                                        type="email" required value={form.email}
                                        onChange={e => setForm({...form, email: e.target.value})}
                                        className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Key className="w-3.5 h-3.5 inline mr-1" />
                                        {editing ? 'New Password (leave blank to keep current)' : 'Password'}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required={!editing}
                                            value={form.password}
                                            onChange={e => setForm({...form, password: e.target.value})}
                                            placeholder={editing ? 'Leave blank to keep current' : 'Min 8 characters'}
                                            className="w-full border border-gray-200 rounded-md px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Shield className="w-3.5 h-3.5 inline mr-1" />
                                        Role
                                    </label>
                                    <select
                                        value={form.role}
                                        onChange={e => setForm({...form, role: e.target.value})}
                                        className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                    >
                                        <option value="admin">Admin — Full access to everything</option>
                                        <option value="manager">Manager — Sales, HR and Analytics</option>
                                        <option value="employee">Employee — Based on assigned permissions</option>
                                    </select>
                                </div>

                                {/* Role explanation */}
                                <div className={`rounded-md p-3 text-xs ${
                                    form.role === 'admin'    ? 'bg-blue-50 text-blue-700 border border-blue-200'   :
                                    form.role === 'manager'  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                    'bg-gray-50 text-gray-600 border border-gray-200'
                                }`}>
                                    {form.role === 'admin'   && '🔐 Admin has full unrestricted access to all modules including user management.'}
                                    {form.role === 'manager' && '👔 Manager has access to Sales, HR and Analytics dashboards.'}
                                    {form.role === 'employee' && '👤 Employee access is controlled by module permissions. Set permissions after creating the account via the Manage Access button.'}
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2.5 rounded-md text-sm transition"
                                    >
                                        {editing ? 'Update User' : 'Create User'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-md text-sm hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Permissions Modal */}
                {showPermModal && permUser && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
                        <div className="bg-white/95 backdrop-blur-md rounded-md shadow-xl w-full max-w-md mx-auto">
                            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                        <User className="w-5 h-5 text-purple-700" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-black">Module Permissions</h3>
                                        <p className="text-gray-500 text-xs">{permUser.name} — {permUser.email}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setShowPermModal(false)}
                                    className="p-2 rounded-md hover:bg-gray-100 transition"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            {/* No employee profile warning */}
                            {permEmployee === null && (
                                <div className="mx-6 mt-5 bg-yellow-50 border border-yellow-200 rounded-md p-3">
                                    <p className="text-yellow-800 text-xs font-medium flex items-center gap-1">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        No employee profile linked
                                    </p>
                                    <p className="text-yellow-600 text-xs mt-1">
                                        This user must be hired through HR → Candidates before permissions can be assigned.
                                    </p>
                                </div>
                            )}

                            {permEmployee && (
                                <div className="mx-6 mt-5 bg-emerald-50 border border-emerald-200 rounded-md p-3">
                                    <p className="text-emerald-800 text-xs font-medium flex items-center gap-1">
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        Linked to employee: {permEmployee.first_name} {permEmployee.last_name}
                                    </p>
                                    <p className="text-emerald-600 text-xs mt-1">
                                        {permEmployee.job_title} — {permEmployee.department}
                                    </p>
                                </div>
                            )}

                            {/* Permissions list */}
                            <div className="p-6 space-y-2">
                                {ALL_PERMISSIONS.map(p => {
                                    const Icon = p.icon
                                    const isGranted = tempPermissions.includes(p.key)
                                    return (
                                        <label
                                            key={p.key}
                                            className={`flex items-center justify-between p-3 border rounded-md cursor-pointer transition ${
                                                isGranted
                                                    ? 'border-emerald-300 bg-emerald-50'
                                                    : 'border-gray-200 hover:bg-gray-50'
                                            } ${permEmployee === null ? 'opacity-40 pointer-events-none' : ''}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                                                    isGranted ? 'bg-emerald-100' : 'bg-gray-100'
                                                }`}>
                                                    <Icon className={`w-4 h-4 ${isGranted ? 'text-emerald-700' : 'text-gray-500'}`} />
                                                </div>
                                                <div>
                                                    <p className={`text-sm font-medium ${isGranted ? 'text-emerald-800' : 'text-gray-700'}`}>
                                                        {p.label}
                                                    </p>
                                                    <p className="text-xs text-gray-400">{p.desc}</p>
                                                </div>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={isGranted}
                                                onChange={() => togglePermission(p.key)}
                                                className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                            />
                                        </label>
                                    )
                                })}
                            </div>

                            {/* Summary */}
                            {tempPermissions.length > 0 && (
                                <div className="mx-6 mb-4 bg-emerald-50 rounded-md p-3 border border-emerald-200">
                                    <p className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        {tempPermissions.length} module{tempPermissions.length > 1 ? 's' : ''} granted:
                                        {' '}{tempPermissions.map(p =>
                                            ALL_PERMISSIONS.find(x => x.key === p)?.label
                                        ).join(', ')}
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-3 p-6 pt-0">
                                <button
                                    onClick={savePermissions}
                                    disabled={permEmployee === null}
                                    className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2.5 rounded-md text-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Save Permissions
                                </button>
                                <button
                                    onClick={() => setShowPermModal(false)}
                                    className="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-md text-sm hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}