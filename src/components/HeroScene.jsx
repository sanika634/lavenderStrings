import { useMemo } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Play, Pause, Music2, Music, ArrowUp, ArrowDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCanvasLoop } from '../lib/useCanvasLoop'
import { player, usePlayer, formatTime, BEATS } from '../lib/player'
import { parseSheet } from '../lib/sheet'
import Waveform from './Waveform'

/* ---------------------------- canvas layers ---------------------------- */

export function Starfield({ className = '' }) {
  const stars = useMemo(
    () =>
      Array.from({ length: 140 }, (_, i) => ({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.2 + 0.3,
        speed: 0.004 + Math.random() * 0.012,
        phase: Math.random() * Math.PI * 2,
        tint: i % 4 === 0 ? '196,181,253' : '233,213,255',
      })),
    [],
  )
  const ref = useCanvasLoop((ctx, w, h, t) => {
    for (const s of stars) {
      const y = (((s.y - t * s.speed) % 1) + 1) % 1
      const a = 0.25 + 0.45 * (0.5 + 0.5 * Math.sin(t * 1.4 + s.phase))
      ctx.fillStyle = `rgba(${s.tint},${a * (0.35 + 0.65 * (1 - y))})`
      ctx.beginPath()
      ctx.arc(s.x * w, y * h, s.r, 0, Math.PI * 2)
      ctx.fill()
    }
  })
  return <canvas ref={ref} className={className} aria-hidden="true" />
}

/** The twisting mesh "sound ribbon" arching over the play button. */
export function SoundRibbon({ className = '', energy = 1 }) {
  const ref = useCanvasLoop((ctx, w, h, t) => {
    const LINES = w < 640 ? 30 : 46
    const span = Math.min(w * 0.94, 1040)
    const x0 = (w - span) / 2
    const arch = h * 0.62
    const baseY = h * 0.92
    const grad = ctx.createLinearGradient(x0, 0, x0 + span, 0)
    grad.addColorStop(0, 'rgba(233,213,255,0)')
    grad.addColorStop(0.18, 'rgba(233,213,255,0.32)')
    grad.addColorStop(0.5, 'rgba(240,226,255,0.55)')
    grad.addColorStop(0.82, 'rgba(233,213,255,0.32)')
    grad.addColorStop(1, 'rgba(233,213,255,0)')
    ctx.strokeStyle = grad
    ctx.lineWidth = 0.8
    const step = w < 640 ? 7 : 5
    for (let k = 0; k < LINES; k++) {
      const tk = k / (LINES - 1) - 0.5
      ctx.beginPath()
      for (let x = 0; x <= span; x += step) {
        const u = x / span
        const env = Math.sin(u * Math.PI)
        const wave =
          Math.sin(u * 11 + t * 0.9) * 30 * env * energy +
          Math.sin(u * 4.5 - t * 0.55) * 20 * env +
          Math.sin(u * 19 + t * 1.6) * 7 * env * energy
        const thickness = (18 + 58 * Math.sqrt(env)) * Math.cos(u * 6.5 + t * 0.6 + tk * 0.5)
        const y = baseY - Math.pow(env, 0.8) * arch + wave + tk * thickness
        x === 0 ? ctx.moveTo(x0 + x, y) : ctx.lineTo(x0 + x, y)
      }
      ctx.stroke()
    }
  })
  return <canvas ref={ref} className={className} aria-hidden="true" />
}

/* ------------------------------ hero parts ----------------------------- */

const NOTES = [
  { left: '8%', top: '22%', size: 26, delay: 0, r: -12, depth: 30, Icon: Music2 },
  { left: '88%', top: '18%', size: 22, delay: 1.2, r: 10, depth: 40, Icon: Music },
  { left: '16%', top: '58%', size: 18, delay: 2.1, r: 8, depth: 22, Icon: Music },
  { left: '80%', top: '52%', size: 28, delay: 0.6, r: -6, depth: 34, Icon: Music2 },
  { left: '28%', top: '12%', size: 14, delay: 3, r: 4, depth: 16, Icon: Music },
  { left: '70%', top: '30%', size: 16, delay: 1.8, r: -10, depth: 20, Icon: Music2 },
]

export function FloatingNotes({ mx, my }) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {NOTES.map((n, i) => (
        <Parallax key={i} mx={mx} my={my} depth={n.depth} style={{ left: n.left, top: n.top }} className="absolute">
          <span className="block animate-float text-lavender/40" style={{ animationDelay: `${n.delay}s`, '--r': `${n.r}deg` }}>
            <n.Icon style={{ width: n.size, height: n.size }} className="drop-shadow-[0_0_10px_rgb(139_92_246/0.7)]" />
          </span>
        </Parallax>
      ))}
    </div>
  )
}

export function Parallax({ mx, my, depth, children, className, style }) {
  const x = useTransform(mx, (v) => v * depth)
  const y = useTransform(my, (v) => v * depth)
  return (
    <motion.div style={{ ...style, x, y }} className={className}>
      {children}
    </motion.div>
  )
}

export function useMouseParallax() {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const mx = useSpring(rawX, { stiffness: 60, damping: 20 })
  const my = useSpring(rawY, { stiffness: 60, damping: 20 })
  const onPointerMove = (e) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    rawX.set(((e.clientX - r.left) / r.width - 0.5) * 2)
    rawY.set(((e.clientY - r.top) / r.height - 0.5) * 2)
  }
  return { mx, my, onPointerMove }
}

