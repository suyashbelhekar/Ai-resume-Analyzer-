import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import {
  Wand2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileEdit,
  Eye,
  SlidersHorizontal,
  Briefcase
} from 'lucide-react'
import apiService from '../services/api'
import { useCareer } from '../context/CareerContext'
import { useResume } from '../context/ResumeContext'

export default function TailoredResumePage({ onNavigate }) {
  const { targetJD, targetRole, setTargetJD, setTargetRole } = useCareer()
  const resumeCtx = useResume()
  const [loading, setLoading] = useState(false)
  const [tailoredData, setTailoredData] = useState(null)

  const handleGenerateTailored = async () => {
    if (!targetJD.trim()) {
      toast.error('Please provide a target Job Description first.')
      return
    }

    setLoading(true)
    try {
      const res = await apiService.tailorResume(resumeCtx.resumeData, targetJD)
      setTailoredData(res.data)
      toast.success('Tailored Resume generated successfully!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Tailoring failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleApplyToBuilder = () => {
    if (!tailoredData || !resumeCtx) return

    if (tailoredData.tailored_summary) {
      resumeCtx.updateSummary(tailoredData.tailored_summary)
    }
    if (tailoredData.prioritized_skills?.length) {
      resumeCtx.updateSkills(tailoredData.prioritized_skills)
    }
    if (tailoredData.optimized_experience?.length) {
      resumeCtx.updateSection('experience', tailoredData.optimized_experience)
    }
    if (tailoredData.optimized_projects?.length) {
      resumeCtx.updateSection('projects', tailoredData.optimized_projects)
    }

    toast.success('Tailored content applied to Resume Builder!')
    onNavigate('builder')
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
              <Wand2 size={18} />
            </span>
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
              Job-Specific Alignment Engine
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Job-Specific Tailored Resume Generator
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Reorder and optimize your existing experience and skills to match the exact keywords and priorities of your target job.
          </p>
        </div>

        {tailoredData && (
          <button
            onClick={handleApplyToBuilder}
            className="btn-primary flex items-center gap-1.5 text-xs py-2 px-4 shadow-sm"
          >
            Apply to Resume Builder
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      {/* Inputs Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Briefcase size={14} className="text-primary-600" />
            <span>Target Job Description</span>
          </div>
          <span className="text-xs text-slate-400">
            {targetJD ? `${targetJD.split(' ').length} words loaded` : 'No JD loaded'}
          </span>
        </div>

        <textarea
          rows={4}
          value={targetJD}
          onChange={(e) => setTargetJD(e.target.value)}
          placeholder="Paste target job description here..."
          className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all font-mono"
        />

        <div className="flex justify-end">
          <button
            onClick={handleGenerateTailored}
            disabled={loading || !targetJD.trim()}
            className="btn-primary flex items-center gap-2 text-xs py-2.5 px-6"
          >
            <Sparkles size={14} />
            {loading ? 'Generating Tailored Version...' : 'Generate Tailored Resume'}
          </button>
        </div>
      </div>

      {/* Tailored Results */}
      <AnimatePresence>
        {tailoredData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Key Adjustments Banner */}
            {tailoredData.key_changes_summary?.length > 0 && (
              <div className="bg-primary-50/70 border border-primary-200 rounded-2xl p-5 space-y-2">
                <p className="text-xs font-bold text-primary-900 uppercase tracking-wider">
                  Strategic Tailoring Summary
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {tailoredData.key_changes_summary.map((change, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-primary-800">
                      <CheckCircle2 size={13} className="text-primary-600 shrink-0 mt-0.5" />
                      <span>{change}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Targeted Professional Summary */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Tailored Professional Summary
              </span>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 font-medium">
                {tailoredData.tailored_summary}
              </p>
            </div>

            {/* Prioritized Skills */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  JD-Prioritized Technical Skills
                </span>
                <span className="text-[11px] text-slate-400">Re-ordered for maximum ATS keyword match</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tailoredData.prioritized_skills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-slate-800">Ready to use this tailored version?</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Apply changes directly to the interactive Resume Builder to preview templates and export PDF.
                </p>
              </div>
              <button
                onClick={handleApplyToBuilder}
                className="btn-primary flex items-center gap-1.5 text-xs py-2 px-5"
              >
                <FileEdit size={14} />
                Open in Resume Builder
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
