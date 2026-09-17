import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import {
  Mic,
  Sparkles,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  ChevronRight,
  Send,
  RotateCcw,
  BarChart2,
  Award,
  BookOpen
} from 'lucide-react'
import apiService from '../services/api'
import { useCareer } from '../context/CareerContext'

const categories = ['All', 'Technical', 'Behavioral', 'Project', 'Skill-Gap', 'HR']

export default function InterviewPrepPage({ onNavigate }) {
  const { resumeText, targetJD, targetRole, uploadedFile } = useCareer()
  const [activeTab, setActiveTab] = useState('questions') // questions | mock
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState([])
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)

  // Question details toggle
  const [expandedHints, setExpandedHints] = useState({})
  const [expandedFrameworks, setExpandedFrameworks] = useState({})

  // Mock interview state
  const [userAnswer, setUserAnswer] = useState('')
  const [evaluating, setEvaluating] = useState(false)
  const [evaluationResult, setEvaluationResult] = useState(null)
  const [mockScoreHistory, setMockScoreHistory] = useState([])

  const handleGenerateQuestions = async () => {
    let rText = resumeText
    if (!rText && uploadedFile) {
      rText = 'Candidate Resume with experience in software development.'
    }

    setLoading(true)
    try {
      const res = await apiService.generateInterviewQuestions(
        rText || 'Candidate Resume',
        targetJD || `Target Role: ${targetRole}`,
        targetRole || 'Software Engineer'
      )
      setQuestions(res.data.questions || [])
      setActiveQuestionIndex(0)
      setEvaluationResult(null)
      setUserAnswer('')
      toast.success('Interview questions generated!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to generate interview questions.')
    } finally {
      setLoading(false)
    }
  }

  const handleEvaluateAnswer = async () => {
    if (!userAnswer.trim()) {
      toast.error('Please type your answer before submitting.')
      return
    }

    const currentQ = questions[activeQuestionIndex]
    if (!currentQ) return

    setEvaluating(true)
    try {
      const res = await apiService.evaluateInterviewAnswer(
        currentQ.question,
        userAnswer,
        currentQ.category || 'Technical',
        targetRole || 'Software Engineer'
      )
      setEvaluationResult(res.data)
      setMockScoreHistory((prev) => [
        ...prev,
        { question: currentQ.question, score: res.data.overall_score }
      ])
      toast.success('Answer evaluated!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Evaluation failed.')
    } finally {
      setEvaluating(false)
    }
  }

  const handleNextQuestion = () => {
    if (activeQuestionIndex < questions.length - 1) {
      setActiveQuestionIndex((prev) => prev + 1)
      setUserAnswer('')
      setEvaluationResult(null)
    } else {
      toast.success('You have completed all questions in this set!')
    }
  }

  const filteredQuestions =
    selectedCategory === 'All'
      ? questions
      : questions.filter((q) => q.category?.toLowerCase() === selectedCategory.toLowerCase())

  const currentMockQ = questions[activeQuestionIndex]

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-violet-100 text-violet-700">
              <Mic size={18} />
            </span>
            <span className="text-xs font-bold text-violet-700 uppercase tracking-wider">
              AI Interview Preparation & Mock Simulator
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Interview Prep & AI Mock Interview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Practice targeted technical and behavioral questions customized to your resume and get instant AI feedback.
          </p>
        </div>

        <button
          onClick={handleGenerateQuestions}
          disabled={loading}
          className="btn-primary flex items-center gap-2 text-xs py-2 px-5 shadow-sm"
        >
          <Sparkles size={14} />
          {loading ? 'Generating Questions...' : 'Generate New Questions'}
        </button>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab('questions')}
          className={`pb-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'questions'
              ? 'text-primary-600 border-primary-600'
              : 'text-slate-400 border-transparent hover:text-slate-600'
          }`}
        >
          <BookOpen size={15} />
          Question Bank & Frameworks ({questions.length})
        </button>
        <button
          onClick={() => setActiveTab('mock')}
          className={`pb-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'mock'
              ? 'text-primary-600 border-primary-600'
              : 'text-slate-400 border-transparent hover:text-slate-600'
          }`}
        >
          <Mic size={15} />
          Interactive Mock Interview Session
        </button>
      </div>

      {/* Tab 1: Question Bank */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredQuestions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 space-y-3">
              <p>No questions generated yet for {targetRole}.</p>
              <button
                onClick={handleGenerateQuestions}
                className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5"
              >
                <Sparkles size={13} />
                Generate Interview Questions
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQuestions.map((q, idx) => {
                const showHint = expandedHints[q.id || idx]
                const showFramework = expandedFrameworks[q.id || idx]

                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase tracking-wider">
                          {q.category}
                        </span>
                        <h3 className="text-sm font-bold text-slate-800 leading-snug">
                          {q.question}
                        </h3>
                        {q.why_asked && (
                          <p className="text-xs text-slate-500">
                            <strong>Interviewer's Goal:</strong> {q.why_asked}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() =>
                          setExpandedHints((prev) => ({ ...prev, [q.id || idx]: !showHint }))
                        }
                        className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-all"
                      >
                        <Lightbulb size={13} className="text-amber-500" />
                        {showHint ? 'Hide Hint' : 'Show Hint'}
                      </button>

                      <button
                        onClick={() =>
                          setExpandedFrameworks((prev) => ({
                            ...prev,
                            [q.id || idx]: !showFramework
                          }))
                        }
                        className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-all"
                      >
                        <Award size={13} className="text-primary-600" />
                        {showFramework ? 'Hide Answer Framework' : 'Answer Framework'}
                      </button>

                      <button
                        onClick={() => {
                          setActiveQuestionIndex(questions.findIndex((item) => item.id === q.id))
                          setActiveTab('mock')
                        }}
                        className="ml-auto text-xs text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1"
                      >
                        Practice in Mock Mode
                        <ChevronRight size={13} />
                      </button>
                    </div>

                    {/* Hint Dropdown */}
                    {showHint && q.hint && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 leading-relaxed"
                      >
                        💡 <strong>Hint:</strong> {q.hint}
                      </motion.div>
                    )}

                    {/* Framework Dropdown */}
                    {showFramework && q.answer_framework && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-primary-50/70 border border-primary-200 rounded-xl p-3 text-xs text-primary-900 leading-relaxed font-mono whitespace-pre-line"
                      >
                        🎯 <strong>Framework:</strong>
                        {'\n'}
                        {q.answer_framework}
                      </motion.div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Interactive Mock Interview Session */}
      {activeTab === 'mock' && (
        <div className="space-y-6">
          {!currentMockQ ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 space-y-3">
              <p>Please generate questions first.</p>
              <button
                onClick={handleGenerateQuestions}
                className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5"
              >
                <Sparkles size={13} />
                Generate Questions
              </button>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
              {/* Question Banner */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">
                      Question {activeQuestionIndex + 1} of {questions.length}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {currentMockQ.category}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-slate-800 leading-snug">
                    {currentMockQ.question}
                  </h2>
                </div>
              </div>

              {/* User Answer Textarea */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Type Your Response (Practice STAR or technical structure)
                </label>
                <textarea
                  rows={6}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your spoken or written answer here..."
                  className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handleNextQuestion}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
                >
                  Skip to Next Question →
                </button>

                <button
                  onClick={handleEvaluateAnswer}
                  disabled={evaluating || !userAnswer.trim()}
                  className="btn-primary flex items-center gap-1.5 text-xs py-2 px-5"
                >
                  <Send size={14} />
                  {evaluating ? 'Evaluating with AI...' : 'Submit & Evaluate Answer'}
                </button>
              </div>

              {/* Evaluation Result Display */}
              <AnimatePresence>
                {evaluationResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 pt-6 border-t border-slate-200 space-y-5"
                  >
                    {/* Overall Score */}
                    <div className="flex items-center justify-between bg-slate-900 text-white p-5 rounded-2xl shadow-sm">
                      <div>
                        <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
                          Answer Assessment
                        </span>
                        <h3 className="text-xl font-bold mt-0.5">Overall Score</h3>
                      </div>
                      <div className="text-3xl font-extrabold text-emerald-400">
                        {evaluationResult.overall_score}/100
                      </div>
                    </div>

                    {/* Sub-Scores Grid */}
                    {evaluationResult.scores && (
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {Object.entries(evaluationResult.scores).map(([k, v]) => (
                          <div
                            key={k}
                            className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center"
                          >
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              {k.replace('_', ' ')}
                            </p>
                            <p className="text-sm font-extrabold text-slate-800 mt-0.5">{v}%</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Strengths & Weaknesses */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 space-y-2">
                        <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                          Key Strengths
                        </p>
                        {evaluationResult.strengths?.map((str, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-xs text-emerald-900">
                            <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                            <span>{str}</span>
                          </div>
                        ))}
                      </div>

                      <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 space-y-2">
                        <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                          Areas for Improvement
                        </p>
                        {evaluationResult.weaknesses?.map((wk, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-xs text-amber-900">
                            <span className="text-amber-500 font-bold">•</span>
                            <span>{wk}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Next Question CTA */}
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleNextQuestion}
                        className="btn-primary flex items-center gap-1.5 text-xs py-2 px-5"
                      >
                        Next Question
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
