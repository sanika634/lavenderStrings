import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Volume2, SearchX } from 'lucide-react'
import ChordDiagram from '../ChordDiagram'
import { EmptyState } from '../ui'
import { chordCatalogue, chordShapes, chordNotes, QUALITIES, parseChord } from '../../lib/music'
import { getAudioContext, strum } from '../../lib/audio'

const CATALOGUE = chordCatalogue()
const INTERVAL_NAMES = { 0: 'R', 2: '2', 3: '♭3', 4: '3', 5: '4', 6: '♭5', 7: '5', 10: '♭7', 11: '7', 14: '9' }

function hear(name) {
  try {
    const ac = getAudioContext()
    strum(ac, ac.destination, name, ac.currentTime + 0.02)
  } catch {
    /* Web Audio unavailable */
  }
}

export default function ChordLibrary({ initial }) {
  const [query, setQuery] = useState('')
  const [quality, setQuality] = useState('all')
  const [selected, setSelected] = useState(() => (initial && chordShapes(initial).length ? initial : 'C'))

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return CATALOGUE.filter(
      (c) => (quality === 'all' || c.quality === quality) && (!q || c.name.toLowerCase().startsWith(q) || c.label.toLowerCase().includes(q)),
    )
  }, [query, quality])

  const shapes = chordShapes(selected)
  const parsed = parseChord(selected)

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="min-w-0">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Search chords</span>
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-lavender" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search chords, e.g. F#m or sus4" className="field pl-10" type="search" />
          </label>
          <label>
            <span className="sr-only">Chord type</span>
            <select className="select sm:w-48" value={quality} onChange={(e) => setQuality(e.target.value)}>
              <option value="all">All chord types</option>
              {Object.entries(QUALITIES).map(([k, v]) => (
                <option key={k || 'maj'} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="mt-4 text-sm text-muted" aria-live="polite">
          {list.length} chords
        </p>
        {list.length === 0 ? (
          <div className="mt-4">
            <EmptyState icon={SearchX} title="No chords found">
              Try a root note such as “Bb” or a type such as “minor”.
            </EmptyState>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(104px,1fr))] gap-3">
            {list.slice(0, 120).map((c) => (
              <ChordDiagram key={c.name} name={c.name} active={c.name === selected} size="100%" onClick={() => setSelected(c.name)} />
            ))}
          </div>
        )}
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <AnimatePresence mode="wait">
          <motion.div key={selected} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }} className="card p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-3xl font-bold">{selected}</h2>
                <p className="text-sm text-muted">{QUALITIES[parsed?.quality ?? '']?.label}</p>
              </div>
              <button onClick={() => hear(selected)} className="btn-outline min-h-10">
                <Volume2 className="size-4" /> Hear
              </button>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-night-2/70 p-3">
                <dt className="text-xs text-muted">Notes</dt>
                <dd className="mt-1 font-mono font-semibold text-lilac">{chordNotes(selected).join(' · ')}</dd>
              </div>
              <div className="rounded-xl bg-night-2/70 p-3">
                <dt className="text-xs text-muted">Formula</dt>
                <dd className="mt-1 font-mono font-semibold text-lilac">{QUALITIES[parsed?.quality ?? ''].intervals.map((i) => INTERVAL_NAMES[i]).join(' · ')}</dd>
              </div>
            </dl>
            <h3 className="mt-6 text-sm font-semibold">
              {shapes.length} {shapes.length === 1 ? 'shape' : 'shapes'}
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {shapes.map((s, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <ChordDiagram name={selected} shape={s} size="100%" showName={false} />
                  <p className="text-center text-[11px] text-muted">{s.label}</p>
                  <p className="font-mono text-xs text-lavender">{s.frets.map((f) => (f === null ? 'x' : f)).join(' ')}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted">Frets are listed from the low E string to the high e string. x = don’t play, 0 = open string.</p>
          </motion.div>
        </AnimatePresence>
      </aside>
    </div>
  )
}
