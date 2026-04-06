import { useResume } from '../../../context/ResumeContext'

export default function MinimalTemplate() {
  const { resumeData: d, accentColor } = useResume()
  const p = d.personal

  const SectionTitle = ({ children }) => (
    <h2 className="text-xs font-bold uppercase tracking-[0.15em] mt-4 mb-2 pb-1 border-b-2"
      style={{ borderColor: accentColor, color: accentColor }}>{children}</h2>
  )

  return (
    <div id="resume-preview" className="bg-white w-full min-h-[1056px] font-sans text-[11px] p-8">
      {/* Header */}
      <div className="text-center mb-4 pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{p.name || 'Your Name'}</h1>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-2 text-slate-500">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>• {p.phone}</span>}
          {p.location && <span>• {p.location}</span>}
          {p.linkedin && <span>• {p.linkedin}</span>}
          {p.github && <span>• {p.github}</span>}
        </div>
      </div>

      {d.summary && (
        <>
          <SectionTitle>Summary</SectionTitle>
          <p className="text-slate-600 leading-relaxed">{d.summary}</p>
        </>
      )}

      {d.skills.filter(s => s.trim()).length > 0 && (
        <>
          <SectionTitle>Skills</SectionTitle>
          <p className="text-slate-700">{d.skills.filter(s => s.trim()).join(' • ')}</p>
        </>
      )}

      {d.experience.filter(e => e.company).length > 0 && (
        <>
          <SectionTitle>Experience</SectionTitle>
          {d.experience.filter(e => e.company).map((exp, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-slate-800">{exp.role}</span>
                  <span className="text-slate-500"> — {exp.company}</span>
                </div>
                <span className="text-slate-400 text-xs">
                  {exp.startDate}{exp.startDate && ' – '}{exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              {exp.description && <p className="text-slate-600 mt-1 leading-relaxed whitespace-pre-line">{exp.description}</p>}
            </div>
          ))}
        </>
      )}

      {d.education.filter(e => e.institution).length > 0 && (
        <>
          <SectionTitle>Education</SectionTitle>
          {d.education.filter(e => e.institution).map((edu, i) => (
            <div key={i} className="flex justify-between mb-1">
              <div>
                <span className="font-bold text-slate-800">{edu.degree}</span>
                <span className="text-slate-500"> — {edu.institution}</span>
                {edu.gpa && <span className="text-slate-400"> | GPA: {edu.gpa}</span>}
              </div>
              <span className="text-slate-400 text-xs">{edu.startDate}{edu.startDate && ' – '}{edu.endDate}</span>
            </div>
          ))}
        </>
      )}

      {d.projects.filter(p => p.name).length > 0 && (
        <>
          <SectionTitle>Projects</SectionTitle>
          {d.projects.filter(p => p.name).map((proj, i) => (
            <div key={i} className="mb-2">
              <span className="font-bold text-slate-800">{proj.name}</span>
              {proj.tech && <span className="text-slate-500"> | {proj.tech}</span>}
              {proj.description && <p className="text-slate-600 mt-0.5">{proj.description}</p>}
            </div>
          ))}
        </>
      )}

      {d.certifications.filter(c => c.name).length > 0 && (
        <>
          <SectionTitle>Certifications</SectionTitle>
          {d.certifications.filter(c => c.name).map((cert, i) => (
            <div key={i} className="flex justify-between mb-1">
              <span className="font-semibold text-slate-700">{cert.name} — <span className="font-normal text-slate-500">{cert.issuer}</span></span>
              <span className="text-slate-400 text-xs">{cert.date}</span>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
