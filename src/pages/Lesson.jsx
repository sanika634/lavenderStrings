import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Clock, Target, Volume2, Timer, Trophy, SearchX } from 'lucide-react'
import { getLesson, LESSONS, nextLesson } from '../data/lessons'
import { useStore, useToast } from '../context/AppStore'
import { ProgressBar, DifficultyBadge, EmptyState } from '../components/ui'
import ChordDiagram from '../components/ChordDiagram'
import { getAudioContext, strum } from '../lib/audio'

function Celebration() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 18 }, (_, i) => {
        const angle = (i / 18) * Math.PI * 2
        return (
          <motion.span
            key={i}
            className="absolute top-1/2 left-1/2 size-2 rounded-full"
            style={{ background: i % 3 ? '#C4B5FD' : '#86EFAC' }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: Math.cos(angle) * 140, y: Math.sin(angle) * 90, opacity: 0, scale: 0.4 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
          />
        )
      })}
    </div>
  )
}

function hear(chord) {
  try {
    const ac = getAudioContext()
    strum(ac, ac.destination, chord, ac.currentTime + 0.02)
  } catch {
    /* Web Audio unavailable */
  }
}

export default function Lesson() {
  const { id } = useParams()
  const lesson = getLesson(id)
  const { steps, completed, toggleStep } = useStore()
  const toast = useToast()
  const [index, setIndex] = useState(() => {
    const done = new Set(steps[id] ?? [])
    const firstOpen = lesson?.steps.findIndex((_, i) => !done.has(i)) ?? 0
    return firstOpen < 0 ? 0 : firstOpen
  })
  const [dir, setDir] = useState(1)

  if (!lesson)
    return (
      <div className="container-page pt-36">
        <EmptyState icon={SearchX} title="Lesson not found" action={<Link to="/learn" className="btn-primary">All lessons</Link>} />
      </div>
    )

  const done = new Set(steps[lesson.id] ?? [])
  const step = lesson.steps[index]
  const isDone = done.has(index)
  const finished = !!completed[lesson.id]
  const go = (i) => {
    setDir(i > index ? 1 : -1)
    setIndex(i)
  }
  const recommended = nextLesson(steps, { ...completed, [lesson.id]: true })

  const markStep = () => {
    toggleStep(lesson.id, index, lesson.steps.length)
    if (!isDone && done.size + 1 === lesson.steps.length) toast('Lesson complete! 🎉')
    else if (!isDone && index < lesson.steps.length - 1) go(index + 1)
  }

  return (
    <div className="container-page pt-28 sm:pt-32">
      <Link to="/learn" className="inline-flex items-center gap-1 text-sm text-muted hover:text-white">
        <ArrowLeft className="size-4" /> All lessons
      </Link>
      <header className="mt-4">
        <p className="eyebrow">{lesson.category}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{lesson.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted">
          <DifficultyBadge level={lesson.difficulty} />
          <span className="inline-flex items-center gap-1">
            <Clock className="size-4" /> {lesson.minutes} min
          </span>
          <span>by {lesson.author}</span>
        </div>
        <div className="mt-5 flex max-w-lg items-center gap-3">
          <ProgressBar value={done.size / lesson.steps.length} className="flex-1" />
          <span className="text-xs text-muted">
            {done.size}/{lesson.steps.length} steps
          </span>
        </div>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        <nav aria-label="Lesson steps" className="card h-fit p-2">
          <ol>
            {lesson.steps.map((s, i) => (
              <li key={i}>
                <button
                  onClick={() => go(i)}
                  aria-current={i === index ? 'step' : undefined}
                  className={`flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-left text-sm transition-colors ${i === index ? 'bg-electric/20 text-white' : 'text-muted hover:bg-white/5'}`}
                >
                  <span className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold ${done.has(i) ? 'bg-success text-night' : i === index ? 'bg-electric text-white' : 'bg-elevated'}`}>
                    {done.has(i) ? <Check className="size-4" /> : i + 1}
                  </span>
                  <span className="truncate">{s.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div className="min-w-0">
          <div className="card relative overflow-hidden p-6 sm:p-8">
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.div
                key={index}
                custom={dir}
                initial={{ opacity: 0, x: dir * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -40 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-xs font-semibold text-lavender">
                  Step {index + 1} of {lesson.steps.length}
                </p>
                <h2 className="mt-1 text-2xl font-semibold">{step.title}</h2>
                {step.exercise && (
                  <span className="badge mt-3 border-warning/40 bg-warning/10 text-warning">
                    <Target className="size-3" /> Practice exercise
                  </span>
                )}
                <p className="mt-4 max-w-2xl leading-relaxed text-white/90">{step.body}</p>
                {step.chords && (
                  <div className="mt-6 flex flex-wrap gap-4">
                    {step.chords.map((c) => (
                      <div key={c} className="flex flex-col items-center gap-2">
                        <ChordDiagram name={c} size={120} />
                        <button onClick={() => hear(c)} className="btn-ghost min-h-9 px-3 text-xs">
                          <Volume2 className="size-4" /> Hear {c}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {step.exercise && (
                  <Link to="/tools?tool=metronome" className="btn-outline mt-6">
                    <Timer className="size-4" /> Open metronome
                  </Link>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line/50 pt-6">
              <button className="btn-ghost" onClick={() => go(index - 1)} disabled={index === 0}>
                <ArrowLeft className="size-4" /> Previous
              </button>
              <div className="flex gap-2">
                <motion.button whileTap={{ scale: 0.95 }} onClick={markStep} aria-pressed={isDone} className={isDone ? 'btn-outline border-success/50 text-success' : 'btn-primary'}>
                  {isDone ? <CheckCircle2 className="size-4" /> : <Check className="size-4" />}
                  {isDone ? 'Completed — undo' : 'Mark step complete'}
                </motion.button>
                {index < lesson.steps.length - 1 && (
                  <button className="btn-ghost" onClick={() => go(index + 1)}>
                    Next <ArrowRight className="size-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <AnimatePresence>
            {finished && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="card relative mt-6 overflow-hidden border-success/40 p-6">
                <Celebration />
                <div className="relative flex flex-wrap items-center gap-4">
                  <span className="grid size-12 place-items-center rounded-2xl bg-success/15 text-success">
                    <Trophy className="size-6" />
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold">Lesson complete</p>
                    <p className="text-sm text-muted">Saved to your dashboard on this device.</p>
                  </div>
                  {recommended && recommended.id !== lesson.id && (
                    <Link to={`/learn/${recommended.id}`} className="btn-primary">
                      Next: {recommended.title} <ArrowRight className="size-4" />
                    </Link>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-6 text-xs text-muted">
            Other lessons in {lesson.category}:{' '}
            {LESSONS.filter((l) => l.category === lesson.category && l.id !== lesson.id).map((l, i) => (
              <span key={l.id}>
                {i > 0 && ', '}
                <Link className="text-lavender hover:text-white" to={`/learn/${l.id}`}>
                  {l.title}
                </Link>
              </span>
            ))}
            {LESSONS.filter((l) => l.category === lesson.category && l.id !== lesson.id).length === 0 && 'none yet.'}
          </p>
        </div>
      </div>
    </div>
  )
}
