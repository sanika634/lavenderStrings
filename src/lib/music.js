// Music theory helpers: chord parsing, transposition and guitar chord shapes.

export const SHARPS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
export const FLATS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']

const NOTE_INDEX = {
  C: 0, 'B#': 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, Fb: 4, 'E#': 5, F: 5,
  'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11, Cb: 11,
}

// Keys conventionally written with flats (major and minor).
const FLAT_KEYS = new Set(['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Dm', 'Gm', 'Cm', 'Fm', 'Bbm', 'Ebm'])

export const QUALITIES = {
  '': { label: 'Major', intervals: [0, 4, 7] },
  m: { label: 'Minor', intervals: [0, 3, 7] },
  '7': { label: 'Dominant 7th', intervals: [0, 4, 7, 10] },
  maj7: { label: 'Major 7th', intervals: [0, 4, 7, 11] },
  m7: { label: 'Minor 7th', intervals: [0, 3, 7, 10] },
  sus2: { label: 'Suspended 2nd', intervals: [0, 2, 7] },
  sus4: { label: 'Suspended 4th', intervals: [0, 5, 7] },
  add9: { label: 'Added 9th', intervals: [0, 4, 7, 14] },
  dim: { label: 'Diminished', intervals: [0, 3, 6] },
  '5': { label: 'Power chord', intervals: [0, 7] },
}

