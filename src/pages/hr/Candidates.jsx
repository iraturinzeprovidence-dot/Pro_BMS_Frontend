import { useState, useEffect } from 'react'
import { hrApi } from '../../api/hrApi'

export default function Candidates() {
    const [candidates, setCandidates] = useState([])
    const [jobs, setJobs]             = useState([])
    const [search, setSearch]         = useState('')
    const [loading, setLoading]       = useState(true)
    const [showModal, setShowModal]   = useState(false)
    const [showHireModal, setShowHireModal] = useState(false)
    const [selected, setSelected]     = useState(null)
    const [error, setError]           = useState('')
    const [form, setForm]             = useState({
        first_name: '', last_name: '', email: '',
        phone: '', job_position_id: '', cover_letter: '', status: 'applied',
    })
    const [hireForm, setHireForm]     = useState({
        department: '', job_title: '', salary: '', hire_date: '',
    })

    const fetchCandidates = async () => {
        setLoading(true)
        const r = await hrApi.getCandidates({ search })
        setCandidates(r.data)
        setLoading(false)
    }

    useEffect(() => {
        hrApi.getJobPositions({}).then(r => setJobs(r.data))
    }, [])

    useEffect(() => { fetchCandidates() }, [search])

    const openCreate = () => {
        setSelected(null)
        setForm({ first_name: '', last_name: '', email: '', phone: '', job_position_id: '', cover_letter: '', status: 'applied' })
        setError('')
        setShowModal(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            await hrApi.createCandidate(form)
            setShowModal(false)
            fetchCandidates()
        } catch (err) {
            setError(err.response?.data?.message ?? 'Something went wrong')
        }
    }

    const handleStatusUpdate = async (id, status) => {
        await hrApi.updateCandidate(id, { status })
        fetchCandidates()
    }

    const openHire = (candidate) => {
        setSelected(candidate)
        setHireForm({ department: '', job_title: candidate.jobPosition?.title ?? '', salary: '', hire_date: '' })
        setError('')
        setShowHireModal(true)
    }

    const handleHire = async (e) => {
        e.preventDefault()
        setError('')
        try {
            await hrApi.hireCandidate(selected.id, hireForm)
            setShowHireModal(false)
            fetchCandidates()
        } catch (err) {
            setError(err.response?.data?.message ?? 'Something went wrong')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this candidate?')) return
        await hrApi.deleteCandidate(id)
        fetchCandidates()
    }

    const statusColor = (s) => ({
        applied:     'bg-blue-100 text-blue-700',
        reviewing:   'bg-yellow-100 text-yellow-700',
        interviewed: 'bg-purple-100 text-purple-700',
        hired:       'bg-green-100 text-green-700',
        rejected:    'bg-red-100 text-red-700',
    }[s] ?? 'bg-gray-100 text-gray-600')

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Candidates</h2>
                    <p className="text-gray-500 text-sm mt-1">{candidates.length} candidates</p>
                </div>
                <button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg">
                    + Add Candidate
                </button>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by name or email..."
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
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Position</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Status</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Applied</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan="6" className="text-center py-8 text-gray-400">Loading...</td></tr>
                        ) : candidates.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-8 text-gray-400">No candidates found</td></tr>
                        ) : candidates.map((c) => (
                            <tr key={c.id} className="hover:bg-gray-50">
                                <td className="px-6 py-3 font-medium text-gray-800">{c.first_name} {c.last_name}</td>
                                <td className="px-6 py-3 text-gray-500">{c.email}</td>
                                <td className="px-6 py-3 text-gray-500">{c.job_position?.title ?? '—'}</td>
                                <td className="px-6 py-3">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(c.status)}`}>
                                        {c.status}
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-gray-500">{new Date(c.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-3 flex gap-2">
                                    {c.status !== 'hired' && c.status !== 'rejected' && (
                                        <select
                                            value={c.status}
                                            onChange={e => handleStatusUpdate(c.id, e.target.value)}
                                            className="text-xs border border-gray-200 rounded px-1 py-0.5 text-gray-600"
                                        >
                                            <option value="applied">Applied</option>
                                            <option value="reviewing">Reviewing</option>
                                            <option value="interviewed">Interviewed</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    )}
                                    {c.status === 'interviewed' && (
                                        <button onClick={() => openHire(c)} className="text-green-600 hover:underline text-xs font-medium">
                                            Hire
                                        </button>
                                    )}
                                    <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Candidate Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Add New Candidate</h3>
                        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                    <input type="text" required value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <input type="text" required value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Position</label>
                                    <select value={form.job_position_id} onChange={e => setForm({...form, job_position_id: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">No Position Selected</option>
                                        {jobs.filter(j => j.status === 'open').map(j => (
                                            <option key={j.id} value={j.id}>{j.title} — {j.department}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
                                <textarea rows="3" value={form.cover_letter} onChange={e => setForm({...form, cover_letter: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm">
                                    Add Candidate
                                </button>
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-300 text-gray-700 font-medium py-2 rounded-lg text-sm hover:bg-gray-50">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Hire Modal */}
            {showHireModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Hire Candidate</h3>
                        <p className="text-gray-500 text-sm mb-6">Converting {selected?.first_name} {selected?.last_name} to employee</p>
                        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}
                        <form onSubmit={handleHire} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                    <input type="text" required value={hireForm.department} onChange={e => setHireForm({...hireForm, department: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                                    <input type="text" required value={hireForm.job_title} onChange={e => setHireForm({...hireForm, job_title: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                                    <input type="number" required min="0" value={hireForm.salary} onChange={e => setHireForm({...hireForm, salary: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date</label>
                                    <input type="date" required value={hireForm.hire_date} onChange={e => setHireForm({...hireForm, hire_date: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg text-sm">
                                    Confirm Hire
                                </button>
                                <button type="button" onClick={() => setShowHireModal(false)} className="flex-1 border border-gray-300 text-gray-700 font-medium py-2 rounded-lg text-sm hover:bg-gray-50">
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