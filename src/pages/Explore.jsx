import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { Search, SearchX, X } from 'lucide-react'
import SongCard, { SongCardSkeleton } from '../components/SongCard'
import { PageHeader, EmptyState, DemoBadge } from '../components/ui'
import { useSongs, searchSongs } from '../lib/useSongs'
import { CATEGORIES, DIFFICULTY_ORDER } from '../data/categories'

const SORTS = {
  title: { label: 'Title A–Z', fn: (a, b) => a.title.localeCompare(b.title) },
  newest: { label: 'Newest first', fn: (a, b) => b.added.localeCompare(a.added) },
  easiest: { label: 'Easiest first', fn: (a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty] },
  hardest: { label: 'Hardest first', fn: (a, b) => DIFFICULTY_ORDER[b.difficulty] - DIFFICULTY_ORDER[a.difficulty] },
  artist: { label: 'Artist A–Z', fn: (a, b) => a.artist.localeCompare(b.artist) },
}

export default function Explore() {
  const { songs, loading, error } = useSongs()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const cat = params.get('cat') ?? 'all'
  const difficulty = params.get('level') ?? ''
  const type = params.get('type') ?? ''
  const sort = SORTS[params.get('sort')] ? params.get('sort') : 'title'

  const update = (key, value) => {
    const next = new URLSearchParams(params)
    value && value !== 'all' ? next.set(key, value) : next.delete(key)
    setParams(next, { replace: true })
  }

  const results = useMemo(() => {
    let list = searchSongs(songs, q)
    if (cat !== 'all') list = list.filter((s) => s.categories.includes(cat))
    if (difficulty) list = list.filter((s) => s.difficulty === difficulty)
    if (type) list = list.filter((s) => s.type === type)
    return [...list].sort(SORTS[sort].fn)
  }, [songs, q, cat, difficulty, type, sort])

  const hasFilters = q || cat !== 'all' || difficulty || type

  return (
    <>
      <PageHeader eyebrow="Explore" title="Explore" highlight="Songs">
        <p>Search and filter the catalogue by category, difficulty and arrangement type.</p>
        <DemoBadge className="mt-3">All songs are original demo material for this prototype</DemoBadge>
      </PageHeader>

      <div className="container-page">
        <div className="glass z-30 rounded-2xl p-3 sm:p-4 md:sticky md:top-[76px]">
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:grid-cols-[1fr_auto_auto_auto]">
            <label className="relative col-span-3 md:col-span-1">
              <span className="sr-only">Search the catalogue</span>
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-lavender" aria-hidden="true" />
              <input value={q} onChange={(e) => update('q', e.target.value)} placeholder="Search title, artist, genre or chord…" className="field pl-10" type="search" />
            </label>
            <label>
              <span className="sr-only">Difficulty</span>
              <select className="select pl-3 text-xs sm:pl-4 sm:text-sm" value={difficulty} onChange={(e) => update('level', e.target.value)}>
                <option value="">Any difficulty</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </label>
            <label>
              <span className="sr-only">Arrangement type</span>
              <select className="select pl-3 text-xs sm:pl-4 sm:text-sm" value={type} onChange={(e) => update('type', e.target.value)}>
                <option value="">Chords & tabs</option>
                <option value="Chords">Chords</option>
                <option value="Tab">Tabs</option>
              </select>
            </label>
            <label>
              <span className="sr-only">Sort by</span>
              <select className="select pl-3 text-xs sm:pl-4 sm:text-sm" value={sort} onChange={(e) => update('sort', e.target.value)}>
                {Object.entries(SORTS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]" role="tablist" aria-label="Categories">
            {CATEGORIES.map((c) => (
              <button key={c.id} role="tab" aria-selected={cat === c.id} onClick={() => update('cat', c.id)} className={`chip shrink-0 ${cat === c.id ? 'chip-active' : ''}`}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 mb-5 flex flex-wrap items-center justify-between gap-3 text-sm text-muted" aria-live="polite">
          <span>{loading ? 'Loading catalogue…' : `${results.length} ${results.length === 1 ? 'song' : 'songs'}`}</span>
          {hasFilters && (
            <button onClick={() => setParams({}, { replace: true })} className="inline-flex items-center gap-1 text-lavender hover:text-white">
              <X className="size-4" /> Clear filters
            </button>
          )}
        </div>

        {error ? (
          <EmptyState icon={SearchX} title="Something went wrong" action={<button className="btn-primary" onClick={() => location.reload()}>Retry</button>}>
            {error}
          </EmptyState>
        ) : loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => (
              <SongCardSkeleton key={i} />
            ))}
          </div>
        ) : results.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No songs match those filters"
            action={
              <button className="btn-primary" onClick={() => setParams({}, { replace: true })}>
                Reset filters
              </button>
            }
          >
            Try a different search term, choose another category or loosen the difficulty filter.
          </EmptyState>
        ) : (
          <LayoutGroup>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {results.map((s, i) => (
                  <motion.div
                    key={s.id}
                    layout
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.4, delay: Math.min(i, 8) * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <SongCard song={s} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </LayoutGroup>
        )}
      </div>
    </>
  )
}
