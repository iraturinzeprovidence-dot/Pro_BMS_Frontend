import { useState, useEffect } from 'react'
import { hrApi } from '../../api/hrApi'
import { pdfApi, downloadPdf } from '../../api/pdfApi'
import {
  Users,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Download,
  Mail,
  Phone,
  Briefcase,
  DollarSign,
  Calendar,
  Building2,
  MapPin,
  User,
  UserCog,
  Shield,
  CheckCircle,
  XCircle,
  X,
  AlertCircle,
  Key,
  Package,
  TrendingUp,
  ShoppingCart,
  BookOpen,
  BarChart3,
  Home
} from 'lucide-react'

const ALL_PERMISSIONS = [
    { key: 'inventory',  label: 'Inventory',  icon: Package, desc: 'View and manage products & stock' },
    { key: 'sales',      label: 'Sales',      icon: TrendingUp, desc: 'View and manage orders & customers' },
    { key: 'purchasing', label: 'Purchasing', icon: ShoppingCart, desc: 'View and manage purchase orders' },
    { key: 'hr',         label: 'HR',         icon: Users, desc: 'View and manage employees' },
    { key: 'accounting', label: 'Accounting', icon: BookOpen, desc: 'View and manage transactions' },
    { key: 'analytics',  label: 'Analytics',  icon: BarChart3, desc: 'View reports and KPIs' },
]

