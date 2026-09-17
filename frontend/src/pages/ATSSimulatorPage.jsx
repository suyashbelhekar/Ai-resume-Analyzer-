import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import {
  ShieldCheck,
  AlertCircle,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  CheckCircle2,
  FileText,
  Upload,
  BarChart3,
  Award
} from 'lucide-react'
import apiService from '../services/api'
import { useCareer } from '../context/CareerContext'
import UploadZone from '../components/UploadZone'
import CircularScore from '../components/CircularScore'

export default function ATSSimulatorPage({ onNavigate }) {
  const { resumeText, targetJD, uploadedFile, setUploadedFile, atsResult, setAtsResult } = useCareer()
  const [loading, setLoading] = useState(false)
  const [pasteText, setPasteText] = useState(resumeText || '')

  const handleRunSimulation = async () => {
    if (!uploadedFile && !pasteText.trim()) {
      toast.error('Please upload a resume file or paste resume text.')
      return
    }

    setLoading(true)
    try {
      let res
      if (uploadedFile) {
        const formData = new FormData()
        formData.append('file', uploadedFile)
        if (targetJD) formData.append('jd_text', targetJD)
        res = await apiService.simulateATS(formData, true)
      } else {
        const formData = new FormData()
        formData.append('resume_text', pasteText)
        if (targetJD) formData.append('jd_text', targetJD)
        res = await apiService.simulateATS(formData, true)
      }

      setAtsResult(res.data)
      toast.success('ATS Simulation complete!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'ATS Simulation failed.')
    } finally {
      setLoading(false)
    }
  }

  const score = atsResult?.ats_score || 0
  const subScores = atsResult?.sub_scores || {}

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
              <ShieldCheck size={18} />
            </span>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Transparent Recruiter & ATS Algorithm
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            ATS Simulator & Compliance Auditor
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Simulate how top Applicant Tracking Systems (Workday, Greenhouse, Lever, Taleo) parse and score your resume.
          </p>
        </div>

        <button
          onClick={handleRunSimulation}
          disabled={loading || (!uploadedFile && !pasteText.trim())}
          className="btn-primary flex items-center gap-2 text-xs py-2 px-5"
        >
          <Sparkles size={14} />
          {loading ? 'Simulating ATS...' : 'Run ATS Simulation'}
        </button>
      </div>

      {/* Upload / Input Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Upload size={14} className="text-primary-600" />
            Upload Resume Document
          </h2>
          <UploadZone
            onFileSelect={setUploadedFile}
            uploadedFile={uploadedFile}
            onClear={() => setUploadedFile(null)}
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
              <FileText size={14} className="text-primary-600" />
              Or Paste Resume Text
            </h2>
            <textarea
              rows={6}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="Paste raw resume text here if not uploading a file..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:bg-white transition-all font-mono"
            />
          </div>

          <p className="text-[11px] text-slate-400 mt-2">
            {targetJD ? '✓ Comparing against target JD keywords' : '• Generic ATS format & structure audit'}
          </p>
        </div>
      </div>

      {/* ATS Simulation Results */}
      <AnimatePresence>
        {atsResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Top Score & Sub-Scores Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Circular Score Gauge */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col items-center justify-center text-center">
                <CircularScore score={score} label="Overall ATS Score" size={150} />
                <div className="mt-3">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      score >= 80
                        ? 'bg-emerald-100 text-emerald-800'
                        : score >= 60
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {score >= 80 ? 'ATS Optimized' : score >= 60 ? 'Needs Improvement' : 'High Risk of Rejection'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  {atsResult.word_count} words • {atsResult.sections_detected?.length || 0} sections verified
                </p>
              </div>

              {/* Sub-Score Breakdown Bars */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs lg:col-span-2 space-y-3.5">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Algorithmic Score Breakdown
                </h3>

                {[
                  { label: 'Keyword Coverage', val: subScores.keywords || 75, color: 'from-emerald-500 to-teal-500' },
                  { label: 'Section Structure & Headers', val: subScores.structure || 85, color: 'from-primary-500 to-indigo-500' },
                  { label: 'Readability & Action Verbs', val: subScores.readability || 70, color: 'from-violet-500 to-purple-500' },
                  { label: 'Job Description Alignment', val: subScores.jd_alignment || 80, color: 'from-amber-500 to-orange-500' },
                  { label: 'Formatting & Contact Info', val: subScores.formatting || 90, color: 'from-blue-500 to-cyan-500' },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{item.label}</span>
                      <span>{item.val}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.val}%` }}
                        transition={{ duration: 0.8 }}
                        className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Categorized Findings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Critical Issues */}
              <div className="bg-red-50/50 border border-red-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <AlertCircle size={17} className="text-red-600" />
                  <h3 className="text-xs font-bold text-red-900 uppercase tracking-wider">Critical Issues</h3>
                  <span className="ml-auto text-xs px-2 py-0.5 bg-red-100 text-red-700 font-bold rounded-full">
                    {atsResult.critical_issues?.length || 0}
                  </span>
                </div>
                {atsResult.critical_issues?.length === 0 ? (
                  <p className="text-xs text-emerald-700 font-medium">✓ No critical blocking issues detected.</p>
                ) : (
                  <div className="space-y-2">
                    {atsResult.critical_issues.map((iss, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-red-800">
                        <span className="text-red-500 font-bold">•</span>
                        <span>{iss}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Warnings */}
              <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={17} className="text-amber-600" />
                  <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">Warnings</h3>
                  <span className="ml-auto text-xs px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded-full">
                    {atsResult.warnings?.length || 0}
                  </span>
                </div>
                {atsResult.warnings?.length === 0 ? (
                  <p className="text-xs text-slate-500">No major warnings.</p>
                ) : (
                  <div className="space-y-2">
                    {atsResult.warnings.map((warn, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-amber-900">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{warn}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Suggestions */}
              <div className="bg-blue-50/50 border border-blue-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Lightbulb size={17} className="text-blue-600" />
                  <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider">Optimization Tips</h3>
                  <span className="ml-auto text-xs px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded-full">
                    {atsResult.suggestions?.length || 0}
                  </span>
                </div>
                <div className="space-y-2">
                  {atsResult.suggestions?.map((sugg, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-blue-900">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>{sugg}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
