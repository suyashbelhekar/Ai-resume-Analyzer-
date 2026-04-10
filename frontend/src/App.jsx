import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import AnalysisPage from './pages/AnalysisPage'
import ComparePage from './pages/ComparePage'
import ResumeBuilder from './pages/ResumeBuilder'
import ProfilePage from './pages/ProfilePage'

function AppInner() {
  const [activePage, setActivePage] = useState('dashboard')
  const [analysisResult, setAnalysisResult] = useState(null)
  const [compareResult, setCompareResult] = useState(null)
  const [uploadedFile, setUploadedFile] = useState(null)

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <Dashboard
            onNavigate={setActivePage}
            analysisResult={analysisResult}
            setAnalysisResult={setAnalysisResult}
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
          />
        )
      case 'analysis':
        return <AnalysisPage result={analysisResult} uploadedFile={uploadedFile} onNavigate={setActivePage} />
      case 'compare':
        return (
          <ComparePage
            result={compareResult}
            setResult={setCompareResult}
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
          />
        )
      case 'builder':
        return <ResumeBuilder analysisResult={analysisResult} />
      case 'profile':
        return <ProfilePage />
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#1e293b',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}
