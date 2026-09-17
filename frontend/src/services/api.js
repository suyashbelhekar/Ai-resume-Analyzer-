import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 60000,
})

// Attach auth token to all requests if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const apiService = {
  // System Status
  getStatus: () => API.get('/status'),
  getRoles: () => API.get('/roles'),

  // Auth
  login: (email, password) => API.post('/auth/login', { email, password }),
  register: (full_name, email, password, confirm_password) =>
    API.post('/auth/register', { full_name, email, password, confirm_password }),
  getMe: () => API.get('/auth/me'),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (profileData) => API.put('/auth/profile', profileData),

  // Legacy / Direct Upload Analysis
  analyzeResumeFile: (formData) =>
    API.post('/analyze', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  compareRoles: (formData) =>
    API.post('/compare', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  downloadReport: (formData) =>
    API.post('/report', formData, { responseType: 'blob', headers: { 'Content-Type': 'multipart/form-data' } }),

  // 1. Job Description Analyzer
  analyzeJD: (data, isFormData = false) =>
    API.post('/jd/analyze', data, isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {}),
  saveJD: (title, company, raw_text, parsed_data) =>
    API.post('/jd/save', { title, company, raw_text, parsed_data }),
  listJDs: () => API.get('/jd/list'),
  deleteJD: (id) => API.delete(`/jd/${id}`),

  // 2. Resume + JD Intelligence Match
  matchResumeJD: (resume_text, jd_text, target_role) =>
    API.post('/match', { resume_text, jd_text, target_role }),

  // 3. Skill Gap & Evidence Mapping
  getSkillGaps: (resume_text, jd_text, target_role) =>
    API.post('/skill-gap', { resume_text, jd_text, target_role }),

  // 4. AI Resume Rewriter
  rewriteSection: (content, section_type, mode, target_jd = '') =>
    API.post('/rewrite', { content, section_type, mode, target_jd }),

  // 5. Tailored Resume Generator
  tailorResume: (resume_data, jd_text) =>
    API.post('/tailored-resume', { resume_data, jd_text }),

  // 6. ATS Simulator
  simulateATS: (data, isFormData = false) =>
    API.post('/ats/analyze', data, isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {}),

  // 7. Career Roadmap
  generateRoadmap: (resume_text, jd_text, target_role) =>
    API.post('/roadmap', { resume_text, jd_text, target_role }),
  getRoadmap: (target_role) =>
    API.get('/roadmap', { params: target_role ? { target_role } : {} }),
  updateRoadmapProgress: (id, completed_milestones) =>
    API.put(`/roadmap/${id}/progress`, { completed_milestones }),

  // 8. Interview Prep & Mock
  generateInterviewQuestions: (resume_text, jd_text, target_role) =>
    API.post('/interview/generate', { resume_text, jd_text, target_role }),
  evaluateInterviewAnswer: (question, user_answer, category, target_role, context = '') =>
    API.post('/interview/evaluate', { question, user_answer, category, target_role, context }),

  // 9. Job Applications CRUD
  listApplications: () => API.get('/applications'),
  createApplication: (appData) => API.post('/applications', appData),
  updateApplication: (id, updates) => API.put(`/applications/${id}`, updates),
  deleteApplication: (id) => API.delete(`/applications/${id}`),

  // 10. Resume Versions & Comparison
  listResumeVersions: () => API.get('/resumes/versions'),
  saveResumeVersion: (versionData) => API.post('/resumes/versions', versionData),
  getResumeVersion: (id) => API.get(`/resumes/versions/${id}`),
  deleteResumeVersion: (id) => API.delete(`/resumes/versions/${id}`),
  compareResumeVersions: (version_id_1, version_id_2) =>
    API.post('/resumes/compare-versions', { version_id_1, version_id_2 }),
}

export default apiService
