import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import {
  ArrowLeft,
  Download,
  Lightbulb,
  BookOpen,
  Shield,
  Award,
  AlertTriangle,
  ArrowRight,
  Target,
  Edit3,
  Wand2,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react'
import CircularScore from '../components/CircularScore'
import { SkillRadarChart, SkillBarChart } from '../components/SkillCharts'
import { MatchedSkills, MissingSkills, ExtraSkills } from '../components/SkillTags'
import apiService from '../services/api'
import { useCareer } from '../context/CareerContext'

export default function AnalysisPage({ onNavigate }) {
  const { analysisResult, uploadedFile, targetRole } = useCareer()
  const [downloading, setDownloading] = useState(false)
  const reportRef = useRef(null)

  const result = analysisResult

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <AlertTriangle size={32} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">No Analysis Results Found</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Upload your resume on the dashboard and pick a target role to generate full intelligence analytics.
          </p>
        </div>
        <button onClick={() => onNavigate('dashboard')} className="btn-primary text-xs py-2 px-5">
          Go to Dashboard
        </button>
      </div>
    )
  }

  const handleDownloadReport = async () => {
    setDownloading(true)
    try {
      const html2pdf = (await import('html2pdf.js')).default
      const element = reportRef.current
      if (!element) {
        toast.error('Report view not ready.')
        return
      }

      const opt = {
        margin: [8, 8, 8, 8],
        filename: `CareerAI_${result.job_role.replace(/ /g, '_')}_Report.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#f8fafc' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      }

      await html2pdf().set(opt).from(element).save()
      toast.success('Report downloaded!')
    } catch (e) {
      console.error(e)
      toast.error('Download failed. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors shadow-2xs"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Resume Intelligence Analysis
            </h1>
            <p className="text-xs text-slate-500">
              Target Track: <strong className="text-primary-700">{result.job_role}</strong> • {result.word_count} words parsed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadReport}
            disabled={downloading}
            className="btn-primary flex items-center gap-1.5 text-xs py-2 px-4 shadow-sm"
          >
            <Download size={14} />
            {downloading ? 'Exporting PDF...' : 'Download PDF Report'}
          </button>
        </div>
      </div>

      {/* Quick Action Navigation Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => onNavigate('skill-gap')}
          className="bg-white border border-slate-200 hover:border-primary-400 p-3.5 rounded-2xl flex items-center justify-between text-left shadow-2xs transition-all group"
        >
          <div>
            <p className="text-xs font-bold text-slate-800">Skill Evidence Mapping</p>
            <p className="text-[10px] text-slate-400">View exact quote citations</p>
          </div>
          <ArrowRight size={14} className="text-slate-400 group-hover:text-primary-600 transition-colors" />
        </button>

        <button
          onClick={() => onNavigate('rewriter')}
          className="bg-white border border-slate-200 hover:border-violet-400 p-3.5 rounded-2xl flex items-center justify-between text-left shadow-2xs transition-all group"
        >
          <div>
            <p className="text-xs font-bold text-slate-800">AI Resume Rewriter</p>
            <p className="text-[10px] text-slate-400">Optimize bullet points</p>
          </div>
          <ArrowRight size={14} className="text-slate-400 group-hover:text-violet-600 transition-colors" />
        </button>

        <button
          onClick={() => onNavigate('tailored-resume')}
          className="bg-white border border-slate-200 hover:border-indigo-400 p-3.5 rounded-2xl flex items-center justify-between text-left shadow-2xs transition-all group"
        >
          <div>
            <p className="text-xs font-bold text-slate-800">Tailored Resume</p>
            <p className="text-[10px] text-slate-400">Align with target JD</p>
          </div>
          <ArrowRight size={14} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
        </button>

        <button
          onClick={() => onNavigate('ats-simulator')}
          className="bg-white border border-slate-200 hover:border-emerald-400 p-3.5 rounded-2xl flex items-center justify-between text-left shadow-2xs transition-all group"
        >
          <div>
            <p className="text-xs font-bold text-slate-800">ATS Simulator</p>
            <p className="text-[10px] text-slate-400">Compliance & issue check</p>
          </div>
          <ArrowRight size={14} className="text-slate-400 group-hover:text-emerald-600 transition-colors" />
        </button>
      </div>

      {/* Captured Report Body */}
      <div ref={reportRef} className="bg-slate-50/80 rounded-3xl p-6 space-y-6 border border-slate-200/80">
        {/* Score Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center shadow-xs border border-slate-100">
            <CircularScore score={result.match_score} label="Overall Match Score" size={140} />
            <p className="text-xs text-slate-400 mt-2 text-center max-w-[160px]">
              {result.role_description}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center shadow-xs border border-slate-100">
            <CircularScore score={result.resume_score} label="ATS Resume Strength" size={140} />
            <div className="mt-3 w-full space-y-1 text-center">
              <span className="text-xs text-slate-500 font-semibold">
                {result.total_matched} of {result.total_required} skills verified
              </span>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-violet-500 rounded-full"
                  style={{ width: `${Math.min(100, (result.total_matched / Math.max(result.total_required, 1)) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 space-y-2.5">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Award size={14} className="text-amber-500" />
              Quick Alignment Stats
            </h3>
            {[
              { label: 'Matched Skills', val: result.matched_skills?.length || 0, color: 'text-emerald-700 bg-emerald-50' },
              { label: 'Skill Gaps', val: result.missing_skills?.length || 0, color: 'text-red-700 bg-red-50' },
              { label: 'Bonus / Extra', val: result.extra_skills?.length || 0, color: 'text-blue-700 bg-blue-50' },
              { label: 'Core Must-Haves', val: result.core_matched?.length || 0, color: 'text-violet-700 bg-violet-50' },
            ].map((s) => (
              <div key={s.label} className={`flex items-center justify-between px-3 py-1.5 rounded-xl ${s.color}`}>
                <span className="text-xs font-medium">{s.label}</span>
                <span className="text-xs font-bold">{s.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100">
            <SkillRadarChart
              matched={result.total_matched}
              missing={result.missing_skills?.length || 0}
              total={result.total_required}
            />
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100">
            <SkillBarChart
              matchedSkills={result.matched_skills || []}
              missingSkills={result.missing_skills || []}
            />
          </div>
        </div>

        {/* Skills Tag Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 space-y-4">
            <MatchedSkills skills={result.matched_skills || []} />
            {result.extra_skills?.length > 0 && (
              <div className="pt-3 border-t border-slate-100">
                <ExtraSkills skills={result.extra_skills} />
              </div>
            )}
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100">
            <MissingSkills skills={result.missing_skills || []} />
          </div>
        </div>

        {/* Recommendations & ATS Tips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb size={14} className="text-amber-500" />
              Strategic Recommendations
            </h3>
            <div className="space-y-2">
              {result.suggestions?.map((s, i) => (
                <div key={i} className="flex gap-2 text-xs text-slate-600 leading-relaxed">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen size={14} className="text-primary-600" />
              Recommended Upskilling
            </h3>
            <div className="space-y-2">
              {result.courses?.map((c, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex justify-between items-start gap-1">
                    <p className="text-xs font-bold text-slate-800 leading-tight">{c.title}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary-100 text-primary-700 font-semibold shrink-0">
                      {c.level}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{c.platform} • {c.skill}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Shield size={14} className="text-emerald-600" />
              ATS Parser Guidelines
            </h3>
            <div className="space-y-2">
              {result.ats_tips?.map((tip, i) => (
                <div key={i} className="flex gap-2 text-xs text-slate-600 leading-relaxed">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
