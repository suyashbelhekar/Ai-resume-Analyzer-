import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { X, Mail, Lock, User, Eye, EyeOff, Sparkles, LogIn, UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const inputCls = (err) =>
  `w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border transition-all outline-none
   ${err
     ? 'border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-950/30 text-red-900 dark:text-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-950'
     : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-950/50'
   }`

function Field({ icon: Icon, type, placeholder, value, onChange, error, rightEl, autoFocus = false }) {
  return (
    <div>
      <div className="relative">
        <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoFocus={autoFocus}
          className={inputCls(error)}
        />
        {rightEl && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</div>}
      </div>
      {error && <p className="text-xs text-red-500 dark:text-red-400 mt-1 pl-1 font-medium">{error}</p>}
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
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShow((s) => !s)}
          className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1"
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
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
    if (!loginEmail.trim()) e.email = 'Email address is required.'
    else if (!/\S+@\S+\.\S+/.test(loginEmail)) e.email = 'Enter a valid email address.'
    if (!loginPass) e.password = 'Password is required.'
    setLoginErrors(e)
    return Object.keys(e).length === 0
  }

  const validateRegister = () => {
    const e = {}
    if (!regName.trim()) e.name = 'Full name is required.'
    if (!regEmail.trim()) e.email = 'Email address is required.'
    else if (!/\S+@\S+\.\S+/.test(regEmail)) e.email = 'Enter a valid email address.'
    if (!regPass) e.password = 'Password is required.'
    else if (regPass.length < 6) e.password = 'Password must be at least 6 characters.'
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
      toast.success(`Welcome back, ${user.full_name?.split(' ')[0] || 'User'}!`)
      if (onSuccess) onSuccess(user)
      if (onClose) onClose()
    } catch (err) {
      const msg = err.response?.data?.detail || 'Login failed. Please check your credentials.'
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
      toast.success(`Account created! Welcome, ${user.full_name?.split(' ')[0] || 'User'}!`)
      if (onSuccess) onSuccess(user)
      if (onClose) onClose()
    } catch (err) {
      const msg = err.response?.data?.detail || 'Registration failed. Please try again.'
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
        className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
      >
        {/* Modal Window */}
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          {/* Header Banner */}
          <div className="relative bg-gradient-to-r from-primary-600 via-indigo-600 to-violet-600 px-6 py-5 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-inner">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight">CareerAI</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-white/20 font-bold">Secure</span>
                </div>
                <p className="text-white/80 text-xs mt-0.5">
                  {tab === 'login' ? 'Sign in to access your saved career data' : 'Create your CareerAI account'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
            >
              <X size={15} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            {[
              { id: 'login', label: 'Sign In', icon: LogIn },
              { id: 'register', label: 'Create Account', icon: UserPlus },
            ].map((t) => {
              const Icon = t.icon
              const isSelected = tab === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTab(t.id)
                    setLoginErrors({})
                    setRegErrors({})
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-bold transition-all border-b-2 ${
                    isSelected
                      ? 'text-primary-600 dark:text-primary-400 border-primary-600 dark:border-primary-400 bg-white dark:bg-slate-900'
                      : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon size={15} />
                  <span>{t.label}</span>
                </button>
              )
            })}
          </div>

          {/* Form Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {tab === 'login' ? (
                <motion.form
                  key="login-form"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.16 }}
                  onSubmit={handleLogin}
                  className="space-y-4"
                >
                  {loginErrors.general && (
                    <div className="px-3.5 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400 font-medium">
                      {loginErrors.general}
                    </div>
                  )}

                  <Field
                    icon={Mail}
                    type="email"
                    placeholder="Email address"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    error={loginErrors.email}
                    autoFocus
                  />

                  <PasswordField
                    placeholder="Password"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    error={loginErrors.password}
                  />

                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full btn-primary py-3 text-xs flex items-center justify-center gap-2 shadow-md"
                  >
                    <LogIn size={15} />
                    <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
                  </motion.button>

                  <p className="text-center text-xs text-slate-500 dark:text-slate-400 pt-1">
                    Don't have an account yet?{' '}
                    <button
                      type="button"
                      onClick={() => setTab('register')}
                      className="text-primary-600 dark:text-primary-400 font-bold hover:underline ml-1"
                    >
                      Create one
                    </button>
                  </p>
                </motion.form>
              ) : (
                <motion.form
                  key="register-form"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.16 }}
                  onSubmit={handleRegister}
                  className="space-y-3.5"
                >
                  {regErrors.general && (
                    <div className="px-3.5 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400 font-medium">
                      {regErrors.general}
                    </div>
                  )}

                  <Field
                    icon={User}
                    type="text"
                    placeholder="Full name (e.g. Alex Johnson)"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    error={regErrors.name}
                    autoFocus
                  />

                  <Field
                    icon={Mail}
                    type="email"
                    placeholder="Email address"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    error={regErrors.email}
                  />

                  <PasswordField
                    placeholder="Create password (min 6 characters)"
                    value={regPass}
                    onChange={(e) => setRegPass(e.target.value)}
                    error={regErrors.password}
                  />

                  <PasswordField
                    placeholder="Confirm password"
                    value={regConfirm}
                    onChange={(e) => setRegConfirm(e.target.value)}
                    error={regErrors.confirm}
                  />

                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full btn-primary py-3 text-xs flex items-center justify-center gap-2 shadow-md mt-1"
                  >
                    <UserPlus size={15} />
                    <span>{submitting ? 'Creating account...' : 'Create Account'}</span>
                  </motion.button>

                  <p className="text-center text-xs text-slate-500 dark:text-slate-400 pt-1">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setTab('login')}
                      className="text-primary-600 dark:text-primary-400 font-bold hover:underline ml-1"
                    >
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
