import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { AudioLines, GraduationCap, ArrowRight, Guitar, Gauge, Mic, Timer, Grid3x3, ArrowUpDown, BookOpen, Sparkles } from 'lucide-react'
import SearchBox from '../components/SearchBox'
import SongCard, { SongCardSkeleton } from '../components/SongCard'
import { Starfield, SoundRibbon, FloatingNotes, HeroPlayButton, TrendingPanel, ChordTimelinePanel, PracticeModeCard, useMouseParallax, Parallax } from '../components/HeroScene'
import { Reveal, SectionHeading, DemoBadge, Segmented, stagger, ProgressBar, DifficultyBadge } from '../components/ui'
import ChordDiagram from '../components/ChordDiagram'
import { useSongs } from '../lib/useSongs'
import { CATEGORIES } from '../data/categories'
import { LESSONS } from '../data/lessons'
import { useStore } from '../context/AppStore'

const ease = [0.22, 1, 0.36, 1]

function Hero({ songs }) {
  const { mx, my, onPointerMove } = useMouseParallax()
  const { scrollY } = useScroll()
  const glowY = useTransform(scrollY, [0, 600], [0, 120])
  const ribbonY = useTransform(scrollY, [0, 600], [0, -40])
  const featured = songs[0]

  return (
    <section onPointerMove={onPointerMove} className="relative isolate overflow-hidden pt-28 sm:pt-36" aria-labelledby="hero-title">
      {/* layered background */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#1b1030_0%,#160D26_40%,#1f1236_75%,#160D26_100%)]" />
      <motion.div aria-hidden="true" style={{ y: glowY }} className="absolute -top-56 left-[8%] -z-10 h-[620px] w-[620px] animate-ambient rounded-full bg-[radial-gradient(circle,rgb(139_92_246/0.38),transparent_65%)] blur-2xl" />
      <div aria-hidden="true" className="absolute top-40 -right-40 -z-10 h-[520px] w-[520px] animate-ambient rounded-full bg-[radial-gradient(circle,rgb(192_132_252/0.18),transparent_65%)] blur-2xl [animation-delay:-9s]" />
      <div aria-hidden="true" className="absolute bottom-0 left-0 -z-10 h-[70%] w-[45%] bg-[linear-gradient(60deg,rgb(139_92_246/0.14),transparent_60%)] [clip-path:polygon(0_100%,0_30%,100%_100%)]" />
      <div aria-hidden="true" className="absolute right-0 bottom-0 -z-10 h-[70%] w-[45%] bg-[linear-gradient(-60deg,rgb(139_92_246/0.14),transparent_60%)] [clip-path:polygon(100%_100%,100%_30%,0_100%)]" />
      <Starfield className="absolute inset-0 -z-10 size-full" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-b from-transparent to-night" />
      <FloatingNotes mx={mx} my={my} />

      <div className="container-page relative text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="glass mx-auto inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-lilac"
        >
          <Sparkles className="size-3.5 text-lavender" aria-hidden="true" /> Tabs · Chords · Lessons · Practice tools
        </motion.p>
        <motion.h1
          id="hero-title"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease }}
          className="mx-auto mt-6 max-w-5xl text-[2.6rem] leading-[1.05] font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl"
        >
          Find Your Rhythm. <br className="hidden sm:block" />
          <span className="text-gradient">Play Your Favourite Songs.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18, ease }}
          className="mx-auto mt-6 max-w-xl text-base text-muted sm:text-lg"
        >
          Discover guitar tabs, master chords, explore new music, and bring your favourite songs to life.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28, ease }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          <Link to="/explore" className="btn-light h-12 px-7 text-[15px]">
            <AudioLines className="size-5" aria-hidden="true" /> Explore Songs
          </Link>
          <Link to="/learn" className="btn-outline h-12 px-7 text-[15px]">
            <GraduationCap className="size-5" aria-hidden="true" /> Start Learning
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.38, ease }}
          className="relative z-20 mx-auto mt-8 max-w-2xl"
        >
          <SearchBox variant="hero" />
        </motion.div>
      </div>

      {/* ribbon + play button */}
      <motion.div style={{ y: ribbonY }} className="pointer-events-none relative mx-auto -mt-2 h-[300px] max-w-6xl sm:h-[380px]">
        <SoundRibbon className="absolute inset-0 size-full" />
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.5, ease }}
          className="pointer-events-auto absolute bottom-6 left-1/2 -translate-x-1/2 sm:bottom-10"
        >
          {featured && <HeroPlayButton song={featured} />}
        </motion.div>
      </motion.div>

      {/* bottom panels */}
      <div className="container-page relative z-10 -mt-4 pb-10">
        {featured ? (
          <div className="grid items-end gap-6 md:grid-cols-[1fr_1.25fr_1fr]">
            <Parallax mx={mx} my={my} depth={-6} className="hidden md:block">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6, ease }}>
                <TrendingPanel songs={songs} />
              </motion.div>
            </Parallax>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7, ease }}>
              <ChordTimelinePanel song={featured} />
            </motion.div>
            <Parallax mx={mx} my={my} depth={10} className="hidden md:block">
              <motion.div initial={{ opacity: 0, y: 40, rotate: 4 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 0.7, delay: 0.8, ease }}>
                <PracticeModeCard />
              </motion.div>
            </Parallax>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton h-40 rounded-2xl" />
            ))}
          </div>
        )}
        <p className="mt-6 text-center text-xs text-muted">
          The play button and panels drive a synthesised chord preview of the original demo song “{featured?.title ?? '…'}” — not a recording.
        </p>
      </div>
    </section>
  )
}

