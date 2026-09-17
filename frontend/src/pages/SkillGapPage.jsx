import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import {
  Target,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Quote,
  Sparkles,
  ArrowRight,
  BookOpen,
  FolderGit2,
  ShieldAlert,
  HelpCircle
} from 'lucide-react'
import apiService from '../services/api'
import { useCareer } from '../context/CareerContext'

export default function SkillGapPage({ onNavigate }) {
  const { resumeText, targetJD, targetRole, uploadedFile, skillGapResult, setSkillGapResult } = useCareer()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!skillGapResult && (resumeText || uploadedFile) && targetJD) {
      handleFetchSkillGaps()
    }
  }, [resumeText, targetJD])

  const handleFetchSkillGaps = async () => {
    let rText = resumeText
    if (!rText && uploadedFile) {
      // If we only have the uploaded file, extract text via backend
      try {
        setLoading(true)
        const formData = new FormData()
        formData.append('file', uploadedFile)
        formData.append('job_role', targetRole || 'Software Engineer')
        const anaRes = await apiService.analyzeResumeFile(formData)
        rText = anaRes.data.text_preview || anaRes.data.extracted_skills.join(' ')
      } catch (e) {
        console.error(e)
      }
    }

    if (!rText || !targetJD) {
      return
    }

    setLoading(true)
    try {
      const res = await apiService.getSkillGaps(rText, targetJD, targetRole)
      setSkillGapResult(res.data)
      toast.success('Skill gap & evidence analysis refreshed!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to retrieve skill gaps.')
    } finally {
      setLoading(false)
    }
  }

  const matched = skillGapResult?.matched_skills || []
  const missing = skillGapResult?.missing_skills || []
  const weak = skillGapResult?.weak_skills || []

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
              <Target size={18} />
            </span>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Skill Alignment & Evidence Verification
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Skill Gap & Evidence Mapping
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            See exactly where your skills were detected in your resume, and discover concrete learning steps for missing gaps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('roadmap')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition-all"
          >
            <BookOpen size={14} className="text-primary-600" />
            View Roadmap
          </button>
          <button
            onClick={() => onNavigate('rewriter')}
            className="btn-primary flex items-center gap-1.5 text-xs py-2 px-4 shadow-sm"
          >
            Rewrite Resume
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Target Info Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 font-bold">
            🎯
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Target Analysis Context</p>
            <p className="text-sm font-bold text-slate-800">
              Role: <span className="text-primary-600">{targetRole || 'Software Engineer'}</span>
              {targetJD ? ' • Target Job Description Loaded' : ' • No Target JD Loaded'}
            </p>
          </div>
        </div>

        <button
          onClick={handleFetchSkillGaps}
          disabled={loading || !targetJD}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all disabled:opacity-50"
        >
          {loading ? 'Re-analyzing...' : 'Refresh Evidence'}
        </button>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Matched Skills</span>
            <CheckCircle2 size={18} className="text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-700 mt-2">{matched.length}</p>
          <p className="text-[11px] text-emerald-600 mt-1">Verified with resume text evidence</p>
        </div>

        <div className="bg-red-50/70 border border-red-200 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-800 uppercase tracking-wider">Skill Gaps</span>
            <XCircle size={18} className="text-red-500" />
          </div>
          <p className="text-3xl font-extrabold text-red-600 mt-2">{missing.length}</p>
          <p className="text-[11px] text-red-500 mt-1">Required/favored by target JD</p>
        </div>

        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Partial / Weak</span>
            <AlertTriangle size={18} className="text-amber-600" />
          </div>
          <p className="text-3xl font-extrabold text-amber-700 mt-2">{weak.length}</p>
          <p className="text-[11px] text-amber-600 mt-1">Needs deeper evidence or metrics</p>
        </div>
      </div>

      {/* Section 1: Matched Skills with Skill Evidence Mapping */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-800">Verified Skill Evidence Mapping</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Shows where the algorithm verified each skill in your resume
          </span>
        </div>

        {matched.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400">
            No matched skills detected yet. Please upload a resume and select a target JD.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matched.map((item, idx) => {
              const skillName = typeof item === 'string' ? item : item.skill
              const quote = typeof item === 'object' ? item.evidence_quote : 'Mentioned in resume.'
              const source = typeof item === 'object' ? item.section_source : 'Resume Body'
              const conf = typeof item === 'object' ? item.confidence : 90

              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="font-bold text-sm text-slate-800">{skillName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {source}
                      </span>
                      <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        {conf}% Match
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-start gap-2.5">
                    <Quote size={14} className="text-primary-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-600 italic leading-relaxed">
                      "{quote}"
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Section 2: Missing Skills & Actionable Learning Advice */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <XCircle size={18} className="text-red-500" />
            <h2 className="text-lg font-bold text-slate-800">Critical Skill Gaps & Recommended Bridge Plan</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Real practical steps to qualify for this role honestly
          </span>
        </div>

        {missing.length === 0 ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center text-emerald-700 font-semibold text-sm">
            🎉 Outstanding! You have matched all required skills for this job description.
          </div>
        ) : (
          <div className="space-y-3">
            {missing.map((item, idx) => {
              const skillName = typeof item === 'string' ? item : item.skill
              const importance = typeof item === 'object' ? item.importance : 'High'
              const why = typeof item === 'object' ? item.why_it_matters : 'Required by target JD.'
              const project = typeof item === 'object' ? item.recommended_project : 'Build a demo project.'
              const evidenceGuideline = typeof item === 'object' ? item.resume_evidence_guideline : 'Add to resume after building.'

              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">
                        ✗
                      </span>
                      <span className="font-bold text-sm text-slate-800">{skillName}</span>
                    </div>
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        importance === 'High'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {importance} Priority
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-700">Why it matters:</strong> {why}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                        <FolderGit2 size={13} className="text-primary-600" />
                        Recommended Portfolio Project
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{project}</p>
                    </div>

                    <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-1">
                        <ShieldAlert size={13} className="text-amber-600" />
                        Honest Resume Evidence Guideline
                      </div>
                      <p className="text-xs text-amber-900 leading-relaxed">
                        {evidenceGuideline}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Section 3: Weak / Partial Skills */}
      {weak.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle size={17} className="text-amber-500" />
            <h2 className="text-base font-bold text-slate-800">Weak / Partial Skills to Strengthen</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {weak.map((w, idx) => (
              <div key={idx} className="bg-amber-50/40 border border-amber-200 rounded-xl p-4 space-y-1">
                <span className="font-bold text-xs text-amber-800 uppercase tracking-wider">{w.skill}</span>
                {w.reason && <p className="text-xs text-slate-600">{w.reason}</p>}
                {w.improvement_tip && (
                  <p className="text-xs text-primary-700 font-medium mt-1">💡 Tip: {w.improvement_tip}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
