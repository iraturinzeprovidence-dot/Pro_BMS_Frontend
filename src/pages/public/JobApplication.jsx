import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Briefcase,
  CheckCircle,
  AlertCircle,
  Send,
  ArrowLeft,
  FileText,
  Award,
  CreditCard,
  Image,
  X,
  Plus,
  Eye,
  Download
} from 'lucide-react'

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
})

export default function JobApplication() {
    const [jobs, setJobs]           = useState([])
    const [selected, setSelected]   = useState(null)
    const [success, setSuccess]     = useState('')
    const [error, setError]         = useState('')
    const [loading, setLoading]     = useState(false)
    const [showDrawer, setShowDrawer] = useState(false)
    const [form, setForm]           = useState({
        first_name: '', last_name: '', email: '',
        phone: '', cover_letter: '',
        cv: null, certificate: null, id_document: null, passport_photo: null,
    })

    useEffect(() => {
        api.get('/public/jobs').then(r => setJobs(r.data))
    }, [])

    const openApplication = (job) => {
        setSelected(job)
        setForm({
            first_name: '', last_name: '', email: '', phone: '', cover_letter: '',
            cv: null, certificate: null, id_document: null, passport_photo: null,
        })
        setError('')
        setShowDrawer(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('job_position_id', selected.id)
            formData.append('first_name',      form.first_name)
            formData.append('last_name',       form.last_name)
            formData.append('email',           form.email)
            formData.append('phone',           form.phone)
            formData.append('cover_letter',    form.cover_letter)
            if (form.cv)             formData.append('cv',             form.cv)
            if (form.certificate)    formData.append('certificate',    form.certificate)
            if (form.id_document)    formData.append('id_document',    form.id_document)
            if (form.passport_photo) formData.append('passport_photo', form.passport_photo)

            const r = await axios.post(
                'http://localhost:8000/api/public/apply',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data', 'Accept': 'application/json' } }
            )
            setSuccess(r.data.message)
            setForm({ first_name: '', last_name: '', email: '', phone: '', cover_letter: '', cv: null, certificate: null, id_document: null, passport_photo: null })
            setShowDrawer(false)
            setSelected(null)
        } catch (err) {
            setError(err.response?.data?.message ?? 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div 
                className="relative min-h-screen w-full flex items-center justify-center"
                style={{
                    backgroundImage: `url('/src/assets/istockphoto-1477198926-612x612.jpg')`,
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed'
                }}
            >
                <div className="absolute inset-0 bg-emerald-900/30"></div>
                <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-[5px] shadow-xl w-full max-w-md mx-4">
                    <div className="p-8">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-emerald-700" />
                        </div>
                        <h2 className="text-2xl font-bold text-black text-center mb-2">Application Submitted!</h2>
                        <p className="text-gray-600 text-center mb-2">{success}</p>
                        <p className="text-gray-500 text-center text-sm mb-6">We will review your application and contact you soon.</p>
                        <div className="flex justify-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-6 py-2.5 rounded-[5px] transition w-auto min-w-[160px]"
                            >
                                Browse More Jobs
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div 
            className="relative min-h-screen w-full flex items-center justify-center"
            style={{
                backgroundImage: `url('/src/assets/istockphoto-1477198926-612x612.jpg')`,
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed'
            }}
        >
            <div className="absolute inset-0 bg-emerald-900/30"></div>
            
            <div className="relative z-10 w-full max-w-4xl mx-auto px-4">
                <div className="bg-white/95 backdrop-blur-md rounded-[5px] shadow-xl">
                    <div className="p-8">
                        {/* Icon on top center */}
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                                <Briefcase className="w-8 h-8 text-emerald-700" />
                            </div>
                        </div>
                        
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-black mb-1">Open Positions</h2>
                            <p className="text-gray-600 text-sm">Find your next opportunity and apply today</p>
                        </div>

                        {/* Login/Register Links */}
                        <div className="flex justify-center gap-4 mb-6">
                            <a href="/login" className="text-sm text-emerald-700 hover:text-emerald-800 font-medium transition">
                                Customer Login
                            </a>
                            <span className="text-gray-300">|</span>
                            <a href="/register" className="text-sm text-emerald-700 hover:text-emerald-800 font-medium transition">
                                Customer Register
                            </a>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-[5px] flex items-center gap-2 mb-6">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {jobs.length === 0 ? (
                                <div className="col-span-2 text-center py-12">
                                    <p className="text-gray-500">No open positions at the moment</p>
                                    <p className="text-gray-400 text-sm mt-1">Please check back later</p>
                                </div>
                            ) : jobs.map(job => (
                                <div key={job.id} className="bg-white/80 backdrop-blur-sm rounded-[5px] border border-gray-200 p-5 hover:shadow-lg transition-all duration-200 hover:border-emerald-300">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-bold text-black text-lg mb-1">{job.title}</h3>
                                            <p className="text-sm text-gray-600">{job.department}</p>
                                        </div>
                                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-[5px] font-medium">
                                            Open
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-4">
                                        <span className="bg-gray-100 px-2 py-1 rounded-[5px]">
                                            {job.type.replace('_', ' ')}
                                        </span>
                                        {job.salary_min && (
                                            <span className="bg-gray-100 px-2 py-1 rounded-[5px]">
                                                {Number(job.salary_min).toLocaleString()} — {Number(job.salary_max).toLocaleString()} Frw
                                            </span>
                                        )}
                                        {job.deadline && (
                                            <span className="bg-gray-100 px-2 py-1 rounded-[5px]">
                                                Deadline: {new Date(job.deadline).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>

                                    {job.description && (
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{job.description}</p>
                                    )}

                                    <button
                                        onClick={() => openApplication(job)}
                                        className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2 rounded-[5px] text-sm transition"
                                    >
                                        Apply Now
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== RIGHT SIDE DRAWER - APPLICATION FORM ===== */}
            {showDrawer && selected && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="fixed inset-0 bg-black/40" onClick={() => setShowDrawer(false)} />
                    <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-white">
                            <h3 className="font-bold text-gray-800 text-xl flex items-center gap-2">
                                <Briefcase className="w-6 h-6 text-emerald-600" />
                                Apply for Position
                            </h3>
                            <button
                                onClick={() => setShowDrawer(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-[5px] hover:bg-gray-100 text-gray-500 transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-5">
                            {/* Job Info */}
                            <div className="bg-emerald-50 rounded-[5px] p-4 mb-5 border border-emerald-200">
                                <h3 className="font-bold text-emerald-800 text-base mb-1">{selected.title}</h3>
                                <p className="text-emerald-700 text-sm">
                                    {selected.department} • {selected.type?.replace('_', ' ')}
                                </p>
                            </div>

                            <h3 className="font-bold text-gray-800 text-base mb-4">Your Application</h3>

                            {error && (
                                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-[5px] flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            First Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text" required value={form.first_name}
                                            onChange={e => setForm({...form, first_name: e.target.value})}
                                            className="w-full border border-gray-200 rounded-[5px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Last Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text" required value={form.last_name}
                                            onChange={e => setForm({...form, last_name: e.target.value})}
                                            className="w-full border border-gray-200 rounded-[5px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email" required value={form.email}
                                        onChange={e => setForm({...form, email: e.target.value})}
                                        className="w-full border border-gray-200 rounded-[5px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text" required value={form.phone}
                                        onChange={e => setForm({...form, phone: e.target.value})}
                                        className="w-full border border-gray-200 rounded-[5px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Cover Letter
                                    </label>
                                    <textarea
                                        rows="4" value={form.cover_letter}
                                        onChange={e => setForm({...form, cover_letter: e.target.value})}
                                        placeholder="Tell us why you are the right candidate for this position..."
                                        className="w-full border border-gray-200 rounded-[5px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                    />
                                </div>

                                {/* Documents Section */}
                                <div className="border-t border-gray-100 pt-4">
                                    <p className="text-sm font-semibold text-gray-700 mb-3">Required Documents</p>
                                    <div className="space-y-3">
                                        {[
                                            { label: 'CV / Resume',           key: 'cv',             accept: '.pdf',                  required: true,  hint: 'PDF only, max 5MB', icon: FileText },
                                            { label: 'Academic Certificates', key: 'certificate',    accept: '.pdf',                  required: false, hint: 'PDF only, max 5MB', icon: Award },
                                            { label: 'ID Document',           key: 'id_document',    accept: '.pdf,.jpg,.jpeg,.png',  required: true,  hint: 'PDF or Image', icon: CreditCard },
                                            { label: 'Passport Photo',        key: 'passport_photo', accept: '.jpg,.jpeg,.png',       required: true,  hint: 'JPG/PNG, max 2MB', icon: Image },
                                        ].map(doc => {
                                            const Icon = doc.icon
                                            return (
                                                <div key={doc.key}>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        {doc.label}
                                                        {doc.required && <span className="text-red-500 ml-1">*</span>}
                                                    </label>
                                                    <div className={`border-2 border-dashed rounded-[5px] p-3 transition cursor-pointer ${
                                                        form[doc.key] ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-emerald-300'
                                                    }`}>
                                                        <input
                                                            type="file"
                                                            accept={doc.accept}
                                                            onChange={e => setForm({...form, [doc.key]: e.target.files[0]})}
                                                            className="hidden"
                                                            id={`job-${doc.key}`}
                                                        />
                                                        <label htmlFor={`job-${doc.key}`} className="flex items-center gap-3 cursor-pointer">
                                                            {form[doc.key] ? (
                                                                <>
                                                                    <div className="w-8 h-8 bg-green-100 rounded-[5px] flex items-center justify-center">
                                                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                                                    </div>
                                                                    <p className="text-sm text-green-700 font-medium truncate flex-1">{form[doc.key].name}</p>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <div className="w-8 h-8 bg-gray-100 rounded-[5px] flex items-center justify-center text-gray-400">
                                                                        <Icon className="w-4 h-4" />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <p className="text-sm text-gray-600">Upload {doc.label}</p>
                                                                        <p className="text-xs text-gray-400">{doc.hint}</p>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </label>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4 pb-6">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-[5px] text-sm transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        <Send className="w-4 h-4" />
                                        {loading ? 'Submitting...' : 'Submit Application'}
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