const FEATURE_TABS = [
  { value: 'trending', label: 'Trending picks' },
  { value: 'beginner', label: 'Beginner-friendly' },
  { value: 'recent', label: 'Recently added' },
]

function FeaturedSongs({ songs, loading, error }) {
  const [tab, setTab] = useState('trending')
  const list = useMemo(() => {
    const filtered = songs.filter((s) => s.categories.includes(tab))
    return (tab === 'recent' ? [...filtered].sort((a, b) => b.added.localeCompare(a.added)) : filtered).slice(0, 4)
  }, [songs, tab])

  return (
    <section className="container-page mt-16" aria-labelledby="featured-title">
      <SectionHeading
        id="featured-title"
        eyebrow="Song discovery"
        title={
          <span className="flex flex-wrap items-center gap-3">
            Featured songs <DemoBadge>Original demo catalogue</DemoBadge>
          </span>
        }
        action={<Segmented options={FEATURE_TABS} value={tab} onChange={setTab} label="Featured song list" layoutId="featured-seg" />}
      />
      {error ? (
        <p className="card p-6 text-warning">{error}</p>
      ) : (
        <motion.div key={tab} variants={stagger} initial="hidden" animate="show" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? Array.from({ length: 4 }, (_, i) => <SongCardSkeleton key={i} />) : list.map((s) => <SongCard key={s.id} song={s} />)}
        </motion.div>
      )}
      <div className="mt-8 text-center">
        <Link to={`/explore?cat=${tab}`} className="btn-outline">
          See all {FEATURE_TABS.find((t) => t.value === tab).label.toLowerCase()} <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  )
}

function Categories() {
  return (
    <section className="container-page mt-8" aria-labelledby="cat-title">
      <h2 id="cat-title" className="sr-only">
        Browse categories
      </h2>
      <Reveal className="flex flex-wrap justify-center gap-2">
        {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
          <Link key={c.id} to={`/explore?cat=${c.id}`} className="chip">
            {c.label}
          </Link>
        ))}
      </Reveal>
    </section>
  )
}

const FEATURES = [
  { icon: Guitar, title: 'Interactive tabs & chords', text: 'Transpose, resize, toggle chords and follow the active bar as you play.', to: '/tabs' },
  { icon: Gauge, title: 'Practice player', text: 'Loop sections, slow down, change tempo and add a metronome click.', to: '/song/midnight-lanterns' },
  { icon: Mic, title: 'Guitar tuner', text: 'Real-time pitch detection with your microphone, plus reference tones.', to: '/tools?tool=tuner' },
  { icon: Timer, title: 'Metronome', text: 'Adjustable BPM, time signatures, accents and a visual beat.', to: '/tools?tool=metronome' },
  { icon: Grid3x3, title: 'Chord library', text: 'Every root and quality with open and movable barre shapes.', to: '/tools?tool=chords' },
  { icon: ArrowUpDown, title: 'Transposer', text: 'Shift a progression to any key with correct sharps and flats.', to: '/tools?tool=transpose' },
]

