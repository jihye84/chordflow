const getRole = (numeral) => {
  const t = { role: '안정 (Tonic)', roleColor: 'bg-blue-100 text-blue-700', roleIcon: '🏠' };
  const s = { role: '전개 (Subdom)', roleColor: 'bg-green-100 text-green-700', roleIcon: '🍃' };
  const d = { role: '긴장 (Dom)', roleColor: 'bg-red-100 text-red-700', roleIcon: '⚡' };
  const m = { role: '색채 (Color)', roleColor: 'bg-purple-100 text-purple-700', roleIcon: '🎨' };

  if (['I', 'IMaj7', 'Imaj7', 'I7', 'i7', 'im7', 'vi', 'vi7', 'iii', 'iii7'].includes(numeral)) return t;
  if (['IV', 'IVMaj7', 'IV7', 'iv', 'iv7', 'ii', 'ii7', 'ii7b5', 'II7'].includes(numeral)) return s;
  if (['V', 'V7', 'V7b9', 'v7', 'V7sus4', 'III7', 'VI7', 'bVII', 'bVII7', 'bVI'].includes(numeral)) return d;
  return m;
};

const makeChords = (numerals) => numerals.map(n => ({ numeral: n, ...getRole(n) }));

export const romanProgressions = [
  
  {
    id: 'canon',
    category: 'Pop & Rock',
    title: '캐논 진행',
    description: '우아하고 완벽한 서사 구조 (Pachelbel)',
    defaultBpm: 90,
    chords: makeChords(['I', 'V', 'vi', 'iii', 'IV', 'I', 'IV', 'V']),
    story: '파헬벨의 캐논으로 유명해진 이 진행은 수백 년이 지난 오늘날에도 수많은 팝송과 클래식에서 사용됩니다. I에서 출발해 계단을 하나씩 내려가듯 흘러가다 다시 I로 돌아오는, 완벽한 서사 구조를 갖고 있습니다.'
  },
  {
    id: 'money',
    category: 'Pop & Rock',
    title: '머니 코드',
    description: '귀에 착 감기는 히트곡 보증 수표',
    defaultBpm: 90,
    chords: makeChords(['I', 'V', 'vi', 'IV']),
    story: '"Let It Be", "With or Without You", "Someone Like You" 등 수천 곡에서 사용된 진행입니다. 밝고(I), 긴장하고(V), 차분해지다가(vi), 포근하게 마무리(IV)되는 구조가 인간의 감정을 본능적으로 자극합니다.'
  },
  {
    id: 'doo_wop',
    category: 'Pop & Rock',
    title: '50년대 두왑 (Doo-Wop)',
    description: '정갈하고 복고적인 감성의 왕도 진행',
    defaultBpm: 90,
    chords: makeChords(['I', 'vi', 'IV', 'V7']),
    story: '"Stand By Me", "Earth Angel" 등 50년대 두왑과 로큰롤의 황금비율 진행입니다. 집(I) → 감성(vi) → 나들이(IV) → 귀가(V7)의 사이클이 끊임없이 반복되며 편안하고 복고적인 감성을 만들어냅니다.'
  },
  {
    id: 'ghibli',
    category: 'Pop & Rock',
    title: '4536 / 지브리 진행',
    description: '아련하고 서정적인 감성을 만드는 진행',
    defaultBpm: 80,
    chords: makeChords(['IV', 'V', 'iii', 'vi']),
    story: '일본에서는 "4536 진행"이라고 불리며, 지브리 스튜디오 음악과 J-Pop에서 많이 사용됩니다. 서브도미넌트(IV)에서 시작해 마이너(vi)로 안착되는 흐름이 아련하고 서정적인 감성을 만들어냅니다.'
  },
  {
    id: 'creep',
    category: 'Unique Mood',
    title: '크립 (Creep) 진행',
    description: '우울함과 처절함을 극대화하는 마법',
    defaultBpm: 75,
    chords: makeChords(['I', 'III7', 'IV', 'iv']),
    story: '라디오헤드의 "Creep"으로 널리 알려진 진행입니다. 장조(I)에서 갑자기 다이아토닉을 벗어난 III7이 등장하며 강한 자극을 주고, 이어지는 IV가 iv(마이너 서브도미넌트)로 찌그러지며 깊은 우울감과 처절함을 자아냅니다.'
  },
  {
    id: 'pop_punk',
    category: 'Pop & Rock',
    title: '팝 펑크 (Pop Punk)',
    description: '2000년대 하이틴 감성의 록 진행',
    defaultBpm: 140,
    chords: makeChords(['vi', 'IV', 'I', 'V']),
    story: '그린데이, 에이브릴 라빈 등 2000년대 팝 펑크와 록 음악을 지배했던 진행입니다. 마이너(vi)로 시작해 반항적인 느낌을 주다가도 금세 I과 V로 이어지며 경쾌하게 달리는 에너지를 만들어냅니다.'
  },
  {
    id: 'disco_vamp',
    category: 'Soul & City Pop',
    title: '디스코 그루브 (Disco Vamp)',
    description: '어깨가 들썩이는 펑크(Funk)와 디스코의 리듬',
    defaultBpm: 120,
    chords: makeChords(['im7', 'IV7', 'im7', 'IV7']),
    story: '마이너(im7)와 도미넌트(IV7) 두 개의 코드만으로 끝없이 리듬을 타게 만드는 마법의 "도리안(Dorian) 그루브"입니다. 70년대 디스코부터 다프트 펑크의 "Get Lucky" 스타일까지, 춤을 유발하는 최고의 뱀프(Vamp) 진행입니다.'
  },
  {
    id: 'kpop_ballad',
    category: 'Pop & Rock',
    title: '발라드 하행 (Ballad Descending)',
    description: '가슴을 울리는 한국형 발라드의 눈물 버튼',
    defaultBpm: 70,
    chords: makeChords(['I', 'V/3', 'vi', 'v7', 'IVMaj7']),
    story: '베이스가 한 계단씩(I → VII → VI) 차분히 내려가며 서사를 쌓아가는 K-Pop 발라드의 정석입니다. 특히 vi 뒤에 등장하는 v7 코드가 감정을 응축시켰다가 IVMaj7에서 왈칵 터뜨리며 슬픔을 극대화합니다.'
  },

  
  {
    id: 'jazz_major_251',
    category: 'Jazz & Blues',
    title: 'Major ii-V-I',
    description: '재즈 음악의 뼈대가 되는 핵심 진행',
    defaultBpm: 90,
    chords: makeChords(['ii7', 'V7', 'Imaj7']),
    story: '재즈에서 가장 중요한 화성 진행입니다. ii7(전개) → V7(긴장) → Imaj7(해결)의 흐름은 마치 활시위를 당겼다 놓는 것처럼 완벽한 긴장과 해결을 만들어냅니다. 모든 재즈 뮤지션이 반드시 익혀야 하는 진행입니다.'
  },
  {
    id: 'jazz_minor_251',
    category: 'Jazz & Blues',
    title: 'Minor ii-V-i',
    description: '마이너 재즈의 찌릿한 긴장과 해결',
    defaultBpm: 85,
    chords: makeChords(['ii7b5', 'V7b9', 'im7']),
    story: '마이너 키의 ii-V-I 진행입니다. ii7♭5(반감7화음)와 V7♭9의 조합은 일반 장조 진행보다 훨씬 날카롭고 어두운 긴장감을 만들어냅니다. 재즈 발라드와 마이너 감성의 곡에서 자주 등장합니다.'
  },
  {
    id: 'bossa_nova',
    category: 'Jazz & Blues',
    title: '보사노바 (Bossa Nova)',
    description: '해변의 여유와 나른한 라틴 감성',
    defaultBpm: 110,
    chords: makeChords(['Imaj7', 'II7', 'ii7', 'V7']),
    story: '"The Girl from Ipanema"로 대표되는 보사노바의 영혼과도 같은 진행입니다. 부드러운 Imaj7 이후 다이아토닉에 없는 뜬금없는 II7(세컨더리 도미넌트)가 등장해 특유의 나른하고 이국적인 긴장감을 부여합니다.'
  },
  {
    id: 'rhythm_changes',
    category: 'Jazz & Blues',
    title: 'Rhythm Changes (A파트)',
    description: '스윙 재즈에서 끊임없이 순환하는 진행',
    defaultBpm: 150,
    chords: makeChords(['Imaj7', 'vi7', 'ii7', 'V7']),
    story: '거쉰의 "I Got Rhythm"에서 비롯된 재즈 스탠다드의 핵심 진행입니다. Imaj7 → vi7 → ii7 → V7의 순환 구조는 스윙, 비밥 등 수많은 재즈곡의 기반이 되었으며, 리듬 체인지를 자유롭게 연주하는 것이 재즈 실력의 척도로 여겨집니다.'
  },

  
  {
    id: 'just_the_two_of_us',
    category: 'Soul & City Pop',
    title: 'Just The Two of Us',
    description: '세련되고 도시적인 시티팝의 교과서',
    defaultBpm: 95,
    chords: makeChords(['IVMaj7', 'III7', 'vi7', 'I7']),
    story: '현대 R&B, 시티팝, 로파이(Lo-fi) 힙합에서 가장 사랑받는 진행입니다. IVMaj7의 몽환적인 시작, III7의 날카로운 긴장, vi7의 쓸쓸한 해결 뒤에 다시 처음으로 돌아가기 위한 I7(세컨더리 도미넌트)의 부드러운 연결이 끝없이 반복하고 싶게 만듭니다.'
  },
  {
    id: 'neo_soul',
    category: 'Soul & City Pop',
    title: '네오 소울 (Neo Soul) 턴어라운드',
    description: '끈적하고 그루비한 현대 R&B의 뼈대',
    defaultBpm: 85,
    chords: makeChords(['ii7', 'v7', 'I7', 'IVMaj7']),
    story: '토닉(I)으로 향하는 대신, 서브도미넌트(IVMaj7)로 향하기 위한 "마이너 ii-V-I" 진행(v7 - I7 - IVMaj7)을 사용합니다. 일반적인 가요의 뻔한 종지법을 피하고 곡 전체에 끈적하고 그루비한 긴장감을 유지하게 해주는 마법 같은 진행입니다.'
  },
  {
    id: 'sad_subdominant_minor',
    category: 'Soul & City Pop',
    title: '애절한 하행 (Subdominant Minor)',
    description: '가슴이 미어지는 애절한 감성 폭발',
    defaultBpm: 75,
    chords: makeChords(['IVMaj7', 'iv7', 'iii7', 'vi7']),
    story: '장조의 IVMaj7가 단조의 iv7로 순간적으로 우울하게 변모한 뒤, 베이스가 반음씩 깎여 내려가는 매우 아름답고 슬픈 진행입니다. 현대 R&B와 J-Pop, K-Pop 발라드의 하이라이트에서 감정을 극대화할 때 단골로 등장합니다.'
  },
  {
    id: 'city_pop_royal_road',
    category: 'Soul & City Pop',
    title: '시티팝 왕도 (Jazzy 4-5-3-6)',
    description: '타케우치 마리야의 "Plastic Love" 바이브',
    defaultBpm: 105,
    chords: makeChords(['IVMaj7', 'V7', 'iii7', 'vi7']),
    story: '일반적인 4536 진행에 모두 세븐스(7th) 코드를 입힌 형태로, 일본 시티팝과 현대 J-Pop을 지배하는 절대적인 "왕도(Royal Road)" 진행입니다. IVMaj7의 반짝이는 세련됨과 도미넌트, 마이너 7th의 재지한 느낌이 섞여 네온사인이 빛나는 80년대 도쿄의 밤거리를 연상케 합니다.'
  },
  {
    id: 'backdoor_cadence',
    category: 'Soul & City Pop',
    title: '백도어 종지 (Backdoor Cadence)',
    description: '뒷문으로 슬며시 들어오는 청량하고 세련된 마침표',
    defaultBpm: 95,
    chords: makeChords(['IVMaj7', 'bVII7', 'Imaj7']),
    story: '정문인 V7 대신, 다이아토닉에 없는 ♭VII7 코드를 사용해 뒷문(Backdoor)으로 토닉(I)에 안착하는 종지법입니다. 서브도미넌트 마이너의 대리 코드로 쓰이며, J-City Pop 특유의 노스탤지어와 청량함을 만들어내는 1등 공신입니다.'
  },
  {
    id: 'jazz_turnaround_1625',
    category: 'Jazz & Blues',
    title: '1-6-2-5 턴어라운드',
    description: '야마시타 타츠로 스타일의 드라이빙 그루브',
    defaultBpm: 110,
    chords: makeChords(['Imaj7', 'vi7', 'ii7', 'V7']),
    story: '야마시타 타츠로의 "Ride on Time", "Sparkle" 같은 청량한 시티팝 드라이빙 뮤직의 근간이 되는 진행입니다. 안정적인 토닉(Imaj7)에서 출발해 순환하는 재즈의 기본 뼈대이며, 영원히 반복되는 해안가 드라이브를 떠오르게 합니다.'
  },

  
  {
    id: 'twelve_bar_blues',
    category: 'Jazz & Blues',
    title: '12-Bar Blues',
    description: '블루스/재즈의 12마디 기본 패턴',
    defaultBpm: 90,
    chords: makeChords(['I7', 'IV7', 'I7', 'I7', 'IV7', 'IV7', 'I7', 'I7', 'V7', 'IV7', 'I7', 'V7']),
    story: '"Johnny B. Goode", "Hound Dog"부터 수많은 재즈 블루스까지, 12마디 블루스 진행은 대중음악의 근간입니다. 도미넌트 7화음(I7, IV7, V7)을 기반으로 하며, 모든 코드에 블루지한 7음이 포함되어 독특한 블루스 색채를 만들어냅니다.'
  },

  
  {
    id: 'andalusian',
    category: 'Unique Mood',
    title: '안달루시안 진행',
    description: '스페인 플라멩코풍의 비장하고 열정적인 진행',
    defaultBpm: 90,
    chords: makeChords(['vi', 'V', 'IV', 'III7']),
    story: '"Stairway to Heaven"의 인트로, "Hit the Road Jack", 플라멩코 음악에서 들을 수 있는 진행입니다. vi에서 III7까지 반음계적으로 하행하는 베이스 움직임이 스페인적 열정과 비장함을 만들어냅니다. III7의 강렬한 도미넌트 색채가 핵심입니다.'
  },
  {
    id: 'subdominant_minor',
    category: 'Unique Mood',
    title: '서브도미넌트 마이너',
    description: '장조 곡 중간에 몽환적인 반전을 주는 진행',
    defaultBpm: 90,
    chords: makeChords(['I', 'iv', 'I']),
    story: '"Yesterday" (비틀즈)에서 들을 수 있는 가장 극적인 색채 변화 기법입니다. 밝은 장조(I) 위에 갑자기 iv(단조 서브도미넌트)가 등장하면, 마치 구름이 햇빛을 가리듯 순간적으로 어둡고 몽환적인 분위기가 만들어집니다. 다시 I로 돌아올 때 해방감이 배가됩니다.'
  },
  {
    id: 'major_line_cliche',
    category: 'Unique Mood',
    title: '장조 클리셰 (Line Cliche)',
    description: '비틀즈와 007 제임스 본드의 첩보물 감성',
    defaultBpm: 90,
    chords: makeChords(['I', 'Iaug', 'I6', 'I7']),
    story: '루트(근음)는 그대로 둔 채, 내부의 한 음만 반음씩 기묘하게 상승(5음 → ♯5음 → 6음 → ♭7음)하는 신비로운 진행입니다. 비틀즈의 곡들이나 스파이/탐정 영화의 테마곡에서 느꼈던 특유의 묘한 긴장감이 바로 이 진행에서 나옵니다.'
  },

  
  {
    id: 'plagal_cadence',
    category: 'Cadence & Buildup',
    title: '아멘 종지 (Plagal Cadence)',
    description: '교회 음악에서 자주 쓰이는 경건하고 편안한 마무리',
    defaultBpm: 90,
    chords: makeChords(['IV', 'I']),
    story: '"아~멘~" 하고 끝날 때 찬송가에서 가장 많이 듣게 되는 코드 진행입니다. 도미넌트(V)의 강한 긴장 없이, 서브도미넌트(IV)에서 토닉(I)으로 부드럽게 해결되어 경건하고 평화로운 느낌을 줍니다.'
  },
  {
    id: 'authentic_cadence',
    category: 'Cadence & Buildup',
    title: '바른 종지 (Authentic Cadence)',
    description: '가장 강력하고 확실한 마침표',
    defaultBpm: 90,
    chords: makeChords(['V', 'I']),
    story: '음악이 "완벽하게 끝났다"는 느낌을 주는 가장 기본적이고 강력한 종지법입니다. V(긴장)에서 I(해결)로 향하는 강한 중력 같은 이끌림이 곡을 깔끔하게 마무리 짓습니다.'
  },
  {
    id: 'deceptive_cadence',
    category: 'Cadence & Buildup',
    title: '거짓 종지 (Deceptive Cadence)',
    description: '끝날 듯 끝나지 않는 극적인 반전',
    defaultBpm: 90,
    chords: makeChords(['V', 'vi']),
    story: '당연히 밝은 토닉(I)으로 갈 줄 알았던 도미넌트(V)가, 예상치 못하게 어두운 마이너(vi)로 빠지면서 청중을 속이는 종지입니다. 곡이 끝나는 척하면서 새로운 전개를 이어갈 때 아주 효과적으로 쓰입니다.'
  },
  {
    id: 'half_cadence',
    category: 'Cadence & Buildup',
    title: '반 종지 (Half Cadence)',
    description: '질문만 남기고 끝나는 열린 결말',
    defaultBpm: 90,
    chords: makeChords(['I', 'IV', 'V']),
    story: '문장의 마침표 대신 쉼표나 물음표를 찍은 것처럼, 도미넌트(V)에서 멈춰서 강한 긴장감과 다음 프레이즈에 대한 기대감을 짙게 남기는 종지입니다.'
  },

  
  {
    id: 'mario_cadence',
    category: 'Cadence & Buildup',
    title: '마리오 종지 (Epic Buildup)',
    description: '슈퍼 마리오에서 스테이지를 클리어할 때 나오는 벅찬 느낌',
    defaultBpm: 120,
    chords: makeChords(['bVI', 'bVII', 'I']),
    story: '모달 인터체인지(Modal Interchange)를 활용한 가장 에픽하고 극적인 빌드업입니다. 원래 키에 없는 ♭VI와 ♭VII 코드를 빌려와 계단을 오르듯 에너지를 팽창시키다가 토닉(I)에서 환희에 차게 터뜨립니다. 게임 음악이나 애니메이션 하이라이트에서 필수적으로 쓰입니다.'
  },
  {
    id: 'prechorus_buildup',
    category: 'Cadence & Buildup',
    title: '프리코러스 계단 (Pre-Chorus)',
    description: '후렴구(Chorus)로 가기 직전에 감정을 고조시키는 진행',
    defaultBpm: 110,
    chords: makeChords(['IV', 'V', 'vi', 'V7sus4']),
    story: '팝송의 프리코러스(Pre-Chorus)에서 후렴구로 넘어가기 직전에 폭발적인 감정을 준비할 때 쓰입니다. 베이스 라인이 IV → V → vi 로 상승하며 감정을 끌어올린 뒤, V7sus4의 아슬아슬한 긴장감 속에서 잠시 멈췄다가 후렴으로 쏟아집니다.'
  },

  // --- World Folk (민요 & 전통) ---
  {
    id: 'la_bamba',
    category: 'World Folk (민요 & 전통)',
    title: '라 밤바 (La Bamba)',
    description: '전 세계의 축제를 지배하는 가장 원초적인 3코드',
    defaultBpm: 130,
    chords: makeChords(['I', 'IV', 'V']),
    story: '멕시코 전통 민요이자 라틴 아메리카를 상징하는 원초적이고 신나는 진행입니다. 복잡한 기교 없이 오직 I(토닉), IV(서브도미넌트), V(도미넌트)의 가장 뼈대가 되는 세 기둥만으로 무한히 돌아가는 에너지를 만들어냅니다.'
  },
  {
    id: 'cuban_montuno',
    category: 'World Folk (민요 & 전통)',
    title: '쿠바 몬투노 (Cuban Montuno)',
    description: '어깨와 골반을 움직이게 만드는 살사의 심장',
    defaultBpm: 130,
    chords: makeChords(['I', 'IV', 'V7', 'IV']),
    story: '쿠바의 손(Son)이나 살사(Salsa) 음악에서 피아노가 끊임없이 반복해서 연주하는 리듬 패턴입니다. 단순한 3개의 코드지만 특유의 당김음(엇박) 리듬과 결합되면 숨 쉴 틈 없이 흥겨운 카리브해의 해변으로 청자를 안내합니다.'
  },
  {
    id: 'argentine_tango',
    category: 'World Folk (민요 & 전통)',
    title: '아르헨티나 탱고 (Tango)',
    description: '부에노스아이레스의 비장하고 관능적인 춤',
    defaultBpm: 100,
    chords: makeChords(['i', 'V7b9', 'V7', 'i']),
    story: '아르헨티나 뒷골목에서 피어난 관능적이고 비장한 춤곡, 탱고의 정석입니다. V7♭9 코드가 주는 날카롭고 찌를 듯한 긴장감이 단조(i)로 격렬하게 해결되며, 마치 서로를 강하게 끌어당기는 남녀의 긴장감 넘치는 스텝을 연상케 합니다.'
  },
  {
    id: 'andean_folk',
    category: 'World Folk (민요 & 전통)',
    title: '안데스의 바람 (Andean Folk)',
    description: '안데스 산맥 잉카 제국의 스산하고 구슬픈 향수',
    defaultBpm: 75,
    chords: makeChords(['i', 'bVII', 'bIII', 'V7']),
    story: '"철새는 날아가고(El Condor Pasa)"로 친숙한 남미 안데스 지역의 잉카 전통 음악입니다. 단조(i)의 어두움과 나란한 장조(♭III)의 밝음을 바쁘게 오가며, 고산지대의 스산한 바람과 인디오들의 구슬픈 역사를 노래합니다.'
  },
  {
    id: 'balinese_gamelan',
    category: 'World Folk (민요 & 전통)',
    title: '발리 가멜란 (Balinese Gamelan)',
    description: '인도네시아 전통 타악 앙상블의 몽환적인 순환',
    defaultBpm: 80,
    chords: makeChords(['I', 'Isus4', 'bVII', 'Isus4']),
    story: '인도네시아 발리섬의 전통 청동 타악기 앙상블인 "가멜란"의 물결치는 듯한 리듬을 서양 코드로 표현했습니다. 화성이 특정 목적지로 향하지 않고(기능적 화성 배제), 일정한 간격으로 영원히 반복되며 몽환적인 트랜스(Trance) 상태를 유발합니다.'
  },
  {
    id: 'celtic_mixolydian',
    category: 'World Folk (민요 & 전통)',
    title: '켈틱 믹솔리디안 (Celtic Folk)',
    description: '광활한 대자연과 고향에 대한 향수',
    defaultBpm: 90,
    chords: makeChords(['I', 'bVII', 'IV', 'I']),
    story: '스코틀랜드와 아일랜드 전통 켈틱(Celtic) 음악에서 주로 쓰이는 "더블 플래이걸(Double Plagal)" 진행입니다. V(도미넌트)를 쓰지 않고 ♭VII를 거쳐 IV에서 I로 돌아오며, 완벽히 끝나는 느낌 없이 광활하고 몽환적인 자연의 분위기를 자아냅니다.'
  },
  {
    id: 'russian_gypsy',
    category: 'World Folk (민요 & 전통)',
    title: '동유럽 / 집시 민요 (Korobeiniki)',
    description: '추운 겨울날 불을 피우고 추는 열정적인 춤',
    defaultBpm: 90,
    chords: makeChords(['i', 'iv', 'V7', 'i']),
    story: '"테트리스" 브금으로 친숙한 러시아 민요 "코로베이니키" 등 동유럽과 집시 음악의 정석입니다. 단조(i, iv)의 춥고 우울한 분위기 속에서도 V7의 강렬한 화성적 긴장이 결합되어, 슬프면서도 열정적인 춤을 추게 만듭니다.'
  },
  {
    id: 'arabian_phrygian',
    category: 'World Folk (민요 & 전통)',
    title: '아라비안 사막 (Middle Eastern)',
    description: '중동과 유대인 음악의 이국적이고 신비로운 분위기',
    defaultBpm: 90,
    chords: makeChords(['I', 'bII', 'I', 'iv']),
    story: '아랍 음악이나 클레즈머(Klezmer) 등에서 쓰이는 "프리지안 도미넌트(Phrygian Dominant)" 스케일의 소리입니다. I(장조)와 ♭II(장조) 사이의 아슬아슬한 반음 간격이 마치 뜨거운 사막의 모래바람이 부는 듯한 신비로운 긴장감을 만들어냅니다.'
  },
  {
    id: 'oriental_pentatonic',
    category: 'World Folk (민요 & 전통)',
    title: '동양의 수묵화 (Oriental Pentatonic)',
    description: '여백의 미를 살린 동아시아 전통의 평온함',
    defaultBpm: 90,
    chords: makeChords(['I', 'vi', 'ii', 'vi']),
    story: '한국, 중국, 일본 등 동아시아 전통 음악의 근간이 되는 5음계(Pentatonic)의 정서를 서양 코드로 표현한 진행입니다. 불협화음을 유발하는 4음과 7음(파, 시)을 피하여, 물이 흐르듯 평온하고 명상적이며 여백이 느껴지는 것이 특징입니다.'
  },
  {
    id: 'african_mbube',
    category: 'World Folk (민요 & 전통)',
    title: '아프리카 합창 (Mbube)',
    description: '눈부시게 밝고 원초적인 아프리카의 긍정 에너지',
    defaultBpm: 110,
    chords: makeChords(['I', 'IV', 'I', 'V']),
    story: '아프리카 남부 줄루족의 전통 합창 스타일에서 유래한 진행으로, 라이온 킹의 "The Lion Sleeps Tonight (Wimoweh)"이 대표적입니다. 가장 순수하고 폭발적인 기쁨과 긍정의 에너지를 뿜어냅니다.'
  },
  {
    id: 'desert_blues',
    category: 'World Folk (민요 & 전통)',
    title: '사하라 사막 블루스 (Desert Blues)',
    description: '블루스의 진정한 뿌리이자 강인한 생명력',
    defaultBpm: 90,
    chords: makeChords(['i', 'bVII', 'iv', 'i']),
    story: '서양 "블루스(Blues)"의 근원인 아프리카 말리와 사하라 사막 유목민들의 음악입니다. 단조(i)와 ♭VII의 투박한 결합이 척박한 사막의 고독함 속에서도 리듬을 타는 강인한 생명력을 묘사합니다.'
  },
  {
    id: 'native_american_spirit',
    category: 'World Folk (민요 & 전통)',
    title: '아메리카 원주민 (Native Spirit)',
    description: '대자연과 동화되는 영적이고 경건한 의식',
    defaultBpm: 70,
    chords: makeChords(['i', 'bIII', 'bVII', 'i']),
    story: '아메리카 원주민(인디언)의 플루트 연주나 부족 의식에서 영감을 받은 단조 5음계(Minor Pentatonic) 기반의 진행입니다. 깊은 계곡에 바람이 부는 듯한 영적이고 경건한 분위기를 자아냅니다.'
  },
  {
    id: 'indian_raga_drone',
    category: 'World Folk (민요 & 전통)',
    title: '인도 라가 드론 (Indian Raga)',
    description: '시간이 멈춘 듯한 무한한 최면과 명상',
    defaultBpm: 60,
    chords: makeChords(['I', 'Isus4', 'I', 'Isus4']),
    story: '인도 전통 음악은 서양처럼 화성이 역동적으로 진행되지 않고, 하나의 중심음(Drone)을 끝없이 울리며 그 위에서 선율(Raga)이 춤을 춥니다. 코드가 I과 Isus4 사이에서만 미세하게 요동치며, 청자를 최면에 걸린 듯한 몽환적인 명상 상태로 이끕니다.'
  },
];

export const PRESET_CATEGORIES = ['Pop & Rock', 'Soul & City Pop', 'Jazz & Blues', 'Cadence & Buildup', 'World Folk (민요 & 전통)', 'Unique Mood'];
