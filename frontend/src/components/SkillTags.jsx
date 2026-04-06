import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Plus } from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } }
}
const item = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1 }
}

export function MatchedSkills({ skills }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle size={16} className="text-emerald-500" />
        <h3 className="text-sm font-semibold text-slate-700">Matched Skills</h3>
        <span className="ml-auto text-xs text-emerald-600 font-medium">{skills.length} skills</span>
      </div>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-wrap gap-2"
      >
        {skills.map((skill) => (
          <motion.span key={skill} variants={item} className="skill-matched capitalize">
            {skill}
          </motion.span>
        ))}
        {skills.length === 0 && (
          <p className="text-sm text-slate-400">No matching skills found.</p>
        )}
      </motion.div>
    </div>
  )
}

export function MissingSkills({ skills }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <XCircle size={16} className="text-red-500" />
        <h3 className="text-sm font-semibold text-slate-700">Skill Gaps</h3>
        <span className="ml-auto text-xs text-red-500 font-medium">{skills.length} missing</span>
      </div>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-wrap gap-2"
      >
        {skills.map((skill) => (
          <motion.span key={skill} variants={item} className="skill-missing capitalize">
            {skill}
          </motion.span>
        ))}
        {skills.length === 0 && (
          <p className="text-sm text-emerald-600">No skill gaps — great match!</p>
        )}
      </motion.div>
    </div>
  )
}

export function ExtraSkills({ skills }) {
  if (!skills || skills.length === 0) return null
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Plus size={16} className="text-blue-500" />
        <h3 className="text-sm font-semibold text-slate-700">Bonus Skills</h3>
        <span className="ml-auto text-xs text-blue-500 font-medium">{skills.length} extra</span>
      </div>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-wrap gap-2"
      >
        {skills.slice(0, 12).map((skill) => (
          <motion.span key={skill} variants={item} className="skill-extra capitalize">
            {skill}
          </motion.span>
        ))}
      </motion.div>
    </div>
  )
}
