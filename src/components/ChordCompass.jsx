import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chordCompassData, TENSION_ANGLES } from '../data/compassData';
import { getChordName, getChordNotes } from '../utils/theory';
import { playChord, playProgression, stopAudio } from '../utils/audio';
import { Compass, Play, Square, RotateCcw, Volume2, Info, Network, ZoomIn, ZoomOut, Eraser } from 'lucide-react';
import { KeySelector } from './KeySelector';

export const ChordCompass = ({ selectedKey, onKeyChange }) => {
  const [history, setHistory] = useState(['I']);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [hoveredChord, setHoveredChord] = useState(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [playingSingle, setPlayingSingle] = useState(-1);
  const [isFullView, setIsFullView] = useState(false);
  const [manualZoom, setManualZoom] = useState(1);

  const handlePreview = async (numeral) => {
    setHoveredChord(numeral);
    const notes = getChordNotes(selectedKey, numeral);
    await playChord(notes);
  };

  const handleSelectNext = async (numeral) => {
    setHistory(prev => [...prev, numeral]);
    const notes = getChordNotes(selectedKey, numeral);
    await playChord(notes);
    // If we are in full view and clicking branches, maybe we stay in full view, or return to local.
    // Staying in full view is fine, the camera will just re-adjust to fit the new larger tree.
  };

  const handlePlayAll = async () => {
    if (isPlayingAll) {
      stopAudio();
      setIsPlayingAll(false);
      setActiveIndex(-1);
      return;
    }

    setIsPlayingAll(true);
    setActiveIndex(0);
    
    const chordsToPlay = history.map(numeral => ({
      numeral,
      notes: getChordNotes(selectedKey, numeral)
    }));

    const totalDuration = await playProgression(chordsToPlay, (idx) => {
      setActiveIndex(idx);
    }, 160);
    
    setTimeout(() => {
      setIsPlayingAll(false);
      setActiveIndex(-1);
    }, totalDuration * 1000);
  };

  const handleReset = () => {
    setHistory(['I']);
    stopAudio();
    setIsPlayingAll(false);
    setActiveIndex(-1);
    setIsFullView(false); // Reset view as well
    setManualZoom(1);
  };

  const handleUndo = () => {
    if (history.length > 1) {
      setHistory(prev => prev.slice(0, -1));
      stopAudio();
      setIsPlayingAll(false);
      setActiveIndex(-1);
    }
  };

  const handlePlayHistoryChord = async (numeral, idx) => {
    if (isPlayingAll) return; 
    setPlayingSingle(idx);
    const notes = getChordNotes(selectedKey, numeral);
    await playChord(notes);
    setTimeout(() => setPlayingSingle(-1), 1000); 
  };

  // Calculate tree positions
  const { trunkNodes, finalBranches, boundingBox } = useMemo(() => {
    let nodes = [];
    let curX = 0;
    let curY = 0;

    // Helper to calculate exact same relative coords for both trunk and branches
    const getRelCoords = (trans, transitionsList, tempToggleRef) => {
      let baseAngle = TENSION_ANGLES[trans.next] !== undefined ? TENSION_ANGLES[trans.next] : 30;
      let finalAngle = baseAngle;
      if (baseAngle !== 0) {
        finalAngle = baseAngle * tempToggleRef.current;
        tempToggleRef.current *= -1; 
      }
      const angleRad = finalAngle * (Math.PI / 180);
      const radius = 150 + (Math.abs(finalAngle) * 0.2); // Reduced from 260 for compact view
      const relX = Math.sin(angleRad) * radius;
      const relY = Math.cos(angleRad) * radius;
      return { finalAngle, relX, relY };
    };

    // Calculate trunk (history path)
    for (let i = 0; i < history.length; i++) {
      const numeral = history[i];
      
      if (i > 0) {
        const prevNumeral = history[i-1];
        const prevInfo = chordCompassData[prevNumeral];
        let toggleRef = { current: 1 };
        
        for (const trans of prevInfo.transitions) {
          const coords = getRelCoords(trans, prevInfo.transitions, toggleRef);
          if (trans.next === numeral) {
            curX += coords.relX;
            curY += coords.relY;
            break;
          }
        }
      }
      nodes.push({ id: i, numeral, x: curX, y: curY });
    }

    const finalNode = nodes[nodes.length - 1];
    const chordInfo = chordCompassData[finalNode.numeral];
    
    // Calculate final branches
    let branchToggleRef = { current: 1 };
    const branches = chordInfo.transitions.map((trans) => {
      const coords = getRelCoords(trans, chordInfo.transitions, branchToggleRef);
      return { 
        ...trans, 
        x: finalNode.x + coords.relX, 
        y: finalNode.y + coords.relY, 
        angle: coords.finalAngle, 
        relX: coords.relX, 
        relY: coords.relY 
      };
    });

    const allX = [...nodes.map(n => n.x), ...branches.map(b => b.x)];
    const allY = [...nodes.map(n => n.y), ...branches.map(b => b.y)];
    
    return {
      trunkNodes: nodes,
      finalBranches: branches,
      boundingBox: {
        minX: Math.min(...allX),
        maxX: Math.max(...allX),
        minY: Math.min(...allY),
        maxY: Math.max(...allY)
      }
    };
  }, [history]);

  const finalNode = trunkNodes[trunkNodes.length - 1];
  const chordInfo = chordCompassData[finalNode.numeral];

  const cameraProps = useMemo(() => {
    if (history.length === 0) return { x: 0, y: 0, scale: 1 };
    
    if (isFullView) {
      const { minX, maxX, minY, maxY } = boundingBox;
      const width = maxX - minX + 300; 
      const height = maxY - minY + 300; 
      
      const scaleX = 800 / Math.max(width, 1);
      const scaleY = 400 / Math.max(height, 1);
      const fullScale = Math.min(scaleX, scaleY, 1); 

      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      
      return { 
        x: -centerX * fullScale, 
        y: centerY * fullScale, 
        scale: fullScale 
      };
    } else { 
      return { 
        x: -finalNode.x * 0.7, 
        y: finalNode.y * 0.7, 
        scale: 0.7 
      }; 
    }
  }, [isFullView, boundingBox, finalNode, history.length]);

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-4 my-4">
      <div 
        className="relative w-full h-[45vh] min-h-[350px] max-h-[450px] bg-slate-900/60 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex justify-center items-center"
        onWheel={(e) => setManualZoom(z => Math.max(0.3, Math.min(4, z - e.deltaY * 0.002)))}
      >
        
        <div className="absolute top-4 left-4 z-50">
          <KeySelector selectedKey={selectedKey} onKeyChange={onKeyChange} />
        </div>

        <button 
          onClick={() => { setIsFullView(!isFullView); setManualZoom(1); }}
          className="absolute bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2 bg-slate-800/90 backdrop-blur-md shadow-lg rounded-xl border border-white/10 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/50 font-bold text-xs transition-all"
        >
          {isFullView ? <ZoomIn className="w-4 h-4" /> : <ZoomOut className="w-4 h-4" />}
          {isFullView ? '부분 보기' : '전체 보기'}
        </button>

        <motion.div 
          drag
          dragConstraints={{ left: -1500, right: 1500, top: -1500, bottom: 1500 }}
          dragElastic={0.1}
          animate={{ x: cameraProps.x, y: cameraProps.y, scale: cameraProps.scale * manualZoom }}
          transition={{ type: "spring", damping: 25, stiffness: 120 }}
          className="absolute inset-[-2000px] cursor-grab active:cursor-grabbing flex items-center justify-center z-10"
        >
          <div className="relative w-0 h-0">
            <svg className="absolute overflow-visible pointer-events-none" style={{ left: 0, top: 0, width: 1, height: 1 }}>
            
            <AnimatePresence>
              {trunkNodes.map((n, i) => {
                if (i === 0) return null;
                const prev = trunkNodes[i-1];
                const isActivePath = activeIndex === i || playingSingle === i;
                
                // Organic bezier curve calculation
                const vx = n.x - prev.x;
                const vy = -n.y - (-prev.y);
                const dist = Math.max(Math.sqrt(vx*vx + vy*vy), 1);
                const perpX = -vy / dist;
                const perpY = vx / dist;
                const bulge = (i % 2 === 0 ? 50 : -50);
                const cpX = prev.x + vx * 0.5 + perpX * bulge;
                const cpY = -prev.y + vy * 0.5 + perpY * bulge;

                return (
                  <motion.path 
                    key={`trunk-${i}`}
                    d={`M ${prev.x},${-prev.y} Q ${cpX},${cpY} ${n.x},${-n.y}`}
                    fill="none"
                    stroke={isActivePath ? "#10b981" : "#475569"}
                    strokeWidth={isActivePath ? 18 : 14}
                    strokeLinecap="round"
                    className="transition-colors duration-300"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    exit={{ pathLength: 0, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  />
                );
              })}
            </AnimatePresence>

            <AnimatePresence mode="popLayout">
              {!isFullView && finalBranches.map((b, idx) => {
                const isHighest = idx === 0;
                
                // Organic bezier curve calculation
                const vx = b.x - finalNode.x;
                const vy = -b.y - (-finalNode.y);
                const dist = Math.max(Math.sqrt(vx*vx + vy*vy), 1);
                const perpX = -vy / dist;
                const perpY = vx / dist;
                const bulge = (idx % 2 === 0 ? 50 : -50);
                const cpX = finalNode.x + vx * 0.5 + perpX * bulge;
                const cpY = -finalNode.y + vy * 0.5 + perpY * bulge;

                return (
                  <motion.path 
                    key={`branch-${b.next}-${history.length}`}
                    d={`M ${finalNode.x},${-finalNode.y} Q ${cpX},${cpY} ${b.x},${-b.y}`} 
                    fill="none" 
                    stroke={isHighest ? "#38bdf8" : "#0369a1"}
                    strokeWidth={4 + (b.probability / 3.5)} 
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_6px_rgba(56,189,248,0.3)]"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                  />
                );
              })}
            </AnimatePresence>
          </svg>

          <AnimatePresence>
            {trunkNodes.map((n, i) => {
              const isFinal = i === trunkNodes.length - 1;
              const isActive = activeIndex === i || playingSingle === i;
              
              let baseClasses = "absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex flex-col items-center justify-center border-2 shadow-lg cursor-pointer transition-all duration-300 ";
              
              if (isActive) {
                baseClasses += isFinal 
                  ? "bg-slate-900 border-amber-400 w-28 h-28 z-40 ring-4 ring-amber-400/30 shadow-[0_0_30px_rgba(251,191,36,0.5)] scale-110 hover:ring-8 hover:ring-amber-400/50 hover:shadow-[0_0_50px_rgba(251,191,36,0.8)]" 
                  : "bg-slate-900 border-amber-500/60 w-20 h-20 z-40 ring-4 ring-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.3)] scale-110";
              } else if (isFinal && !isFullView) {
                baseClasses += "bg-slate-900 border-amber-400 w-28 h-28 z-30 ring-2 ring-amber-400/20 shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:z-50 hover:ring-8 hover:ring-amber-400/50 hover:shadow-[0_0_50px_rgba(251,191,36,0.8)] hover:scale-105";
              } else if (isFinal && isFullView) {
                baseClasses += "bg-slate-800 border-slate-600 w-28 h-28 z-30 hover:bg-slate-700 hover:z-50";
              } else {
                baseClasses += "bg-slate-800/90 border-slate-700 w-16 h-16 z-20 hover:bg-slate-700 hover:z-50 opacity-90";
              }

              return (
                <motion.div
                  key={`node-${i}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", duration: 0.4 }}
                  className={baseClasses}
                  style={{ left: n.x, top: -n.y }}
                  onMouseEnter={() => handlePreview(n.numeral)}
                  onMouseLeave={() => setHoveredChord(null)}
                >
                  <span className={`${isFinal ? 'text-4xl' : 'text-xl'} font-black leading-none mb-1 
                    ${isFinal ? 'text-amber-400' : isActive ? 'text-slate-100' : 'text-slate-500'}`}>
                    {n.numeral}
                  </span>
                  <span className={`${isFinal ? 'text-base' : 'text-[10px]'} font-bold 
                    ${isFinal ? 'text-amber-500/80' : isActive ? 'text-slate-300' : 'text-slate-600'}`}>
                    {getChordName(selectedKey, n.numeral)}
                  </span>
                  
                  {isFinal && (
                    <div className={`absolute -bottom-3 px-3 py-0.5 rounded-full text-[10px] font-bold shadow-md border border-slate-700 bg-slate-900 text-slate-400 whitespace-nowrap`}>
                      {chordInfo.role.split(' ')[0]} {chordInfo.role.split(' ').slice(1).join(' ')}
                    </div>
                  )}
                  
                  {(hoveredChord === n.numeral || isActive) && (
                    <Volume2 className={`absolute ${isFinal ? '-right-1 -bottom-1 w-6 h-6' : '-right-2 -bottom-2 w-5 h-5'} ${isActive ? 'text-amber-400' : 'text-slate-500'} animate-pulse bg-slate-900 rounded-full p-1 shadow-md border border-slate-700`} />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          <AnimatePresence mode="popLayout">
            {!isFullView && finalBranches.map((b, idx) => {
              const isHighest = idx === 0;
              return (
                <motion.button
                  key={`bnode-${b.next}-${history.length}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + (idx * 0.05), type: "spring" }}
                  whileHover={{ scale: 1.1, zIndex: 50 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => handlePreview(b.next)}
                  onMouseLeave={() => setHoveredChord(null)}
                  onClick={() => handleSelectNext(b.next)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl flex flex-col items-center justify-center p-3 shadow-lg transition-all cursor-pointer
                    ${isHighest 
                      ? 'bg-slate-100 border-2 border-sky-400 w-24 h-24 shadow-[0_0_20px_rgba(56,189,248,0.5)] hover:bg-white hover:border-sky-300 hover:shadow-[0_0_30px_rgba(56,189,248,0.8)]' 
                      : 'bg-slate-200 border-2 border-sky-400/40 w-20 h-20 shadow-[0_0_10px_rgba(14,165,233,0.2)] hover:bg-slate-100 hover:border-sky-400 hover:shadow-[0_0_20px_rgba(56,189,248,0.6)]'
                    }
                  `}
                  style={{ left: b.x, top: -b.y, zIndex: 40 - idx }}
                >
                  <span className={`text-2xl font-black leading-none mb-1 
                    ${isHighest ? 'text-slate-900' : 'text-slate-500'}`}>
                    {b.next}
                  </span>
                  <span className={`text-[11px] font-bold 
                    ${isHighest ? 'text-slate-700' : 'text-slate-400'}`}>
                    {getChordName(selectedKey, b.next)}
                  </span>
                  
                  <div className={`absolute -top-3 px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap shadow-md border
                    ${isHighest ? 'bg-sky-500 text-white border-sky-400 shadow-sky-500/50' : 'bg-slate-300 text-slate-600 border-slate-400'}
                  `}>
                    {b.probability}%
                  </div>

                  {hoveredChord === b.next && (
                    <Volume2 className="absolute -right-2 -bottom-2 w-5 h-5 text-slate-400 animate-pulse bg-slate-900 rounded-full p-0.5 shadow-sm border border-slate-700" />
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 h-[120px]">
        {/* Guide */}
        <div className="md:w-[260px] shrink-0 bg-slate-900/60 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex flex-col gap-1.5 shadow-lg overflow-y-auto">
          <div className="flex items-center gap-1.5 mb-1">
            <Info className="w-4 h-4 text-emerald-500 shrink-0" />
            <h4 className="font-bold text-emerald-500 text-[11px]">화성학 가이드</h4>
          </div>
          <p className="text-slate-300 font-medium text-[11px] leading-relaxed">
            {chordInfo.tip}
          </p>
        </div>

        {/* History */}
        <div className="flex-1 min-w-0 bg-slate-900/60 backdrop-blur-md rounded-2xl p-3 border border-white/10 shadow-lg flex flex-col">
          <div className="flex items-center justify-between gap-3 mb-2 px-1">
            <h3 className="text-slate-200 font-bold text-xs flex items-center gap-1.5 shrink-0">
              <Network className="w-3.5 h-3.5 text-emerald-500" />
              진행 히스토리
            </h3>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                초기화
              </button>
              <button
                onClick={handleUndo}
                disabled={history.length <= 1}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors border
                  ${history.length <= 1 ? 'text-slate-600 bg-slate-800/50 border-slate-800/50 cursor-not-allowed' : 'text-slate-300 bg-slate-800 border-slate-700 hover:bg-slate-700'}
                `}
              >
                <Eraser className="w-3 h-3" />
                지우기
              </button>
              <button
                onClick={handlePlayAll}
                disabled={history.length === 0}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold text-white transition-all
                  ${history.length === 0 ? 'bg-slate-700 cursor-not-allowed' :
                    isPlayingAll 
                    ? 'bg-red-500 hover:bg-red-600 shadow-[0_0_10px_rgba(239,68,68,0.4)]' 
                    : 'bg-emerald-500 hover:bg-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.3)]'}`}
              >
                {isPlayingAll ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
                {isPlayingAll ? '정지' : '전체 재생'}
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-nowrap items-center gap-1.5 p-1.5 bg-slate-800/50 rounded-xl overflow-x-auto overflow-y-hidden border border-white/5 scrollbar-thin">
            <AnimatePresence>
              {history.map((numeral, idx) => {
                const isActive = activeIndex === idx || playingSingle === idx;
                return (
                  <React.Fragment key={idx}>
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                      onClick={() => handlePlayHistoryChord(numeral, idx)}
                      className={`shrink-0 flex flex-col items-center border px-2 py-1.5 rounded-lg shadow-sm min-w-[50px] cursor-pointer transition-all
                        ${isActive 
                          ? 'bg-slate-800 border-amber-400 ring-1 ring-amber-400/30 shadow-[0_0_10px_rgba(251,191,36,0.3)]' 
                          : 'bg-slate-800/50 border-slate-700 hover:border-sky-400 hover:shadow-[0_0_10px_rgba(56,189,248,0.3)]'
                        }
                        ${isPlayingAll ? 'pointer-events-none' : ''}
                      `}
                    >
                      <span className={`text-base font-black leading-none mb-0.5 ${isActive ? 'text-amber-400' : 'text-slate-300'}`}>
                        {numeral}
                      </span>
                      <span className={`text-[9px] font-bold ${isActive ? 'text-amber-500' : 'text-slate-500'}`}>
                        {getChordName(selectedKey, numeral)}
                      </span>
                    </motion.button>
                    {idx < history.length - 1 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.1 } }}
                        className="shrink-0 text-slate-600 font-black text-[10px]"
                      >
                        ➔
                      </motion.div>
                    )}
                  </React.Fragment>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
