import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import {
  Layers,
  Plus,
  GitCompare,
  Trash2,
  Edit3,
  Copy,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Calendar,
  FileEdit
} from 'lucide-react'
import apiService from '../services/api'
import { useCareer } from '../context/CareerContext'
import { useResume } from '../context/ResumeContext'

export default function ResumeVersionsPage({ onNavigate }) {
  const { resumeVersions, refreshResumeVersions } = useCareer()
  const resumeCtx = useResume()

  const [selectedV1, setSelectedV1] = useState('')
  const [selectedV2, setSelectedV2] = useState('')
  const [comparisonResult, setComparisonResult] = useState(null)
  const [comparing, setComparing] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [versionTitle, setVersionTitle] = useState('')
  const [targetRole, setTargetRole] = useState('')

  useEffect(() => {
    refreshResumeVersions()
  }, [])

  const handleSaveCurrentAsVersion = async () => {
    if (!versionTitle.trim()) {
      toast.error('Please enter a version title.')
      return
    }

    try {
      await apiService.saveResumeVersion({
        title: versionTitle,
        target_role: targetRole || 'General Role',
        resume_data: resumeCtx.resumeData,
        ats_score: 85,
        match_score: 80
      })
      toast.success('Saved current resume as new version!')
      setShowSaveModal(false)
      setVersionTitle('')
      refreshResumeVersions()
    } catch {
      toast.error('Failed to save version.')
    }
  }

  const handleLoadVersionIntoBuilder = async (versionId) => {
    try {
      const res = await apiService.getResumeVersion(versionId)
      if (res.data?.resume_data) {
        resumeCtx.updateSection('personal', res.data.resume_data.personal || {})
        resumeCtx.updateSummary(res.data.resume_data.summary || '')
        resumeCtx.updateSkills(res.data.resume_data.skills || [])
        resumeCtx.updateSection('experience', res.data.resume_data.experience || [])
        resumeCtx.updateSection('education', res.data.resume_data.education || [])
        resumeCtx.updateSection('projects', res.data.resume_data.projects || [])
        toast.success(`Loaded "${res.data.title}" into Resume Builder!`)
        onNavigate('builder')
      }
    } catch {
      toast.error('Failed to load version.')
    }
  }

  const handleDeleteVersion = async (id, e) => {
    e.stopPropagation()
    try {
      await apiService.deleteResumeVersion(id)
      toast.success('Version deleted.')
      refreshResumeVersions()
    } catch {
      toast.error('Failed to delete version.')
    }
  }

  const handleCompare = async () => {
    if (!selectedV1 || !selectedV2) {
      toast.error('Please select two different versions to compare.')
      return
    }
    if (selectedV1 === selectedV2) {
      toast.error('Please select two different versions.')
      return
    }

    setComparing(true)
    try {
      const res = await apiService.compareResumeVersions(selectedV1, selectedV2)
      setComparisonResult(res.data)
      toast.success('Version comparison complete!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Comparison failed.')
    } finally {
      setComparing(false)
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
              <Layers size={18} />
            </span>
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
              Resume Portfolio & Iteration History
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Resume Version Management & Comparison
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Maintain role-specific resume iterations (e.g. Data Engineer vs Backend Engineer) and compare ATS improvements over time.
          </p>
        </div>

        <button
          onClick={() => setShowSaveModal(true)}
          className="btn-primary flex items-center gap-2 text-xs py-2.5 px-5 shadow-sm"
        >
          <Plus size={15} />
          Save Current As Version
        </button>
      </div>

      {/* Version List Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
          Saved Resume Versions ({resumeVersions.length})
        </h2>

        {resumeVersions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 space-y-3">
            <p>No saved resume versions yet.</p>
            <button
              onClick={() => setShowSaveModal(true)}
              className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5"
            >
              <Plus size={13} />
              Save Your First Version
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumeVersions.map((v) => (
              <div
                key={v.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:border-primary-300 transition-all space-y-3 group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-800">{v.title}</h3>
                    <p className="text-xs text-primary-600 font-medium">{v.target_role || 'General Role'}</p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteVersion(v.id, e)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-1 rounded-lg transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl">
                  <span>ATS: <strong>{v.ats_score || 85}/100</strong></span>
                  <span>•</span>
                  <span>Match: <strong>{v.match_score || 80}%</strong></span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Calendar size={10} />
                    {new Date(v.updated_at * 1000).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleLoadVersionIntoBuilder(v.id)}
                    className="text-xs text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1"
                  >
                    <FileEdit size={12} />
                    Open in Builder
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Version Comparison Section */}
      {resumeVersions.length >= 2 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitCompare size={18} className="text-primary-600" />
              <h2 className="text-base font-bold text-slate-800">
                Compare Resume Versions (V1 vs V2)
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                Version 1 (Baseline)
              </label>
              <select
                value={selectedV1}
                onChange={(e) => setSelectedV1(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-primary-500"
              >
                <option value="">Select Version 1...</option>
                {resumeVersions.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.title} ({v.target_role || 'General'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                Version 2 (Iterated Version)
              </label>
              <select
                value={selectedV2}
                onChange={(e) => setSelectedV2(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-primary-500"
              >
                <option value="">Select Version 2...</option>
                {resumeVersions.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.title} ({v.target_role || 'General'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleCompare}
            disabled={comparing || !selectedV1 || !selectedV2}
            className="btn-primary text-xs py-2 px-5 inline-flex items-center gap-1.5"
          >
            <GitCompare size={14} />
            {comparing ? 'Comparing...' : 'Run Version Comparison'}
          </button>

          {/* Comparison Delta Display */}
          <AnimatePresence>
            {comparisonResult && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-6 border-t border-slate-200 space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">ATS Score Delta</p>
                    <p className="text-xl font-extrabold text-primary-600 mt-1">
                      {comparisonResult.version_1.ats_score} → {comparisonResult.version_2.ats_score}
                      <span className="text-xs ml-1 text-emerald-600 font-bold">
                        (+{comparisonResult.improvement.ats_score_change})
                      </span>
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Skill Count</p>
                    <p className="text-xl font-extrabold text-slate-800 mt-1">
                      {comparisonResult.version_1.skills_count} → {comparisonResult.version_2.skills_count}
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Summary Updated</p>
                    <p className="text-sm font-bold text-emerald-600 mt-2">
                      {comparisonResult.improvement.summary_changed ? '✓ Yes (Tailored)' : 'No Change'}
                    </p>
                  </div>
                </div>

                {/* Added Skills */}
                {comparisonResult.improvement.added_skills?.length > 0 && (
                  <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                      Newly Added Skills in V2
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {comparisonResult.improvement.added_skills.map((s, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-white text-emerald-700 border border-emerald-200"
                        >
                          + {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Save Version Modal */}
      <AnimatePresence>
        {showSaveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4"
            >
              <h2 className="text-base font-bold text-slate-800">Save Resume Version</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    Version Title *
                  </label>
                  <input
                    type="text"
                    value={versionTitle}
                    onChange={(e) => setVersionTitle(e.target.value)}
                    placeholder="e.g. Senior Data Engineer Resume - V2"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    Target Role
                  </label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. Data Engineer"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCurrentAsVersion}
                  className="btn-primary text-xs py-2 px-5"
                >
                  Save Version
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
