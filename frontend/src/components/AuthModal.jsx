import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { X, Mail, Lock, User, Eye, EyeOff, Sparkles, LogIn, UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const inputCls = (err) =>
  `w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border transition-all outline-none
   ${err
     ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100'
     : 'border-slate-200 bg-white focus:border-primary-400 focus:ring-2 focus:ring-primary-100'
   } text-slate-700 placeholder-slate-300`

function Field({ icon: Icon, type, placeholder, value, onChange, error, rightEl }) {
  return (
    <div>
      <div className="relative">
        <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input type={type} placeholder={placeholder} value={value} onChange={onChange}
          className={inputCls(error)} />
        {rightEl && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</div>}
      </div>
      {error && <p className="text-xs text-red-500 mt-1 pl-1">{error}</p>}
    </div>
  )
}

function PasswordField({ placeholder, value, onChange, error }) {
  const [show, setShow] = useState(false)
  return (
    <Field
      icon={Lock}
      type={show ? 'text' : 'password'}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      error={error}
      rightEl={
        <button type="button" onClick={() => setShow(s => !s)}
          className="text-slate-400 hover:text-slate-600 transition-colors">
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      }
    />
  )
}

export default function AuthModal({ onClose, onSuccess }) {
  const { login, register } = useAuth()
  const [tab, setTab] = useState('login')
  const [submitting, setSubmitting] = useState(false)

  // Login state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [loginErrors, setLoginErrors] = useState({})

  // Register state
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPass, setRegPass] = useState('')
  const [regConfirm, setRegConfirm] = useState('')
  const [regErrors, setRegErrors] = useState({})

  const validateLogin = () => {
    const e = {}
    if (!loginEmail.trim()) e.email = 'Email is required.'
    else if (!/\S+@\S+\.\S+/.test(loginEmail)) e.email = 'Enter a valid email.'
    if (!loginPass) e.password = 'Password is required.'
    setLoginErrors(e)
    return Object.keys(e).length === 0
  }

  const validateRegister = () => {
    const e = {}
    if (!regName.trim()) e.name = 'Full name is required.'
    if (!regEmail.trim()) e.email = 'Email is required.'
    else if (!/\S+@\S+\.\S+/.test(regEmail)) e.email = 'Enter a valid email.'
    if (!regPass) e.password = 'Password is required.'
    else if (regPass.length < 6) e.password = 'Minimum 6 characters.'
    if (!regConfirm) e.confirm = 'Please confirm your password.'
    else if (regPass !== regConfirm) e.confirm = 'Passwords do not match.'
    setRegErrors(e)
    return Object.keys(e).length === 0
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!validateLogin()) return
    setSubmitting(true)
    try {
      const user = await login(loginEmail, loginPass)
      toast.success(`Welcome back, ${user.full_name.split(' ')[0]}!`)
      onSuccess(user)
    } catch (err) {
      const msg = err.response?.data?.detail || 'Login failed.'
      setLoginErrors({ general: msg })
    } finally {
      setSubmitting(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!validateRegister()) return
    setSubmitting(true)
    try {
      const user = await register(regName, regEmail, regPass, regConfirm)
      toast.success(`Account created! Welcome, ${user.full_name.split(' ')[0]}!`)
      onSuccess(user)
    } catch (err) {
      const msg = err.response?.data?.detail || 'Registration failed.'
      setRegErrors({ general: msg })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
      >
        {/* Modal */}
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          onClick={e => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-primary-500 via-violet-500 to-purple-600 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Sparkles size={18} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-white text-base leading-tight">Resume AI</p>
                <p className="text-white/70 text-xs">{tab === 'login' ? 'Sign in to your account' : 'Create a new account'}</p>
              </div>
            </div>
            <button onClick={onClose}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
              <X size={14} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-100">
            {[
              { id: 'login', label: 'Login', icon: LogIn },
              { id: 'register', label: 'Register', icon: UserPlus },
            ].map(t => {
              const Icon = t.icon
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all border-b-2 ${
                    tab === t.id
                      ? 'text-primary-600 border-primary-500'
                      : 'text-slate-400 border-transparent hover:text-slate-600'
                  }`}>
                  <Icon size={14} />{t.label}
                </button>
              )
            })}
          </div>

          {/* Forms */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {tab === 'login' ? (
                <motion.form key="login"
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.18 }}
                  onSubmit={handleLogin} className="space-y-4">

                  {loginErrors.general && (
                    <div className="px-3 py-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">
                      {loginErrors.general}
                    </div>
                  )}

                  <Field icon={Mail} type="email" placeholder="Email address"
                    value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                    error={loginErrors.email} />

                  <PasswordField placeholder="Password"
                    value={loginPass} onChange={e => setLoginPass(e.target.value)}
                    error={loginErrors.password} />

                  <motion.button type="submit" disabled={submitting}
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                    className="w-full btn-primary py-2.5 flex items-center justify-center gap-2">
                    <LogIn size={15} />
                    {submitting ? 'Signing in...' : 'Sign In'}
                  </motion.button>

                  <p className="text-center text-xs text-slate-400">
                    Don't have an account?{' '}
                    <button type="button" onClick={() => setTab('register')}
                      className="text-primary-600 font-medium hover:underline">
                      Create one
                    </button>
                  </p>
                </motion.form>
              ) : (
                <motion.form key="register"
                  initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.18 }}
                  onSubmit={handleRegister} className="space-y-4">

                  {regErrors.general && (
                    <div className="px-3 py-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">
                      {regErrors.general}
                    </div>
                  )}

                  <Field icon={User} type="text" placeholder="Full name"
                    value={regName} onChange={e => setRegName(e.target.value)}
                    error={regErrors.name} />

                  <Field icon={Mail} type="email" placeholder="Email address"
                    value={regEmail} onChange={e => setRegEmail(e.target.value)}
                    error={regErrors.email} />

                  <PasswordField placeholder="Create password (min 6 chars)"
                    value={regPass} onChange={e => setRegPass(e.target.value)}
                    error={regErrors.password} />

                  <PasswordField placeholder="Confirm password"
                    value={regConfirm} onChange={e => setRegConfirm(e.target.value)}
                    error={regErrors.confirm} />

                  <motion.button type="submit" disabled={submitting}
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                    className="w-full btn-primary py-2.5 flex items-center justify-center gap-2">
                    <UserPlus size={15} />
                    {submitting ? 'Creating account...' : 'Create Account'}
                  </motion.button>

                  <p className="text-center text-xs text-slate-400">
                    Already have an account?{' '}
                    <button type="button" onClick={() => setTab('login')}
                      className="text-primary-600 font-medium hover:underline">
                      Sign in
                    </button>
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
