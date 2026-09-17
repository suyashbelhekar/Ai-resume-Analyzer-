import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import {
  Edit3,
  Sparkles,
  Zap,
  Check,
  Copy,
  ArrowRight,
  ShieldCheck,
  Sliders,
  RotateCcw,
  Plus
} from 'lucide-react'
import apiService from '../services/api'
import { useCareer } from '../context/CareerContext'
import { useResume } from '../context/ResumeContext'

const modes = [
  { id: 'improve', label: 'Improve Impact', icon: Sparkles, desc: 'Enhance clarity, action verbs, and tone' },
  { id: 'ats_optimize', label: 'ATS Optimize', icon: ShieldCheck, desc: 'Inject industry keywords naturally' },
  { id: 'make_technical', label: 'Make Technical', icon: Zap, desc: 'Highlight architecture and engineering depth' },
  { id: 'make_concise', label: 'Make Concise', icon: Sliders, desc: 'Trim wordiness and remove fluff' },
  { id: 'quantify', label: 'Quantify Metrics', icon: Plus, desc: 'XYZ formula with honest placeholders' },
  { id: 'professional', label: 'Executive Polish', icon: Edit3, desc: 'Elevate to senior-level corporate polish' },
]

const sectionTypes = [
  'Professional Summary',
  'Experience Bullet',
  'Project Description',
  'Technical Skills',
  'Key Achievement'
]

export default function RewriterPage({ onNavigate }) {
  const { targetJD } = useCareer()
  const resumeCtx = useResume()

  const [content, setContent] = useState('')
  const [sectionType, setSectionType] = useState('Experience Bullet')
  const [selectedMode, setSelectedMode] = useState('improve')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleRewrite = async (mode = selectedMode) => {
    if (!content.trim() || content.length < 5) {
      toast.error('Please enter the text you want to rewrite.')
      return
    }

    setLoading(true)
    setSelectedMode(mode)
    try {
      const res = await apiService.rewriteSection(content, sectionType, mode, targetJD)
      setResult(res.data)
      toast.success(`Rewritten with "${modes.find((m) => m.id === mode)?.label}"!`)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Rewriting failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (!result?.rewritten_text) return
    navigator.clipboard.writeText(result.rewritten_text)
    setCopied(true)
    toast.success('Copied improved text to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleApplyToBuilder = () => {
    if (!result?.rewritten_text || !resumeCtx) return

    if (sectionType === 'Professional Summary') {
      resumeCtx.updateSummary(result.rewritten_text)
      toast.success('Applied to Resume Builder Summary!')
      onNavigate('builder')
    } else {
      toast.success('Copied text! Navigate to Resume Builder to paste into your target section.')
      navigator.clipboard.writeText(result.rewritten_text)
      onNavigate('builder')
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-violet-100 text-violet-700">
              <Edit3 size={18} />
            </span>
            <span className="text-xs font-bold text-violet-700 uppercase tracking-wider">
              Anti-Hallucination AI Resume Rewriter
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            AI Resume Rewriter
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Transform weak bullets and summaries into high-impact ATS-optimized achievements without fabricating facts.
          </p>
        </div>

        {targetJD && (
          <span className="text-xs px-3 py-1 bg-primary-50 text-primary-700 font-semibold rounded-full border border-primary-100">
            Aligned with Target JD
          </span>
        )}
      </div>

      {/* Control Grid */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        {/* Section Type Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Target Section Type
          </label>
          <div className="flex flex-wrap gap-2">
            {sectionTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSectionType(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  sectionType === type
                    ? 'bg-primary-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Input Textarea */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Original Text to Improve
          </label>
          <textarea
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="e.g. Worked on backend microservices with python and helped speed up the database queries for the team."
            className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all leading-relaxed"
          />
        </div>

        {/* Action Mode Pills */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Select Transformation Mode
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {modes.map((m) => {
              const Icon = m.icon
              const isSelected = selectedMode === m.id
              return (
                <button
                  key={m.id}
                  onClick={() => handleRewrite(m.id)}
                  disabled={loading}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-primary-50 border-primary-400 text-primary-800 shadow-2xs'
                      : 'bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon size={14} className={isSelected ? 'text-primary-600' : 'text-slate-400'} />
                    <span className="text-xs font-bold">{m.label}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">{m.desc}</p>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Before / After Comparison Display */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Before Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Before (Original Text)
                </span>
                <p className="text-xs text-slate-600 leading-relaxed font-mono">
                  {result.original_text}
                </p>
              </div>

              {/* After Card */}
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-5 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    After (AI-Improved Text)
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleCopy}
                      className="p-1.5 rounded-lg bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 text-xs font-medium flex items-center gap-1 transition-all"
                    >
                      {copied ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs text-emerald-900 font-medium leading-relaxed bg-white/80 p-3 rounded-xl border border-emerald-100">
                  {result.rewritten_text}
                </p>

                {/* Improvements breakdown */}
                {result.improvements_made?.length > 0 && (
                  <div className="pt-2 border-t border-emerald-200/60 space-y-1">
                    <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                      Adjustments Made:
                    </p>
                    {result.improvements_made.map((imp, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px] text-emerald-700">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{imp}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Action Strip */}
            <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span>Zero fabricated metrics. Quantifiable placeholders inserted where applicable.</span>
              </div>

              <button
                onClick={handleApplyToBuilder}
                className="btn-primary flex items-center gap-1.5 text-xs py-2 px-5"
              >
                Apply to Resume Builder
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
