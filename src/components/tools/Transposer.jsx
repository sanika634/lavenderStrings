import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, RotateCcw, AlertTriangle } from 'lucide-react'
import { parseChord, transposeChord, transposeKey, SHARPS, noteIndex } from '../../lib/music'
import { Segmented } from '../ui'

const KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']

export default function Transposer() {
  const [input, setInput] = useState('G D Em C\nAm F C G/B')
  const [fromKey, setFromKey] = useState('G')
  const [semis, setSemis] = useState(0)
  const [spelling, setSpelling] = useState('auto')

  const target = transposeKey(fromKey, semis)
  const preferFlats = spelling === 'auto' ? target.preferFlats : spelling === 'flats'

  const lines = useMemo(
    () =>
      input.split('\n').map((line) =>
        line
          .split(/\s+/)
          .filter(Boolean)
          .map((tok) => ({ tok, valid: !!parseChord(tok), out: parseChord(tok) ? transposeChord(tok, semis, preferFlats) : tok })),
      ),
    [input, semis, preferFlats],
  )
  const invalid = lines.flat().filter((t) => !t.valid)

  const setTargetKey = (k) => setSemis(((noteIndex(k) - noteIndex(fromKey)) % 12 + 12) % 12)

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="card p-6">
        <label htmlFor="tp-input" className="text-sm font-semibold">
          Chords to transpose
        </label>
        <p className="text-xs text-muted">Separate chords with spaces; use new lines for each line or section.</p>
        <textarea
          id="tp-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={6}
          spellCheck={false}
          className="field mt-3 min-h-40 py-3 font-mono"
          aria-invalid={invalid.length > 0}
          aria-describedby={invalid.length ? 'tp-err' : undefined}
        />
        {invalid.length > 0 && (
          <p id="tp-err" className="mt-2 flex items-center gap-2 text-xs text-warning">
            <AlertTriangle className="size-3.5" /> Not recognised (left unchanged): {invalid.map((t) => t.tok).join(', ')}
          </p>
        )}
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            Original key
            <select className="select mt-2" value={fromKey} onChange={(e) => setFromKey(e.target.value)}>
              {KEYS.map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold">
            Target key
            <select className="select mt-2" value={SHARPS[(noteIndex(fromKey) + semis + 1200) % 12]} onChange={(e) => setTargetKey(e.target.value)}>
              {SHARPS.map((k, i) => (
                <option key={k} value={k}>
                  {KEYS[i] === k ? k : `${k} / ${KEYS[i]}`}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold">Accidentals</p>
          <Segmented options={[{ value: 'auto', label: 'Auto (by key)' }, { value: 'sharps', label: '♯ Sharps' }, { value: 'flats', label: '♭ Flats' }]} value={spelling} onChange={setSpelling} label="Accidentals" layoutId="tp-acc" />
        </div>
      </div>

      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-muted">Transposed to</p>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p key={target.key + preferFlats} initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 12, opacity: 0 }} className="text-3xl font-bold">
                {transposeChord(target.key, 0, preferFlats)}{' '}
                <span className="text-base font-medium text-muted">({semis > 6 ? semis - 12 : semis > 0 ? `+${semis}` : semis} semitones)</span>
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-2">
            <button className="icon-btn bg-night-2" onClick={() => setSemis((s) => (s + 11) % 12)} aria-label="Down a semitone">
              <Minus className="size-5" />
            </button>
            <button className="icon-btn bg-night-2" onClick={() => setSemis((s) => (s + 1) % 12)} aria-label="Up a semitone">
              <Plus className="size-5" />
            </button>
            <button className="btn-ghost min-h-11" onClick={() => setSemis(0)} disabled={!semis}>
              <RotateCcw className="size-4" /> Reset
            </button>
          </div>
        </div>
        <div className="mt-6 space-y-3" aria-live="polite">
          {lines.map((line, li) => (
            <div key={li} className="flex min-h-10 flex-wrap gap-2">
              {line.map((t, i) => (
                <AnimatePresence key={i} mode="popLayout" initial={false}>
                  <motion.span
                    key={t.out}
                    initial={{ y: -10, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                    transition={{ duration: 0.22, delay: i * 0.02 }}
                    className={`inline-flex min-w-14 items-center justify-center rounded-xl border px-3 py-2 font-mono font-bold ${t.valid ? 'border-electric/50 bg-electric/15 text-lilac' : 'border-warning/40 text-warning'}`}
                  >
                    {t.out}
                  </motion.span>
                </AnimatePresence>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
