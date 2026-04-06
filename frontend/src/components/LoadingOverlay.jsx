import { motion } from 'framer-motion'
import { Brain } from 'lucide-react'

const steps = [
  'Extracting text from resume...',
  'Running NLP analysis...',
  'Identifying skills with NER...',
  'Calculating match score...',
  'Generating recommendations...',
]

export default function LoadingOverlay({ step = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-10 max-w-sm w-full mx-4 text-center shadow-2xl border border-slate-100"
      >
        <div className="relative w-20 h-20 mx-auto mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary-500 border-r-violet-500"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-2 rounded-full border-2 border-transparent border-t-violet-400 border-l-primary-400"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <Brain size={28} className="text-primary-500" />
            </motion.div>
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-800 mb-2">Analyzing Resume</h3>
        <p className="text-sm text-slate-400 mb-6">Our AI is processing your resume...</p>

        <div className="space-y-2 text-left">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: i <= step ? 1 : 0.3, x: 0 }}
              transition={{ delay: i * 0.3 }}
              className="flex items-center gap-3"
            >
              <div className={`w-2 h-2 rounded-full shrink-0 ${
                i < step ? 'bg-emerald-400' :
                i === step ? 'bg-primary-500 animate-pulse' :
                'bg-slate-200'
              }`} />
              <span className={`text-xs ${i <= step ? 'text-slate-600' : 'text-slate-300'}`}>{s}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
