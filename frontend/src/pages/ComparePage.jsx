import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { GitCompare, Trophy, TrendingUp, Upload } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import UploadZone from '../components/UploadZone'
import LoadingOverlay from '../components/LoadingOverlay'
import { demoCompareData } from '../demoData'

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl px-4 py-3 border border-slate-200 shadow-lg">
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        <p className="text-xs text-primary-600 mt-1">Match: {payload[0].value}%</p>
      </div>
    )
  }
  return null
}

export default function ComparePage({ result, setResult, uploadedFile, setUploadedFile, useDemoMode }) {
  const [loading, setLoading] = useState(false)

  const handleCompare = async () => {
    if (!uploadedFile) return toast.error('Please upload your resume first.')
    setLoading(true)
    try {
      let data
      if (useDemoMode) {
        // Use demo data for GitHub Pages
        await new Promise(resolve => setTimeout(resolve, 3000)) // Simulate API delay
        data = demoCompareData
        toast.success('Demo comparison complete!')
      } else {
        // Use real backend API
        const formData = new FormData()
        formData.append('file', uploadedFile)
        const response = await axios.post('/api/compare', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        data = response.data
        toast.success('Comparison complete!')
      }
      setResult(data)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Comparison failed.')
    } finally {
      setLoading(false)
    }
  }

  const chartData = result?.map((r) => ({
    name: r.role.replace(' Engineer', ' Eng.').replace(' Developer', ' Dev.'),
    score: r.score,
  })) || []

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingOverlay step={2} />}
      </AnimatePresence>

      <div className="p-8 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <GitCompare size={16} className="text-primary-600" />
            <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">Multi-Role</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-1">Compare All Roles</h1>
          <p className="text-slate-500">See how your resume stacks up across every job role at once.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }} className="glass-card mb-6">
          <h2 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Upload size={15} className="text-primary-600" />
            Upload Resume
          </h2>
          <UploadZone onFileSelect={setUploadedFile} uploadedFile={uploadedFile}
            onClear={() => { setUploadedFile(null); setResult(null) }} />
          <div className="mt-4 flex justify-end">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={handleCompare} disabled={!uploadedFile || loading}
              className={`btn-primary flex items-center gap-2 ${!uploadedFile ? 'opacity-40 cursor-not-allowed' : ''}`}>
              <GitCompare size={16} />
              Compare All Roles
            </motion.button>
          </div>
        </motion.div>

        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="glass-card mb-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                  <TrendingUp size={15} className="text-primary-600" />
                  Match Score by Role
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={chartData} barSize={36}>
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                    <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                      {chartData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {result.map((r, i) => {
                  const isTop = i === 0
                  const scoreColor = r.score >= 75 ? 'text-emerald-600' :
                    r.score >= 50 ? 'text-amber-600' : 'text-red-500'

                  return (
                    <motion.div key={r.role} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className={`bg-white rounded-2xl p-5 border relative shadow-sm ${
                        isTop ? 'border-primary-300 bg-primary-50/50' : 'border-slate-200'
                      }`}>
                      {isTop && (
                        <div className="absolute -top-2.5 left-4">
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500 text-xs font-bold text-white">
                            <Trophy size={10} /> Best Match
                          </span>
                        </div>
                      )}
                      <div className="flex items-start justify-between mb-3">
                        <p className="text-sm font-semibold text-slate-700 leading-tight">{r.role}</p>
                        <span className={`text-lg font-bold ${scoreColor}`}>{r.score}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${r.score}%` }}
                          transition={{ duration: 0.8, delay: 0.3 + i * 0.06 }}
                          className="h-full rounded-full"
                          style={{ background: COLORS[i % COLORS.length] }}
                        />
                      </div>
                      <p className="text-xs text-slate-400">{r.matched}/{r.total} skills matched</p>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
