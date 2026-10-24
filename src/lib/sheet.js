import { parseChord } from './music'

/**
 * Parses a ChordPro-like sheet into renderable sections plus a playback progression.
 *   [Verse 1]            section header
 *   | G | D | Em |       chord-only bars
 *   [G]Some [D]lyrics    chords inline with lyrics
 *   e|---0---|           tablature (consecutive lines form one block)
 */
export function parseSheet(source) {
  const sections = []
  const progression = []
  let current = null
  const ensure = () => {
    if (!current) {
      current = { name: 'Song', lines: [], start: progression.length }
      sections.push(current)
    }
    return current
  }
  const addChord = (chord) => {
    progression.push(chord)
    return progression.length - 1
  }

  for (const raw of source.trim().split('\n')) {
    const line = raw.replace(/\s+$/, '')
    const header = /^\[([^\]]+)\]$/.exec(line.trim())
    if (header && !parseChord(header[1])) {
      if (current) current.end = progression.length
      current = { name: header[1], lines: [], start: progression.length }
      sections.push(current)
      continue
    }
    const sec = ensure()
    if (!line.trim()) {
      sec.lines.push({ type: 'space' })
    } else if (/^[eBGDAE]\|/.test(line.trim())) {
      const prev = sec.lines[sec.lines.length - 1]
      if (prev?.type === 'tab') prev.rows.push(line.trim())
      else sec.lines.push({ type: 'tab', rows: [line.trim()] })
    } else if (line.trim().startsWith('|')) {
      const chords = line.split('|').map((s) => s.trim()).filter(Boolean)
      sec.lines.push({ type: 'bars', chords: chords.map((chord) => ({ chord, index: addChord(chord) })) })
    } else {
      const segments = []
      const re = /\[([^\]]+)\]/g
      let last = 0
      let m
      let pending = null
      while ((m = re.exec(line))) {
        const text = line.slice(last, m.index)
        if (pending || text) segments.push({ ...(pending ?? {}), text })
        pending = { chord: m[1], index: addChord(m[1]) }
        last = re.lastIndex
      }
      segments.push({ ...(pending ?? {}), text: line.slice(last) })
      sec.lines.push({ type: 'lyric', segments: segments.filter((s) => s.chord || s.text) })
    }
  }
  if (current) current.end = progression.length
  return {
    sections: sections.map((s) => ({ ...s, end: s.end ?? progression.length })),
    progression,
    uniqueChords: [...new Set(progression)],
  }
}
