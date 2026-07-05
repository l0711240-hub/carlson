// ══════════════════════════════════════════════════════
// BOSS MOB SYSTEM
// ══════════════════════════════════════════════════════
const BOSS_DEFS = {
  // 졸업작품스튜디오 1 → 박선미/박선미/박선미 중 무작위
  'M1707.000300': {
    name:'박선미', title:'교수', color:'#4ade80', size:28,
    quote:'설계 컨셉이 뭔가요?',
    ability:'rangedattack', attackCooldown:150, projectileSpeed:2.2,
    quakeColor:'rgba(74,222,128,0.15)',
    randomNames:['박선미','박선미','박선미'],
  },
  // 졸업작품스튜디오 2 → 박선미/박선미/박선미 중 무작위
  'M1707.000400': {
    name:'박선미', title:'교수', color:'#4ade80', size:28,
    quote:'다시 해오세요.',
    ability:'slowfield', fieldRadius:120,
    quakeColor:'rgba(74,222,128,0.15)',
    randomNames:['박선미','박선미','박선미'],
  },
  // 졸업논문세미나 1 → 정동준/정동준 중 무작위
  'M1707.001000': {
    name:'정동준', title:'교수', color:'#38bdf8', size:28,
    quote:'논문 방향성이 불분명합니다.',
    ability:'stun', stunDuration:90, stunCooldown:240,
    quakeColor:'rgba(56,189,248,0.15)',
    randomNames:['정동준','정동준'],
  },
  // 졸업논문세미나 2 → 정동준/정동준 중 무작위
  'M1707.001100': {
    name:'정동준', title:'교수', color:'#38bdf8', size:28,
    quote:'선행연구 검토가 부족해요.',
    ability:'rangedattack', attackCooldown:160, projectileSpeed:2.0,
    quakeColor:'rgba(56,189,248,0.15)',
    randomNames:['정동준','정동준'],
  },
  // 농식품정보체계론 → 장경호: 5초 속도 절반
  'M1683.000400': {
    name:'장경호', title:'교수',
    color:'#c084fc', size:26,
    quote:'음...',
    ability:'slow_debuff',
    slowDuration:300, slowCooldown:360,
    quakeColor:'rgba(192,132,252,0.15)',
  },
  // 지역개발론 → 정상우: 지진파 + 원거리 공격
  '5202.202': {
    name:'정상우', title:'교수',
    color:'#f87171', size:26,
    quote:'호남의 높은 출산율은\n지역 차별의 적응행위',
    ability:'rangedattack',
    attackCooldown:180,   // 3초마다 발사
    projectileSpeed:2.5,
    quakeColor:'rgba(248,113,113,0.15)',
  },
  // 경제수학 → 장경호: 0.5초 스턴 (10초마다)
  'M2649.001600': {
    name:'장경호', title:'교수',
    color:'#fbbf24', size:26,
    quote:'야코비 행렬 j',
    ability:'stun',
    stunDuration:30,      // 0.5초
    stunCooldown:600,     // 10초마다
    quakeColor:'rgba(251,191,36,0.15)',
  },
  // 지속가능 지역계획론 → 정동준: 팀플 1초 스턴 (20초마다)
  '5202.203A': {
    name:'정동준', title:'교수',
    color:'#67e8f9', size:26,
    quote:'팀플',
    ability:'stun',
    stunDuration:60,      // 1초
    stunCooldown:1200,    // 20초마다
    quakeColor:'rgba(103,232,249,0.15)',
  },
  // 경제수학(경제학부) → 정동준: 말풍선 + 경제수학 진도 1 깎음 (학기 종료 10초 전 발동 안함)
  '212.214': {
    name:'정동준', title:'교수',
    color:'#818cf8', size:26,
    quote:'바둑 18급 모여봐야 18급',
    ability:'hitreduce',
    hitReduceCooldown:600, // 10초마다
    quakeColor:'rgba(129,140,248,0.15)',
  },
  '208.219': {
    name:'정상우', title:'교수',
    color:'#34d399', size:26,
    quote:'아주 흥미로운\n연구라고 생각하네',
    ability:'pull',
    pullRadius:160,
    pullStrength:1.2,
    quakeColor:'rgba(52,211,153,0.15)',
  },
  // 생물지형학과 실험 → 정상우: 동일 능력
  'M0000.021500': {
    name:'정상우', title:'교수',
    color:'#34d399', size:26,
    quote:'아주 흥미로운\n연구라고 생각하네',
    ability:'pull',
    pullRadius:160,
    pullStrength:1.2,
    quakeColor:'rgba(52,211,153,0.15)',
  },
  // ── 산림환경학 보스 ───────────────────────────────────
  // 조림학 및 실습 → 김영순: 1초 정지 or 2초 정지 + 원격 공격
  'M1698.001200': {
    name:'김영순', title:'교수',
    color:'#86efac', size:26,
    quote:'태화산 실습',   // alternates between quotes
    ability:'parkpil_combo',
    stunCooldown:900, stunDuration:60,
    attackCooldown:200, projectileSpeed:2.6, attackTimer:0, critChance:0.3,
    quotes:['태화산 실습','남부학술림 실습','실습 보고서'],
    quoteWeights:[0.4, 0.3, 0.3],
    quakeColor:'rgba(134,239,172,0.15)',
  },
  // 산림생태학 및 실습 → 김영순: 동일 (1초/1초 정지 + 원격공격)
  '5241.214A': {
    name:'김영순', title:'교수',
    color:'#86efac', size:26,
    quote:'태화산 실습',
    ability:'parkpil_combo',
    stunCooldown:900, stunDuration:60,
    attackCooldown:200, projectileSpeed:2.6, attackTimer:0, critChance:0.3,
    quotes:['태화산 실습','남부학술림 실습','실습 보고서'],
    quoteWeights:[0.4, 0.4, 0.2],
    quakeColor:'rgba(134,239,172,0.15)',
  },
  // 산림토양학 및 실습 → 김영순: 1초 정지만
  '5241.219': {
    name:'김영순', title:'교수',
    color:'#86efac', size:26,
    quote:'태화산 실습',
    ability:'parkpil_combo',
    stunCooldown:900, stunDuration:60,
    attackCooldown:280, projectileSpeed:2.6, attackTimer:0, critChance:0.2,
    quotes:['태화산 실습'],
    quakeColor:'rgba(134,239,172,0.15)',
  },
  // 수목생리학 → 장경호: 쪽지시험 클릭게임
  '5241.321': {
    name:'장경호', title:'교수',
    color:'#4ade80', size:26,
    quote:'쪽지시험',
    ability:'quiz_click',
    attackCooldown:480, attackTimer:0,
    quakeColor:'rgba(74,222,128,0.15)',
  },
  // 산림곤충학 및 실험 → 김영순: 원격공격만
  'M1698.000400': {
    name:'김영순', title:'교수',
    color:'#fde68a', size:26,
    quote:'곤충채집 과제',
    ability:'rangedattack',
    attackCooldown:200,
    projectileSpeed:2.8,
    quakeColor:'rgba(253,230,138,0.15)',
  },
  // 수목학 → 김영순: 1초 정지 + 진도 -1 (3가지 말풍선 랜덤, 학기 종료 10초 전 발동 안함)
  'M1698.001100': {
    name:'김영순', title:'교수',
    color:'#a3e635', size:26,
    quote:'태백산 시험',
    ability:'forest_jang',
    quotes:['태백산 시험','남부학술림 실습','오대산 실습'],
    actionCooldown:900,
    stunDuration:60,
    targetCode:'M1698.001100', // 수목학 진도 깎기
    quakeColor:'rgba(163,230,53,0.15)',
  },
  // 산림평가학 및 실습 → 김영순: 실습 클릭게임
  'M1698.002700': {
    name:'김영순', title:'교수',
    color:'#67e8f9', size:26,
    quote:'실습 보고서',
    ability:'critique_click',
    attackCooldown:480, attackTimer:0,
    quakeColor:'rgba(103,232,249,0.15)',
  },
  // 생태수문학 및 실습 → 정상우: 원격공격
  'M1698.002400': {
    name:'정상우', title:'교수',
    color:'#93c5fd', size:26,
    quote:'실습 보고서',
    ability:'rangedattack',
    attackCooldown:210,
    projectileSpeed:2.6,
    quakeColor:'rgba(147,197,253,0.15)',
  },

  // ── 신규 보스 ─────────────────────────────────────────

  // 공간정보분석1 (M0000.029300) → 정상우: 도트뎀 or 실습 클릭게임
  'M0000.029300': {
    name:'정상우', title:'교수',
    color:'#60a5fa', size:26,
    quote:'이게 과제인지\n의심스러운 정도입니다',
    ability:'dot_or_critique',
    dotDps:4, dotDuration:180, dotCooldown:300,
    attackCooldown:480, attackTimer:0,
    quakeColor:'rgba(96,165,250,0.15)',
  },

  // 공간정보분석 2 (M0000.028600) → 정상우: 도트뎀 or 실습 클릭게임
  'M0000.028600': {
    name:'정상우', title:'교수',
    color:'#e879f9', size:26,
    quote:'이게 과제인지 의심스러운 정도입니다',
    ability:'dot_or_critique',
    dotDps:4, dotDuration:180, dotCooldown:420,
    attackCooldown:480, attackTimer:0,
    quakeColor:'rgba(232,121,249,0.15)',
  },

  // 공간정보분석 3 (M1310.001100) → 정상우: 도트뎀 or 실습 클릭게임
  'M1310.001100': {
    name:'정상우', title:'교수',
    color:'#e879f9', size:26,
    quote:'이게 과제인지 의심스러운 정도입니다',
    ability:'dot_or_critique',
    dotDps:4, dotDuration:180, dotCooldown:420,
    attackCooldown:480, attackTimer:0,
    quakeColor:'rgba(232,121,249,0.15)',
  },

  // 산업입지와 정책 → 김지훈: 3초 스턴 단 1회
  '208.323A': {
    name:'김지훈', title:'교수',
    color:'#f9a8d4', size:26,
    quote:'조별 현장연구',
    ability:'once_stun',
    stunDuration:180, triggered:false,
    quakeColor:'rgba(249,168,212,0.15)',
  },

  // 지리공간의 역사와 사상 → 정상우: 5초 속도 절반
  '208.421A': {
    name:'정상우', title:'교수',
    color:'#a78bfa', size:26,
    quote:'맑스주의와\n공간정치경제학',
    ability:'slow_debuff',
    slowDuration:300, slowCooldown:360,
    quakeColor:'rgba(167,139,250,0.15)',
  },

  // 기후학과 기후변화 (M1310.001000) → 김지훈
  'M1310.001000': {
    name:'김지훈', title:'교수',
    color:'#7dd3fc', size:26,
    quote:'과다살육설',
    ability:'hit_reduce_climate',
    hitReduceCooldown:360,
    quakeColor:'rgba(125,211,252,0.15)',
  },

  // 역사지리학 (M0000.021700) → 김영순: 임용 기출문제 설치
  'M0000.021700': {
    name:'김영순', title:'교수',
    color:'#fcd34d', size:26,
    quote:'무명수',
    ability:'spawn_beacon',
    beaconCooldown:420,
    quakeColor:'rgba(252,211,77,0.15)',
  },

  // 중국지리 (M0000.021600) → 김영순: 임용 기출문제 설치
  'M0000.021600': {
    name:'김영순', title:'교수',
    color:'#fcd34d', size:26,
    quote:'무명수',
    ability:'spawn_beacon',
    beaconCooldown:420,
    quakeColor:'rgba(252,211,77,0.15)',
  },

  // 거시경제이론 → 장경호: 1초 화면 화이트아웃
  '212.202': {
    name:'장경호', title:'교수',
    color:'#f1f5f9', size:26,
    quote:'',
    ability:'whiteout',
    whiteoutCooldown:420,
    quakeColor:'rgba(241,245,249,0.15)',
  },
  // 경제사(212.203)는 보스몹 없음

  // 재정 및 조세정책 디자인 → 박선미: 진도 감소 + 속도 절반 (학기 종료 10초 전 발동 안함)
  'M1314.004500': {
    name:'박선미', title:'교수',
    color:'#c4b5fd', size:26,
    quote:'Solow Growth Model에서 steady-state는\nsavings rate와 depreciation에 의해\n결정되고, economy는 transition\ndynamics를 따라 equilibrium capital\nstock으로 converge합니다.',
    ability:'hit_reduce_or_slow',
    hitReduceCooldown:600, slowDuration:300,
    quakeColor:'rgba(196,181,253,0.15)',
  },

  // 경제통계학 → 장경호: 도트뎀 + 속도 절반
  '212.204': {
    name:'장경호', title:'교수',
    color:'#fb923c', size:26,
    quote:'teaching by not teaching',
    ability:'dot_and_slow',
    dotDps:4, dotDuration:180, slowDuration:300, actionCooldown:360,
    quakeColor:'rgba(251,146,60,0.15)',
  },

  // 계량경제학 → 장경호: 속도 절반
  '212.301': {
    name:'장경호', title:'교수',
    color:'#fb923c', size:26,
    quote:'자습',
    ability:'slow_debuff',
    slowDuration:300, slowCooldown:360,
    quakeColor:'rgba(251,146,60,0.15)',
  },

  // 화폐금융론 → 정동준: 속도 절반 + 끌어당김
  '212.303': {
    name:'정동준', title:'교수',
    color:'#34d399', size:26,
    quote:'어 이게 회사채이자율스프레드가\n어 그러니까 이게 이렇다는 걸\n궁금해할 수도 있습니다.',
    ability:'slow_and_pull',
    slowDuration:300, pullRadius:160, pullStrength:1.0, actionCooldown:360,
    quakeColor:'rgba(52,211,153,0.15)',
  },

  // 경제사 → 김지훈: 도트뎀 + 속도 절반
  '212.203': {
    name:'김지훈', title:'교수',
    color:'#f472b6', size:26,
    quote:'중농주의',
    ability:'dot_and_slow',
    dotDps:4, dotDuration:180, slowDuration:300, actionCooldown:360,
    quakeColor:'rgba(244,114,182,0.15)',
  },

  // 재정학 → 장경호: 도트뎀 + 속도 절반
  '212.305': {
    name:'장경호', title:'교수',
    color:'#fbbf24', size:26,
    quote:'헨리 조지, 피케티,\n존 롤즈, 동학농민운동',
    ability:'dot_and_slow',
    dotDps:4, dotDuration:180, slowDuration:300, actionCooldown:360,
    quakeColor:'rgba(251,191,36,0.15)',
  },

  // 게임이론 및 응용 → 이브게론: 진도 1 감소
  '212.339': {
    name:'이브게론', title:'교수',
    color:'#94a3b8', size:26,
    quote:'Okay then\nlet\'s take a break',
    ability:'hit_reduce_game',
    hitReduceCooldown:600,
    quakeColor:'rgba(148,163,184,0.15)',
  },

  // 응용계량경제학 → 김봉근: 원격공격
  'M1314.000100': {
    name:'김봉근', title:'교수',
    color:'#38bdf8', size:26,
    quote:'STATA 켜세요',
    ability:'rangedattack',
    attackCooldown:200,
    projectileSpeed:3.0,
    quakeColor:'rgba(56,189,248,0.15)',
  },

  // ── 정치외교학부 보스 ──────────────────────────────────
  // 일본정치론 / 일본과 국제관계 → 이정환: 화살 3개 동시 발사
  '216A.207': {
    name:'이정환', title:'교수',
    color:'#fca5a5', size:26,
    quote:'세개의 화살',
    ability:'triple_arrow',
    attackCooldown:200, projectileSpeed:3.2, attackTimer:0,
    quakeColor:'rgba(252,165,165,0.15)',
  },
  '216B.341': {
    name:'이정환', title:'교수',
    color:'#fca5a5', size:26,
    quote:'세개의 화살',
    ability:'triple_arrow',
    attackCooldown:200, projectileSpeed:3.2, attackTimer:0,
    quakeColor:'rgba(252,165,165,0.15)',
  },
  // 한국정치론 / 정당론 → 강원택: 1초 정지
  '216A.304': {
    name:'강원택', title:'교수',
    color:'#93c5fd', size:26,
    quote:'권력 분산과 완충 역할을 할 제3,4당이 공존해야',
    ability:'stun', stunDuration:30, stunCooldown:600,
    quakeColor:'rgba(147,197,253,0.15)',
  },
  '216A.303': {
    name:'강원택', title:'교수',
    color:'#93c5fd', size:26,
    quote:'권력 분산과 완충 역할을 할 제3,4당이 공존해야',
    ability:'stun', stunDuration:30, stunCooldown:600,
    quakeColor:'rgba(147,197,253,0.15)',
  },
  // 정보세계정치론 / 탈근대세계정치론 → 김상배: 레이저 회전
  '216B.328A': {
    name:'김상배', title:'교수',
    color:'#a5f3fc', size:26,
    quote:'AI 안보',
    ability:'laser_spin',
    laserLen:130, laserAngle:0, laserSpeed:0.022,
    laserCooldown:360, attackTimer:0, laserActive:false, laserDuration:0,
    quakeColor:'rgba(165,243,252,0.15)',
  },
  '216B.225': {
    name:'김상배', title:'교수',
    color:'#a5f3fc', size:26,
    quote:'AI 안보',
    ability:'laser_spin',
    laserLen:130, laserAngle:0, laserSpeed:0.022,
    laserCooldown:360, attackTimer:0, laserActive:false, laserDuration:0,
    quakeColor:'rgba(165,243,252,0.15)',
  },
  // 정치학연구방법론 → 박원호: 원격공격
  '216A.301': {
    name:'박원호', title:'교수',
    color:'#fdba74', size:26,
    quote:'투표행태',
    ability:'rangedattack',
    attackCooldown:180, projectileSpeed:2.8,
    quakeColor:'rgba(253,186,116,0.15)',
  },
  // 국제정치자료분석 → 박종희: 원격공격
  'M1321.002200': {
    name:'박종희', title:'교수',
    color:'#6ee7b7', size:26,
    quote:'RStudio 켜세요',
    ability:'rangedattack',
    attackCooldown:160, projectileSpeed:3.0,
    quakeColor:'rgba(110,231,183,0.15)',
  },
  // 개발과 협력의 국제정치경제 / 금융과 발전의 국제정치경제 → 박종희: 5초 속도 80%
  '216B.228': {
    name:'박종희', title:'교수',
    color:'#6ee7b7', size:26,
    quote:'리딩',
    ability:'slow_debuff',
    slowDuration:300, slowCooldown:360, attackTimer:0,
    quakeColor:'rgba(110,231,183,0.15)',
  },
  '216B.347': {
    name:'박종희', title:'교수',
    color:'#6ee7b7', size:26,
    quote:'리딩',
    ability:'slow_debuff',
    slowDuration:300, slowCooldown:360, attackTimer:0,
    quakeColor:'rgba(110,231,183,0.15)',
  },
  // 유라시아 국제관계론 / 러시아 국제관계론 → 신범식: 리딩 터렛 설치
  '216B.339': {
    name:'신범식', title:'교수',
    color:'#c4b5fd', size:26,
    quote:'나토의 동진이 러우전쟁의 원인',
    ability:'reading_turret',
    turretCooldown:400, attackTimer:0,
    quakeColor:'rgba(196,181,253,0.15)',
  },
  '216B.338A': {
    name:'신범식', title:'교수',
    color:'#c4b5fd', size:26,
    quote:'나토의 동진이 러우전쟁의 원인',
    ability:'reading_turret',
    turretCooldown:400, attackTimer:0,
    quakeColor:'rgba(196,181,253,0.15)',
  },

  // ── 역사학부 / 일본언어문명 보스 ──────────────────────────
  // 개관일본사 → 박수철: 5방향 이동 (박수철 자신이 이동)
  'M3545.002400': {
    name:'박수철', title:'교수',
    color:'#fbbf24', size:26,
    ability:'directional_push',
    quotes:['근기','관서','동북','남해','서국'],
    // 근기=자신중심(원형), 관서=오른쪽, 동북=오른쪽위, 남해=아래, 서국=왼쪽
    pushDirs:['orbit','right','right_up','down','left'],
    pushCooldown:240, attackTimer:0, pushActive:false, pushTimer:0, pushDir:null,
    quakeColor:'rgba(251,191,36,0.15)',
  },
  // 집중일본어 1/2 → 한정연: 어려운 일본어 말풍선 + 원격공격
  '1003.271': {
    name:'한정연', title:'교수',
    color:'#f87171', size:26,
    ability:'rangedattack',
    quotes:['お疲れ様でございます','御無沙汰しております','承知いたしました','恐れ入りますが','よろしくお願い申し上げます'],
    quoteIdx:0,
    attackCooldown:180, projectileSpeed:3.0, attackTimer:0,
    quakeColor:'rgba(248,113,113,0.15)',
  },
  '1003.272': {
    name:'한정연', title:'교수',
    color:'#f87171', size:26,
    ability:'rangedattack',
    quotes:['いただければ幸いです','ご査収のほどよろしく','お力添えを賜りたく','ご多忙の折恐縮ですが','何卒ご容赦ください'],
    quoteIdx:0,
    attackCooldown:180, projectileSpeed:3.0, attackTimer:0,
    quakeColor:'rgba(248,113,113,0.15)',
  },
  // 전후 일본 문화와 예술 / 일본 근대 시각문화 → 오윤정: 1초 정지
  'M2753.000400': {
    name:'오윤정', title:'교수',
    color:'#c084fc', size:26,
    quote:'ooo학생은 어떻게 생각해요?',
    ability:'quiz_click',
    attackCooldown:480, attackTimer:0,
    quakeColor:'rgba(192,132,252,0.15)',
  },
  'M2169.009200': {
    name:'오윤정', title:'교수',
    color:'#c084fc', size:26,
    quote:'ooo학생은 어떻게 생각해요?',
    ability:'quiz_click',
    attackCooldown:480, attackTimer:0,
    quakeColor:'rgba(192,132,252,0.15)',
  },
  // 일본 전통 문화와 예술 → 사이토 아유미: 전통문화 말풍선 + 원격공격
  '1003.274': {
    name:'사이토 아유미', title:'교수',
    color:'#86efac', size:26,
    ability:'rangedattack',
    quotes:['能楽の様式美','歌舞伎の見得','茶道の一期一会','花道の間','雅楽の調べ'],
    quoteIdx:0,
    attackCooldown:200, projectileSpeed:2.8, attackTimer:0,
    quakeColor:'rgba(134,239,172,0.15)',
  },
  // 일본고전문학 → 사이토 아유미: 4가지 작품 말풍선 랜덤 원격공격
  '1003.301': {
    name:'사이토 아유미', title:'교수',
    color:'#86efac', size:26,
    ability:'rangedattack',
    quotes:['만엽집','겐지이야기','이세이야기','헤이케이야기'],
    quoteIdx:0,
    attackCooldown:180, projectileSpeed:2.8, attackTimer:0,
    quakeColor:'rgba(134,239,172,0.15)',
  },

  // 아시아지리 → Andriesse: 리딩 터렛 설치 (논문 이름 무작위)
  '208.226A': {
    name:'Andriesse', title:'교수',
    color:'#38bdf8', size:26,
    quote:'Seaweeds Value Chain in Iloilo:',
    ability:'andriesse_turret',
    turretCooldown:360, attackTimer:0,
    readingNames:['Islam et al. 2021','Alam 2019','Pain 2023','Bhatia et al 2021','Graham et al. 2021','Hariharan and Biswas 2022','Kummer 1999','Reed 1999','Lele 2021','Talitha 2019','Andriesse 2022','Scheiner 2021','Meehan 2021'],
    quakeColor:'rgba(56,189,248,0.15)',
  },

  // ── 조경학 보스 ───────────────────────────────────────
  // 조경생태분석 → 정동준: 도트뎀
  '5271.227': {
    name:'정동준', title:'교수',
    color:'#86efac', size:26,
    quote:'실습 과제',
    ability:'dot_damage',
    dotDps:4, dotDuration:180, dotCooldown:360, attackTimer:0,
    quakeColor:'rgba(134,239,172,0.15)',
  },
  // 공원녹지계획 → 정동준: 도트뎀
  '5271.321': {
    name:'정동준', title:'교수',
    color:'#86efac', size:26,
    quote:'실습 과제',
    ability:'dot_damage',
    dotDps:4, dotDuration:180, dotCooldown:360, attackTimer:0,
    quakeColor:'rgba(134,239,172,0.15)',
  },
  // 서양조경의 역사와 이론 → 박선미: 3초 정지 1회
  '5271.226': {
    name:'박선미', title:'교수',
    color:'#c084fc', size:26,
    quote:'나의 조경 라이브러리',
    ability:'once_stun',
    stunDuration:180, triggered:false,
    quakeColor:'rgba(192,132,252,0.15)',
  },
  // GIS와 계량분석실습 → 정동준: 원격공격 + 조교소환
  '5271.221B': {
    name:'정동준', title:'교수',
    color:'#60a5fa', size:26,
    quote:'실습 과제',
    ability:'ta_spawn_critique',
    attackCooldown:200, projectileSpeed:2.8, attackTimer:0,
    taCooldown:480, taTimer:0, maxTAs:5,
    critCooldown:600, critTimer:0,
    quakeColor:'rgba(96,165,250,0.15)',
  },
  // 경관생태학 → 정동준: 원격공격 + 조교소환
  '5271.225': {
    name:'정동준', title:'교수',
    color:'#60a5fa', size:26,
    quote:'실습 과제',
    ability:'ta_spawn_critique',
    attackCooldown:200, projectileSpeed:2.8, attackTimer:0,
    taCooldown:480, taTimer:0, maxTAs:5,
    critCooldown:600, critTimer:0,
    quakeColor:'rgba(96,165,250,0.15)',
  },
  // 조경식물재료학 → 박선미: 15초마다 1초 정지, 최대 3회
  '5271.212A': {
    name:'박선미', title:'교수',
    color:'#fbbf24', size:26,
    quote:'발표',
    ability:'repeat_stun',
    stunDuration:60, stunInterval:900, stunCount:0, maxStuns:3, attackTimer:0,
    quakeColor:'rgba(251,191,36,0.15)',
  },
  // 조경설계2 → 박선미: 설계비평 클릭게임
  '5271.412': {
    name:'박선미', title:'교수',
    color:'#fbbf24', size:26,
    quote:'설계 비평',
    ability:'critique_click',
    attackCooldown:600, attackTimer:0,
    quakeColor:'rgba(251,191,36,0.15)',
  },
  // 조경컴퓨터그래픽 → 박선미: 설계비평 클릭게임
  '5271.213': {
    name:'박선미', title:'교수',
    color:'#f97316', size:26,
    quote:'설계 비평',
    ability:'critique_and_dot',
    attackCooldown:600, attackTimer:0,
    dotDps:4, dotDuration:120, dotCooldown:480, dotTimer:0,
    quakeColor:'rgba(249,115,22,0.15)',
  },
  // 조경설계1 → 박선미: 설계비평 클릭게임
  '5271.324': {
    name:'박선미', title:'교수',
    color:'#f97316', size:26,
    quote:'설계 비평',
    ability:'critique_and_dot',
    attackCooldown:600, attackTimer:0,
    dotDps:4, dotDuration:120, dotCooldown:480, dotTimer:0,
    quakeColor:'rgba(249,115,22,0.15)',
  },
  // 식재설계 → 박선미: 설계비평 클릭게임
  '5271.312': {
    name:'박선미', title:'교수',
    color:'#f97316', size:26,
    quote:'설계 비평',
    ability:'critique_and_dot',
    attackCooldown:600, attackTimer:0,
    dotDps:4, dotDuration:120, dotCooldown:480, dotTimer:0,
    quakeColor:'rgba(249,115,22,0.15)',
  },
  // 지형학원론 → 변종민: 15초마다 1초 정지 + "야외실습" 말풍선
  '713.211': {
    name:'변종민', title:'교수',
    color:'#84cc16', size:26,
    quote:'야외실습',
    ability:'repeat_stun',
    stunDuration:60, stunInterval:900, stunCount:0, maxStuns:99, attackTimer:0,
    quakeColor:'rgba(132,204,22,0.15)',
  },
  // 정치지리학개론 → 박배균: 말풍선 + 텔레포트로 화면 왼쪽 이동
  '713.416': {
    name:'박배균', title:'교수',
    color:'#a78bfa', size:26,
    quotes:['한국의 개발주의 공간정치','국가의 공간성','동아시아의 발전주의 도시화'],
    quote:'국가의 공간성',
    ability:'teleport_left',
    teleportCooldown:300, attackTimer:0,
    quakeColor:'rgba(167,139,250,0.15)',
  },
  // 인문지리학 → 박배균: 말풍선 + 텔레포트로 화면 왼쪽 이동
  '700.131': {
    name:'박배균', title:'교수',
    color:'#a78bfa', size:26,
    quotes:['한국의 개발주의 공간정치','국가의 공간성','동아시아의 발전주의 도시화'],
    quote:'국가의 공간성',
    ability:'teleport_left',
    teleportCooldown:300, attackTimer:0,
    quakeColor:'rgba(167,139,250,0.15)',
  },
};
