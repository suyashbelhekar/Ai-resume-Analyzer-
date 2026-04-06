import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from 'lucide-react'
import { useResume } from '../../context/ResumeContext'

const inputCls = "w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-300 focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-100 transition-all"
const labelCls = "block text-xs font-medium text-slate-500 mb-1"

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <span className="text-sm font-semibold text-slate-700">{title}</span>
        {open ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Row({ children }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>
}

export default function ResumeForm() {
  const { resumeData, updatePersonal, updateSummary, updateSkills, addItem, removeItem, updateItem } = useResume()

  // Skills
  const handleSkillChange = (i, val) => {
    const updated = [...resumeData.skills]
    updated[i] = val
    updateSkills(updated)
  }
  const addSkill = () => updateSkills([...resumeData.skills, ''])
  const removeSkill = (i) => updateSkills(resumeData.skills.filter((_, idx) => idx !== i))

  return (
    <div className="space-y-3 pb-6">
      {/* Personal */}
      <Section title="👤 Personal Information">
        <div>
          <label className={labelCls}>Full Name *</label>
          <input className={inputCls} placeholder="John Doe" value={resumeData.personal.name}
            onChange={e => updatePersonal('name', e.target.value)} />
        </div>
        <Row>
          <div>
            <label className={labelCls}>Email *</label>
            <input className={inputCls} placeholder="john@email.com" value={resumeData.personal.email}
              onChange={e => updatePersonal('email', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input className={inputCls} placeholder="+1 234 567 8900" value={resumeData.personal.phone}
              onChange={e => updatePersonal('phone', e.target.value)} />
          </div>
        </Row>
        <Row>
          <div>
            <label className={labelCls}>LinkedIn</label>
            <input className={inputCls} placeholder="linkedin.com/in/johndoe" value={resumeData.personal.linkedin}
              onChange={e => updatePersonal('linkedin', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>GitHub</label>
            <input className={inputCls} placeholder="github.com/johndoe" value={resumeData.personal.github}
              onChange={e => updatePersonal('github', e.target.value)} />
          </div>
        </Row>
        <Row>
          <div>
            <label className={labelCls}>Location</label>
            <input className={inputCls} placeholder="New York, NY" value={resumeData.personal.location}
              onChange={e => updatePersonal('location', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Website</label>
            <input className={inputCls} placeholder="johndoe.dev" value={resumeData.personal.website}
              onChange={e => updatePersonal('website', e.target.value)} />
          </div>
        </Row>
      </Section>

      {/* Summary */}
      <Section title="📝 Summary / Objective">
        <div>
          <label className={labelCls}>Professional Summary</label>
          <textarea className={`${inputCls} resize-none`} rows={4}
            placeholder="Results-driven software engineer with 5+ years of experience..."
            value={resumeData.summary}
            onChange={e => updateSummary(e.target.value)} />
          <p className="text-xs text-slate-400 mt-1">{resumeData.summary.length} / 500 chars</p>
        </div>
      </Section>

      {/* Skills */}
      <Section title="⚡ Skills">
        <div className="flex flex-wrap gap-2">
          {resumeData.skills.map((skill, i) => (
            <div key={i} className="flex items-center gap-1 bg-primary-50 border border-primary-200 rounded-lg px-2 py-1">
              <input
                className="text-xs text-primary-700 bg-transparent outline-none w-24 placeholder-primary-300"
                placeholder="Add skill..."
                value={skill}
                onChange={e => handleSkillChange(i, e.target.value)}
              />
              <button onClick={() => removeSkill(i)} className="text-primary-400 hover:text-red-400 transition-colors">
                <Trash2 size={11} />
              </button>
            </div>
          ))}
          <button onClick={addSkill}
            className="flex items-center gap-1 px-3 py-1 rounded-lg border-2 border-dashed border-slate-300 text-xs text-slate-400 hover:border-primary-300 hover:text-primary-500 transition-all">
            <Plus size={12} /> Add Skill
          </button>
        </div>
      </Section>

      {/* Experience */}
      <Section title="💼 Experience">
        {resumeData.experience.map((exp, i) => (
          <motion.div key={exp.id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 relative">
            {resumeData.experience.length > 1 && (
              <button onClick={() => removeItem('experience', exp.id)}
                className="absolute top-2 right-2 p-1 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-400 transition-colors">
                <Trash2 size={13} />
              </button>
            )}
            <Row>
              <div>
                <label className={labelCls}>Company *</label>
                <input className={inputCls} placeholder="Google" value={exp.company}
                  onChange={e => updateItem('experience', exp.id, 'company', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Role *</label>
                <input className={inputCls} placeholder="Software Engineer" value={exp.role}
                  onChange={e => updateItem('experience', exp.id, 'role', e.target.value)} />
              </div>
            </Row>
            <Row>
              <div>
                <label className={labelCls}>Start Date</label>
                <input className={inputCls} placeholder="Jan 2022" value={exp.startDate}
                  onChange={e => updateItem('experience', exp.id, 'startDate', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>End Date</label>
                <input className={inputCls} placeholder="Present" value={exp.current ? 'Present' : exp.endDate}
                  disabled={exp.current}
                  onChange={e => updateItem('experience', exp.id, 'endDate', e.target.value)} />
              </div>
            </Row>
            <div className="flex items-center gap-2">
              <input type="checkbox" id={`current-${exp.id}`} checked={exp.current}
                onChange={e => updateItem('experience', exp.id, 'current', e.target.checked)}
                className="accent-primary-500" />
              <label htmlFor={`current-${exp.id}`} className="text-xs text-slate-500">Currently working here</label>
            </div>
            <div>
              <label className={labelCls}>Description</label>
              <textarea className={`${inputCls} resize-none`} rows={3}
                placeholder="• Led development of microservices architecture...&#10;• Improved performance by 40%..."
                value={exp.description}
                onChange={e => updateItem('experience', exp.id, 'description', e.target.value)} />
            </div>
          </motion.div>
        ))}
        <button onClick={() => addItem('experience', { company: '', role: '', startDate: '', endDate: '', current: false, description: '' })}
          className="w-full py-2 rounded-xl border-2 border-dashed border-slate-300 text-xs text-slate-400 hover:border-primary-300 hover:text-primary-500 transition-all flex items-center justify-center gap-1">
          <Plus size={13} /> Add Experience
        </button>
      </Section>

      {/* Education */}
      <Section title="🎓 Education">
        {resumeData.education.map((edu) => (
          <motion.div key={edu.id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 relative">
            {resumeData.education.length > 1 && (
              <button onClick={() => removeItem('education', edu.id)}
                className="absolute top-2 right-2 p-1 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-400 transition-colors">
                <Trash2 size={13} />
              </button>
            )}
            <div>
              <label className={labelCls}>Institution *</label>
              <input className={inputCls} placeholder="MIT" value={edu.institution}
                onChange={e => updateItem('education', edu.id, 'institution', e.target.value)} />
            </div>
            <Row>
              <div>
                <label className={labelCls}>Degree</label>
                <input className={inputCls} placeholder="B.S. Computer Science" value={edu.degree}
                  onChange={e => updateItem('education', edu.id, 'degree', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>GPA</label>
                <input className={inputCls} placeholder="3.9/4.0" value={edu.gpa}
                  onChange={e => updateItem('education', edu.id, 'gpa', e.target.value)} />
              </div>
            </Row>
            <Row>
              <div>
                <label className={labelCls}>Start</label>
                <input className={inputCls} placeholder="Sep 2018" value={edu.startDate}
                  onChange={e => updateItem('education', edu.id, 'startDate', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>End</label>
                <input className={inputCls} placeholder="May 2022" value={edu.endDate}
                  onChange={e => updateItem('education', edu.id, 'endDate', e.target.value)} />
              </div>
            </Row>
          </motion.div>
        ))}
        <button onClick={() => addItem('education', { institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' })}
          className="w-full py-2 rounded-xl border-2 border-dashed border-slate-300 text-xs text-slate-400 hover:border-primary-300 hover:text-primary-500 transition-all flex items-center justify-center gap-1">
          <Plus size={13} /> Add Education
        </button>
      </Section>

      {/* Projects */}
      <Section title="🚀 Projects" defaultOpen={false}>
        {resumeData.projects.map((proj) => (
          <motion.div key={proj.id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 relative">
            {resumeData.projects.length > 1 && (
              <button onClick={() => removeItem('projects', proj.id)}
                className="absolute top-2 right-2 p-1 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-400 transition-colors">
                <Trash2 size={13} />
              </button>
            )}
            <Row>
              <div>
                <label className={labelCls}>Project Name</label>
                <input className={inputCls} placeholder="AI Resume Analyzer" value={proj.name}
                  onChange={e => updateItem('projects', proj.id, 'name', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Link</label>
                <input className={inputCls} placeholder="github.com/..." value={proj.link}
                  onChange={e => updateItem('projects', proj.id, 'link', e.target.value)} />
              </div>
            </Row>
            <div>
              <label className={labelCls}>Tech Stack</label>
              <input className={inputCls} placeholder="React, FastAPI, spaCy" value={proj.tech}
                onChange={e => updateItem('projects', proj.id, 'tech', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Description</label>
              <textarea className={`${inputCls} resize-none`} rows={2}
                placeholder="Built an NLP-powered resume analyzer..." value={proj.description}
                onChange={e => updateItem('projects', proj.id, 'description', e.target.value)} />
            </div>
          </motion.div>
        ))}
        <button onClick={() => addItem('projects', { name: '', description: '', tech: '', link: '' })}
          className="w-full py-2 rounded-xl border-2 border-dashed border-slate-300 text-xs text-slate-400 hover:border-primary-300 hover:text-primary-500 transition-all flex items-center justify-center gap-1">
          <Plus size={13} /> Add Project
        </button>
      </Section>

      {/* Certifications */}
      <Section title="🏆 Certifications" defaultOpen={false}>
        {resumeData.certifications.map((cert) => (
          <motion.div key={cert.id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 relative">
            {resumeData.certifications.length > 1 && (
              <button onClick={() => removeItem('certifications', cert.id)}
                className="absolute top-2 right-2 p-1 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-400 transition-colors">
                <Trash2 size={13} />
              </button>
            )}
            <Row>
              <div>
                <label className={labelCls}>Certification Name</label>
                <input className={inputCls} placeholder="AWS Solutions Architect" value={cert.name}
                  onChange={e => updateItem('certifications', cert.id, 'name', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Issuer</label>
                <input className={inputCls} placeholder="Amazon Web Services" value={cert.issuer}
                  onChange={e => updateItem('certifications', cert.id, 'issuer', e.target.value)} />
              </div>
            </Row>
            <Row>
              <div>
                <label className={labelCls}>Date</label>
                <input className={inputCls} placeholder="Mar 2024" value={cert.date}
                  onChange={e => updateItem('certifications', cert.id, 'date', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Credential Link</label>
                <input className={inputCls} placeholder="https://..." value={cert.link}
                  onChange={e => updateItem('certifications', cert.id, 'link', e.target.value)} />
              </div>
            </Row>
          </motion.div>
        ))}
        <button onClick={() => addItem('certifications', { name: '', issuer: '', date: '', link: '' })}
          className="w-full py-2 rounded-xl border-2 border-dashed border-slate-300 text-xs text-slate-400 hover:border-primary-300 hover:text-primary-500 transition-all flex items-center justify-center gap-1">
          <Plus size={13} /> Add Certification
        </button>
      </Section>
    </div>
  )
}
