import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import {
  FileSearch,
  Upload,
  Sparkles,
  Bookmark,
  ArrowRight,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  Layers,
  Award,
  ListChecks,
  Key,
  Trash2
} from 'lucide-react'
import apiService from '../services/api'
import { useCareer } from '../context/CareerContext'

export default function JDAnalyzerPage({ onNavigate }) {
  const { targetJD, setTargetJD, parsedJD, setParsedJD, savedJDs, refreshJDs, setTargetRole } = useCareer()
  const [jdInput, setJdInput] = useState(targetJD || '')
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('paste') // paste | saved

  const handleAnalyze = async () => {
    if (!jdInput.trim() && !selectedFile) {
      toast.error('Please paste a Job Description or upload a JD document.')
      return
    }

    setLoading(true)
    try {
      let res
      if (selectedFile) {
        const formData = new FormData()
        formData.append('file', selectedFile)
        res = await apiService.analyzeJD(formData, true)
      } else {
        res = await apiService.analyzeJD({ jd_text: jdInput }, false)
      }

      const data = res.data
      setParsedJD(data)
      setTargetJD(data.raw_text || jdInput)
      if (data.job_title) {
        setTargetRole(data.job_title)
      }
      toast.success('Job Description analyzed successfully!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to analyze Job Description.')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveJD = async () => {
    if (!parsedJD) return
    try {
      await apiService.saveJD(
        parsedJD.job_title || 'Target Role',
        parsedJD.company || '',
        targetJD || jdInput,
        parsedJD
      )
      toast.success('Job Description saved to library!')
      refreshJDs()
    } catch (e) {
      toast.error('Failed to save Job Description.')
    }
  }

  const handleLoadSaved = (jd) => {
    setParsedJD(jd.parsed_data || null)
    setTargetJD(jd.raw_text || '')
    setJdInput(jd.raw_text || '')
    if (jd.title) setTargetRole(jd.title)
    toast.success(`Loaded "${jd.title}"`)
  }

  const handleDeleteSaved = async (id, e) => {
    e.stopPropagation()
    try {
      await apiService.deleteJD(id)
      toast.success('Deleted saved JD.')
      refreshJDs()
    } catch {
      toast.error('Failed to delete JD.')
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-primary-100 text-primary-600">
              <FileSearch size={18} />
            </span>
            <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
              JD Intelligence Parser
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Job Description Analyzer
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Extract required skills, ATS keywords, seniority, and responsibilities directly from any job posting.
          </p>
        </div>

        {parsedJD && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveJD}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition-all"
            >
              <Bookmark size={14} className="text-primary-600" />
              Save to Library
            </button>
            <button
              onClick={() => onNavigate('analysis-flow')}
              className="btn-primary flex items-center gap-1.5 text-xs py-2 px-4 shadow-sm"
            >
              Match With Resume
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        {/* Tab selector */}
        <div className="flex border-b border-slate-100 px-6 pt-3 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('paste')}
            className={`pb-3 px-3 text-xs font-bold transition-colors border-b-2 ${
              activeTab === 'paste'
                ? 'text-primary-600 border-primary-600'
                : 'text-slate-400 border-transparent hover:text-slate-600'
            }`}
          >
            Paste or Upload JD
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`pb-3 px-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'saved'
                ? 'text-primary-600 border-primary-600'
                : 'text-slate-400 border-transparent hover:text-slate-600'
            }`}
          >
            Saved JDs
            <span className="text-[10px] px-1.5 py-0.2 bg-slate-200 text-slate-600 rounded-full font-bold">
              {savedJDs.length}
            </span>
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'paste' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Paste Target Job Posting / Description
                </label>
                <textarea
                  rows={6}
                  value={jdInput}
                  onChange={(e) => setJdInput(e.target.value)}
                  placeholder="Paste the full job posting here (e.g. Senior Data Engineer at Acme Corp — Responsibilities, Qualifications, Requirements...)"
                  className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all font-mono"
                />
              </div>

              {/* Upload file fallback */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                    <Upload size={13} className="text-slate-400" />
                    <span>{selectedFile ? selectedFile.name : 'Upload JD Document (PDF/DOCX/TXT)'}</span>
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc,.txt"
                      className="hidden"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                    />
                  </label>
                  {selectedFile && (
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="btn-primary flex items-center gap-2 text-xs py-2 px-5"
                >
                  <Sparkles size={14} />
                  {loading ? 'Analyzing with AI...' : 'Analyze Job Description'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {savedJDs.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">
                  No saved Job Descriptions yet. Paste a JD above and click "Save to Library".
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedJDs.map((jd) => (
                    <div
                      key={jd.id}
                      onClick={() => handleLoadSaved(jd)}
                      className="p-4 rounded-xl border border-slate-200 hover:border-primary-300 hover:bg-primary-50/30 transition-all cursor-pointer flex items-start justify-between group"
                    >
                      <div>
                        <p className="font-bold text-sm text-slate-800">{jd.title}</p>
                        {jd.company && <p className="text-xs text-slate-500">{jd.company}</p>}
                        <p className="text-[11px] text-slate-400 mt-1">
                          Saved on {new Date(jd.created_at * 1000).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteSaved(jd.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Structured Analysis Results */}
      <AnimatePresence>
        {parsedJD && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Summary Banner */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary-500/30 text-primary-200 font-bold uppercase tracking-wider">
                    {parsedJD.seniority_level || 'Mid-Level'}
                  </span>
                  <h2 className="text-2xl font-bold mt-2 text-white">
                    {parsedJD.job_title || 'Identified Role'}
                  </h2>
                  {parsedJD.company && (
                    <p className="text-sm text-indigo-200 font-medium">{parsedJD.company}</p>
                  )}
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-3xl">
                    {parsedJD.summary}
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15 text-center shrink-0 min-w-[120px]">
                  <p className="text-[11px] text-indigo-200 font-medium">Experience</p>
                  <p className="text-sm font-bold text-white mt-0.5">
                    {parsedJD.experience_years || 'Not specified'}
                  </p>
                </div>
              </div>
            </div>

            {/* Grid of Extracted Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Required Must-Have Skills */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-800">Required Core Skills</h3>
                  <span className="ml-auto text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 font-semibold rounded-full">
                    {parsedJD.required_skills?.length || 0}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {parsedJD.required_skills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Preferred / Nice-to-Have Skills */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
                <div className="flex items-center gap-2 mb-3">
                  <Layers size={16} className="text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-800">Preferred & Bonus Skills</h3>
                  <span className="ml-auto text-xs px-2 py-0.5 bg-indigo-50 text-indigo-700 font-semibold rounded-full">
                    {parsedJD.preferred_skills?.length || 0}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {parsedJD.preferred_skills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 capitalize"
                    >
                      {skill}
                    </span>
                  ))}
                  {(!parsedJD.preferred_skills || parsedJD.preferred_skills.length === 0) && (
                    <p className="text-xs text-slate-400">None explicitly separated.</p>
                  )}
                </div>
              </div>

              {/* Technologies & Tech Stack */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase size={16} className="text-violet-600" />
                  <h3 className="text-sm font-bold text-slate-800">Technologies & Tooling</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {parsedJD.technologies?.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* High-Value ATS Keywords */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
                <div className="flex items-center gap-2 mb-3">
                  <Key size={16} className="text-amber-500" />
                  <h3 className="text-sm font-bold text-slate-800">High-Priority ATS Keywords</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {parsedJD.keywords?.map((kw, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Core Responsibilities */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs md:col-span-2">
                <div className="flex items-center gap-2 mb-3">
                  <ListChecks size={16} className="text-primary-600" />
                  <h3 className="text-sm font-bold text-slate-800">Key Responsibilities</h3>
                </div>
                <div className="space-y-2">
                  {parsedJD.responsibilities?.map((resp, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0" />
                      <p className="leading-relaxed">{resp}</p>
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
