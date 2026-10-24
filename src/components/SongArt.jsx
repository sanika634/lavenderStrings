// Original generative placeholder artwork — each song gets a deterministic abstract cover.

function hash(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619)
  return h >>> 0
}

export default function SongArt({ song, className = '' }) {
  const [a, bg, c] = song.palette
  const h = hash(song.id)
  const variant = h % 3
  const gid = `art-${song.id}`
  const bars = Array.from({ length: 18 }, (_, i) => 12 + ((h >> (i % 24)) & 31) + Math.sin(i * 0.7) * 10)

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label={`Demo artwork for ${song.title}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${gid}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={bg} />
          <stop offset="1" stopColor="#0d0718" />
        </linearGradient>
        <radialGradient id={`${gid}-glow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={a} stopOpacity="0.95" />
          <stop offset="1" stopColor={a} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="200" height="200" fill={`url(#${gid}-bg)`} />
      <circle cx={40 + (h % 120)} cy={50 + ((h >> 8) % 80)} r="90" fill={`url(#${gid}-glow)`} opacity="0.75" />
      {variant === 0 &&
        [0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx="100" cy="100" r={22 + i * 16} fill="none" stroke={c} strokeOpacity={0.5 - i * 0.08} strokeWidth="1.2" />
        ))}
      {variant === 1 &&
        Array.from({ length: 7 }, (_, i) => (
          <path
            key={i}
            d={`M0 ${70 + i * 10} C 50 ${40 + i * 12}, 120 ${140 - i * 6}, 200 ${80 + i * 8}`}
            fill="none"
            stroke={c}
            strokeOpacity={0.15 + i * 0.07}
            strokeWidth="1.2"
          />
        ))}
      {variant === 2 &&
        bars.map((v, i) => (
          <rect key={i} x={18 + i * 9.4} y={100 - v} width="4.5" height={v * 2} rx="2.25" fill={c} opacity={0.25 + (i % 5) * 0.12} />
        ))}
    </svg>
  )
}
