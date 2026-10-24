import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Play, Pause, Guitar, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import SongArt from './SongArt'
import { DifficultyBadge, fadeUp } from './ui'
import { useStore, useToast } from '../context/AppStore'
import { player, usePlayer } from '../lib/player'
import { parseSheet } from '../lib/sheet'
import { useMemo } from 'react'

export function FavouriteButton({ songId, title, className = '' }) {
  const { favourites, toggleFavourite } = useStore()
  const toast = useToast()
  const active = favourites.includes(songId)
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.82 }}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleFavourite(songId)
        toast(active ? `Removed “${title}” from favourites` : `Saved “${title}” to favourites`)
      }}
      aria-pressed={active}
      aria-label={active ? `Remove ${title} from favourites` : `Add ${title} to favourites`}
      className={`relative grid size-10 place-items-center rounded-full transition-colors ${active ? 'bg-electric/25 text-lilac' : 'bg-night/60 text-lavender hover:text-white'} ${className}`}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={active ? 'on' : 'off'}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        >
          <Heart className={`size-[18px] ${active ? 'fill-lavender text-lavender' : ''}`} />
        </motion.span>
      </AnimatePresence>
      {active && (
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border-2 border-lavender"
          initial={{ scale: 0.6, opacity: 0.9 }}
          animate={{ scale: 1.6, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      )}
    </motion.button>
  )
}

export default function SongCard({ song }) {
  const { song: current, playing } = usePlayer()
  const isCurrent = current?.id === song.id && playing
  const chords = useMemo(() => parseSheet(song.sheet).uniqueChords, [song.sheet])

  return (
    <motion.article variants={fadeUp} layout className="group relative">
      <div className="card relative flex h-full flex-col overflow-hidden transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-electric/70 group-hover:shadow-[0_24px_60px_-24px_rgb(139_92_246/0.65)]">
        <div className="relative aspect-[4/3] overflow-hidden">
          <SongArt song={song} className="size-full transition-transform duration-500 ease-out group-hover:scale-[1.07]" />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span className="badge border-lavender/30 bg-night/70 text-lilac backdrop-blur">{song.type}</span>
          </div>
          <FavouriteButton songId={song.id} title={song.title} className="absolute top-3 right-3 backdrop-blur" />
          <button
            type="button"
            onClick={() => player.toggle(song)}
            aria-label={isCurrent ? `Pause practice preview of ${song.title}` : `Play synthesised chord preview of ${song.title}`}
            className="absolute right-3 bottom-3 grid size-11 translate-y-2 place-items-center rounded-full bg-white text-night opacity-0 shadow-lg shadow-electric/40 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100"
          >
            {isCurrent ? <Pause className="size-5" /> : <Play className="size-5 translate-x-px" />}
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-4 pt-1">
          <div>
            <h3 className="truncate text-base font-semibold">
              <Link to={`/song/${song.id}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
                {song.title}
              </Link>
            </h3>
            <p className="truncate text-sm text-muted">{song.artist}</p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
            <DifficultyBadge level={song.difficulty} />
            <span className="badge border-line text-muted">
              <Guitar className="size-3" aria-hidden="true" /> {song.instrument}
            </span>
          </div>
          <p className="truncate font-mono text-xs text-lavender/90" title={chords.join(' ')}>
            {chords.slice(0, 6).join(' · ')}
            {chords.length > 6 && ' …'}
          </p>
          <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-lilac">
            {song.type === 'Tab' ? 'View Tab' : 'Learn Song'}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </div>
      </div>
    </motion.article>
  )
}

export function SongCardSkeleton() {
  return (
    <div className="card overflow-hidden" aria-hidden="true">
      <div className="skeleton aspect-[4/3] rounded-none" />
      <div className="space-y-3 p-4">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
        <div className="flex gap-2">
          <div className="skeleton h-5 w-20 rounded-full" />
          <div className="skeleton h-5 w-16 rounded-full" />
        </div>
        <div className="skeleton h-3 w-2/3" />
      </div>
    </div>
  )
}
