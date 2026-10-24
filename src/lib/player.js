import { useSyncExternalStore } from 'react'
import { getAudioContext, strum, click } from './audio'
import { parseSheet } from './sheet'
import { transposeChord } from './music'

// Practice player: synthesises a song's chord progression (one bar per chord, 4/4).
// It is a practice aid — it never plays the original recording.

const BEATS_PER_BAR = 4
const LOOKAHEAD = 0.12

let state = {
  song: null,
  progression: [],
  sections: [],
  playing: false,
  beat: 0, // fractional beat position used by the UI
  volume: 0.8,
  speed: 1,
  bpm: 90,
  metronome: false,
  loop: null, // { start, end, label } in bars (chord indices)
  transpose: 0,
  preferFlats: false,
  error: null,
}

const listeners = new Set()
const set = (patch) => {
  state = { ...state, ...patch }
  listeners.forEach((l) => l())
}

let master = null
let timer = null
let raf = null
let nextBeat = 0
let nextTime = 0
let queue = []

const secondsPerBeat = () => 60 / (state.bpm * state.speed)
const totalBeats = () => state.progression.length * BEATS_PER_BAR

function chordAt(bar) {
  const c = state.progression[bar]
  return c ? transposeChord(c, state.transpose, state.preferFlats) : null
}

function schedule() {
  const ac = getAudioContext()
  while (nextTime < ac.currentTime + LOOKAHEAD) {
    if (state.loop && nextBeat >= state.loop.end * BEATS_PER_BAR) nextBeat = state.loop.start * BEATS_PER_BAR
    if (nextBeat >= totalBeats()) {
      // Let the final strum ring, then stop.
      const endAt = nextTime
      queue.push({ beat: totalBeats(), time: endAt, end: true })
      clearInterval(timer)
      timer = null
      return
    }
    const bar = Math.floor(nextBeat / BEATS_PER_BAR)
    const inBar = nextBeat % BEATS_PER_BAR
    const chord = chordAt(bar)
    if (chord && (inBar === 0 || inBar === 2)) strum(ac, master, chord, nextTime, { down: true, level: inBar === 0 ? 1 : 0.7 })
    if (chord && inBar === 3) strum(ac, master, chord, nextTime + secondsPerBeat() / 2, { down: false, level: 0.45 })
    if (state.metronome) click(ac, master, nextTime, inBar === 0, 0.6)
    queue.push({ beat: nextBeat, time: nextTime })
    nextBeat += 1
    nextTime += secondsPerBeat()
  }
}

function tick() {
  const ac = getAudioContext()
  let latest = null
  while (queue.length && queue[0].time <= ac.currentTime) latest = queue.shift()
  if (latest?.end) {
    stopInternal()
    set({ playing: false, beat: 0 })
    return
  }
  if (latest) {
    const frac = Math.min(0.999, (ac.currentTime - latest.time) / secondsPerBeat())
    set({ beat: latest.beat + frac })
  }
  raf = requestAnimationFrame(tick)
}

function stopInternal() {
  clearInterval(timer)
  cancelAnimationFrame(raf)
  timer = null
  raf = null
  queue = []
  if (master) {
    const old = master
    old.gain.setTargetAtTime(0, old.context.currentTime, 0.03)
    setTimeout(() => old.disconnect(), 300)
    master = null
  }
}

function startAt(beat) {
  let ac
  try {
    ac = getAudioContext()
  } catch (e) {
    set({ error: e.message, playing: false })
    return
  }
  stopInternal()
  master = ac.createGain()
  master.gain.value = state.volume
  master.connect(ac.destination)
  nextBeat = Math.floor(beat)
  nextTime = ac.currentTime + 0.06
  set({ playing: true, beat: nextBeat, error: null })
  schedule()
  timer = setInterval(schedule, 25)
  raf = requestAnimationFrame(tick)
}

export const player = {
  getState: () => state,
  load(song, { transpose = 0, preferFlats = false } = {}) {
    if (state.song?.id === song.id) {
      set({ transpose, preferFlats })
      return
    }
    stopInternal()
    const { progression, sections } = parseSheet(song.sheet)
    set({
      song,
      progression,
      sections: sections.filter((s) => s.end > s.start).map((s) => ({ label: s.name, start: s.start, end: s.end })),
      playing: false,
      beat: 0,
      bpm: song.bpm,
      loop: null,
      transpose,
      preferFlats,
    })
  },
  play(song) {
    if (song && state.song?.id !== song.id) this.load(song)
    if (!state.song) return
    const start = state.loop && (state.beat < state.loop.start * 4 || state.beat >= state.loop.end * 4) ? state.loop.start * 4 : state.beat
    startAt(start >= totalBeats() ? 0 : start)
  },
  pause() {
    stopInternal()
    set({ playing: false })
  },
  toggle(song) {
    if (state.playing && (!song || song.id === state.song?.id)) this.pause()
    else this.play(song)
  },
  seekBar(bar) {
    const beat = Math.max(0, Math.min(bar, state.progression.length - 1)) * BEATS_PER_BAR
    if (state.playing) startAt(beat)
    else set({ beat })
  },
  seekFraction(f) {
    const beat = Math.floor(f * totalBeats())
    if (state.playing) startAt(beat)
    else set({ beat })
  },
  setVolume(volume) {
    if (master) master.gain.setTargetAtTime(volume, master.context.currentTime, 0.02)
    set({ volume })
  },
  setSpeed(speed) {
    set({ speed })
    if (state.playing) startAt(Math.floor(state.beat))
  },
  setBpm(bpm) {
    set({ bpm: Math.max(40, Math.min(220, bpm)) })
    if (state.playing) startAt(Math.floor(state.beat))
  },
  setMetronome(metronome) {
    set({ metronome })
  },
  setLoop(loop) {
    set({ loop })
    if (loop && state.playing) startAt(loop.start * BEATS_PER_BAR)
  },
  setTranspose(transpose, preferFlats) {
    set({ transpose, preferFlats })
  },
  close() {
    stopInternal()
    set({ song: null, playing: false, beat: 0, loop: null })
  },
}

const subscribe = (l) => {
  listeners.add(l)
  return () => listeners.delete(l)
}
const getSnapshot = () => state

export function usePlayer() {
  return useSyncExternalStore(subscribe, getSnapshot)
}

export const BEATS = BEATS_PER_BAR

export function formatTime(seconds) {
  const s = Math.max(0, Math.floor(seconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
