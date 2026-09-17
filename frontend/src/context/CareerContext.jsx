import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import apiService from '../services/api'
import { useAuth } from './AuthContext'

const CareerContext = createContext(null)

export function CareerProvider({ children }) {
  const { user } = useAuth()

  // State
  const [uploadedFile, setUploadedFile] = useState(null)
  const [resumeText, setResumeText] = useState('')
  const [targetRole, setTargetRole] = useState('Software Engineer')
  const [targetJD, setTargetJD] = useState('')
  const [parsedJD, setParsedJD] = useState(null)

  // Intelligence Results
  const [analysisResult, setAnalysisResult] = useState(null)
  const [matchResult, setMatchResult] = useState(null)
  const [atsResult, setAtsResult] = useState(null)
  const [skillGapResult, setSkillGapResult] = useState(null)
  const [roadmapResult, setRoadmapResult] = useState(null)
  const [tailoredResult, setTailoredResult] = useState(null)

  // Persistent Collections
  const [applications, setApplications] = useState([])
  const [savedJDs, setSavedJDs] = useState([])
  const [resumeVersions, setResumeVersions] = useState([])
  const [backendStatus, setBackendStatus] = useState({ online: true, gemini_active: false })
  const [loading, setLoading] = useState(false)

  // Fetch backend status and user data on load / auth change
  useEffect(() => {
    fetchBackendStatus()
    if (user) {
      loadUserData()
    } else {
      setApplications([])
      setSavedJDs([])
      setResumeVersions([])
      setRoadmapResult(null)
    }
  }, [user])

  const fetchBackendStatus = async () => {
    try {
      const { data } = await apiService.getStatus()
      setBackendStatus(data)
    } catch {
      setBackendStatus({ online: false, gemini_active: false })
    }
  }

  const loadUserData = async () => {
    try {
      const [appsRes, jdsRes, versionsRes, roadRes] = await Promise.allSettled([
        apiService.listApplications(),
        apiService.listJDs(),
        apiService.listResumeVersions(),
        apiService.getRoadmap(targetRole),
      ])

      if (appsRes.status === 'fulfilled') setApplications(appsRes.value.data.applications || [])
      if (jdsRes.status === 'fulfilled') setSavedJDs(jdsRes.value.data.job_descriptions || [])
      if (versionsRes.status === 'fulfilled') setResumeVersions(versionsRes.value.data.versions || [])
      if (roadRes.status === 'fulfilled' && roadRes.value.data.roadmap_data) {
        setRoadmapResult(roadRes.value.data.roadmap_data)
      }
    } catch (e) {
      console.error('Error loading user data:', e)
    }
  }

  // Helper actions
  const refreshApplications = async () => {
    try {
      const { data } = await apiService.listApplications()
      setApplications(data.applications || [])
    } catch (e) {
      console.error(e)
    }
  }

  const refreshJDs = async () => {
    try {
      const { data } = await apiService.listJDs()
      setSavedJDs(data.job_descriptions || [])
    } catch (e) {
      console.error(e)
    }
  }

  const refreshResumeVersions = async () => {
    try {
      const { data } = await apiService.listResumeVersions()
      setResumeVersions(data.versions || [])
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <CareerContext.Provider
      value={{
        uploadedFile,
        setUploadedFile,
        resumeText,
        setResumeText,
        targetRole,
        setTargetRole,
        targetJD,
        setTargetJD,
        parsedJD,
        setParsedJD,
        analysisResult,
        setAnalysisResult,
        matchResult,
        setMatchResult,
        atsResult,
        setAtsResult,
        skillGapResult,
        setSkillGapResult,
        roadmapResult,
        setRoadmapResult,
        tailoredResult,
        setTailoredResult,
        applications,
        setApplications,
        savedJDs,
        setSavedJDs,
        resumeVersions,
        setResumeVersions,
        backendStatus,
        loading,
        setLoading,
        refreshApplications,
        refreshJDs,
        refreshResumeVersions,
      }}
    >
      {children}
    </CareerContext.Provider>
  )
}

export const useCareer = () => useContext(CareerContext)
export default CareerContext
