import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { useResume } from '../../context/ResumeContext'

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    desc: 'Header bar + skills sidebar layout',
    color: '#6366f1',
    preview: 'bg-gradient-to-br from-indigo-500 to-violet-600',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    desc: 'Simple single-column, ATS-safe',
    color: '#0f172a',
    preview: 'bg-gradient-to-br from-slate-700 to-slate-900',
  },
  {
    id: 'creative',
    name: 'Creative',
    desc: 'Bold header with colorful accents',
    color: '#0ea5e9',
    preview: 'bg-gradient-to-br from-sky-400 to-cyan-600',
  },
  {
    id: 'professional',
    name: 'Professional',
    desc: 'Classic corporate style',
    color: '#1d4ed8',
    preview: 'bg-gradient-to-br from-blue-600 to-blue-800',
  },
  {
    id: 'ats',
    name: 'ATS Friendly',
    desc: 'Optimized for applicant tracking',
    color: '#059669',
    preview: 'bg-gradient-to-br from-emerald-500 to-teal-600',
  },
  {
    id: 'executive',
    name: 'Executive',
    desc: 'Premium dark header layout',
    color: '#7c3aed',
    preview: 'bg-gradient-to-br from-violet-600 to-purple-800',
  },
]

const TemplateMiniPreview = ({ template }) => (
  <div className="w-full h-28 rounded-lg overflow-hidden bg-white border border-slate-100 flex flex-col">
    {/* Header bar */}
    <div className={`h-7 w-full flex items-center px-2 gap-1.5 ${template.preview}`}>
      <div className="w-4 h-4 rounded-full bg-white/40 shrink-0" />
      <div className="flex flex-col gap-0.5 flex-1">
        <div className="h-1.5 bg-white/70 rounded-full w-16" />
        <div className="h-1 bg-white/40 rounded-full w-10" />
      </div>
      <div className="flex flex-col gap-0.5 items-end">
        <div className="h-1 bg-white/50 rounded-full w-10" />
        <div className="h-1 bg-white/50 rounded-full w-8" />
      </div>
    </div>
    {/* Body: main + sidebar */}
    <div className="flex flex-1 p-1.5 gap-1.5">
      <div className="flex-1 flex flex-col gap-1">
        <div className="h-1.5 bg-slate-200 rounded-full w-full" />
        <div className="h-1.5 bg-slate-200 rounded-full w-5/6" />
        <div className="h-1 bg-slate-100 rounded-full w-full mt-0.5" />
        <div className="h-1 bg-slate-100 rounded-full w-4/5" />
        <div className="h-1 bg-slate-100 rounded-full w-full" />
        <div className="h-1 bg-slate-100 rounded-full w-3/4" />
      </div>
      <div className="w-[30%] flex flex-col gap-1 border-l border-slate-100 pl-1.5">
        <div className="h-1.5 bg-slate-300 rounded-full w-full" />
        <div className="h-1 bg-slate-100 rounded-full w-full" />
        <div className="h-1 bg-slate-100 rounded-full w-5/6" />
        <div className="h-1 bg-slate-100 rounded-full w-full" />
        <div className="h-1 bg-slate-100 rounded-full w-4/5" />
      </div>
    </div>
  </div>
)

export default function TemplateSelector() {
  const { selectedTemplate, setSelectedTemplate, accentColor, setAccentColor } = useResume()

  const colors = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#0f172a', '#1d4ed8']

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Choose Template</h3>
        <div className="grid grid-cols-2 gap-3">
          {templates.map((t) => {
            const isActive = selectedTemplate === t.id
            return (
              <motion.button
                key={t.id}
                onClick={() => setSelectedTemplate(t.id)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className={`relative p-3 rounded-xl border-2 text-left transition-all ${
                  isActive
                    ? 'border-primary-400 bg-primary-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {isActive && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle size={14} className="text-primary-500" />
                  </div>
                )}
                <TemplateMiniPreview template={t} />
                <p className="text-xs font-semibold text-slate-700 mt-2">{t.name}</p>
                <p className="text-xs text-slate-400 leading-tight">{t.desc}</p>
              </motion.button>
            )
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Accent Color</h3>
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => (
            <motion.button
              key={c}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setAccentColor(c)}
              className={`w-7 h-7 rounded-full border-2 transition-all ${
                accentColor === c ? 'border-slate-400 scale-110' : 'border-transparent'
              }`}
              style={{ background: c }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
