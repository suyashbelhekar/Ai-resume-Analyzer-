import { motion } from 'framer-motion'
import {
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon,
  Zap,
  UserCircle,
  LogIn,
  Sparkles,
  ChevronRight
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { useCareer } from '../context/CareerContext'

const PAGE_TITLES = {
  'dashboard': { title: 'Command Center', category: 'Overview' },
  'jd-analyzer': { title: 'Job Description Analyzer', category: 'Intelligence' },
  'analysis-flow': { title: '9D Resume Analyzer', category: 'Intelligence' },
  'analysis': { title: '9D Resume Analyzer', category: 'Intelligence' },
  'skill-gap': { title: 'Skill Gap & Evidence', category: 'Intelligence' },
  'rewriter': { title: 'AI Resume Rewriter', category: 'Engineering' },
  'tailored-resume': { title: 'Tailored Resume Generator', category: 'Engineering' },
  'ats-simulator': { title: 'ATS Simulator', category: 'Engineering' },
  'builder': { title: 'Visual Resume Builder', category: 'Engineering' },
  'resume-versions': { title: 'Resume Version Control', category: 'Engineering' },
  'roadmap': { title: 'Career Roadmap', category: 'Readiness' },
  'interview-prep': { title: 'Interview Prep & Mock', category: 'Readiness' },
  'applications': { title: 'Job Tracker', category: 'Readiness' },
  'profile': { title: 'Profile & Settings', category: 'Account' }
}

export default function Header({
  activePage,
  sidebarCollapsed,
  onToggleSidebar,
  onNavigate,
  onOpenAuth
}) {
  const { isDark, toggleTheme } = useTheme()
  const { user } = useAuth()
  const { backendStatus } = useCareer()

  const currentPage = PAGE_TITLES[activePage] || { title: 'CareerAI Platform', category: 'Intelligence' }

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 md:px-6 flex items-center justify-between transition-colors duration-200 shadow-xs">
      {/* Left side: Sidebar toggle button & Breadcrumb */}
      <div className="flex items-center gap-3">
        {/* Toggle Sidebar Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onToggleSidebar}
          id="sidebar-toggle-btn"
          aria-label={sidebarCollapsed ? "Open Sidebar" : "Close Sidebar"}
          title={sidebarCollapsed ? "Open Sidebar (Expand)" : "Close Sidebar (Collapse)"}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 hover:text-primary-600 dark:hover:text-primary-400 transition-all flex items-center justify-center shadow-xs"
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen size={19} className="text-primary-600 dark:text-primary-400" />
          ) : (
            <PanelLeftClose size={19} />
          )}
        </motion.button>

        {/* Page Title & Breadcrumb */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-400 dark:text-slate-500">
          <span className="text-slate-500 dark:text-slate-400">{currentPage.category}</span>
          <ChevronRight size={14} />
          <h1 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            {currentPage.title}
          </h1>
        </div>

        <div className="sm:hidden font-bold text-sm text-slate-800 dark:text-slate-100 truncate">
          {currentPage.title}
        </div>
      </div>

      {/* Right side: Dark Mode Toggle, User Profile */}
      <div className="flex items-center gap-2.5">
        {/* Dark Mode / Light Mode Toggle Button */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.05 }}
          onClick={toggleTheme}
          id="theme-toggle-btn"
          aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className={`p-2 rounded-xl border transition-all duration-200 flex items-center justify-center shadow-xs ${
            isDark
              ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700 hover:text-amber-200 shadow-amber-900/10'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-primary-600 shadow-slate-200/50'
          }`}
        >
          {isDark ? (
            <Sun size={18} className="transition-transform duration-300 rotate-0 hover:rotate-45" />
          ) : (
            <Moon size={18} className="transition-transform duration-300 -rotate-12 hover:rotate-0 text-slate-700" />
          )}
        </motion.button>

        {/* User Pill / Login Button */}
        {user ? (
          <button
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-xl bg-primary-50 dark:bg-primary-950/40 border border-primary-100 dark:border-primary-800 hover:bg-primary-100/70 transition-all text-xs"
            title="View Profile & Settings"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center text-white font-bold text-[11px] shadow-2xs">
              {user.full_name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="font-semibold text-primary-900 dark:text-primary-200 hidden lg:inline max-w-[100px] truncate">
              {user.full_name?.split(' ')[0]}
            </span>
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-primary-600 to-violet-600 text-white font-semibold text-xs shadow-xs hover:opacity-95 transition-all"
          >
            <LogIn size={14} />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  )
}
