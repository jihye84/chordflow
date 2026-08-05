import React, { useState } from 'react';
import { romanProgressions, PRESET_CATEGORIES } from './data/progressions';
import { ProgressionCard } from './components/ProgressionCard';
import { ChordTrack } from './components/ChordTrack';
import { ChordCompass } from './components/ChordCompass';
import { EarTraining } from './components/EarTraining';
import { Music, BookOpen, VolumeX, Compass, Library } from 'lucide-react';
import * as Tone from 'tone';
import { KeySelector } from './components/KeySelector';

function App() {
  const [appMode, setAppMode] = useState('compass');
  const [selectedKey, setSelectedKey] = useState('G');
  const [selectedProgression, setSelectedProgression] = useState(romanProgressions.find(p => p.id === 'canon') || romanProgressions[0]);
  const [audioStarted, setAudioStarted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Pop & Rock');

  const categories = [...PRESET_CATEGORIES, 'All'];
  const filteredProgressions = selectedCategory === 'All'
    ? romanProgressions
    : romanProgressions.filter(p => p.category === selectedCategory);

  const handleFirstInteraction = async () => {
    if (!audioStarted) {
      await Tone.start();
      setAudioStarted(true);
    }
  };

  const handleModeChange = (mode) => {
    setAppMode(mode);
    if (mode === 'compass') {
      setSelectedKey('G');
    } else {
      setSelectedKey('C');
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-950 font-sans selection:bg-emerald-500/30 flex flex-col text-slate-200"
      onClick={handleFirstInteraction}
    >
      <main className="max-w-5xl mx-auto w-full px-4 py-6 flex-1 flex flex-col">

        {/* Mode Toggle at top of main */}
        <div className="flex bg-slate-900/50 p-1.5 rounded-full border border-white/10 shadow-inner w-fit mx-auto mb-6">
          <button
            onClick={() => handleModeChange('compass')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${appMode === 'compass'
              ? 'bg-emerald-500 text-slate-900 shadow-lg shadow-emerald-500/25'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
          >
            <Compass className="w-4 h-4" />
            코드 나침반
          </button>
          <button
            onClick={() => handleModeChange('preset')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${appMode === 'preset'
              ? 'bg-emerald-500 text-slate-900 shadow-lg shadow-emerald-500/25'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
          >
            <Library className="w-4 h-4" />
            프리셋 탐구
          </button>
          <button
            onClick={() => handleModeChange('eartraining')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${appMode === 'eartraining'
              ? 'bg-emerald-500 text-slate-900 shadow-lg shadow-emerald-500/25'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
          >
            <Music className="w-4 h-4" />
            귀 훈련
          </button>
        </div>

        {!audioStarted && (
          <div className="flex items-center justify-center gap-2 mb-4 text-orange-500 bg-orange-50 px-3 py-1.5 rounded-md w-fit mx-auto border border-orange-200">
            <VolumeX className="w-4 h-4" />
            <span className="font-semibold text-xs sm:text-sm">클릭하여 오디오 활성화</span>
          </div>
        )}

        {appMode === 'preset' && (
          <section className="flex flex-col h-full gap-4">
            {/* 드롭다운 셀렉터 (가장 위) */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 bg-slate-900/60 p-4 rounded-3xl border border-white/10 shadow-lg mt-2 mx-auto w-fit z-10">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Library className="w-5 h-5 text-emerald-500" />
                  <span className="text-slate-300 font-bold text-sm">카테고리</span>
                </div>
                <select 
                  className="bg-slate-800 text-slate-100 border border-slate-700 rounded-xl px-4 py-2 outline-none focus:border-emerald-500 font-bold text-sm cursor-pointer shadow-inner appearance-none pr-8 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2310b981%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:10px_10px] bg-[right_12px_center]"
                  value={selectedCategory}
                  onChange={e => {
                    setSelectedCategory(e.target.value);
                    const newFiltered = e.target.value === 'All' ? romanProgressions : romanProgressions.filter(p => p.category === e.target.value);
                    if (newFiltered.length > 0) setSelectedProgression(newFiltered[0]);
                  }}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="hidden sm:block w-px h-8 bg-slate-700/50"></div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-500" />
                  <span className="text-slate-300 font-bold text-sm">프리셋</span>
                </div>
                <select
                  className="bg-slate-800 text-slate-100 border border-slate-700 rounded-xl px-4 py-2 outline-none focus:border-emerald-500 font-bold text-sm cursor-pointer shadow-inner max-w-[220px] sm:max-w-[300px] truncate appearance-none pr-8 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2310b981%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:10px_10px] bg-[right_12px_center]"
                  value={selectedProgression.id}
                  onChange={e => setSelectedProgression(romanProgressions.find(p => p.id === e.target.value))}
                >
                  {filteredProgressions.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>
            </div>

            <div className="flex-1 w-full">
              <ChordTrack progression={selectedProgression} selectedKey={selectedKey} onKeyChange={setSelectedKey} />
            </div>
          </section>
        )}

        {appMode === 'compass' && (
          <ChordCompass selectedKey={selectedKey} onKeyChange={setSelectedKey} />
        )}

        {appMode === 'eartraining' && (
          <EarTraining selectedKey={selectedKey} onKeyChange={setSelectedKey} />
        )}

      </main>
    </div>
  );
}

export default App;
