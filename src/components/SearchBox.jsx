import { useId, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Music2, User, Hash, Grid3x3, CornerDownLeft } from 'lucide-react'
import { useSongs } from '../lib/useSongs'
import { CATEGORIES } from '../data/categories'
import { parseChord } from '../lib/music'

function buildSuggestions(songs, query) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const out = []
  for (const s of songs.filter((s) => s.title.toLowerCase().includes(q)).slice(0, 4))
    out.push({ kind: 'Song', icon: Music2, label: s.title, sub: s.artist, to: `/song/${s.id}` })
  const artists = [...new Set(songs.map((s) => s.artist))].filter((a) => a.toLowerCase().includes(q)).slice(0, 3)
  for (const a of artists) out.push({ kind: 'Artist', icon: User, label: a, sub: 'Artist', to: `/explore?q=${encodeURIComponent(a)}` })
  for (const c of CATEGORIES.filter((c) => c.id !== 'all' && c.label.toLowerCase().includes(q)).slice(0, 2))
    out.push({ kind: 'Category', icon: Grid3x3, label: c.label, sub: 'Category', to: `/explore?cat=${c.id}` })
  const chord = query.trim().replace(/^./, (m) => m.toUpperCase())
  if (parseChord(chord)) out.push({ kind: 'Chord', icon: Hash, label: `${chord} chord`, sub: 'Chord library', to: `/tools?tool=chords&chord=${encodeURIComponent(chord)}` })
  return out
}

export default function SearchBox({ variant = 'hero', autoFocus = false, onNavigate }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const { songs, loading } = useSongs()
  const navigate = useNavigate()
  const listId = useId()
  const inputRef = useRef(null)

  const suggestions = useMemo(() => buildSuggestions(songs, query), [songs, query])
  const show = open && query.trim().length > 0

  const go = (to) => {
    setOpen(false)
    setQuery('')
    navigate(to)
    onNavigate?.()
  }

  const submit = (e) => {
    e.preventDefault()
    if (active >= 0 && suggestions[active]) return go(suggestions[active].to)
    go(`/explore?q=${encodeURIComponent(query.trim())}`)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActive((a) => Math.min(suggestions.length - 1, a + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(-1, a - 1))
    } else if (e.key === 'Escape') {
      setOpen(false)
      setActive(-1)
    }
  }

  const hero = variant === 'hero'

  return (
    <form role="search" onSubmit={submit} className="relative w-full">
      <label htmlFor={`${listId}-input`} className="sr-only">
        Search songs, artists, chords, or guitar tabs
      </label>
      <div
        className={`group flex items-center gap-3 rounded-full transition-all duration-300 focus-within:border-electric/80 ${
          hero
            ? 'glass h-14 pr-2 pl-5 shadow-[0_20px_60px_-25px_rgb(139_92_246/0.8)] focus-within:shadow-[0_0_0_4px_rgb(139_92_246/0.22),0_20px_60px_-20px_rgb(139_92_246/0.9)]'
            : 'h-11 border border-line bg-night-2/80 pr-1.5 pl-4'
        }`}
      >
        <Search className="size-5 shrink-0 text-lavender" aria-hidden="true" />
        <input
          ref={inputRef}
          id={`${listId}-input`}
          role="combobox"
          aria-expanded={show}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          autoFocus={autoFocus}
          autoComplete="off"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
            setActive(-1)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={onKeyDown}
          placeholder="Search songs, artists, chords, or guitar tabs…"
          className="h-full min-w-0 flex-1 bg-transparent text-[15px] text-white placeholder:text-muted/80 focus:outline-none focus-visible:outline-none"
        />
        {hero && (
          <button type="submit" className="btn-primary hidden h-10 min-h-10 px-5 sm:inline-flex">
            Search
          </button>
        )}
      </div>

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="glass absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-2xl text-left shadow-2xl shadow-black/50"
          >
            <ul id={listId} role="listbox" aria-label="Search suggestions" className="max-h-80 overflow-y-auto p-1.5">
              {loading && <li className="px-3 py-3 text-sm text-muted">Loading catalogue…</li>}
              {!loading && suggestions.length === 0 && (
                <li className="px-3 py-3 text-sm text-muted">No direct matches — press Enter to search the full catalogue.</li>
              )}
              {suggestions.map((s, i) => (
                <li
                  key={s.kind + s.label}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    go(s.to)
                  }}
                  onMouseEnter={() => setActive(i)}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${i === active ? 'bg-electric/20' : ''}`}
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-elevated text-lavender">
                    <s.icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-white">{s.label}</span>
                    <span className="block truncate text-xs text-muted">{s.sub}</span>
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider text-lavender/70 uppercase">{s.kind}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-1.5 border-t border-line/60 px-4 py-2 text-xs text-muted">
              <CornerDownLeft className="size-3" aria-hidden="true" /> Enter to see all results for “{query.trim()}”
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  )
}
