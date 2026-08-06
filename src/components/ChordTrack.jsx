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
    <div className="w-full max-w-6xl mx-auto my-4">
      {/* 1-Row Header */}
      <div className="flex flex-col lg:flex-row items-center justify-between mb-4 gap-4 bg-slate-900/60 p-4 rounded-3xl border border-slate-800 shadow-lg">
        
        {/* Title & Story */}
        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-center gap-2 mb-1">
            <Music className="w-4 h-4 text-emerald-500" />
            <span className="text-emerald-400 font-bold tracking-wider text-[10px] uppercase">{progression.category}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100 truncate">{progression.title}</h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium truncate">
            {progression.story || progression.description}
          </p>
        </div>
        
        {/* Mini-map */}
        <div className="hidden lg:block shrink-0 w-[140px]">
          <ProgressionTree 
            progression={progression} 
            selectedKey={selectedKey} 
            activeIndex={activeIndex} 
            playingSingle={playingSingle} 
          />
        </div>

        {/* Key Selector */}
        <div className="shrink-0 flex items-center">
          <KeySelector selectedKey={selectedKey} onKeyChange={onKeyChange} />
        </div>

        {/* Audio Controls (BPM & Style) */}
        <div className="shrink-0 flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/50">
          {/* BPM Slider */}
          <div className="flex flex-col px-2 w-[80px] sm:w-[100px]">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">BPM</span>
              <span className="text-[10px] font-mono font-bold text-emerald-400">{bpm}</span>
            </div>
            <input 
              type="range" 
              min="60" max="180" step="5"
              value={bpm}
              onChange={(e) => setBpm(parseInt(e.target.value))}
              className="w-full accent-emerald-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="w-px h-6 bg-slate-700/50"></div>

          {/* Play Style Toggle */}
          <div className="flex bg-slate-900/80 rounded-xl p-0.5">
            <button
              onClick={() => setPlayStyle('block')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${playStyle === 'block' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Blk
            </button>
            <button
              onClick={() => setPlayStyle('arpeggio')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${playStyle === 'arpeggio' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Arp
            </button>
          </div>
        </div>

        {/* Play Button */}
        <button
          onClick={handlePlayAll}
          className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl font-bold text-white shadow-lg transition-all shrink-0 min-w-[90px] text-sm
            ${isPlaying 
              ? 'bg-red-500 hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.4)]' 
              : 'bg-emerald-500 hover:bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.3)]'}`}
        >
          {isPlaying ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          {isPlaying ? '정지' : '재생'}
        </button>
      </div>

      {/* 1-Row Timeline */}
      <div className="flex w-full gap-2 sm:gap-3 bg-slate-900/60 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-white/10 shadow-lg overflow-hidden">
        {progression.chords.map((chord, idx) => (
          <div key={idx} className="flex-1 min-w-0 flex flex-col items-center group">
            <motion.button
              whileHover={{ scale: isPlaying ? 1 : 1.05, y: isPlaying ? 0 : -4 }}
              whileTap={{ scale: isPlaying ? 1 : 0.95 }}
              onClick={() => handlePlayChord(chord, idx)}
              className={`w-full relative rounded-2xl flex flex-col items-center justify-start pt-3 pb-2 px-1 transition-all duration-300 border-2 h-full min-h-[140px] overflow-hidden
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
                      key="pulse"
                      initial={{ scale: 0.9, opacity: 0.8 }}
                      animate={{ scale: 1.15, opacity: 0 }}
                      exit={{ opacity: 0, transition: { duration: 0.1 } }}
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
  );
};
