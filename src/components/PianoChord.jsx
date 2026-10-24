import { noteIndex, parseChord, QUALITIES } from '../lib/music'

const WHITE = [0, 2, 4, 5, 7, 9, 11]
const BLACK = [1, 3, 6, 8, 10]
const BLACK_POS = { 1: 1, 3: 2, 6: 4, 8: 5, 10: 6 }

/** Two-octave keyboard highlighting the chord's tones. */
export default function PianoChord({ name, active = false, size = 150 }) {
  const c = parseChord(name)
  const root = c ? noteIndex(c.root) : 0
  const lit = new Set(c ? QUALITIES[c.quality].intervals.map((iv) => root + iv) : [])
  const W = 14 // white keys in two octaves
  return (
    <div
      className={`flex flex-col items-center rounded-2xl border p-2 transition-colors duration-300 ${active ? 'border-electric bg-electric/15 shadow-[0_0_28px_-6px_rgb(139_92_246/0.85)]' : 'border-line/70 bg-night-2/60'}`}
      style={{ width: size }}
    >
      <span className={`text-sm font-bold ${active ? 'text-white' : 'text-lilac'}`}>{name}</span>
      <svg viewBox={`0 0 ${W * 10} 50`} className="mt-1 w-full" role="img" aria-label={`${name} on piano`}>
        {Array.from({ length: W }, (_, i) => {
          const semi = WHITE[i % 7] + 12 * Math.floor(i / 7)
          const on = lit.has(semi)
          return <rect key={i} x={i * 10} y="0" width="9.4" height="48" rx="1.5" fill={on ? '#C4B5FD' : '#E9E3F5'} stroke="#160D26" strokeWidth="0.6" />
        })}
        {[0, 1].flatMap((oct) =>
          BLACK.map((b) => {
            const semi = b + oct * 12
            const x = (BLACK_POS[b] + oct * 7) * 10 - 3
            return <rect key={semi} x={x} y="0" width="6" height="30" rx="1" fill={lit.has(semi) ? '#8B5CF6' : '#1a1028'} />
          }),
        )}
      </svg>
    </div>
  )
}
