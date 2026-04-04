import { useState, useEffect } from 'react'
import { hrApi } from '../../api/hrApi'

export default function JobPositions() {
    const [jobs, setJobs]           = useState([])
    const [search, setSearch]       = useState('')
    const [loading, setLoading]     = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing]     = useState(null)
    const [error, setError]         = useState('')
    const [form, setForm]           = useState({
        title: '', department: '', description: '', requirements: '',
        type: 'full_time', status: 'open',
        salary_min: '', salary_max: '', deadline: '',
    })

    const fetchJobs = async () => {
        setLoading(true)
        const r = await hrApi.getJobPositions({ search })
        setJobs(r.data)
        setLoading(false)
    }

    useEffect(() => { fetchJobs() }, [search])

    const openCreate = () => {
        setEditing(null)
        setForm({ title: '', department: '', description: '', requirements: '', type: 'full_time', status: 'open', salary_min: '', salary_max: '', deadline: '' })
        setError('')
        setShowModal(true)
    }

    const openEdit = (j) => {
        setEditing(j)
        setForm({
            title: j.title, department: j.department,
            description: j.description ?? '', requirements: j.requirements ?? '',
            type: j.type, status: j.status,
            salary_min: j.salary_min ?? '', salary_max: j.salary_max ?? '',
            deadline: j.deadline ?? '',
        })
        setError('')
        setShowModal(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            if (editing) {
                await hrApi.updateJobPosition(editing.id, form)
            } else {
                await hrApi.createJobPosition(form)
            }
            setShowModal(false)
            fetchJobs()
        } catch (err) {
            setError(err.response?.data?.message ?? 'Something went wrong')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this job position?')) return
        await hrApi.deleteJobPosition(id)
        fetchJobs()
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Job Positions</h2>
                    <p className="text-gray-500 text-sm mt-1">{jobs.length} positions</p>
                </div>
                <button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg">
                    + Post Job
                </button>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by title or department..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-80 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                    <p className="text-gray-400 text-sm col-span-2 text-center py-8">Loading...</p>
                ) : jobs.length === 0 ? (
                    <p className="text-gray-400 text-sm col-span-2 text-center py-8">No job positions found</p>
                ) : jobs.map((j) => (
                    <div key={j.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-semibold text-gray-800">{j.title}</h3>
                                <p className="text-sm text-gray-500 mt-0.5">{j.department}</p>
                            </div>
                            <div className="flex gap-2 items-center">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${j.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                    {j.status}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-4 text-xs text-gray-500 mb-3">
                            <span>📋 {j.type.replace('_', ' ')}</span>
                            {j.salary_min && <span>💰 ${Number(j.salary_min).toLocaleString()} - ${Number(j.salary_max).toLocaleString()}</span>}
                            {j.deadline && <span>📅 {new Date(j.deadline).toLocaleDateString()}</span>}
                        </div>
                        <p className="text-xs text-blue-600 font-medium mb-4">{j.candidates_count} applicants</p>
                        <div className="flex gap-3">
                            <button onClick={() => openEdit(j)} className="text-blue-600 hover:underline text-xs">Edit</button>
                            <button onClick={() => handleDelete(j.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 max-h-screen overflow-y-auto">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">
                            {editing ? 'Edit Job Position' : 'Post New Job'}
                        </h3>
                        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                    <input type="text" required value={form.department} onChange={e => setForm({...form, department: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="full_time">Full Time</option>
                                        <option value="part_time">Part Time</option>
                                        <option value="contract">Contract</option>
                                        <option value="internship">Internship</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="open">Open</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Salary</label>
                                    <input type="number" min="0" value={form.salary_min} onChange={e => setForm({...form, salary_min: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Salary</label>
                                    <input type="number" min="0" value={form.salary_max} onChange={e => setForm({...form, salary_max: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                                    <input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea rows="2" value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                                <textarea rows="2" value={form.requirements} onChange={e => setForm({...form, requirements: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm">
                                    {editing ? 'Update Job' : 'Post Job'}
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