import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

// Sync logged-in user's name+email into the profile localStorage key
function syncProfileFromUser(user) {
  if (!user) return
  try {
    const existing = JSON.parse(localStorage.getItem('userProfile')) || {}
    const updated = {
      ...existing,
      name: user.full_name || existing.name || '',
      email: user.email || existing.email || '',
    }
    localStorage.setItem('userProfile', JSON.stringify(updated))
  } catch { /* ignore */ }
}

// Clear profile name/email on logout (keep phone/college/dob etc.)
function clearProfileAuth() {
  try {
    const existing = JSON.parse(localStorage.getItem('userProfile')) || {}
    const cleared = { ...existing, name: '', email: '' }
    localStorage.setItem('userProfile', JSON.stringify(cleared))
  } catch { /* ignore */ }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('authToken'))
  const [loading, setLoading] = useState(true)

  // Verify token on mount
  useEffect(() => {
    if (!token) { setLoading(false); return }
    axios.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { setUser(r.data); syncProfileFromUser(r.data) })
      .catch(() => { setToken(null); localStorage.removeItem('authToken') })
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password })
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem('authToken', data.token)
    syncProfileFromUser(data.user)
    return data.user
  }

  const register = async (full_name, email, password, confirm_password) => {
    const { data } = await axios.post('/api/auth/register', { full_name, email, password, confirm_password })
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem('authToken', data.token)
    syncProfileFromUser(data.user)
    return data.user
  }

  const logout = () => {
    clearProfileAuth()
    setUser(null)
    setToken(null)
    localStorage.removeItem('authToken')
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
