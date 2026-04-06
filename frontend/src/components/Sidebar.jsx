import { motion } from 'framer-motion'
import { LayoutDashboard, BarChart3, GitCompare, Sparkles, Zap, FileEdit, UserCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'analysis', label: 'Analysis', icon: BarChart3 },
  { id: 'compare', label: 'Compare Roles', icon: GitCompare },
  { id: 'builder', label: 'Resume Builder', icon: FileEdit, badge: 'New' },
]

export default function Sidebar({ activePage, onNavigate }) {
  const { user } = useAuth()
  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-64 h-screen flex flex-col bg-white border-r border-slate-200 shrink-0 shadow-sm"
    >
      {/* Logo */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-md shadow-primary-200">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-sm text-slate-800 leading-tight">Resume AI</p>
            <p className="text-xs text-slate-400">Skill Gap Analyzer</p>
          </div>
        </div>
        {user && (
          <div className="mt-3 flex items-center gap-2 px-2 py-2 rounded-xl bg-primary-50 border border-primary-100">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">{user.full_name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-700 truncate">{user.full_name}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-3">Navigation</p>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activePage === item.id
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary-50 text-primary-600 border border-primary-100'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-primary-500' : ''} />
              {item.label}
              <div className="ml-auto flex items-center gap-1.5">
                {item.badge && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary-100 text-primary-600 font-semibold leading-none">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="w-1.5 h-1.5 rounded-full bg-primary-500"
                  />
                )}
              </div>
            </motion.button>
          )
        })}
      </nav>

      {/* Bottom: Profile + AI badge */}
      <div className="p-4 space-y-3">
        {/* Profile button */}
        <motion.button
          onClick={() => onNavigate('profile')}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.97 }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            activePage === 'profile'
              ? 'bg-primary-50 text-primary-600 border border-primary-100'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <UserCircle size={18} className={activePage === 'profile' ? 'text-primary-500' : ''} />
          My Profile
          {activePage === 'profile' && (
            <motion.div layoutId="activeIndicator" className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500" />
          )}
        </motion.button>

        {/* AI badge */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-amber-500" />
            <span className="text-xs font-semibold text-amber-600">AI Powered</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Powered by spaCy NLP + TF-IDF cosine similarity for accurate skill matching.
          </p>
        </div>
      </div>
    </motion.aside>
  )
}
