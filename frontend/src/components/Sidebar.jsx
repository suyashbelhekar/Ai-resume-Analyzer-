import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  FileSearch,
  BarChart3,
  Target,
  Edit3,
  Wand2,
  ShieldCheck,
  Map,
  Mic,
  Kanban,
  Layers,
  FileEdit,
  UserCircle,
  Zap,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCareer } from '../context/CareerContext'
import { useTheme } from '../context/ThemeContext'

const navGroups = [
  {
    title: 'Core Intelligence',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'jd-analyzer', label: 'Job Description', icon: FileSearch, badge: 'AI' },
      { id: 'analysis-flow', label: 'Resume Analyzer', icon: BarChart3 },
      { id: 'skill-gap', label: 'Skill Gap & Evidence', icon: Target },
    ]
  },
  {
    title: 'Resume Engineering',
    items: [
      { id: 'rewriter', label: 'AI Rewriter', icon: Edit3, badge: 'AI' },
      { id: 'tailored-resume', label: 'Tailored Resume', icon: Wand2, badge: 'Pro' },
      { id: 'ats-simulator', label: 'ATS Simulator', icon: ShieldCheck },
      { id: 'builder', label: 'Resume Builder', icon: FileEdit },
      { id: 'resume-versions', label: 'Resume Versions', icon: Layers },
    ]
  },
  {
    title: 'Career Readiness',
    items: [
      { id: 'roadmap', label: 'Career Roadmap', icon: Map, badge: 'AI' },
      { id: 'interview-prep', label: 'Interview & Mock', icon: Mic, badge: 'AI' },
      { id: 'applications', label: 'Job Tracker', icon: Kanban },
    ]
  }
]

export default function Sidebar({
  activePage,
  onNavigate,
  isCollapsed = false,
  onToggleCollapse
}) {
  const { user } = useAuth()
  const { backendStatus } = useCareer()
  const { isDark, toggleTheme } = useTheme()

  return (
    <aside
      className={`h-screen flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0 shadow-sm transition-all duration-300 ease-in-out z-30 ${
        isCollapsed ? 'w-20' : 'w-64'
      } overflow-y-auto overflow-x-hidden`}
    >
      {/* Brand & Collapse Header */}
      <div className={`p-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-10 flex items-center ${
        isCollapsed ? 'justify-center' : 'justify-between'
      }`}>
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-primary-200 dark:shadow-primary-950 shrink-0">
            <Sparkles size={18} className="text-white" />
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="min-w-0"
            >
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base text-slate-800 dark:text-slate-100 tracking-tight">
                  Career<span className="text-primary-600 dark:text-primary-400">AI</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-primary-100 dark:bg-primary-900/60 text-primary-700 dark:text-primary-300 font-semibold">
                  3.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium truncate">
                Career Intelligence Platform
              </p>
            </motion.div>
          )}
        </div>

        {/* Sidebar Collapse/Expand Button in Header */}
        <button
          onClick={onToggleCollapse}
          id="sidebar-header-toggle"
          aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
            isCollapsed ? 'hidden' : 'flex items-center justify-center'
          }`}
        >
          <ChevronLeft size={17} />
        </button>
      </div>

      {/* User Mini Profile (when expanded) */}
      {!isCollapsed && user && (
        <div className="mx-3 mt-3 p-2.5 rounded-xl bg-primary-50/70 dark:bg-slate-800/60 border border-primary-100 dark:border-slate-700/80 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center shrink-0 shadow-xs">
            <span className="text-white text-xs font-bold">{user.full_name?.charAt(0).toUpperCase() || 'U'}</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{user.full_name}</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{user.email}</p>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-4">
        {navGroups.map((group) => (
          <div key={group.title}>
            {!isCollapsed ? (
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-1.5">
                {group.title}
              </p>
            ) : (
              <div className="w-8 h-[1px] bg-slate-200 dark:bg-slate-800 mx-auto my-2" />
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon
                const isActive = activePage === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center rounded-xl text-xs font-medium transition-all duration-150 group relative ${
                      isCollapsed
                        ? 'justify-center p-2.5'
                        : 'gap-2.5 px-3 py-2'
                    } ${
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 font-semibold border border-primary-200/80 dark:border-primary-800/80 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon
                      size={isCollapsed ? 19 : 16}
                      className={`shrink-0 ${
                        isActive
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                      }`}
                    />

                    {!isCollapsed && (
                      <>
                        <span className="truncate">{item.label}</span>
                        <div className="ml-auto flex items-center gap-1">
                          {item.badge && (
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none ${
                                item.badge === 'AI'
                                  ? 'bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300'
                                  : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-600 dark:bg-primary-400" />
                          )}
                        </div>
                      </>
                    )}

                    {/* Tooltip for collapsed mode */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 dark:bg-slate-800 text-white text-xs rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                        {item.label}
                        {item.badge && (
                          <span className="ml-1.5 text-[10px] text-primary-300 font-bold">[{item.badge}]</span>
                        )}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
        {/* Dark / Light Mode Toggle Button in Sidebar */}
        <button
          onClick={toggleTheme}
          id="sidebar-theme-toggle-btn"
          aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className={`w-full flex items-center rounded-xl text-xs font-medium transition-all ${
            isCollapsed
              ? 'justify-center p-2.5'
              : 'gap-2.5 px-3 py-2'
          } ${
            isDark
              ? 'text-amber-300 hover:bg-slate-800 hover:text-amber-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          {isDark ? (
            <Sun size={isCollapsed ? 19 : 16} className="text-amber-400 shrink-0" />
          ) : (
            <Moon size={isCollapsed ? 19 : 16} className="text-slate-500 shrink-0" />
          )}
          {!isCollapsed && (
            <span className="text-slate-700 dark:text-slate-300">
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </span>
          )}
        </button>

        {/* Profile Link */}
        <button
          onClick={() => onNavigate('profile')}
          title={isCollapsed ? "Profile & Settings" : undefined}
          className={`w-full flex items-center rounded-xl text-xs font-medium transition-all ${
            isCollapsed
              ? 'justify-center p-2.5'
              : 'gap-2.5 px-3 py-2'
          } ${
            activePage === 'profile'
              ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 font-semibold border border-primary-200 dark:border-primary-800'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white dark:hover:bg-slate-800'
          }`}
        >
          <UserCircle size={isCollapsed ? 19 : 16} className={activePage === 'profile' ? 'text-primary-600 dark:text-primary-400 shrink-0' : 'text-slate-400 shrink-0'} />
          {!isCollapsed && <span>Profile & Settings</span>}
        </button>
      </div>
    </aside>
  )
}
