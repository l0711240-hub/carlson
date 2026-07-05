function calcPolisciDaDivCredits(type){
  // 다군: 소속전공(type) 개설 과목만 인정
  return completedCourses.filter(c=>
    c.category==='polisci' && c.division_pol==='da' && c.grade!=='F' &&
    c.subtype===type
  ).reduce((s,c)=>s+c.credit,0);
}

// ── 일본언어문명 학점 계산 ────────────────────────────
function calcJapanEffectiveCredits(){
  if(!hasAnyMajor('japan')) return 0;
  const base = player.japanCredits;
  // 타과 전공선택 인정: 최대 3과목(9학점)
  const cross = completedCourses.filter(c=>JAPAN_CROSSOVER_CODES.includes(c.code)&&c.grade!=='F');
  const crossCredit = Math.min(9, cross.length * 3);
  return base + crossCredit;
}

// ── 연계전공 일본학 학점 계산 ────────────────────────────
function getJapanStudiesCreditReq(){ return isJapanStudiesMajor() ? 36 : 0; }
function calcJapanStudiesEffectiveCredits(){
  if(!isJapanStudiesMajor()) return 0;
  const base = player.japanStudiesCredits;
  // 타 학과 전공인정: 역사학부·고고미술사학과·아시아언어문명·경제·정치외교·역사교육·과학기술학 최대 6학점
  const crossCats = ['history','arthistory','edu_history','sts','econ','polisci'];
  // japan_studies 이외 카테고리에서 이수한 과목 중 JSTUDIES_CROSSOVER_CODES에 해당하는 것
  const cross = completedCourses.filter(c =>
    JSTUDIES_CROSSOVER_CODES.includes(c.code) &&
    c.category !== 'japan_studies' &&
    c.grade !== 'F'
  );
  const crossCredit = Math.min(6, cross.reduce((s,c)=>s+c.credit,0));
  return base + crossCredit;
}
// 인문대학 개설 6학점 이수 여부 (역사학부·아시아언어문명학부·종교학과)
function calcJapanStudiesHumanitCredit(){
  return Math.min(
    completedCourses
      .filter(c => JSTUDIES_HUMANIT_CODES.includes(c.code) && c.grade !== 'F')
      .reduce((s,c)=>s+c.credit, 0),
    999 // 상한 없음 (충족 여부 판단용)
  );
}

// ── 조경학 학점 계산 ──────────────────────────────────
function calcLandEffectiveCredits(){
  if(!hasAnyMajor('land')) return 0;
  const base = player.landCredits;
  const cross = completedCourses.filter(c=>LAND_CROSSOVER_CODES.includes(c.code)&&c.grade!=='F');
  const geoCross = cross.filter(c=>c.category==='geo');
  const otherCross = cross.filter(c=>c.category!=='geo');
  const geoCredit = Math.min(3, geoCross.length*3);
  const otherCredit = Math.min(9-geoCredit, otherCross.length*3);
  return base + geoCredit + otherCredit;
}
function calcLandRequiredCredits(){
  return completedCourses.filter(c=>c.category==='land'&&(c.type==='required_land'||c.type==='land_thesis')&&c.grade!=='F').reduce((s,c)=>s+c.credit,0);
}

// ── 필수 전공 이수 확인 ───────────────────────────────
function passed(code){ return completedCourses.some(c=>c.code===code&&c.grade!=='F'); }
function passedType(type){ return completedCourses.some(c=>c.type===type&&c.grade!=='F'); }

