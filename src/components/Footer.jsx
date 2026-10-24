import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { Logo } from './ui'

const GROUPS = [
  {
    title: 'Discover',
    links: [
      ['/explore', 'Explore Songs'],
      ['/tabs', 'Guitar Tabs'],
      ['/explore?cat=beginner', 'Beginner Songs'],
      ['/explore?cat=recent', 'Recently Added'],
    ],
  },
  {
    title: 'Practise',
    links: [
      ['/learn', 'Lessons'],
      ['/tools?tool=tuner', 'Guitar Tuner'],
      ['/tools?tool=metronome', 'Metronome'],
      ['/tools?tool=chords', 'Chord Library'],
    ],
  },
  {
    title: 'Support',
    links: [
      ['/help', 'Help Centre'],
      ['/contact', 'Contact Us'],
      ['/privacy', 'Privacy Policy'],
      ['/terms', 'Terms of Service'],
    ],
  },
]

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-lavender/10 bg-night-2/60 pb-32 sm:pb-12">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-electric/60 to-transparent" />
      <div className="container-page grid gap-10 pt-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            A music-learning studio for discovering songs, reading tabs and chords, and practising with interactive tools.
          </p>
          <a href="mailto:hello@lavenderstrings.example" className="mt-4 inline-flex items-center gap-2 text-sm text-lavender hover:text-white">
            <Mail className="size-4" aria-hidden="true" /> hello@lavenderstrings.example
          </a>
        </div>
        {GROUPS.map((g) => (
          <nav key={g.title} aria-label={g.title}>
            <h2 className="text-sm font-semibold text-lilac">{g.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {g.links.map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-muted transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="container-page mt-12 flex flex-col gap-2 border-t border-line/50 pt-6 text-xs text-muted sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} Lavender Strings · Prototype build. Song catalogue and community posts are original demo content.</p>
        <p>Made for musicians, with lavender.</p>
      </div>
    </footer>
  )
}
