import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { CareerProvider } from './context/CareerContext'
import { ResumeProvider } from './context/ResumeContext'
import { ThemeProvider, useTheme } from './context/ThemeContext'

import Sidebar from './components/Sidebar'
import Header from './components/Header'
import AuthModal from './components/AuthModal'
import Dashboard from './pages/Dashboard'
import JDAnalyzerPage from './pages/JDAnalyzerPage'
import AnalysisPage from './pages/AnalysisPage'
import SkillGapPage from './pages/SkillGapPage'
import RewriterPage from './pages/RewriterPage'
import TailoredResumePage from './pages/TailoredResumePage'
import ATSSimulatorPage from './pages/ATSSimulatorPage'
import CareerRoadmapPage from './pages/CareerRoadmapPage'
import InterviewPrepPage from './pages/InterviewPrepPage'
import ApplicationsPage from './pages/ApplicationsPage'
import ResumeVersionsPage from './pages/ResumeVersionsPage'
import ResumeBuilder from './pages/ResumeBuilder'
import ProfilePage from './pages/ProfilePage'

function AppInner() {
  const [activePage, setActivePage] = useState('dashboard')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('career_ai_sidebar_collapsed') === 'true'
    } catch {
      return false
    }
  })
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { isDark } = useTheme()

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev
      try {
        localStorage.setItem('career_ai_sidebar_collapsed', String(next))
      } catch (e) {
        console.warn('Could not save sidebar state', e)
      }
      return next
    })
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard onNavigate={setActivePage} />
      case 'jd-analyzer':
        return <JDAnalyzerPage onNavigate={setActivePage} />
      case 'analysis-flow':
      case 'analysis':
        return <AnalysisPage onNavigate={setActivePage} />
      case 'skill-gap':
        return <SkillGapPage onNavigate={setActivePage} />
      case 'rewriter':
        return <RewriterPage onNavigate={setActivePage} />
      case 'tailored-resume':
        return <TailoredResumePage onNavigate={setActivePage} />
      case 'ats-simulator':
        return <ATSSimulatorPage onNavigate={setActivePage} />
      case 'roadmap':
        return <CareerRoadmapPage onNavigate={setActivePage} />
      case 'interview-prep':
        return <InterviewPrepPage onNavigate={setActivePage} />
      case 'applications':
        return <ApplicationsPage onNavigate={setActivePage} />
      case 'resume-versions':
        return <ResumeVersionsPage onNavigate={setActivePage} />
      case 'builder':
        return <ResumeBuilder />
      case 'profile':
        return <ProfilePage onNavigate={setActivePage} />
      default:
        return <Dashboard onNavigate={setActivePage} />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: isDark ? '#0f172a' : '#ffffff',
            color: isDark ? '#f8fafc' : '#1e293b',
            border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
            borderRadius: '12px',
            boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.08)',
            fontSize: '13px',
            fontWeight: 500
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />

      {/* Sidebar with collapse support and dark mode styling */}
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Sticky Header with Sidebar Toggle Button & Dark/Light Mode Button */}
        <Header
          activePage={activePage}
          sidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={toggleSidebar}
          onNavigate={setActivePage}
          onOpenAuth={() => setShowAuthModal(true)}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {renderPage()}
        </main>
      </div>

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CareerProvider>
          <ResumeProvider>
            <AppInner />
          </ResumeProvider>
        </CareerProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
