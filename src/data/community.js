// SAMPLE COMMUNITY CONTENT — these are illustrative example posts and fictional
// demo profiles for the prototype. They are labelled as samples in the UI and do
// not represent real users or real activity.

export const TOPICS = ['All', 'Discussions', 'Arrangements', 'Tips', 'Achievements', 'Articles']

export const SAMPLE_PROFILES = {
  'demo-strummer': { handle: 'demo-strummer', name: 'Demo Strummer', instrument: 'Acoustic guitar', bio: 'Sample profile used to illustrate the community layout.', hue: 265 },
  'sample-fingerpicker': { handle: 'sample-fingerpicker', name: 'Sample Fingerpicker', instrument: 'Fingerstyle guitar', bio: 'Example profile. Fingerstyle arrangements and open tunings.', hue: 300 },
  'example-bassline': { handle: 'example-bassline', name: 'Example Bassline', instrument: 'Bass guitar', bio: 'Example profile for low-end tips and grooves.', hue: 220 },
  'lavender-team': { handle: 'lavender-team', name: 'Lavender Strings Team', instrument: 'Editorial', bio: 'Articles and guides from the Lavender Strings editorial team.', hue: 280 },
}

export const SAMPLE_POSTS = [
  {
    id: 'sample-1',
    topic: 'Tips',
    author: 'sample-fingerpicker',
    title: 'Practise chord changes without strumming',
    body: 'A tip worth trying: switch between two chord shapes silently for one minute, focusing only on the fretting hand. Once the movement is automatic, add strumming back in.',
    tags: ['practice', 'chords'],
    date: '2026-10-12',
  },
  {
    id: 'sample-2',
    topic: 'Arrangements',
    author: 'demo-strummer',
    title: 'Capo 3 arrangement idea for "Firefly Static" (demo song)',
    body: 'Using G, Cadd9, Em and D shapes with a capo on fret 3 keeps the ringing open strings. The Cadd9 → G change only moves two fingers.',
    tags: ['capo', 'arrangement'],
    date: '2026-10-08',
  },
  {
    id: 'sample-3',
    topic: 'Discussions',
    author: 'example-bassline',
    title: 'How do you keep a practice routine going?',
    body: 'Example discussion prompt: what keeps your practice consistent — short daily sessions, a log, or learning songs you love?',
    tags: ['routine'],
    date: '2026-10-03',
  },
  {
    id: 'sample-4',
    topic: 'Articles',
    author: 'lavender-team',
    title: 'Why the metronome feels hard at first (and how to make friends with it)',
    body: 'Start slower than you think you need to. Set the click to half time so it lands on beats 2 and 4, and focus on being late or early on purpose — it trains your ear to hear the grid.',
    tags: ['timing', 'metronome'],
    date: '2026-09-27',
  },
  {
    id: 'sample-5',
    topic: 'Achievements',
    author: 'demo-strummer',
    title: 'Example milestone: first clean F barre chord',
    body: 'This is a sample achievement card showing how milestone posts appear in the feed.',
    tags: ['barre', 'milestone'],
    date: '2026-09-20',
  },
  {
    id: 'sample-6',
    topic: 'Tips',
    author: 'lavender-team',
    title: 'Reading tabs faster: look for shapes, not numbers',
    body: 'Many riffs sit inside a chord shape. Before playing a tab, scan for the chord it outlines and keep your hand in that position.',
    tags: ['tabs'],
    date: '2026-09-14',
  },
]
