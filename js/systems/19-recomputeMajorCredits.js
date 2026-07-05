// ══════════════════════════════════════════════════════
// GRADUATION & DOUBLE/MINOR MAJOR
// ══════════════════════════════════════════════════════

// 복수/부전공 승인 후 기존 이수 과목의 전공학점 재집계
function recomputeMajorCredits(){
  player.agriCredits=0; player.econCredits=0; player.forestCredits=0; player.polisciCredits=0;
  player.japanCredits=0; player.japanStudiesCredits=0; player.landCredits=0; player.genvCredits=0;
  for(const c of completedCourses){
    if(c.grade==='F') continue;
    if(c.category==='agri' && hasAnyMajor('agri')) player.agriCredits+=c.credit;
    if(c.category==='econ' && hasAnyMajor('econ')) player.econCredits+=c.credit;
    if(c.category==='forest' && hasAnyMajor('forest')) player.forestCredits+=c.credit;
    if(c.category==='polisci' && isPolisciMajor()) player.polisciCredits+=c.credit;
    if(c.category==='japan' && isJapanMajor()) player.japanCredits+=c.credit;
    if(c.category==='japan_studies' && isJapanStudiesMajor()) player.japanStudiesCredits+=c.credit;
    if(c.category==='land' && isLandMajor()) player.landCredits+=c.credit;
    if(c.category==='genv' && isGenvMajor()) player.genvCredits+=c.credit;
    if(['civil','energy','chembio','earth','lifesci','agrobio'].includes(c.category) && isGenvMajor()) player.genvCredits+=c.credit;
    // forest/land/agri genvOk 과목: genv 중복인정은 calcGenvEffectiveCredits()에서 처리
  }
  updateUI();
}

function getGeoCreditsRequired(){
  if(doubleMajors.some(d=>d.approved && d.type!=='geo_intensive')) return 39;
  return 39;
}

// ── 학점 요건 ────────────────────────────────────────
function getAgriCreditReq(){ return hasDoubleMajor('agri') ? 48 : hasMinorMajor('agri') ? 24 : 0; }
function getEconCreditReq(){  return hasDoubleMajor('econ') ? 39 : hasMinorMajor('econ') ? 21 : 0; }
function getForestCreditReq(){ return hasDoubleMajor('forest') ? 48 : hasMinorMajor('forest') ? 21 : 0; }
function getPolisciCreditReq(type){ return hasDoubleMajor(type) ? 39 : hasMinorMajor(type) ? 21 : 0; }
function getJapanCreditReq(){ return hasDoubleMajor('japan') ? 39 : hasMinorMajor('japan') ? 21 : 0; }
function getLandCreditReq(){  return hasDoubleMajor('land') ? 48 : hasMinorMajor('land') ? 24 : 0; }
function getGenvCreditReq(){  return 39; } // 연합전공은 복수전공 단일 형태, 39학점

// ── 글로벌환경경영학 유효학점 계산 ─────────────────────
// 타전공 과목 중복인정 최대 9학점
// 단, 해당 타전공(forest/land)도 복수전공으로 갖고 있으면 해당 학점은 중복인정되지 않음
function calcGenvEffectiveCredits(){
  if(!isGenvMajor()) return 0;
  // genv 카테고리 과목 직접 이수 + 이공계 타전공 과목
  const direct = completedCourses
    .filter(c => (c.category==='genv' || ['civil','energy','chembio','earth','lifesci','agrobio'].includes(c.category)) && c.grade!=='F')
    .reduce((s,c) => s+c.credit, 0);
  // 타전공 과목으로 genv 중복인정 (forest/land 과목)
  // forest를 복전으로 갖고 있으면 forest 과목은 중복인정 불가
  let overlapCred = 0;
  for(const [cat, codes] of Object.entries(GENV_OVERLAP_CAT_CODES)){
    if(hasAnyMajor(cat)) continue; // 해당 전공도 복전이면 중복인정 불가
    const ov = completedCourses.filter(c => codes.includes(c.code) && c.grade!=='F');
    overlapCred += ov.reduce((s,c) => s+c.credit, 0);
  }
  const overlap = Math.min(9, overlapCred);
  return direct + overlap;
}

// genv 인문사회 학점 (과기 1/3 요건 체크용)
function calcGenvSciCredits(){
  if(!isGenvMajor()) return 0;
  const directSci = completedCourses
    .filter(c => (c.category==='genv' || ['civil','energy','chembio','earth','lifesci','agrobio'].includes(c.category)) && c.grade!=='F')
    .reduce((s,c) => {
      const cd = GENV_COURSES.find(x=>x.code===c.code) || CIVIL_COURSES.find(x=>x.code===c.code) || ENERGY_COURSES.find(x=>x.code===c.code) || CHEMBIO_COURSES.find(x=>x.code===c.code) || EARTH_COURSES.find(x=>x.code===c.code) || LIFESCI_COURSES.find(x=>x.code===c.code) || AGROBIO_COURSES.find(x=>x.code===c.code);
      return s + (cd && cd.subtype==='sci' ? c.credit : 0);
    }, 0);
  // 타전공 중복인정 중 과기 과목
  let overlapSci = 0;
  for(const [cat, codes] of Object.entries(GENV_OVERLAP_CAT_CODES)){
    if(hasAnyMajor(cat)) continue;
    const ov = completedCourses.filter(c => codes.includes(c.code) && c.grade!=='F');
    // forest 과목은 대부분 과기; land 경관생태학도 과기
    overlapSci += ov.reduce((s,c) => s+c.credit, 0);
  }
  return directSci + Math.min(9, overlapSci);
}

// genv 전공필수 이수 여부
