import { motion } from 'framer-motion'
import { FlaskConical } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Logo({ className = '' }) {
  return (
    <Link to="/" className={`group flex items-center gap-3 ${className}`} aria-label="Lavender Strings home">
      <span className="relative grid size-10 place-items-center rounded-xl border border-lavender/25 bg-gradient-to-br from-electric/40 to-night-2 shadow-[0_0_24px_-6px_rgb(139_92_246/0.8)] transition-transform duration-300 group-hover:scale-105">
        <svg viewBox="0 0 32 32" className="size-6" aria-hidden="true">
          <defs>
            <linearGradient id="logo-g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#E9D5FF" />
              <stop offset="1" stopColor="#A78BFA" />
            </linearGradient>
          </defs>
          {[6, 11, 16, 21, 26].map((x, i) => {
            const h = [8, 16, 22, 14, 9][i]
            return <rect key={x} x={x - 1.25} y={16 - h / 2} width="2.5" height={h} rx="1.25" fill="url(#logo-g)" />
          })}
        </svg>
      </span>
      <span className="text-lg font-semibold tracking-tight text-lilac">
        Lavender <span className="text-white">Strings</span>
      </span>
    </Link>
  )
}

export function Reveal({ children, delay = 0, y = 24, className = '', as = 'div' }) {
  const M = motion[as]
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  )
}

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}
export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

export function DemoBadge({ children = 'Demo content', className = '' }) {
  return (
    <span className={`badge border-warning/40 bg-warning/10 text-warning ${className}`}>
      <FlaskConical className="size-3" aria-hidden="true" />
      {children}
    </span>
  )
}

const DIFF_STYLES = {
  Beginner: 'border-success/40 bg-success/10 text-success',
  Intermediate: 'border-lavender/40 bg-lavender/10 text-lavender',
  Advanced: 'border-pink-300/40 bg-pink-300/10 text-pink-200',
}
export function DifficultyBadge({ level }) {
  return <span className={`badge ${DIFF_STYLES[level]}`}>{level}</span>
}

export function PageHeader({ eyebrow, title, highlight, children, actions }) {
  return (
    <header className="relative overflow-hidden pt-32 pb-10 sm:pt-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-40 h-96 bg-[radial-gradient(ellipse_at_center,rgb(139_92_246/0.35),transparent_65%)]" />
      <div className="container-page relative">
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="eyebrow">
          {eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.06 }}
          className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl"
        >
          {title} {highlight && <span className="text-gradient">{highlight}</span>}
        </motion.h1>
        {children && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.12 }} className="mt-4 max-w-2xl text-muted">
            {children}
          </motion.div>
        )}
        {actions && <div className="mt-6 flex flex-wrap gap-3">{actions}</div>}
      </div>
    </header>
  )
}

export function EmptyState({ icon: Icon, title, children, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card flex flex-col items-center px-6 py-14 text-center"
    >
      {Icon && (
        <span className="grid size-14 place-items-center rounded-2xl border border-line bg-elevated/60 text-lavender">
          <Icon className="size-6" aria-hidden="true" />
        </span>
      )}
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      {children && <p className="mt-2 max-w-md text-sm text-muted">{children}</p>}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  )
}

export function SectionHeading({ eyebrow, title, action, id }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 id={id} className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h2>
      </div>
      {action}
    </div>
  )
}

export function ProgressRing({ value, size = 96, stroke = 8, label, children }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" role="img" aria-label={label ?? `${Math.round(value * 100)}%`}>
        <defs>
          <linearGradient id="ring-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#E9D5FF" />
            <stop offset="1" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#342052" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#ring-g)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - Math.min(1, value)) }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-tight">{children}</div>
    </div>
  )
}

export function ProgressBar({ value, className = '' }) {
  return (
    <div className={`h-2 overflow-hidden rounded-full bg-elevated ${className}`} role="progressbar" aria-valuenow={Math.round(value * 100)} aria-valuemin={0} aria-valuemax={100}>
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-lavender to-electric"
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, value * 100)}%` }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  )
}

export function Segmented({ options, value, onChange, label, layoutId }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-line bg-night-2/70 p-1 [scrollbar-width:none]">
      {options.map((o) => {
        const v = typeof o === 'object' ? o.value : o
        const text = typeof o === 'object' ? o.label : o
        const active = v === value
        return (
          <button
            key={v}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(v)}
            className={`relative min-h-9 shrink-0 rounded-full px-3.5 text-sm font-medium whitespace-nowrap transition-colors ${active ? 'text-white' : 'text-muted hover:text-white'}`}
          >
            {active && <motion.span layoutId={layoutId} className="absolute inset-0 rounded-full bg-electric/30 ring-1 ring-electric/60" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
            <span className="relative">{text}</span>
          </button>
        )
      })}
    </div>
  )
}
