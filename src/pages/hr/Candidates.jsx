import { useState, useEffect } from 'react'
import { hrApi } from '../../api/hrApi'
import {
  Users,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  UserPlus,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  DollarSign,
  Building2,
  FileText,
  X,
  AlertCircle,
  User
} from 'lucide-react'

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

    const statusConfig = (s) => ({
        applied:     { color: 'bg-blue-100 text-blue-700', icon: Clock },
        reviewing:   { color: 'bg-yellow-100 text-yellow-700', icon: Clock },
        interviewed: { color: 'bg-purple-100 text-purple-700', icon: UserCheck },
        hired:       { color: 'bg-green-100 text-green-700', icon: CheckCircle },
        rejected:    { color: 'bg-red-100 text-red-700', icon: XCircle },
    }[s] ?? { color: 'bg-gray-100 text-gray-600', icon: Clock })

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
                            <h2 className="text-2xl font-bold text-black drop-shadow-lg">Candidates</h2>
                        </div>
                        <p className="text-gray-700 ml-10 drop-shadow-md font-medium">
                            {candidates.length} candidates total
                        </p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-base font-medium px-8 py-3 rounded-md transition-all duration-200 flex items-center gap-2 shadow-md"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Add Candidate
                    </button>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative md:w-96">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-white/80 backdrop-blur-md border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Candidates Table */}
                <div className="bg-white/80 backdrop-blur-md rounded-md border border-gray-200 shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-emerald-50/50">
                                <tr>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Name</th>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Email</th>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Position</th>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Status</th>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Applied</th>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-8 text-gray-500">
                                            <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                            Loading candidates...
                                        </td>
                                    </tr>
                                ) : candidates.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-8">
                                            <Users className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                                            <p className="text-gray-500 text-sm">No candidates found</p>
                                            <p className="text-gray-400 text-xs mt-1">Click "Add Candidate" to get started</p>
                                        </td>
                                    </tr>
                                ) : candidates.map((c) => {
                                    const status = statusConfig(c.status)
                                    const StatusIcon = status.icon
                                    return (
                                        <tr key={c.id} className="hover:bg-white/40 transition-colors">
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-gray-500" />
                                                    <span className="font-medium text-gray-800">{c.first_name} {c.last_name}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-1">
                                                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                                                    <span className="text-gray-600">{c.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-1">
                                                    <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                                                    <span className="text-gray-600">{c.job_position?.title ?? '—'}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 w-fit ${status.color}`}>
                                                    <StatusIcon className="w-3 h-3" />
                                                    {c.status}
                                                </span>
                                             </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                    <span className="text-gray-500">{new Date(c.created_at).toLocaleDateString()}</span>
                                                </div>
                                             </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-2">
                                                    {c.status !== 'hired' && c.status !== 'rejected' && (
                                                        <select
                                                            value={c.status}
                                                            onChange={e => handleStatusUpdate(c.id, e.target.value)}
                                                            className="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-600 bg-white/50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                                        >
                                                            <option value="applied">Applied</option>
                                                            <option value="reviewing">Reviewing</option>
                                                            <option value="interviewed">Interviewed</option>
                                                            <option value="rejected">Rejected</option>
                                                        </select>
                                                    )}
                                                    {c.status === 'interviewed' && (
                                                        <button 
                                                            onClick={() => openHire(c)} 
                                                            className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition"
                                                            title="Hire"
                                                        >
                                                            <UserPlus className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => handleDelete(c.id)} 
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

                {/* Add Candidate Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
                        <div className="bg-white/95 backdrop-blur-md rounded-md shadow-xl w-full max-w-lg mx-auto">
                            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200">
                                <h3 className="text-xl font-bold text-black">
                                    Add New Candidate
                                </h3>
                                <button 
                                    onClick={() => setShowModal(false)}
                                    className="p-2 rounded-md hover:bg-gray-100 transition"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                            
                            {error && (
                                <div className="mx-6 mt-5 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-md flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <User className="w-3.5 h-3.5 inline mr-1" />
                                            First Name
                                        </label>
                                        <input 
                                            type="text" required value={form.first_name} 
                                            onChange={e => setForm({...form, first_name: e.target.value})}
                                            className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <User className="w-3.5 h-3.5 inline mr-1" />
                                            Last Name
                                        </label>
                                        <input 
                                            type="text" required value={form.last_name} 
                                            onChange={e => setForm({...form, last_name: e.target.value})}
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
                                            <Phone className="w-3.5 h-3.5 inline mr-1" />
                                            Phone
                                        </label>
                                        <input 
                                            type="text" value={form.phone} 
                                            onChange={e => setForm({...form, phone: e.target.value})}
                                            className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" 
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Briefcase className="w-3.5 h-3.5 inline mr-1" />
                                            Job Position
                                        </label>
                                        <select 
                                            value={form.job_position_id} 
                                            onChange={e => setForm({...form, job_position_id: e.target.value})}
                                            className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                        >
                                            <option value="">No Position Selected</option>
                                            {jobs.filter(j => j.status === 'open').map(j => (
                                                <option key={j.id} value={j.id}>{j.title} — {j.department}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FileText className="w-3.5 h-3.5 inline mr-1" />
                                        Cover Letter
                                    </label>
                                    <textarea 
                                        rows="3" value={form.cover_letter} 
                                        onChange={e => setForm({...form, cover_letter: e.target.value})}
                                        className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" 
                                        placeholder="Optional cover letter..."
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="submit" className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2.5 rounded-md text-sm transition">
                                        Add Candidate
                                    </button>
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-md text-sm hover:bg-gray-50 transition">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Hire Modal */}
                {showHireModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
                        <div className="bg-white/95 backdrop-blur-md rounded-md shadow-xl w-full max-w-md mx-auto">
                            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200">
                                <h3 className="text-xl font-bold text-black">Hire Candidate</h3>
                                <button 
                                    onClick={() => setShowHireModal(false)}
                                    className="p-2 rounded-md hover:bg-gray-100 transition"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                            
                            <p className="px-6 pt-4 text-gray-600 text-sm">
                                Converting <span className="font-semibold text-black">{selected?.first_name} {selected?.last_name}</span> to employee
                            </p>
                            
                            {error && (
                                <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-md flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}
                            
                            <form onSubmit={handleHire} className="p-6 space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Building2 className="w-3.5 h-3.5 inline mr-1" />
                                            Department
                                        </label>
                                        <input 
                                            type="text" required value={hireForm.department} 
                                            onChange={e => setHireForm({...hireForm, department: e.target.value})}
                                            className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Briefcase className="w-3.5 h-3.5 inline mr-1" />
                                            Job Title
                                        </label>
                                        <input 
                                            type="text" required value={hireForm.job_title} 
                                            onChange={e => setHireForm({...hireForm, job_title: e.target.value})}
                                            className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <DollarSign className="w-3.5 h-3.5 inline mr-1" />
                                            Salary
                                        </label>
                                        <input 
                                            type="number" required min="0" value={hireForm.salary} 
                                            onChange={e => setHireForm({...hireForm, salary: e.target.value})}
                                            className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Calendar className="w-3.5 h-3.5 inline mr-1" />
                                            Hire Date
                                        </label>
                                        <input 
                                            type="date" required value={hireForm.hire_date} 
                                            onChange={e => setHireForm({...hireForm, hire_date: e.target.value})}
                                            className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" 
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="submit" className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2.5 rounded-md text-sm transition flex items-center justify-center gap-2">
                                        <UserCheck className="w-4 h-4" />
                                        Confirm Hire
                                    </button>
                                    <button type="button" onClick={() => setShowHireModal(false)} className="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-md text-sm hover:bg-gray-50 transition">
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