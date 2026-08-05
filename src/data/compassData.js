export const TENSION_ANGLES = {
  'I': 0,
  'IMaj7': 15,
  'I6': 25,
  'vi': 45,
  'vi7': 55,
  'iii': 65,
  'iii7': 75,
  'IV': 90,
  'IVMaj7': 105,
  'IV6': 115,
  'ii': 125,
  'ii7': 135,
  'V7': 150,
  'V7sus4': 160,
  'V9': 170,
  'vii°': 180,
  'Vaug': 180,
  'Iaug': 180,
  '#ivm7b5': 180
};

export const chordCompassData = {
  'I': {
    role: '🏠 집 (Tonic)',
    roleColor: 'text-blue-700 bg-blue-100 border-blue-200',
    transitions: [
      { next: 'V7', probability: 35 },
      { next: 'IV', probability: 25 },
      { next: 'vi', probability: 15 },
      { next: 'ii', probability: 10 },
      { next: 'IMaj7', probability: 10 },
      { next: 'Iaug', probability: 5 },
    ],
    tip: '으뜸화음(I)에서는 자유로운 진행이 가능합니다. V7이나 IV로 가는 전통적인 길 외에, IMaj7으로 세련된 텐션을 더하거나 Iaug로 붕 뜨는 듯한 몽환적인 전개를 시도해보세요.'
  },
  'IMaj7': {
    role: '🏠 집 (Tonic Maj7)',
    roleColor: 'text-sky-700 bg-sky-100 border-sky-200',
    transitions: [
      { next: 'IVMaj7', probability: 40 },
      { next: 'vi7', probability: 30 },
      { next: 'ii7', probability: 20 },
      { next: 'V7', probability: 10 },
    ],
    tip: 'IMaj7은 매우 안정적이면서도 세련된 재즈의 고향입니다. 여기서 IVMaj7으로 이동하면 아름다운 구름 위를 걷는 듯한 화성을 만들 수 있습니다.'
  },
  'Iaug': {
    role: '✨ 신비 (Augmented)',
    roleColor: 'text-fuchsia-700 bg-fuchsia-100 border-fuchsia-200',
    transitions: [
      { next: 'IV', probability: 50 },
      { next: 'vi', probability: 30 },
      { next: 'ii', probability: 20 },
    ],
    tip: '증화음(Aug)은 극도의 불안정함을 통해 신비로운 느낌을 줍니다. 보통 타겟 코드(IV나 vi)로 부드럽게 반음계적으로 미끄러지듯 이동할 때 사용합니다.'
  },
  'IV': {
    role: '☁️ 구름 (Subdominant)',
    roleColor: 'text-green-700 bg-green-100 border-green-200',
    transitions: [
      { next: 'V7', probability: 40 },
      { next: 'I', probability: 30 },
      { next: 'ii', probability: 15 },
      { next: 'IVMaj7', probability: 10 },
      { next: 'vii°', probability: 5 },
    ],
    tip: 'IV화음은 다재다능합니다. I로 돌아가 평온함을 찾거나(아멘 종지), V7으로 가 긴장감을 고조시키세요.'
  },
  'IVMaj7': {
    role: '☁️ 구름 (Subdominant Maj7)',
    roleColor: 'text-teal-700 bg-teal-100 border-teal-200',
    transitions: [
      { next: 'V7sus4', probability: 40 },
      { next: 'V7', probability: 30 },
      { next: 'IMaj7', probability: 20 },
      { next: 'iii7', probability: 10 },
    ],
    tip: 'IVMaj7은 곡의 분위기를 순식간에 로맨틱하게 만듭니다. 여기서 V7sus4로 가면 세련된 재즈-팝 발라드의 정석적인 진행이 됩니다.'
  },
  'V7': {
    role: '⚡ 긴장 (Dominant)',
    roleColor: 'text-red-700 bg-red-100 border-red-200',
    transitions: [
      { next: 'I', probability: 50 },
      { next: 'IMaj7', probability: 20 },
      { next: 'vi', probability: 15 },
      { next: 'Vaug', probability: 10 },
      { next: 'V9', probability: 5 },
    ],
    tip: '속화음(V7)은 I로 돌아가려는 아주 강한 끌림이 있습니다. 가끔 Vaug나 V9을 거쳐 해결을 지연시키며 긴장을 극대화해 보세요.'
  },
  'V7sus4': {
    role: '⏳ 지연 (Dominant Sus)',
    roleColor: 'text-orange-700 bg-orange-100 border-orange-200',
    transitions: [
      { next: 'V7', probability: 60 },
      { next: 'I', probability: 25 },
      { next: 'IMaj7', probability: 15 },
    ],
    tip: 'Sus4 화음은 3음을 4음으로 대체하여 붕 뜬 긴장감을 줍니다. 보통 본래의 V7으로 해결된 뒤 I로 가는 것이 자연스럽습니다.'
  },
  'Vaug': {
    role: '🔥 극도의 긴장 (Dom Aug)',
    roleColor: 'text-rose-700 bg-rose-100 border-rose-200',
    transitions: [
      { next: 'I', probability: 70 },
      { next: 'IMaj7', probability: 30 },
    ],
    tip: 'Vaug는 V7보다 한층 더 날카롭고 강렬한 긴장감을 제공하며, 오직 집(I)으로 당장 달려가고 싶게 만듭니다.'
  },
  'V9': {
    role: '✨ 화려한 긴장 (Dom 9)',
    roleColor: 'text-pink-700 bg-pink-100 border-pink-200',
    transitions: [
      { next: 'IMaj7', probability: 60 },
      { next: 'I', probability: 40 },
    ],
    tip: 'V9은 클래식한 V7 위에 텐션 9음을 얹어 훨씬 풍부하고 재즈적인 뉘앙스를 주는 고급 도미넌트 화음입니다.'
  },
  'vi': {
    role: '🌲 숲 (Submediant)',
    roleColor: 'text-purple-700 bg-purple-100 border-purple-200',
    transitions: [
      { next: 'IV', probability: 35 },
      { next: 'ii', probability: 25 },
      { next: 'V7', probability: 20 },
      { next: 'vi7', probability: 15 },
      { next: 'iii', probability: 5 },
    ],
    tip: 'vi화음은 슬프거나 감성적인 진행을 만들 때 필수적입니다. IV나 ii로 내려가며 부드러운 흐름을 만들어 보세요.'
  },
  'vi7': {
    role: '🌲 깊은 숲 (Submediant 7)',
    roleColor: 'text-indigo-700 bg-indigo-100 border-indigo-200',
    transitions: [
      { next: 'ii7', probability: 50 },
      { next: 'IVMaj7', probability: 30 },
      { next: 'V7sus4', probability: 20 },
    ],
    tip: 'vi7에서 ii7으로 이어지는 강진행은 재즈와 R&B에서 가장 흔하고 감미로운 흐름을 만들어냅니다.'
  },
  'ii': {
    role: '🏃 진행 (Supertonic)',
    roleColor: 'text-emerald-700 bg-emerald-100 border-emerald-200',
    transitions: [
      { next: 'V7', probability: 50 },
      { next: 'vi', probability: 25 },
      { next: 'ii7', probability: 15 },
      { next: '#ivm7b5', probability: 10 },
    ],
    tip: 'ii화음은 IV와 비슷한 역할을 하지만 조금 더 세련된 느낌을 줍니다. 보통 V7으로 진행하는 투-파이브(ii-V) 패턴의 시작점이 됩니다.'
  },
  'ii7': {
    role: '🏃 재즈 진행 (Supertonic 7)',
    roleColor: 'text-cyan-700 bg-cyan-100 border-cyan-200',
    transitions: [
      { next: 'V7', probability: 40 },
      { next: 'V7sus4', probability: 30 },
      { next: 'V9', probability: 20 },
      { next: 'iii7', probability: 10 },
    ],
    tip: 'ii7은 투-파이브-원(ii7-V7-IMaj7) 재즈 진행의 완벽한 출발점입니다. V7 계열의 화음으로 강하게 끌려갑니다.'
  },
  'iii': {
    role: '🍂 이음새 (Mediant)',
    roleColor: 'text-amber-700 bg-amber-100 border-amber-200',
    transitions: [
      { next: 'vi', probability: 60 },
      { next: 'IV', probability: 40 },
    ],
    tip: 'iii화음은 다소 모호한 성격을 가져서, 다음 목적지인 vi나 IV로 매끄럽게 연결해주는 브릿지 역할을 주로 합니다.'
  },
  'iii7': {
    role: '🍂 재즈 이음새 (Mediant 7)',
    roleColor: 'text-yellow-700 bg-yellow-100 border-yellow-200',
    transitions: [
      { next: 'vi7', probability: 70 },
      { next: 'IVMaj7', probability: 30 },
    ],
    tip: 'iii7-vi7-ii7-V7-IMaj7 으로 이어지는 5도권 하행 진행은 재즈에서 가장 사랑받는 강력하고 논리적인 화성 흐름입니다!'
  },
  'vii°': {
    role: '🌪️ 불안 (Diminished)',
    roleColor: 'text-slate-700 bg-slate-100 border-slate-200',
    transitions: [
      { next: 'I', probability: 60 },
      { next: 'iii', probability: 40 },
    ],
    tip: '감화음(Diminished)은 극도로 불안정하여 무조건 옆에 있는 안정적인 화음(I 또는 iii)으로 미끄러져 들어가려 합니다.'
  },
  '#ivm7b5': {
    role: '🌉 경과음 (Half-Dim)',
    roleColor: 'text-stone-700 bg-stone-100 border-stone-200',
    transitions: [
      { next: 'IVMaj7', probability: 60 },
      { next: 'V7', probability: 40 },
    ],
    tip: '#ivm7b5는 베이스 라인을 반음계적으로 하행시킬 때(V -> #iv -> IV) 자주 쓰이는 굉장히 세련된 징검다리 코드입니다.'
  }
};
