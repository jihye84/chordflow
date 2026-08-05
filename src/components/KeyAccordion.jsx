import React, { useState } from 'react';
import { ALL_KEYS } from '../utils/theory';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Music } from 'lucide-react';

export const KeyAccordion = ({ selectedKey, onKeyChange }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white/60 backdrop-blur-md border border-brand-200 rounded-3xl overflow-hidden shadow-sm flex flex-col h-full max-h-[70vh]">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between bg-white border-b border-brand-100 text-brand-800 font-bold hover:bg-brand-50 transition-colors"
      >
        <span className="flex items-center gap-2">
          <Music className="w-5 h-5" />
          Key 선택
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-y-auto custom-scrollbar"
          >
            <div className="p-2 flex flex-col gap-1">
              {ALL_KEYS.map((keyName) => (
                <button
                  key={keyName}
                  onClick={() => onKeyChange(keyName)}
                  className={`px-4 py-3 rounded-xl text-left text-sm font-bold transition-all duration-200
                    ${selectedKey === keyName 
                      ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                >
                  {keyName} Major
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
