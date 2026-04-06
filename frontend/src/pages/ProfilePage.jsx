import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { toast } from "react-hot-toast"
import {
  User, Mail, Phone, GraduationCap, Calendar, Hash,
  Edit3, Save, X, Camera, CheckCircle, LogOut, LogIn
} from "lucide-react"
import { useAuth } from "../context/AuthContext"

const defaultProfile = { name: "", email: "", phone: "", college: "", dob: "", age: "", bio: "", avatar: "" }

function calcAge(dob) {
  if (!dob) return ""
  const age = Math.floor((Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
  return isNaN(age) || age < 0 ? "" : String(age)
}

const inputCls = "w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 placeholder-slate-300 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"

const fields = [
  { key: "name",    label: "Full Name",           icon: User,          type: "text",   placeholder: "John Doe" },
  { key: "email",   label: "Email Address",        icon: Mail,          type: "email",  placeholder: "john@example.com" },
  { key: "phone",   label: "Mobile Number",        icon: Phone,         type: "tel",    placeholder: "+1 234 567 8900" },
  { key: "college", label: "College / University", icon: GraduationCap, type: "text",   placeholder: "MIT, Stanford..." },
  { key: "dob",     label: "Date of Birth",        icon: Calendar,      type: "date",   placeholder: "" },
  { key: "age",     label: "Age",                  icon: Hash,          type: "number", placeholder: "Auto-calculated", readonly: true },
]

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06 } })
}

function loadProfile() {
  try { return JSON.parse(localStorage.getItem("userProfile")) || defaultProfile }
  catch { return defaultProfile }
}

export default function ProfilePage({ onNavigate }) {
  const { user, logout } = useAuth()

  const [profile, setProfile] = useState(loadProfile)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(profile)
  const fileRef = useRef(null)

  // Re-sync whenever auth user changes (login / logout)
  useEffect(() => {
    const fresh = loadProfile()
    setProfile(fresh)
    setDraft(fresh)
  }, [user])

  useEffect(() => {
    if (draft.dob) setDraft(prev => ({ ...prev, age: calcAge(prev.dob) }))
  }, [draft.dob])

  const handleEdit = () => { setDraft(profile); setEditing(true) }
  const handleCancel = () => { setDraft(profile); setEditing(false) }
  const handleSave = () => {
    setProfile(draft)
    localStorage.setItem("userProfile", JSON.stringify(draft))
    setEditing(false)
    toast.success("Profile saved!")
  }
  const handleChange = (key, value) => setDraft(prev => ({ ...prev, [key]: value }))
  const handleAvatar = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { toast.error("Image must be under 2MB"); return }
    const reader = new FileReader()
    reader.onload = (ev) => setDraft(prev => ({ ...prev, avatar: ev.target.result }))
    reader.readAsDataURL(file)
  }
  const handleSignOut = () => {
    logout()
    toast.success("Signed out successfully.")
  }

  const displayData = editing ? draft : profile
  const initials = (profile.name || user?.full_name || "U").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
  const completedFields = fields.filter(f => profile[f.key]?.toString().trim()).length
  const completion = Math.round((completedFields / fields.length) * 100)

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>
          <p className="text-slate-400 mt-1">Manage your personal information</p>
        </div>
        {/* Sign Out / Login prompt */}
        {user ? (
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium transition-colors"
          >
            <LogOut size={15} /> Sign Out
          </motion.button>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200">
            <LogIn size={14} className="text-amber-500" />
            <span className="text-xs text-amber-600 font-medium">Login to auto-fill your info</span>
          </div>
        )}
      </motion.div>

      {/* Profile card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        <div className="h-28 bg-gradient-to-r from-primary-500 via-violet-500 to-purple-600 relative">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        </div>
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-5">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-md overflow-hidden bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center">
                {displayData.avatar
                  ? <img src={displayData.avatar} alt="avatar" className="w-full h-full object-cover" />
                  : <span className="text-2xl font-bold text-white">{initials}</span>}
              </div>
              {editing && (
                <>
                  <button onClick={() => fileRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-md hover:bg-primary-600 transition-colors">
                    <Camera size={13} />
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
                </>
              )}
            </div>

            {/* Edit / Save / Cancel */}
            <div className="flex gap-2 mt-12">
              {editing ? (
                <>
                  <motion.button whileTap={{ scale: 0.96 }} onClick={handleCancel}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 text-sm font-medium transition-colors">
                    <X size={14} /> Cancel
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.96 }} onClick={handleSave}
                    className="btn-primary flex items-center gap-1.5 text-sm py-2 px-4">
                    <Save size={14} /> Save Changes
                  </motion.button>
                </>
              ) : (
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleEdit}
                  className="btn-primary flex items-center gap-1.5 text-sm py-2 px-4">
                  <Edit3 size={14} /> Edit Profile
                </motion.button>
              )}
            </div>
          </div>

          {/* Name + completion */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">{profile.name || user?.full_name || "Your Name"}</h2>
              {profile.college && <p className="text-sm text-slate-400 mt-0.5">{profile.college}</p>}
              {(profile.email || user?.email) && <p className="text-xs text-slate-400 mt-0.5">{profile.email || user?.email}</p>}
              {user && (
                <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-600 font-medium">
                  <CheckCircle size={10} /> Logged in
                </span>
              )}
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end mb-1.5">
                <span className="text-xs text-slate-400">Profile completion</span>
                <span className="text-xs font-bold text-primary-600">{completion}%</span>
              </div>
              <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completion}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="h-full rounded-full bg-gradient-to-r from-primary-500 to-violet-500"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Fields grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((field, i) => {
          const Icon = field.icon
          const val = displayData[field.key]?.toString() || ""
          // Name and email are locked when logged in (managed by auth)
          const isAuthLocked = user && (field.key === "name" || field.key === "email")

          return (
            <motion.div key={field.key} custom={i} variants={fadeUp} initial="hidden" animate="show"
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                  <Icon size={14} className="text-primary-500" />
                </div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{field.label}</label>
                {isAuthLocked && (
                  <span className="ml-auto text-xs text-emerald-500 flex items-center gap-0.5">
                    <CheckCircle size={10} /> from account
                  </span>
                )}
                {!isAuthLocked && profile[field.key]?.toString().trim() && !editing && (
                  <CheckCircle size={12} className="text-emerald-400 ml-auto" />
                )}
              </div>

              {editing && !field.readonly && !isAuthLocked ? (
                <input type={field.type} value={val}
                  onChange={e => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder} className={inputCls} />
              ) : (
                <p className={`text-sm font-medium px-1 ${val ? "text-slate-700" : "text-slate-300 italic"}`}>
                  {field.key === "dob" && val
                    ? new Date(val).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                    : field.key === "age"
                      ? (profile.dob ? `${calcAge(profile.dob)} years old` : "Set DOB to calculate")
                      : val || `Enter ${field.label.toLowerCase()}...`}
                </p>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Bio */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mt-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
            <Edit3 size={14} className="text-primary-500" />
          </div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Bio</label>
        </div>
        {editing ? (
          <textarea value={draft.bio} onChange={e => handleChange("bio", e.target.value)}
            placeholder="Tell us a little about yourself..." rows={3}
            className={`${inputCls} resize-none`} />
        ) : (
          <p className={`text-sm px-1 leading-relaxed ${profile.bio ? "text-slate-700" : "text-slate-300 italic"}`}>
            {profile.bio || "Add a short bio..."}
          </p>
        )}
      </motion.div>
    </div>
  )
}
