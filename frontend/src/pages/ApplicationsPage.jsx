import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import {
  Kanban,
  List,
  Plus,
  Search,
  Building2,
  MapPin,
  Calendar,
  Trash2,
  Edit2,
  ExternalLink,
  ChevronDown,
  CheckCircle2
} from 'lucide-react'
import apiService from '../services/api'
import { useCareer } from '../context/CareerContext'

const STATUSES = [
  'Wishlist',
  'Applied',
  'Assessment',
  'Interview',
  'Offer',
  'Rejected'
]

const statusColors = {
  Wishlist: 'bg-slate-100 text-slate-700 border-slate-200',
  Applied: 'bg-blue-50 text-blue-700 border-blue-200',
  Assessment: 'bg-violet-50 text-violet-700 border-violet-200',
  Interview: 'bg-amber-50 text-amber-700 border-amber-200',
  Offer: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Rejected: 'bg-red-50 text-red-700 border-red-200',
}

export default function ApplicationsPage({ onNavigate }) {
  const { applications, setApplications, refreshApplications } = useCareer()
  const [viewMode, setViewMode] = useState('kanban') // kanban | table
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingApp, setEditingApp] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    company: '',
    job_title: '',
    job_location: '',
    status: 'Applied',
    application_date: new Date().toISOString().split('T')[0],
    match_score: 80,
    ats_score: 85,
    notes: '',
    interview_date: '',
    salary_range: ''
  })

  const openAddModal = () => {
    setEditingApp(null)
    setFormData({
      company: '',
      job_title: '',
      job_location: '',
      status: 'Applied',
      application_date: new Date().toISOString().split('T')[0],
      match_score: 80,
      ats_score: 85,
      notes: '',
      interview_date: '',
      salary_range: ''
    })
    setShowModal(true)
  }

  const openEditModal = (app) => {
    setEditingApp(app)
    setFormData({ ...app })
    setShowModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!formData.company.trim() || !formData.job_title.trim()) {
      toast.error('Company and Job Title are required.')
      return
    }

    try {
      if (editingApp) {
        await apiService.updateApplication(editingApp.id, formData)
        toast.success('Application updated!')
      } else {
        await apiService.createApplication(formData)
        toast.success('Application added!')
      }
      setShowModal(false)
      refreshApplications()
    } catch (err) {
      toast.error('Failed to save application.')
    }
  }

  const handleDelete = async (id, e) => {
    e?.stopPropagation()
    try {
      await apiService.deleteApplication(id)
      toast.success('Application deleted.')
      refreshApplications()
    } catch {
      toast.error('Failed to delete application.')
    }
  }

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await apiService.updateApplication(appId, { status: newStatus })
      toast.success(`Status updated to ${newStatus}`)
      refreshApplications()
    } catch {
      toast.error('Failed to update status.')
    }
  }

  const filteredApps = applications.filter((app) => {
    const q = searchQuery.toLowerCase()
    return (
      app.company?.toLowerCase().includes(q) ||
      app.job_title?.toLowerCase().includes(q) ||
      app.job_location?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-primary-100 text-primary-700">
              <Kanban size={18} />
            </span>
            <span className="text-xs font-bold text-primary-700 uppercase tracking-wider">
              Job Hunt & Application Pipeline
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Job Application Tracker
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track interview dates, match scores, follow-ups, and pipeline stages in one place.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="btn-primary flex items-center gap-2 text-xs py-2.5 px-5 shadow-sm"
        >
          <Plus size={15} />
          Add Application
        </button>
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company, job title, or location..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:bg-white"
          />
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'kanban'
                ? 'bg-white text-primary-700 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Kanban size={13} />
            Board
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'table'
                ? 'bg-white text-primary-700 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <List size={13} />
            List Table
          </button>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {STATUSES.map((status) => {
            const columnApps = filteredApps.filter((app) => app.status === status)
            return (
              <div key={status} className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-3 space-y-3 min-w-[200px]">
                {/* Column Header */}
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold text-slate-700">{status}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-600">
                    {columnApps.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-2.5 min-h-[300px]">
                  {columnApps.map((app) => (
                    <div
                      key={app.id}
                      onClick={() => openEditModal(app)}
                      className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs hover:shadow-xs hover:border-primary-300 transition-all cursor-pointer space-y-2 group"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-xs text-slate-800 line-clamp-1">{app.company}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{app.job_title}</p>
                        </div>
                        <button
                          onClick={(e) => handleDelete(app.id, e)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      {app.job_location && (
                        <p className="text-[10px] text-slate-400 flex items-center gap-1">
                          <MapPin size={10} />
                          <span className="truncate">{app.job_location}</span>
                        </p>
                      )}

                      {/* Scores & Date Footer */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] font-medium text-slate-500">
                        <span>Match: {app.match_score || 80}%</span>
                        <span className="text-slate-400">{app.application_date || 'Recent'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* List / Table View */
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-3.5 pl-5">Company & Role</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Match / ATS</th>
                <th className="p-3.5">Applied Date</th>
                <th className="p-3.5 text-right pr-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3.5 pl-5">
                    <p className="font-bold text-slate-800">{app.company}</p>
                    <p className="text-[11px] text-slate-500">{app.job_title}</p>
                  </td>
                  <td className="p-3.5 text-slate-600">{app.job_location || '—'}</td>
                  <td className="p-3.5">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none ${
                        statusColors[app.status] || 'bg-slate-50 text-slate-700'
                      }`}
                    >
                      {STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3.5 font-medium text-slate-700">
                    {app.match_score || 80}% / {app.ats_score || 85}%
                  </td>
                  <td className="p-3.5 text-slate-500">{app.application_date || '—'}</td>
                  <td className="p-3.5 text-right pr-5 space-x-2">
                    <button
                      onClick={() => openEditModal(app)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(app.id, e)}
                      className="p-1 rounded-lg text-slate-400 hover:text-red-500"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4"
            >
              <h2 className="text-base font-bold text-slate-800">
                {editingApp ? 'Edit Application' : 'Add New Application'}
              </h2>

              <form onSubmit={handleSave} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Company *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Google"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Job Title *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.job_title}
                      onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                      placeholder="e.g. Senior Backend Engineer"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.job_location}
                      onChange={(e) => setFormData({ ...formData, job_location: e.target.value })}
                      placeholder="e.g. San Francisco / Remote"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Pipeline Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-primary-500"
                    >
                      {STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Application Date
                    </label>
                    <input
                      type="date"
                      value={formData.application_date}
                      onChange={(e) => setFormData({ ...formData, application_date: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Interview Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={formData.interview_date}
                      onChange={(e) => setFormData({ ...formData, interview_date: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Notes / Referral / Links
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Referral contact, recruiter info, specific notes..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary text-xs py-2 px-5">
                    {editingApp ? 'Save Changes' : 'Create Application'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
