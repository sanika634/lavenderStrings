import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Mail, Send } from 'lucide-react'
import { PageHeader } from '../components/ui'

const CONTACT_EMAIL = 'hello@lavenderstrings.example'

const FAQ = [
  ['Is the song catalogue real?', 'No. Every song, artist and lyric in this prototype is original demo material written for Lavender Strings, so you can try every feature without licensing concerns.'],
  ['What does the play button play?', 'A practice preview synthesised in your browser from the chord chart (Web Audio). It is not the original recording of any song.'],
  ['Where is my progress saved?', 'In your browser’s local storage. Clearing site data removes it, and it does not sync between devices.'],
  ['Why does the tuner need my microphone?', 'To detect the pitch of the string you play. Audio is analysed locally in real time and never uploaded. If you decline, use the reference tones instead.'],
  ['How do I transpose a song?', 'Open any song and use the − / + buttons in the toolbar, or use Music Tools → Transpose for your own chord lists.'],
  ['Can I make the tab text bigger?', 'Yes — use the text size buttons in the song toolbar. Your preference is remembered.'],
]

function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <div className="space-y-3">
      {FAQ.map(([q, a], i) => (
        <div key={q} className="card overflow-hidden">
          <h2>
            <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="flex min-h-14 w-full items-center justify-between gap-4 px-5 text-left font-semibold">
              {q}
              <ChevronDown className={`size-5 shrink-0 text-lavender transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`} />
            </button>
          </h2>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                <p className="px-5 pb-5 text-sm leading-relaxed text-muted">{a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const submit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.name.trim()) errs.name = 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) errs.email = 'Please enter a valid email.'
    if (form.message.trim().length < 10) errs.message = 'Message should be at least 10 characters.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    const body = `${form.message}\n\n— ${form.name} (${form.email})`
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Lavender Strings enquiry')}&body=${encodeURIComponent(body)}`
  }
  const field = (k, label, props = {}) => (
    <div>
      <label htmlFor={`c-${k}`} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {k === 'message' ? (
        <textarea id={`c-${k}`} rows={5} className="field py-3" value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} aria-invalid={!!errors[k]} />
      ) : (
        <input id={`c-${k}`} className="field" value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} aria-invalid={!!errors[k]} {...props} />
      )}
      {errors[k] && <p className="mt-1 text-xs text-warning">{errors[k]}</p>}
    </div>
  )
  return (
    <form onSubmit={submit} noValidate className="card space-y-4 p-6">
      {field('name', 'Name', { autoComplete: 'name' })}
      {field('email', 'Email', { type: 'email', autoComplete: 'email' })}
      {field('message', 'Message')}
      <button className="btn-primary">
        <Send className="size-4" /> Open in email app
      </button>
      <p className="text-xs text-muted">This prototype has no server — submitting opens your email app with the message ready to send.</p>
    </form>
  )
}

const PAGES = {
  help: { eyebrow: 'Help Centre', title: 'How can we', highlight: 'help?', body: <Faq /> },
  contact: {
    eyebrow: 'Contact',
    title: 'Get in',
    highlight: 'touch',
    body: (
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <ContactForm />
        <div className="card h-fit p-6">
          <Mail className="size-6 text-lavender" />
          <p className="mt-3 font-semibold">Email us directly</p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm text-lavender hover:text-white">
            {CONTACT_EMAIL}
          </a>
          <p className="mt-4 text-sm text-muted">
            Looking for quick answers? Visit the{' '}
            <Link to="/help" className="text-lavender hover:text-white">
              Help Centre
            </Link>
            .
          </p>
        </div>
      </div>
    ),
  },
  privacy: {
    eyebrow: 'Legal',
    title: 'Privacy',
    highlight: 'Policy',
    sections: [
      ['What this prototype stores', 'Favourites, recently viewed songs, lesson progress, practice days, display preferences, the demo account name and email, and posts you write are saved in your browser’s local storage. Nothing is sent to a server.'],
      ['Passwords', 'Passwords entered on the Log In and Sign Up forms are checked for format only. They are never stored or transmitted.'],
      ['Microphone', 'The tuner analyses microphone audio locally in real time. Audio is not recorded or uploaded, and access stops when you stop the tuner or leave the page.'],
      ['Clearing your data', 'Use “Reset local progress” on the Dashboard, or clear this site’s data in your browser settings.'],
      ['Third parties', 'Fonts are loaded from Google Fonts. No analytics or advertising trackers are included in this prototype.'],
    ],
  },
  terms: {
    eyebrow: 'Legal',
    title: 'Terms of',
    highlight: 'Service',
    sections: [
      ['Prototype status', 'Lavender Strings is a demonstration build. Features may change, and stored data may be reset without notice.'],
      ['Content', 'The song catalogue, lessons and sample community posts are original demo material. Do not upload or post copyrighted material you do not have rights to share.'],
      ['Acceptable use', 'Be respectful in community spaces. Harassment, spam and impersonation are not allowed.'],
      ['No warranty', 'The service is provided “as is”, without warranties of any kind, including the accuracy of tuner readings or musical content.'],
    ],
  },
}

export default function Info({ page }) {
  const p = PAGES[page]
  return (
    <>
      <PageHeader eyebrow={p.eyebrow} title={p.title} highlight={p.highlight}>
        {p.sections && <p>Last updated 24 October 2026.</p>}
      </PageHeader>
      <div className="container-page max-w-4xl">
        {p.body ??
          p.sections.map(([h, t], i) => (
            <motion.section key={h} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} className="border-b border-line/50 py-6">
              <h2 className="text-lg font-semibold text-lilac">{h}</h2>
              <p className="mt-2 leading-relaxed text-muted">{t}</p>
            </motion.section>
          ))}
      </div>
    </>
  )
}
