import { useState, useEffect } from 'react'
import { hrApi } from '../../api/hrApi'
import { pdfApi, downloadPdf } from '../../api/pdfApi'

export default function Employees() {
    const [pdfLoading, setPdfLoading] = useState(false)
    const [employees, setEmployees] = useState([])
    const [search, setSearch]       = useState('')
    const [loading, setLoading]     = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing]     = useState(null)
    const [error, setError]         = useState('')
    const [form, setForm]           = useState({
        first_name: '', last_name: '', email: '', phone: '',
        department: '', job_title: '', salary: '',
        hire_date: '', status: 'active', address: '',
    })

    const fetchEmployees = async () => {
        setLoading(true)
        const r = await hrApi.getEmployees({ search })
        setEmployees(r.data)
        setLoading(false)
    }

    useEffect(() => { fetchEmployees() }, [search])

    const openCreate = () => {
        setEditing(null)
        setForm({ first_name: '', last_name: '', email: '', phone: '', department: '', job_title: '', salary: '', hire_date: '', status: 'active', address: '' })
        setError('')
        setShowModal(true)
    }

    const openEdit = (e) => {
        setEditing(e)
        setForm({
            first_name: e.first_name, last_name: e.last_name,
            email: e.email, phone: e.phone ?? '',
            department: e.department, job_title: e.job_title,
            salary: e.salary, hire_date: e.hire_date,
            status: e.status, address: e.address ?? '',
        })
        setError('')
        setShowModal(true)
    }
    const handleExportPdf = async () => {
    setPdfLoading(true)
    try {
        const r = await pdfApi.exportEmployees()
        downloadPdf(r.data, 'employees-report.pdf')
    } catch (err) {
        alert('Failed to export PDF. Please try again.')
    } finally {
        setPdfLoading(false)
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
    const statusColor = (s) => ({
        active:     'bg-green-100 text-green-700',
        inactive:   'bg-gray-100 text-gray-600',
        terminated: 'bg-red-100 text-red-700',
    }[s] ?? 'bg-gray-100 text-gray-600')

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Employees</h2>
                    <p className="text-gray-500 text-sm mt-1">{employees.length} employees</p>
                </div>
<div className="flex gap-3">
    <button
        onClick={handleExportPdf}
        disabled={pdfLoading}
        className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-50"
    >
        {pdfLoading ? 'Generating...' : 'Export PDF'}
    </button>
    <button
        onClick={openCreate}
        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
    >
        + Add Employee
    </button>
</div>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by name, email or department..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-80 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Employee #</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Name</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Department</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Job Title</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Salary</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Status</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan="7" className="text-center py-8 text-gray-400">Loading...</td></tr>
                        ) : employees.length === 0 ? (
                            <tr><td colSpan="7" className="text-center py-8 text-gray-400">No employees found</td></tr>
                        ) : employees.map((e) => (
                            <tr key={e.id} className="hover:bg-gray-50">
                                <td className="px-6 py-3 text-gray-500 text-xs">{e.employee_number}</td>
                                <td className="px-6 py-3 font-medium text-gray-800">{e.first_name} {e.last_name}</td>
                                <td className="px-6 py-3 text-gray-500">{e.department}</td>
                                <td className="px-6 py-3 text-gray-500">{e.job_title}</td>
                                <td className="px-6 py-3 text-gray-800">${Number(e.salary).toLocaleString()}</td>
                                <td className="px-6 py-3">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(e.status)}`}>
                                        {e.status}
                                    </span>
                                </td>
                                <td className="px-6 py-3 flex gap-3">
                                    <button onClick={() => openEdit(e)} className="text-blue-600 hover:underline text-xs">Edit</button>
                                    <button onClick={() => handleDelete(e.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 max-h-screen overflow-y-auto">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">
                            {editing ? 'Edit Employee' : 'Add New Employee'}
                        </h3>
                        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: 'First Name', key: 'first_name', type: 'text',   required: true  },
                                    { label: 'Last Name',  key: 'last_name',  type: 'text',   required: true  },
                                    { label: 'Email',      key: 'email',      type: 'email',  required: true  },
                                    { label: 'Phone',      key: 'phone',      type: 'text',   required: false },
                                    { label: 'Department', key: 'department', type: 'text',   required: true  },
                                    { label: 'Job Title',  key: 'job_title',  type: 'text',   required: true  },
                                    { label: 'Salary',     key: 'salary',     type: 'number', required: true  },
                                    { label: 'Hire Date',  key: 'hire_date',  type: 'date',   required: true  },
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
                                        <option value="terminated">Terminated</option>
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
                                    {editing ? 'Update Employee' : 'Create Employee'}
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