import { useResume } from '../../../context/ResumeContext'

// Pure ATS-friendly: no columns, no colors, plain text hierarchy
export default function ATSTemplate() {
  const { resumeData: d } = useResume()
  const p = d.personal

  return (
    <div id="resume-preview" className="bg-white w-full min-h-[1056px] font-sans text-[11px] p-8 text-slate-900">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold">{p.name || 'Your Name'}</h1>
        <p className="text-slate-600 mt-1">
          {[p.email, p.phone, p.location, p.linkedin, p.github].filter(Boolean).join(' | ')}
        </p>
      </div>

      {d.summary && (
        <div className="mb-4">
          <h2 className="font-bold border-b border-slate-900 pb-0.5 mb-1 uppercase text-xs tracking-wide">Summary</h2>
          <p className="text-slate-700 leading-relaxed">{d.summary}</p>
        </div>
      )}

      {d.skills.filter(s => s.trim()).length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold border-b border-slate-900 pb-0.5 mb-1 uppercase text-xs tracking-wide">Technical Skills</h2>
          <p className="text-slate-700">{d.skills.filter(s => s.trim()).join(', ')}</p>
        </div>
      )}

      {d.experience.filter(e => e.company).length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold border-b border-slate-900 pb-0.5 mb-2 uppercase text-xs tracking-wide">Work Experience</h2>
          {d.experience.filter(e => e.company).map((exp, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between">
                <p className="font-bold">{exp.role}, {exp.company}</p>
                <p className="text-slate-600">{exp.startDate}{exp.startDate && ' - '}{exp.current ? 'Present' : exp.endDate}</p>
              </div>
              {exp.description && <p className="text-slate-700 mt-1 leading-relaxed whitespace-pre-line">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}

      {d.education.filter(e => e.institution).length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold border-b border-slate-900 pb-0.5 mb-2 uppercase text-xs tracking-wide">Education</h2>
          {d.education.filter(e => e.institution).map((edu, i) => (
            <div key={i} className="mb-2">
              <div className="flex justify-between">
                <p className="font-bold">{edu.degree} — {edu.institution}</p>
                <p className="text-slate-600">{edu.startDate}{edu.startDate && ' - '}{edu.endDate}</p>
              </div>
              {edu.gpa && <p className="text-slate-600">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {d.projects.filter(p => p.name).length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold border-b border-slate-900 pb-0.5 mb-2 uppercase text-xs tracking-wide">Projects</h2>
          {d.projects.filter(p => p.name).map((proj, i) => (
            <div key={i} className="mb-2">
              <p className="font-bold">{proj.name}{proj.tech && ` | ${proj.tech}`}</p>
              {proj.description && <p className="text-slate-700">{proj.description}</p>}
            </div>
          ))}
        </div>
      )}

      {d.certifications.filter(c => c.name).length > 0 && (
        <div>
          <h2 className="font-bold border-b border-slate-900 pb-0.5 mb-2 uppercase text-xs tracking-wide">Certifications</h2>
          {d.certifications.filter(c => c.name).map((cert, i) => (
            <p key={i} className="mb-1">{cert.name} — {cert.issuer}{cert.date && ` (${cert.date})`}</p>
          ))}
        </div>
      )}
    </div>
  )
}
