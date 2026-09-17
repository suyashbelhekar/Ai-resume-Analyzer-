import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  Hash,
  Edit3,
  Save,
  X,
  Camera,
  LogOut,
  LogIn
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import apiService from '../services/api'

const defaultProfile = { name: '', email: '', phone: '', college: '', dob: '', age: '', bio: '', avatar: '' }

function calcAge(dob) {
  if (!dob) return ''
  const age = Math.floor((Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
  return isNaN(age) || age < 0 ? '' : String(age)
}

const inputCls =
  'w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 placeholder-slate-300 dark:placeholder-slate-500 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30 transition-all'

const fields = [
  { key: 'name', label: 'Full Name', icon: User, type: 'text', placeholder: 'John Doe' },
  { key: 'email', label: 'Email Address', icon: Mail, type: 'email', placeholder: 'john@example.com' },
  { key: 'phone', label: 'Mobile Number', icon: Phone, type: 'tel', placeholder: '+1 234 567 8900' },
  { key: 'college', label: 'College / University', icon: GraduationCap, type: 'text', placeholder: 'MIT, Stanford...' },
  { key: 'dob', label: 'Date of Birth', icon: Calendar, type: 'date', placeholder: '' },
  { key: 'age', label: 'Age', icon: Hash, type: 'number', placeholder: 'Auto-calculated', readonly: true },
]

function loadLocalProfile() {
  try {
    return JSON.parse(localStorage.getItem('userProfile')) || defaultProfile
  } catch {
    return defaultProfile
  }
}

export default function ProfilePage({ onNavigate }) {
  const { user, logout } = useAuth()

  const [profile, setProfile] = useState(loadLocalProfile)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(profile)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef(null)

  // Load profile from database when user is authenticated
  useEffect(() => {
    if (user) {
      apiService.getProfile()
        .then((res) => {
          const dbProfile = res.data?.profile || {}
          const merged = {
            ...loadLocalProfile(),
            ...dbProfile,
            name: user.full_name || dbProfile.name || '',
            email: user.email || dbProfile.email || '',
          }
          if (merged.dob) merged.age = calcAge(merged.dob)
          setProfile(merged)
          setDraft(merged)
          try {
            localStorage.setItem('userProfile', JSON.stringify(merged))
          } catch (e) {
            console.warn(e)
          }
        })
        .catch(() => {
          const local = loadLocalProfile()
          const synced = { ...local, name: user.full_name || local.name, email: user.email || local.email }
          setProfile(synced)
          setDraft(synced)
        })
    } else {
      const local = loadLocalProfile()
      setProfile(local)
      setDraft(local)
    }
  }, [user])

  useEffect(() => {
    if (draft.dob) setDraft((prev) => ({ ...prev, age: calcAge(prev.dob) }))
  }, [draft.dob])

  const handleEdit = () => {
    setDraft(profile)
    setEditing(true)
  }

  const handleCancel = () => {
    setDraft(profile)
    setEditing(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      setProfile(draft)
      localStorage.setItem('userProfile', JSON.stringify(draft))

      if (user) {
        await apiService.updateProfile(draft)
      }
      setEditing(false)
      toast.success('Profile saved successfully!')
    } catch (err) {
      console.error('Error saving profile:', err)
      toast.success('Profile saved locally.')
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }))

  const handleAvatar = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2MB')
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => setDraft((prev) => ({ ...prev, avatar: ev.target.result }))
    reader.readAsDataURL(file)
  }

  const handleSignOut = () => {
    logout()
    toast.success('Signed out successfully.')
  }

  const displayData = editing ? draft : profile
  const initials = (profile.name || user?.full_name || 'U')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
  const completedFields = fields.filter((f) => profile[f.key]?.toString().trim()).length
  const completion = Math.round((completedFields / fields.length) * 100)

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            User Profile
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your personal profile, credentials, and account details.
          </p>
        </div>

        {user ? (
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60 text-xs font-semibold transition-colors self-start"
          >
            <LogOut size={14} /> Sign Out
          </button>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-300 font-medium">
            <LogIn size={14} className="text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Sign in to save and sync your profile across devices</span>
          </div>
        )}
      </div>

      {/* Profile Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-primary-600 via-indigo-600 to-violet-600 relative" />
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl border-4 border-white dark:border-slate-900 shadow-md overflow-hidden bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center">
                {displayData.avatar ? (
                  <img src={displayData.avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-white">{initials}</span>
                )}
              </div>
              {editing && (
                <>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-md hover:bg-primary-700 transition-colors"
                  >
                    <Camera size={13} />
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-10">
              {editing ? (
                <>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold"
                  >
                    <X size={13} className="inline mr-1" /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary text-xs py-1.5 px-4 flex items-center gap-1.5"
                  >
                    <Save size={13} /> {saving ? 'Saving...' : 'Save'}
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEdit}
                  className="btn-primary text-xs py-1.5 px-4 flex items-center gap-1.5"
                >
                  <Edit3 size={13} /> Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {profile.name || user?.full_name || 'Candidate Name'}
              </h2>
              {profile.college && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{profile.college}</p>
              )}
              <p className="text-xs text-slate-400 dark:text-slate-500">{profile.email || user?.email}</p>
            </div>
            <div className="sm:text-right">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Profile completeness: </span>
              <strong className="text-primary-600 dark:text-primary-400 text-xs">{completion}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((field) => {
          const Icon = field.icon
          const val = displayData[field.key]?.toString() || ''
          const isAuthLocked = user && (field.key === 'name' || field.key === 'email')

          return (
            <div
              key={field.key}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs p-4 space-y-2"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-primary-50 dark:bg-primary-950/60 flex items-center justify-center shrink-0">
                  <Icon size={13} className="text-primary-600 dark:text-primary-400" />
                </div>
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  {field.label}
                </label>
              </div>

              {editing && !field.readonly && !isAuthLocked ? (
                <input
                  type={field.type}
                  value={val}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className={inputCls}
                />
              ) : (
                <p className={`text-xs font-medium px-1 ${val ? 'text-slate-700 dark:text-slate-200' : 'text-slate-300 dark:text-slate-600 italic'}`}>
                  {field.key === 'dob' && val
                    ? new Date(val).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                    : field.key === 'age'
                    ? profile.dob
                      ? `${calcAge(profile.dob)} years old`
                      : 'Set DOB to calculate'
                    : val || `Enter ${field.label.toLowerCase()}...`}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
