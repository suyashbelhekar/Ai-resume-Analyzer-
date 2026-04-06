import { useResume } from '../../../context/ResumeContext'

export default function ModernTemplate() {
  const { resumeData: d, accentColor } = useResume()
  const p = d.personal

  const SectionHeading = ({ children }) => (
    <h2 className="text-sm font-bold mb-2 pb-0.5" style={{ color: accentColor }}>
      {children}
    </h2>
  )

  const Bullet = () => (
    <span className="inline-block w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 mr-2" style={{ background: accentColor }} />
  )

  return (
    <div id="resume-preview" className="bg-white w-full min-h-[1056px] font-sans text-[11px] flex flex-col">

      {/* ── Header bar ── */}
      <div className="flex items-center justify-between px-7 py-5" style={{ background: accentColor }}>
        {/* Left: avatar + name */}
        <div className="flex items-center gap-4">
          {/* Avatar circle */}
          <div className="w-14 h-14 rounded-full bg-white/30 border-2 border-white/60 flex items-center justify-center shrink-0 overflow-hidden">
            <svg viewBox="0 0 40 40" className="w-10 h-10 text-white/70" fill="currentColor">
              <circle cx="20" cy="14" r="7" />
              <path d="M4 36c0-8.837 7.163-16 16-16s16 7.163 16 16" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white leading-tight">{p.name || 'Your Name'}</h1>
            {d.experience[0]?.role && (
              <p className="text-xs text-white/75 mt-0.5">{d.experience[0].role}</p>
            )}
          </div>
        </div>

        {/* Right: contact */}
        <div className="text-right text-white/85 space-y-0.5">
          {p.location && <p className="text-xs">{p.location}</p>}
          {p.phone && <p className="text-xs">{p.phone}</p>}
          {p.email && <p className="text-xs">{p.email}</p>}
          {p.linkedin && <p className="text-xs">{p.linkedin}</p>}
          {p.github && <p className="text-xs">{p.github}</p>}
        </div>
      </div>

      {/* ── Body: main (left) + sidebar (right) ── */}
      <div className="flex flex-1">

        {/* Main column */}
        <div className="flex-1 px-7 py-5 space-y-4">

          {/* Summary */}
          {d.summary && (
            <p className="text-slate-700 leading-relaxed font-medium text-[10.5px]">{d.summary}</p>
          )}

          {/* Experience */}
          {d.experience.filter(e => e.company).length > 0 && (
            <div>
              <SectionHeading>Professional Experience</SectionHeading>
              {d.experience.filter(e => e.company).map((exp, i) => (
                <div key={i} className="mb-3">
                  <p className="font-bold text-slate-800">{exp.role}</p>
                  <div className="flex justify-between items-baseline">
                    <p className="text-slate-500">{exp.company}</p>
                    <p className="text-slate-400 text-[10px] shrink-0 ml-2">
                      {exp.startDate}{exp.startDate && ' – '}{exp.current ? 'Present' : exp.endDate}
                    </p>
                  </div>
                  {exp.description && (
                    <div className="mt-1 space-y-0.5">
                      {exp.description.split('\n').filter(Boolean).map((line, li) => (
                        <div key={li} className="flex items-start">
                          <Bullet />
                          <span className="text-slate-600 leading-relaxed">{line.replace(/^[•\-\*]\s*/, '')}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {d.education.filter(e => e.institution).length > 0 && (
            <div>
              <SectionHeading>Education</SectionHeading>
              {d.education.filter(e => e.institution).map((edu, i) => (
                <div key={i} className="mb-2 flex justify-between items-start">
                  <div>
                    <p className="text-slate-700">{edu.degree}</p>
                    <p className="text-slate-500">{edu.institution}</p>
                    {edu.gpa && <p className="text-slate-400">GPA: {edu.gpa}</p>}
                  </div>
                  <p className="text-slate-400 text-[10px] shrink-0 ml-2">
                    {edu.startDate}{edu.startDate && ' – '}{edu.endDate}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {d.certifications.filter(c => c.name).length > 0 && (
            <div>
              <SectionHeading>Certifications</SectionHeading>
              {d.certifications.filter(c => c.name).map((cert, i) => (
                <div key={i} className="flex items-start mb-1">
                  <Bullet />
                  <span className="text-slate-700">
                    <span className="font-semibold">{cert.name}</span>
                    {cert.issuer && <span className="text-slate-500">, {cert.issuer}</span>}
                    {cert.date && <span className="text-slate-400">, {cert.date}</span>}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {d.projects.filter(p => p.name).length > 0 && (
            <div>
              <SectionHeading>Projects</SectionHeading>
              {d.projects.filter(p => p.name).map((proj, i) => (
                <div key={i} className="mb-2">
                  <div className="flex justify-between">
                    <p className="font-semibold text-slate-800">{proj.name}</p>
                    {proj.link && <p className="text-[10px] text-slate-400">{proj.link}</p>}
                  </div>
                  {proj.tech && <p className="text-slate-500 italic text-[10px]">{proj.tech}</p>}
                  {proj.description && <p className="text-slate-600 mt-0.5">{proj.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-[30%] shrink-0 px-5 py-5 border-l border-slate-100 space-y-4">

          {/* Skills */}
          {d.skills.filter(s => s.trim()).length > 0 && (
            <div>
              <SectionHeading>Skills</SectionHeading>
              <ul className="space-y-1">
                {d.skills.filter(s => s.trim()).map((s, i) => (
                  <li key={i} className="flex items-start">
                    <Bullet />
                    <span className="text-slate-700">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Languages / extra contact */}
          {(p.website || p.github) && (
            <div>
              <SectionHeading>Links</SectionHeading>
              <div className="space-y-1">
                {p.website && (
                  <div className="flex items-start">
                    <Bullet />
                    <span className="text-slate-600 break-all">{p.website}</span>
                  </div>
                )}
                {p.github && (
                  <div className="flex items-start">
                    <Bullet />
                    <span className="text-slate-600 break-all">{p.github}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
