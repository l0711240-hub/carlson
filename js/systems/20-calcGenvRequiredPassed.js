function calcGenvRequiredPassed(){
  return GENV_REQUIRED_CODES.filter(code => passed(code));
}

// genv 인턴 이수 여부 (환경경영 실습 수강 전제조건)
function isGenvInternDone(){
  // 인턴(player.internHistory 존재) 또는 그린리더십 인턴십(053.011) 이수
  const internDone = player.internHistory && Object.keys(player.internHistory).length > 0;
  const greenLeadership = isGreenLeaderInternDone();
  return internDone || greenLeadership;
}
const AGRI_OVERLAP_CODES = {
  // 사회교육과 중복인정 과목 (전공학과 과목)
  geo: ['M0000.029300','M0000.028600','M1310.001100','208.209','208.205','208.421A'],
  // 경제학부 중복인정 과목 (타학과)
  econ: ['212.301','212.342','212.204'],
};
function calcAgriEffectiveCredits(){
  if(!hasAnyMajor('agri')) return 0;
  let base = player.agriCredits;
  // 타학과 중복인정: 사회교육과 과목 (주전공이면 최대 3학점)
  const geoOverlap = completedCourses.filter(c=>AGRI_OVERLAP_CODES.geo.includes(c.code)&&c.grade!=='F');
  const econOverlap = completedCourses.filter(c=>AGRI_OVERLAP_CODES.econ.includes(c.code)&&c.grade!=='F');
  // 사회교육과 주전공이면 최대 3학점만 중복인정
  const geoOverlapCredit = Math.min(3, geoOverlap.length*3);
  // 경제학부도 복수/부전공이면 경제학부 과목은 중복인정 안됨
  const econOverlapCredit = hasAnyMajor('econ') ? 0 : Math.min(9, econOverlap.length*3);
  const totalOverlap = Math.min(9, geoOverlapCredit + econOverlapCredit);
  return base + totalOverlap;
}

function calcEconEffectiveCredits(){
  if(!hasAnyMajor('econ')) return 0;
  // 부전공의 경우 타학과 중복인정 없음
  return player.econCredits;
}

// ── 정치외교학부 학점 계산 ────────────────────────────
// 타과 전공인정: 정치외교학부 이수 39학점 미만→6학점, 39학점 이상→9학점
// 단 분야(가/나/다군) 분류에는 산입 안됨
// 중복인정 불가 (사회교육과 주전공 과목 포함)
function calcPolisciCrossoverCredits(type){
  if(!hasAnyMajor(type)) return 0;
  const basePoli = player.polisciCredits;
  const crossPassed = completedCourses.filter(c=>
    POLISCI_CROSSOVER_CODES.includes(c.code) && c.grade!=='F'
  );
  // 사회교육과 주전공이면 사회교육과 과목은 중복인정 안됨
  const GEO_CROSSOVER = ['208.215','208.318'];
  const validCross = crossPassed.filter(c=>{
    if(GEO_CROSSOVER.includes(c.code)) return false; // 주전공 과목 제외
    return true;
  });
  const maxCross = basePoli >= 39 ? 9 : 6;
  const crossCredit = Math.min(maxCross, validCross.length * 3);
  return basePoli + crossCredit;
}

function calcPolisciGaDivCredits(type){
  // 가군 분야 이수 학점
  return completedCourses.filter(c=>
    c.category==='polisci' && c.division_pol==='ga' && c.grade!=='F' &&
    (c.subtype===type || c.subtype==='polisci_common')
  ).reduce((s,c)=>s+c.credit,0);
}
function calcPolisciNaDivCredits(type){
  return completedCourses.filter(c=>
    c.category==='polisci' && c.division_pol==='na' && c.grade!=='F' &&
    (c.subtype===type || c.subtype==='polisci_common')
  ).reduce((s,c)=>s+c.credit,0);
}
