import { useResume } from '../../../context/ResumeContext'

export default function ExecutiveTemplate() {
  const { resumeData: d, accentColor } = useResume()
  const p = d.personal

  return (
    <div id="resume-preview" className="bg-white w-full min-h-[1056px] font-sans text-[11px]">
      {/* Dark header */}
      <div className="p-6 text-white" style={{ background: '#0f172a' }}>
        <h1 className="text-2xl font-bold tracking-tight">{p.name || 'Your Name'}</h1>
        {d.experience[0]?.role && (
          <p className="text-sm mt-0.5" style={{ color: accentColor }}>{d.experience[0].role}</p>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-3 text-slate-400 text-xs">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.linkedin && <span>{p.linkedin}</span>}
          {p.github && <span>{p.github}</span>}
        </div>
      </div>

      {/* Accent bar */}
      <div className="h-1" style={{ background: accentColor }} />

      <div className="p-6 space-y-4">
        {d.summary && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>Executive Summary</h2>
            <p className="text-slate-600 leading-relaxed">{d.summary}</p>
          </div>
        )}

        {d.skills.filter(s => s.trim()).length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>Core Competencies</h2>
            <div className="grid grid-cols-4 gap-1">
              {d.skills.filter(s => s.trim()).map((s, i) => (
                <div key={i} className="flex items-center gap-1.5 py-1 px-2 rounded" style={{ background: `${accentColor}10` }}>
                  <div className="w-1 h-1 rounded-full shrink-0" style={{ background: accentColor }} />
                  <span className="text-slate-700 text-xs">{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {d.experience.filter(e => e.company).length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>Career History</h2>
            {d.experience.filter(e => e.company).map((exp, i) => (
              <div key={i} className="mb-3 pl-3" style={{ borderLeft: `3px solid ${accentColor}` }}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-slate-900">{exp.role}</p>
                    <p className="text-slate-500">{exp.company}</p>
                  </div>
                  <span className="text-slate-400 text-xs bg-slate-100 px-2 py-0.5 rounded">
                    {exp.startDate}{exp.startDate && ' – '}{exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.description && <p className="text-slate-600 mt-1 leading-relaxed whitespace-pre-line">{exp.description}</p>}
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {d.education.filter(e => e.institution).length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>Education</h2>
              {d.education.filter(e => e.institution).map((edu, i) => (
                <div key={i} className="mb-2">
                  <p className="font-bold text-slate-800">{edu.degree}</p>
                  <p className="text-slate-500">{edu.institution}</p>
                  <p className="text-slate-400">{edu.startDate}{edu.startDate && ' – '}{edu.endDate}</p>
                </div>
              ))}
            </div>
          )}

          {d.certifications.filter(c => c.name).length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>Certifications</h2>
              {d.certifications.filter(c => c.name).map((cert, i) => (
                <div key={i} className="mb-2">
                  <p className="font-bold text-slate-800">{cert.name}</p>
                  <p className="text-slate-500">{cert.issuer} {cert.date && `• ${cert.date}`}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {d.projects.filter(p => p.name).length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>Key Projects</h2>
            <div className="grid grid-cols-2 gap-2">
              {d.projects.filter(p => p.name).map((proj, i) => (
                <div key={i} className="p-2 rounded-lg border border-slate-200">
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
