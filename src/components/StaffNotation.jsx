import React from 'react';

const parseNote = (noteStr) => {
  const match = noteStr.match(/([A-G])([#b]?)([0-9])/);
  if (!match) return null;
  return { 
    letter: match[1], 
    accidental: match[2], 
    octave: parseInt(match[3]) 
  };
};

const getStaffY = (letter, octave) => {
  const offsets = { 'C': 0, 'D': -5, 'E': -10, 'F': -15, 'G': -20, 'A': -25, 'B': -30 };
  // Visual transpose: Our audio is around octave 3 (C3). 
  // Treble clef reads well around octave 4 (C4). We visually shift +1 octave.
  const visualOctave = octave + 1; 
  const octDiff = visualOctave - 4;
  return 60 + offsets[letter] - (octDiff * 35);
};

export const StaffNotation = ({ notes }) => {
  if (!notes || notes.length === 0) return null;

  return (
    <div className="w-full mt-4 flex items-center justify-center p-2 bg-white rounded-xl border border-slate-300 shadow-inner">
      <svg width="120" height="80" viewBox="0 0 120 80" className="opacity-90">
        {/* 5 Staff Lines (Y: 10, 20, 30, 40, 50) */}
        {[10, 20, 30, 40, 50].map(y => (
          <line key={y} x1="0" y1={y} x2="120" y2={y} stroke="#000000" strokeWidth="1" />
        ))}
        
        {/* Treble Clef Symbol */}
        <text x="5" y="52" fontSize="55" fontFamily="serif" fill="#000000">𝄞</text>

        {/* Draw Notes */}
        {notes.map((noteStr, idx) => {
          const parsed = parseNote(noteStr);
          if (!parsed) return null;
          
          const y = getStaffY(parsed.letter, parsed.octave);
          const x = 50 + (idx * 15); // stagger slightly to avoid overlap if close, or just stack them.
          // Chords are usually stacked vertically.
          const chordX = 70; // All notes in a chord have the same X
          
          return (
            <g key={idx}>
              {/* Ledger Lines if note is C4(60) or below, or A5(0) or above */}
              {y >= 60 && <line x1={chordX - 10} y1={y} x2={chordX + 10} y2={y} stroke="#000000" strokeWidth="1.5" />}
              {y <= 0 && <line x1={chordX - 10} y1={y} x2={chordX + 10} y2={y} stroke="#000000" strokeWidth="1.5" />}
              
              {/* Accidental */}
              {parsed.accidental && (
                <text x={chordX - 18} y={y + 4} fontSize="15" fill="#000000" fontWeight="bold">
                  {parsed.accidental === '#' ? '♯' : '♭'}
                </text>
              )}
              
              {/* Note Head */}
              <ellipse cx={chordX} cy={y} rx="6" ry="4" fill="#000000" transform={`rotate(-15 ${chordX} ${y})`} />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