export default function Employees() {
    const [employees, setEmployees]     = useState([])
    const [search, setSearch]           = useState('')
    const [loading, setLoading]         = useState(true)
    const [showModal, setShowModal]     = useState(false)
    const [showPermModal, setShowPermModal] = useState(false)
    const [editing, setEditing]         = useState(null)
    const [permEmployee, setPermEmployee] = useState(null)
    const [error, setError]             = useState('')
    const [pdfLoading, setPdfLoading]   = useState(false)
    const [form, setForm]               = useState({
        first_name: '', last_name: '', email: '', phone: '',
        department: '', job_title: '', salary: '',
        hire_date: '', status: 'active', address: '',
        permissions: [],
    })
    const [tempPermissions, setTempPermissions] = useState([])

    const fetchEmployees = async () => {
        setLoading(true)
        const r = await hrApi.getEmployees({ search })
        setEmployees(r.data)
        setLoading(false)
    }

    useEffect(() => { fetchEmployees() }, [search])

    const openCreate = () => {
        setEditing(null)
        setForm({
            first_name: '', last_name: '', email: '', phone: '',
            department: '', job_title: '', salary: '',
            hire_date: '', status: 'active', address: '',
            permissions: [],
        })
        setError('')
        setShowModal(true)
    }

    const openEdit = (e) => {
        setEditing(e)
        setForm({
            first_name:  e.first_name,
            last_name:   e.last_name,
            email:       e.email,
            phone:       e.phone ?? '',
            department:  e.department,
            job_title:   e.job_title,
            salary:      e.salary,
            hire_date:   e.hire_date,
            status:      e.status,
            address:     e.address ?? '',
            permissions: e.permissions ?? [],
        })
        setError('')
        setShowModal(true)
    }

    const openPermissions = (e) => {
        setPermEmployee(e)
        setTempPermissions(e.permissions ?? [])
        setShowPermModal(true)
    }

    const togglePermission = (key) => {
        setTempPermissions(prev =>
            prev.includes(key)
                ? prev.filter(p => p !== key)
                : [...prev, key]
        )
    }

    const savePermissions = async () => {
        try {
            await hrApi.updateEmployee(permEmployee.id, {
                ...permEmployee,
                permissions: tempPermissions,
            })
            setShowPermModal(false)
            fetchEmployees()
        } catch (err) {
            alert('Failed to save permissions')
        }
    }

    const handleSubmit = async (ev) => {
        ev.preventDefault()
        setError('')
        try {
            if (editing) {
                await hrApi.updateEmployee(editing.id, form)
            } else {
                await hrApi.createEmployee(form)
            }
            setShowModal(false)
            fetchEmployees()
        } catch (err) {
            setError(err.response?.data?.message ?? 'Something went wrong')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this employee?')) return
        await hrApi.deleteEmployee(id)
        fetchEmployees()
    }

    const handleExportPdf = async () => {
        setPdfLoading(true)
        try {
            const r = await pdfApi.exportEmployees()
            downloadPdf(r.data, 'employees-report.pdf')
        } catch (err) {
            alert('Failed to export PDF')
        } finally {
            setPdfLoading(false)
        }
    }

    const statusConfig = (s) => ({
        active:     { color: 'bg-green-100 text-green-700', icon: CheckCircle },
        inactive:   { color: 'bg-gray-100 text-gray-600', icon: XCircle },
        terminated: { color: 'bg-red-100 text-red-700', icon: XCircle },
    }[s] ?? { color: 'bg-gray-100 text-gray-600', icon: XCircle })

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
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Users className="w-7 h-7 text-emerald-800" />
                            <h2 className="text-2xl font-bold text-black drop-shadow-lg">Employees</h2>
                        </div>
                        <p className="text-gray-700 ml-10 drop-shadow-md font-medium">
                            {employees.length} employees total
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleExportPdf}
                            disabled={pdfLoading}
                            className="bg-purple-700 hover:bg-purple-800 text-white text-base font-medium px-6 py-3 rounded-md transition-all duration-200 flex items-center gap-2 shadow-md disabled:opacity-50"
                        >
                            <Download className="w-5 h-5" />
                            {pdfLoading ? 'Generating...' : 'Export PDF'}
                        </button>
                        <button
                            onClick={openCreate}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white text-base font-medium px-6 py-3 rounded-md transition-all duration-200 flex items-center gap-2 shadow-md"
                        >
                            <PlusCircle className="w-5 h-5" />
                            Add Employee
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative md:w-96">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email or department..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-white/80 backdrop-blur-md border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Employees Table */}
                <div className="bg-white/80 backdrop-blur-md rounded-md border border-gray-200 shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-emerald-50/50">
                                <tr>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Employee</th>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Department</th>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Job Title</th>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Permissions</th>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Salary</th>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Status</th>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-8 text-gray-500">
                                            <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                            Loading employees...
                                        </td>
                                    </tr>
                                ) : employees.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-8">
                                            <Users className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                                            <p className="text-gray-500 text-sm">No employees found</p>
                                            <p className="text-gray-400 text-xs mt-1">Click "Add Employee" to get started</p>
                                        </td>
                                    </tr>
                                ) : employees.map((e) => {
                                    const status = statusConfig(e.status)
                                    const StatusIcon = status.icon
                                    return (
                                        <tr key={e.id} className="hover:bg-white/40 transition-colors">
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-gray-500" />
                                                    <div>
                                                        <p className="font-medium text-gray-800">{e.first_name} {e.last_name}</p>
                                                        <p className="text-xs text-gray-400 font-mono">{e.employee_number}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-1">
                                                    <Building2 className="w-3.5 h-3.5 text-gray-400" />
                                                    <span className="text-gray-600">{e.department}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-1">
                                                    <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                                                    <span className="text-gray-600">{e.job_title}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex flex-wrap gap-1">
                                                    {(e.permissions ?? []).length === 0 ? (
                                                        <span className="text-xs text-gray-400">No access</span>
                                                    ) : (e.permissions ?? []).map(p => (
                                                        <span key={p} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full capitalize flex items-center gap-1">
                                                            {p === 'inventory' && <Package className="w-2.5 h-2.5" />}
                                                            {p === 'sales' && <TrendingUp className="w-2.5 h-2.5" />}
                                                            {p === 'purchasing' && <ShoppingCart className="w-2.5 h-2.5" />}
                                                            {p === 'hr' && <Users className="w-2.5 h-2.5" />}
                                                            {p === 'accounting' && <BookOpen className="w-2.5 h-2.5" />}
                                                            {p === 'analytics' && <BarChart3 className="w-2.5 h-2.5" />}
                                                            {p}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                                                    <span className="text-gray-800 font-medium">{Number(e.salary).toLocaleString()}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 w-fit ${status.color}`}>
                                                    <StatusIcon className="w-3 h-3" />
                                                    {e.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex gap-1">
                                                    <button 
                                                        onClick={() => openEdit(e)} 
                                                        className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => openPermissions(e)} 
                                                        className="p-1.5 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-md transition"
                                                        title="Permissions"
                                                    >
                                                        <Key className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(e.id)} 
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

                {/* Add/Edit Employee Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
                        <div className="bg-white/95 backdrop-blur-md rounded-md shadow-xl w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center px-8 py-5 border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur-md z-10">
                                <h3 className="text-xl font-bold text-black">
                                    {editing ? 'Edit Employee' : 'Add New Employee'}
                                </h3>
                                <button 
                                    onClick={() => setShowModal(false)}
                                    className="p-2 rounded-md hover:bg-gray-100 transition"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                            
                            {error && (
                                <div className="mx-8 mt-5 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-md flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit} className="p-8 space-y-5">
                                <div className="grid grid-cols-2 gap-5">
                                    {[
                                        { label: 'First Name', key: 'first_name', type: 'text', required: true, icon: User },
                                        { label: 'Last Name', key: 'last_name', type: 'text', required: true, icon: User },
                                        { label: 'Email', key: 'email', type: 'email', required: true, icon: Mail },
                                        { label: 'Phone', key: 'phone', type: 'text', required: false, icon: Phone },
                                        { label: 'Department', key: 'department', type: 'text', required: true, icon: Building2 },
                                        { label: 'Job Title', key: 'job_title', type: 'text', required: true, icon: Briefcase },
                                        { label: 'Salary', key: 'salary', type: 'number', required: true, icon: DollarSign },
                                        { label: 'Hire Date', key: 'hire_date', type: 'date', required: true, icon: Calendar },
                                    ].map(field => {
                                        const Icon = field.icon
                                        return (
                                            <div key={field.key}>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    <Icon className="w-3.5 h-3.5 inline mr-1" />
                                                    {field.label}
                                                </label>
                                                <input
                                                    type={field.type}
                                                    required={field.required}
                                                    value={form[field.key]}
                                                    onChange={e => setForm({...form, [field.key]: e.target.value})}
                                                    className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                                />
                                            </div>
                                        )
                                    })}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <UserCog className="w-3.5 h-3.5 inline mr-1" />
                                            Status
                                        </label>
                                        <select
                                            value={form.status}
                                            onChange={e => setForm({...form, status: e.target.value})}
                                            className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="terminated">Terminated</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Shield className="w-3.5 h-3.5 inline mr-1" />
                                        Module Permissions
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {ALL_PERMISSIONS.map(p => {
                                            const Icon = p.icon
                                            return (
                                                <label key={p.key} className={`flex items-center gap-2 p-2 border rounded-md cursor-pointer transition ${
                                                    form.permissions.includes(p.key)
                                                        ? 'border-emerald-300 bg-emerald-50'
                                                        : 'border-gray-200 hover:bg-gray-50'
                                                }`}>
                                                    <input
                                                        type="checkbox"
                                                        checked={form.permissions.includes(p.key)}
                                                        onChange={() => setForm({
                                                            ...form,
                                                            permissions: form.permissions.includes(p.key)
                                                                ? form.permissions.filter(x => x !== p.key)
                                                                : [...form.permissions, p.key]
                                                        })}
                                                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                                    />
                                                    <Icon className="w-3.5 h-3.5 text-gray-500" />
                                                    <span className="text-xs text-gray-700">{p.label}</span>
                                                </label>
                                            )
                                        })}
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <MapPin className="w-3.5 h-3.5 inline mr-1" />
                                        Address
                                    </label>
                                    <textarea
                                        rows="2" value={form.address}
                                        onChange={e => setForm({...form, address: e.target.value})}
                                        className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                        placeholder="Optional address..."
                                    />
                                </div>
                                
                                <div className="flex gap-3 pt-4">
                                    <button type="submit" className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2.5 rounded-md text-sm transition">
                                        {editing ? 'Update Employee' : 'Create Employee'}
                                    </button>
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-md text-sm hover:bg-gray-50 transition">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Permissions Modal */}
                {showPermModal && permEmployee && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
                        <div className="bg-white/95 backdrop-blur-md rounded-md shadow-xl w-full max-w-md mx-auto">
                            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200">
                                <h3 className="text-xl font-bold text-black">Module Permissions</h3>
                                <button 
                                    onClick={() => setShowPermModal(false)}
                                    className="p-2 rounded-md hover:bg-gray-100 transition"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                            
                            <div className="px-6 pt-4 pb-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <User className="w-4 h-4 text-gray-500" />
                                    <p className="font-semibold text-gray-800">
                                        {permEmployee.first_name} {permEmployee.last_name}
                                    </p>
                                </div>
                                <p className="text-gray-500 text-sm flex items-center gap-1">
                                    <Briefcase className="w-3.5 h-3.5" />
                                    {permEmployee.job_title}
                                </p>
                            </div>

                            <div className="p-6 space-y-3">
                                {ALL_PERMISSIONS.map(p => {
                                    const Icon = p.icon
                                    return (
                                        <label
                                            key={p.key}
                                            className={`flex items-center justify-between p-3 border rounded-md cursor-pointer transition ${
                                                tempPermissions.includes(p.key)
                                                    ? 'border-emerald-300 bg-emerald-50'
                                                    : 'border-gray-200 hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon className="w-4 h-4 text-gray-500" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">{p.label}</p>
                                                    <p className="text-xs text-gray-500">{p.desc}</p>
                                                </div>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={tempPermissions.includes(p.key)}
                                                onChange={() => togglePermission(p.key)}
                                                className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                            />
                                        </label>
                                    )
                                })}
                            </div>

                            <div className="flex gap-3 p-6 pt-2 border-t border-gray-200">
                                <button
                                    onClick={savePermissions}
                                    className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2.5 rounded-md text-sm transition flex items-center justify-center gap-2"
                                >
                                    <Shield className="w-4 h-4" />
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