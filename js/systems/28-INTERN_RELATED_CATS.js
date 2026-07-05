// ══════════════════════════════════════════════════════
// 인턴 시스템
// ══════════════════════════════════════════════════════

// 인턴별 관련 카테고리 정의
const INTERN_RELATED_CATS = {
  related_geo:    ['geo','agri','genv'],
  related_econ:   ['econ','agri','genv'],
  related_forest: ['forest','land','genv'],
  related_land:   ['land','forest','genv'],
  related_it:     ['agri','geo'],
  related_env:    ['genv','civil','energy','chembio','earth','lifesci','agrobio','forest'],
  public_gov:     ['geo','agri','econ','forest','polisci','genv'],
  public_corp:    ['geo','agri','econ','forest','genv','civil','energy'],
  public_ngo:     ['geo','forest','polisci','genv'],
  general_corp:   ['geo','agri','econ','forest','polisci','japan','land','genv'],
  general_small:  ['geo','agri','econ','forest','polisci','japan','land','genv'],
};

// 자격증 보너스 (최대 +24%)
function calcInternCertBonus(){
  const c = player.certs;
  let bonus = 0;
  if(c.컴활1급)    bonus += 8;
  if(c.토익>=850)  bonus += 10;
  else if(c.토익>=700) bonus += 5;
  else if(c.텝스>=430) bonus += 10; // 텝스 430+ ≈ 토익 850+
  else if(c.텝스>=320) bonus += 5;  // 텝스 320+ ≈ 토익 700+
  if(c.한국사===1) bonus += 6;
  else if(c.한국사===2) bonus += 4;
  else if(c.한국사===3) bonus += 2;
  return Math.min(24, bonus);
}

// 전공 숙련도: 이수 과목 수 → 배율 (0~10%, 1과목당 1%)
function calcMajorProficiency(intern){
  const cats = INTERN_RELATED_CATS[intern.id] || ['geo'];
  const count = completedCourses.filter(c => cats.includes(c.category) && c.grade !== 'F').length;
  return Math.min(10, count); // 0~10%
}

// 관련전공 복수/부전공 보너스 (-10% ~ +10%)
function calcDoubleMajorBonus(intern){
  const cats = INTERN_RELATED_CATS[intern.id] || ['geo'];
  // 관련 카테고리 → 복수/부전공 type 매핑
  const catToType = {geo:'geo',agri:'agri',econ:'econ',forest:'forest',land:'land',polisci:'polisci_a',japan:'japan',genv:'genv',civil:'genv',energy:'genv',chembio:'genv',earth:'genv',lifesci:'genv',agrobio:'genv'};
  const relatedTypes = [...new Set(cats.map(c=>catToType[c]).filter(Boolean))];
  const approved = doubleMajors.filter(d=>d.approved);
  if(approved.length === 0){
    // 복수/부전공 없으면 -5%
    return -5;
  }
  const hasRelated = approved.some(d => relatedTypes.includes(d.type));
  if(hasRelated){
    // 관련 전공 복수전공이면 +10%, 부전공이면 +6%
    const best = approved.filter(d=>relatedTypes.includes(d.type));
    const hasDouble = best.some(d=>d.kind==='double');
    return hasDouble ? 10 : 6;
  } else {
    // 전혀 관련없는 전공만 있으면 -10%
    return -10;
  }
}

// 면접 점수 → 보너스 (100회 만점 → +23%)
function calcInterviewBonus(clicks){
  return Math.min(23, Math.round((Math.min(clicks,100)/100)*23));
}

// 합격률 계산 (면접 클릭 제외한 서류 단계)
function calcInternBaseRate(intern){
  const gpa = player.gpa||0;
  const profPct = calcMajorProficiency(intern) / 100; // 0~0.10
  const certBonus = calcInternCertBonus();
  const dmBonus = calcDoubleMajorBonus(intern);
  // GPA * 전공숙련도배율 (최대 43) + 자격증 (최대 24) + 관련전공 (-10~+10)
  const gpaComponent = Math.round((gpa / 4.3) * 43 * (profPct > 0 ? profPct * 10 : 0) * 10) / 10;
  // profPct * 10 = 0~1.0 실제 배율 (0과목=0배, 10과목=1.0배)
  const rate = (gpa / 4.3) * 43 * (Math.min(10, completedCourses.filter(c=>
    (INTERN_RELATED_CATS[intern.id]||['geo']).includes(c.category) && c.grade!=='F'
  ).length) / 10) + certBonus + dmBonus;
  return {
    certBonus, dmBonus,
    profCount: completedCourses.filter(c=>(INTERN_RELATED_CATS[intern.id]||['geo']).includes(c.category)&&c.grade!=='F').length,
    gpaComp: Math.round((gpa/4.3)*43 * Math.min(completedCourses.filter(c=>(INTERN_RELATED_CATS[intern.id]||['geo']).includes(c.category)&&c.grade!=='F').length,10)/10),
    baseRate: Math.round(rate),
  };
}

// ── 인턴 전형 상태 ──────────────────────────────────────────
let _ipmInternId      = null;
let _ipmBaseRate      = 0;
let _ipmClicks        = 0;
let _ipmInterval      = null;
let _ipmTimeLeft      = 10;

// 모달 단계 전환 헬퍼
