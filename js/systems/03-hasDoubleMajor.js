function hasDoubleMajor(type){ return doubleMajors.some(d=>d.type===type&&d.approved&&d.kind==='double'); }
function hasMinorMajor(type){ return doubleMajors.some(d=>d.type===type&&d.approved&&d.kind==='minor'); }
function hasAnyMajor(type){ return doubleMajors.some(d=>d.type===type&&d.approved); }
function getMajorKind(type){
  const d = doubleMajors.find(x=>x.type===type&&x.approved);
  return d ? d.kind : null;
}

function isEconMajor(){ return hasAnyMajor('econ'); }
function isAgriMajor(){ return hasAnyMajor('agri'); }
function isForestMajor(){ return hasAnyMajor('forest'); }
function isPolisciMajor(){ return hasAnyMajor('polisci_a') || hasAnyMajor('polisci_b'); }
function isJapanMajor(){ return hasAnyMajor('japan'); }
function isJapanStudiesMajor(){ return hasAnyMajor('japan_studies'); }
function isArthHistoryMajor(){ return false; } // 복수/부전공 없음, 타과인정 과목만
function isEduHistoryMajor(){ return false; }
function isStsCourseMajor(){ return false; }
function isLandMajor(){ return hasAnyMajor('land'); }
function isGenvMajor(){ return hasAnyMajor('genv'); }

// 모든 전공 탭 표시 여부 (복수/부전공 관계없이 수강은 가능하므로 항상 표시)
// → 과목은 항상 수강 가능, 단 학점 인정 방식만 달라짐
function isEconAccessible(){ return true; }
function isAgriAccessible(){ return true; }
function isForestAccessible(){ return true; }

// 픽순별 성공 확률 계산
// recPick/minPick이 없으면 무조건 100% 성공
// recPick N = "N픽 이내에 넣으면 유리, 초과하면 급락"
//   playerPick < recPick  → 100% (더 좋은 픽에 넣음)
//   playerPick == recPick → 90%
//   playerPick == recPick+1 → 40%
//   playerPick == recPick+2 → 10%
//   playerPick > recPick+2 → 0%
// 죽음의 과학적 이해: 1픽=40%, 2픽 이상=0%
function calcSuccessRate(cd, playerPick){
  if(cd.alwaysSucceed) return 1.0;
  // 경제학부 복전/부전 중: 212.338A(주식채권파생금융상품1: 이론) 제외한 econ 과목은 recPick 무시 → 100%
  if(cd.category==='econ' && isEconMajor() && cd.code!=='212.338A' && cd.recPick){
    return 1.0;
  }
  if(!cd.recPick && !cd.minPick && !cd.specialPickRule) return 1.0;

  if(cd.specialPickRule === 'death_science'){
    return playerPick === 1 ? 0.40 : 0.0;
  }

  const base = cd.recPick || cd.minPick;
  const diff = playerPick - base; // 음수: 더 좋은픽(유리), 0: 딱맞음, 양수: 초과(불리)

  if(diff < 0)  return 1.00; // 권장픽보다 좋은 픽 → 100%
  if(diff === 0) return 0.90; // 딱 권장픽 → 90%
  if(diff === 1) return 0.40; // 1칸 초과 → 40%
  if(diff === 2) return 0.10; // 2칸 초과 → 10%
  return 0.00;                // 3칸 이상 초과 → 0%
}

// 매학기 각 분과에서 오픈할 과목들 결정
let semesterOfferedCodes = new Set(); // 이번 학기 오픈된 분과 과목 코드

function rollSemesterOfferings(){
  // 모든 교양 과목은 매학기 전부 열림
  semesterOfferedCodes = new Set(LIBERAL_COURSES.map(c=>c.code));
}

const RANKS = [
  {id:'student', name:'학부생', color:'#60a5fa', size:10, pts:1, speed:0.6},
  {id:'master',  name:'석사과정', color:'#a78bfa', size:13, pts:3, speed:0.55},
  {id:'phd',     name:'박사과정', color:'#fb923c', size:16, pts:5, speed:0.5},
  {id:'postdoc', name:'포닥', color:'#f472b6', size:19, pts:8, speed:0.45},
  {id:'prof',    name:'교수', color:'#fbbf24', size:24, pts:15, speed:0.4},
];
