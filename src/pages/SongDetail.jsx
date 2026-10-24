import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play, Pause, Minus, Plus, RotateCcw, Type, Eye, EyeOff, ScrollText, Music2, Guitar, Piano, ArrowLeft, Info, SearchX, LayoutGrid,
} from 'lucide-react'
import { useSongs } from '../lib/useSongs'
import { parseSheet } from '../lib/sheet'
import { transposeChord, transposeKey, chordShapes, chordNotes } from '../lib/music'
import { player, usePlayer, BEATS } from '../lib/player'
import { useStore } from '../context/AppStore'
import SongArt from '../components/SongArt'
import SongCard, { FavouriteButton } from '../components/SongCard'
import ChordDiagram from '../components/ChordDiagram'
import PianoChord from '../components/PianoChord'
import { PlayerControls, ProgressScrubber } from '../components/MiniPlayer'
import { DifficultyBadge, DemoBadge, EmptyState, Segmented, stagger } from '../components/ui'

function ChordLabel({ name, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative inline-block rounded px-0.5 font-mono font-bold transition-colors duration-300 ${active ? 'text-white' : 'text-lavender hover:text-lilac'}`}
      aria-label={`Chord ${name}, jump playback here`}
    >
      {active && <motion.span layoutId="active-chord" className="absolute -inset-x-1 -inset-y-0.5 -z-0 rounded-md bg-electric/40 shadow-[0_0_18px_rgb(139_92_246/0.8)]" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={name} className="relative inline-block" initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} transition={{ duration: 0.22 }}>
          {name}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

function Sheet({ sections, t, currentBar, showChords, fontSize, onChord, activeLineRef }) {
  return (
    <div className="space-y-8" style={{ fontSize }}>
      {sections.map((sec, si) => {
        const activeSection = currentBar >= sec.start && currentBar < sec.end
        return (
          <section key={si} aria-label={sec.name} className={`relative border-l-2 pl-4 transition-colors duration-300 sm:pl-6 ${activeSection ? 'border-electric' : 'border-transparent'}`}>
            {activeSection && <motion.span layoutId="section-glow" aria-hidden="true" className="absolute top-0 -left-[3px] h-full w-1 rounded-full bg-electric shadow-[0_0_14px_rgb(139_92_246)]" />}
            <h3 className="mb-3 text-[0.75em] font-semibold tracking-[0.2em] text-lavender/80 uppercase">[{sec.name}]</h3>
            <div className="space-y-2">
              {sec.lines.map((line, li) => {
                if (line.type === 'space') return <div key={li} className="h-3" />
                if (line.type === 'tab')
                  return (
                    <pre key={li} className="overflow-x-auto rounded-xl border border-line/50 bg-night/60 p-3 font-mono text-[0.85em] leading-[1.45] text-lilac">
                      {line.rows.join('\n')}
                    </pre>
                  )
                const hasActive = (line.type === 'bars' ? line.chords : line.segments).some((s) => s.index === currentBar)
                if (line.type === 'bars')
                  return (
                    <div key={li} ref={hasActive ? activeLineRef : null} className="flex flex-wrap gap-1.5 font-mono">
                      {line.chords.map((c) => (
                        <span key={c.index} className="inline-flex min-w-16 items-center justify-center rounded-lg border border-line/60 bg-night/40 px-3 py-1.5">
                          <ChordLabel name={t(c.chord)} active={c.index === currentBar} onClick={() => onChord(c.index)} />
                        </span>
                      ))}
                    </div>
                  )
                return (
                  <div key={li} ref={hasActive ? activeLineRef : null} className="flex flex-wrap items-end leading-snug">
                    {line.segments.map((s, i) => (
                      <span key={i} className="inline-flex flex-col">
                        {showChords && <span className="h-[1.5em] text-[0.92em]">{s.chord ? <ChordLabel name={t(s.chord)} active={s.index === currentBar} onClick={() => onChord(s.index)} /> : ' '}</span>}
                        <span className="whitespace-pre text-white/95">{s.text || ' '}</span>
                      </span>
                    ))}
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}

function ToolbarGroup({ label, children }) {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <span className="hidden text-xs font-semibold text-muted xl:inline">{label}</span>
      {children}
    </div>
  )
}

function useAutoScroll(enabled, speed) {
  useEffect(() => {
    if (!enabled) return
    let raf
    let last = performance.now()
    let carry = 0
    const step = (now) => {
      carry += ((now - last) / 1000) * speed
      last = now
      if (carry >= 1) {
        window.scrollBy(0, Math.floor(carry))
        carry -= Math.floor(carry)
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [enabled, speed])
}

export default function SongDetail() {
  const { id } = useParams()
  const { songs, loading } = useSongs()
  const song = songs.find((s) => s.id === id)

  if (loading)
    return (
      <div className="container-page pt-36" aria-busy="true">
        <div className="flex gap-6">
          <div className="skeleton size-32 rounded-2xl" />
          <div className="flex-1 space-y-3">
            <div className="skeleton h-8 w-1/2" />
            <div className="skeleton h-4 w-1/3" />
          </div>
        </div>
        <div className="skeleton mt-10 h-96 rounded-2xl" />
      </div>
    )
  if (!song)
    return (
      <div className="container-page pt-36">
        <EmptyState icon={SearchX} title="Song not found" action={<Link to="/explore" className="btn-primary">Browse songs</Link>}>
          This song isn’t in the catalogue. It may have been removed or the link is incorrect.
        </EmptyState>
      </div>
    )
  return <SongView key={song.id} song={song} songs={songs} />
}

function SongView({ song, songs }) {
  const { recordView, prefs, setPref } = useStore()
  const p = usePlayer()
  const [semis, setSemis] = useState(0)
  const [instrument, setInstrument] = useState('Guitar')
  const [voicings, setVoicings] = useState({})
  const [autoScroll, setAutoScroll] = useState(false)
  const [scrollSpeed, setScrollSpeed] = useState(20)
  const [follow, setFollow] = useState(true)
  const activeLineRef = useRef(null)

  const parsed = useMemo(() => parseSheet(song.sheet), [song.sheet])
  const { key, preferFlats } = transposeKey(song.key, semis)
  const t = (c) => transposeChord(c, semis, preferFlats)
  const isThis = p.song?.id === song.id
  const currentBar = isThis ? Math.floor(p.beat / BEATS) : -1
  const currentChord = currentBar >= 0 ? t(parsed.progression[currentBar] ?? '') : null

  useEffect(() => {
    recordView(song.id)
    if (!player.getState().playing) player.load(song, { transpose: 0, preferFlats: transposeKey(song.key, 0).preferFlats })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song.id])

  useEffect(() => {
    if (isThis) player.setTranspose(semis, preferFlats)
  }, [semis, preferFlats, isThis])

  // Follow playback: keep the active line comfortably in view.
  useEffect(() => {
    if (!follow || !isThis || !p.playing || !activeLineRef.current) return
    const r = activeLineRef.current.getBoundingClientRect()
    if (r.top < 160 || r.bottom > window.innerHeight - 180) activeLineRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [currentBar, follow, isThis, p.playing])

  useAutoScroll(autoScroll && !(isThis && p.playing && follow), scrollSpeed)

  const jumpTo = (bar) => {
    if (!isThis) player.load(song, { transpose: semis, preferFlats })
    player.seekBar(bar)
  }
  const fontSize = prefs.fontSize
  const related = songs.filter((s) => s.id !== song.id && (s.genre === song.genre || s.categories.some((c) => song.categories.includes(c)))).slice(0, 4)
  const byArtist = songs.filter((s) => s.id !== song.id && s.artist === song.artist)

  return (
    <article>
      {/* Header */}
      <header className="relative overflow-hidden pt-28 pb-8 sm:pt-32">
        <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-40 blur-3xl">
          <SongArt song={song} className="size-full" />
        </div>
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-night/40 via-night/80 to-night" />
        <div className="container-page">
          <Link to="/explore" className="inline-flex items-center gap-1 text-sm text-muted hover:text-white">
            <ArrowLeft className="size-4" /> Back to songs
          </Link>
          <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-end">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="size-36 shrink-0 overflow-hidden rounded-3xl shadow-[0_20px_60px_-15px_rgb(139_92_246/0.7)] ring-1 ring-lavender/20 sm:size-44">
              <SongArt song={song} className="size-full" />
            </motion.div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-2">
                <DifficultyBadge level={song.difficulty} />
                <span className="badge border-lavender/30 text-lilac">{song.type === 'Tab' ? 'Guitar Tab' : 'Chords'}</span>
                <span className="badge border-line text-muted">
                  <Guitar className="size-3" /> {song.instrument}
                </span>
                <DemoBadge>Original demo song</DemoBadge>
              </div>
              <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
                {song.title}
              </motion.h1>
              <p className="mt-1 text-lg text-muted">{song.artist}</p>
            </div>
            <div className="flex items-center gap-2">
              <FavouriteButton songId={song.id} title={song.title} className="size-12 border border-line" />
              <button onClick={() => player.toggle(song)} className="btn-primary h-12 px-6">
                {isThis && p.playing ? <Pause className="size-5" /> : <Play className="size-5" />}
                {isThis && p.playing ? 'Pause' : 'Practice preview'}
              </button>
            </div>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              ['Key', semis ? `${key} (orig. ${song.key})` : key],
              ['Tuning', song.tuning],
              ['Capo', song.capo ? `Fret ${song.capo}` : 'No capo'],
              ['Arrangement', song.type === 'Tab' ? 'Tab + chords' : 'Chords & lyrics'],
              ['Tempo', `${song.bpm} BPM`],
              ['Strumming', song.strumming],
            ].map(([k, v]) => (
              <div key={k} className="glass rounded-xl px-4 py-3">
                <dt className="text-[11px] font-semibold tracking-wider text-muted uppercase">{k}</dt>
                <dd className="mt-0.5 truncate text-sm font-semibold text-lilac" title={v}>
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      {/* Toolbar */}
      <div className="sticky top-[72px] z-30 border-y border-lavender/10 bg-night/85 backdrop-blur-xl">
        <div className="container-page flex items-center gap-x-5 overflow-x-auto py-2.5 [scrollbar-width:none] lg:flex-wrap">
          <button
            onClick={() => player.toggle(song)}
            className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-lavender to-electric text-night shadow-[0_0_20px_-4px_rgb(139_92_246)]"
            aria-label={isThis && p.playing ? 'Pause practice preview' : 'Play practice preview'}
          >
            {isThis && p.playing ? <Pause className="size-4 fill-night" /> : <Play className="size-4 translate-x-px fill-night" />}
          </button>
          <ToolbarGroup label="Transpose">
            <button className="icon-btn size-9 bg-night-2" onClick={() => setSemis((s) => Math.max(-11, s - 1))} aria-label="Transpose down a semitone">
              <Minus className="size-4" />
            </button>
            <span className="min-w-16 text-center font-mono text-sm" aria-live="polite" aria-label={`Key ${key}, ${semis} semitones`}>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span key={key} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 8, opacity: 0 }} className="inline-block font-bold text-white">
                  {key}
                </motion.span>
              </AnimatePresence>{' '}
              <span className="text-muted">{semis > 0 ? `+${semis}` : semis}</span>
            </span>
            <button className="icon-btn size-9 bg-night-2" onClick={() => setSemis((s) => Math.min(11, s + 1))} aria-label="Transpose up a semitone">
              <Plus className="size-4" />
            </button>
            <button className="icon-btn size-9" onClick={() => setSemis(0)} disabled={!semis} aria-label="Reset to original key">
              <RotateCcw className="size-4" />
            </button>
          </ToolbarGroup>
          <ToolbarGroup label="Text">
            <button className="icon-btn size-9 bg-night-2" onClick={() => setPref('fontSize', Math.max(12, fontSize - 1))} aria-label="Smaller text">
              <Type className="size-3" />
            </button>
            <span className="w-8 text-center font-mono text-xs text-muted">{fontSize}</span>
            <button className="icon-btn size-9 bg-night-2" onClick={() => setPref('fontSize', Math.min(26, fontSize + 1))} aria-label="Larger text">
              <Type className="size-5" />
            </button>
          </ToolbarGroup>
          <button onClick={() => setPref('showChords', !prefs.showChords)} aria-pressed={prefs.showChords} className={`chip shrink-0 ${prefs.showChords ? 'chip-active' : ''}`}>
            {prefs.showChords ? <Eye className="size-4" /> : <EyeOff className="size-4" />} Chords
          </button>
          <button onClick={() => setPref('showDiagrams', !prefs.showDiagrams)} aria-pressed={prefs.showDiagrams} className={`chip shrink-0 ${prefs.showDiagrams ? 'chip-active' : ''}`}>
            <LayoutGrid className="size-4" /> Diagrams
          </button>
          <div className="flex shrink-0 items-center gap-2">
            <button onClick={() => setAutoScroll((a) => !a)} aria-pressed={autoScroll} className={`chip ${autoScroll ? 'chip-active' : ''}`}>
              <ScrollText className="size-4" /> Auto-scroll
            </button>
            {autoScroll && (
              <label className="flex items-center gap-2 text-xs text-muted">
                <span className="sr-only">Auto-scroll speed</span>
                <input type="range" min="5" max="80" value={scrollSpeed} onChange={(e) => setScrollSpeed(+e.target.value)} className="w-24" />
              </label>
            )}
          </div>
          <label className="ml-auto flex shrink-0 items-center gap-2 text-xs whitespace-nowrap text-muted">
            <input type="checkbox" checked={follow} onChange={(e) => setFollow(e.target.checked)} className="size-4 accent-electric" /> Follow playback
          </label>
        </div>
      </div>

      <div className="container-page mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Sheet */}
        <div className="min-w-0">
          {semis !== 0 && parsed.sections.some((s) => s.lines.some((l) => l.type === 'tab')) && (
            <p className="mb-4 flex items-center gap-2 rounded-xl border border-warning/30 bg-warning/10 px-4 py-2 text-sm text-warning">
              <Info className="size-4 shrink-0" /> Chord names are transposed; tablature is shown at its original pitch.
            </p>
          )}
          <div className="card p-5 sm:p-8">
            <Sheet sections={parsed.sections} t={t} currentBar={currentBar} showChords={prefs.showChords} fontSize={fontSize} onChord={jumpTo} activeLineRef={activeLineRef} />
          </div>

          {/* Practice panel */}
          <section className="card mt-6 p-5 sm:p-6" aria-labelledby="practice-title">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 id="practice-title" className="flex items-center gap-2 font-semibold">
                <Music2 className="size-5 text-lavender" /> Practice controls
              </h2>
              <span className="text-xs text-muted">Synthesised chord playback · not the original recording</span>
            </div>
            {isThis ? (
              <>
                <div className="mb-5 flex items-center gap-4">
                  <button onClick={() => player.toggle(song)} className="grid size-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-lavender to-electric text-night shadow-[0_0_24px_-4px_rgb(139_92_246)]" aria-label={p.playing ? 'Pause' : 'Play'}>
                    {p.playing ? <Pause className="size-5 fill-night" /> : <Play className="size-5 translate-x-px fill-night" />}
                  </button>
                  <div className="flex-1">
                    <ProgressScrubber />
                  </div>
                </div>
                <PlayerControls />
              </>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-night-2/70 p-4 text-sm text-muted">
                <span>The practice player is currently loaded with “{p.song?.title}”.</span>
                <button className="btn-primary" onClick={() => player.load(song, { transpose: semis, preferFlats })}>
                  Load this song
                </button>
              </div>
            )}
          </section>
        </div>

        {/* Sidebar: chord diagrams */}
        <aside className="space-y-6 lg:sticky lg:top-40 lg:self-start">
          {prefs.showDiagrams && (
            <section className="card p-5" aria-labelledby="chords-title">
              <div className="mb-4 flex items-center justify-between gap-2">
                <h2 id="chords-title" className="font-semibold">
                  Chords used
                </h2>
                <Segmented options={[{ value: 'Guitar', label: <Guitar className="size-4" aria-label="Guitar" /> }, { value: 'Piano', label: <Piano className="size-4" aria-label="Piano" /> }]} value={instrument} onChange={setInstrument} label="Diagram instrument" layoutId="instr" />
              </div>
              <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
                {parsed.uniqueChords.map((orig) => {
                  const name = t(orig)
                  const shapes = chordShapes(name)
                  const vi = (voicings[name] ?? 0) % Math.max(1, shapes.length)
                  return (
                    <div key={orig} className="flex flex-col items-center gap-1">
                      {instrument === 'Guitar' ? (
                        <ChordDiagram
                          name={name}
                          shape={shapes[vi]}
                          active={name === currentChord}
                          size={128}
                          onClick={shapes.length > 1 ? () => setVoicings((v) => ({ ...v, [name]: vi + 1 })) : undefined}
                        />
                      ) : (
                        <PianoChord name={name} active={name === currentChord} size={128} />
                      )}
                      <span className="text-center text-[11px] text-muted">
                        {instrument === 'Guitar' ? (shapes.length > 1 ? `${shapes[vi].label} · tap for ${vi + 1}/${shapes.length}` : shapes[0]?.label) : chordNotes(name, preferFlats).join(' · ')}
                      </span>
                    </div>
                  )
                })}
              </motion.div>
            </section>
          )}
          {byArtist.length > 0 && (
            <section className="card p-5">
              <h2 className="font-semibold">More from {song.artist}</h2>
              <ul className="mt-3 space-y-1">
                {byArtist.map((s) => (
                  <li key={s.id}>
                    <Link to={`/song/${s.id}`} className="flex min-h-11 items-center justify-between rounded-lg px-2 text-sm hover:bg-white/5">
                      {s.title} <span className="text-xs text-muted">{s.type}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>

      {related.length > 0 && (
        <section className="container-page mt-16" aria-labelledby="related-title">
          <h2 id="related-title" className="mb-6 text-2xl font-bold">
            Related songs
          </h2>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((s) => (
              <SongCard key={s.id} song={s} />
            ))}
          </motion.div>
        </section>
      )}
    </article>
  )
}
