import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react'

// Prototype persistence: everything lives in this browser's localStorage.
// Production would replace this with an authenticated backend + database.

const STORAGE_KEY = 'lavender-strings:v1'

const initial = {
  favourites: [],
  recent: [],
  steps: {}, // lessonId -> completed step indexes
  completed: {}, // lessonId -> ISO date
  activity: [], // YYYY-MM-DD days with practice activity
  tools: [], // { id, at }
  user: null, // { name, email, createdAt }
  posts: [],
  likes: {},
  prefs: { fontSize: 16, showChords: true, showDiagrams: true },
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initial
    const parsed = JSON.parse(raw)
    return { ...initial, ...parsed, prefs: { ...initial.prefs, ...parsed.prefs } }
  } catch {
    return initial
  }
}

const today = () => new Date().toISOString().slice(0, 10)
const withDay = (activity) => (activity.includes(today()) ? activity : [...activity, today()].slice(-120))

function reducer(state, action) {
  switch (action.type) {
    case 'favourite': {
      const has = state.favourites.includes(action.id)
      return { ...state, favourites: has ? state.favourites.filter((f) => f !== action.id) : [action.id, ...state.favourites] }
    }
    case 'view':
      return { ...state, recent: [{ id: action.id, at: Date.now() }, ...state.recent.filter((r) => r.id !== action.id)].slice(0, 12) }
    case 'activity':
      return { ...state, activity: withDay(state.activity) }
    case 'step': {
      const done = new Set(state.steps[action.lessonId] ?? [])
      done.has(action.index) ? done.delete(action.index) : done.add(action.index)
      const steps = { ...state.steps, [action.lessonId]: [...done].sort((a, b) => a - b) }
      const completed = { ...state.completed }
      if (done.size >= action.total) completed[action.lessonId] ??= new Date().toISOString()
      else delete completed[action.lessonId]
      return { ...state, steps, completed, activity: withDay(state.activity) }
    }
    case 'tool':
      return { ...state, tools: [{ id: action.id, at: Date.now() }, ...state.tools.filter((t) => t.id !== action.id)].slice(0, 6), activity: withDay(state.activity) }
    case 'signIn':
      return { ...state, user: action.user }
    case 'signOut':
      return { ...state, user: null }
    case 'post':
      return { ...state, posts: [action.post, ...state.posts] }
    case 'deletePost':
      return { ...state, posts: state.posts.filter((p) => p.id !== action.id) }
    case 'like': {
      const likes = { ...state.likes }
      likes[action.id] ? delete likes[action.id] : (likes[action.id] = true)
      return { ...state, likes }
    }
    case 'pref':
      return { ...state, prefs: { ...state.prefs, [action.key]: action.value } }
    case 'reset':
      return { ...initial, user: state.user }
    default:
      return state
  }
}

export function practiceStreak(activity) {
  const days = new Set(activity)
  const d = new Date()
  if (!days.has(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1)
  let streak = 0
  while (days.has(d.toISOString().slice(0, 10))) {
    streak++
    d.setDate(d.getDate() - 1)
  }
  return streak
}

const StoreContext = createContext(null)
const ToastContext = createContext(() => {})

export function AppStoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* storage unavailable (private mode / quota) — state stays in memory */
    }
  }, [state])

  const toast = useCallback((message, tone = 'default') => {
    const id = ++idRef.current
    setToasts((t) => [...t.slice(-2), { id, message, tone }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600)
  }, [])

  const actions = useMemo(
    () => ({
      toggleFavourite: (id) => dispatch({ type: 'favourite', id }),
      recordView: (id) => dispatch({ type: 'view', id }),
      logActivity: () => dispatch({ type: 'activity' }),
      toggleStep: (lessonId, index, total) => dispatch({ type: 'step', lessonId, index, total }),
      recordTool: (id) => dispatch({ type: 'tool', id }),
      signIn: (user) => dispatch({ type: 'signIn', user }),
      signOut: () => dispatch({ type: 'signOut' }),
      addPost: (post) => dispatch({ type: 'post', post }),
      deletePost: (id) => dispatch({ type: 'deletePost', id }),
      toggleLike: (id) => dispatch({ type: 'like', id }),
      setPref: (key, value) => dispatch({ type: 'pref', key, value }),
      resetProgress: () => dispatch({ type: 'reset' }),
    }),
    [],
  )

  const value = useMemo(() => ({ ...state, ...actions }), [state, actions])

  return (
    <StoreContext.Provider value={value}>
      <ToastContext.Provider value={toast}>
        {children}
        <ToastStack toasts={toasts} />
      </ToastContext.Provider>
    </StoreContext.Provider>
  )
}

function ToastStack({ toasts }) {
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-20 z-[70] flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <div key={t.id} className="glass rounded-full px-4 py-2 text-sm text-lilac shadow-lg shadow-black/40 animate-[toast-in_.3s_ease-out]">
          {t.message}
        </div>
      ))}
      <style>{'@keyframes toast-in{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}'}</style>
    </div>
  )
}

export const useStore = () => useContext(StoreContext)
export const useToast = () => useContext(ToastContext)
