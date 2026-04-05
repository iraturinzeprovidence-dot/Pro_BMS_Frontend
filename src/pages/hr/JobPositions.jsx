import { useState, useEffect } from 'react'
import { hrApi } from '../../api/hrApi'
import {
  Briefcase,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Building2,
  Clock,
  DollarSign,
  Calendar,
  FileText,
  ListChecks,
  Users,
  X,
  AlertCircle,
  Tag,
  TrendingUp
} from 'lucide-react'

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

    const getTypeIcon = (type) => {
        switch(type) {
            case 'full_time': return <Clock className="w-3 h-3" />;
            case 'part_time': return <Clock className="w-3 h-3" />;
            case 'contract': return <FileText className="w-3 h-3" />;
            case 'internship': return <TrendingUp className="w-3 h-3" />;
            default: return <Briefcase className="w-3 h-3" />;
        }
    }

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
                            <Briefcase className="w-7 h-7 text-emerald-800" />
                            <h2 className="text-2xl font-bold text-black drop-shadow-lg">Job Positions</h2>
                        </div>
                        <p className="text-gray-700 ml-10 drop-shadow-md font-medium">
                            {jobs.length} positions total
                        </p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-base font-medium px-8 py-3 rounded-md transition-all duration-200 flex items-center gap-2 shadow-md"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Post Job
                    </button>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative md:w-96">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by title or department..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-white/80 backdrop-blur-md border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Jobs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {loading ? (
                        <div className="col-span-2 text-center py-8">
                            <Briefcase className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">Loading job positions...</p>
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="col-span-2 text-center py-8">
                            <Briefcase className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">No job positions found</p>
                            <p className="text-gray-400 text-xs mt-1">Click "Post Job" to get started</p>
                        </div>
                    ) : jobs.map((j) => (
                        <div key={j.id} className="bg-white/80 backdrop-blur-md rounded-md border border-gray-200 shadow-lg p-5 hover:shadow-xl transition-all duration-200">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Tag className="w-4 h-4 text-emerald-700" />
                                        <h3 className="font-semibold text-black text-lg">{j.title}</h3>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                                        <p className="text-sm text-gray-600">{j.department}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 ${
                                        j.status === 'open' 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {j.status === 'open' ? '●' : '○'} {j.status}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3 pb-2 border-b border-gray-100">
                                <div className="flex items-center gap-1">
                                    {getTypeIcon(j.type)}
                                    <span className="capitalize">{j.type.replace('_', ' ')}</span>
                                </div>
                                {j.salary_min && (
                                    <div className="flex items-center gap-1">
                                        <DollarSign className="w-3 h-3" />
                                        <span>${Number(j.salary_min).toLocaleString()} - ${Number(j.salary_max).toLocaleString()}</span>
                                    </div>
                                )}
                                {j.deadline && (
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>Due: {new Date(j.deadline).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex items-center gap-1 mb-4">
                                <Users className="w-3.5 h-3.5 text-blue-600" />
                                <span className="text-xs font-medium text-blue-700">{j.candidates_count} applicants</span>
                            </div>
                            
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => openEdit(j)} 
                                    className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition text-xs flex items-center gap-1"
                                >
                                    <Edit className="w-3.5 h-3.5" />
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(j.id)} 
                                    className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md transition text-xs flex items-center gap-1"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add/Edit Job Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
                        <div className="bg-white/95 backdrop-blur-md rounded-md shadow-xl w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center px-8 py-5 border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur-md z-10">
                                <h3 className="text-xl font-bold text-black">
                                    {editing ? 'Edit Job Position' : 'Post New Job'}
                                </h3>
                                <button 
                                    onClick={() => setShowModal(false)}
                                    className="p-2 rounded-md hover:bg-gray-100 transition"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                            
                            {error && (
                                <div className="mx-8 mt-5 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-md flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit} className="p-8 space-y-5">
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Tag className="w-3.5 h-3.5 inline mr-1" />
                                            Job Title
                                        </label>
                                        <input 
                                            type="text" required value={form.title} 
                                            onChange={e => setForm({...form, title: e.target.value})}
                                            placeholder="e.g. Senior Software Engineer"
                                            className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Building2 className="w-3.5 h-3.5 inline mr-1" />
                                            Department
                                        </label>
                                        <input 
                                            type="text" required value={form.department} 
                                            onChange={e => setForm({...form, department: e.target.value})}
                                            placeholder="e.g. Engineering"
                                            className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Employment Type
                                        </label>
                                        <select 
                                            value={form.type} 
                                            onChange={e => setForm({...form, type: e.target.value})}
                                            className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                        >
                                            <option value="full_time">Full Time</option>
                                            <option value="part_time">Part Time</option>
                                            <option value="contract">Contract</option>
                                            <option value="internship">Internship</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Status
                                        </label>
                                        <select 
                                            value={form.status} 
                                            onChange={e => setForm({...form, status: e.target.value})}
                                            className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                        >
                                            <option value="open">Open</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <DollarSign className="w-3.5 h-3.5 inline mr-1" />
                                            Min Salary
                                        </label>
                                        <input 
                                            type="number" min="0" value={form.salary_min} 
                                            onChange={e => setForm({...form, salary_min: e.target.value})}
                                            placeholder="0"
                                            className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <DollarSign className="w-3.5 h-3.5 inline mr-1" />
                                            Max Salary
                                        </label>
                                        <input 
                                            type="number" min="0" value={form.salary_max} 
                                            onChange={e => setForm({...form, salary_max: e.target.value})}
                                            placeholder="0"
                                            className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" 
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Calendar className="w-3.5 h-3.5 inline mr-1" />
                                            Application Deadline
                                        </label>
                                        <input 
                                            type="date" value={form.deadline} 
                                            onChange={e => setForm({...form, deadline: e.target.value})}
                                            className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" 
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FileText className="w-3.5 h-3.5 inline mr-1" />
                                        Description
                                    </label>
                                    <textarea 
                                        rows="3" value={form.description} 
                                        onChange={e => setForm({...form, description: e.target.value})}
                                        placeholder="Job description, responsibilities, etc."
                                        className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" 
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <ListChecks className="w-3.5 h-3.5 inline mr-1" />
                                        Requirements
                                    </label>
                                    <textarea 
                                        rows="3" value={form.requirements} 
                                        onChange={e => setForm({...form, requirements: e.target.value})}
                                        placeholder="Required skills, experience, qualifications..."
                                        className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" 
                                    />
                                </div>
                                
                                <div className="flex gap-3 pt-4">
                                    <button type="submit" className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2.5 rounded-md text-sm transition">
                                        {editing ? 'Update Job' : 'Post Job'}
                                    </button>
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-md text-sm hover:bg-gray-50 transition">
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