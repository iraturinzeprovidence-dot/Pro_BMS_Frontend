import { useState, useEffect } from 'react'
import { salesApi } from '../../api/salesApi'
import {
  Users,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Building2,
  CheckCircle,
  XCircle,
  X,
  AlertCircle,
  User,
  ShoppingBag
} from 'lucide-react'

export default function Customers() {
    const [customers, setCustomers] = useState([])
    const [search, setSearch]       = useState('')
    const [loading, setLoading]     = useState(true)
    const [showDrawer, setShowDrawer] = useState(false)
    const [editing, setEditing]     = useState(null)
    const [error, setError]         = useState('')
    const [form, setForm]           = useState({
        name: '', email: '', phone: '',
        address: '', city: '', country: '', status: 'active',
    })

    const fetchCustomers = async () => {
        setLoading(true)
        const r = await salesApi.getCustomers({ search })
        setCustomers(r.data)
        setLoading(false)
    }

    useEffect(() => { fetchCustomers() }, [search])

    const openCreate = () => {
        setEditing(null)
        setForm({ name: '', email: '', phone: '', address: '', city: '', country: '', status: 'active' })
        setError('')
        setShowDrawer(true)
    }

    const openEdit = (c) => {
        setEditing(c)
        setForm({
            name: c.name, email: c.email ?? '', phone: c.phone ?? '',
            address: c.address ?? '', city: c.city ?? '', country: c.country ?? '', status: c.status,
        })
        setError('')
        setShowDrawer(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            if (editing) {
                await salesApi.updateCustomer(editing.id, form)
            } else {
                await salesApi.createCustomer(form)
            }
            setShowDrawer(false)
            fetchCustomers()
        } catch (err) {
            setError(err.response?.data?.message ?? 'Something went wrong')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this customer?')) return
        await salesApi.deleteCustomer(id)
        fetchCustomers()
    }

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
                            <h2 className="text-2xl font-bold text-black drop-shadow-lg">Customers</h2>
                        </div>
                        <p className="text-gray-700 ml-10 drop-shadow-md font-medium">
                            {customers.length} customers total
                        </p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-base font-medium px-8 py-3 rounded-[5px] transition-all duration-200 flex items-center gap-2 shadow-md"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Add Customer
                    </button>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative md:w-96">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email or phone..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-white/80 backdrop-blur-md border border-gray-200 rounded-[5px] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Customers Table */}
                <div className="bg-white/80 backdrop-blur-md rounded-[5px] border border-gray-200 shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-emerald-50/50">
                                <tr>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Name</th>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Email</th>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Phone</th>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">City</th>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Orders</th>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Status</th>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-8 text-gray-500">
                                            <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                            Loading customers...
                                        </td>
                                    </tr>
                                ) : customers.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-8">
                                            <Users className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                                            <p className="text-gray-500 text-sm">No customers found</p>
                                            <p className="text-gray-400 text-xs mt-1">Click "Add Customer" to get started</p>
                                        </td>
                                    </tr>
                                ) : customers.map((c) => (
                                    <tr key={c.id} className="hover:bg-white/40 transition-colors">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-emerald-600" />
                                                <span className="font-medium text-gray-800">{c.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-1">
                                                <Mail className="w-3.5 h-3.5 text-gray-400" />
                                                <span className="text-gray-600">{c.email ?? '—'}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-1">
                                                <Phone className="w-3.5 h-3.5 text-gray-400" />
                                                <span className="text-gray-600">{c.phone ?? '—'}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                                <span className="text-gray-600">{c.city ?? '—'}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-1">
                                                <ShoppingBag className="w-3.5 h-3.5 text-gray-400" />
                                                <span className="text-gray-600 font-medium">{c.orders_count}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={`text-xs px-2 py-1 rounded-[5px] font-medium flex items-center gap-1 w-fit ${
                                                c.status === 'active' 
                                                    ? 'bg-green-100 text-green-700' 
                                                    : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {c.status === 'active' ? 
                                                    <CheckCircle className="w-3 h-3" /> : 
                                                    <XCircle className="w-3 h-3" />
                                                }
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex gap-1">
                                                <button 
                                                    onClick={() => openEdit(c)} 
                                                    className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-[5px] transition"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(c.id)} 
                                                    className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-[5px] transition"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Side Drawer - Add/Edit Customer */}
                {showDrawer && (
                    <div className="fixed inset-0 z-50 flex justify-end">
                        <div className="fixed inset-0 bg-black/40" onClick={() => setShowDrawer(false)} />
                        <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
                            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-white">
                                <h3 className="font-bold text-gray-800 text-xl flex items-center gap-2">
                                    {editing ? (
                                        <>
                                            <Edit className="w-6 h-6 text-emerald-600" />
                                            Edit Customer
                                        </>
                                    ) : (
                                        <>
                                            <PlusCircle className="w-6 h-6 text-emerald-600" />
                                            Add New Customer
                                        </>
                                    )}
                                </h3>
                                <button
                                    onClick={() => setShowDrawer(false)}
                                    className="w-8 h-8 flex items-center justify-center rounded-[5px] hover:bg-gray-100 text-gray-500 transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-6 py-5">
                                {error && (
                                    <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-[5px] flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        {error}
                                    </div>
                                )}
                                
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <User className="w-3.5 h-3.5 inline mr-1" />
                                            Customer Name
                                        </label>
                                        <input
                                            type="text" required value={form.name}
                                            onChange={e => setForm({...form, name: e.target.value})}
                                            placeholder="Enter customer name"
                                            className="w-full border border-gray-200 rounded-[5px] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Mail className="w-3.5 h-3.5 inline mr-1" />
                                            Email
                                        </label>
                                        <input
                                            type="email" value={form.email}
                                            onChange={e => setForm({...form, email: e.target.value})}
                                            placeholder="customer@example.com"
                                            className="w-full border border-gray-200 rounded-[5px] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Phone className="w-3.5 h-3.5 inline mr-1" />
                                            Phone
                                        </label>
                                        <input
                                            type="text" value={form.phone}
                                            onChange={e => setForm({...form, phone: e.target.value})}
                                            placeholder="+1234567890"
                                            className="w-full border border-gray-200 rounded-[5px] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <MapPin className="w-3.5 h-3.5 inline mr-1" />
                                                City
                                            </label>
                                            <input
                                                type="text" value={form.city}
                                                onChange={e => setForm({...form, city: e.target.value})}
                                                placeholder="New York"
                                                className="w-full border border-gray-200 rounded-[5px] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Building2 className="w-3.5 h-3.5 inline mr-1" />
                                                Country
                                            </label>
                                            <input
                                                type="text" value={form.country}
                                                onChange={e => setForm({...form, country: e.target.value})}
                                                placeholder="United States"
                                                className="w-full border border-gray-200 rounded-[5px] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <MapPin className="w-3.5 h-3.5 inline mr-1" />
                                            Address
                                        </label>
                                        <textarea 
                                            rows="3" value={form.address} 
                                            onChange={e => setForm({...form, address: e.target.value})}
                                            placeholder="123 Main Street, Apt 4B"
                                            className="w-full border border-gray-200 rounded-[5px] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" 
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Status
                                        </label>
                                        <select 
                                            value={form.status} 
                                            onChange={e => setForm({...form, status: e.target.value})}
                                            className="w-full border border-gray-200 rounded-[5px] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                    
                                    <div className="flex gap-3 pt-4 pb-6">
                                        <button
                                            type="submit"
                                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-[5px] text-sm transition-all duration-200 shadow-md hover:shadow-lg"
                                        >
                                            {editing ? 'Update Customer' : 'Create Customer'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowDrawer(false)}
                                            className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-[5px] text-sm hover:bg-gray-50 transition-all duration-200"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes slide-in-right {
                    from {
                        transform: translateX(100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }
                .animate-slide-in-right {
                    animation: slide-in-right 0.3s ease-out;
                }
            `}</style>
        </div>
    )
}