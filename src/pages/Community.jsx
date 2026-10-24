import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ThumbsUp, Send, Trash2, X, MessageSquare, Info, Guitar } from 'lucide-react'
import { PageHeader, DemoBadge, EmptyState, fadeUp, stagger } from '../components/ui'
import { TOPICS, SAMPLE_POSTS, SAMPLE_PROFILES } from '../data/community'
import { useStore, useToast } from '../context/AppStore'

function Avatar({ name, hue = 270, size = 'size-10' }) {
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return (
    <span className={`${size} grid shrink-0 place-items-center rounded-full text-xs font-bold text-night`} style={{ background: `linear-gradient(135deg, hsl(${hue} 90% 85%), hsl(${hue} 70% 62%))` }}>
      {initials}
    </span>
  )
}

function ProfileDialog({ profile, onClose, postCount }) {
  return (
    <motion.div className="fixed inset-0 z-[80] grid place-items-center bg-night/70 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-name"
        initial={{ scale: 0.94, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 16 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        className="glass w-full max-w-sm rounded-3xl p-6"
      >
        <div className="flex items-start justify-between">
          <Avatar name={profile.name} hue={profile.hue} size="size-16" />
          <button autoFocus onClick={onClose} className="icon-btn" aria-label="Close profile">
            <X className="size-5" />
          </button>
        </div>
        <h2 id="profile-name" className="mt-4 text-xl font-semibold">
          {profile.name}
        </h2>
        <p className="text-sm text-muted">@{profile.handle}</p>
        <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-lavender">
          <Guitar className="size-4" /> {profile.instrument}
        </p>
        <p className="mt-3 text-sm text-white/90">{profile.bio}</p>
        <p className="mt-4 text-xs text-muted">{postCount} posts in this feed</p>
        {profile.sample ? <DemoBadge className="mt-4">Sample profile</DemoBadge> : <span className="badge mt-4 border-success/40 text-success">Your local profile</span>}
      </motion.div>
    </motion.div>
  )
}

function Composer() {
  const { user, addPost } = useStore()
  const toast = useToast()
  const [form, setForm] = useState({ title: '', body: '', topic: 'Discussions' })
  const [errors, setErrors] = useState({})

  if (!user)
    return (
      <div className="card flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <p className="font-semibold">Share with the community</p>
          <p className="text-sm text-muted">Log in to the demo account to write a post.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/login" className="btn-outline">
            Log In
          </Link>
          <Link to="/signup" className="btn-primary">
            Sign Up
          </Link>
        </div>
      </div>
    )

  const submit = (e) => {
    e.preventDefault()
    const errs = {}
    if (form.title.trim().length < 5) errs.title = 'Title must be at least 5 characters.'
    if (form.body.trim().length < 20) errs.body = 'Write at least 20 characters.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    addPost({ id: `local-${Date.now()}`, topic: form.topic, title: form.title.trim(), body: form.body.trim(), tags: [], date: new Date().toISOString().slice(0, 10), local: true })
    setForm({ title: '', body: '', topic: form.topic })
    toast('Post saved on this device')
  }

  return (
    <form onSubmit={submit} className="card space-y-3 p-5" noValidate>
      <div className="flex items-center gap-3">
        <Avatar name={user.name} />
        <p className="text-sm">
          Posting as <span className="font-semibold">{user.name}</span>
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
        <div>
          <label htmlFor="post-title" className="sr-only">
            Title
          </label>
          <input id="post-title" className="field" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} aria-invalid={!!errors.title} aria-describedby="post-title-err" />
          {errors.title && (
            <p id="post-title-err" className="mt-1 text-xs text-warning">
              {errors.title}
            </p>
          )}
        </div>
        <label>
          <span className="sr-only">Topic</span>
          <select className="select" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>
            {TOPICS.filter((t) => t !== 'All').map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label htmlFor="post-body" className="sr-only">
          Post
        </label>
        <textarea id="post-body" rows={3} className="field py-3" placeholder="Share a tip, an arrangement idea or a question…" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} aria-invalid={!!errors.body} aria-describedby="post-body-err" />
        {errors.body && (
          <p id="post-body-err" className="mt-1 text-xs text-warning">
            {errors.body}
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted">Prototype: posts are stored only in this browser and are not visible to anyone else.</p>
        <button className="btn-primary">
          <Send className="size-4" /> Post
        </button>
      </div>
    </form>
  )
}

export default function Community() {
  const { posts, likes, toggleLike, deletePost, user } = useStore()
  const [topic, setTopic] = useState('All')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('newest')
  const [profile, setProfile] = useState(null)

  const all = useMemo(() => {
    const local = posts.map((p) => ({ ...p, profile: { handle: 'you', name: user?.name ?? 'You', instrument: 'Your instrument', bio: 'Your local demo profile.', hue: 250 } }))
    const samples = SAMPLE_POSTS.map((p) => ({ ...p, sample: true, profile: { ...SAMPLE_PROFILES[p.author], sample: true } }))
    return [...local, ...samples]
  }, [posts, user])

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = all.filter((p) => (topic === 'All' || p.topic === topic) && (!q || `${p.title} ${p.body} ${p.tags.join(' ')}`.toLowerCase().includes(q)))
    const sorters = { newest: (a, b) => b.date.localeCompare(a.date), oldest: (a, b) => a.date.localeCompare(b.date), title: (a, b) => a.title.localeCompare(b.title) }
    return filtered.sort(sorters[sort])
  }, [all, topic, query, sort])

  return (
    <>
      <PageHeader eyebrow="Community" title="Learn" highlight="together">
        <p>Tips, arrangements, milestones and articles from musicians.</p>
      </PageHeader>
      <div className="container-page">
        <p className="mb-6 flex items-start gap-2 rounded-2xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">
          <Info className="mt-0.5 size-4 shrink-0" /> Prototype community: posts marked “Sample” are illustrative examples, not real members. Posts you write are saved only on this device.
        </p>
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div className="min-w-0 space-y-5">
            <Composer />
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative flex-1">
                <span className="sr-only">Search posts</span>
                <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-lavender" />
                <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search discussions…" className="field pl-10" />
              </label>
              <label>
                <span className="sr-only">Sort posts</span>
                <select className="select sm:w-44" value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="title">Title A–Z</option>
                </select>
              </label>
            </div>
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Topics">
              {TOPICS.map((t) => (
                <button key={t} role="tab" aria-selected={topic === t} onClick={() => setTopic(t)} className={`chip ${topic === t ? 'chip-active' : ''}`}>
                  {t}
                </button>
              ))}
            </div>

            {list.length === 0 ? (
              <EmptyState icon={MessageSquare} title="No posts here yet">
                Try another topic or search term{user ? ', or start the conversation above.' : '.'}
              </EmptyState>
            ) : (
              <motion.ul variants={stagger} initial="hidden" animate="show" className="space-y-4">
                <AnimatePresence initial={false}>
                  {list.map((p) => (
                    <motion.li key={p.id} variants={fadeUp} layout exit={{ opacity: 0, height: 0 }} className="card p-5 transition-colors duration-300 hover:border-lavender/40">
                      <div className="flex items-center gap-3">
                        <button onClick={() => setProfile(p.profile)} className="flex items-center gap-3 rounded-full text-left" aria-label={`View profile of ${p.profile.name}`}>
                          <Avatar name={p.profile.name} hue={p.profile.hue} />
                          <span>
                            <span className="block text-sm font-semibold hover:text-lilac">{p.profile.name}</span>
                            <span className="block text-xs text-muted">
                              {new Date(p.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </span>
                        </button>
                        <span className="ml-auto flex flex-wrap justify-end gap-1.5">
                          <span className="badge border-lavender/30 text-lavender">{p.topic}</span>
                          {p.sample ? <DemoBadge>Sample</DemoBadge> : <span className="badge border-success/40 text-success">Your post</span>}
                        </span>
                      </div>
                      <h2 className="mt-4 text-lg font-semibold">{p.title}</h2>
                      <p className="mt-2 text-sm leading-relaxed text-white/85">{p.body}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {p.tags.map((t) => (
                          <button key={t} onClick={() => setQuery(t)} className="text-xs text-lavender hover:text-white">
                            #{t}
                          </button>
                        ))}
                        <div className="ml-auto flex gap-1">
                          <motion.button whileTap={{ scale: 0.85 }} onClick={() => toggleLike(p.id)} aria-pressed={!!likes[p.id]} className={`btn-ghost min-h-9 px-3 text-xs ${likes[p.id] ? 'text-lilac' : ''}`}>
                            <ThumbsUp className={`size-4 ${likes[p.id] ? 'fill-lavender' : ''}`} /> {likes[p.id] ? 'Helpful' : 'Mark helpful'}
                          </motion.button>
                          {p.local && (
                            <button onClick={() => deletePost(p.id)} className="btn-ghost min-h-9 px-3 text-xs" aria-label="Delete post">
                              <Trash2 className="size-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
            )}
          </div>

          <aside className="space-y-5">
            <div className="card p-5">
              <h2 className="font-semibold">Topics</h2>
              <ul className="mt-3 space-y-1">
                {TOPICS.filter((t) => t !== 'All').map((t) => (
                  <li key={t}>
                    <button onClick={() => setTopic(t)} className="flex min-h-10 w-full items-center justify-between rounded-lg px-2 text-sm text-muted hover:bg-white/5 hover:text-white">
                      {t} <span className="text-xs">{all.filter((p) => p.topic === t).length}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-5">
              <h2 className="font-semibold">Community guidelines</h2>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted">
                <li>Be kind — everyone was a beginner once.</li>
                <li>Share original arrangements only.</li>
                <li>Keep feedback specific and constructive.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
      <AnimatePresence>{profile && <ProfileDialog profile={profile} postCount={all.filter((p) => p.profile.handle === profile.handle).length} onClose={() => setProfile(null)} />}</AnimatePresence>
    </>
  )
}
