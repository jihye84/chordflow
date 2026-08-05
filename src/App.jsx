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
          <>
            <section className="mb-6 text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-100 mb-2">코드 진행이 만드는 이야기</h2>
              <p className="text-sm text-slate-400">
                화음(Chord)들이 모여 어떤 감정을 전달하는지 확인해보세요.
              </p>
            </section>

            <section className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-500" />
                  진행 프리셋 선택
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${selectedCategory === cat
                        ? 'bg-emerald-500 text-slate-900 shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1.5 max-h-[300px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-800 rounded-xl">
                {filteredProgressions.map((prog) => (
                  <ProgressionCard
                    key={prog.id}
                    progression={prog}
                    isSelected={selectedProgression.id === prog.id}
                    onClick={() => setSelectedProgression(prog)}
                  />
                ))}
              </div>
            </section>

            <section className="mb-8">
              <ChordTrack progression={selectedProgression} selectedKey={selectedKey} onKeyChange={setSelectedKey} />
            </section>
          </>
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
