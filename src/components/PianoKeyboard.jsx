import React, { useRef, useEffect } from 'react';

const KEYS = [
  { note: 'C', type: 'white', isFlat: false },
  { note: 'Db', type: 'black', isFlat: true },
  { note: 'D', type: 'white', isFlat: false },
  { note: 'Eb', type: 'black', isFlat: true },
  { note: 'E', type: 'white', isFlat: false },
  { note: 'F', type: 'white', isFlat: false },
  { note: 'Gb', type: 'black', isFlat: true },
  { note: 'G', type: 'white', isFlat: false },
  { note: 'Ab', type: 'black', isFlat: true },
  { note: 'A', type: 'white', isFlat: false },
  { note: 'Bb', type: 'black', isFlat: true },
  { note: 'B', type: 'white', isFlat: false },
];

const PIANO_RANGE = [
  ...KEYS.map(k => ({ ...k, name: `${k.note}2` })),
  ...KEYS.map(k => ({ ...k, name: `${k.note}3` })),
  ...KEYS.map(k => ({ ...k, name: `${k.note}4` })) 
];

const equivalentNotes = {
  'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb',
  'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#'
};

const normalizeNote = (n) => {
  if (!n) return n;
  const pitch = n.slice(0, -1);
  const oct = n.slice(-1);
  const eq = equivalentNotes[pitch];
  return [n, eq ? `${eq}${oct}` : n];
};

export const PianoKeyboard = ({ activeNotes = [], onKeyClick }) => {
  const containerRef = useRef(null);
  const activeSet = new Set(activeNotes.flatMap(normalizeNote));
  const whiteKeys = PIANO_RANGE.filter(k => k.type === 'white');
  const whiteKeyWidth = 32; 

  useEffect(() => {
    if (activeNotes.length > 0 && containerRef.current) {
      const container = containerRef.current;
      
      let minLeft = Infinity;
      let maxRight = -Infinity;
      
      PIANO_RANGE.forEach((key, index) => {
        if (activeSet.has(key.name)) {
          const whiteIndex = PIANO_RANGE.slice(0, index).filter(k => k.type === 'white').length;
          const leftPos = whiteIndex * whiteKeyWidth;
          if (leftPos < minLeft) minLeft = leftPos;
          if (leftPos + whiteKeyWidth > maxRight) maxRight = leftPos + whiteKeyWidth;
        }
      });
      
      if (minLeft !== Infinity) {
        const activeCenter = (minLeft + maxRight) / 2;
        const containerWidth = container.clientWidth;
        const scrollTarget = activeCenter - containerWidth / 2;
        
        container.scrollTo({
          left: scrollTarget,
          behavior: 'smooth'
        });
      }
    }
  }, [activeNotes.join(','), whiteKeyWidth]);
  
  return (
    <div 
      ref={containerRef}
      className="relative w-full overflow-x-auto py-2 scrollbar-hide scroll-smooth"
    >
      <div className="relative flex h-24 border border-slate-700 bg-slate-900 rounded-b-xl overflow-hidden shadow-2xl w-max mx-auto" style={{ minWidth: `${whiteKeys.length * whiteKeyWidth}px` }}>
        
        {whiteKeys.map((wk, i) => {
          const isActive = activeSet.has(wk.name);
          return (
            <div 
              key={wk.name}
              style={{ width: `${whiteKeyWidth}px` }}
              onClick={() => onKeyClick && onKeyClick(wk.name)}
              className={`relative border-r border-slate-700/50 flex flex-col justify-end pb-2 items-center transition-colors duration-300
                ${onKeyClick ? 'cursor-pointer active:bg-slate-200' : ''}
                ${isActive ? 'bg-amber-100 shadow-[inset_0_-15px_30px_rgba(251,191,36,0.6)] z-0' : 'bg-white z-0 hover:bg-slate-100'}
                ${i === whiteKeys.length - 1 ? 'border-r-0' : ''}
              `}
            >
              <div className={`w-2 h-2 rounded-full transition-opacity duration-300 ${isActive ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)] opacity-100' : 'opacity-0'}`} />
            </div>
          );
        })}

        {/* Black keys overlay */}
        {PIANO_RANGE.map((bk, i) => {
          if (bk.type === 'white') return null;
          const whiteIndex = PIANO_RANGE.slice(0, i).filter(k => k.type === 'white').length;
          const isActive = activeSet.has(bk.name);
          
          return (
            <div 
              key={bk.name}
              onClick={(e) => {
                e.stopPropagation(); // Prevent clicking white key underneath
                if (onKeyClick) onKeyClick(bk.name);
              }}
              className={`absolute top-0 h-14 -ml-2.5 rounded-b-md z-10 border-x border-b flex justify-center items-end pb-1.5 transition-colors duration-300
                ${onKeyClick ? 'cursor-pointer active:bg-slate-600' : ''}
                ${isActive ? 'bg-amber-600 border-amber-700 shadow-[0_5px_20px_rgba(245,158,11,0.7)]' : 'bg-slate-800 border-slate-900 hover:bg-slate-700'}
              `}
              style={{ left: `${whiteIndex * whiteKeyWidth}px`, width: '20px' }}
            >
              <div className={`w-1.5 h-1.5 rounded-full transition-opacity duration-300 ${isActive ? 'bg-amber-200 shadow-[0_0_8px_rgba(252,211,77,1)] opacity-100' : 'opacity-0'}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
