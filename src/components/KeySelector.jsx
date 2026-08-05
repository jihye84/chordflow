import React from 'react';
import { ALL_KEYS } from '../utils/theory';
import { Dices, ChevronLeft, ChevronRight } from 'lucide-react';

export const KeySelector = ({ selectedKey, onKeyChange, allowRandom = false }) => {
  const keysList = allowRandom ? [...ALL_KEYS, 'Random'] : ALL_KEYS;
  const currentIndex = keysList.indexOf(selectedKey) === -1 ? 0 : keysList.indexOf(selectedKey);

  const handlePrev = () => {
    const nextIndex = (currentIndex - 1 + keysList.length) % keysList.length;
    onKeyChange(keysList[nextIndex]);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % keysList.length;
    onKeyChange(keysList[nextIndex]);
  };

  return (
    <div className="flex items-center w-fit gap-1 bg-slate-900/80 backdrop-blur-md rounded-xl border border-white/10 p-1 shadow-lg">
      <button 
        onClick={handlePrev}
        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <div className="flex flex-col items-center justify-center min-w-[44px]">
        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-[-2px]">Key</div>
        <div className="flex items-center justify-center text-lg font-black text-emerald-400 leading-none h-6">
          {selectedKey === 'Random' ? <Dices className="w-5 h-5 text-emerald-400" /> : selectedKey}
        </div>
      </div>
      
      <button 
        onClick={handleNext}
        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};
