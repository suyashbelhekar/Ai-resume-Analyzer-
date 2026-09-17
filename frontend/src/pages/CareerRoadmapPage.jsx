import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import {
  Map,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  FolderGit2,
  Rocket,
  ShieldCheck,
  CheckSquare,
  Square
} from 'lucide-react'
import apiService from '../services/api'
import { useCareer } from '../context/CareerContext'

export default function CareerRoadmapPage({ onNavigate }) {
  const { resumeText, targetJD, targetRole, uploadedFile, roadmapResult, setRoadmapResult } = useCareer()
  const [loading, setLoading] = useState(false)
  const [completedMilestones, setCompletedMilestones] = useState([])
  const [roadmapId, setRoadmapId] = useState(null)

  useEffect(() => {
    loadExistingRoadmap()
  }, [targetRole])

  const loadExistingRoadmap = async () => {
    try {
      const res = await apiService.getRoadmap(targetRole)
      if (res.data?.roadmap_data) {
        setRoadmapResult(res.data.roadmap_data)
        setCompletedMilestones(res.data.completed_milestones || [])
        setRoadmapId(res.data.id)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleGenerateRoadmap = async () => {
    let rText = resumeText
    if (!rText && uploadedFile) {
      rText = 'Candidate Resume with experience in software development and technical projects.'
    }

    setLoading(true)
    try {
      const res = await apiService.generateRoadmap(
        rText || 'Candidate Resume',
        targetJD || `Target Role: ${targetRole}`,
        targetRole || 'Software Engineer'
      )
      setRoadmapResult(res.data)
      setCompletedMilestones([])
      toast.success('Career Roadmap generated!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to generate roadmap.')
    } finally {
      setLoading(false)
    }
  }

  const toggleMilestone = async (id) => {
    const next = completedMilestones.includes(id)
      ? completedMilestones.filter((m) => m !== id)
      : [...completedMilestones, id]

    setCompletedMilestones(next)

    if (roadmapId) {
      try {
        await apiService.updateRoadmapProgress(roadmapId, next)
      } catch (e) {
        console.error(e)
      }
    }
  }

  const milestones = roadmapResult?.roadmap_milestones || []
  const progressPct =
    milestones.length > 0 ? Math.round((completedMilestones.length / milestones.length) * 100) : 0

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
              <Map size={18} />
            </span>
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
              AI Career Transition & Upskilling Guide
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            AI Career Roadmap
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Personalized week-by-week blueprint to bridge skill gaps, build verified portfolio projects, and qualify for your dream role.
          </p>
        </div>

        <button
          onClick={handleGenerateRoadmap}
          disabled={loading}
          className="btn-primary flex items-center gap-2 text-xs py-2 px-5 shadow-sm"
        >
          <Sparkles size={14} />
          {loading ? 'Generating Blueprint...' : 'Regenerate Roadmap'}
        </button>
      </div>

      {/* Target Role & Progress Tracker */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Target Career Goal</p>
            <h2 className="text-xl font-bold text-slate-800">{targetRole || 'Software Engineer'}</h2>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 font-medium">Roadmap Progress</p>
            <p className="text-xl font-extrabold text-primary-600">{progressPct}% Complete</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.6 }}
            className="h-full rounded-full bg-gradient-to-r from-primary-500 via-indigo-500 to-emerald-500"
          />
        </div>
      </div>

      {/* Milestones List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Calendar size={16} className="text-primary-600" />
          Milestone Learning Schedule
        </h2>

        {milestones.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 space-y-3">
            <p>No roadmap generated yet for {targetRole}.</p>
            <button
              onClick={handleGenerateRoadmap}
              className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5"
            >
              <Sparkles size={13} />
              Generate Career Roadmap Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {milestones.map((m, idx) => {
              const isDone = completedMilestones.includes(m.id || idx)
              return (
                <div
                  key={idx}
                  className={`bg-white rounded-2xl border transition-all p-5 shadow-2xs ${
                    isDone ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleMilestone(m.id || idx)}
                        className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                      >
                        {isDone ? (
                          <CheckSquare size={20} className="text-emerald-600" />
                        ) : (
                          <Square size={20} />
                        )}
                      </button>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">
                            {m.week_label || `Phase ${idx + 1}`}
                          </span>
                          <h3
                            className={`text-sm font-bold ${
                              isDone ? 'line-through text-slate-400' : 'text-slate-800'
                            }`}
                          >
                            {m.title}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {m.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Nested skills to learn */}
                  {m.skills_to_learn?.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
                      {m.skills_to_learn.map((skill, sIdx) => (
                        <div
                          key={sIdx}
                          className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">{skill.skill}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                              {skill.difficulty || 'Intermediate'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            <strong>Why:</strong> {skill.why}
                          </p>
                          <p className="text-[11px] text-slate-600">
                            <strong>Task:</strong> {skill.practice_task}
                          </p>
                          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                            <ShieldCheck size={12} className="text-emerald-600" />
                            <span>Evidence Goal: {skill.evidence_goal}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Capstone Project Blueprint */}
      {roadmapResult?.capstone_project && (
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center gap-2">
            <Rocket size={20} className="text-amber-400" />
            <h2 className="text-lg font-bold text-white">Capstone Portfolio Project Blueprint</h2>
          </div>

          <div>
            <h3 className="text-base font-bold text-indigo-200">
              {roadmapResult.capstone_project.title}
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {roadmapResult.capstone_project.problem_statement}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="bg-white/10 rounded-xl p-3 border border-white/10">
              <p className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider mb-1">
                Architecture Blueprint
              </p>
              <p className="text-xs text-slate-200 font-mono leading-relaxed">
                {roadmapResult.capstone_project.architecture}
              </p>
            </div>

            <div className="bg-white/10 rounded-xl p-3 border border-white/10">
              <p className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider mb-1">
                Technologies Utilized
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {roadmapResult.capstone_project.technologies?.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-white/20 text-white text-[11px] font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {roadmapResult.capstone_project.resume_bullet_template && (
            <div className="bg-white/5 border border-white/15 rounded-xl p-3.5">
              <p className="text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-1">
                Suggested Resume Bullet (Add ONLY after building):
              </p>
              <p className="text-xs text-slate-200 italic font-mono">
                "{roadmapResult.capstone_project.resume_bullet_template}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
