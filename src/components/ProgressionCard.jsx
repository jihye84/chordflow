import React from 'react';
import { motion } from 'framer-motion';

export const ProgressionCard = ({ progression, isSelected, onClick }) => {
  return (
    <motion.button
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl text-left w-full transition-all duration-200 border flex items-center justify-between gap-4
        ${isSelected 
          ? 'bg-slate-800/80 border-emerald-500 shadow-md ring-1 ring-emerald-500' 
          : 'bg-slate-900/40 border-white/10 hover:bg-slate-800/60 hover:shadow-sm hover:border-emerald-500/50'}`}
    >
      <div className="flex items-center gap-3 shrink-0 w-1/3">
        <h3 className={`text-sm font-bold truncate ${isSelected ? 'text-emerald-400' : 'text-slate-300'}`}>
          {progression.title}
        </h3>
        {isSelected && (
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        )}
      </div>
      
      <div className="flex flex-wrap md:flex-nowrap overflow-hidden gap-1.5 justify-end opacity-90 w-2/3">
        {progression.chords.map((chord, idx) => (
          <div 
            key={idx}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold border whitespace-nowrap
              ${isSelected 
                ? 'bg-emerald-900/40 border-emerald-500/50 text-emerald-300' 
                : 'bg-slate-800 border-slate-700 text-slate-400'}`}
          >
            {chord.numeral}
          </div>
        ))}
      </div>
    </motion.button>
  );
};
