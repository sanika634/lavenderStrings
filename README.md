# Lavender Strings

A midnight-purple music-learning web app: discover songs, read interactive chord sheets and guitar tabs, practise with a synthesised player, and use a tuner, metronome, chord library and transposer.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # serve the production build
```

Stack: React 19 + Vite, Tailwind CSS v4, Framer Motion, Lucide icons, React Router.

## Project structure

```
src/
  App.jsx               routes (lazy-loaded pages), page transitions, scroll handling
  index.css             design tokens (@theme) and shared utilities (btn, card, glass, field…)
  context/AppStore.jsx  persisted app state (favourites, history, lessons, demo account) + toasts
  lib/
    music.js            chord parsing, transposition and enharmonic spelling, guitar shapes
    sheet.js            ChordPro-style sheet parser → sections + playback progression
    player.js           practice-player engine (Web Audio scheduler, useSyncExternalStore)
    audio.js            shared AudioContext, plucked-string synth, metronome click
    pitch.js            autocorrelation pitch detection for the tuner
    useSongs.js         async (code-split) catalogue loading + search
    useCanvasLoop.js    HiDPI canvas loop that pauses off-screen and respects reduced motion
  components/           Navbar, Footer, SearchBox, SongCard, ChordDiagram, MiniPlayer, HeroScene, tools/…
  pages/                Home, Explore, Tabs, SongDetail, Learn, Lesson, Tools, Community, Dashboard, Auth, Info
  data/                 demo songs, lessons, sample community posts
```

## What is real and what is prototype

| Feature | Status |
| --- | --- |
| Song search, filters, sorting, suggestions | Real, over the local demo catalogue |
| Transpose, chord diagrams, piano view, auto-scroll, text size | Real |
| Practice player (play/pause, seek, speed, tempo, metronome, loop section) | Real Web Audio **synthesis of the chord chart**: not original recordings |
| Guitar tuner | Real microphone pitch detection; reference tones as a fallback |
| Metronome, chord library, transposer | Real |
| Favourites, history, lesson progress, streak, preferences | Real, stored in `localStorage` (this browser only) |
| Log in / Sign up | **Prototype**: validated form, no server; the password is never stored or sent |
| Community | Sample posts are labelled as samples; your own posts are stored locally only |
| Contact form | Opens the user's email app with the message (`mailto:`) |

**Content:** every song, artist and lyric is original demo material written for this project. No ratings or popularity data are shown, because there is no real data to back them.

## Going to production

- Replace `useSongs` with an API and licensed catalogue.
- Add a backend for authentication, user data sync and community posts, with moderation.
- Keep secrets server-side; the frontend contains no API keys.
