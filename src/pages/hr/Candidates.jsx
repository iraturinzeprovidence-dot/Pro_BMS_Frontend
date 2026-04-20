import { useState, useEffect } from 'react'
import { hrApi } from '../../api/hrApi'
import {
    User, Mail, Phone, Briefcase, FileText,
    Calendar, Eye, UserCheck, Trash2,
    Search, X, Building2, Plus, Download,
    Image, Award, CreditCard, CheckCircle
} from 'lucide-react'

const downloadBlob = (blob, filename) => {
    const url  = window.URL.createObjectURL(new Blob([blob]))
    const link = document.createElement('a')
    link.href  = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
}

export default function Candidates() {
    const [candidates, setCandidates]           = useState([])
    const [jobs, setJobs]                       = useState([])
    const [search, setSearch]                   = useState('')
    const [loading, setLoading]                 = useState(true)
    const [showDrawer, setShowDrawer]           = useState(false)
    const [showDetailDrawer, setShowDetailDrawer] = useState(false)
    const [showHireDrawer, setShowHireDrawer]   = useState(false)
    const [selected, setSelected]               = useState(null)
    const [viewing, setViewing]                 = useState(null)
    const [error, setError]                     = useState('')
    const [downloading, setDownloading]         = useState(null)
    const [form, setForm]                       = useState({
        first_name: '', last_name: '', email: '', phone: '',
        job_position_id: '', cover_letter: '',
        cv: null, certificate: null, id_document: null, passport_photo: null,
    })
    const [hireForm, setHireForm] = useState({
        department: '', job_title: '', salary: '', hire_date: '',
    })

    const fetchCandidates = async () => {
        setLoading(true)
        try {
            const r = await hrApi.getCandidates({ search })
            setCandidates(r.data)
        } catch (err) {
            console.error('Failed to fetch candidates:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { hrApi.getJobPositions({}).then(r => setJobs(r.data)) }, [])
    useEffect(() => { fetchCandidates() }, [search])

    const openCreate = () => {
        setForm({
            first_name: '', last_name: '', email: '', phone: '',
            job_position_id: '', cover_letter: '',
            cv: null, certificate: null, id_document: null, passport_photo: null,
        })
        setError('')
        setShowDrawer(true)
    }

    const openDetail = (c) => {
        setViewing(c)
        setShowDetailDrawer(true)
    }

    const openHire = (c) => {
        setSelected(c)
        setHireForm({
            department: '',
            job_title:  c.job_position?.title ?? c.jobPosition?.title ?? '',
            salary:     '',
            hire_date:  '',
        })
        setError('')
        setShowDetailDrawer(false)
        setShowHireDrawer(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            await hrApi.createCandidate({ ...form, status: 'applied' })
            setShowDrawer(false)
            fetchCandidates()
        } catch (err) {
            setError(err.response?.data?.message ?? 'Something went wrong')
        }
    }

    const handleStatusUpdate = async (id, status) => {
        try {
            await hrApi.updateCandidate(id, { status })
            fetchCandidates()
            if (viewing?.id === id) setViewing(prev => ({ ...prev, status }))
        } catch { alert('Failed to update status') }
    }

    const handleHire = async (e) => {
        e.preventDefault()
        setError('')
        try {
            await hrApi.hireCandidate(selected.id, hireForm)
            setShowHireDrawer(false)
            fetchCandidates()
        } catch (err) {
            setError(err.response?.data?.message ?? 'Something went wrong')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this candidate?')) return
        await hrApi.deleteCandidate(id)
        setShowDetailDrawer(false)
        fetchCandidates()
    }

    const handleDownload = async (type, candidateId, candidateName) => {
        setDownloading(type)
        try {
            let r, filename
            if (type === 'photo') {
                r        = await hrApi.downloadPassportPhoto(candidateId)
                filename = candidateName + '_Photo.jpg'
            } else {
                r        = await hrApi.downloadFile(candidateId, type)
                filename = candidateName + '_' + type.toUpperCase() + '.pdf'
            }
            downloadBlob(r.data, filename)
        } catch {
            alert('Failed to download file')
        } finally {
            setDownloading(null)
        }
    }

    const statusColor = (s) => ({
        applied:     'bg-blue-100 text-blue-700',
        reviewing:   'bg-yellow-100 text-yellow-700',
        interviewed: 'bg-purple-100 text-purple-700',
        hired:       'bg-green-100 text-green-700',
        rejected:    'bg-red-100 text-red-700',
    }[s] ?? 'bg-gray-100 text-gray-600')

    const statusOptions = ['applied', 'reviewing', 'interviewed', 'rejected']

    const getJobPosition = (c) => c.job_position ?? c.jobPosition ?? null

    const FileUploadField = ({ label, fieldKey, accept, icon: Icon, hint }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className={`border-2 border-dashed rounded-[5px] p-3 text-center transition cursor-pointer ${
                form[fieldKey] ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-blue-300'
            }`}>
                <input
                    type="file"
                    accept={accept}
                    onChange={e => setForm({ ...form, [fieldKey]: e.target.files[0] })}
                    className="hidden"
                    id={`upload-${fieldKey}`}
                />
                <label htmlFor={`upload-${fieldKey}`} className="cursor-pointer">
                    {form[fieldKey] ? (
                        <div className="flex items-center justify-center gap-2 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-xs font-medium truncate max-w-40">{form[fieldKey].name}</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <Icon className="w-6 h-6 text-gray-300 mb-1" />
                            <p className="text-xs text-gray-500">{hint}</p>
                        </div>
                    )}
                </label>
            </div>
        </div>
    )

    const DocumentDownloadButton = ({ label, type, icon: Icon, color, candidateId, candidateName, exists }) => {
        if (!exists) return (
            <div className="flex items-center gap-3 p-3 border border-dashed border-gray-200 rounded-[5px] opacity-50">
                <div className="w-9 h-9 bg-gray-100 rounded-[5px] flex items-center justify-center">
                    <Icon className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">{label}</p>
                    <p className="text-xs text-gray-400">Not uploaded</p>
                </div>
            </div>
        )

        return (
            <button
                onClick={() => handleDownload(type, candidateId, candidateName)}
                disabled={downloading === type}
                className={`flex items-center gap-3 w-full p-3 border rounded-[5px] transition ${color} disabled:opacity-50`}
            >
                <div className="w-9 h-9 rounded-[5px] flex items-center justify-center bg-white bg-opacity-60">
                    <Icon className="w-4 h-4" />
                </div>
                <div className="text-left flex-1">
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs opacity-75">
                        {downloading === type ? 'Downloading...' : 'Click to download'}
                    </p>
                </div>
                <Download className="w-4 h-4" />
            </button>
        )
    }

    return (
        <div className="relative min-h-screen w-full p-8"
            style={{
                backgroundImage: `url('/src/assets/istockphoto-1477198926-612x612.jpg')`,
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed'
            }}>
            {/* Dark green overlay */}
            <div className="absolute inset-0 bg-emerald-900/30 -m-8"></div>
            
            <div className="relative z-10">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <User className="w-7 h-7 text-emerald-800" />
                            <h2 className="text-2xl font-bold text-black drop-shadow-lg">Candidates</h2>
                        </div>
                        <p className="text-gray-700 ml-10 drop-shadow-md font-medium">
                            {candidates.length} total applications
                        </p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-base font-medium px-8 py-3 rounded-[5px] transition-all duration-200 flex items-center gap-2 shadow-md"
                    >
                        <Plus className="w-5 h-5" />
                        Add Candidate
                    </button>
                </div>

                {/* Status Summary */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                    {[
                        { label: 'Applied',     status: 'applied',     color: 'bg-blue-50 text-blue-700 border border-blue-100'      },
                        { label: 'Reviewing',   status: 'reviewing',   color: 'bg-yellow-50 text-yellow-700 border border-yellow-100' },
                        { label: 'Interviewed', status: 'interviewed', color: 'bg-purple-50 text-purple-700 border border-purple-100' },
                        { label: 'Hired',       status: 'hired',       color: 'bg-green-50 text-green-700 border border-green-100'   },
                        { label: 'Rejected',    status: 'rejected',    color: 'bg-red-50 text-red-700 border border-red-100'         },
                    ].map(s => (
                        <div key={s.status} className={`rounded-[5px] p-3 text-center ${s.color}`}>
                            <p className="text-2xl font-bold">{candidates.filter(c => c.status === s.status).length}</p>
                            <p className="text-xs font-medium mt-0.5">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Search */}
                <div className="mb-6 relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full md:w-80 border border-gray-200 rounded-[5px] pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/80 backdrop-blur-md"
                    />
                </div>

                {/* Candidates Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white/80 backdrop-blur-md rounded-[5px] border border-gray-200 p-5 animate-pulse">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                                        <div className="h-3 bg-gray-200 rounded w-48"></div>
                                    </div>
                                </div>
                                <div className="h-8 bg-gray-200 rounded w-full mt-4"></div>
                            </div>
                        ))}
                    </div>
                ) : candidates.length === 0 ? (
                    <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-[5px]">
                        <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-gray-500">No candidates found</p>
                        <p className="text-gray-400 text-xs mt-1">Click "Add Candidate" to get started</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {candidates.map((c) => {
                            const jobPos = getJobPosition(c)
                            const docs   = [c.cv_path, c.certificate_path, c.id_document_path, c.passport_photo_path].filter(Boolean)
                            return (
                                <div key={c.id} className="bg-white/80 backdrop-blur-md rounded-[5px] border border-gray-200 shadow-sm p-5 hover:border-emerald-300 hover:shadow-md transition flex flex-col">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            {c.passport_photo_path ? (
                                                <img
                                                    src={`http://localhost:8000/storage/${c.passport_photo_path}`}
                                                    alt="photo"
                                                    className="w-10 h-10 rounded-full object-cover border-2 border-emerald-100"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm flex-shrink-0">
                                                    {c.first_name?.charAt(0)?.toUpperCase()}
                                                    {c.last_name?.charAt(0)?.toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-gray-800 text-sm">{c.first_name} {c.last_name}</p>
                                                <p className="text-xs text-gray-500">{c.email}</p>
                                            </div>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-[5px] font-medium ${statusColor(c.status)}`}>
                                            {c.status}
                                        </span>
                                    </div>

                                    {jobPos && (
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1.5">
                                            <Briefcase className="w-3 h-3" />
                                            <span className="truncate">{jobPos.title} — {jobPos.department}</span>
                                        </div>
                                    )}

                                    {c.phone && (
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1.5">
                                            <Phone className="w-3 h-3" />
                                            <span>{c.phone}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                                        <Calendar className="w-3 h-3" />
                                        <span>Applied {new Date(c.created_at).toLocaleDateString()}</span>
                                    </div>

                                    {/* Documents Badge */}
                                    {docs.length > 0 && (
                                        <div className="flex gap-1 mb-3 flex-wrap">
                                            {c.cv_path            && <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-[5px] flex items-center gap-1"><FileText className="w-2.5 h-2.5" />CV</span>}
                                            {c.certificate_path   && <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-[5px] flex items-center gap-1"><Award className="w-2.5 h-2.5" />Cert</span>}
                                            {c.id_document_path   && <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-[5px] flex items-center gap-1"><CreditCard className="w-2.5 h-2.5" />ID</span>}
                                            {c.passport_photo_path && <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-[5px] flex items-center gap-1"><Image className="w-2.5 h-2.5" />Photo</span>}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                                        <button
                                            onClick={() => openDetail(c)}
                                            className="flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-800 font-medium bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-[5px] transition"
                                        >
                                            <Eye className="w-3 h-3" />
                                            View Details
                                        </button>
                                        <div className="flex items-center gap-2">
                                            {c.status !== 'hired' && c.status !== 'rejected' && (
                                                <select
                                                    value={c.status}
                                                    onChange={e => handleStatusUpdate(c.id, e.target.value)}
                                                    className="text-xs border border-gray-200 rounded-[5px] px-2 py-1 text-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white/50"
                                                >
                                                    {statusOptions.map(s => (
                                                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                                    ))}
                                                </select>
                                            )}
                                            {c.status === 'interviewed' && (
                                                <button
                                                    onClick={() => openHire(c)}
                                                    className="text-xs text-green-600 font-medium bg-green-50 hover:bg-green-100 px-2 py-1.5 rounded-[5px] transition"
                                                >
                                                    Hire
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* ===== RIGHT SIDE DRAWER - ADD CANDIDATE ===== */}
                {showDrawer && (
                    <div className="fixed inset-0 z-50 flex justify-end">
                        <div className="fixed inset-0 bg-black/40" onClick={() => setShowDrawer(false)} />
                        <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
                            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-white">
                                <h3 className="font-bold text-gray-800 text-xl flex items-center gap-2">
                                    <Plus className="w-6 h-6 text-emerald-600" />
                                    Add New Candidate
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
                                        {error}
                                    </div>
                                )}
                                
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                            <input type="text" required value={form.first_name}
                                                onChange={e => setForm({...form, first_name: e.target.value})}
                                                className="w-full border border-gray-200 rounded-[5px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                            <input type="text" required value={form.last_name}
                                                onChange={e => setForm({...form, last_name: e.target.value})}
                                                className="w-full border border-gray-200 rounded-[5px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input type="email" required value={form.email}
                                            onChange={e => setForm({...form, email: e.target.value})}
                                            className="w-full border border-gray-200 rounded-[5px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <input type="text" value={form.phone}
                                            onChange={e => setForm({...form, phone: e.target.value})}
                                            className="w-full border border-gray-200 rounded-[5px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Position</label>
                                        <select value={form.job_position_id}
                                            onChange={e => setForm({...form, job_position_id: e.target.value})}
                                            className="w-full border border-gray-200 rounded-[5px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50">
                                            <option value="">No Position Selected</option>
                                            {jobs.filter(j => j.status === 'open').map(j => (
                                                <option key={j.id} value={j.id}>{j.title} — {j.department}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Application Letter (Cover Letter)</label>
                                        <textarea rows="3" value={form.cover_letter}
                                            placeholder="Write your application letter here..."
                                            onChange={e => setForm({...form, cover_letter: e.target.value})}
                                            className="w-full border border-gray-200 rounded-[5px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" />
                                    </div>

                                    {/* Document Uploads */}
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 mb-3">Documents</p>
                                        <div className="space-y-3">
                                            <FileUploadField
                                                label="CV / Resume (PDF)"
                                                fieldKey="cv"
                                                accept=".pdf"
                                                icon={FileText}
                                                hint="Upload PDF, max 5MB"
                                            />
                                            <FileUploadField
                                                label="Academic Certificates (PDF)"
                                                fieldKey="certificate"
                                                accept=".pdf"
                                                icon={Award}
                                                hint="Upload PDF, max 5MB"
                                            />
                                            <FileUploadField
                                                label="ID Document"
                                                fieldKey="id_document"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                icon={CreditCard}
                                                hint="PDF or Image"
                                            />
                                            <FileUploadField
                                                label="Passport Photo"
                                                fieldKey="passport_photo"
                                                accept=".jpg,.jpeg,.png"
                                                icon={Image}
                                                hint="JPG or PNG, max 2MB"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-2 pb-6">
                                        <button type="submit"
                                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-[5px] text-sm transition-all duration-200 shadow-md hover:shadow-lg">
                                            Add Candidate
                                        </button>
                                        <button type="button" onClick={() => setShowDrawer(false)}
                                            className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-[5px] text-sm hover:bg-gray-50 transition-all duration-200">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* ===== RIGHT SIDE DRAWER - DETAIL MODAL ===== */}
                {showDetailDrawer && viewing !== null && (
                    <div className="fixed inset-0 z-50 flex justify-end">
                        <div className="fixed inset-0 bg-black/40" onClick={() => setShowDetailDrawer(false)} />
                        <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
                            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-white">
                                <h3 className="font-bold text-gray-800 text-xl flex items-center gap-2">
                                    <Eye className="w-6 h-6 text-emerald-600" />
                                    Candidate Details
                                </h3>
                                <button
                                    onClick={() => setShowDetailDrawer(false)}
                                    className="w-8 h-8 flex items-center justify-center rounded-[5px] hover:bg-gray-100 text-gray-500 transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-6 py-5">
                                {/* Header */}
                                <div className="flex items-center gap-4 p-4 rounded-[5px] bg-gray-50 mb-5">
                                    {viewing.passport_photo_path ? (
                                        <img
                                            src={`http://localhost:8000/storage/${viewing.passport_photo_path}`}
                                            alt="Passport"
                                            className="w-14 h-14 rounded-full object-cover border-4 border-white shadow-md flex-shrink-0"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xl flex-shrink-0">
                                            {viewing.first_name?.charAt(0)?.toUpperCase()}
                                            {viewing.last_name?.charAt(0)?.toUpperCase()}
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h4 className="text-lg font-bold text-gray-800">{viewing.first_name} {viewing.last_name}</h4>
                                        <p className="text-sm text-gray-500">{viewing.email}</p>
                                    </div>
                                    <span className={`text-xs px-3 py-1.5 rounded-[5px] font-medium ${statusColor(viewing.status)}`}>
                                        {viewing.status}
                                    </span>
                                </div>

                                {/* Contact */}
                                <div className="border border-gray-200 rounded-[5px] p-4 mb-5">
                                    <h5 className="text-sm font-semibold text-gray-700 mb-3">Contact Information</h5>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-[5px] bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                <Mail className="w-3.5 h-3.5 text-gray-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400">Email</p>
                                                <p className="text-sm font-medium text-gray-700">{viewing.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-[5px] bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                <Phone className="w-3.5 h-3.5 text-gray-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400">Phone</p>
                                                <p className="text-sm font-medium text-gray-700">{viewing.phone || '—'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-[5px] bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                <Calendar className="w-3.5 h-3.5 text-gray-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400">Applied On</p>
                                                <p className="text-sm font-medium text-gray-700">
                                                    {new Date(viewing.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Job Position */}
                                {(() => {
                                    const jp = getJobPosition(viewing)
                                    return jp ? (
                                        <div className="rounded-[5px] p-4 bg-blue-50 border border-blue-100 mb-5">
                                            <h5 className="text-sm font-semibold text-blue-700 mb-2 flex items-center gap-2">
                                                <Briefcase className="w-4 h-4" />
                                                Position Applied For
                                            </h5>
                                            <p className="font-bold text-gray-800">{jp.title}</p>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                                <Building2 className="w-3 h-3" />
                                                <span>{jp.department}</span>
                                            </div>
                                        </div>
                                    ) : null
                                })()}

                                {/* Cover Letter */}
                                <div className="mb-5">
                                    <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        Application Letter
                                    </h5>
                                    {viewing.cover_letter ? (
                                        <div className="border border-gray-200 rounded-[5px] p-4 bg-white/50">
                                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                                {viewing.cover_letter}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-gray-200 rounded-[5px] p-6 text-center">
                                            <p className="text-sm text-gray-400">No cover letter provided</p>
                                        </div>
                                    )}
                                </div>

                                {/* Documents */}
                                <div className="mb-5">
                                    <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <Download className="w-4 h-4" />
                                        Documents
                                    </h5>
                                    <div className="space-y-2">
                                        <DocumentDownloadButton
                                            label="CV / Resume"
                                            type="cv"
                                            icon={FileText}
                                            color="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                                            candidateId={viewing.id}
                                            candidateName={viewing.first_name + '_' + viewing.last_name}
                                            exists={!!viewing.cv_path}
                                        />
                                        <DocumentDownloadButton
                                            label="Academic Certificates"
                                            type="certificate"
                                            icon={Award}
                                            color="border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                                            candidateId={viewing.id}
                                            candidateName={viewing.first_name + '_' + viewing.last_name}
                                            exists={!!viewing.certificate_path}
                                        />
                                        <DocumentDownloadButton
                                            label="Identification Document (ID)"
                                            type="id"
                                            icon={CreditCard}
                                            color="border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                                            candidateId={viewing.id}
                                            candidateName={viewing.first_name + '_' + viewing.last_name}
                                            exists={!!viewing.id_document_path}
                                        />
                                        <DocumentDownloadButton
                                            label="Passport Photo"
                                            type="photo"
                                            icon={Image}
                                            color="border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100"
                                            candidateId={viewing.id}
                                            candidateName={viewing.first_name + '_' + viewing.last_name}
                                            exists={!!viewing.passport_photo_path}
                                        />
                                    </div>
                                </div>

                                {/* Status Update */}
                                {viewing.status !== 'hired' && (
                                    <div className="mb-5">
                                        <h5 className="text-sm font-semibold text-gray-700 mb-3">Update Status</h5>
                                        <div className="flex flex-wrap gap-2">
                                            {statusOptions.map(s => (
                                                <button
                                                    key={s}
                                                    onClick={() => handleStatusUpdate(viewing.id, s)}
                                                    className={`px-3 py-1.5 rounded-[5px] text-xs font-medium border transition ${
                                                        viewing.status === s
                                                            ? statusColor(s) + ' border-transparent'
                                                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-3 pt-2 pb-6">
                                    {viewing.status === 'interviewed' && (
                                        <button
                                            onClick={() => openHire(viewing)}
                                            className="flex items-center gap-2 flex-1 justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-[5px] text-sm transition shadow-md"
                                        >
                                            <UserCheck className="w-4 h-4" />
                                            Hire Candidate
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(viewing.id)}
                                        className="flex items-center gap-2 font-semibold py-3 px-4 rounded-[5px] text-sm border-2 border-red-200 text-red-500 hover:bg-red-50 transition"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ===== RIGHT SIDE DRAWER - HIRE MODAL ===== */}
                {showHireDrawer && selected && (
                    <div className="fixed inset-0 z-50 flex justify-end">
                        <div className="fixed inset-0 bg-black/40" onClick={() => setShowHireDrawer(false)} />
                        <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
                            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-white">
                                <h3 className="font-bold text-gray-800 text-xl flex items-center gap-2">
                                    <UserCheck className="w-6 h-6 text-emerald-600" />
                                    Hire Candidate
                                </h3>
                                <button
                                    onClick={() => setShowHireDrawer(false)}
                                    className="w-8 h-8 flex items-center justify-center rounded-[5px] hover:bg-gray-100 text-gray-500 transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-6 py-5">
                                <div className="flex items-center gap-3 p-4 rounded-[5px] bg-green-50 border border-green-200 mb-5">
                                    {selected.passport_photo_path ? (
                                        <img src={`http://localhost:8000/storage/${selected.passport_photo_path}`}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-green-200" alt="photo" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-base">
                                            {selected.first_name?.charAt(0)}{selected.last_name?.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-semibold text-green-800 text-sm">{selected.first_name} {selected.last_name}</p>
                                        <p className="text-green-600 text-xs">{selected.email}</p>
                                    </div>
                                </div>

                                {error && (
                                    <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-[5px] flex items-center gap-2">
                                        {error}
                                    </div>
                                )}
                                
                                <form onSubmit={handleHire} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Building2 className="w-3.5 h-3.5 inline mr-1" />
                                            Department
                                        </label>
                                        <input type="text" required value={hireForm.department}
                                            onChange={e => setHireForm({...hireForm, department: e.target.value})}
                                            className="w-full border border-gray-200 rounded-[5px] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Briefcase className="w-3.5 h-3.5 inline mr-1" />
                                            Job Title
                                        </label>
                                        <input type="text" required value={hireForm.job_title}
                                            onChange={e => setHireForm({...hireForm, job_title: e.target.value})}
                                            className="w-full border border-gray-200 rounded-[5px] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Salary (Frw)
                                        </label>
                                        <input type="number" required min="0" value={hireForm.salary}
                                            onChange={e => setHireForm({...hireForm, salary: e.target.value})}
                                            className="w-full border border-gray-200 rounded-[5px] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Calendar className="w-3.5 h-3.5 inline mr-1" />
                                            Hire Date
                                        </label>
                                        <input type="date" required value={hireForm.hire_date}
                                            onChange={e => setHireForm({...hireForm, hire_date: e.target.value})}
                                            className="w-full border border-gray-200 rounded-[5px] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" />
                                    </div>

                                    <div className="flex gap-3 pt-4 pb-6">
                                        <button type="submit"
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-[5px] text-sm transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                                            <UserCheck className="w-4 h-4" />
                                            Confirm Hire
                                        </button>
                                        <button type="button" onClick={() => setShowHireDrawer(false)}
                                            className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-[5px] text-sm hover:bg-gray-50 transition-all duration-200">
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