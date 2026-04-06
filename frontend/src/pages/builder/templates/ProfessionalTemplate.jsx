import { useResume } from '../../../context/ResumeContext'

export default function ProfessionalTemplate() {
  const { resumeData: d, accentColor } = useResume()
  const p = d.personal

  const Divider = () => <div className="h-px bg-slate-200 my-3" />

  return (
    <div id="resume-preview" className="bg-white w-full min-h-[1056px] font-serif text-[11px] p-8">
      {/* Header */}
      <div className="text-center pb-4 mb-4" style={{ borderBottom: `2px solid ${accentColor}` }}>
        <h1 className="text-2xl font-bold text-slate-900 tracking-wide uppercase">{p.name || 'Your Name'}</h1>
        <div className="flex flex-wrap justify-center gap-x-4 mt-2 text-slate-600 text-xs">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.linkedin && <span>{p.linkedin}</span>}
          {p.github && <span>{p.github}</span>}
        </div>
      </div>

      {d.summary && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: accentColor }}>Professional Summary</h2>
          <p className="text-slate-700 leading-relaxed text-justify">{d.summary}</p>
          <Divider />
        </div>
      )}

      {d.experience.filter(e => e.company).length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: accentColor }}>Professional Experience</h2>
          {d.experience.filter(e => e.company).map((exp, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between items-baseline">
                <p className="font-bold text-slate-900 uppercase text-xs tracking-wide">{exp.role}</p>
                <p className="text-slate-500 text-xs italic">
                  {exp.startDate}{exp.startDate && ' – '}{exp.current ? 'Present' : exp.endDate}
                </p>
              </div>
              <p className="font-semibold text-slate-600 italic">{exp.company}</p>
              {exp.description && <p className="text-slate-700 mt-1 leading-relaxed whitespace-pre-line">{exp.description}</p>}
            </div>
          ))}
          <Divider />
        </div>
      )}

      {d.education.filter(e => e.institution).length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: accentColor }}>Education</h2>
          {d.education.filter(e => e.institution).map((edu, i) => (
            <div key={i} className="flex justify-between mb-2">
              <div>
                <p className="font-bold text-slate-900">{edu.degree}</p>
                <p className="text-slate-600 italic">{edu.institution}</p>
                {edu.gpa && <p className="text-slate-500">GPA: {edu.gpa}</p>}
              </div>
              <p className="text-slate-500 text-xs italic">{edu.startDate}{edu.startDate && ' – '}{edu.endDate}</p>
            </div>
          ))}
          <Divider />
        </div>
      )}

      {d.skills.filter(s => s.trim()).length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: accentColor }}>Core Competencies</h2>
          <div className="grid grid-cols-3 gap-1">
            {d.skills.filter(s => s.trim()).map((s, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full shrink-0" style={{ background: accentColor }} />
                <span className="text-slate-700">{s}</span>
              </div>
            ))}
          </div>
          <Divider />
        </div>
      )}

      {d.projects.filter(p => p.name).length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: accentColor }}>Notable Projects</h2>
          {d.projects.filter(p => p.name).map((proj, i) => (
            <div key={i} className="mb-2">
              <p className="font-bold text-slate-900">{proj.name} {proj.tech && <span className="font-normal text-slate-500 italic">| {proj.tech}</span>}</p>
              {proj.description && <p className="text-slate-700">{proj.description}</p>}
            </div>
          ))}
          <Divider />
        </div>
      )}

      {d.certifications.filter(c => c.name).length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: accentColor }}>Certifications</h2>
          {d.certifications.filter(c => c.name).map((cert, i) => (
            <div key={i} className="flex justify-between mb-1">
              <span className="font-semibold text-slate-800">{cert.name} — <span className="font-normal italic text-slate-600">{cert.issuer}</span></span>
              <span className="text-slate-500 text-xs">{cert.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
