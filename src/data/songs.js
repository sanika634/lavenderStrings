// DEMO CATALOGUE — every song, artist and lyric below is original sample material
// written for this prototype. None of it represents a real recording or artist.

export const SONGS = [
  {
    id: 'midnight-lanterns',
    title: 'Midnight Lanterns',
    artist: 'Juniper Hollow',
    genre: 'Acoustic',
    categories: ['trending', 'beginner', 'acoustic'],
    type: 'Chords',
    instrument: 'Guitar',
    difficulty: 'Beginner',
    key: 'G',
    tuning: 'Standard (E A D G B E)',
    capo: 0,
    bpm: 84,
    strumming: 'D · D U · U D U',
    added: '2026-10-18',
    palette: ['#8B5CF6', '#2A1745', '#E9D5FF'],
    sheet: `
[Intro]
| G | D | Em | C |
[Verse 1]
[G]Lanterns on the [D]harbour wall
[Em]Flicker while the [C]tide is low
[G]Every light a [D]little call
[Em]Telling me which [C]way to go
[Chorus]
So [C]hold the [G]night a little [D]longer
[Em]Let the [C]quiet make us [D]stronger
[C]Midnight [G]lanterns, [D]burning [Em]bright
[C]Guide me [D]home to[G]night
[Outro]
| C | D | G |
`,
  },
  {
    id: 'paper-comets',
    title: 'Paper Comets',
    artist: 'Glasshouse Kites',
    genre: 'Indie',
    categories: ['trending', 'indie', 'tabs'],
    type: 'Tab',
    instrument: 'Guitar',
    difficulty: 'Intermediate',
    key: 'D',
    tuning: 'Standard (E A D G B E)',
    capo: 2,
    bpm: 112,
    strumming: 'Fingerpicked riff, then D D U U D U',
    added: '2026-09-30',
    palette: ['#C084FC', '#1E1B4B', '#86EFAC'],
    sheet: `
[Main Riff]
e|-----------0-----------0-----|
B|-------3-------3---------3---|
G|-----2-------2-------2-------|
D|---0-------0-------0---------|
A|-----------------------------|
E|-----------------------------|
[Verse]
[D]Folded every [Bm]wish I had
[G]Into paper [A]flame
[D]Threw them at the [Bm]city sky
[G]Signed them with your [A]name
[Chorus]
[G]Paper [D]comets, [A]falling [Bm]slow
[G]Lighting [D]up the [A]streets be[D]low
`,
  },
  {
    id: 'voltage-heart',
    title: 'Voltage Heart',
    artist: 'Iron Meridian',
    genre: 'Rock',
    categories: ['rock', 'tabs', 'trending'],
    type: 'Tab',
    instrument: 'Electric Guitar',
    difficulty: 'Advanced',
    key: 'Em',
    tuning: 'Standard (E A D G B E)',
    capo: 0,
    bpm: 138,
    strumming: 'Palm-muted eighths',
    added: '2026-08-12',
    palette: ['#F472B6', '#2E1065', '#FCD34D'],
    sheet: `
[Intro Riff]
e|---------------------------------|
B|---------------------------------|
G|---------------------------------|
D|-----------------5-7-5-----------|
A|-------5-7---7-------------7-5---|
E|-0-0-0-----0---------------------|
[Verse]
| E5 | G5 | A5 | C5 |
[E5]Wires in my [G5]veins tonight
[A5]Running hot and [C5]running bright
[Chorus]
[C]Voltage [D]heart, don't [Em]let it go
[C]Turn it [D]up 'til the [Em]amps all glow
`,
  },
  {
    id: 'chandni-raat',
    title: 'Chandni Raat',
    artist: 'Raag Lanterns',
    genre: 'Bollywood',
    categories: ['bollywood', 'acoustic', 'beginner'],
    type: 'Chords',
    instrument: 'Guitar',
    difficulty: 'Beginner',
    key: 'Am',
    tuning: 'Standard (E A D G B E)',
    capo: 0,
    bpm: 76,
    strumming: 'D · D U · U D U',
    added: '2026-10-06',
    palette: ['#A78BFA', '#3B0764', '#FDE68A'],
    sheet: `
[Intro]
| Am | G | F | E |
[Verse]
[Am]Chandni raat hai, [G]khamosh hawa
[F]Teri yaad ka [E]ek diya jala
[Am]Taaron se poocha [G]tera pata
[F]Dil ne kaha, [E]woh yahin pe tha
[Chorus]
[F]Chal [G]saath mere, [C]is raat ke [Am]paar
[F]Chaand [G]bhi gaaye [E]humara pyaar
`,
  },
  {
    id: 'satin-signal',
    title: 'Satin Signal',
    artist: 'Lumen Avenue',
    genre: 'Pop',
    categories: ['pop', 'trending', 'recent'],
    type: 'Chords',
    instrument: 'Guitar',
    difficulty: 'Beginner',
    key: 'C',
    tuning: 'Standard (E A D G B E)',
    capo: 0,
    bpm: 104,
    strumming: 'D D U U D U',
    added: '2026-10-21',
    palette: ['#E879F9', '#4C1D95', '#C4B5FD'],
    sheet: `
[Verse]
[C]Static on the [G]radio
[Am]Your voice is coming [F]through
[C]Every song I [G]used to know
[Am]Sounds a little [F]more like you
[Pre-Chorus]
[Dm]Turn it up, [F]turn it up
[G]Don't let it fade
[Chorus]
[C]You're my satin [G]signal
[Am]Shining through the [F]grey
[C]Steady and [G]original
[F]Stay, [G]stay
`,
  },
  {
    id: 'cedar-porch',
    title: 'Cedar Porch',
    artist: 'Willowbrook Trio',
    genre: 'Acoustic',
    categories: ['acoustic', 'beginner', 'tabs'],
    type: 'Tab',
    instrument: 'Guitar',
    difficulty: 'Beginner',
    key: 'D',
    tuning: 'Standard (E A D G B E)',
    capo: 0,
    bpm: 92,
    strumming: 'Thumb-pluck bass, brush up',
    added: '2026-07-28',
    palette: ['#C4B5FD', '#201333', '#86EFAC'],
    sheet: `
[Picking Pattern]
e|-----2-------2-------0-------0---|
B|-------3-------3-------3-------3-|
G|---2-------2-------2-------2-----|
D|-0-------0-------------------0---|
A|-----------------0---------------|
E|---------------------------------|
[Verse]
[D]Sitting on the [G]cedar porch
[D]Watching swallows [A]fly
[D]Summer's in the [G]wooden boards
[A]Golden in the [D]sky
`,
  },
  {
    id: 'neon-orchard',
    title: 'Neon Orchard',
    artist: 'The Night Gardeners',
    genre: 'Indie',
    categories: ['indie', 'recent', 'pop'],
    type: 'Chords',
    instrument: 'Guitar',
    difficulty: 'Intermediate',
    key: 'F',
    tuning: 'Standard (E A D G B E)',
    capo: 0,
    bpm: 98,
    strumming: 'D · D U U D',
    added: '2026-10-14',
    palette: ['#8B5CF6', '#0F172A', '#F0ABFC'],
    sheet: `
[Verse]
[F]Apples made of [Am]neon light
[Bb]Hanging from the [C]wire
[F]We could pick the [Am]city clean
[Bb]Every branch on [C]fire
[Chorus]
[Dm]Meet me in the [Bb]orchard
[F]Where the signs all [C]grow
[Dm]Every colour [Bb]glowing
[C]Every way we go
`,
  },
  {
    id: 'monsoon-letters',
    title: 'Monsoon Letters',
    artist: 'Raag Lanterns',
    genre: 'Bollywood',
    categories: ['bollywood', 'recent'],
    type: 'Chords',
    instrument: 'Guitar',
    difficulty: 'Intermediate',
    key: 'Em',
    tuning: 'Standard (E A D G B E)',
    capo: 2,
    bpm: 88,
    strumming: 'D · D U · U D U',
    added: '2026-10-10',
    palette: ['#818CF8', '#312E81', '#A5F3FC'],
    sheet: `
[Intro]
| Em | C | G | D |
[Verse]
[Em]Baarish ki boondon mein [C]likhe khat tere
[G]Bheege hue panne, [D]bheege sawere
[Em]Har lafz mein [C]tera hi rang
[G]Har saans mein [D]tera hi sang
[Chorus]
[C]Saawan [D]aaya, [G]khat le [Em]aaya
[C]Dil ne [D]phir se [Em]tujhe bulaaya
`,
  },
  {
    id: 'gravity-lessons',
    title: 'Gravity Lessons',
    artist: 'Voltage Choir',
    genre: 'Rock',
    categories: ['rock', 'tabs'],
    type: 'Chords',
    instrument: 'Guitar',
    difficulty: 'Intermediate',
    key: 'A',
    tuning: 'Standard (E A D G B E)',
    capo: 0,
    bpm: 126,
    strumming: 'D D D D (driving eighths)',
    added: '2026-06-19',
    palette: ['#A855F7', '#1E1033', '#FCA5A5'],
    sheet: `
[Verse]
[A]Falling's just a [E]lesson
[F#m]Taught by the [D]ground
[A]Every time I [E]hit it
[F#m]I learn to turn a[D]round
[Chorus]
[D]Gravity, [E]gravity
[F#m]Pull me [D]in
[A]I'll get [E]up a[D]gain
`,
  },
  {
    id: 'velvet-skyline',
    title: 'Velvet Skyline',
    artist: 'Lumen Avenue',
    genre: 'Pop',
    categories: ['pop', 'trending'],
    type: 'Chords',
    instrument: 'Ukulele',
    difficulty: 'Beginner',
    key: 'C',
    tuning: 'Ukulele (G C E A)',
    capo: 0,
    bpm: 100,
    strumming: 'D · D U · U D U',
    added: '2026-09-02',
    palette: ['#DDD6FE', '#5B21B6', '#F9A8D4'],
    sheet: `
[Verse]
[C]Velvet skyline, [Am]purple and blue
[F]Every window [G]thinking of you
[C]City's humming [Am]under my feet
[F]Turning every [G]corner sweet
[Chorus]
[F]Oh, [G]take me [C]higher
[F]Up where the [G]sky's on [C]fire
`,
  },
  {
    id: 'harbour-blues',
    title: 'Harbour Blues',
    artist: 'Old Rope Sessions',
    genre: 'Blues',
    categories: ['acoustic', 'tabs'],
    type: 'Tab',
    instrument: 'Guitar',
    difficulty: 'Intermediate',
    key: 'A',
    tuning: 'Standard (E A D G B E)',
    capo: 0,
    bpm: 72,
    strumming: 'Shuffle feel',
    added: '2026-05-21',
    palette: ['#7C3AED', '#172554', '#93C5FD'],
    sheet: `
[Shuffle Riff]
e|---------------------------------|
B|---------------------------------|
G|---------------------------------|
D|-2--4--2--4--2--4--2--4----------|
A|-0--0--0--0--0--0--0--0----------|
E|---------------------------------|
[12-Bar Progression]
| A7 | A7 | A7 | A7 |
| D7 | D7 | A7 | A7 |
| E7 | D7 | A7 | E7 |
`,
  },
  {
    id: 'firefly-static',
    title: 'Firefly Static',
    artist: 'Glasshouse Kites',
    genre: 'Indie',
    categories: ['indie', 'beginner', 'recent'],
    type: 'Chords',
    instrument: 'Guitar',
    difficulty: 'Beginner',
    key: 'G',
    tuning: 'Standard (E A D G B E)',
    capo: 3,
    bpm: 94,
    strumming: 'D · D U · U D U',
    added: '2026-10-19',
    palette: ['#A3E635', '#1A0F2E', '#C4B5FD'],
    sheet: `
[Verse]
[G]Fireflies in a [Cadd9]jar of static
[Em]Buzzing like a [D]summer song
[G]Every little [Cadd9]light erratic
[Em]Every one where [D]it belongs
[Chorus]
[Cadd9]Let them [G]go, let them [D]go
[Em]Watch the [Cadd9]field begin to [D]glow
`,
  },
  {
    id: 'thunder-road-trip',
    title: 'Overdrive Highway',
    artist: 'Iron Meridian',
    genre: 'Rock',
    categories: ['rock', 'recent'],
    type: 'Chords',
    instrument: 'Electric Guitar',
    difficulty: 'Advanced',
    key: 'E',
    tuning: 'Standard (E A D G B E)',
    capo: 0,
    bpm: 148,
    strumming: 'Down-picked eighths',
    added: '2026-10-22',
    palette: ['#F43F5E', '#2E1065', '#C4B5FD'],
    sheet: `
[Riff]
| E5 | G5 | A5 | E5 |
[Verse]
[E]Engine's screaming [B]down the line
[C#m]Leave the city [A]far behind
[E]Every mile a [B]little free
[C#m]Highway's calling [A]out to me
[Chorus]
[A]Over[B]drive, [C#m]over[A]drive
[E]Never felt so [B]much alive
`,
  },
  {
    id: 'saahil-ki-hawa',
    title: 'Saahil Ki Hawa',
    artist: 'Monsoon Letters Collective',
    genre: 'Bollywood',
    categories: ['bollywood', 'trending'],
    type: 'Chords',
    instrument: 'Guitar',
    difficulty: 'Beginner',
    key: 'D',
    tuning: 'Standard (E A D G B E)',
    capo: 0,
    bpm: 90,
    strumming: 'D D U U D U',
    added: '2026-09-15',
    palette: ['#FB923C', '#3B0764', '#E9D5FF'],
    sheet: `
[Verse]
[D]Saahil ki hawa [A]kuch kehti hai
[Bm]Leheron mein teri [G]baat behti hai
[D]Ret pe likha [A]naam tera
[Bm]Lehron ne choo ke [G]kiya mera
[Chorus]
[G]Aaja, [A]aaja, [D]saath chal
[G]Ruk na [A]jaaye ye [D]pal
`,
  },
  {
    id: 'silver-tram',
    title: 'Silver Tram',
    artist: 'The Paper Lanterns Club',
    genre: 'Pop',
    categories: ['pop', 'acoustic'],
    type: 'Chords',
    instrument: 'Guitar',
    difficulty: 'Intermediate',
    key: 'Bb',
    tuning: 'Standard (E A D G B E)',
    capo: 1,
    bpm: 108,
    strumming: 'D · D U · U D U',
    added: '2026-08-27',
    palette: ['#C4B5FD', '#3730A3', '#FBCFE8'],
    sheet: `
[Verse]
[Bb]Silver tram at [F]half past nine
[Gm]Window seat and [Eb]borrowed time
[Bb]Strangers humming [F]out of tune
[Gm]Underneath a [Eb]paper moon
[Chorus]
[Eb]Ride it [F]to the [Gm]end of the line
[Eb]Every [F]stop is a [Bb]brand new sign
`,
  },
  {
    id: 'aurora-waltz',
    title: 'Aurora Waltz',
    artist: 'Juniper Hollow',
    genre: 'Fingerstyle',
    categories: ['acoustic', 'tabs', 'indie'],
    type: 'Tab',
    instrument: 'Guitar',
    difficulty: 'Advanced',
    key: 'Am',
    tuning: 'Standard (E A D G B E)',
    capo: 0,
    bpm: 66,
    strumming: 'Fingerstyle, 3/4 feel',
    added: '2026-04-11',
    palette: ['#5EEAD4', '#1E1B4B', '#C4B5FD'],
    sheet: `
[Theme]
e|-------0-----|-------1-----|-------0-----|-------0-----|
B|-----1---1---|-----1---1---|-----0---0---|-----1---1---|
G|---2-------2-|---2-------2-|---0-------0-|---1-------1-|
D|-------------|-------------|-------------|-------------|
A|-0-----------|-3-----------|-------------|-------------|
E|-------------|-------------|-3-----------|-0-----------|
[Progression]
| Am | C | G | E7 |
| Am | Fmaj7 | E7 | Am |
`,
  },
]

export const getSong = (id) => SONGS.find((s) => s.id === id)
