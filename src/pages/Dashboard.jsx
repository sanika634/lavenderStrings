import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, History, Flame, BookOpen, Trophy, Lock, Mic, Timer, Grid3x3, ArrowUpDown, Eye, Guitar, CheckCircle2, Wrench, Info, RotateCcw } from 'lucide-react'
import { PageHeader, ProgressRing, ProgressBar, EmptyState, Segmented, stagger, fadeUp } from '../components/ui'
import SongCard from '../components/SongCard'
import SongArt from '../components/SongArt'
import { useStore, practiceStreak, useToast } from '../context/AppStore'
import { useSongs } from '../lib/useSongs'
import { LESSONS, nextLesson } from '../data/lessons'

const TOOL_META = {
  tuner: { label: 'Guitar Tuner', icon: Mic },
  metronome: { label: 'Metronome', icon: Timer },
  chords: { label: 'Chord Library', icon: Grid3x3 },
  transpose: { label: 'Transpose', icon: ArrowUpDown },
}

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)} min ago`
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`
  return `${Math.floor(s / 86400)} d ago`
}

function Stat({ icon: Icon, label, value, accent }) {
  return (
    <motion.div variants={fadeUp} className="card flex items-center gap-4 p-5">
      <span className={`grid size-12 place-items-center rounded-2xl ${accent ?? 'bg-electric/20 text-lilac'}`}>
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted">{label}</p>
      </div>
    </motion.div>
  )
}

