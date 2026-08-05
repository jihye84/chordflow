import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TENSION_ANGLES } from '../data/compassData';
import { getChordName } from '../utils/theory';
import { Volume2 } from 'lucide-react';

export const ProgressionTree = ({ progression, selectedKey, activeIndex, playingSingle }) => {
  const { trunkNodes, boundingBox } = useMemo(() => {
    let nodes = [];
    let curX = 0;
    let curY = 0;
    
    // Determine angle based on numeral directly
    const getAngle = (num) => TENSION_ANGLES[num] !== undefined ? TENSION_ANGLES[num] : 30;

    let toggleRef = 1;
    for (let i = 0; i < progression.chords.length; i++) {
      const chord = progression.chords[i];
      const numeral = chord.numeral;
      
      if (i > 0) {
        let baseAngle = getAngle(numeral);
        let finalAngle = baseAngle;
        if (baseAngle !== 0) {
          finalAngle = baseAngle * toggleRef;
          toggleRef *= -1;
        }
        
        const angleRad = finalAngle * (Math.PI / 180);
        const radius = 220 + (Math.abs(finalAngle) * 0.3); // slightly tighter radius
        curX += Math.sin(angleRad) * radius;
        curY += Math.cos(angleRad) * radius;
      }
      
      nodes.push({ 
        id: i, 
        numeral, 
        x: curX, 
        y: curY,
        role: chord.role,
        roleColor: chord.roleColor 
      });
    }

    const allX = nodes.map(n => n.x);
    const allY = nodes.map(n => n.y);
    
    return {
      trunkNodes: nodes,
      boundingBox: {
        minX: Math.min(...allX),
        maxX: Math.max(...allX),
        minY: Math.min(...allY),
        maxY: Math.max(...allY)
      }
    };
  }, [progression]);

  const cameraProps = useMemo(() => {
    if (trunkNodes.length === 0) return { x: 0, y: 0, scale: 1 };
    
    const { minX, maxX, minY, maxY } = boundingBox;
    const width = maxX - minX + 250; 
    const height = maxY - minY + 250; 
    
    const scaleX = 800 / Math.max(width, 1);
    const scaleY = 350 / Math.max(height, 1);
    const fullScale = Math.min(scaleX, scaleY, 1); 

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    
    return { 
      x: -centerX * fullScale, 
      y: centerY * fullScale, 
      scale: fullScale 
    };
  }, [boundingBox, trunkNodes.length]);

  return (
    <div className="relative w-full h-[400px] bg-slate-900/60 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex justify-center items-center mb-6">
      
      <motion.div 
        animate={{ x: cameraProps.x, y: cameraProps.y, scale: cameraProps.scale }}
        transition={{ type: "spring", damping: 25, stiffness: 120 }}
        className="relative z-10 w-0 h-0"
      >
        <svg className="absolute overflow-visible pointer-events-none" style={{ left: 0, top: 0, width: 1, height: 1 }}>
          <AnimatePresence>
            {trunkNodes.map((n, i) => {
              if (i === 0) return null;
              const prev = trunkNodes[i-1];
              const isActivePath = activeIndex === i || playingSingle === i;
              
              const vx = n.x - prev.x;
              const vy = -n.y - (-prev.y);
              const dist = Math.max(Math.sqrt(vx*vx + vy*vy), 1);
              const perpX = -vy / dist;
              const perpY = vx / dist;
              const bulge = (i % 2 === 0 ? 40 : -40);
              const cpX = prev.x + vx * 0.5 + perpX * bulge;
              const cpY = -prev.y + vy * 0.5 + perpY * bulge;

              return (
                <motion.path 
                  key={`trunk-${i}`}
                  d={`M ${prev.x},${-prev.y} Q ${cpX},${cpY} ${n.x},${-n.y}`}
                  fill="none"
                  stroke={isActivePath ? "#10b981" : "#475569"}
                  strokeWidth={isActivePath ? 16 : 10}
                  strokeLinecap="round"
                  className="transition-colors duration-300"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                />
              );
            })}
          </AnimatePresence>
        </svg>

        <AnimatePresence>
          {trunkNodes.map((n, i) => {
            const isActive = activeIndex === i || playingSingle === i;
            
            let baseClasses = "absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex flex-col items-center justify-center border-2 shadow-lg transition-all duration-300 ";
            
            if (isActive) {
              baseClasses += "bg-slate-900 border-amber-400 w-24 h-24 z-40 ring-4 ring-amber-400/30 shadow-[0_0_25px_rgba(251,191,36,0.5)] scale-110";
            } else {
              baseClasses += "bg-slate-800/90 border-slate-700 w-16 h-16 z-20 opacity-80";
            }

            return (
              <motion.div
                key={`node-${i}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.4, delay: i * 0.02 }}
                className={baseClasses}
                style={{ left: n.x, top: -n.y }}
              >
                <span className={`${isActive ? 'text-2xl' : 'text-lg'} font-black text-slate-100 leading-none mb-1`}>
                  {n.numeral}
                </span>
                <span className={`text-[10px] font-bold ${isActive ? 'text-amber-500' : 'text-slate-500'}`}>
                  {getChordName(selectedKey, n.numeral)}
                </span>
                
                {isActive && (
                  <div className={`absolute -bottom-3 px-2 py-0.5 rounded-full text-[9px] font-bold shadow-md border border-slate-700 bg-slate-900 text-slate-300 whitespace-nowrap`}>
                    {n.role.split(' ')[0]}
                  </div>
                )}
                
                {isActive && (
                  <Volume2 className="absolute -right-1 -bottom-1 w-5 h-5 text-amber-400 animate-pulse bg-slate-900 rounded-full p-1 shadow-md border border-slate-700" />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