const CHORD_RE = /^([A-G](?:#|b)?)(maj7|m7|m|7|sus2|sus4|add9|dim|5)?(?:\/([A-G](?:#|b)?))?$/

export function noteIndex(note) {
  return NOTE_INDEX[note]
}

export function parseChord(name) {
  const m = CHORD_RE.exec(name?.trim() ?? '')
  if (!m) return null
  return { root: m[1], quality: m[2] ?? '', bass: m[3] ?? null }
}

export function keyPrefersFlats(key) {
  return FLAT_KEYS.has(key) || /^[A-G]b/.test(key)
}

export function spell(index, preferFlats) {
  const i = ((index % 12) + 12) % 12
  return (preferFlats ? FLATS : SHARPS)[i]
}

export function transposeChord(name, semitones, preferFlats = false) {
  const c = parseChord(name)
  if (!c) return name
  const root = spell(noteIndex(c.root) + semitones, preferFlats)
  const bass = c.bass ? '/' + spell(noteIndex(c.bass) + semitones, preferFlats) : ''
  return root + c.quality + bass
}

/** Transposes a key (e.g. "G" or "Em") and decides the spelling the new key should use. */
export function transposeKey(key, semitones) {
  const minor = key.endsWith('m')
  const root = minor ? key.slice(0, -1) : key
  const idx = noteIndex(root) + semitones
  const sharpKey = spell(idx, false) + (minor ? 'm' : '')
  const flatKey = spell(idx, true) + (minor ? 'm' : '')
  if (sharpKey === flatKey) return { key: sharpKey, preferFlats: false }
  // Pick the spelling that produces a conventional key signature.
  const preferFlats = FLAT_KEYS.has(flatKey) || (!minor && ['Db', 'Ab', 'Eb', 'Bb'].includes(flatKey)) || flatKey === 'Gb'
  return { key: preferFlats ? flatKey : sharpKey, preferFlats }
}

export function chordNotes(name, preferFlats) {
  const c = parseChord(name)
  if (!c) return []
  const flats = preferFlats ?? (c.root.includes('b') || keyPrefersFlats(c.root))
  const r = noteIndex(c.root)
  return QUALITIES[c.quality].intervals.map((iv) => spell(r + iv, flats))
}

/** MIDI note numbers for a guitar-like voicing — used by the synth engine. */
export function chordMidi(name) {
  const c = parseChord(name)
  if (!c) return []
  const r = noteIndex(c.root)
  const bassIdx = c.bass ? noteIndex(c.bass) : r
  const bass = 40 + ((bassIdx - 4 + 12) % 12) // E2..D#3
  const base = 52 + ((r - 4 + 12) % 12) // E3..D#4
  const tones = QUALITIES[c.quality].intervals.map((iv) => base + iv)
  return [bass, ...tones, tones[0] + 12]
}

// ---------------------------------------------------------------------------
// Guitar shapes. Frets are listed low E → high e; null = muted, 0 = open.

const OPEN_SHAPES = {
  C: [[null, 3, 2, 0, 1, 0], [0, 3, 2, 0, 1, 0]],
  C7: [[null, 3, 2, 3, 1, 0], [0, 3, 2, 4, 1, 0]],
  Cmaj7: [[null, 3, 2, 0, 0, 0], [0, 3, 2, 0, 0, 0]],
  Cadd9: [[null, 3, 2, 0, 3, 0], [0, 2, 1, 0, 3, 0]],
  D: [[null, null, 0, 2, 3, 2], [0, 0, 0, 1, 3, 2]],
  Dm: [[null, null, 0, 2, 3, 1], [0, 0, 0, 2, 3, 1]],
  D7: [[null, null, 0, 2, 1, 2], [0, 0, 0, 2, 1, 3]],
  Dsus2: [[null, null, 0, 2, 3, 0], [0, 0, 0, 1, 3, 0]],
  Dsus4: [[null, null, 0, 2, 3, 3], [0, 0, 0, 1, 2, 3]],
  Dmaj7: [[null, null, 0, 2, 2, 2], [0, 0, 0, 1, 1, 1]],
  Dm7: [[null, null, 0, 2, 1, 1], [0, 0, 0, 2, 1, 1]],
  E: [[0, 2, 2, 1, 0, 0], [0, 2, 3, 1, 0, 0]],
  Em: [[0, 2, 2, 0, 0, 0], [0, 2, 3, 0, 0, 0]],
  E7: [[0, 2, 0, 1, 0, 0], [0, 2, 0, 1, 0, 0]],
  Em7: [[0, 2, 0, 0, 0, 0], [0, 2, 0, 0, 0, 0]],
  Fmaj7: [[null, null, 3, 2, 1, 0], [0, 0, 3, 2, 1, 0]],
  G: [[3, 2, 0, 0, 0, 3], [2, 1, 0, 0, 0, 3]],
  G7: [[3, 2, 0, 0, 0, 1], [3, 2, 0, 0, 0, 1]],
  Gsus4: [[3, null, 0, 0, 1, 3], [2, 0, 0, 0, 1, 3]],
  A: [[null, 0, 2, 2, 2, 0], [0, 0, 1, 2, 3, 0]],
  Am: [[null, 0, 2, 2, 1, 0], [0, 0, 2, 3, 1, 0]],
  A7: [[null, 0, 2, 0, 2, 0], [0, 0, 2, 0, 3, 0]],
  Am7: [[null, 0, 2, 0, 1, 0], [0, 0, 2, 0, 1, 0]],
  Asus2: [[null, 0, 2, 2, 0, 0], [0, 0, 1, 2, 0, 0]],
  Asus4: [[null, 0, 2, 2, 3, 0], [0, 0, 1, 2, 3, 0]],
  Amaj7: [[null, 0, 2, 1, 2, 0], [0, 0, 2, 1, 3, 0]],
  B7: [[null, 2, 1, 2, 0, 2], [0, 2, 1, 3, 0, 4]],
  'D/F#': [[2, null, 0, 2, 3, 2], [1, 0, 0, 2, 4, 3]],
  'G/B': [[null, 2, 0, 0, 0, 3], [0, 1, 0, 0, 0, 3]],
  'C/G': [[3, 3, 2, 0, 1, 0], [3, 4, 2, 0, 1, 0]],
}

// Movable barre templates relative to the root fret on the given string.
const E_SHAPE = {
  '': [[0, 2, 2, 1, 0, 0], [1, 3, 4, 2, 1, 1]],
  m: [[0, 2, 2, 0, 0, 0], [1, 3, 4, 1, 1, 1]],
  '7': [[0, 2, 0, 1, 0, 0], [1, 3, 1, 2, 1, 1]],
  m7: [[0, 2, 0, 0, 0, 0], [1, 3, 1, 1, 1, 1]],
  maj7: [[0, null, 1, 1, 0, null], [1, 0, 3, 4, 2, 0]],
  sus4: [[0, 2, 2, 2, 0, 0], [1, 2, 3, 4, 1, 1]],
  '5': [[0, 2, 2, null, null, null], [1, 3, 4, 0, 0, 0]],
}
const A_SHAPE = {
  '': [[null, 0, 2, 2, 2, 0], [0, 1, 2, 3, 4, 1]],
  m: [[null, 0, 2, 2, 1, 0], [0, 1, 3, 4, 2, 1]],
  '7': [[null, 0, 2, 0, 2, 0], [0, 1, 3, 1, 4, 1]],
  m7: [[null, 0, 2, 0, 1, 0], [0, 1, 3, 1, 2, 1]],
  maj7: [[null, 0, 2, 1, 2, 0], [0, 1, 3, 2, 4, 1]],
  sus2: [[null, 0, 2, 2, 0, 0], [0, 1, 3, 4, 1, 1]],
  sus4: [[null, 0, 2, 2, 3, 0], [0, 1, 2, 3, 4, 1]],
  add9: [[null, 0, 2, 4, 0, 0], [0, 1, 2, 4, 1, 1]],
  dim: [[null, 0, 1, 2, 1, null], [0, 1, 2, 4, 3, 0]],
  '5': [[null, 0, 2, 2, null, null], [0, 1, 3, 4, 0, 0]],
}

function shift([frets, fingers], offset, label) {
  const shifted = frets.map((f) => (f === null ? null : f + offset))
  return { frets: shifted, fingers: offset === 0 ? fingers.map((f, i) => (frets[i] === 0 ? 0 : f)) : fingers, label }
}

export function chordShapes(name) {
  const c = parseChord(name)
  if (!c) return []
  const out = []
  const seen = new Set()
  const push = (shape) => {
    const k = shape.frets.join(',')
    if (seen.has(k)) return
    seen.add(k)
    out.push(shape)
  }
  const plain = c.root + c.quality
  // Open shapes, trying enharmonic spellings of the root too.
  for (const key of [name, plain, spell(noteIndex(c.root), false) + c.quality, spell(noteIndex(c.root), true) + c.quality]) {
    const s = OPEN_SHAPES[key]
    if (s) push({ frets: s[0], fingers: s[1], label: key.includes('/') ? 'Slash voicing' : 'Open position' })
  }
  const r = noteIndex(c.root)
  if (E_SHAPE[c.quality]) {
    const f = (r - 4 + 12) % 12
    push(shift(E_SHAPE[c.quality], f, f === 0 ? 'Open (E shape)' : `E-shape barre · fret ${f}`))
  }
  if (A_SHAPE[c.quality]) {
    const f = (r - 9 + 12) % 12
    push(shift(A_SHAPE[c.quality], f, f === 0 ? 'Open (A shape)' : `A-shape barre · fret ${f}`))
  }
  // Lowest position first (open voicings have a lowest fret of 0).
  const lowest = (s) => Math.min(...s.frets.filter((f) => f !== null))
  return out.sort((a, b) => lowest(a) - lowest(b))
}

export const STANDARD_TUNING = [
  { note: 'E', octave: 2, freq: 82.41 },
  { note: 'A', octave: 2, freq: 110.0 },
  { note: 'D', octave: 3, freq: 146.83 },
  { note: 'G', octave: 3, freq: 196.0 },
  { note: 'B', octave: 3, freq: 246.94 },
  { note: 'E', octave: 4, freq: 329.63 },
]

export function frequencyToNote(freq) {
  const n = 12 * Math.log2(freq / 440) + 69
  const midi = Math.round(n)
  return { midi, name: SHARPS[midi % 12], octave: Math.floor(midi / 12) - 1, cents: Math.round((n - midi) * 100) }
}

export const midiToFreq = (m) => 440 * 2 ** ((m - 69) / 12)

/** Library listing: every root × quality that has at least one shape. */
export function chordCatalogue() {
  const list = []
  for (const root of ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']) {
    for (const q of Object.keys(QUALITIES)) {
      const name = root + q
      if (chordShapes(name).length) list.push({ name, root, quality: q, label: QUALITIES[q].label })
    }
  }
  return list
}
