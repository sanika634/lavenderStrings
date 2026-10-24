import { useEffect, useState } from 'react'
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Heart, Menu, X, LayoutDashboard, LogOut } from 'lucide-react'
import { Logo } from './ui'
import SearchBox from './SearchBox'
import { useStore, useToast } from '../context/AppStore'

export const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/explore', label: 'Explore Songs' },
  { to: '/tabs', label: 'Guitar Tabs' },
  { to: '/learn', label: 'Learn' },
  { to: '/tools', label: 'Music Tools' },
  { to: '/community', label: 'Community' },
]

function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return scrolled
}

function Avatar({ name, className = '' }) {
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return <span className={`grid place-items-center rounded-full bg-gradient-to-br from-lavender to-electric font-bold text-night ${className}`}>{initials}</span>
}

function AccountMenu({ user }) {
  const [open, setOpen] = useState(false)
  const { signOut } = useStore()
  const toast = useToast()
  const navigate = useNavigate()
  return (
    <div className="relative" onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}>
      <button
        onClick={() => setOpen((o) => !o)}
        onBlur={(e) => !e.currentTarget.parentElement.contains(e.relatedTarget) && setOpen(false)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex min-h-11 items-center gap-2 rounded-full border border-line py-1 pr-3 pl-1 text-sm text-lilac hover:border-lavender/50"
      >
        <Avatar name={user.name} className="size-8 text-xs" />
        <span className="max-w-28 truncate">{user.name.split(' ')[0]}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="glass absolute right-0 mt-2 w-52 rounded-2xl p-1.5 shadow-2xl shadow-black/50"
          >
            <Link role="menuitem" to="/dashboard" onClick={() => setOpen(false)} className="flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm hover:bg-white/5">
              <LayoutDashboard className="size-4 text-lavender" /> Dashboard
            </Link>
            <button
              role="menuitem"
              onClick={() => {
                signOut()
                setOpen(false)
                toast('Signed out of the demo account')
                navigate('/')
              }}
              className="flex min-h-10 w-full items-center gap-2 rounded-xl px-3 text-sm hover:bg-white/5"
            >
              <LogOut className="size-4 text-lavender" /> Log out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Navbar() {
  const scrolled = useScrolled()
  const [drawer, setDrawer] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { favourites, user } = useStore()
  const location = useLocation()

  useEffect(() => {
    setDrawer(false)
    setSearchOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : ''
    const onKey = (e) => e.key === 'Escape' && (setDrawer(false), setSearchOpen(false))
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [drawer])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled || searchOpen ? 'border-b border-lavender/10 bg-night/80 shadow-[0_10px_40px_-20px_rgb(0_0_0/0.8)] backdrop-blur-xl' : 'border-b border-transparent bg-transparent'
        }`}
      >
        <nav aria-label="Main" className="container-page flex h-[72px] items-center gap-4">
          <Logo />
          <ul className="mx-auto hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.end} className="relative block px-3 py-2 text-sm font-medium transition-colors">
                  {({ isActive }) => (
                    <>
                      <span className={isActive ? 'text-white' : 'text-muted hover:text-lilac'}>{l.label}</span>
                      {isActive && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-lavender to-electric shadow-[0_0_12px_rgb(139_92_246)]"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="ml-auto flex items-center gap-1 lg:ml-0">
            <button onClick={() => setSearchOpen((o) => !o)} className="icon-btn" aria-label={searchOpen ? 'Close search' : 'Open search'} aria-expanded={searchOpen}>
              {searchOpen ? <X className="size-5" /> : <Search className="size-5 transition-transform hover:scale-110" />}
            </button>
            <Link to="/dashboard#favourites" className="icon-btn relative" aria-label={`Favourites (${favourites.length})`}>
              <Heart className="size-5 transition-transform hover:scale-110" />
              {favourites.length > 0 && (
                <motion.span
                  key={favourites.length}
                  initial={{ scale: 0.4 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1.5 right-1 grid min-w-4 place-items-center rounded-full bg-electric px-1 text-[10px] leading-4 font-bold text-white"
                >
                  {favourites.length}
                </motion.span>
              )}
            </Link>
            <div className="hidden items-center gap-2 pl-2 lg:flex">
              {user ? (
                <AccountMenu user={user} />
              ) : (
                <>
                  <Link to="/login" className="btn-ghost">
                    Log In
                  </Link>
                  <Link to="/signup" className="btn-primary">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
            <button onClick={() => setDrawer(true)} className="icon-btn lg:hidden" aria-label="Open menu" aria-expanded={drawer} aria-controls="mobile-drawer">
              <Menu className="size-6" />
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-visible"
            >
              <div className="container-page pb-4">
                <div className="mx-auto max-w-2xl">
                  <SearchBox variant="nav" autoFocus onNavigate={() => setSearchOpen(false)} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {drawer && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-night/70 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawer(false)}
            />
            <motion.aside
              id="mobile-drawer"
              aria-label="Mobile navigation"
              className="glass fixed inset-y-0 right-0 z-[61] flex w-[min(86vw,360px)] flex-col p-5 lg:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            >
              <div className="flex items-center justify-between">
                <Logo />
                <button onClick={() => setDrawer(false)} className="icon-btn" aria-label="Close menu">
                  <X className="size-6" />
                </button>
              </div>
              <div className="mt-6">
                <SearchBox variant="nav" onNavigate={() => setDrawer(false)} />
              </div>
              <ul className="mt-6 space-y-1">
                {NAV_LINKS.map((l, i) => (
                  <motion.li key={l.to} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.04 }}>
                    <NavLink
                      to={l.to}
                      end={l.end}
                      className={({ isActive }) =>
                        `flex min-h-12 items-center rounded-xl px-4 text-base font-medium ${isActive ? 'bg-electric/20 text-white ring-1 ring-electric/50' : 'text-muted hover:bg-white/5 hover:text-white'}`
                      }
                    >
                      {l.label}
                    </NavLink>
                  </motion.li>
                ))}
                <li>
                  <NavLink to="/dashboard" className={({ isActive }) => `flex min-h-12 items-center rounded-xl px-4 text-base font-medium ${isActive ? 'bg-electric/20 text-white' : 'text-muted hover:bg-white/5'}`}>
                    Dashboard
                  </NavLink>
                </li>
              </ul>
              <div className="mt-auto grid gap-2 pt-6">
                {user ? (
                  <p className="text-center text-sm text-muted">
                    Signed in as <span className="text-lilac">{user.name}</span> (demo)
                  </p>
                ) : (
                  <>
                    <Link to="/signup" className="btn-primary">
                      Sign Up
                    </Link>
                    <Link to="/login" className="btn-outline">
                      Log In
                    </Link>
                  </>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export { Avatar }
