const CHROMA_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const CHROMA_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const FLAT_KEYS = ['F', 'Bb', 'Eb', 'Ab', 'Gb'];

const getNoteString = (midiNum, useFlats = false) => {
  const chroma = useFlats ? CHROMA_FLAT : CHROMA_SHARP;
  const note = chroma[midiNum % 12];
  const octave = Math.floor(midiNum / 12) - 1; // MIDI 60 is C4. 60/12 - 1 = 4.
  return `${note}${octave}`;
};

const getRootMidi = (keyName) => {
  let normalized = keyName;
  if (normalized === 'Db') normalized = 'C#';
  if (normalized === 'Eb') normalized = 'D#';
  if (normalized === 'Gb') normalized = 'F#';
  if (normalized === 'Ab') normalized = 'G#';
  if (normalized === 'Bb') normalized = 'A#';

  const index = CHROMA_SHARP.indexOf(normalized);

  // Keep roots between C3 (48) and B3 (59) so all notes fit nicely on the staff when transposed +1 octave
  return 48 + index;
};

// Define Roman Numeral to semitone intervals from root
const ROMAN_INTERVALS = {
  // Tonic
  'I': [0, 4, 7],
  'i': [0, 3, 7],
  'Imaj7': [0, 4, 7, 11],
  'IMaj7': [0, 4, 7, 11],
  'I7': [0, 4, 7, 10],
  'i7': [0, 3, 7, 10],
  'im7': [0, 3, 7, 10],
  'im7b5': [0, 3, 6, 10],
  'Isus4': [0, 5, 7],
  'idim': [0, 3, 6],
  'Iaug': [0, 4, 8],
  'I6': [0, 4, 7, 9],
  // Supertonic
  'bII': [1, 5, 8],
  'ii': [2, 5, 9],
  'ii7': [2, 5, 9, 12],
  'ii7b5': [2, 5, 8, 12],
  'II7': [2, 6, 9, 12],
  // Mediant
  'bIII': [3, 7, 10],
  'bIIImaj7': [3, 7, 10, 14],
  'iii': [4, 7, 11],
  'iii7': [4, 7, 11, 14],
  'III7': [4, 8, 11, 14],
  // Subdominant
  'IV': [5, 9, 12],
  'IVMaj7': [5, 9, 12, 16],
  'IV7': [5, 9, 12, 15],
  'iv': [5, 8, 12],
  'iv7': [5, 8, 12, 15],
  '#ivm7b5': [6, 9, 12, 16],
  // Dominant
  'V': [7, 11, 14],
  'V7': [7, 11, 14, 17],
  'V7b9': [7, 11, 14, 17, 20],
  'v7': [7, 10, 14, 17],
  'V7sus4': [7, 12, 14, 17],
  'V/3': [11, 14, 19],
  'Vaug': [7, 11, 15],
  'V9': [7, 11, 14, 17, 21],
  'V7/I': [0, 7, 11, 14, 17],
  // Submediant
  'vi': [9, 12, 16],
  'vi7': [9, 12, 16, 19],
  'VI7': [9, 13, 16, 19],
  'vi7/5': [7, 9, 12, 16],
  // Subtonic & Flat Submediant
  'bVI': [8, 12, 15],
  'bVImaj7': [8, 12, 15, 19],
  'bVII': [10, 14, 17],
  'bVIImaj7': [10, 14, 17, 21],
  'bVII7': [10, 14, 17, 20],
  // Leading tone
  'vii°': [11, 14, 17],
  // Misc
  'IV6': [5, 9, 12, 14],
};

export const getChordNotes = (keyName, romanNumeral) => {
  const rootMidi = getRootMidi(keyName);
  const intervals = ROMAN_INTERVALS[romanNumeral];
  if (!intervals) return [];

  let octaveShift = 0;
  const highestNoteMidi = rootMidi + intervals[intervals.length - 1];

  // If the highest note exceeds G4 (67), it will visually exceed G5 (transposed +1 octave for treble).
  // This causes SVG clipping and awkward voice leading. We drop the entire chord by one octave.
  if (highestNoteMidi > 67) {
    octaveShift = -12;
  }

  const useFlats = FLAT_KEYS.includes(keyName);
  return intervals.map(interval => getNoteString(rootMidi + interval + octaveShift, useFlats));
};

export const getChordName = (keyName, romanNumeral) => {
  const rootMidi = getRootMidi(keyName);
  const useFlats = FLAT_KEYS.includes(keyName);

  // Special slash chords mapping
  const slashChordRoots = {
    'V7/I': 7,
    'V/3': 7,
    'vi7/5': 9
  };

  let chordRootMidi = rootMidi;
  if (slashChordRoots[romanNumeral] !== undefined) {
    chordRootMidi = rootMidi + slashChordRoots[romanNumeral];
  } else {
    chordRootMidi = rootMidi + ROMAN_INTERVALS[romanNumeral][0];
  }

  const chordRootName = getNoteString(chordRootMidi, useFlats).replace(/[0-9]/g, '');

  let name = chordRootName;

  if (romanNumeral.includes('Maj7') || romanNumeral.includes('maj7')) name += 'Maj7';
  else if (romanNumeral.includes('7sus4')) name += '7sus4';
  else if (romanNumeral.includes('sus4')) name += 'sus4';
  else if (romanNumeral.includes('7b9')) name += '7♭9';
  else if (romanNumeral.includes('7b5') || romanNumeral.includes('m7b5')) name += 'm7♭5';
  else if (romanNumeral.includes('aug')) name += 'aug';
  else if (romanNumeral.includes('9')) name += '9';
  else if (romanNumeral.includes('6')) name += '6';
  else if (romanNumeral.includes('7')) name += '7';
  else if (romanNumeral.includes('°') || romanNumeral.includes('dim')) name += 'dim';
  else if (romanNumeral === romanNumeral.toLowerCase() && !romanNumeral.includes('°') && !romanNumeral.includes('dim') && !romanNumeral.includes('maj7')) {
    // minor chord if strictly lowercase and not a special chord above
    name += 'm';
  } else if (romanNumeral.startsWith('i') || romanNumeral.startsWith('v') || romanNumeral.startsWith('iv')) {
    // Catch-all for lowercase minor root if it wasn't caught
    if (romanNumeral[0] === romanNumeral[0].toLowerCase() && !romanNumeral.includes('m7b5')) {
      if (!name.endsWith('m') && !name.includes('Maj')) name += 'm';
    }
  }

  // Formatting minor for specific symbols (like v7, i7, vi7, ii7, iii7, iv7)
  // Only apply to plain minor 7ths — not to half-dim (7b5) or altered (7b9) chords
  if (romanNumeral.match(/^[iv]+7$/) && !romanNumeral.includes('b') && !name.includes('m7')) {
    name = name.replace('7', 'm7');
  }

  // Handle slashes
  if (romanNumeral.includes('/')) {
    const bassInterval = ROMAN_INTERVALS[romanNumeral][0];
    const bassName = getNoteString(rootMidi + bassInterval, useFlats).replace(/[0-9]/g, '');
    name = `${name}/${bassName}`;
  }

  return name;
};

export const ALL_KEYS = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
