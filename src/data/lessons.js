// Original lesson content written for the Lavender Strings prototype.

export const LESSON_CATEGORIES = [
  'Guitar Basics',
  'Chord Progressions',
  'Strumming Patterns',
  'Fingerstyle Guitar',
  'Music Theory',
  'Reading Guitar Tabs',
  'Advanced Techniques',
]

const AUTHOR = 'Lavender Strings Team'

export const LESSONS = [
  {
    id: 'first-chords',
    title: 'Your First Three Chords',
    category: 'Guitar Basics',
    author: AUTHOR,
    minutes: 15,
    difficulty: 'Beginner',
    summary: 'Learn G, C and D — the shapes behind hundreds of songs — and switch between them cleanly.',
    steps: [
      { title: 'Posture and fretting hand', body: 'Sit upright with the guitar body resting on your right leg. Keep your fretting thumb behind the neck, roughly opposite your middle finger, and press with your fingertips just behind each fret wire.' },
      { title: 'The G major shape', body: 'Place your middle finger on the 3rd fret of the low E string, index on the 2nd fret of the A string and ring finger on the 3rd fret of the high e string. Strum all six strings.', chords: ['G'] },
      { title: 'The C major shape', body: 'Ring finger on the 3rd fret of the A string, middle on the 2nd fret of D, index on the 1st fret of B. Avoid the low E string.', chords: ['C'] },
      { title: 'The D major shape', body: 'Index on the 2nd fret of G, ring on the 3rd fret of B, middle on the 2nd fret of high e. Strum only the top four strings.', chords: ['D'] },
      { title: 'Practice exercise: one-minute changes', body: 'Set the metronome to 60 BPM. Strum each chord once per bar in the order G → C → D → G. Count how many clean changes you make in one minute and try to beat it tomorrow.', exercise: true, chords: ['G', 'C', 'D'] },
    ],
  },
  {
    id: 'tuning-and-care',
    title: 'Tuning Your Guitar by Ear and Tuner',
    category: 'Guitar Basics',
    author: AUTHOR,
    minutes: 10,
    difficulty: 'Beginner',
    summary: 'Use the Lavender Strings tuner and learn the 5th-fret method as a backup.',
    steps: [
      { title: 'Standard tuning', body: 'From the thickest string to the thinnest: E A D G B E. A memory aid: "Every Amazing Dream Grows Beyond Earth".' },
      { title: 'Using the tuner', body: 'Open Music Tools → Tuner, allow microphone access and pluck one string at a time. Turn the peg until the needle sits in the centre and the status reads "In tune".' },
      { title: 'The 5th-fret method', body: 'Fret the low E string at the 5th fret — it should sound the same as the open A string. Repeat for each pair, except G → B, where you use the 4th fret.', exercise: true },
    ],
  },
  {
    id: 'pop-progression',
    title: 'The I–V–vi–IV Progression',
    category: 'Chord Progressions',
    author: AUTHOR,
    minutes: 20,
    difficulty: 'Beginner',
    summary: 'The four-chord loop that powers countless pop songs, in the key of C.',
    steps: [
      { title: 'Roman numerals', body: 'Numbers describe chords by their position in the key. In C major: I = C, V = G, vi = Am, IV = F. Lower-case numerals mean minor chords.' },
      { title: 'Meet the chords', body: 'Practise each shape until it rings clearly. F is the hardest — start with the small Fmaj7 shape if a full barre is too much.', chords: ['C', 'G', 'Am', 'Fmaj7'] },
      { title: 'Loop the progression', body: 'Play C → G → Am → F, one bar each with four down-strums. Loop it eight times without stopping, even if a chord buzzes.', exercise: true, chords: ['C', 'G', 'Am', 'F'] },
      { title: 'Transpose it', body: 'Open the Transpose tool and move the progression to G (G → D → Em → C). Notice the relationship between chords stays the same.' },
    ],
  },
  {
    id: 'twelve-bar-blues',
    title: '12-Bar Blues in A',
    category: 'Chord Progressions',
    author: AUTHOR,
    minutes: 25,
    difficulty: 'Intermediate',
    summary: 'Learn the form, the dominant 7th chords and a shuffle rhythm.',
    steps: [
      { title: 'The form', body: 'Bars 1–4: A7. Bars 5–6: D7. Bars 7–8: A7. Bar 9: E7. Bar 10: D7. Bars 11–12: A7 then E7 as a turnaround.', chords: ['A7', 'D7', 'E7'] },
      { title: 'The shuffle feel', body: 'Play each beat as a long-short pair ("daaa-da"). Count it as triplets with the middle note silent.' },
      { title: 'Play along', body: 'Open the demo song "Harbour Blues" and loop the 12-bar section in the practice player at 0.75× speed.', exercise: true },
    ],
  },
  {
    id: 'eighth-note-strum',
    title: 'Down-Up Eighth Note Strumming',
    category: 'Strumming Patterns',
    author: AUTHOR,
    minutes: 12,
    difficulty: 'Beginner',
    summary: 'Build a steady strumming hand with the "always moving" technique.',
    steps: [
      { title: 'Keep the hand moving', body: 'Your strumming hand moves down on every beat and up on every "and", whether or not it touches the strings. This keeps your time steady.' },
      { title: 'Count it out', body: 'Count "1 & 2 & 3 & 4 &" aloud. Downstrums land on numbers; upstrums land on "&".' },
      { title: 'The universal pattern', body: 'Play D · D U · U D U — skip the downstrum on beat 3 and the upstrum after beat 1. Start at 70 BPM with the metronome.', exercise: true, chords: ['Em'] },
    ],
  },
  {
    id: 'travis-picking',
    title: 'Introduction to Travis Picking',
    category: 'Fingerstyle Guitar',
    author: AUTHOR,
    minutes: 30,
    difficulty: 'Intermediate',
    summary: 'Alternate your thumb between bass strings while your fingers add melody.',
    steps: [
      { title: 'Thumb independence', body: 'On a C chord, alternate your thumb between the A and D strings, then G string, in a steady quarter-note pulse. Do not add fingers until this feels automatic.', chords: ['C'] },
      { title: 'Add the pinch', body: 'On beat 1, pluck the high e string with your middle finger at the same time as the thumb plays the bass note.' },
      { title: 'Full pattern', body: 'Thumb A, index B, thumb D, middle e, thumb G, index B — repeat. Try the picking pattern in the demo song "Cedar Porch".', exercise: true },
    ],
  },
  {
    id: 'intervals-and-scales',
    title: 'Major Scale and Intervals',
    category: 'Music Theory',
    author: AUTHOR,
    minutes: 20,
    difficulty: 'Beginner',
    summary: 'Understand the whole- and half-step pattern that defines every major key.',
    steps: [
      { title: 'Whole and half steps', body: 'One fret = a half step. Two frets = a whole step. The major scale follows W W H W W W H.' },
      { title: 'Build chords from the scale', body: 'Stacking every other note of the scale gives you triads: I, ii, iii, IV, V, vi, vii°. In C: C, Dm, Em, F, G, Am, Bdim.' },
      { title: 'Exercise', body: 'Play the C major scale on the A string from fret 3 to fret 15, saying each note name aloud.', exercise: true },
    ],
  },
  {
    id: 'reading-tabs',
    title: 'How to Read Guitar Tabs',
    category: 'Reading Guitar Tabs',
    author: AUTHOR,
    minutes: 10,
    difficulty: 'Beginner',
    summary: 'Six lines, numbers and symbols — decode any tab in ten minutes.',
    steps: [
      { title: 'Lines are strings', body: 'The top line is the thinnest (high e) string; the bottom line is the thickest (low E). This is the opposite of how the strings look when you glance down at your guitar.' },
      { title: 'Numbers are frets', body: 'A number tells you which fret to press; 0 means play the string open. Numbers stacked vertically are played together.' },
      { title: 'Common symbols', body: 'h = hammer-on, p = pull-off, / = slide up, \\ = slide down, b = bend, ~ = vibrato, x = muted note.' },
      { title: 'Read a real tab', body: 'Open the demo song "Paper Comets" and play the main riff slowly, one note at a time.', exercise: true },
    ],
  },
  {
    id: 'barre-chords',
    title: 'Mastering Barre Chords',
    category: 'Advanced Techniques',
    author: AUTHOR,
    minutes: 35,
    difficulty: 'Advanced',
    summary: 'Movable E- and A-shape barre chords unlock every key on the neck.',
    steps: [
      { title: 'Index finger placement', body: 'Roll your index finger slightly onto its bony side and place it just behind the fret. Use arm weight, not thumb squeeze.' },
      { title: 'E-shape barre', body: 'An E-shape with the barre at fret 1 gives you F. Move it to fret 3 for G, fret 5 for A.', chords: ['F', 'G', 'A'] },
      { title: 'A-shape barre', body: 'An A-shape with the barre at fret 1 gives Bb, fret 2 gives B, fret 3 gives C.', chords: ['Bb', 'Bm', 'C#m'] },
      { title: 'Exercise', body: 'Play F → Bb → C → F with barre shapes only, two bars each, at 60 BPM.', exercise: true },
    ],
  },
  {
    id: 'hammer-pull',
    title: 'Hammer-ons, Pull-offs and Slides',
    category: 'Advanced Techniques',
    author: AUTHOR,
    minutes: 25,
    difficulty: 'Intermediate',
    summary: 'Legato techniques for smoother, more expressive lead lines.',
    steps: [
      { title: 'Hammer-on', body: 'Pick a note, then bring another finger down sharply on a higher fret of the same string without picking again.' },
      { title: 'Pull-off', body: 'Fret two notes on one string, pick the higher one, then flick the upper finger off the string sideways so the lower note sounds.' },
      { title: 'Combine them', body: 'On the G string: 5h7p5, then slide 7/9. Repeat slowly with an even volume across every note.', exercise: true },
    ],
  },
]

export const getLesson = (id) => LESSONS.find((l) => l.id === id)

export function nextLesson(steps, completed) {
  const inProgress = LESSONS.find((l) => !completed[l.id] && (steps[l.id]?.length ?? 0) > 0)
  return inProgress ?? LESSONS.find((l) => !completed[l.id]) ?? null
}
