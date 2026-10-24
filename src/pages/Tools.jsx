import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Timer, Grid3x3, ArrowUpDown } from 'lucide-react'
import { PageHeader } from '../components/ui'
import Tuner from '../components/tools/Tuner'
import Metronome from '../components/tools/Metronome'
import ChordLibrary from '../components/tools/ChordLibrary'
import Transposer from '../components/tools/Transposer'
import { useStore } from '../context/AppStore'

export const TOOLS = [
  { id: 'tuner', label: 'Guitar Tuner', icon: Mic },
  { id: 'metronome', label: 'Metronome', icon: Timer },
  { id: 'chords', label: 'Chord Library', icon: Grid3x3 },
  { id: 'transpose', label: 'Transpose', icon: ArrowUpDown },
]

export default function Tools() {
  const [params, setParams] = useSearchParams()
  const tool = TOOLS.some((t) => t.id === params.get('tool')) ? params.get('tool') : 'tuner'
  const { recordTool } = useStore()

  useEffect(() => {
    recordTool(tool)
  }, [tool, recordTool])

  return (
    <>
      <PageHeader eyebrow="Music Tools" title="Your practice" highlight="toolkit">
        <p>Tune up, keep time, look up any chord and move songs into a key that suits your voice.</p>
      </PageHeader>
      <div className="container-page">
        <div role="tablist" aria-label="Music tools" className="glass mb-8 grid grid-cols-2 gap-1 rounded-2xl p-1.5 sm:inline-grid sm:grid-cols-4">
          {TOOLS.map((t) => {
            const active = t.id === tool
            return (
              <button
                key={t.id}
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={active}
                aria-controls="tool-panel"
                onClick={() => setParams({ tool: t.id }, { replace: true })}
                className={`relative flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors ${active ? 'text-white' : 'text-muted hover:text-white'}`}
              >
                {active && <motion.span layoutId="tool-tab" className="absolute inset-0 rounded-xl bg-electric/30 ring-1 ring-electric/60" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                <t.icon className="relative size-4" aria-hidden="true" />
                <span className="relative">{t.label}</span>
              </button>
            )
          })}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={tool}
            id="tool-panel"
            role="tabpanel"
            aria-labelledby={`tab-${tool}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28 }}
          >
            {tool === 'tuner' && <Tuner />}
            {tool === 'metronome' && <Metronome />}
            {tool === 'chords' && <ChordLibrary initial={params.get('chord')} />}
            {tool === 'transpose' && <Transposer />}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}