// ── 졸업 가능 여부 ────────────────────────────────────
function checkGraduationReady(){
  if(player.rankIdx!==0) return false;
  if(player.credits < 130) return false;
  if(player.liberalCredits < 36) return false;
  if(player.geoCredits < getGeoCreditsRequired()) return false;
  if(!passed('M0000.029300')) return false; // 공간정보분석1
  if(!passed('208.421A')) return false;     // 지리공간의 역사와 사상
  // 교양필수 졸업 조건
  if(!passed('LIB002')) return false;        // 대학영어
  if(!passedType('lang2')) return false;     // 제2외국어 (최소 1개)
  if(!passed('LIB009')) return false;        // 대학글쓰기1
  if(!passed('LIB010')) return false;        // 대학글쓰기2
  // 사회교육과 심화전공: 전공학점 60학점 이상이면 다전공 없이 졸업 가능
  const geoIntensive = player.geoCredits >= 60;
  if(!geoIntensive && doubleMajors.filter(d=>d.approved).length < 1) return false;

  // 각 복수/부전공 요건을 개별 함수로 판단
  // → 승인된 것 중 최소 1개가 요건을 충족하면 졸업 가능
  //   (나머지 미충족 전공은 졸업 시 포기 처리)
  function checkMajorReq(type, kind){
    if(kind==='double'){
      if(type==='agri') return calcAgriEffectiveCredits()>=48;
      if(type==='econ') return ['212.201','212.202','212.203','212.204','212.214'].every(passed)&&calcEconEffectiveCredits()>=39;
      if(type==='forest'){
        const r=['M1698.001200','M1698.002900','M1698.001900','5241.417'];
        return r.every(passed) && player.forestCredits>=48;
      }
      if(type==='polisci_a'){
        return passed('200.103')&&passed('200.104')&&passed('216A.416')
          &&calcPolisciGaDivCredits('polisci_a')>=6
          &&calcPolisciNaDivCredits('polisci_a')>=6
          &&calcPolisciDaDivCredits('polisci_a')>=6
          &&calcPolisciCrossoverCredits('polisci_a')>=getPolisciCreditReq('polisci_a');
      }
      if(type==='polisci_b'){
        return passed('200.103')&&passed('200.104')&&passed('216B.420')
          &&calcPolisciGaDivCredits('polisci_b')>=6
          &&calcPolisciNaDivCredits('polisci_b')>=6
          &&calcPolisciDaDivCredits('polisci_b')>=6
          &&calcPolisciCrossoverCredits('polisci_b')>=getPolisciCreditReq('polisci_b');
      }
      if(type==='japan'){
        return passed('1003.221')&&passed('M2641.000300')
          &&calcJapanEffectiveCredits()>=getJapanCreditReq();
      }
      if(type==='japan_studies'){
        return passed('M3236.000100')
          &&calcJapanStudiesEffectiveCredits()>=36
          &&calcJapanStudiesHumanitCredit()>=6;
      }
      if(type==='land'){
        const landElec=completedCourses.filter(c=>c.category==='land'&&c.type==='normal'&&c.grade!=='F').reduce((s,c)=>s+c.credit,0);
        const hasStudio=passed('M1707.000300')&&passed('M1707.000400');
        const hasSeminar=passed('M1707.001000')&&passed('M1707.001100');
        return calcLandRequiredCredits()>=29&&landElec>=19
          &&calcLandEffectiveCredits()>=getLandCreditReq()
          &&(hasStudio||hasSeminar);
      }
      if(type==='genv'){
        // 연합전공: 전공필수 5개 전부 이수 + 39학점 + 인턴 + 과기 1/3 이상
        const reqPassed = GENV_REQUIRED_CODES.every(passed);
        const totalCred = calcGenvEffectiveCredits();
        const sciCred   = calcGenvSciCredits();
        const sciMin    = Math.ceil(totalCred / 3);
        return reqPassed && totalCred >= 39 && sciCred >= sciMin && isGenvInternDone();
      }
    }
    if(kind==='minor'){
      if(type==='agri') return calcAgriEffectiveCredits()>=24;
      if(type==='econ') return ['212.201','212.202','212.203','212.204','212.214'].every(passed)&&calcEconEffectiveCredits()>=21;
      if(type==='forest'){
        const r=['M1698.001200','M1698.002900','M1698.001900','5241.417'];
        return r.every(passed) && player.forestCredits>=21;
      }
      if(type==='polisci_a'){
        return passed('200.103')&&passed('200.104')&&passed('216A.416')
          &&calcPolisciGaDivCredits('polisci_a')>=6
          &&calcPolisciNaDivCredits('polisci_a')>=6
          &&calcPolisciDaDivCredits('polisci_a')>=6
          &&calcPolisciCrossoverCredits('polisci_a')>=getPolisciCreditReq('polisci_a');
      }
      if(type==='polisci_b'){
        return passed('200.103')&&passed('200.104')&&passed('216B.420')
          &&calcPolisciGaDivCredits('polisci_b')>=6
          &&calcPolisciNaDivCredits('polisci_b')>=6
          &&calcPolisciDaDivCredits('polisci_b')>=6
          &&calcPolisciCrossoverCredits('polisci_b')>=getPolisciCreditReq('polisci_b');
      }
      if(type==='japan'){
        return passed('1003.221')
          &&calcJapanEffectiveCredits()>=getJapanCreditReq();
      }
      if(type==='japan_studies'){
        return passed('M3236.000100')
          &&calcJapanStudiesEffectiveCredits()>=36
          &&calcJapanStudiesHumanitCredit()>=6;
      }
      if(type==='land'){
        const landElec=completedCourses.filter(c=>c.category==='land'&&c.type==='normal'&&c.grade!=='F').reduce((s,c)=>s+c.credit,0);
        return calcLandRequiredCredits()>=19&&landElec>=5
          &&calcLandEffectiveCredits()>=getLandCreditReq();
      }
    }
    return false;
  }

  // 승인된 복수/부전공 중 최소 1개가 요건 충족이면 졸업 가능
  // 심화전공이면 다전공 요건 충족 여부 체크 생략
  if(!geoIntensive){
    const atLeastOneMet = doubleMajors.filter(d=>d.approved).some(d=>checkMajorReq(d.type, d.kind));
    if(!atLeastOneMet) return false;
  }

  return true;
}
