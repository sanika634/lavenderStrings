import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Mic, MicOff, Volume2, AlertTriangle, CheckCircle2, ArrowUp, ArrowDown } from 'lucide-react'
import { detectPitch } from '../../lib/pitch'
import { frequencyToNote, STANDARD_TUNING } from '../../lib/music'
import { getAudioContext, referenceTone } from '../../lib/audio'

const MESSAGES = {
  denied: 'Microphone access was blocked. Allow it in your browser’s site settings, or use the reference tones below to tune by ear.',
  unsupported: 'This browser can’t access a microphone. Use the reference tones below to tune by ear.',
  error: 'The microphone couldn’t be started. Check that one is connected, then try again.',
}

function nearestString(freq) {
  let best = 0
  for (let i = 1; i < STANDARD_TUNING.length; i++)
    if (Math.abs(Math.log2(freq / STANDARD_TUNING[i].freq)) < Math.abs(Math.log2(freq / STANDARD_TUNING[best].freq))) best = i
  return best
}

export default function Tuner() {
  const [status, setStatus] = useState('idle')
  const [reading, setReading] = useState(null)
  const [refString, setRefString] = useState(null)
  const audio = useRef(null)

  const stop = () => {
    const a = audio.current
    if (!a) return
    cancelAnimationFrame(a.raf)
    a.stream.getTracks().forEach((t) => t.stop())
    a.source.disconnect()
    audio.current = null
  }

  useEffect(() => stop, [])

  const start = async () => {
    if (!navigator.mediaDevices?.getUserMedia) return setStatus('unsupported')
    setStatus('requesting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } })
      const ac = getAudioContext()
      const source = ac.createMediaStreamSource(stream)
      const analyser = ac.createAnalyser()
      analyser.fftSize = 2048
      source.connect(analyser)
      const buf = new Float32Array(analyser.fftSize)
      const a = { stream, source, raf: 0, last: 0, smooth: null, silent: 0 }
      audio.current = a
      const loop = (now) => {
        a.raf = requestAnimationFrame(loop)
        if (now - a.last < 70) return
        a.last = now
        analyser.getFloatTimeDomainData(buf)
        const f = detectPitch(buf, ac.sampleRate)
        if (f > 0) {
          a.silent = 0
          a.smooth = a.smooth && Math.abs(Math.log2(f / a.smooth)) < 0.05 ? a.smooth * 0.7 + f * 0.3 : f
          setReading({ freq: a.smooth, ...frequencyToNote(a.smooth), string: nearestString(a.smooth) })
        } else if (++a.silent > 12) {
          a.smooth = null
          setReading(null)
        }
      }
      a.raf = requestAnimationFrame(loop)
      setStatus('listening')
    } catch (e) {
      setStatus(e?.name === 'NotAllowedError' || e?.name === 'SecurityError' ? 'denied' : 'error')
    }
  }

  const toggle = () => {
    if (status === 'listening') {
      stop()
      setStatus('idle')
      setReading(null)
    } else start()
  }

  const cents = reading?.cents ?? 0
  const inTune = reading && Math.abs(cents) <= 5
  const angle = Math.max(-50, Math.min(50, cents)) * 1.6

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <div className="card relative overflow-hidden p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Chromatic tuner</h2>
            <p className="text-sm text-muted">Real-time pitch detection using your microphone. Audio never leaves your device.</p>
          </div>
          <button onClick={toggle} disabled={status === 'requesting'} className={status === 'listening' ? 'btn-outline' : 'btn-primary'} aria-pressed={status === 'listening'}>
            {status === 'listening' ? <MicOff className="size-4" /> : <Mic className="size-4" />}
            {status === 'listening' ? 'Stop listening' : status === 'requesting' ? 'Waiting for permission…' : 'Start tuner'}
          </button>
        </div>

        {/* Meter */}
        <div className="relative mx-auto mt-8 aspect-[2/1] max-w-md" role="meter" aria-valuemin={-50} aria-valuemax={50} aria-valuenow={reading ? cents : 0} aria-label="Pitch deviation in cents">
          <svg viewBox="0 0 200 105" className="absolute inset-0 size-full" aria-hidden="true">
            <defs>
              <linearGradient id="meter-g" x1="0" x2="1">
                <stop offset="0" stopColor="#FCD34D" />
                <stop offset="0.4" stopColor="#8B5CF6" />
                <stop offset="0.5" stopColor="#86EFAC" />
                <stop offset="0.6" stopColor="#8B5CF6" />
                <stop offset="1" stopColor="#FCD34D" />
              </linearGradient>
            </defs>
            <path d="M15 100 A85 85 0 0 1 185 100" fill="none" stroke="url(#meter-g)" strokeWidth="6" strokeLinecap="round" opacity="0.85" />
            {Array.from({ length: 21 }, (_, i) => {
              const a = ((i - 10) * 8 * Math.PI) / 180
              const r1 = i % 5 === 0 ? 70 : 74
              return <line key={i} x1={100 + Math.sin(a) * r1} y1={100 - Math.cos(a) * r1} x2={100 + Math.sin(a) * 78} y2={100 - Math.cos(a) * 78} stroke="#B9ADC9" strokeOpacity={i === 10 ? 1 : 0.5} strokeWidth={i === 10 ? 2 : 1} />
            })}
          </svg>
          <motion.div
            className="absolute bottom-0 left-1/2 h-[82%] w-1 origin-bottom -translate-x-1/2 rounded-full"
            style={{ background: inTune ? '#86EFAC' : '#E9D5FF', boxShadow: inTune ? '0 0 16px #86EFAC' : '0 0 12px rgb(139 92 246)' }}
            animate={{ rotate: reading ? angle : 0, opacity: reading ? 1 : 0.35 }}
            transition={{ type: 'spring', stiffness: 160, damping: 18 }}
          />
          <span className="absolute bottom-[-6px] left-1/2 size-4 -translate-x-1/2 rounded-full bg-lilac" />
        </div>

        <div className="mt-6 text-center" aria-live="polite">
          <p className={`text-6xl font-bold tracking-tight ${inTune ? 'text-success' : 'text-white'}`}>
            {reading ? reading.name : '—'}
            {reading && <sub className="ml-1 text-xl text-muted">{reading.octave}</sub>}
          </p>
          <p className="mt-2 font-mono text-sm text-muted">{reading ? `${reading.freq.toFixed(1)} Hz · ${cents > 0 ? '+' : ''}${cents} cents` : status === 'listening' ? 'Play a single string…' : 'Tuner is off'}</p>
          {reading && (
            <p className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${inTune ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'}`}>
              {inTune ? <CheckCircle2 className="size-4" /> : cents < 0 ? <ArrowUp className="size-4" /> : <ArrowDown className="size-4" />}
              {inTune ? 'In tune' : cents < 0 ? 'Flat — tune up' : 'Sharp — tune down'}
            </p>
          )}
        </div>

        {MESSAGES[status] && (
          <p className="mt-6 flex items-start gap-2 rounded-xl border border-warning/30 bg-warning/10 p-3 text-sm text-warning" role="alert">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" /> {MESSAGES[status]}
          </p>
        )}
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold">Standard tuning · reference tones</h2>
        <p className="mt-1 text-sm text-muted">Manual fallback: play a reference note and match your string by ear. When the tuner is on, the nearest string is highlighted.</p>
        <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-3">
          {STANDARD_TUNING.map((s, i) => {
            const detected = reading?.string === i
            return (
              <button
                key={i}
                onClick={() => {
                  setRefString(i)
                  try {
                    referenceTone(s.freq)
                  } catch {
                    setStatus('unsupported')
                  }
                }}
                className={`flex flex-col items-center rounded-2xl border py-4 transition-all duration-300 ${
                  detected ? 'border-electric bg-electric/20 shadow-[0_0_24px_-6px_rgb(139_92_246)]' : refString === i ? 'border-lavender/60 bg-white/5' : 'border-line hover:border-lavender/50'
                }`}
                aria-label={`Play reference tone for string ${6 - i}, ${s.note}${s.octave}`}
              >
                <span className="text-2xl font-bold">{s.note}</span>
                <span className="text-[11px] text-muted">
                  String {6 - i} · {s.note}
                  {s.octave}
                </span>
                <Volume2 className="mt-2 size-4 text-lavender" aria-hidden="true" />
              </button>
            )
          })}
        </div>
        <p className="mt-5 text-xs text-muted">Tip: tune up to the note from below — it helps strings hold their pitch.</p>
      </div>
    </div>
  )
}
