import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, ListMusic } from 'lucide-react'
import { PageHeader, Segmented, DifficultyBadge, DemoBadge, EmptyState, Reveal } from '../components/ui'
import { FavouriteButton } from '../components/SongCard'
import SongArt from '../components/SongArt'
import { useSongs } from '../lib/useSongs'
import { parseSheet } from '../lib/sheet'

const TYPES = [
  { value: 'all', label: 'All' },
  { value: 'Tab', label: 'Tabs' },
  { value: 'Chords', label: 'Chords' },
]

function TabPreview({ song }) {
  const { sections } = useMemo(() => parseSheet(song.sheet), [song.sheet])
  const tab = sections.flatMap((s) => s.lines).find((l) => l.type === 'tab')
  if (!tab) return null
  return (
    <pre className="mt-4 overflow-x-auto rounded-xl border border-line/60 bg-night/70 p-4 font-mono text-[12px] leading-relaxed text-lilac/90">
      {tab.rows.join('\n')}
    </pre>
  )
}

export default function Tabs() {
  const { songs, loading } = useSongs()
  const [type, setType] = useState('all')
  const [level, setLevel] = useState('all')

  const list = useMemo(
    () => songs.filter((s) => (type === 'all' || s.type === type) && (level === 'all' || s.difficulty === level)),
    [songs, type, level],
  )
  const spotlight = songs.find((s) => s.id === 'paper-comets')

  return (
    <>
      <PageHeader eyebrow="Guitar Tabs" title="Tabs &" highlight="Chord Sheets">
        <p>Every arrangement opens in the interactive reader — transpose, resize, follow along and loop sections.</p>
      </PageHeader>

      <div className="container-page grid gap-8 lg:grid-cols-[1fr_380px]">
        <section aria-labelledby="tabs-list">
          <h2 id="tabs-list" className="sr-only">
            Arrangements
          </h2>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <Segmented options={TYPES} value={type} onChange={setType} label="Arrangement type" layoutId="tab-type" />
            <Segmented options={['all', 'Beginner', 'Intermediate', 'Advanced'].map((v) => ({ value: v, label: v === 'all' ? 'Any level' : v }))} value={level} onChange={setLevel} label="Difficulty" layoutId="tab-level" />
          </div>
          <div className="card overflow-hidden">
            <div className="hidden grid-cols-[1fr_120px_110px_60px_44px] gap-4 border-b border-line/60 px-5 py-3 text-xs font-semibold tracking-wider text-muted uppercase md:grid">
              <span>Song</span>
              <span>Type</span>
              <span>Difficulty</span>
              <span>Key</span>
              <span className="sr-only">Save</span>
            </div>
            {loading && (
              <div className="space-y-3 p-5" aria-busy="true">
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="skeleton h-12" />
                ))}
              </div>
            )}
            {!loading && list.length === 0 && (
              <div className="p-5">
                <EmptyState icon={ListMusic} title="No arrangements match">
                  Try another type or difficulty.
                </EmptyState>
              </div>
            )}
            <ul>
              {list.map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="group relative grid grid-cols-[48px_1fr_auto] items-center gap-4 border-b border-line/40 px-4 py-3 last:border-0 hover:bg-white/[0.03] md:grid-cols-[48px_1fr_120px_110px_60px_44px] md:px-5"
                >
                  <SongArt song={s} className="size-12 rounded-lg" />
                  <div className="min-w-0">
                    <Link to={`/song/${s.id}`} className="block truncate font-semibold after:absolute after:inset-0 after:content-[''] group-hover:text-lilac">
                      {s.title}
                    </Link>
                    <p className="truncate text-sm text-muted">
                      {s.artist}
                      <span className="md:hidden"> · {s.type} · {s.difficulty}</span>
                    </p>
                  </div>
                  <span className="hidden text-sm text-lavender md:block">{s.type === 'Tab' ? 'Guitar Tab' : 'Chords'}</span>
                  <span className="hidden md:block">
                    <DifficultyBadge level={s.difficulty} />
                  </span>
                  <span className="hidden font-mono text-sm md:block">{s.key}</span>
                  <span className="relative z-10 flex items-center">
                    <FavouriteButton songId={s.id} title={s.title} />
                    <ChevronRight className="size-4 text-muted md:hidden" aria-hidden="true" />
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        <aside className="space-y-6">
          {spotlight && (
            <Reveal className="card p-5">
              <p className="eyebrow">Tab spotlight</p>
              <h2 className="mt-2 text-lg font-semibold">{spotlight.title} — main riff</h2>
              <p className="text-sm text-muted">{spotlight.artist}</p>
              <TabPreview song={spotlight} />
              <Link to={`/song/${spotlight.id}`} className="btn-primary mt-4 w-full">
                Open in tab reader
              </Link>
            </Reveal>
          )}
          <Reveal delay={0.1} className="card p-5">
            <h2 className="font-semibold">New to tabs?</h2>
            <p className="mt-2 text-sm text-muted">Six lines for six strings, numbers for frets. Learn to read any tab in ten minutes.</p>
            <Link to="/learn/reading-tabs" className="btn-outline mt-4 w-full">
              How to read tabs
            </Link>
          </Reveal>
          <DemoBadge>Original sample arrangements</DemoBadge>
        </aside>
      </div>
    </>
  )
}
