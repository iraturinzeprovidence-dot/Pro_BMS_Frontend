import { useState, useEffect } from 'react'
import { purchasingApi } from '../../api/purchasingApi'

export default function Suppliers() {
    const [suppliers, setSuppliers] = useState([])
    const [search, setSearch]       = useState('')
    const [loading, setLoading]     = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing]     = useState(null)
    const [error, setError]         = useState('')
    const [form, setForm]           = useState({
        name: '', email: '', phone: '', address: '',
        city: '', country: '', contact_person: '', status: 'active',
    })

    const fetchSuppliers = async () => {
        setLoading(true)
        const r = await purchasingApi.getSuppliers({ search })
        setSuppliers(r.data)
        setLoading(false)
    }

    useEffect(() => { fetchSuppliers() }, [search])

    const openCreate = () => {
        setEditing(null)
        setForm({ name: '', email: '', phone: '', address: '', city: '', country: '', contact_person: '', status: 'active' })
        setError('')
        setShowModal(true)
    }

    const openEdit = (s) => {
        setEditing(s)
        setForm({
            name: s.name, email: s.email ?? '', phone: s.phone ?? '',
            address: s.address ?? '', city: s.city ?? '', country: s.country ?? '',
            contact_person: s.contact_person ?? '', status: s.status,
        })
        setError('')
        setShowModal(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            if (editing) {
                await purchasingApi.updateSupplier(editing.id, form)
            } else {
                await purchasingApi.createSupplier(form)
            }
            setShowModal(false)
            fetchSuppliers()
        } catch (err) {
            setError(err.response?.data?.message ?? 'Something went wrong')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this supplier?')) return
        await purchasingApi.deleteSupplier(id)
        fetchSuppliers()
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Suppliers</h2>
                    <p className="text-gray-500 text-sm mt-1">{suppliers.length} suppliers</p>
                </div>
                <button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg">
                    + Add Supplier
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
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Contact Person</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Orders</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Status</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan="7" className="text-center py-8 text-gray-400">Loading...</td></tr>
                        ) : suppliers.length === 0 ? (
                            <tr><td colSpan="7" className="text-center py-8 text-gray-400">No suppliers found</td></tr>
                        ) : suppliers.map((s) => (
                            <tr key={s.id} className="hover:bg-gray-50">
                                <td className="px-6 py-3 font-medium text-gray-800">{s.name}</td>
                                <td className="px-6 py-3 text-gray-500">{s.email ?? '—'}</td>
                                <td className="px-6 py-3 text-gray-500">{s.phone ?? '—'}</td>
                                <td className="px-6 py-3 text-gray-500">{s.contact_person ?? '—'}</td>
                                <td className="px-6 py-3 text-gray-500">{s.purchase_orders_count}</td>
                                <td className="px-6 py-3">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${s.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {s.status}
                                    </span>
                                </td>
                                <td className="px-6 py-3 flex gap-3">
                                    <button onClick={() => openEdit(s)} className="text-blue-600 hover:underline text-xs">Edit</button>
                                    <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:underline text-xs">Delete</button>
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
                            {editing ? 'Edit Supplier' : 'Add New Supplier'}
                        </h3>
                        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: 'Name',           key: 'name',           type: 'text',  required: true  },
                                    { label: 'Email',          key: 'email',          type: 'email', required: false },
                                    { label: 'Phone',          key: 'phone',          type: 'text',  required: false },
                                    { label: 'Contact Person', key: 'contact_person', type: 'text',  required: false },
                                    { label: 'City',           key: 'city',           type: 'text',  required: false },
                                    { label: 'Country',        key: 'country',        type: 'text',  required: false },
                                ].map(field => (
                                    <div key={field.key}>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                                        <input
                                            type={field.type}
                                            required={field.required}
                                            value={form[field.key]}
                                            onChange={e => setForm({...form, [field.key]: e.target.value})}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                ))}
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
                                    {editing ? 'Update Supplier' : 'Create Supplier'}
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