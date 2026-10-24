import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Waveform from '../components/Waveform'

export default function NotFound() {
  return (
    <div className="container-page grid min-h-[70vh] place-items-center pt-28 text-center">
      <div>
        <motion.p initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-gradient text-8xl font-bold">
          404
        </motion.p>
        <Waveform active bars={24} className="mx-auto mt-4 h-10 justify-center" />
        <h1 className="mt-6 text-2xl font-semibold">This page is out of tune</h1>
        <p className="mt-2 text-muted">The page you’re looking for doesn’t exist or has moved.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/" className="btn-primary">
            Back home
          </Link>
          <Link to="/explore" className="btn-outline">
            Explore songs
          </Link>
        </div>
      </div>
    </div>
  )
}
