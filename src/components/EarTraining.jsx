import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeySelector } from './KeySelector';
import { PianoKeyboard } from './PianoKeyboard';
import { StaffNotation } from './StaffNotation';
import { getChordNotes, getChordName, ALL_KEYS } from '../utils/theory';
import { playChord, stopAudio } from '../utils/audio';
import { Play, Volume2, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

const QUALITIES = [
  { id: 'I', label: 'Major' },
  { id: 'i', label: 'Minor' },
  { id: 'I7', label: 'Dom 7' },
  { id: 'IMaj7', label: 'Maj 7' },
  { id: 'i7', label: 'Min 7' },
  { id: 'Isus4', label: 'sus4' },
  { id: 'Iaug', label: 'aug' },
  { id: 'idim', label: 'dim' },
  { id: 'im7b5', label: 'm7b5' },
  { id: 'I6', label: 'Major 6' }
];

export const EarTraining = ({ selectedKey, onKeyChange }) => {
  const [currentQuality, setCurrentQuality] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'incorrect' | null
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [previewQuality, setPreviewQuality] = useState(null);
  const [arpeggioNotes, setArpeggioNotes] = useState([]);
  const [currentProblemKey, setCurrentProblemKey] = useState(selectedKey === 'Random' ? 'C' : selectedKey);

  const generateProblem = () => {
    stopAudio();
    const randomQ = QUALITIES[Math.floor(Math.random() * QUALITIES.length)].id;
    const randomK = selectedKey === 'Random' ? ALL_KEYS[Math.floor(Math.random() * ALL_KEYS.length)] : selectedKey;
    setCurrentQuality(randomQ);
    setCurrentProblemKey(randomK);
    setFeedback(null);
    setPreviewQuality(null);
    playProblem(randomQ, randomK);
  };

  const playProblem = async (quality = currentQuality, problemKey = currentProblemKey) => {
    if (!quality) return;
    setIsPlaying(true);
    setPreviewQuality(null); // Clear preview when playing the actual problem again
    const notes = getChordNotes(problemKey, quality);
    await playChord(notes);
    setTimeout(() => setIsPlaying(false), 1500);
  };

  // playChoicePreview removed as it's replaced by handleChoiceClick

  // Initial load or key change -> new problem
  useEffect(() => {
    generateProblem();
  }, [selectedKey]);

  const playSuccessArpeggio = async (quality) => {
    stopAudio();
    setIsPlaying(true);
    setPreviewQuality(null);
    setArpeggioNotes([]); // Reset

    const notes = getChordNotes(currentProblemKey, quality);
    
    // Play one by one
    let currentArp = [];
    for (let i = 0; i < notes.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      currentArp = [...currentArp, notes[i]];
      setArpeggioNotes(currentArp);
      await playChord([notes[i]], "8n");
    }

    // Wait a bit, then play the full chord
    await new Promise(resolve => setTimeout(resolve, 500));
    await playChord(notes, "2n");
    
    setTimeout(() => setIsPlaying(false), 1500);
  };

  const handleGuess = (qId) => {
    if (feedback === 'correct') return; // already guessed

    if (qId === currentQuality) {
      setFeedback('correct');
      setScore(s => s + 1);
      setAttempts(a => a + 1);
      setStreak(s => s + 1);
      playSuccessArpeggio(qId);
    } else {
      setFeedback('incorrect');
      setAttempts(a => a + 1);
      setStreak(0);
      setPreviewQuality(null); // Clear preview on wrong guess
      playProblem(currentQuality); // play again on incorrect guess
    }
  };

  const handleChoiceClick = (qId) => {
    if (feedback === 'correct') return;

    if (previewQuality !== qId) {
      // 첫 번째 클릭: 미리듣기
      setPreviewQuality(qId);
      const notes = getChordNotes(currentProblemKey, qId);
      playChord(notes);
    } else {
      // 두 번째 클릭: 정답 제출
      handleGuess(qId);
    }
  };

  // arpeggioNotes is used for the visual feedback, but fallback if empty
  const allNotes = currentQuality ? getChordNotes(currentProblemKey, currentQuality) : [];
  const activeVisualNotes = feedback === 'correct' ? arpeggioNotes : [];

  const chordName = currentQuality ? getChordName(currentProblemKey, currentQuality) : '';

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 mb-4">
      
      <div className="bg-slate-900/60 backdrop-blur-2xl rounded-3xl border border-white/10 p-4 sm:p-6 shadow-2xl flex flex-col items-center">
        
        <div className="w-full flex justify-between items-start mb-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-black text-slate-100">귀 훈련 (Ear Training)</h2>
            <p className="text-slate-400 text-sm font-medium">선택된 기준음(Root)으로 만들어진 화음의 종류를 맞춰보세요!</p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <KeySelector selectedKey={selectedKey} onKeyChange={onKeyChange} allowRandom={true} />
            <div className="flex gap-2 items-center mt-2">
              {/* Streak Indicator */}
              <AnimatePresence>
                {streak > 1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    key={`streak-${streak}`}
                    className="flex items-center gap-1 bg-gradient-to-r from-orange-500/20 to-rose-500/20 border border-orange-500/30 px-3 py-1 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.2)]"
                  >
                    <motion.span 
                      animate={{ scale: [1, 1.3, 1] }} 
                      transition={{ duration: 0.3 }}
                      className="text-lg"
                    >
                      🔥
                    </motion.span>
                    <span className="font-black text-orange-400 italic tracking-wider text-sm">{streak} COMBO!</span>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="text-sm font-bold text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700 h-fit">
                점수: <span className="text-emerald-400">{score}</span> / {attempts}
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-24 h-24 mb-4 flex justify-center items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => playProblem()}
            className={`absolute z-10 w-20 h-20 rounded-full flex justify-center items-center border-4 transition-colors
              ${isPlaying ? 'bg-amber-500 border-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.6)]' : 'bg-slate-800 border-slate-600 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(251,191,36,0.4)]'}
            `}
          >
            {isPlaying ? <Volume2 className="w-8 h-8 text-white animate-pulse" /> : <Play className="w-8 h-8 text-white fill-current ml-1" />}
          </motion.button>
          
          {isPlaying && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0.8 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute w-20 h-20 rounded-full bg-amber-500/50 z-0"
            />
          )}
        </div>

        <AnimatePresence mode="wait">
          {feedback === 'correct' ? (
            <motion.div
              key="correct-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full flex flex-col items-center gap-6"
            >
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
                  <CheckCircle2 className="w-5 h-5" /> 정답입니다!
                </div>
                <div className="text-3xl font-black text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">
                  {chordName}
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-6 w-full justify-center">
                <div className="w-full flex-1">
                  <PianoKeyboard 
                    activeNotes={activeVisualNotes} 
                    onKeyClick={(note) => {
                      stopAudio();
                      playChord([note], "8n");
                    }} 
                  />
                </div>
                <button 
                  onClick={() => playSuccessArpeggio(currentQuality)}
                  className="bg-white/90 p-2 rounded-xl shadow-md shrink-0 self-center cursor-pointer hover:bg-white hover:scale-105 hover:shadow-lg transition-all active:scale-95 group relative"
                  title="클릭하여 한 번 더 듣기"
                >
                  <StaffNotation notes={activeVisualNotes.length > 0 ? activeVisualNotes : []} />
                  <div className="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 bg-black/5 rounded-xl transition-opacity">
                    <Play className="w-8 h-8 text-slate-800 drop-shadow-md" />
                  </div>
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={generateProblem}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-5 py-2 rounded-full shadow-lg mt-2 text-sm"
              >
                <RefreshCw className="w-4 h-4" /> 다음 문제
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="question-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full flex flex-col items-center gap-4"
            >
              <AnimatePresence>
                {feedback === 'incorrect' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-rose-500 font-bold bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-full"
                  >
                    <XCircle className="w-5 h-5" /> 틀렸습니다. 다시 듣고 맞춰보세요!
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="text-center bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50 w-full max-w-lg mb-2">
                <p className="text-sm font-bold text-slate-300">
                  👆 <span className="text-sky-400">한 번 클릭</span>하면 미리듣기, <span className="text-emerald-400">두 번 클릭</span>(더블클릭)하면 정답 제출!
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 w-full">
                {QUALITIES.map(q => {
                  const isSelected = previewQuality === q.id;
                  return (
                    <button
                      key={q.id}
                      onClick={() => handleChoiceClick(q.id)}
                      onContextMenu={(e) => e.preventDefault()}
                      className={`relative flex flex-col items-center justify-center pt-3 pb-3 px-2 border rounded-xl transition-all shadow-md overflow-hidden group
                        ${isSelected 
                          ? 'bg-sky-900/60 border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.5)]' 
                          : 'bg-slate-800/80 hover:bg-slate-700 border-slate-600 hover:border-sky-400 hover:shadow-[0_0_15px_rgba(56,189,248,0.3)]'}
                      `}
                    >
                      <span className={`font-black text-sm transition-colors ${isSelected ? 'text-white' : 'text-slate-300'} ${isSelected ? 'mb-2' : ''}`}>
                        {q.label}
                      </span>
                      {isSelected && (
                        <div className="absolute bottom-0 w-full bg-emerald-500 text-slate-900 text-[10px] font-black py-0.5 animate-pulse">
                          클릭하여 제출
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {previewQuality && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
                    exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    className="w-full flex flex-col items-center gap-3 mt-4 pt-4 border-t border-slate-700/50"
                  >
                    <div className="text-sky-400 font-bold text-sm bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
                      미리보기: {getChordName(currentProblemKey, previewQuality)}
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-6 w-full max-w-2xl justify-center bg-slate-800/50 p-4 rounded-2xl shadow-inner">
                      <div className="scale-75 origin-center -m-4">
                        <PianoKeyboard 
                          activeNotes={getChordNotes(currentProblemKey, previewQuality)} 
                          onKeyClick={(note) => {
                            stopAudio();
                            playChord([note], "8n");
                          }}
                        />
                      </div>
                      <div className="bg-white/90 p-2 rounded-xl shadow-md shrink-0">
                        <StaffNotation notes={getChordNotes(currentProblemKey, previewQuality)} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
