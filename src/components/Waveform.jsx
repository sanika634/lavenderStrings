// Decorative waveform bars. Animation pauses when `active` is false.
export default function Waveform({ active = false, bars = 28, className = '', progress = null }) {
  return (
    <div className={`flex items-center gap-[3px] ${className}`} aria-hidden="true">
      {Array.from({ length: bars }, (_, i) => {
        const h = 30 + Math.abs(Math.sin(i * 1.7) * 55) + ((i * 37) % 15)
        const played = progress !== null && i / bars <= progress
        return (
          <span
            key={i}
            className={`w-[3px] origin-center rounded-full transition-colors duration-300 ${played || progress === null ? 'bg-gradient-to-t from-electric to-lilac' : 'bg-line'}`}
            style={{
              height: `${h}%`,
              animation: `wave-bar ${0.8 + (i % 5) * 0.17}s ease-in-out ${(i % 7) * -0.13}s infinite alternate`,
              animationPlayState: active ? 'running' : 'paused',
            }}
          />
        )
      })}
    </div>
  )
}
