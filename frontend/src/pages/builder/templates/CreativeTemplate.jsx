import { useResume } from '../../../context/ResumeContext'

export default function CreativeTemplate() {
  const { resumeData: d, accentColor } = useResume()
  const p = d.personal

  return (
    <div id="resume-preview" className="bg-white w-full min-h-[1056px] font-sans text-[11px]">
      {/* Bold Header */}
      <div className="p-6 pb-4" style={{ background: `linear-gradient(135deg, ${accentColor}15, ${accentColor}05)` }}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 leading-none">{p.name || 'Your Name'}</h1>
            {d.experience[0]?.role && (
              <p className="text-sm font-semibold mt-1" style={{ color: accentColor }}>{d.experience[0].role}</p>
            )}
          </div>
          <div className="text-right text-slate-500 space-y-0.5">
            {p.email && <p>{p.email}</p>}
            {p.phone && <p>{p.phone}</p>}
            {p.location && <p>{p.location}</p>}
          </div>
        </div>
        <div className="flex gap-3 mt-2">
          {p.linkedin && <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ background: accentColor }}>{p.linkedin}</span>}
          {p.github && <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ background: accentColor }}>{p.github}</span>}
        </div>
      </div>

      <div className="px-6 pb-6 space-y-4">
        {d.summary && (
          <div className="p-3 rounded-xl" style={{ background: `${accentColor}10`, borderLeft: `3px solid ${accentColor}` }}>
            <p className="text-slate-700 leading-relaxed">{d.summary}</p>
          </div>
        )}

        {d.skills.filter(s => s.trim()).length > 0 && (
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest mb-2" style={{ color: accentColor }}>Skills</h2>
            <div className="flex flex-wrap gap-1.5">
              {d.skills.filter(s => s.trim()).map((s, i) => (
                <span key={i} className="px-2.5 py-1 rounded-full text-xs font-medium text-white" style={{ background: accentColor }}>{s}</span>
              ))}
            </div>
          </div>
        )}

        {d.experience.filter(e => e.company).length > 0 && (
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest mb-2" style={{ color: accentColor }}>Experience</h2>
            {d.experience.filter(e => e.company).map((exp, i) => (
              <div key={i} className="mb-3 pl-3" style={{ borderLeft: `2px solid ${accentColor}40` }}>
                <div className="flex justify-between">
                  <div>
                    <p className="font-bold text-slate-800">{exp.role}</p>
                    <p className="font-semibold" style={{ color: accentColor }}>{exp.company}</p>
                  </div>
                  <span className="text-slate-400 text-xs">{exp.startDate}{exp.startDate && ' – '}{exp.current ? 'Present' : exp.endDate}</span>
                </div>
                {exp.description && <p className="text-slate-600 mt-1 leading-relaxed whitespace-pre-line">{exp.description}</p>}
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {d.education.filter(e => e.institution).length > 0 && (
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest mb-2" style={{ color: accentColor }}>Education</h2>
              {d.education.filter(e => e.institution).map((edu, i) => (
                <div key={i} className="mb-2">
                  <p className="font-bold text-slate-800">{edu.degree}</p>
                  <p style={{ color: accentColor }}>{edu.institution}</p>
                  <p className="text-slate-400">{edu.startDate}{edu.startDate && ' – '}{edu.endDate}</p>
                  {edu.gpa && <p className="text-slate-400">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          )}

          {d.certifications.filter(c => c.name).length > 0 && (
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest mb-2" style={{ color: accentColor }}>Certifications</h2>
              {d.certifications.filter(c => c.name).map((cert, i) => (
                <div key={i} className="mb-2">
                  <p className="font-bold text-slate-800">{cert.name}</p>
                  <p className="text-slate-500">{cert.issuer}</p>
                  <p className="text-slate-400">{cert.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {d.projects.filter(p => p.name).length > 0 && (
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest mb-2" style={{ color: accentColor }}>Projects</h2>
            <div className="grid grid-cols-2 gap-2">
              {d.projects.filter(p => p.name).map((proj, i) => (
                <div key={i} className="p-2 rounded-lg border" style={{ borderColor: `${accentColor}30`, background: `${accentColor}05` }}>
                  <p className="font-bold text-slate-800">{proj.name}</p>
                  {proj.tech && <p className="text-xs" style={{ color: accentColor }}>{proj.tech}</p>}
                  {proj.description && <p className="text-slate-600 mt-0.5">{proj.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
