import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, Info, Loader2 } from 'lucide-react'
import { Logo } from '../components/ui'
import { SoundRibbon } from '../components/HeroScene'
import { useStore, useToast } from '../context/AppStore'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function Field({ id, label, icon: Icon, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-lavender" aria-hidden="true" />
        {children}
      </div>
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-xs text-warning" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export default function Auth({ mode }) {
  const signup = mode === 'signup'
  const { signIn, user } = useStore()
  const toast = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', agree: false })
  const [errors, setErrors] = useState({})
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)

  const validate = () => {
    const e = {}
    if (signup && form.name.trim().length < 2) e.name = 'Enter your name (at least 2 characters).'
    if (!EMAIL_RE.test(form.email.trim())) e.email = 'Enter a valid email address.'
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters.'
    else if (signup && !(/[A-Za-z]/.test(form.password) && /\d/.test(form.password))) e.password = 'Use at least one letter and one number.'
    if (signup && !form.agree) e.agree = 'Please accept the terms to continue.'
    return e
  }

  const submit = (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) {
      document.getElementById(Object.keys(e)[0])?.focus()
      return
    }
    setBusy(true)
    // Prototype only: no server. The password is validated and then discarded — never stored or sent.
    setTimeout(() => {
      const email = form.email.trim()
      const name = signup ? form.name.trim() : user?.email === email ? user.name : email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase())
      signIn({ name, email, createdAt: new Date().toISOString() })
      toast(signup ? `Welcome to Lavender Strings, ${name.split(' ')[0]}!` : `Signed in as ${name}`)
      navigate('/dashboard')
    }, 500)
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  return (
    <div className="relative grid min-h-dvh items-center overflow-hidden px-4 pt-24 pb-16">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgb(139_92_246/0.3),transparent_60%)]" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-80 opacity-60">
        <SoundRibbon className="size-full" energy={0.7} />
      </div>
      <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="glass mx-auto w-full max-w-md rounded-3xl p-6 shadow-[0_40px_100px_-30px_rgb(139_92_246/0.6)] sm:p-8">
        <Logo />
        <h1 className="mt-6 text-2xl font-bold">{signup ? 'Create your account' : 'Welcome back'}</h1>
        <p className="mt-1 text-sm text-muted">{signup ? 'Save favourites, track lessons and build your streak.' : 'Log in to pick up where you left off.'}</p>

        <p className="mt-5 flex items-start gap-2 rounded-xl border border-warning/30 bg-warning/10 p-3 text-xs text-warning">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          Prototype sign-in: there is no server. Your name and email are kept in this browser only; your password is checked for format and never stored or sent.
        </p>

        <form onSubmit={submit} noValidate className="mt-6 space-y-4">
          {signup && (
            <Field id="name" label="Name" icon={User} error={errors.name}>
              <input id="name" autoComplete="name" className="field pl-10" value={form.name} onChange={set('name')} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-err' : undefined} />
            </Field>
          )}
          <Field id="email" label="Email" icon={Mail} error={errors.email}>
            <input id="email" type="email" autoComplete="email" className="field pl-10" value={form.email} onChange={set('email')} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-err' : undefined} />
          </Field>
          <Field id="password" label="Password" icon={Lock} error={errors.password}>
            <input
              id="password"
              type={show ? 'text' : 'password'}
              autoComplete={signup ? 'new-password' : 'current-password'}
              className="field pr-12 pl-10"
              value={form.password}
              onChange={set('password')}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-err' : undefined}
            />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute top-1/2 right-1 grid size-10 -translate-y-1/2 place-items-center text-lavender" aria-label={show ? 'Hide password' : 'Show password'}>
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </Field>
          {signup && (
            <div>
              <label className="flex items-start gap-2.5 text-sm text-muted">
                <input id="agree" type="checkbox" checked={form.agree} onChange={set('agree')} className="mt-0.5 size-4 accent-electric" aria-invalid={!!errors.agree} />
                <span>
                  I agree to the{' '}
                  <Link to="/terms" className="text-lavender hover:text-white">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-lavender hover:text-white">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
              {errors.agree && <p className="mt-1.5 text-xs text-warning">{errors.agree}</p>}
            </div>
          )}
          <button type="submit" disabled={busy} className="btn-primary h-12 w-full">
            {busy && <Loader2 className="size-4 animate-spin" />}
            {signup ? 'Create account' : 'Log In'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-muted">
          {signup ? 'Already have an account?' : 'New to Lavender Strings?'}{' '}
          <Link to={signup ? '/login' : '/signup'} className="font-semibold text-lavender hover:text-white">
            {signup ? 'Log in' : 'Create an account'}
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
