import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, X, ChevronDown, ChevronUp, Repeat, Timer, Minus, Plus, Info } from 'lucide-react'
import { player, usePlayer, formatTime, BEATS } from '../lib/player'
import { transposeChord } from '../lib/music'
import { useStore } from '../context/AppStore'
import SongArt from './SongArt'
import Waveform from './Waveform'

export const SPEEDS = [0.5, 0.75, 1, 1.25]

export function PlayerControls({ compact = false }) {
  const p = usePlayer()
  const loopValue = p.loop ? String(p.sections.findIndex((s) => s.start === p.loop.start && s.end === p.loop.end)) : ''
  return (
    <div className={`grid gap-4 ${compact ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-4'}`}>
      <div>
        <label className="text-xs font-semibold text-muted" htmlFor="pl-volume">
          Volume
        </label>
        <div className="mt-1.5 flex items-center gap-2">
          <button className="icon-btn size-9" onClick={() => player.setVolume(p.volume > 0 ? 0 : 0.8)} aria-label={p.volume > 0 ? 'Mute' : 'Unmute'}>
            {p.volume > 0 ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
          </button>
          <input id="pl-volume" type="range" min="0" max="1" step="0.01" value={p.volume} onChange={(e) => player.setVolume(+e.target.value)} className="w-full" />
        </div>
      </div>
      <div>
        <span className="text-xs font-semibold text-muted" id="pl-speed">
          Playback speed
        </span>
        <div className="mt-1.5 flex gap-1" role="radiogroup" aria-labelledby="pl-speed">
          {SPEEDS.map((s) => (
            <button
              key={s}
              role="radio"
              aria-checked={p.speed === s}
              onClick={() => player.setSpeed(s)}
              className={`min-h-9 flex-1 rounded-lg text-xs font-semibold transition-colors ${p.speed === s ? 'bg-electric text-white shadow-[0_0_16px_-4px_rgb(139_92_246)]' : 'bg-night-2 text-muted hover:text-white'}`}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>
      <div>
        <span className="text-xs font-semibold text-muted">Tempo</span>
        <div className="mt-1.5 flex items-center gap-2">
          <button className="icon-btn size-9 bg-night-2" onClick={() => player.setBpm(p.bpm - 5)} aria-label="Decrease tempo by 5 BPM">
            <Minus className="size-4" />
          </button>
          <span className="min-w-20 text-center font-mono text-sm" aria-live="polite">
            {p.bpm} BPM
          </span>
          <button className="icon-btn size-9 bg-night-2" onClick={() => player.setBpm(p.bpm + 5)} aria-label="Increase tempo by 5 BPM">
            <Plus className="size-4" />
          </button>
          <button
            onClick={() => player.setMetronome(!p.metronome)}
            aria-pressed={p.metronome}
            aria-label="Metronome click"
            title="Metronome click"
            className={`ml-auto grid size-9 place-items-center rounded-lg transition-colors ${p.metronome ? 'bg-electric text-white' : 'bg-night-2 text-lavender hover:text-white'}`}
          >
            <Timer className="size-4" />
          </button>
        </div>
      </div>
      <div>
        <label className="flex items-center gap-1 text-xs font-semibold text-muted" htmlFor="pl-loop">
          <Repeat className="size-3" /> Loop section
        </label>
        <select
          id="pl-loop"
          className="select mt-1.5 min-h-9 py-1 text-xs"
          value={loopValue}
          onChange={(e) => {
            const s = p.sections[+e.target.value]
            player.setLoop(e.target.value === '' ? null : { start: s.start, end: s.end, label: s.label })
          }}
        >
          <option value="">No loop</option>
          {p.sections.map((s, i) => (
            <option key={i} value={i}>
              {s.label} (bars {s.start + 1}–{s.end})
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export function ProgressScrubber() {
  const p = usePlayer()
  const spb = 60 / (p.bpm * p.speed)
  const total = p.progression.length * BEATS
  const fraction = total ? p.beat / total : 0
  return (
    <div className="flex items-center gap-3 font-mono text-xs text-muted">
      <span className="w-10 text-right tabular-nums">{formatTime(p.beat * spb)}</span>
      <div className="relative h-5 flex-1">
        {p.loop && (
          <span
            className="absolute top-1/2 h-2.5 -translate-y-1/2 rounded-full bg-warning/25 ring-1 ring-warning/50"
            style={{ left: `${(p.loop.start / p.progression.length) * 100}%`, width: `${((p.loop.end - p.loop.start) / p.progression.length) * 100}%` }}
            aria-hidden="true"
          />
        )}
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-elevated">
          <div className="h-full rounded-full bg-gradient-to-r from-lavender to-electric" style={{ width: `${fraction * 100}%` }} />
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.001"
          value={fraction}
          onChange={(e) => player.seekFraction(+e.target.value)}
          aria-label="Seek"
          aria-valuetext={formatTime(p.beat * spb)}
          className="absolute inset-0 w-full cursor-pointer opacity-0"
        />
        <span
          className="pointer-events-none absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_rgb(139_92_246)]"
          style={{ left: `${fraction * 100}%` }}
        />
      </div>
      <span className="w-10 tabular-nums">{formatTime(total * spb)}</span>
    </div>
  )
}

export default function MiniPlayer() {
  const p = usePlayer()
  const [expanded, setExpanded] = useState(false)
  const { logActivity } = useStore()
  const { pathname } = useLocation()
  // The song page has its own full transport controls, so the floating player steps aside there.
  const onSongPage = p.song && pathname === `/song/${p.song.id}`

  useEffect(() => {
    if (p.playing) logActivity()
  }, [p.playing, logActivity])

  const bar = Math.floor(p.beat / BEATS)
  const chord = p.progression[bar] ? transposeChord(p.progression[bar], p.transpose, p.preferFlats) : '—'

  return (
    <AnimatePresence>
      {p.song && !onSongPage && (
        <motion.section
          aria-label="Practice player"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          style={{ background: 'linear-gradient(160deg, rgb(52 32 82 / 0.92), rgb(32 19 51 / 0.9))' }}
          className="glass fixed inset-x-2 bottom-2 z-40 rounded-3xl shadow-[0_30px_80px_-20px_rgb(0_0_0/0.9),0_0_40px_-20px_rgb(139_92_246/0.6)] sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-[440px]"
        >
          <div className="flex items-center gap-3 p-3">
            <Link to={`/song/${p.song.id}`} className="shrink-0 overflow-hidden rounded-xl" aria-label={`Open ${p.song.title}`}>
              <SongArt song={p.song} className="size-12" />
            </Link>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{p.song.title}</p>
              <p className="flex items-center gap-2 truncate text-xs text-muted">
                <span className="font-mono text-lavender">{chord}</span>· synthesised preview
              </p>
            </div>
            <Waveform active={p.playing} bars={14} className="hidden h-8 sm:flex" />
            <button
              onClick={() => player.toggle()}
              aria-label={p.playing ? 'Pause' : 'Play'}
              className="relative grid size-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-lavender to-electric text-night shadow-[0_0_24px_-2px_rgb(139_92_246/0.9)] transition-transform hover:scale-105"
            >
              {p.playing && <span className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-lavender" aria-hidden="true" />}
              {p.playing ? <Pause className="size-5 fill-night" /> : <Play className="size-5 translate-x-px fill-night" />}
            </button>
            <button onClick={() => setExpanded((e) => !e)} className="icon-btn size-9" aria-expanded={expanded} aria-label={expanded ? 'Collapse player controls' : 'Expand player controls'}>
              {expanded ? <ChevronDown className="size-5" /> : <ChevronUp className="size-5" />}
            </button>
            <button onClick={() => player.close()} className="icon-btn size-9" aria-label="Close player">
              <X className="size-4" />
            </button>
          </div>
          <div className="px-4 pb-3">
            <ProgressScrubber />
          </div>
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                <div className="border-t border-lavender/10 p-4">
                  <PlayerControls compact />
                  <p className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-muted">
                    <Info className="mt-0.5 size-3.5 shrink-0 text-lavender" aria-hidden="true" />
                    Practice preview synthesised in your browser from the chord chart — it is not the original song recording.
                  </p>
                  {p.error && <p className="mt-2 text-xs text-warning">{p.error}</p>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      )}
    </AnimatePresence>
  )
}
