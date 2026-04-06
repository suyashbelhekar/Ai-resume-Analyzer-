import { useResume } from '../../context/ResumeContext'
import ModernTemplate from './templates/ModernTemplate'
import MinimalTemplate from './templates/MinimalTemplate'
import CreativeTemplate from './templates/CreativeTemplate'
import ProfessionalTemplate from './templates/ProfessionalTemplate'
import ATSTemplate from './templates/ATSTemplate'
import ExecutiveTemplate from './templates/ExecutiveTemplate'

const templateMap = {
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  creative: CreativeTemplate,
  professional: ProfessionalTemplate,
  ats: ATSTemplate,
  executive: ExecutiveTemplate,
}

export default function ResumePreview() {
  const { selectedTemplate } = useResume()
  const Template = templateMap[selectedTemplate] || ModernTemplate

  return (
    <div className="w-full origin-top" style={{ transform: 'scale(0.72)', transformOrigin: 'top center', marginBottom: '-28%' }}>
      <div className="shadow-2xl rounded-sm overflow-hidden border border-slate-200">
        <Template />
      </div>
    </div>
  )
}
