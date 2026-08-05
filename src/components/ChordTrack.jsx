import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playChord, playProgression, stopAudio } from '../utils/audio';
import { Play, Square, Music, Volume2, Settings2, FastForward } from 'lucide-react';
import { getChordNotes, getChordName } from '../utils/theory';
import { StaffNotation } from './StaffNotation';
import { KeySelector } from './KeySelector';
import { ProgressionTree } from './ProgressionTree';

export const ChordTrack = ({ progression, selectedKey, onKeyChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [playingSingle, setPlayingSingle] = useState(-1);
  const [bpm, setBpm] = useState(progression.defaultBpm || 90);
  const [playStyle, setPlayStyle] = useState('block'); // 'block' | 'arpeggio'

  // Sync BPM when progression changes
  useEffect(() => {
    setBpm(progression.defaultBpm || 90);
    setIsPlaying(false);
    setActiveIndex(-1);
    stopAudio();
  }, [progression]);

  const handlePlayAll = async () => {
    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
      setActiveIndex(-1);
      return;
    }
    
    setIsPlaying(true);
    setActiveIndex(0);
    
    // playProgression returns the total duration
    const resolvedChords = progression.chords.map(c => ({
      ...c,
      notes: getChordNotes(selectedKey, c.numeral)
    }));
    const totalDuration = await playProgression(resolvedChords, (idx) => {
      setActiveIndex(idx);
    }, bpm, playStyle);
    
    // Reset after playing
    setTimeout(() => {
      setIsPlaying(false);
      setActiveIndex(-1);
    }, totalDuration * 1000);
  };

  const handlePlayChord = async (chord, idx) => {
    if (isPlaying) return; // Don't interrupt playing all
    setPlayingSingle(idx);
    const notes = getChordNotes(selectedKey, chord.numeral);
    await playChord(notes);
    setTimeout(() => setPlayingSingle(-1), 1000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-6 border-b border-slate-800 pb-5">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Music className="w-5 h-5 text-emerald-500" />
            <span className="text-emerald-400 font-bold tracking-wider text-xs uppercase">{progression.category}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 mb-2">{progression.title}</h2>
          <p className="text-sm sm:text-base text-slate-400 font-medium leading-relaxed max-w-3xl">
            {progression.story || progression.description}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
          {/* Audio Controls (BPM & Style) */}
          <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-2xl border border-slate-700/50 backdrop-blur-sm shadow-inner">
            
            {/* BPM Slider */}
            <div className="flex flex-col px-2 w-[120px]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">BPM</span>
                <span className="text-xs font-mono font-bold text-emerald-400">{bpm}</span>
              </div>
              <input 
                type="range" 
                min="60" max="180" step="5"
                value={bpm}
                onChange={(e) => setBpm(parseInt(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div className="w-px h-8 bg-slate-700/50"></div>

            {/* Play Style Toggle */}
            <div className="flex bg-slate-800/80 rounded-xl p-1">
              <button
                onClick={() => setPlayStyle('block')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${playStyle === 'block' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Block
              </button>
              <button
                onClick={() => setPlayStyle('arpeggio')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${playStyle === 'arpeggio' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Arp
              </button>
            </div>
          </div>

          <button
            onClick={handlePlayAll}
            className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-white shadow-lg transition-all shrink-0 min-w-[150px]
              ${isPlaying 
                ? 'bg-red-500 hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.4)]' 
                : 'bg-emerald-500 hover:bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.3)]'}`}
          >
            {isPlaying ? <Square className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            {isPlaying ? '정지' : '재생'}
          </button>
        </div>
      </div>

      <ProgressionTree 
        progression={progression} 
        selectedKey={selectedKey} 
        activeIndex={activeIndex} 
        playingSingle={playingSingle} 
      />

      <div className="flex flex-col lg:flex-row gap-8 bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-lg">
        
        {/* Left Side: Key Selector */}
        <div className="shrink-0 flex justify-center lg:justify-start lg:sticky lg:top-24 h-fit">
          <KeySelector selectedKey={selectedKey} onKeyChange={onKeyChange} />
        </div>
        
        {/* Divider */}
        <div className="hidden lg:block w-px bg-slate-800 min-h-[220px]"></div>
        
        {/* Chords Timeline (Wrappable) */}
        <div className="flex-1 flex flex-wrap gap-4 justify-center lg:justify-start">
          {progression.chords.map((chord, idx) => (
            <div key={idx} className="w-[120px] sm:w-[130px] flex flex-col items-center group">
              <motion.button
                whileHover={{ scale: isPlaying ? 1 : 1.05, y: isPlaying ? 0 : -4 }}
                whileTap={{ scale: isPlaying ? 1 : 0.95 }}
                onClick={() => handlePlayChord(chord, idx)}
                className={`w-full relative rounded-2xl flex flex-col items-center justify-start pt-4 pb-3 px-2 transition-all duration-300 border-2 min-h-[160px] overflow-hidden
                  ${activeIndex === idx 
                    ? 'bg-slate-900 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)] ring-4 ring-emerald-500/20 z-10 scale-[1.02]' 
                    : playingSingle === idx
                    ? 'bg-slate-900 border-emerald-400 shadow-lg ring-2 ring-emerald-400/30'
                    : 'bg-slate-800/80 border-slate-700/50 shadow hover:border-slate-500'}
                  ${isPlaying ? 'cursor-default' : 'cursor-pointer'}
                `}
              >
                {/* Glassmorphism gradient effect when active */}
                {activeIndex === idx && (
                  <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none"></div>
                )}
                {/* Role Badge inside the card */}
                <div className={`px-2 py-0.5 rounded-md text-[10px] font-bold shadow-sm border border-slate-700 mb-2 w-fit text-center leading-tight bg-slate-900 text-slate-300`}>
                  {chord.role.split(' ')[0]}
                </div>

                <span className={`text-2xl sm:text-3xl font-black mb-0.5 
                  ${activeIndex === idx || playingSingle === idx ? 'text-emerald-400' : 'text-slate-200'}`}>
                  {chord.numeral}
                </span>
                
                <span className="text-xs sm:text-sm font-bold text-amber-500 mb-2">
                  {getChordName(selectedKey, chord.numeral)}
                </span>
                
                <div className="w-full h-px bg-slate-700 my-1"></div>
                
                <div className="scale-90 transform origin-top mt-1">
                  <StaffNotation notes={getChordNotes(selectedKey, chord.numeral)} />
                </div>
                
                {/* Play icon overlay on hover */}
                {!isPlaying && activeIndex !== idx && playingSingle !== idx && (
                  <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/10 rounded-2xl flex items-center justify-center transition-colors">
                    <Volume2 className="w-8 h-8 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}
                
                {/* Active ripple / pulse effect */}
                <AnimatePresence>
                  {(activeIndex === idx || playingSingle === idx) && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0.8 }}
                      animate={{ scale: 1.15, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ 
                        duration: (60 / bpm) * 4, // Sync pulse duration with chord duration
                        repeat: activeIndex === idx ? Infinity : 0, 
                        ease: "easeOut" 
                      }}
                      className="absolute inset-0 border-4 border-emerald-400 rounded-2xl pointer-events-none"
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
