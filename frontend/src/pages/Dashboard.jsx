import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import {
  Sparkles, ChevronRight, TrendingUp, Target,
  BookOpen, Cpu, LogIn, LogOut
} from 'lucide-react'
import UploadZone from '../components/UploadZone'
import LoadingOverlay from '../components/LoadingOverlay'
import AuthModal from '../components/AuthModal'
import { useAuth } from '../context/AuthContext'
import mockAPI from '../mockAPI'

const ROLES = [
  'Data Scientist', 'Software Engineer', 'Frontend Developer',
  'Backend Developer', 'DevOps Engineer', 'Machine Learning Engineer',
  'Product Manager', 'Cybersecurity Analyst'
]

const roleIcons = {
  'Data Scientist': '📊', 'Software Engineer': '💻', 'Frontend Developer': '🎨',
  'Backend Developer': '⚙️', 'DevOps Engineer': '🚀', 'Machine Learning Engineer': '🧠',
  'Product Manager': '📋', 'Cybersecurity Analyst': '🔒',
}

const stats = [
  { label: 'Job Roles',     value: '8+',   icon: Target,   color: 'text-primary-600', bg: 'bg-primary-50' },
  { label: 'Skills Tracked',value: '200+', icon: Cpu,      color: 'text-violet-600',  bg: 'bg-violet-50'  },
  { label: 'Accuracy',      value: '94%',  icon: TrendingUp,color: 'text-emerald-600',bg: 'bg-emerald-50' },
  { label: 'Courses',       value: '50+',  icon: BookOpen, color: 'text-amber-600',   bg: 'bg-amber-50'   },
]

export default function Dashboard({ onNavigate, analysisResult, setAnalysisResult, uploadedFile, setUploadedFile, useMockAPI }) {
  const { user, logout } = useAuth()
  const [selectedRole, setSelectedRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [showAuth, setShowAuth] = useState(false)

  const handleAnalyze = async () => {
    if (!uploadedFile) return toast.error('Please upload your resume first.')
    if (!selectedRole) return toast.error('Please select a target job role.')
    setLoading(true)
    setLoadingStep(0)
    const stepInterval = setInterval(() => {
      setLoadingStep(prev => Math.min(prev + 1, 4))
    }, 800)
    try {
      let data
      if (useMockAPI) {
        data = await mockAPI.analyzeResume(uploadedFile, selectedRole)
      } else {
        const formData = new FormData()
        formData.append('file', uploadedFile)
        formData.append('job_role', selectedRole)
        const response = await axios.post('/api/analyze', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        data = response.data
      }
      clearInterval(stepInterval)
      setLoadingStep(4)
      await new Promise(r => setTimeout(r, 500))
      setAnalysisResult(data)
      toast.success('Analysis complete!')
      onNavigate('analysis')
    } catch (err) {
      clearInterval(stepInterval)
      toast.error(err.response?.data?.detail || 'Analysis failed. Please try again.')
    } finally {
      setLoading(false)
      setLoadingStep(0)
    }
  }

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingOverlay step={loadingStep} />}
      </AnimatePresence>

      {/* Auth modal rendered at root level so it overlays everything */}
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={() => setShowAuth(false)}
        />
      )}

      <div className="p-8 max-w-6xl mx-auto">

        {/* ── Top bar: badge + auth button ── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">

          <div className="flex items-center justify-between mb-3">
            {/* Left: AI badge */}
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-primary-600" />
              <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">
                AI-Powered Analysis
              </span>
            </div>

            {/* Right: Login/Register OR user chip + sign out */}
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary-50 border border-primary-100">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold leading-none">
                      {user.full_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-primary-700">
                    {user.full_name.split(' ')[0]}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => { logout(); toast.success('Signed out.') }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 text-sm font-medium transition-colors"
                >
                  <LogOut size={14} /> Sign Out
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowAuth(true)}
                className="btn-primary flex items-center gap-2 text-sm py-2.5 px-5"
              >
                <LogIn size={15} />
                Login / Register
              </motion.button>
            )}
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Resume Skill Gap <span className="gradient-text">Analyzer</span>
          </h1>
          {user
            ? <p className="text-slate-500 text-lg">
                Welcome back, <span className="font-semibold text-slate-700">{user.full_name}</span>! Ready to analyze?
              </p>
            : <p className="text-slate-500 text-lg">
                Upload your resume, pick a role, and get instant AI-powered insights.
              </p>
          }
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }} className="glass-card flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                  <Icon size={18} className={stat.color} />
                </div>
                <div>
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-slate-400">{stat.label}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Upload + Role selection */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }} className="glass-card">
            <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-primary-100 text-primary-600 text-xs flex items-center justify-center font-bold">1</span>
              Upload Resume
            </h2>
            <UploadZone onFileSelect={setUploadedFile} uploadedFile={uploadedFile} onClear={() => setUploadedFile(null)} />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }} className="glass-card">
            <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-primary-100 text-primary-600 text-xs flex items-center justify-center font-bold">2</span>
              Select Target Role
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map((role) => (
                <motion.button key={role} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedRole(role)}
                  className={`p-3 rounded-xl text-left text-sm transition-all duration-200 border ${
                    selectedRole === role
                      ? 'bg-primary-50 border-primary-300 text-primary-700 font-medium'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-white'
                  }`}>
                  <span className="mr-2">{roleIcons[role]}</span>{role}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Analyze button */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }} className="mt-6 flex justify-center">
          <motion.button onClick={handleAnalyze}
            disabled={!uploadedFile || !selectedRole || loading}
            whileHover={{ scale: uploadedFile && selectedRole ? 1.03 : 1 }}
            whileTap={{ scale: 0.97 }}
            className={`btn-primary flex items-center gap-3 text-base px-10 py-4 ${
              (!uploadedFile || !selectedRole) ? 'opacity-40 cursor-not-allowed' : ''
            }`}>
            <Sparkles size={18} />
            Analyze Resume
            <ChevronRight size={18} />
          </motion.button>
        </motion.div>

        {analysisResult && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center">
            <button onClick={() => onNavigate('analysis')}
              className="text-sm text-primary-600 hover:text-primary-700 underline underline-offset-4">
              View previous analysis: {analysisResult.job_role} ({analysisResult.match_score}% match)
            </button>
          </motion.div>
        )}
      </div>
    </>
  )
}