export function HeroPlayButton({ song }) {
  const p = usePlayer()
  const isThis = p.song?.id === song.id
  const playing = isThis && p.playing
  const spb = 60 / (p.bpm * p.speed)
  const seconds = isThis ? p.beat * spb : 0
  return (
    <div className="relative grid place-items-center">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          aria-hidden="true"
          className="absolute rounded-full border border-lavender/15"
          style={{ width: 120 + i * 34, height: 120 + i * 34, opacity: 0.9 - i * 0.22 }}
        />
      ))}
      {playing && <span aria-hidden="true" className="absolute size-32 animate-pulse-ring rounded-full border-2 border-lavender/60" />}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => player.toggle(song)}
        aria-label={playing ? `Pause practice preview of ${song.title}` : `Play synthesised practice preview of ${song.title}`}
        className="relative grid size-28 place-items-center rounded-full p-[5px] shadow-[0_0_60px_-6px_rgb(139_92_246/0.95)]"
        style={{ background: 'conic-gradient(from 200deg, #E9D5FF, #8B5CF6, #C084FC, #6D28D9, #E9D5FF)' }}
      >
        <span className="grid size-full place-items-center rounded-full bg-[radial-gradient(circle_at_50%_30%,#6D4AA8,#3B2464_70%)]">
          <span className="flex flex-col items-center gap-1">
            {playing ? <Pause className="size-8 fill-lilac text-lilac" /> : <Play className="size-8 translate-x-0.5 fill-lilac text-lilac" />}
            <span className="font-mono text-xs text-lilac tabular-nums">{formatTime(seconds)}</span>
          </span>
        </span>
      </motion.button>
    </div>
  )
}

export function TrendingPanel({ songs }) {
  return (
    <div>
      <p className="eyebrow mb-3 pl-4">Featured demos</p>
      <div className="glass rounded-2xl p-3">
        <ul className="divide-y divide-line/50">
          {songs.slice(0, 3).map((s) => (
            <li key={s.id}>
              <Link to={`/song/${s.id}`} className="grid min-h-13 grid-cols-[1fr_auto_auto] items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-white/5">
                <span className="truncate font-semibold">{s.title}</span>
                <span className="text-muted">{s.difficulty}</span>
                <span className="w-8 text-right font-mono text-lavender">{s.key}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function ChordTimelinePanel({ song }) {
  const p = usePlayer()
  const { progression } = useMemo(() => parseSheet(song.sheet), [song.sheet])
  const bars = progression.slice(0, 10)
  const isThis = p.song?.id === song.id
  const pos = isThis ? Math.min(p.beat / BEATS, bars.length) : 0
  return (
    <div>
      <p className="eyebrow mb-3 pl-4">Chord timeline</p>
      <div className="glass overflow-hidden rounded-2xl p-3">
        <div className="relative">
          <div className="grid font-mono text-[10px] text-muted" style={{ gridTemplateColumns: `repeat(${bars.length}, 1fr)` }}>
            {bars.map((_, i) => (
              <span key={i} className="border-l border-line/60 pl-1">
                {i + 1}
              </span>
            ))}
          </div>
          <div className="mt-2 grid gap-1" style={{ gridTemplateColumns: `repeat(${bars.length}, 1fr)` }}>
            {bars.map((c, i) => {
              const active = isThis && Math.floor(pos) === i
              return (
                <button
                  key={i}
                  onClick={() => {
                    if (!isThis) player.load(song)
                    player.seekBar(i)
                  }}
                  aria-label={`Jump to bar ${i + 1}, ${c}`}
                  className={`h-14 rounded-lg border text-xs font-semibold transition-all duration-300 ${
                    active ? 'border-electric bg-electric/30 text-white shadow-[0_0_18px_-4px_rgb(139_92_246)]' : 'border-line/60 bg-night/40 text-lavender hover:border-lavender/50'
                  }`}
                >
                  {c}
                </button>
              )
            })}
          </div>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-0 bottom-0 w-px bg-pink-400 shadow-[0_0_8px_#f472b6] transition-[left] duration-100"
            style={{ left: `${(pos / bars.length) * 100}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <Waveform active={isThis && p.playing} bars={22} className="h-6" />
          <span className="truncate text-xs text-muted">{song.title}</span>
        </div>
      </div>
    </div>
  )
}

const MODES = [
  { label: 'Slow', speed: 0.75, Icon: ArrowDown },
  { label: 'Normal', speed: 1, Icon: null },
  { label: 'Fast', speed: 1.25, Icon: ArrowUp },
]

export function PracticeModeCard() {
  const p = usePlayer()
  return (
    <div className="md:[transform:perspective(1200px)_rotateY(-8deg)_rotateZ(2deg)]">
      <p className="mb-3 pl-4 text-xs font-semibold tracking-[0.32em] text-lilac uppercase">Practice speed</p>
      <div className="rounded-2xl border border-white/25 bg-gradient-to-br from-[#c4a6f7] via-[#9b7be8] to-[#7c5bd6] p-3 shadow-[0_40px_80px_-30px_rgb(139_92_246/0.9)]">
        <div className="grid grid-cols-3 gap-2">
          {MODES.map((m) => {
            const active = p.speed === m.speed
            return (
              <button
                key={m.label}
                onClick={() => player.setSpeed(m.speed)}
                aria-pressed={active}
                className={`flex h-32 flex-col items-center justify-between rounded-xl py-3 transition-all duration-300 ${active ? 'bg-white/85 text-night shadow-lg' : 'bg-white/15 text-white hover:bg-white/25'}`}
              >
                <span className="text-xs font-semibold">{m.label}</span>
                <Waveform active={p.playing && active} bars={9} className="h-10" />
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  {m.Icon && <m.Icon className="size-3" aria-hidden="true" />}
                  {m.speed}×
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
