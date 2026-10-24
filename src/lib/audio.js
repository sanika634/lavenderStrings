import { chordMidi, midiToFreq } from './music'

let ctx = null

export function getAudioContext() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) throw new Error('Web Audio is not supported in this browser.')
    ctx = new AC()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

/** A short plucked-string tone: two detuned oscillators through a closing low-pass filter. */
export function pluck(ac, dest, freq, when, { gain = 0.18, decay = 1.8 } = {}) {
  const out = ac.createGain()
  out.gain.setValueAtTime(0.0001, when)
  out.gain.exponentialRampToValueAtTime(gain, when + 0.006)
  out.gain.exponentialRampToValueAtTime(0.0001, when + decay)

  const filter = ac.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(Math.min(freq * 8, 7000), when)
  filter.frequency.exponentialRampToValueAtTime(Math.max(freq * 1.5, 300), when + decay * 0.6)
  filter.Q.value = 0.7

  for (const [type, detune, level] of [['triangle', 0, 1], ['sawtooth', 6, 0.25]]) {
    const osc = ac.createOscillator()
    const g = ac.createGain()
    osc.type = type
    osc.frequency.value = freq
    osc.detune.value = detune
    g.gain.value = level
    osc.connect(g).connect(filter)
    osc.start(when)
    osc.stop(when + decay + 0.05)
  }
  filter.connect(out).connect(dest)
}

/** Strums a chord: notes staggered a few milliseconds apart, like a pick across strings. */
export function strum(ac, dest, chord, when, { down = true, level = 1 } = {}) {
  const notes = chordMidi(chord)
  const ordered = down ? notes : [...notes].reverse()
  ordered.forEach((m, i) => pluck(ac, dest, midiToFreq(m), when + i * 0.014, { gain: 0.1 * level, decay: 1.6 }))
}

export function click(ac, dest, when, accent = false, level = 1) {
  const osc = ac.createOscillator()
  const g = ac.createGain()
  osc.frequency.value = accent ? 1760 : 1180
  g.gain.setValueAtTime(0.0001, when)
  g.gain.exponentialRampToValueAtTime((accent ? 0.5 : 0.3) * level, when + 0.002)
  g.gain.exponentialRampToValueAtTime(0.0001, when + 0.06)
  osc.connect(g).connect(dest)
  osc.start(when)
  osc.stop(when + 0.08)
}

/** Plucked reference tone for the manual tuner. */
export function referenceTone(freq) {
  const ac = getAudioContext()
  pluck(ac, ac.destination, freq, ac.currentTime, { gain: 0.35, decay: 3.5 })
}
