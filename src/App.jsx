import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MiniPlayer from './components/MiniPlayer'
import Home from './pages/Home'

const Explore = lazy(() => import('./pages/Explore'))
const Tabs = lazy(() => import('./pages/Tabs'))
const SongDetail = lazy(() => import('./pages/SongDetail'))
const Learn = lazy(() => import('./pages/Learn'))
const Lesson = lazy(() => import('./pages/Lesson'))
const Tools = lazy(() => import('./pages/Tools'))
const Community = lazy(() => import('./pages/Community'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Auth = lazy(() => import('./pages/Auth'))
const Info = lazy(() => import('./pages/Info'))
const NotFound = lazy(() => import('./pages/NotFound'))

function PageFallback() {
  return (
    <div className="container-page pt-36" aria-busy="true" aria-label="Loading page">
      <div className="skeleton h-4 w-32" />
      <div className="skeleton mt-4 h-10 w-2/3 max-w-xl" />
      <div className="skeleton mt-4 h-4 w-1/2 max-w-md" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="skeleton h-64 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 450)
      return () => clearTimeout(t)
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
}

export default function App() {
  const location = useLocation()
  return (
    <div className="relative flex min-h-dvh flex-col">
      <a href="#main" className="sr-only z-[100] rounded-full bg-white px-4 py-2 text-night focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Skip to content
      </a>
      <Navbar />
      <ScrollManager />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          id="main"
          key={location.pathname}
          className="flex-1"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <Suspense fallback={<PageFallback />}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/tabs" element={<Tabs />} />
              <Route path="/song/:id" element={<SongDetail />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/learn/:id" element={<Lesson />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/community" element={<Community />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Auth mode="login" />} />
              <Route path="/signup" element={<Auth mode="signup" />} />
              <Route path="/help" element={<Info page="help" />} />
              <Route path="/contact" element={<Info page="contact" />} />
              <Route path="/privacy" element={<Info page="privacy" />} />
              <Route path="/terms" element={<Info page="terms" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </motion.main>
      </AnimatePresence>
      <Footer />
      <MiniPlayer />
    </div>
  )
}
