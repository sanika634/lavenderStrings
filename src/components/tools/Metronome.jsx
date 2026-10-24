import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Square, Minus, Plus, Hand, Volume2, VolumeX } from 'lucide-react'
import { getAudioContext, click } from '../../lib/audio'
import { Segmented } from '../ui'

const SIGNATURES = { '2/4': 2, '3/4': 3, '4/4': 4, '6/8': 6 }
const SUBDIVISIONS = [
  { value: 1, label: '♩ Quarter' },
  { value: 2, label: '♫ Eighths' },
  { value: 3, label: '3 Triplets' },
]
const TEMPO_NAMES = [
  [60, 'Largo'], [76, 'Adagio'], [108, 'Andante'], [120, 'Moderato'], [156, 'Allegro'], [200, 'Vivace'], [Infinity, 'Presto'],
]

export default function Metronome() {
  const [bpm, setBpm] = useState(90)
  const [sig, setSig] = useState('4/4')
  const [sub, setSub] = useState(1)
  const [accent, setAccent] = useState(true)
  const [sound, setSound] = useState(true)
  const [running, setRunning] = useState(false)
  const [beat, setBeat] = useState(-1)
  const [error, setError] = useState(null)
  const settings = useRef({})
  settings.current = { bpm, beats: SIGNATURES[sig], sub, accent, sound }
  const engine = useRef(null)
  const taps = useRef([])

  useEffect(() => {
    if (!running) return
    let ac
    try {
      ac = getAudioContext()
    } catch (e) {
      setError(e.message)
      setRunning(false)
      return
    }
    const out = ac.createGain()
    out.connect(ac.destination)
    let tick = 0
    let next = ac.currentTime + 0.06
    const queue = []
    const schedule = () => {
      const { bpm, beats, sub, accent, sound } = settings.current
      const perTick = 60 / bpm / sub
      while (next < ac.currentTime + 0.12) {
        const total = beats * sub
        const pos = tick % total
        const isBeat = pos % sub === 0
        if (sound) click(ac, out, next, accent && pos === 0, isBeat ? 1 : 0.45)
        if (isBeat) queue.push({ time: next, beat: pos / sub })
        tick = (tick + 1) % total
        next += perTick
      }
    }
    schedule()
    const timer = setInterval(schedule, 25)
    let raf
    const draw = () => {
      while (queue.length && queue[0].time <= ac.currentTime) setBeat(queue.shift().beat)
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    engine.current = { out }
    return () => {
      clearInterval(timer)
      cancelAnimationFrame(raf)
      out.gain.setTargetAtTime(0, ac.currentTime, 0.01)
      setTimeout(() => out.disconnect(), 200)
      setBeat(-1)
    }
  }, [running])

  const tap = () => {
    const now = performance.now()
    taps.current = [...taps.current.filter((t) => now - t < 2500), now].slice(-6)
    if (taps.current.length >= 2) {
      const gaps = taps.current.slice(1).map((t, i) => t - taps.current[i])
      setBpm(Math.round(60000 / (gaps.reduce((a, b) => a + b) / gaps.length)))
    }
  }

  const clamp = (v) => Math.max(30, Math.min(240, v))
  const beats = SIGNATURES[sig]
  const tempoName = TEMPO_NAMES.find(([max]) => bpm < max)[1]

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <div className="card flex flex-col items-center p-6 text-center sm:p-10">
        <div className="flex min-h-14 items-center justify-center gap-3" aria-hidden="true">
          {Array.from({ length: beats }, (_, i) => (
            <motion.span
              key={i}
              animate={beat === i ? { scale: 1.35, opacity: 1 } : { scale: 1, opacity: 0.45 }}
              transition={{ duration: 0.08 }}
              className={`rounded-full ${i === 0 && accent ? 'size-6 bg-lilac' : 'size-5 bg-electric'} ${beat === i ? 'shadow-[0_0_24px_rgb(139_92_246)]' : ''}`}
            />
          ))}
        </div>
        <p className="sr-only" aria-live="off">
          Beat {beat + 1}
        </p>
        <p className="mt-6 font-mono text-7xl font-bold tracking-tight tabular-nums sm:text-8xl">{bpm}</p>
        <p className="text-sm text-muted">
          BPM · {tempoName} · {sig}
        </p>
        <div className="mt-6 flex w-full max-w-md items-center gap-3">
          <button className="icon-btn bg-night-2" onClick={() => setBpm((b) => clamp(b - 1))} aria-label="Decrease BPM">
            <Minus className="size-5" />
          </button>
          <input type="range" min="30" max="240" value={bpm} onChange={(e) => setBpm(+e.target.value)} className="flex-1" aria-label="Tempo in BPM" />
          <button className="icon-btn bg-night-2" onClick={() => setBpm((b) => clamp(b + 1))} aria-label="Increase BPM">
            <Plus className="size-5" />
          </button>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={() => setRunning((r) => !r)} className="btn-primary h-14 px-8 text-base" aria-pressed={running}>
            {running ? <Square className="size-5 fill-current" /> : <Play className="size-5 fill-current" />}
            {running ? 'Stop' : 'Start'}
          </button>
          <button onClick={tap} className="btn-outline h-14 px-6">
            <Hand className="size-5" /> Tap tempo
          </button>
        </div>
        {error && <p className="mt-4 text-sm text-warning">{error}</p>}
      </div>

      <div className="card space-y-6 p-6">
        <div>
          <p className="mb-2 text-sm font-semibold">Time signature</p>
          <Segmented options={Object.keys(SIGNATURES)} value={sig} onChange={setSig} label="Time signature" layoutId="met-sig" />
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold">Beat pattern</p>
          <Segmented options={SUBDIVISIONS} value={sub} onChange={setSub} label="Subdivision" layoutId="met-sub" />
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setAccent((a) => !a)} aria-pressed={accent} className={`chip ${accent ? 'chip-active' : ''}`}>
            Accent first beat
          </button>
          <button onClick={() => setSound((s) => !s)} aria-pressed={sound} className={`chip ${sound ? 'chip-active' : ''}`}>
            {sound ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />} {sound ? 'Sound on' : 'Visual only'}
          </button>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold">Presets</p>
          <div className="flex flex-wrap gap-2">
            {[60, 80, 100, 120, 140].map((v) => (
              <button key={v} onClick={() => setBpm(v)} className={`chip font-mono ${bpm === v ? 'chip-active' : ''}`}>
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