export default function Dashboard() {
  const store = useStore()
  const { favourites, recent, completed, steps, activity, tools, user, resetProgress } = store
  const toast = useToast()
  const { songs } = useSongs()
  const [tab, setTab] = useState('favourites')
  const byId = useMemo(() => Object.fromEntries(songs.map((s) => [s.id, s])), [songs])

  const favSongs = favourites.map((id) => byId[id]).filter(Boolean)
  const savedTabs = favSongs.filter((s) => s.type === 'Tab')
  const recentSongs = recent.map((r) => ({ ...r, song: byId[r.id] })).filter((r) => r.song)
  const streak = practiceStreak(activity)
  const doneCount = Object.keys(completed).length
  const totalSteps = LESSONS.reduce((a, l) => a + l.steps.length, 0)
  const doneSteps = Object.values(steps).reduce((a, s) => a + s.length, 0)
  const next = nextLesson(steps, completed)
  const inProgress = LESSONS.filter((l) => (steps[l.id]?.length ?? 0) > 0)

  const favCats = new Set(favSongs.flatMap((s) => s.categories))
  const recommended = songs
    .filter((s) => !favourites.includes(s.id) && (favCats.size ? s.categories.some((c) => favCats.has(c)) : s.categories.includes('beginner')))
    .slice(0, 4)

  const badges = [
    { label: 'First favourite', done: favourites.length > 0, hint: 'Save a song' },
    { label: 'First lesson', done: doneCount > 0, hint: 'Complete a lesson' },
    { label: '3-day streak', done: streak >= 3, hint: 'Practise 3 days in a row' },
    { label: 'Explorer', done: recent.length >= 5, hint: 'Open 5 songs' },
    { label: 'Tool kit', done: tools.length >= 3, hint: 'Use 3 different tools' },
    { label: 'Scholar', done: doneCount >= 5, hint: 'Complete 5 lessons' },
  ]

  const timeline = [
    ...recent.slice(0, 6).map((r) => ({ at: r.at, icon: Eye, text: `Viewed ${byId[r.id]?.title ?? 'a song'}`, to: `/song/${r.id}` })),
    ...Object.entries(completed).map(([id, iso]) => ({ at: Date.parse(iso), icon: CheckCircle2, text: `Completed “${LESSONS.find((l) => l.id === id)?.title}”`, to: `/learn/${id}` })),
    ...tools.map((t) => ({ at: t.at, icon: Wrench, text: `Used ${TOOL_META[t.id]?.label}`, to: `/tools?tool=${t.id}` })),
  ]
    .sort((a, b) => b.at - a.at)
    .slice(0, 8)

  const listTabs = [
    { value: 'favourites', label: `Favourites (${favSongs.length})` },
    { value: 'tabs', label: `Saved tabs (${savedTabs.length})` },
    { value: 'recent', label: 'Recently viewed' },
  ]
  const shown = tab === 'favourites' ? favSongs : tab === 'tabs' ? savedTabs : recentSongs.map((r) => r.song)

  return (
    <>
      <PageHeader eyebrow="Dashboard" title={user ? `Welcome back, ${user.name.split(' ')[0]}` : 'Your'} highlight={user ? '' : 'practice dashboard'}>
        <p className="flex items-start gap-2 text-sm">
          <Info className="mt-0.5 size-4 shrink-0 text-lavender" /> Progress and favourites are stored in this browser (prototype). Real accounts with cross-device sync would need a backend.
        </p>
      </PageHeader>

      <div className="container-page space-y-10">
        <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={Heart} label="Favourite songs" value={favSongs.length} />
          <Stat icon={BookOpen} label="Lessons completed" value={`${doneCount}/${LESSONS.length}`} />
          <Stat icon={Flame} label="Day practice streak" value={streak} accent="bg-warning/15 text-warning" />
          <Stat icon={History} label="Songs viewed" value={recent.length} />
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr_1.2fr]">
          <section className="card flex flex-col items-center p-6 text-center" aria-labelledby="progress-title">
            <h2 id="progress-title" className="self-start font-semibold">
              Learning progress
            </h2>
            <div className="mt-4">
              <ProgressRing value={totalSteps ? doneSteps / totalSteps : 0} size={140} stroke={12} label={`${doneSteps} of ${totalSteps} lesson steps complete`}>
                <span className="text-3xl font-bold">{Math.round((doneSteps / totalSteps) * 100)}%</span>
                <span className="text-xs text-muted">of all steps</span>
              </ProgressRing>
            </div>
            {next && (
              <Link to={`/learn/${next.id}`} className="btn-primary mt-6 w-full">
                {inProgress.some((l) => l.id === next.id) ? 'Continue' : 'Start'}: {next.title}
              </Link>
            )}
          </section>

          <section className="card p-6" aria-labelledby="badges-title">
            <h2 id="badges-title" className="font-semibold">
              Achievements
            </h2>
            <ul className="mt-4 grid grid-cols-3 gap-3">
              {badges.map((b, i) => (
                <motion.li key={b.label} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.05 }} className="flex flex-col items-center gap-1.5 text-center" title={b.done ? 'Unlocked' : b.hint}>
                  <span className={`grid size-14 place-items-center rounded-2xl ${b.done ? 'bg-gradient-to-br from-lavender to-electric text-night shadow-[0_0_24px_-6px_rgb(139_92_246)]' : 'border border-dashed border-line text-muted'}`}>
                    {b.done ? <Trophy className="size-6" /> : <Lock className="size-5" />}
                  </span>
                  <span className={`text-[11px] leading-tight ${b.done ? 'text-white' : 'text-muted'}`}>{b.label}</span>
                  <span className="sr-only">{b.done ? 'unlocked' : `locked — ${b.hint}`}</span>
                </motion.li>
              ))}
            </ul>
          </section>

          <section className="card p-6" aria-labelledby="timeline-title">
            <h2 id="timeline-title" className="font-semibold">
              Recent activity
            </h2>
            {timeline.length === 0 ? (
              <p className="mt-4 text-sm text-muted">No activity yet. Open a song, a lesson or a tool and it will appear here.</p>
            ) : (
              <ol className="relative mt-4 space-y-4 border-l border-line pl-5">
                {timeline.map((e, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="relative">
                    <span className="absolute top-0.5 -left-[31px] grid size-5 place-items-center rounded-full bg-elevated text-lavender ring-4 ring-card">
                      <e.icon className="size-3" />
                    </span>
                    <Link to={e.to} className="block text-sm hover:text-lilac">
                      {e.text}
                    </Link>
                    <span className="text-xs text-muted">{timeAgo(e.at)}</span>
                  </motion.li>
                ))}
              </ol>
            )}
          </section>
        </div>

        <section id="favourites" className="scroll-mt-28" aria-labelledby="lib-title">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 id="lib-title" className="text-2xl font-bold">
              Your library
            </h2>
            <Segmented options={listTabs} value={tab} onChange={setTab} label="Library view" layoutId="dash-tab" />
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
              {shown.length === 0 ? (
                <EmptyState
                  icon={tab === 'recent' ? History : tab === 'tabs' ? Guitar : Heart}
                  title={tab === 'recent' ? 'No songs viewed yet' : tab === 'tabs' ? 'No saved tabs yet' : 'No favourites yet'}
                  action={
                    <Link to={tab === 'tabs' ? '/tabs' : '/explore'} className="btn-primary">
                      {tab === 'tabs' ? 'Browse tabs' : 'Explore songs'}
                    </Link>
                  }
                >
                  {tab === 'recent' ? 'Songs you open will show up here.' : 'Tap the heart on any song to save it here.'}
                </EmptyState>
              ) : tab === 'recent' ? (
                <ul className="card divide-y divide-line/50">
                  {recentSongs.map((r) => (
                    <li key={r.id}>
                      <Link to={`/song/${r.id}`} className="flex items-center gap-4 p-4 hover:bg-white/[0.03]">
                        <SongArt song={r.song} className="size-12 rounded-lg" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-semibold">{r.song.title}</span>
                          <span className="block truncate text-sm text-muted">{r.song.artist}</span>
                        </span>
                        <span className="text-xs text-muted">{timeAgo(r.at)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {shown.map((s) => (
                    <SongCard key={s.id} song={s} />
                  ))}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="card p-6" aria-labelledby="inprog-title">
            <h2 id="inprog-title" className="font-semibold">
              Lessons in progress
            </h2>
            {inProgress.length === 0 ? (
              <p className="mt-3 text-sm text-muted">
                You haven’t started a lesson yet.{' '}
                <Link to="/learn" className="text-lavender hover:text-white">
                  Browse lessons
                </Link>
              </p>
            ) : (
              <ul className="mt-4 space-y-4">
                {inProgress.map((l) => (
                  <li key={l.id}>
                    <Link to={`/learn/${l.id}`} className="block rounded-xl p-2 hover:bg-white/5">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{l.title}</span>
                        {completed[l.id] ? <span className="text-success">Completed</span> : <span className="text-muted">{steps[l.id].length}/{l.steps.length}</span>}
                      </div>
                      <ProgressBar value={steps[l.id].length / l.steps.length} className="mt-2" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="card p-6" aria-labelledby="tools-title">
            <h2 id="tools-title" className="font-semibold">
              Recently used tools
            </h2>
            {tools.length === 0 ? (
              <p className="mt-3 text-sm text-muted">
                No tools used yet.{' '}
                <Link to="/tools" className="text-lavender hover:text-white">
                  Open Music Tools
                </Link>
              </p>
            ) : (
              <ul className="mt-4 grid grid-cols-2 gap-3">
                {tools.map((t) => {
                  const m = TOOL_META[t.id]
                  if (!m) return null
                  return (
                    <li key={t.id}>
                      <Link to={`/tools?tool=${t.id}`} className="flex items-center gap-3 rounded-xl border border-line/60 p-3 hover:border-lavender/50">
                        <m.icon className="size-5 text-lavender" />
                        <span>
                          <span className="block text-sm font-medium">{m.label}</span>
                          <span className="block text-xs text-muted">{timeAgo(t.at)}</span>
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        </div>

        {recommended.length > 0 && (
          <section aria-labelledby="rec-title">
            <h2 id="rec-title" className="mb-1 text-2xl font-bold">
              Recommended for you
            </h2>
            <p className="mb-5 text-sm text-muted">{favCats.size ? 'Based on the categories of your favourite songs.' : 'Beginner-friendly picks to get started.'}</p>
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {recommended.map((s) => (
                <SongCard key={s.id} song={s} />
              ))}
            </motion.div>
          </section>
        )}

        <div className="flex justify-end">
          <button
            className="btn-ghost text-xs"
            onClick={() => {
              if (window.confirm('Clear favourites, history and lesson progress stored in this browser?')) {
                resetProgress()
                toast('Progress cleared')
              }
            }}
          >
            <RotateCcw className="size-4" /> Reset local progress
          </button>
        </div>
      </div>
    </>
  )
}
