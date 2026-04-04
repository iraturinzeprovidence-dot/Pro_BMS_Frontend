import { useState, useEffect } from 'react'
import { salesApi } from '../../api/salesApi'

export default function Customers() {
    const [customers, setCustomers] = useState([])
    const [search, setSearch]       = useState('')
    const [loading, setLoading]     = useState(true)
    const [showModal, setShowModal] = useState(false)
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
        setShowModal(true)
    }

    const openEdit = (c) => {
        setEditing(c)
        setForm({
            name: c.name, email: c.email ?? '', phone: c.phone ?? '',
            address: c.address ?? '', city: c.city ?? '', country: c.country ?? '', status: c.status,
        })
        setError('')
        setShowModal(true)
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
            setShowModal(false)
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
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Customers</h2>
                    <p className="text-gray-500 text-sm mt-1">{customers.length} customers</p>
                </div>
                <button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg">
                    + Add Customer
                </button>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by name, email or phone..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-80 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Name</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Email</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Phone</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">City</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Orders</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Status</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan="7" className="text-center py-8 text-gray-400">Loading...</td></tr>
                        ) : customers.length === 0 ? (
                            <tr><td colSpan="7" className="text-center py-8 text-gray-400">No customers found</td></tr>
                        ) : customers.map((c) => (
                            <tr key={c.id} className="hover:bg-gray-50">
                                <td className="px-6 py-3 font-medium text-gray-800">{c.name}</td>
                                <td className="px-6 py-3 text-gray-500">{c.email ?? '—'}</td>
                                <td className="px-6 py-3 text-gray-500">{c.phone ?? '—'}</td>
                                <td className="px-6 py-3 text-gray-500">{c.city ?? '—'}</td>
                                <td className="px-6 py-3 text-gray-500">{c.orders_count}</td>
                                <td className="px-6 py-3">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {c.status}
                                    </span>
                                </td>
                                <td className="px-6 py-3 flex gap-3">
                                    <button onClick={() => openEdit(c)} className="text-blue-600 hover:underline text-xs">Edit</button>
                                    <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">
                            {editing ? 'Edit Customer' : 'Add New Customer'}
                        </h3>
                        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                    <input type="text" value={form.country} onChange={e => setForm({...form, country: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <textarea rows="2" value={form.address} onChange={e => setForm({...form, address: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm">
                                    {editing ? 'Update Customer' : 'Create Customer'}
                                </button>
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-300 text-gray-700 font-medium py-2 rounded-lg text-sm hover:bg-gray-50">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}