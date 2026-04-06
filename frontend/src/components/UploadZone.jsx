import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, X, CheckCircle } from 'lucide-react'

export default function UploadZone({ onFileSelect, uploadedFile, onClear }) {
  const [isDragActive, setIsDragActive] = useState(false)

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) onFileSelect(acceptedFiles[0])
    setIsDragActive(false)
  }, [onFileSelect])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  })

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (uploadedFile) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-emerald-50 rounded-2xl p-6 border border-emerald-200"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
            <FileText size={22} className="text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-700 truncate">{uploadedFile.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <CheckCircle size={13} className="text-emerald-500" />
              <span className="text-xs text-emerald-600">Ready to analyze</span>
              <span className="text-xs text-slate-400">• {formatSize(uploadedFile.size)}</span>
            </div>
          </div>
          <button
            onClick={onClear}
            className="p-2 rounded-lg hover:bg-emerald-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      {...getRootProps()}
      animate={{
        borderColor: isDragActive ? 'rgba(99,102,241,0.5)' : 'rgba(203,213,225,1)',
        backgroundColor: isDragActive ? 'rgba(99,102,241,0.04)' : 'rgba(248,250,252,1)',
      }}
      transition={{ duration: 0.2 }}
      className="relative rounded-2xl border-2 border-dashed cursor-pointer p-10 text-center transition-all"
    >
      <input {...getInputProps()} />
      <AnimatePresence mode="wait">
        {isDragActive ? (
          <motion.div key="drag" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-4">
              <Upload size={28} className="text-primary-500" />
            </div>
            <p className="text-primary-600 font-semibold text-lg">Drop it here</p>
          </motion.div>
        ) : (
          <motion.div key="idle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Upload size={28} className="text-slate-400" />
            </div>
            <p className="text-slate-700 font-semibold text-lg mb-1">Drop your resume here</p>
            <p className="text-slate-400 text-sm mb-4">or click to browse files</p>
            <div className="flex items-center justify-center gap-3">
              {['PDF', 'DOCX', 'DOC'].map((fmt) => (
                <span key={fmt} className="px-3 py-1 rounded-full bg-white text-xs text-slate-500 border border-slate-200">
                  {fmt}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-300 mt-3">Max file size: 10MB</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
