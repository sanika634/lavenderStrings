import { motion } from 'framer-motion'
import { chordShapes } from '../lib/music'

const STRINGS = 6
const FRETS = 5

/** SVG guitar chord box. `shape` overrides the default (first) voicing. */
export default function ChordDiagram({ name, shape, active = false, size = 120, onClick, showName = true }) {
  const voicing = shape ?? chordShapes(name)[0]
  const W = 100
  const H = 120
  const left = 16
  const top = 26
  const gx = (W - left * 2) / (STRINGS - 1)
  const gy = (H - top - 12) / FRETS

  const fretted = voicing?.frets.filter((f) => f > 0) ?? []
  const maxFret = Math.max(0, ...fretted)
  const minFret = Math.min(...fretted, 99)
  const base = maxFret > FRETS ? minFret : 1

  // Detect barre: lowest finger 1 used on several strings at the same fret.
  let barre = null
  if (voicing) {
    const ones = voicing.frets.map((f, i) => (voicing.fingers[i] === 1 && f > 0 ? i : -1)).filter((i) => i >= 0)
    if (ones.length > 1) barre = { from: ones[0], to: ones[ones.length - 1], fret: voicing.frets[ones[0]] }
  }

  const Wrapper = onClick ? motion.button : motion.div
  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      aria-pressed={onClick ? active : undefined}
      animate={{ scale: active ? 1.04 : 1 }}
      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
      className={`relative flex flex-col items-center rounded-2xl border p-2 transition-colors duration-300 ${
        active ? 'border-electric bg-electric/15 shadow-[0_0_28px_-6px_rgb(139_92_246/0.85)]' : 'border-line/70 bg-night-2/60 hover:border-lavender/40'
      }`}
      style={{ width: size }}
    >
      {showName && <span className={`text-sm font-bold ${active ? 'text-white' : 'text-lilac'}`}>{name}</span>}
      {!voicing ? (
        <p className="py-8 text-center text-xs text-muted">No diagram</p>
      ) : (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`${name} chord diagram: ${voicing.frets.map((f) => (f === null ? 'x' : f)).join(' ')}`}>
          {base > 1 && (
            <text x="2" y={top + gy * 0.65} fontSize="9" fill="#B9ADC9" fontFamily="JetBrains Mono">
              {base}
            </text>
          )}
          {/* nut */}
          <rect x={left} y={top - 3} width={W - left * 2} height={base === 1 ? 4 : 1} fill="#E9D5FF" rx="1" />
          {Array.from({ length: FRETS + 1 }, (_, i) => (
            <line key={`f${i}`} x1={left} x2={W - left} y1={top + i * gy} y2={top + i * gy} stroke="#49355F" strokeWidth="1" />
          ))}
          {Array.from({ length: STRINGS }, (_, i) => (
            <line key={`s${i}`} x1={left + i * gx} x2={left + i * gx} y1={top} y2={top + FRETS * gy} stroke="#B9ADC9" strokeOpacity="0.7" strokeWidth={1 + (5 - i) * 0.15} />
          ))}
          {voicing.frets.map((f, i) => {
            const x = left + i * gx
            if (f === null)
              return (
                <text key={i} x={x} y={top - 9} fontSize="10" textAnchor="middle" fill="#B9ADC9">
                  ×
                </text>
              )
            if (f === 0) return <circle key={i} cx={x} cy={top - 12} r="3.3" fill="none" stroke="#C4B5FD" strokeWidth="1.3" />
            return null
          })}
          {barre && (
            <rect
              x={left + barre.from * gx - 5}
              y={top + (barre.fret - base + 0.5) * gy - 5}
              width={(barre.to - barre.from) * gx + 10}
              height="10"
              rx="5"
              fill={active ? '#8B5CF6' : '#A78BFA'}
              opacity="0.9"
            />
          )}
          {voicing.frets.map((f, i) => {
            if (!f) return null
            if (barre && voicing.fingers[i] === 1 && f === barre.fret) return null
            const cx = left + i * gx
            const cy = top + (f - base + 0.5) * gy
            return (
              <g key={`d${i}`}>
                <circle cx={cx} cy={cy} r="6" fill={active ? '#8B5CF6' : '#A78BFA'} />
                {voicing.fingers[i] > 0 && (
                  <text x={cx} y={cy + 3} fontSize="8" fontWeight="700" textAnchor="middle" fill="#160D26">
                    {voicing.fingers[i]}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      )}
    </Wrapper>
  )
}
