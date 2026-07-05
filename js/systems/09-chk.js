function chk(cond){ return cond ? '<span class="req-ok">✓</span>' : '<span class="req-fail">✗</span>'; }
function reqRow(icon, label, val, ok, warn){
  const cls = ok ? 'req-ok' : (warn ? 'req-warn' : 'req-fail');
  return `<div class="req-row"><span class="req-icon">${icon}</span><span class="req-label">${label}</span><span class="req-val ${cls}">${val}</span></div>`;
}
function miniBar(cur, max, color){
  const pct = Math.min(100, Math.round(cur/max*100));
  return `<div class="pbar-mini"><div class="pbar-mini-fill" style="width:${pct}%;background:${color}"></div></div>`;
}

function buildGradReqHTML(){
  const geoReq = getGeoCreditsRequired();
  const gpa = player.gpa || 0;
  const hasSpatial  = passed('M0000.029300');
  const hasHistory  = passed('208.421A');
  const hasEnglish  = passed('LIB002');
  const hasLang2    = passedType('lang2');
  const hasWrite1   = passed('LIB009');
  const hasWrite2   = passed('LIB010');
  const div6ok = completedCourses.some(c=>c.division===6 && c.grade!=='F');
  const div7ok = completedCourses.some(c=>c.division===7 && c.grade!=='F');
  const divsMandatory = div6ok || div7ok;
  const coveredDivs = new Set(completedCourses.filter(c=>c.division && c.grade!=='F').map(c=>c.division));

  // 복수전공 전필
  const agriDoubleReqs = ['M2649.001300','M2649.001400','M2649.001600','M1683.000400','5202.202','5202.205','5202.415'];
  const agriMinorReqs  = ['5202.202','M2649.001300','M1683.000400','212.201','212.202'];
  const econDoubleReqs = ['212.201','212.202','212.203','212.204','212.214'];
  const econMinorReqs  = ['212.201','212.202','212.203','212.204','212.214'];
  const forestDoubleReqs = ['M1698.001200','M1698.002900','M1698.001900','5241.417'];
  const forestMinorReqs  = ['M1698.001200','M1698.002900','M1698.001900','5241.417'];

  const approvedMajors = doubleMajors.filter(d=>d.approved);
  const needsMajor = approvedMajors.length < 1;

  let html = '';
  html += `<div class="req-section-title">📊 학점 현황</div>`;
  html += reqRow('📚', '총 학점', `${player.credits}/130`, player.credits>=130, player.credits>=90);
  html += miniBar(player.credits, 130, '#60a5fa');
  html += reqRow('🌸', '교양', `${player.liberalCredits}/36`, player.liberalCredits>=36, player.liberalCredits>=24);
  html += miniBar(player.liberalCredits, 36, '#f472b6');
  html += reqRow('🗺️', '사회교육과', `${player.geoCredits}/${geoReq}`, player.geoCredits>=geoReq, player.geoCredits>=geoReq*0.7);
  html += miniBar(player.geoCredits, geoReq, '#34d399');
  const geoEduAccumReq = completedCourses.filter(x=>x.category==='geoedu'&&x.grade!=='F').reduce((s,x)=>s+(x._geoEduGeoCredit||0),0);
  if(geoEduAccumReq > 0 || completedCourses.some(x=>x.category==='geoedu'&&x.grade!=='F')){
    html += `<div class="req-row"><span class="req-icon">└</span><span class="req-label" style="color:#666">지리교육과 전선인정</span><span class="req-val" style="color:${geoEduAccumReq>=9?'#fbbf24':'#34d399'}">${geoEduAccumReq}/9학점</span></div>`;
  }

  if(isAgriMajor()){
    const agriEff = calcAgriEffectiveCredits();
    const agriReq = getAgriCreditReq();
    const kindLabel = getMajorKind('agri')==='double'?'복수':'부전공';
    html += reqRow('🌾', `교직과정(${kindLabel})`, `${agriEff}/${agriReq}`, agriEff>=agriReq, agriEff>=agriReq*0.6);
    html += miniBar(agriEff, agriReq, '#fbbf24');
    // 타과인정 현황
    const agriGeoOv = completedCourses.filter(c=>AGRI_OVERLAP_CODES.geo.includes(c.code)&&c.grade!=='F');
    const agriEconOv = completedCourses.filter(c=>AGRI_OVERLAP_CODES.econ.includes(c.code)&&c.grade!=='F');
    const agriGeoC = Math.min(3, agriGeoOv.length*3);
    const agriEconC = hasAnyMajor('econ') ? 0 : Math.min(9, agriEconOv.length*3);
    const agriOvTotal = Math.min(9, agriGeoC+agriEconC);
    if(agriOvTotal>0||agriGeoOv.length>0||agriEconOv.length>0){
      html += `<div class="req-section-title" style="color:#888">↔ 타과인정 (최대 9학점)</div>`;
      agriGeoOv.forEach(c=>{ html += reqRow('↔', c.name.substring(0,10), '+3학점', true, false); });
      if(hasAnyMajor('econ')&&agriEconOv.length>0){
        html += `<div class="req-row"><span class="req-icon" style="color:#ef4444">✗</span><span class="req-label">경제학부 복전 → 경제학부 과목 중복불가</span></div>`;
      } else {
        agriEconOv.forEach(c=>{ html += reqRow('↔', c.name.substring(0,10), '+3학점', true, false); });
      }
      html += reqRow('↔', '타과인정 합계', `${agriOvTotal}/9학점`, agriOvTotal>0, false);
    } else {
      html += `<div class="req-row"><span class="req-icon">↔</span><span class="req-label" style="color:#888">타과인정 가능: 사회교육과·경제학부 과목 (최대 9학점)</span></div>`;
    }
  }
  if(isEconMajor()){
    const econEff = calcEconEffectiveCredits();
    const econReq = getEconCreditReq();
    const kindLabel = getMajorKind('econ')==='double'?'복수':'부전공';
    html += reqRow('💰', `경제학부(${kindLabel})`, `${econEff}/${econReq}`, econEff>=econReq, econEff>=econReq*0.6);
    html += miniBar(econEff, econReq, '#818cf8');
    html += `<div class="req-row"><span class="req-icon">↔</span><span class="req-label" style="color:#888">타과인정 없음 — 경제학부 과목만 집계</span></div>`;
  }
  if(isForestMajor()){
    const forestReq = getForestCreditReq();
    const kindLabel = getMajorKind('forest')==='double'?'복수':'부전공';
    html += reqRow('🌲', `산림환경학(${kindLabel})`, `${player.forestCredits}/${forestReq}`, player.forestCredits>=forestReq, player.forestCredits>=forestReq*0.6);
    html += miniBar(player.forestCredits, forestReq, '#22c55e');
    html += `<div class="req-row"><span class="req-icon">↔</span><span class="req-label" style="color:#888">타과인정 없음 — 산림환경학 과목만 집계</span></div>`;
  }
  if(isJapanMajor()){
    const japanReq = getJapanCreditReq();
    const japanEff = calcJapanEffectiveCredits();
    const kindLabel = getMajorKind('japan')==='double'?'복수':'부전공';
    html += reqRow('🇯🇵', `일본언어문명(${kindLabel})`, `${japanEff}/${japanReq}`, japanEff>=japanReq, japanEff>=japanReq*0.6);
    html += miniBar(japanEff, japanReq, '#f59e0b');
    // 타과인정 현황
    const japanCross = completedCourses.filter(c=>JAPAN_CROSSOVER_CODES.includes(c.code)&&c.grade!=='F');
    const japanCrossC = Math.min(9, japanCross.length*3);
    html += `<div class="req-section-title" style="color:#888">↔ 타과인정 (최대 9학점, 3과목)</div>`;
    if(japanCross.length>0){
      japanCross.forEach(c=>{ html += reqRow('↔', c.name.substring(0,10), '+3학점', true, false); });
      html += reqRow('↔', '타과인정 합계', `${japanCrossC}/9학점`, japanCrossC>0, false);
    } else {
      html += `<div class="req-row"><span class="req-icon" style="color:#888">·</span><span class="req-label" style="color:#888">인정과목 미이수 (정치외교·역사학부·일본학연계)</span></div>`;
    }
  }
  if(isJapanStudiesMajor()){
    const jsReq = 36;
    const jsEff = calcJapanStudiesEffectiveCredits();
    const jsHum = calcJapanStudiesHumanitCredit();
    html += reqRow('🇯🇵', '연계전공 일본학', `${jsEff}/${jsReq}`, jsEff>=jsReq, jsEff>=jsReq*0.6);
    html += miniBar(jsEff, jsReq, '#60a5fa');
    html += reqRow(chk(passed('M3236.000100')), '전필: 일본학 입문', passed('M3236.000100')?'이수':'미이수', passed('M3236.000100'), false);
    html += reqRow(chk(jsHum>=6), `인문대 개설 과목`, `${jsHum}학점`, jsHum>=6, jsHum>=3);
    // 타과인정 현황
    const jsCross = completedCourses.filter(c=>JSTUDIES_CROSSOVER_CODES.includes(c.code)&&c.category!=='japan_studies'&&c.grade!=='F');
    const jsCrossC = Math.min(6, jsCross.reduce((s,c)=>s+c.credit,0));
    html += `<div class="req-section-title" style="color:#888">↔ 타과인정 (최대 6학점)</div>`;
    if(jsCross.length>0){
      jsCross.forEach(c=>{ html += reqRow('↔', c.name.substring(0,10), `+${c.credit}학점`, true, false); });
      html += reqRow('↔', '타과인정 합계', `${jsCrossC}/6학점`, jsCrossC>0, false);
    } else {
      html += `<div class="req-row"><span class="req-icon" style="color:#888">·</span><span class="req-label" style="color:#888">인정과목 미이수 (역사·고미술·경제·정치외교 등)</span></div>`;
    }
  }
  if(isLandMajor()){
    const landReq = getLandCreditReq();
    const landEff = calcLandEffectiveCredits();
    const landReqCr = calcLandRequiredCredits();
    const landElec = completedCourses.filter(c=>c.category==='land'&&c.type==='normal'&&c.grade!=='F').reduce((s,c)=>s+c.credit,0);
    const kindLabel = getMajorKind('land')==='double'?'복수':'부전공';
    const reqNeeded = hasDoubleMajor('land') ? 29 : 19;
    const elecNeeded = hasDoubleMajor('land') ? 19 : 5;
    html += reqRow('🌿', `조경학(${kindLabel})`, `${landEff}/${landReq}`, landEff>=landReq, landEff>=landReq*0.6);
    html += miniBar(landEff, landReq, '#4ade80');
    html += reqRow('📐', `전공필수`, `${landReqCr}/${reqNeeded}`, landReqCr>=reqNeeded, landReqCr>=reqNeeded*0.6);
    html += reqRow('📗', `전공선택`, `${landElec}/${elecNeeded}`, landElec>=elecNeeded, landElec>=elecNeeded*0.6);
    if(hasDoubleMajor('land')){
      const hasStudio = passed('M1707.000300')&&passed('M1707.000400');
      const hasSeminar = passed('M1707.001000')&&passed('M1707.001100');
      html += reqRow(chk(hasStudio||hasSeminar), '졸업작품/논문세미나', hasStudio?'스튜디오1+2':hasSeminar?'논문세미나1+2':'미이수', hasStudio||hasSeminar, false);
    }
    // 타과인정 현황
    const landCross = completedCourses.filter(c=>(LAND_CROSSOVER_CODES.includes(c.code)||c.landOk)&&c.grade!=='F');
    const landGeoC = Math.min(3, landCross.filter(c=>c.category==='geo').length*3);
    const landOtherC = Math.min(9-landGeoC, landCross.filter(c=>c.category!=='geo').length*3);
    const landCrossTotal = landGeoC + landOtherC;
    html += `<div class="req-section-title" style="color:#888">↔ 타과인정 (지리최대3 + 기타 합산 최대 9학점)</div>`;
    if(landCross.length>0){
      landCross.forEach(c=>{
        const isCapped = c.category==='geo' && landGeoC>=3;
        html += reqRow(isCapped?'·':'↔', c.name.substring(0,10), isCapped?'지리3학점 초과':'인정', !isCapped, false);
      });
      html += reqRow('↔', '타과인정 합계', `${landCrossTotal}/9학점`, landCrossTotal>0, false);
    } else {
      html += `<div class="req-row"><span class="req-icon" style="color:#888">·</span><span class="req-label" style="color:#888">인정과목 미이수 (사회교육과·산림환경학·고미술사)</span></div>`;
    }
  }
  if(isGenvMajor()){
    const genvEff  = calcGenvEffectiveCredits();
    const genvSci  = calcGenvSciCredits();
    const sciMin   = Math.ceil(genvEff / 3);
    const reqList  = calcGenvRequiredPassed();
    const internOk = isGenvInternDone();
    html += reqRow('🌍', '글로벌환경경영(연합전공)', `${genvEff}/39`, genvEff>=39, genvEff>=23);
    html += miniBar(genvEff, 39, '#2dd4bf');
    html += reqRow('🔬', `과학기술 과목(1/3 이상)`, `${genvSci}/${sciMin}`, genvSci>=sciMin, genvSci>=Math.ceil(sciMin*0.5));
    html += reqRow(chk(internOk), '인턴 이수', internOk?'이수완료':'미이수', internOk, false);
    const reqNames = {'538.301':'환경경영학','538.402':'환경정책입문','538.404':'환경경영실습','M3713.000400':'글로벌환경경영특강','M1729.001100':'환경경영과지속가능성분석'};
    GENV_REQUIRED_CODES.forEach(code=>{
      const ok = passed(code);
      html += reqRow(chk(ok), reqNames[code]||code, ok?'이수':'미이수', ok, false);
    });
    // 타과인정 현황 (forest/land/agri genvOk 과목)
    html += `<div class="req-section-title" style="color:#888">↔ 타전공 중복인정 (최대 9학점)</div>`;
    let genvOvTotal = 0;
    for(const [cat, codes] of Object.entries(GENV_OVERLAP_CAT_CODES)){
      const blocked = hasAnyMajor(cat);
      const catName = {forest:'사회·문화 심화',land:'법교육 심화',agri:'교직과정'}[cat]||cat;
      const ov = completedCourses.filter(c=>codes.includes(c.code)&&c.grade!=='F');
      if(blocked){
        if(ov.length>0) html += `<div class="req-row"><span class="req-icon" style="color:#ef4444">✗</span><span class="req-label">${catName} 복전 보유 → ${ov.length}과목 중복인정 불가</span></div>`;
      } else {
        ov.forEach(c=>{
          const thisCredit = Math.min(3, c.credit);
          genvOvTotal += thisCredit;
          html += reqRow('↔', c.name.substring(0,11), `+${thisCredit}학점`, true, false);
        });
      }
    }
    const genvOvCapped = Math.min(9, genvOvTotal);
    if(genvOvCapped>0) html += reqRow('↔', '타전공 인정 합계', `${genvOvCapped}/9학점`, genvOvCapped>0, false);
    else html += `<div class="req-row"><span class="req-icon" style="color:#888">·</span><span class="req-label" style="color:#888">산림·조경·교직과정 과목 이수 시 최대 9학점 인정</span></div>`;
    // 크로스리스팅 현황
    const crossPairs = Object.entries(GENV_CROSSLIST).filter(([k])=>k.startsWith('M1729')||k.startsWith('538'));
    const crossDone = crossPairs.filter(([k,v])=>passed(k)||passed(v));
    if(crossDone.length>0){
      html += `<div class="req-section-title" style="color:#888">🔗 크로스리스팅 이수 현황</div>`;
      crossDone.forEach(([k,v])=>{
        const mine = passed(k)?k:v;
        const c = ALL_COURSES_WITH_POLISCI.find(x=>x.code===mine);
        html += reqRow('🔗', (c?.name||mine).substring(0,11), '이수(타코드 차단)', true, false);
      });
    }
  }
  // (그린리더십 교과인증 제거됨)
  html += reqRow('📅', '정규학기', `${regularSemesters}/16`, regularSemesters<=16, regularSemesters<=14);

  html += `<div class="req-section-title">📝 교양 필수 <span style="font-size:9px;color:#888;font-weight:400">(모두 졸업 필수)</span></div>`;
  html += reqRow(chk(hasEnglish), '의사소통 영어', hasEnglish?'이수':'미이수', hasEnglish, false);
  html += reqRow(chk(hasLang2),   '교양외국어(택1)', hasLang2?'이수':'미이수', hasLang2, false);
  html += reqRow(chk(hasWrite1),  '커리어 디자인 1', hasWrite1?'이수':'미이수', hasWrite1, false);
  html += reqRow(chk(hasWrite2),  '커리어 디자인 2', hasWrite2?'이수':'미이수', hasWrite2, false);
  html += reqRow('🏛️', '핵심교양 영역', `${coveredDivs.size}/4개↑`, coveredDivs.size>=4, coveredDivs.size>=2);

  html += `<div class="req-section-title">⭐ 사회교육과 전공필수 <span style="font-size:9px;color:#888;font-weight:400">(택9·기본이수7·교과교육3)</span></div>`;
  html += reqRow('📋', '졸업시험', '정치·경제·사회·문화·법·사회과교육 6영역', true, false);
  html += reqRow(chk(hasSpatial), '사회과학방법론', hasSpatial?'이수':'미이수', hasSpatial, false);
  html += reqRow(chk(hasHistory), '사회과 논리 및 논술', hasHistory?'이수':'미이수', hasHistory, false);

  if(isAgriMajor()){
    const reqs = hasDoubleMajor('agri') ? agriDoubleReqs : agriMinorReqs;
    const done = reqs.filter(passed).length;
    html += `<div class="req-section-title">🌾 교직과정 전필 (${done}/${reqs.length})</div>`;
    reqs.forEach(code=>{
      const c=ALL_COURSES_WITH_POLISCI.find(x=>x.code===code);
      html += reqRow(chk(passed(code)), c?.name.substring(0,9)||code, passed(code)?'✓':'×', passed(code), false);
    });
  }
  if(isEconMajor()){
    const reqs = hasDoubleMajor('econ') ? econDoubleReqs : econMinorReqs;
    const done = reqs.filter(passed).length;
    html += `<div class="req-section-title">💰 경제학부 전필 (${done}/${reqs.length})</div>`;
    reqs.forEach(code=>{
      const c=ALL_COURSES_WITH_POLISCI.find(x=>x.code===code);
      html += reqRow(chk(passed(code)), c?.name.substring(0,9)||code, passed(code)?'✓':'×', passed(code), false);
    });
  }
  if(isForestMajor()){
    const reqs = hasDoubleMajor('forest') ? forestDoubleReqs : forestMinorReqs;
    const done = reqs.filter(passed).length;
    html += `<div class="req-section-title">🌲 산림환경학 전필 (${done}/${reqs.length})</div>`;
    reqs.forEach(code=>{
      const c=ALL_COURSES_WITH_POLISCI.find(x=>x.code===code);
      html += reqRow(chk(passed(code)), c?.name.substring(0,9)||code, passed(code)?'✓':'×', passed(code), false);
    });
  }
  if(isGenvMajor()){
    const done = GENV_REQUIRED_CODES.filter(passed).length;
    html += `<div class="req-section-title">🌍 글로벌환경경영 전필 (${done}/${GENV_REQUIRED_CODES.length})</div>`;
    GENV_REQUIRED_CODES.forEach(code=>{
      const c=ALL_COURSES_WITH_POLISCI.find(x=>x.code===code);
      html += reqRow(chk(passed(code)), c?.name.substring(0,10)||code, passed(code)?'✓':'×', passed(code), false);
    });
    const internOk = isGenvInternDone();
    html += reqRow(chk(internOk), '인턴 이수', internOk?'이수':'미이수', internOk, false);
    const genvEff = calcGenvEffectiveCredits();
    const genvSci = calcGenvSciCredits();
    const sciMin  = Math.ceil(genvEff / 3);
    html += reqRow('🔬', `과기과목(1/3↑)`, `${genvSci}/${sciMin}`, genvSci>=sciMin, genvSci>=Math.ceil(sciMin*0.5));
    // 중복인정 현황
    let overlapTotal = 0;
    for(const [cat, codes] of Object.entries(GENV_OVERLAP_CAT_CODES)){
      if(hasAnyMajor(cat)) continue;
      const ov = completedCourses.filter(c=>codes.includes(c.code)&&c.grade!=='F').reduce((s,c)=>s+c.credit,0);
      overlapTotal += ov;
    }
    const overlapUsed = Math.min(9, overlapTotal);
    if(overlapUsed > 0) html += reqRow('↔', `타전공 중복인정(↑9)`, `${overlapUsed}학점`, true, false);
  }
  for(const pt of ['polisci_a','polisci_b']){
    if(!hasAnyMajor(pt)) continue;
    const ptName = pt==='polisci_a' ? '정치학전공' : '외교학전공';
    const ptIcon = pt==='polisci_a' ? '🗳️' : '🌐';
    const ptReq = getPolisciCreditReq(pt);
    const ptEff = calcPolisciCrossoverCredits(pt);
    const gaC = calcPolisciGaDivCredits(pt);
    const naC = calcPolisciNaDivCredits(pt);
    const daC = calcPolisciDaDivCredits(pt);
    const kindLabel = getMajorKind(pt)==='double'?'복수':'부전공';
    html += `<div class="req-section-title">${ptIcon} ${ptName}(${kindLabel})</div>`;
    html += reqRow('📚', '전공학점', `${ptEff}/${ptReq}`, ptEff>=ptReq, ptEff>=ptReq*0.6);
    html += miniBar(ptEff, ptReq, '#c084fc');
    html += reqRow(chk(passed('200.103')&&passed('200.104')), '학부공통전필', passed('200.103')&&passed('200.104')?'이수':'미이수', passed('200.103')&&passed('200.104'), false);
    if(pt==='polisci_a') html += reqRow(chk(passed('216A.416')), '정치학연습(전필)', passed('216A.416')?'이수':'미이수', passed('216A.416'), false);
    if(pt==='polisci_b') html += reqRow(chk(passed('216B.420')), '국제정치연습(전필)', passed('216B.420')?'이수':'미이수', passed('216B.420'), false);
    html += reqRow('가', '가군 이수', `${gaC}/6`, gaC>=6, gaC>=3);
    html += reqRow('나', '나군 이수', `${naC}/6`, naC>=6, naC>=3);
    html += reqRow('다', '다군 이수', `${daC}/6`, daC>=6, daC>=3);
    // 타과 인정 — 개별 과목 표시
    const crossMax = player.polisciCredits >= 39 ? 9 : 6;
    const crossPassed = completedCourses.filter(c=>POLISCI_CROSSOVER_CODES.includes(c.code)&&c.grade!=='F'&&!['208.215','208.318'].includes(c.code));
    const crossUsed = Math.min(crossMax, crossPassed.length*3);
    html += `<div class="req-section-title" style="color:#888">↔ 타과인정 (최대 ${crossMax}학점, 사회교육과 과목 불가)</div>`;
    if(crossPassed.length>0){
      crossPassed.forEach(c=>{ html += reqRow('↔', c.name.substring(0,10), '+3학점', true, false); });
      html += reqRow('↔', '타과인정 합계', `${crossUsed}/${crossMax}학점`, crossUsed>0, false);
    } else {
      html += `<div class="req-row"><span class="req-icon" style="color:#888">·</span><span class="req-label" style="color:#888">인정과목 미이수 (경제학부 과목 등)</span></div>`;
    }
    const blockedGeo = completedCourses.filter(c=>['208.215','208.318'].includes(c.code)&&c.grade!=='F');
    if(blockedGeo.length>0) blockedGeo.forEach(c=>{
      html += `<div class="req-row"><span class="req-icon" style="color:#ef4444">✗</span><span class="req-label">${c.name.substring(0,10)}: 사회교육과 주전공 → 중복불가</span></div>`;
    });
  }

  // 일본언어문명 전필 요건
  if(isJapanMajor()){
    const japanReq = getJapanCreditReq();
    const japanEff = calcJapanEffectiveCredits();
    const kindLabel = getMajorKind('japan')==='double'?'복수':'부전공';
    const reqAsia = passed('1003.221');
    const reqGuide = passed('M2641.000300');
    html += `<div class="req-section-title">🇯🇵 일본언어문명(${kindLabel}) 전필</div>`;
    html += reqRow(chk(reqAsia), '아시아문명론입문', reqAsia?'이수':'미이수', reqAsia, false);
    if(hasDoubleMajor('japan')) html += reqRow(chk(reqGuide), '아시아연구지도', reqGuide?'이수':'미이수', reqGuide, false);
    html += reqRow('📚', '전공학점', `${japanEff}/${japanReq}`, japanEff>=japanReq, japanEff>=japanReq*0.6);
    html += miniBar(japanEff, japanReq, '#f59e0b');
    // 타과 인정 — 개별 과목 표시
    const japanCross = completedCourses.filter(c=>JAPAN_CROSSOVER_CODES.includes(c.code)&&c.grade!=='F');
    const japanCrossCredit = Math.min(9, japanCross.length*3);
    html += `<div class="req-section-title" style="color:#888">↔ 타과인정 (최대 9학점, 3과목)</div>`;
    if(japanCross.length>0){
      japanCross.forEach(c=>{ html += reqRow('↔', c.name.substring(0,10), '+3학점', true, false); });
      html += reqRow('↔', '타과인정 합계', `${japanCrossCredit}/9학점`, japanCrossCredit>0, false);
    } else {
      html += `<div class="req-row"><span class="req-icon" style="color:#888">·</span><span class="req-label" style="color:#888">인정과목 미이수 (정치외교·역사학부 등)</span></div>`;
    }
  }

  // checkGraduationReady의 checkMajorReq를 여기서 재활용하기 위해 간이 버전
  function quickMajorReqMet(d){
    const t=d.type, k=d.kind;
    if(k==='double'){
      if(t==='agri') return ['M2649.001300','M2649.001400','M2649.001600','M1683.000400','5202.202','5202.205','5202.415'].every(passed)&&calcAgriEffectiveCredits()>=48;
      if(t==='econ') return ['212.201','212.202','212.203','212.204','212.214'].every(passed)&&calcEconEffectiveCredits()>=39;
      if(t==='forest') return ['M1698.001200','M1698.002900','M1698.001900','5241.417'].every(passed)&&player.forestCredits>=48;
      if(t==='polisci_a') return passed('200.103')&&passed('200.104')&&passed('216A.416')&&calcPolisciGaDivCredits('polisci_a')>=6&&calcPolisciNaDivCredits('polisci_a')>=6&&calcPolisciDaDivCredits('polisci_a')>=6&&calcPolisciCrossoverCredits('polisci_a')>=getPolisciCreditReq('polisci_a');
      if(t==='polisci_b') return passed('200.103')&&passed('200.104')&&passed('216B.420')&&calcPolisciGaDivCredits('polisci_b')>=6&&calcPolisciNaDivCredits('polisci_b')>=6&&calcPolisciDaDivCredits('polisci_b')>=6&&calcPolisciCrossoverCredits('polisci_b')>=getPolisciCreditReq('polisci_b');
      if(t==='japan') return passed('1003.221')&&passed('M2641.000300')&&calcJapanEffectiveCredits()>=getJapanCreditReq();
      if(t==='japan_studies') return passed('M3236.000100')&&calcJapanStudiesEffectiveCredits()>=36&&calcJapanStudiesHumanitCredit()>=6;
      if(t==='land'){const le=completedCourses.filter(c=>c.category==='land'&&c.type==='normal'&&c.grade!=='F').reduce((s,c)=>s+c.credit,0);return calcLandRequiredCredits()>=29&&le>=19&&calcLandEffectiveCredits()>=getLandCreditReq()&&(passed('M1707.000300')&&passed('M1707.000400')||passed('M1707.001000')&&passed('M1707.001100'));}
      if(t==='genv'){const eff=calcGenvEffectiveCredits();const sci=calcGenvSciCredits();return GENV_REQUIRED_CODES.every(passed)&&eff>=39&&sci>=Math.ceil(eff/3)&&isGenvInternDone();}
    }
    if(k==='minor'){
      if(t==='agri') return ['5202.202','M2649.001300','M1683.000400','212.201','212.202'].every(passed)&&calcAgriEffectiveCredits()>=24;
      if(t==='econ') return ['212.201','212.202','212.203','212.204','212.214'].every(passed)&&calcEconEffectiveCredits()>=21;
      if(t==='forest') return ['M1698.001200','M1698.002900','M1698.001900','5241.417'].every(passed)&&player.forestCredits>=21;
      if(t==='polisci_a') return passed('200.103')&&passed('200.104')&&passed('216A.416')&&calcPolisciGaDivCredits('polisci_a')>=6&&calcPolisciNaDivCredits('polisci_a')>=6&&calcPolisciDaDivCredits('polisci_a')>=6&&calcPolisciCrossoverCredits('polisci_a')>=getPolisciCreditReq('polisci_a');
      if(t==='polisci_b') return passed('200.103')&&passed('200.104')&&passed('216B.420')&&calcPolisciGaDivCredits('polisci_b')>=6&&calcPolisciNaDivCredits('polisci_b')>=6&&calcPolisciDaDivCredits('polisci_b')>=6&&calcPolisciCrossoverCredits('polisci_b')>=getPolisciCreditReq('polisci_b');
      if(t==='japan') return passed('1003.221')&&calcJapanEffectiveCredits()>=getJapanCreditReq();
      if(t==='japan_studies') return passed('M3236.000100')&&calcJapanStudiesEffectiveCredits()>=36&&calcJapanStudiesHumanitCredit()>=6;
      if(t==='land'){const le=completedCourses.filter(c=>c.category==='land'&&c.type==='normal'&&c.grade!=='F').reduce((s,c)=>s+c.credit,0);return calcLandRequiredCredits()>=19&&le>=5&&calcLandEffectiveCredits()>=getLandCreditReq();}
    }
    return false;
  }
  const anyMet = approvedMajors.some(d=>quickMajorReqMet(d));

  html += `<div class="req-section-title">🏛️ 전공 현황 ${needsMajor&&!anyMet?'<span class="req-fail">— 최소 1개 충족 필요</span>':anyMet?'<span class="req-ok">— 졸업 충족 ✅</span>':''}</div>`;
  if(approvedMajors.length===0){
    const geoIntensive = player.geoCredits>=60;
    html += reqRow('📌', '다전공/심화전공', geoIntensive?'심화전공 ✅':'미신청', geoIntensive, false);
  } else {
    const typeNames={agri:'교직과정',econ:'경제학부',forest:'산림환경학',polisci_a:'정치학전공',polisci_b:'외교학전공',japan:'일본언어문명',japan_studies:'연계전공 일본학',land:'조경학',genv:'글로벌환경경영'};
    const kindNames={double:'복수전공',minor:'부전공'};
    const specialKind={genv:'연합전공',japan_studies:'연계전공'};
    approvedMajors.forEach(d=>{
      const met = quickMajorReqMet(d);
      const label = (typeNames[d.type]||d.type)+' '+(specialKind[d.type]||kindNames[d.kind]||d.kind);
      html += reqRow(met?'✅':'⬜', label, met?'졸업요건 충족':'미충족', met, false);
    });
  }

  return html;
}
