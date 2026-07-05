function showTranscript(){
  gameRunning=false; cancelAnimationFrame(animId);
  player.transcriptShown=true;

  const gpa=player.gpa||0;
  document.getElementById('tr-credits').textContent=`${player.credits}/130`;
  const gEl=document.getElementById('tr-gpa');
  gEl.textContent=gpa.toFixed(2);
  gEl.style.color=gpa>=4.0?'#15803d':'#c0392b';
  const majors = doubleMajors.filter(d=>d.approved).map(d=>{
    const typeNames={agri:'교직과정',econ:'경제학부',forest:'산림환경학',geo_intensive:'심화전공',polisci_a:'정치학전공',polisci_b:'외교학전공',japan:'일본언어문명',land:'조경학'};
    const kindNames={double:'복수',minor:'부전공'};
    return `${typeNames[d.type]||d.type}(${kindNames[d.kind]||d.kind})`;
  }).join(', ');
  document.getElementById('tr-breakdown').textContent=`교양${player.liberalCredits}/지리${player.geoCredits}${majors?' | '+majors:''}`;

  const catLabel={liberal:'교양',geo:'사회교육과',agri:'교직과정',econ:'경제학부',forest:'산림환경학',polisci:'정치외교학부',japan:'일본언어문명',history:'역사학부',land:'조경학',genv:'글로벌환경경영',civil:'건설환경공학부',energy:'에너지자원공학과',chembio:'화학생물공학부',earth:'지구환경과학부',lifesci:'생명과학부',agrobio:'응용생물화학부',soc:'사회학과'};
  const gradeColor={A:'#15803d',B:'#1d4ed8',C:'#92400e',S:'#9333ea',F:'#991b1b'};
  document.getElementById('tr-rows').innerHTML=completedCourses.map(c=>{
    const col=gradeColor[c.grade[0]]||'#94a3b8';
    // 전공 미인정 과목은 '일반선택'으로 표시
    let catStr = catLabel[c.category]||'일반선택';
    if((c.category==='agri'&&!isAgriMajor())||(c.category==='econ'&&!isEconMajor())||(c.category==='forest'&&!isForestMajor())||(c.category==='polisci'&&!isPolisciMajor())||(c.category==='japan'&&!isJapanMajor())||(c.category==='history'&&!isJapanMajor()&&!isJapanStudiesMajor())||(c.category==='japan_studies'&&!isJapanStudiesMajor())||(c.category==='arthistory'&&!isJapanStudiesMajor())||(c.category==='edu_history'&&!isJapanStudiesMajor())||(c.category==='sts'&&!isJapanStudiesMajor())||(c.category==='land'&&!isLandMajor())||(c.category==='genv'&&!isGenvMajor())||(c.category==='civil'&&!isGenvMajor())||(c.category==='energy'&&!isGenvMajor())||(c.category==='chembio'&&!isGenvMajor())||(c.category==='earth'&&!isGenvMajor())||(c.category==='lifesci'&&!isGenvMajor())||(c.category==='agrobio'&&!isGenvMajor())||(c.category==='soc'&&true)) catStr='일반선택';
    return `<div style="display:grid;grid-template-columns:1fr 70px 36px 34px;padding:4px 9px;border-bottom:1px solid #e8ecf5;font-size:10px;align-items:center;">
      <span style="color:${c.grade==='F'?'#666':'var(--text)'}">${c.name}</span>
      <span style="color:var(--dim);font-size:9px">${catStr}</span>
      <span style="text-align:right;color:var(--dim)">${c.credit}</span>
      <span style="text-align:right;font-weight:700;color:${col}">${c.grade}</span>
    </div>`;
  }).join('');

  const canGrad = checkGraduationReady();
  const missing=[];
  if(player.credits<130) missing.push(`총학점 부족 (${player.credits}/130)`);
  if(player.liberalCredits<36) missing.push(`교양 부족 (${player.liberalCredits}/36)`);
  if(player.geoCredits<getGeoCreditsRequired()) missing.push(`사회교육과 전공 부족 (${player.geoCredits}/${getGeoCreditsRequired()})`);
  if(!passed('M0000.029300')) missing.push('공간정보분석1 미이수');
  if(!passed('208.421A')) missing.push('지리공간의역사와사상 미이수');
  // 기초교양 전필은 권장사항 — 졸업 required에서 제외
  // GPA 최소 조건 없음
  if(doubleMajors.filter(d=>d.approved).length<1 && player.geoCredits<60) missing.push('단일전공(전공 60학점↑) 또는 복수전공·부전공 1개 필요');
  if(isAgriMajor() && calcAgriEffectiveCredits()<getAgriCreditReq()) missing.push(`교직과정 학점 부족 (${calcAgriEffectiveCredits()}/${getAgriCreditReq()})`);
  if(isEconMajor() && calcEconEffectiveCredits()<getEconCreditReq()) missing.push(`경제학부 학점 부족 (${calcEconEffectiveCredits()}/${getEconCreditReq()})`);
  if(isForestMajor() && player.forestCredits<getForestCreditReq()) missing.push(`산림환경학 학점 부족 (${player.forestCredits}/${getForestCreditReq()})`);
  for(const pt of ['polisci_a','polisci_b']){
    if(!hasAnyMajor(pt)) continue;
    const ptName = pt==='polisci_a'?'정치학전공':'외교학전공';
    const ptReq = getPolisciCreditReq(pt);
    const ptEff = calcPolisciCrossoverCredits(pt);
    if(!passed('200.103')||!passed('200.104')) missing.push(`${ptName}: 학부공통전필 미이수`);
    if(pt==='polisci_a'&&!passed('216A.416')) missing.push('정치학연습 미이수');
    if(pt==='polisci_b'&&!passed('216B.420')) missing.push('국제정치연습 미이수');
    if(calcPolisciGaDivCredits(pt)<6) missing.push(`${ptName}: 가군 부족 (${calcPolisciGaDivCredits(pt)}/6)`);
    if(calcPolisciNaDivCredits(pt)<6) missing.push(`${ptName}: 나군 부족 (${calcPolisciNaDivCredits(pt)}/6)`);
    if(calcPolisciDaDivCredits(pt)<6) missing.push(`${ptName}: 다군 부족 (${calcPolisciDaDivCredits(pt)}/6)`);
    if(ptEff<ptReq) missing.push(`${ptName}: 전공학점 부족 (${ptEff}/${ptReq})`);
  }
  if(isJapanMajor()){
    if(!passed('1003.221')) missing.push('아시아문명론입문 미이수 (일본언어문명 전필)');
    if(hasDoubleMajor('japan')&&!passed('M2641.000300')) missing.push('아시아연구지도 미이수 (일본언어문명 복수전공 전필)');
    if(calcJapanEffectiveCredits()<getJapanCreditReq()) missing.push(`일본언어문명 학점 부족 (${calcJapanEffectiveCredits()}/${getJapanCreditReq()})`);
  }
  if(isLandMajor()){
    const reqNeeded = hasDoubleMajor('land') ? 29 : 19;
    const elecNeeded = hasDoubleMajor('land') ? 19 : 5;
    const landReqCred = calcLandRequiredCredits();
    const landElec = completedCourses.filter(c=>c.category==='land'&&c.type==='normal'&&c.grade!=='F').reduce((s,c)=>s+c.credit,0);
    if(landReqCred<reqNeeded) missing.push(`조경학 전공필수 부족 (${landReqCred}/${reqNeeded})`);
    if(landElec<elecNeeded) missing.push(`조경학 전공선택 부족 (${landElec}/${elecNeeded})`);
    if(calcLandEffectiveCredits()<getLandCreditReq()) missing.push(`조경학 총학점 부족 (${calcLandEffectiveCredits()}/${getLandCreditReq()})`);
    if(hasDoubleMajor('land')){
      const hasStudio=passed('M1707.000300')&&passed('M1707.000400');
      const hasSeminar=passed('M1707.001000')&&passed('M1707.001100');
      if(!hasStudio&&!hasSeminar) missing.push('조경학: 졸업작품스튜디오1+2 또는 졸업논문세미나1+2 미이수');
    }
  }
  if(isGenvMajor()){
    const genvEff = calcGenvEffectiveCredits();
    const genvSci = calcGenvSciCredits();
    const sciMin  = Math.ceil(genvEff / 3);
    if(genvEff < 39) missing.push(`글로벌환경경영 학점 부족 (${genvEff}/39)`);
    if(genvSci < sciMin) missing.push(`글로벌환경경영 과학기술과목 부족 (${genvSci}/${sciMin})`);
    if(!isGenvInternDone()) missing.push('글로벌환경경영: 인턴 미이수');
    GENV_REQUIRED_CODES.forEach(code=>{
      if(!passed(code)){
        const c=ALL_COURSES_WITH_POLISCI.find(x=>x.code===code);
        missing.push(`글로벌환경경영 전필 미이수: ${c?.name||code}`);
      }
    });
  }

  const resultEl=document.getElementById('tr-result');
  const btn=document.getElementById('tr-btn');

  if(canGrad){
    const geoIntensive = doubleMajors.filter(d=>d.approved).length===0 && player.geoCredits>=60;
    resultEl.style.background='#f0fdf4'; resultEl.style.border='1px solid #86efac';
    resultEl.innerHTML=`<div style="font-family:'Black Han Sans',sans-serif;font-size:15px;color:#15803d;margin-bottom:4px;">🎉 졸업 요건 충족! ${geoIntensive?'(사회교육과 심화전공)':''}</div>
      <div style="font-size:11px;color:var(--dim)">GPA <b style="color:#003092">${gpa.toFixed(2)}</b> — 석사과정으로 진학하거나, 초과학기로 계속 수강할 수 있습니다.</div>`;
    btn.textContent='진로 결정 →'; btn.style.background='#00c9a7';
    const continueBtn = document.getElementById('tr-continue-btn');
    if(continueBtn) continueBtn.style.display='';
  } else {
    const geoIntensive = doubleMajors.filter(d=>d.approved).length===0 && player.geoCredits>=60;
    resultEl.style.background='#fef2f2'; resultEl.style.border='1px solid #fca5a5';
    resultEl.innerHTML=`<div style="font-family:'Black Han Sans',sans-serif;font-size:15px;color:#ef4444;margin-bottom:6px;">⚠️ 졸업 요건 미충족</div>
      <div style="font-size:11px;color:var(--dim)">${missing.map(m=>`• ${m}`).join('<br>')}</div>`;
    btn.textContent='계속 수강하기'; btn.style.background='#f97316';
    const continueBtn = document.getElementById('tr-continue-btn');
    if(continueBtn) continueBtn.style.display='none';
  }
  document.getElementById('transcript-overlay').classList.add('show');
}
