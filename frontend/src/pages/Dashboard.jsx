import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import {
  Sparkles,
  ChevronRight,
  TrendingUp,
  Target,
  FileSearch,
  Wand2,
  ShieldCheck,
  Map,
  Mic,
  Kanban,
  Edit3,
  LogIn,
  LogOut,
  Zap,
  ArrowRight,
  Clock,
  Layers,
  Award
} from 'lucide-react'
import UploadZone from '../components/UploadZone'
import LoadingOverlay from '../components/LoadingOverlay'
import AuthModal from '../components/AuthModal'
import { useAuth } from '../context/AuthContext'
import { useCareer } from '../context/CareerContext'
import apiService from '../services/api'
import CircularScore from '../components/CircularScore'

const ROLES = [
  'Software Engineer',
  'Data Scientist',
  'Frontend Developer',
  'Backend Developer',
  'DevOps Engineer',
  'Machine Learning Engineer',
  'Product Manager',
  'Cybersecurity Analyst'
]

export default function Dashboard({ onNavigate }) {
  const { user, logout } = useAuth()
  const {
    uploadedFile,
    setUploadedFile,
    targetRole,
    setTargetRole,
    targetJD,
    analysisResult,
    setAnalysisResult,
    setResumeText,
    applications,
    backendStatus
  } = useCareer()

  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [showAuth, setShowAuth] = useState(false)

  const handleAnalyze = async () => {
    if (!uploadedFile) {
      toast.error('Please upload your resume first.')
      return
    }

    setLoading(true)
    setLoadingStep(0)
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => Math.min(prev + 1, 4))
    }, 700)

    try {
      const formData = new FormData()
      formData.append('file', uploadedFile)
      formData.append('job_role', targetRole || 'Software Engineer')

      const response = await apiService.analyzeResumeFile(formData)
      const data = response.data

      clearInterval(stepInterval)
      setLoadingStep(4)
      await new Promise((r) => setTimeout(r, 400))

      setAnalysisResult(data)
      if (data.text_preview) {
        setResumeText(data.text_preview)
      }
      toast.success('Analysis complete!')
      onNavigate('analysis-flow')
    } catch (err) {
      clearInterval(stepInterval)
      toast.error(err.response?.data?.detail || 'Analysis failed. Please try again.')
    } finally {
      setLoading(false)
      setLoadingStep(0)
    }
  }

  const overallScore = analysisResult?.match_score || 78
  const atsScore = analysisResult?.resume_score || 84
  const activeAppsCount = applications.length || 0

  return (
    <>
      <AnimatePresence>{loading && <LoadingOverlay step={loadingStep} />}</AnimatePresence>

      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} onSuccess={() => setShowAuth(false)} />
      )}

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Top Bar / Actions */}
        <div className="flex items-center justify-end">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary-50 dark:bg-primary-950/40 border border-primary-100 dark:border-primary-800">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">
                    {user.full_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-xs font-semibold text-primary-700 dark:text-primary-300">
                  {user.full_name.split(' ')[0]}
                </span>
              </div>
              <button
                onClick={() => {
                  logout()
                  toast.success('Signed out.')
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium transition-colors"
              >
                <LogOut size={13} /> Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="btn-primary flex items-center gap-1.5 text-xs py-2 px-4 shadow-sm"
            >
              <LogIn size={14} />
              Login / Register
            </button>
          )}
        </div>

        {/* Hero Command Center Welcome Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-400 via-violet-400 to-transparent" />

          <div className="relative z-10 max-w-3xl space-y-3">
            <span className="text-xs px-3 py-1 rounded-full bg-primary-500/20 text-indigo-300 font-bold uppercase tracking-wider border border-primary-500/30">
              Career Command Center
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              {user ? `Welcome Back, ${user.full_name.split(' ')[0]}!` : 'AI Career & Resume Intelligence'}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
              Elevate your career journey: parse job postings, audit ATS compliance, rewrite bullet points with zero fabrication, practice AI mock interviews, and manage applications.
            </p>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <p className="text-[11px] text-indigo-200 font-medium">Target Role</p>
              <p className="text-sm font-bold text-white mt-0.5 truncate">{targetRole}</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <p className="text-[11px] text-indigo-200 font-medium">Latest Match</p>
              <p className="text-sm font-bold text-emerald-400 mt-0.5">{overallScore}% Fit</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <p className="text-[11px] text-indigo-200 font-medium">ATS Simulator</p>
              <p className="text-sm font-bold text-indigo-300 mt-0.5">{atsScore}/100 Score</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <p className="text-[11px] text-indigo-200 font-medium">Active Applications</p>
              <p className="text-sm font-bold text-amber-300 mt-0.5">{activeAppsCount} Pipeline</p>
            </div>
          </div>
        </div>

        {/* Core Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => onNavigate('jd-analyzer')}
            className="bg-white border border-slate-200 hover:border-primary-400 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all">
              <FileSearch size={18} />
            </div>
            <h3 className="font-bold text-sm text-slate-800">Job Description Analyzer</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Extract required skills, experience, and keywords from any job posting.
            </p>
          </div>

          <div
            onClick={() => onNavigate('rewriter')}
            className="bg-white border border-slate-200 hover:border-violet-400 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-all">
              <Edit3 size={18} />
            </div>
            <h3 className="font-bold text-sm text-slate-800">AI Resume Rewriter</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Enhance impact and quantify bullets with zero hallucinated facts.
            </p>
          </div>

          <div
            onClick={() => onNavigate('ats-simulator')}
            className="bg-white border border-slate-200 hover:border-emerald-400 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <ShieldCheck size={18} />
            </div>
            <h3 className="font-bold text-sm text-slate-800">ATS Simulator</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Detect critical parsing errors and formatting red flags before applying.
            </p>
          </div>

          <div
            onClick={() => onNavigate('interview-prep')}
            className="bg-white border border-slate-200 hover:border-amber-400 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all">
              <Mic size={18} />
            </div>
            <h3 className="font-bold text-sm text-slate-800">AI Mock Interview</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Practice role-specific interview questions and get scored feedback.
            </p>
          </div>
        </div>

        {/* Quick Resume Upload & Role Matcher */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-primary-100 text-primary-700 text-xs flex items-center justify-center font-bold">
                1
              </span>
              Upload Resume Document
            </h2>
            <UploadZone
              onFileSelect={setUploadedFile}
              uploadedFile={uploadedFile}
              onClear={() => setUploadedFile(null)}
            />
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-primary-100 text-primary-700 text-xs flex items-center justify-center font-bold">
                  2
                </span>
                Select Target Career Track
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map((role) => (
                  <button
                    key={role}
                    onClick={() => setTargetRole(role)}
                    className={`p-2.5 rounded-xl text-left text-xs font-semibold transition-all border ${
                      targetRole === role
                        ? 'bg-primary-50 border-primary-400 text-primary-800 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={handleAnalyze}
                disabled={!uploadedFile || loading}
                className="btn-primary flex items-center gap-2 text-xs py-2.5 px-6"
              >
                <Sparkles size={14} />
                Run Resume Intelligence Analysis
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
