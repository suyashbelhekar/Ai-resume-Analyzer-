import { createContext, useContext, useState, useEffect } from 'react'

const defaultResume = {
  personal: {
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    location: '',
    website: '',
  },
  summary: '',
  skills: [''],
  experience: [
    { id: 1, company: '', role: '', startDate: '', endDate: '', current: false, description: '' }
  ],
  education: [
    { id: 1, institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' }
  ],
  projects: [
    { id: 1, name: '', description: '', tech: '', link: '' }
  ],
  certifications: [
    { id: 1, name: '', issuer: '', date: '', link: '' }
  ],
  sectionOrder: ['summary', 'skills', 'experience', 'education', 'projects', 'certifications'],
}

const ResumeContext = createContext(null)

export function ResumeProvider({ children, analysisResult }) {
  const [resumeData, setResumeData] = useState(() => {
    try {
      const saved = localStorage.getItem('resumeBuilderData')
      return saved ? JSON.parse(saved) : defaultResume
    } catch {
      return defaultResume
    }
  })

  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [accentColor, setAccentColor] = useState('#6366f1')
  const [completionScore, setCompletionScore] = useState(0)

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem('resumeBuilderData', JSON.stringify(resumeData))
    calculateCompletion()
  }, [resumeData])

  // Auto-fill from analyzer result
  useEffect(() => {
    if (analysisResult?.extracted_skills?.length) {
      setResumeData(prev => ({
        ...prev,
        skills: analysisResult.extracted_skills.slice(0, 20).map(s =>
          s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        )
      }))
    }
  }, [analysisResult])

  const calculateCompletion = () => {
    let score = 0
    const d = resumeData
    if (d.personal.name) score += 15
    if (d.personal.email) score += 10
    if (d.personal.phone) score += 5
    if (d.summary.length > 20) score += 15
    if (d.skills.filter(s => s.trim()).length >= 3) score += 15
    if (d.experience[0]?.company) score += 20
    if (d.education[0]?.institution) score += 10
    if (d.projects[0]?.name) score += 10
    setCompletionScore(score)
  }

  const updatePersonal = (field, value) =>
    setResumeData(prev => ({ ...prev, personal: { ...prev.personal, [field]: value } }))

  const updateSummary = (value) =>
    setResumeData(prev => ({ ...prev, summary: value }))

  const updateSkills = (skills) =>
    setResumeData(prev => ({ ...prev, skills }))

  const updateSection = (section, items) =>
    setResumeData(prev => ({ ...prev, [section]: items }))

  const addItem = (section, template) =>
    setResumeData(prev => ({
      ...prev,
      [section]: [...prev[section], { ...template, id: Date.now() }]
    }))

  const removeItem = (section, id) =>
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].filter(item => item.id !== id)
    }))

  const updateItem = (section, id, field, value) =>
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }))

  const resetResume = () => {
    setResumeData(defaultResume)
    localStorage.removeItem('resumeBuilderData')
  }

  return (
    <ResumeContext.Provider value={{
      resumeData, selectedTemplate, setSelectedTemplate,
      accentColor, setAccentColor, completionScore,
      updatePersonal, updateSummary, updateSkills,
      updateSection, addItem, removeItem, updateItem, resetResume
    }}>
      {children}
    </ResumeContext.Provider>
  )
}

export const useResume = () => useContext(ResumeContext)
