import { useState, useEffect } from 'react'
import { usersApi } from '../../api/usersApi'

export default function UserManagement() {
    const [users, setUsers]         = useState([])
    const [stats, setStats]         = useState(null)
    const [search, setSearch]       = useState('')
    const [loading, setLoading]     = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing]     = useState(null)
    const [error, setError]         = useState('')
    const [form, setForm]           = useState({
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
        setShowModal(true)
    }

    const openEdit = (u) => {
        setEditing(u)
        setForm({ name: u.name, email: u.email, password: '', role: u.role?.name ?? 'employee' })
        setError('')
        setShowModal(true)
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
            setError(err.response?.data?.message ?? 'Something went wrong')
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

    const roleColor = (role) => ({
        admin:    'bg-blue-100 text-blue-700',
        manager:  'bg-green-100 text-green-700',
        employee: 'bg-gray-100 text-gray-600',
    }[role] ?? 'bg-gray-100 text-gray-600')

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage all system users and their roles</p>
                </div>
                <button
                    onClick={openCreate}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
                >
                    + Add User
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Total Users',    value: stats?.total_users    ?? 0 },
                    { label: 'Admins',         value: stats?.admin_users    ?? 0 },
                    { label: 'Managers',       value: stats?.manager_users  ?? 0 },
                    { label: 'Employees',      value: stats?.employee_users ?? 0 },
                ].map((card) => (
                    <div key={card.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <p className="text-xs text-gray-500">{card.label}</p>
                        <p className="text-2xl font-bold text-gray-800 mt-1">{card.value}</p>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-80 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Name</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Email</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Role</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Created</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan="5" className="text-center py-8 text-gray-400">Loading...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan="5" className="text-center py-8 text-gray-400">No users found</td></tr>
                        ) : users.map((u) => (
                            <tr key={u.id} className="hover:bg-gray-50">
                                <td className="px-6 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                                            {u.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-medium text-gray-800">{u.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-3 text-gray-500">{u.email}</td>
                                <td className="px-6 py-3">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${roleColor(u.role?.name)}`}>
                                        {u.role?.name ?? 'No role'}
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-gray-500">
                                    {new Date(u.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-3 flex gap-3">
                                    <button onClick={() => openEdit(u)} className="text-blue-600 hover:underline text-xs">Edit</button>
                                    <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">
                            {editing ? 'Edit User' : 'Add New User'}
                        </h3>
                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text" required value={form.name}
                                    onChange={e => setForm({...form, name: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email" required value={form.email}
                                    onChange={e => setForm({...form, email: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {editing ? 'New Password (leave blank to keep current)' : 'Password'}
                                </label>
                                <input
                                    type="password"
                                    required={!editing}
                                    value={form.password}
                                    onChange={e => setForm({...form, password: e.target.value})}
                                    placeholder={editing ? 'Leave blank to keep current' : 'Min 8 characters'}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select
                                    value={form.role}
                                    onChange={e => setForm({...form, role: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="manager">Manager</option>
                                    <option value="employee">Employee</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm">
                                    {editing ? 'Update User' : 'Create User'}
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