import { useState, useEffect } from 'react'
import { hrApi } from '../../api/hrApi'
import {
    User, Mail, Phone, Briefcase, FileText,
    Calendar, Eye, UserCheck,
    Trash2, Search, X, Building2, Users,
    PlusCircle, AlertCircle, CheckCircle
} from 'lucide-react'

export default function Candidates() {
    const [candidates, setCandidates]       = useState([])
    const [jobs, setJobs]                   = useState([])
    const [search, setSearch]               = useState('')
    const [loading, setLoading]             = useState(true)
    const [showModal, setShowModal]         = useState(false)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [showHireModal, setShowHireModal] = useState(false)
    const [selected, setSelected]           = useState(null)
    const [viewing, setViewing]             = useState(null)
    const [error, setError]                 = useState('')
    const [form, setForm]                   = useState({
        first_name: '', last_name: '', email: '',
        phone: '', job_position_id: '', cover_letter: '', status: 'applied',
    })
    const [hireForm, setHireForm] = useState({
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

    const openDetail = (candidate) => {
        setViewing(candidate)
        setShowDetailModal(true)
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
        if (viewing?.id === id) {
            setViewing(prev => ({ ...prev, status }))
        }
    }

    const openHire = (candidate) => {
        setSelected(candidate)
        setHireForm({
            department: '',
            job_title:  candidate.job_position?.title ?? '',
            salary:     '',
            hire_date:  '',
        })
        setError('')
        setShowHireModal(true)
        setShowDetailModal(false)
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
        if (showDetailModal) setShowDetailModal(false)
    }

    const statusConfig = (s) => ({
        applied:     { color: 'bg-blue-100 text-blue-700', icon: FileText },
        reviewing:   { color: 'bg-yellow-100 text-yellow-700', icon: Eye },
        interviewed: { color: 'bg-purple-100 text-purple-700', icon: UserCheck },
        hired:       { color: 'bg-green-100 text-green-700', icon: CheckCircle },
        rejected:    { color: 'bg-red-100 text-red-700', icon: X },
    }[s] ?? { color: 'bg-gray-100 text-gray-600', icon: FileText })

    const statusOptions = ['applied', 'reviewing', 'interviewed', 'rejected']

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
                            <h2 className="text-2xl font-bold text-black drop-shadow-lg">Candidates</h2>
                        </div>
                        <p className="text-gray-700 ml-10 drop-shadow-md font-medium">
                            {candidates.length} total applications
                        </p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-base font-medium px-6 py-3 rounded-md transition-all duration-200 flex items-center gap-2 shadow-md"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Add Candidate
                    </button>
                </div>

                {/* Status Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                    {[
                        { label: 'Applied',     status: 'applied',     color: 'bg-blue-50 text-blue-700 border-blue-200' },
                        { label: 'Reviewing',   status: 'reviewing',   color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
                        { label: 'Interviewed', status: 'interviewed', color: 'bg-purple-50 text-purple-700 border-purple-200' },
                        { label: 'Hired',       status: 'hired',       color: 'bg-green-50 text-green-700 border-green-200' },
                        { label: 'Rejected',    status: 'rejected',    color: 'bg-red-50 text-red-700 border-red-200' },
                    ].map(s => (
                        <div key={s.status} className={`rounded-md border p-3 text-center ${s.color}`}>
                            <p className="text-xl font-bold">
                                {candidates.filter(c => c.status === s.status).length}
                            </p>
                            <p className="text-xs font-medium mt-0.5">{s.label}</p>
                        </div>
                    ))}
                </div>

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

                {/* Cards Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white/80 backdrop-blur-md rounded-md border border-gray-200 p-5 animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-48 mb-4"></div>
                                <div className="h-3 bg-gray-200 rounded w-24"></div>
                            </div>
                        ))}
                    </div>
                ) : candidates.length === 0 ? (
                    <div className="text-center py-16 text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <p>No candidates found</p>
                        <p className="text-xs mt-1 text-gray-400">Click "Add Candidate" to get started</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {candidates.map((c) => {
                            const status = statusConfig(c.status)
                            const StatusIcon = status.icon
                            return (
                                <div key={c.id} className="bg-white/80 backdrop-blur-md rounded-md border border-gray-200 shadow-sm p-5 hover:border-emerald-300 transition-all duration-200">
                                    {/* Top row */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                                                {c.first_name?.charAt(0)}{c.last_name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800 text-sm">
                                                    {c.first_name} {c.last_name}
                                                </p>
                                                <p className="text-xs text-gray-500">{c.email}</p>
                                            </div>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 ${status.color}`}>
                                            <StatusIcon className="w-3 h-3" />
                                            {c.status}
                                        </span>
                                    </div>

                                    {/* Position */}
                                    {c.job_position && (
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                            <Briefcase className="w-3 h-3" />
                                            <span>{c.job_position.title} — {c.job_position.department}</span>
                                        </div>
                                    )}

                                    {/* Phone */}
                                    {c.phone && (
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                            <Phone className="w-3 h-3" />
                                            <span>{c.phone}</span>
                                        </div>
                                    )}

                                    {/* Applied date */}
                                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                                        <Calendar className="w-3 h-3" />
                                        <span>Applied {new Date(c.created_at).toLocaleDateString()}</span>
                                    </div>

                                    {/* Cover letter preview */}
                                    {c.cover_letter && (
                                        <div className="bg-emerald-50 rounded-md p-3 mb-4 border border-emerald-100">
                                            <p className="text-xs text-emerald-700 font-medium mb-1">Cover Letter</p>
                                            <p className="text-xs text-gray-600 line-clamp-2">{c.cover_letter}</p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                        <button
                                            onClick={() => openDetail(c)}
                                            className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                                        >
                                            <Eye className="w-3 h-3" />
                                            View Details
                                        </button>

                                        {c.status !== 'hired' && c.status !== 'rejected' && (
                                            <select
                                                value={c.status}
                                                onChange={e => handleStatusUpdate(c.id, e.target.value)}
                                                className="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-400 bg-white/50"
                                            >
                                                {statusOptions.map(s => (
                                                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                                ))}
                                            </select>
                                        )}

                                        {c.status === 'interviewed' && (
                                            <button
                                                onClick={() => openHire(c)}
                                                className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 font-medium"
                                            >
                                                <UserCheck className="w-3 h-3" />
                                                Hire
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

{/* Full Application Detail Modal */}
{showDetailModal && viewing && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="sticky top-0 bg-white flex items-center justify-between px-8 py-5 border-b border-gray-100 rounded-t-2xl z-10">
                <h3 className="text-lg font-bold text-gray-800">Full Application Details</h3>
                <button
                    onClick={() => setShowDetailModal(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="px-8 py-6 space-y-5">

                {/* Applicant Header */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg flex-shrink-0">
                        {viewing.first_name?.charAt(0)?.toUpperCase()}
                        {viewing.last_name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-800">
                            {viewing.first_name} {viewing.last_name}
                        </h4>
                        <p className="text-sm text-gray-500">{viewing.email}</p>
                    </div>
                    <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${statusColor(viewing.status)}`}>
                        {viewing.status}
                    </span>
                </div>

                {/* Contact Info */}
                <div className="border border-gray-100 rounded-xl p-4">
                    <h5 className="text-sm font-semibold text-gray-700 mb-3">Contact Information</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Mail className="w-4 h-4 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Email</p>
                                <p className="text-sm font-medium text-gray-700">{viewing.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Phone className="w-4 h-4 text-green-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Phone</p>
                                <p className="text-sm font-medium text-gray-700">{viewing.phone ?? '—'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-4 h-4 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Applied On</p>
                                <p className="text-sm font-medium text-gray-700">
                                    {new Date(viewing.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'long', day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Briefcase className="w-4 h-4 text-orange-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Current Status</p>
                                <p className="text-sm font-medium text-gray-700 capitalize">{viewing.status}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Position Applied For */}
                <div className="border border-blue-100 bg-blue-50 rounded-xl p-4">
                    <h5 className="text-sm font-semibold text-blue-700 mb-3 flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Position Applied For
                    </h5>
                    {viewing.job_position ? (
                        <div className="space-y-1">
                            <p className="font-bold text-gray-800">{viewing.job_position.title}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Building2 className="w-3 h-3" />
                                <span>{viewing.job_position.department}</span>
                            </div>
                            <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                {viewing.job_position.type?.replace('_', ' ')}
                            </span>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No specific position selected</p>
                    )}
                </div>

                {/* Cover Letter */}
                <div>
                    <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        Cover Letter
                    </h5>
                    {viewing.cover_letter ? (
                        <div className="border border-gray-200 rounded-xl p-5 bg-white">
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {viewing.cover_letter}
                            </p>
                        </div>
                    ) : (
                        <div className="border border-dashed border-gray-200 rounded-xl p-6 text-center">
                            <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-sm text-gray-400">No cover letter provided</p>
                        </div>
                    )}
                </div>

                {/* Update Status */}
                {viewing.status !== 'hired' && (
                    <div>
                        <h5 className="text-sm font-semibold text-gray-700 mb-3">Update Application Status</h5>
                        <div className="flex flex-wrap gap-2">
                            {statusOptions.map(s => (
                                <button
                                    key={s}
                                    onClick={() => handleStatusUpdate(viewing.id, s)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                                        viewing.status === s
                                            ? statusColor(s) + ' border-transparent shadow-sm'
                                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2 border-t border-gray-100">
                    {viewing.status === 'interviewed' && (
                        <button
                            onClick={() => openHire(viewing)}
                            className="flex items-center gap-2 flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-xl text-sm justify-center transition"
                        >
                            <UserCheck className="w-4 h-4" />
                            Hire This Candidate
                        </button>
                    )}
                    <button
                        onClick={() => handleDelete(viewing.id)}
                        className="flex items-center gap-2 border border-red-200 text-red-500 hover:bg-red-50 font-medium py-2.5 px-4 rounded-xl text-sm transition"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                    <button
                        onClick={() => setShowDetailModal(false)}
                        className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium py-2.5 rounded-xl text-sm transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
)}

                {/* Add Candidate Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
                        <div className="bg-white/95 backdrop-blur-md rounded-md shadow-xl w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur-md">
                                <h3 className="text-xl font-bold text-black">Add New Candidate</h3>
                                <button onClick={() => setShowModal(false)} className="p-2 rounded-md hover:bg-gray-100 transition">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                            {error && (
                                <div className="mx-6 mt-5 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-md flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                                        <input type="text" required value={form.first_name}
                                            onChange={e => setForm({...form, first_name: e.target.value})}
                                            className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                                        <input type="text" required value={form.last_name}
                                            onChange={e => setForm({...form, last_name: e.target.value})}
                                            className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                                        <input type="email" required value={form.email}
                                            onChange={e => setForm({...form, email: e.target.value})}
                                            className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                                        <input type="text" value={form.phone}
                                            onChange={e => setForm({...form, phone: e.target.value})}
                                            className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Position</label>
                                        <select value={form.job_position_id}
                                            onChange={e => setForm({...form, job_position_id: e.target.value})}
                                            className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50">
                                            <option value="">No Position Selected</option>
                                            {jobs.filter(j => j.status === 'open').map(j => (
                                                <option key={j.id} value={j.id}>{j.title} — {j.department}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Cover Letter</label>
                                    <textarea rows="4" value={form.cover_letter}
                                        placeholder="Candidate's cover letter or notes..."
                                        onChange={e => setForm({...form, cover_letter: e.target.value})}
                                        className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button type="submit"
                                        className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2.5 rounded-md text-sm transition">
                                        Add Candidate
                                    </button>
                                    <button type="button" onClick={() => setShowModal(false)}
                                        className="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-md text-sm hover:bg-gray-50 transition">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Hire Modal */}
                {showHireModal && selected && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
                        <div className="bg-white/95 backdrop-blur-md rounded-md shadow-xl w-full max-w-md mx-auto">
                            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200">
                                <h3 className="text-xl font-bold text-black">Hire Candidate</h3>
                                <button onClick={() => setShowHireModal(false)} className="p-2 rounded-md hover:bg-gray-100 transition">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                            <div className="mx-6 mt-5 bg-emerald-50 rounded-md p-3 border border-emerald-200">
                                <p className="text-emerald-800 text-sm font-medium">
                                    {selected.first_name} {selected.last_name}
                                </p>
                                <p className="text-emerald-600 text-xs mt-0.5">{selected.email}</p>
                            </div>
                            {error && (
                                <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-md flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleHire} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Department</label>
                                        <input type="text" required value={hireForm.department}
                                            onChange={e => setHireForm({...hireForm, department: e.target.value})}
                                            className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Title</label>
                                        <input type="text" required value={hireForm.job_title}
                                            onChange={e => setHireForm({...hireForm, job_title: e.target.value})}
                                            className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Salary</label>
                                        <input type="number" required min="0" value={hireForm.salary}
                                            onChange={e => setHireForm({...hireForm, salary: e.target.value})}
                                            className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Hire Date</label>
                                        <input type="date" required value={hireForm.hire_date}
                                            onChange={e => setHireForm({...hireForm, hire_date: e.target.value})}
                                            className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" />
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button type="submit"
                                        className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2.5 rounded-md text-sm transition flex items-center justify-center gap-2">
                                        <CheckCircle className="w-4 h-4" />
                                        Confirm Hire
                                    </button>
                                    <button type="button" onClick={() => setShowHireModal(false)}
                                        className="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-md text-sm hover:bg-gray-50 transition">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}