function Features() {
  return (
    <section className="container-page mt-28" aria-labelledby="features-title">
      <SectionHeading id="features-title" eyebrow="Your studio" title="Everything you need to play" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.05}>
            <Link to={f.to} className="card group flex h-full gap-4 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-electric/60">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-electric/35 to-elevated text-lilac transition-shadow duration-300 group-hover:shadow-[0_0_24px_-4px_rgb(139_92_246)]">
                <f.icon className="size-5" aria-hidden="true" />
              </span>
              <span>
                <span className="flex items-center gap-1 font-semibold">
                  {f.title} <ArrowRight className="size-4 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" aria-hidden="true" />
                </span>
                <span className="mt-1 block text-sm text-muted">{f.text}</span>
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function ChordShowcase() {
  const chords = ['G', 'D', 'Em', 'C']
  const [active, setActive] = useState(0)
  return (
    <section className="container-page mt-28" aria-labelledby="showcase-title">
      <div className="card relative overflow-hidden p-6 sm:p-10">
        <div aria-hidden="true" className="absolute -top-24 -right-24 size-80 rounded-full bg-[radial-gradient(circle,rgb(139_92_246/0.3),transparent_65%)]" />
        <div className="relative grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Learn by playing</p>
            <h2 id="showcase-title" className="mt-2 text-3xl font-bold tracking-tight">
              Four chords. <span className="text-gradient">Endless songs.</span>
            </h2>
            <p className="mt-4 text-muted">
              Tap a chord to see its fingering. Open any song to read lyrics with chords aligned above them, switch keys instantly and practise along with the synthesised player.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/song/midnight-lanterns" className="btn-primary">
                Open a song sheet <ArrowRight className="size-4" />
              </Link>
              <Link to="/tools?tool=chords" className="btn-ghost">
                Browse chord library
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-wrap justify-center gap-3">
            {chords.map((c, i) => (
              <ChordDiagram key={c} name={c} active={i === active} onClick={() => setActive(i)} size={112} />
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function LearningHighlights() {
  const { completed, steps } = useStore()
  const picks = LESSONS.filter((l) => ['first-chords', 'pop-progression', 'reading-tabs'].includes(l.id))
  return (
    <section className="container-page mt-28" aria-labelledby="learn-title">
      <SectionHeading
        id="learn-title"
        eyebrow="Learning paths"
        title="Start where you are"
        action={
          <Link to="/learn" className="btn-ghost">
            All lessons <ArrowRight className="size-4" />
          </Link>
        }
      />
      <div className="grid gap-5 md:grid-cols-3">
        {picks.map((l, i) => {
          const progress = (steps[l.id]?.length ?? 0) / l.steps.length
          return (
            <Reveal key={l.id} delay={i * 0.06}>
              <Link to={`/learn/${l.id}`} className="card group flex h-full flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:border-electric/60">
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-xl bg-elevated text-lavender">
                    <BookOpen className="size-5" aria-hidden="true" />
                  </span>
                  <DifficultyBadge level={l.difficulty} />
                </div>
                <p className="mt-5 text-xs font-semibold text-lavender">{l.category}</p>
                <h3 className="mt-1 text-lg font-semibold">{l.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted">{l.summary}</p>
                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-xs text-muted">
                    <span>{completed[l.id] ? 'Completed' : progress > 0 ? 'In progress' : `${l.minutes} min`}</span>
                    <span>{Math.round(progress * 100)}%</span>
                  </div>
                  <ProgressBar value={progress} />
                </div>
              </Link>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}

function CallToAction() {
  const { user } = useStore()
  return (
    <section className="container-page mt-28">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-lavender/20 bg-[linear-gradient(120deg,#3b2168,#2A1745_45%,#4c1d95)] px-6 py-14 text-center sm:px-12">
          <div aria-hidden="true" className="absolute inset-0 opacity-50">
            <SoundRibbon className="size-full" energy={0.6} />
          </div>
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Your practice, all in one place.</h2>
            <p className="mx-auto mt-3 max-w-lg text-lilac/90">Save favourites, track lessons and build a daily practice streak.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              {user ? (
                <Link to="/dashboard" className="btn-light">
                  Open your dashboard
                </Link>
              ) : (
                <>
                  <Link to="/signup" className="btn-light">
                    Create a free account
                  </Link>
                  <Link to="/dashboard" className="btn-outline">
                    Preview the dashboard
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

export default function Home() {
  const { songs, loading, error } = useSongs()
  return (
    <>
      <Hero songs={songs} />
      <Categories />
      <FeaturedSongs songs={songs} loading={loading} error={error} />
      <ChordShowcase />
      <Features />
      <LearningHighlights />
      <CallToAction />
    </>
  )
}
