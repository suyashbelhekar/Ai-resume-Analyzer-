import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import {
  FileText, Download, Eye, Edit3, Palette,
  RotateCcw, CheckCircle, Zap, ChevronRight
} from 'lucide-react'
import { ResumeProvider, useResume } from '../context/ResumeContext'
import ResumeForm from './builder/ResumeForm'
import ResumePreview from './builder/ResumePreview'
import TemplateSelector from './builder/TemplateSelector'

function CompletionBar() {
  const { completionScore } = useResume()
  const color = completionScore >= 80 ? '#10b981' : completionScore >= 50 ? '#f59e0b' : '#6366f1'
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${completionScore}%`, background: color }}
        />
      </div>
      <span className="text-xs font-bold shrink-0" style={{ color }}>{completionScore}%</span>
    </div>
  )
}

function BuilderContent({ analysisResult }) {
  const [activeTab, setActiveTab] = useState('edit') // edit | template | preview
  const { resetResume, resumeData, selectedTemplate } = useResume()
  const [downloading, setDownloading] = useState(false)
  const previewRef = useRef(null)

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const html2pdf = (await import('html2pdf.js')).default
      const element = document.getElementById('resume-preview')
      if (!element) { toast.error('Preview not found.'); return }

      const opt = {
        margin: 0,
        filename: `${resumeData.personal.name || 'resume'}_${selectedTemplate}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      }
      await html2pdf().set(opt).from(element).save()
      toast.success('Resume downloaded!')
    } catch (e) {
      toast.error('Download failed. Try again.')
    } finally {
      setDownloading(false)
    }
  }

  const tabs = [
    { id: 'edit', label: 'Edit', icon: Edit3 },
    { id: 'template', label: 'Templates', icon: Palette },
    { id: 'preview', label: 'Preview', icon: Eye },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center">
            <FileText size={15} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800">Resume Builder</h1>
            <p className="text-xs text-slate-400">Build, preview & download your resume</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {analysisResult && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
              <Zap size={12} className="text-emerald-500" />
              <span className="text-xs text-emerald-600 font-medium">Skills auto-filled from analyzer</span>
            </div>
          )}
          <button
            onClick={() => { resetResume(); toast.success('Resume cleared') }}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            title="Reset"
          >
            <RotateCcw size={15} />
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleDownload}
            disabled={downloading}
            className="btn-primary flex items-center gap-2 text-sm py-2 px-4"
          >
            <Download size={15} />
            {downloading ? 'Generating...' : 'Download PDF'}
          </motion.button>
        </div>
      </div>

      {/* Completion bar */}
      <div className="px-6 py-2 bg-white border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 shrink-0">Profile completion</span>
          <CompletionBar />
        </div>
      </div>

      {/* Mobile tabs */}
      <div className="flex border-b border-slate-200 bg-white shrink-0 lg:hidden">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
                activeTab === tab.id ? 'text-primary-600 border-b-2 border-primary-500' : 'text-slate-400'
              }`}>
              <Icon size={14} />{tab.label}
            </button>
          )
        })}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left panel — Form + Templates */}
        <div className={`w-full lg:w-[420px] shrink-0 flex flex-col border-r border-slate-200 overflow-hidden ${
          activeTab === 'preview' ? 'hidden lg:flex' : 'flex'
        }`}>
          {/* Desktop tabs */}
          <div className="hidden lg:flex border-b border-slate-200 bg-white shrink-0">
            {tabs.filter(t => t.id !== 'preview').map(tab => {
              const Icon = tab.icon
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'text-primary-600 border-primary-500'
                      : 'text-slate-400 border-transparent hover:text-slate-600'
                  }`}>
                  <Icon size={13} />{tab.label}
                </button>
              )
            })}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <AnimatePresence mode="wait">
              {activeTab === 'edit' && (
                <motion.div key="edit" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                  <ResumeForm />
                </motion.div>
              )}
              {activeTab === 'template' && (
                <motion.div key="template" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                  <TemplateSelector />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right panel — Live Preview */}
        <div className={`flex-1 bg-slate-100 overflow-y-auto ${
          activeTab !== 'preview' && activeTab !== 'edit' ? 'hidden lg:block' : ''
        } ${activeTab === 'edit' ? 'hidden lg:block' : ''}`}>
          <div className="sticky top-0 z-10 bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye size={13} className="text-slate-400" />
              <span className="text-xs font-medium text-slate-500">Live Preview</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white border border-slate-200">
              <CheckCircle size={11} className="text-emerald-500" />
              <span className="text-xs text-slate-500">Auto-updating</span>
            </div>
          </div>
          <div className="p-6" ref={previewRef}>
            <ResumePreview />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResumeBuilder({ analysisResult }) {
  return (
    <ResumeProvider analysisResult={analysisResult}>
      <div className="h-full flex flex-col">
        <BuilderContent analysisResult={analysisResult} />
      </div>
    </ResumeProvider>
  )
}
