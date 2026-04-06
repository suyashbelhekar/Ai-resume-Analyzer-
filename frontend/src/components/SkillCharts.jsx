import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts'
import { motion } from 'framer-motion'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-lg">
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-xs mt-1" style={{ color: p.color }}>
            {p.name}: {p.value}%
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function SkillRadarChart({ matched, missing, total }) {
  const categories = ['Core Skills', 'Technical', 'Tools', 'Frameworks', 'Concepts', 'Soft Skills']
  const matchPct = total > 0 ? Math.round((matched / total) * 100) : 0
  const data = categories.map((cat, i) => ({
    subject: cat,
    You: Math.max(10, matchPct - (i * 5) + Math.floor(Math.random() * 15)),
    Required: 100,
  }))

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 }}
      className="glass-card"
    >
      <h3 className="text-sm font-semibold text-slate-600 mb-4">Skill Radar</h3>
      <ResponsiveContainer width="100%" height={240}>
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(0,0,0,0.06)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <Radar name="Required" dataKey="Required" stroke="rgba(99,102,241,0.2)" fill="rgba(99,102,241,0.05)" strokeWidth={1} />
          <Radar name="You" dataKey="You" stroke="#6366f1" fill="rgba(99,102,241,0.15)" strokeWidth={2} />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

export function SkillBarChart({ matchedSkills, missingSkills }) {
  const data = [
    { name: 'Matched', value: matchedSkills.length, fill: '#10b981' },
    { name: 'Missing', value: missingSkills.length, fill: '#ef4444' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
      className="glass-card"
    >
      <h3 className="text-sm font-semibold text-slate-600 mb-4">Skill Breakdown</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} barSize={48}>
          <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#cbd5e1', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.04)' }} />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
