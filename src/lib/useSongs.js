import { useEffect, useState } from 'react'

// The demo catalogue is code-split and loaded asynchronously, the same way a real
// API call would be, so pages exercise genuine loading and error states.
let cache = null

export function useSongs() {
  const [state, setState] = useState(() => (cache ? { songs: cache, loading: false, error: null } : { songs: [], loading: true, error: null }))

  useEffect(() => {
    if (cache) return
    let alive = true
    import('../data/songs.js')
      .then((m) => {
        cache = m.SONGS
        if (alive) setState({ songs: m.SONGS, loading: false, error: null })
      })
      .catch(() => alive && setState({ songs: [], loading: false, error: 'The song catalogue could not be loaded. Check your connection and try again.' }))
    return () => {
      alive = false
    }
  }, [])

  return state
}

export function searchSongs(songs, query) {
  const q = query.trim().toLowerCase()
  if (!q) return songs
  return songs.filter((s) =>
    [s.title, s.artist, s.genre, s.type, s.key, s.instrument, ...s.categories].some((f) => f.toLowerCase().includes(q)) ||
    s.sheet.includes(`[${query.trim()}]`),
  )
}
