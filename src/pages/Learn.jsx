import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, CheckCircle2, ArrowRight, BookOpen, User } from 'lucide-react'
import { PageHeader, ProgressRing, ProgressBar, DifficultyBadge, fadeUp, stagger } from '../components/ui'
import { LESSONS, LESSON_CATEGORIES, nextLesson } from '../data/lessons'
import { useStore } from '../context/AppStore'

export default function Learn() {
  const { steps, completed } = useStore()
  const [cat, setCat] = useState('All')
  const list = useMemo(() => (cat === 'All' ? LESSONS : LESSONS.filter((l) => l.category === cat)), [cat])
  const doneCount = Object.keys(completed).length
  const next = nextLesson(steps, completed)

  return (
    <>
      <PageHeader eyebrow="Learn" title="Learn at" highlight="your pace">
        <p>Step-by-step lessons with chord demonstrations and practice exercises. Progress is saved in this browser.</p>
      </PageHeader>

      <div className="container-page">
        <div className="grid gap-5 md:grid-cols-[auto_1fr]">
          <div className="card flex items-center gap-5 p-5">
            <ProgressRing value={doneCount / LESSONS.length} size={92} label={`${doneCount} of ${LESSONS.length} lessons completed`}>
              <span className="text-lg font-bold">{doneCount}</span>
              <span className="text-[10px] text-muted">of {LESSONS.length}</span>
            </ProgressRing>
            <div>
              <p className="text-sm font-semibold">Lessons completed</p>
              <p className="text-xs text-muted">Complete every step to finish a lesson.</p>
            </div>
          </div>
          {next ? (
            <Link to={`/learn/${next.id}`} className="card group flex flex-wrap items-center gap-5 p-5 transition-all hover:border-electric/60">
              <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-electric/40 to-elevated text-lilac">
                <BookOpen className="size-6" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-lavender">Recommended next</p>
                <p className="truncate text-lg font-semibold">{next.title}</p>
                <ProgressBar value={(steps[next.id]?.length ?? 0) / next.steps.length} className="mt-2 max-w-sm" />
              </div>
              <span className="btn-primary">
                {(steps[next.id]?.length ?? 0) > 0 ? 'Continue' : 'Start'} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ) : (
            <div className="card flex items-center gap-3 p-5 text-success">
              <CheckCircle2 className="size-6" /> You’ve completed every lesson — great work!
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Lesson categories">
          {['All', ...LESSON_CATEGORIES].map((c) => (
            <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)} className={`chip ${cat === c ? 'chip-active' : ''}`}>
              {c}
            </button>
          ))}
        </div>

        <motion.div key={cat} variants={stagger} initial="hidden" animate="show" className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {list.map((l) => {
              const progress = (steps[l.id]?.length ?? 0) / l.steps.length
              const done = !!completed[l.id]
              return (
                <motion.div key={l.id} variants={fadeUp}>
                  <Link to={`/learn/${l.id}`} className="card group relative flex h-full flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:border-electric/60">
                    {done && (
                      <span className="absolute top-5 right-5 text-success" aria-label="Completed">
                        <CheckCircle2 className="size-6" />
                      </span>
                    )}
                    <p className="text-xs font-semibold text-lavender">{l.category}</p>
                    <h2 className="mt-1 pr-8 text-lg font-semibold">{l.title}</h2>
                    <p className="mt-2 flex-1 text-sm text-muted">{l.summary}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted">
                      <DifficultyBadge level={l.difficulty} />
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3.5" /> {l.minutes} min
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <User className="size-3.5" /> {l.author}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <ProgressBar value={progress} className="flex-1" />
                      <span className="w-9 text-right text-xs text-muted">{Math.round(progress * 100)}%</span>
                    </div>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-lilac">
                      {done ? 'Review lesson' : progress > 0 ? 'Continue lesson' : 'Start lesson'}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  )
}
