function buildGradHistHTML(){
  const catColor = {liberal:'#f472b6',elective:'#fb7185',geo:'#34d399',geoedu:'#34d399',agri:'#fbbf24',econ:'#818cf8',forest:'#22c55e',polisci:'#c084fc',japan:'#f59e0b',japan_studies:'#60a5fa',history:'#94a3b8',arthistory:'#c4b5fd',edu_history:'#a3e635',sts:'#fb923c',land:'#4ade80',genv:'#2dd4bf',civil:'#38bdf8',energy:'#fbbf24',chembio:'#a78bfa',earth:'#6ee7b7',lifesci:'#f9a8d4',agrobio:'#fde68a',soc:'#c084fc',general:'#64748b'};
  const catLabel = {liberal:'교양',elective:'선택교양',geo:'지리',geoedu:'지리(교육과)',agri:'지역정보',econ:'경제학부',forest:'산림',polisci:'정치외교',japan:'일본언어문명',japan_studies:'일본학(연계)',history:'역사학부',arthistory:'고고미술사',edu_history:'역사교육과',sts:'과학기술학',land:'조경학',genv:'글로벌환경경영',civil:'건설환경공학부',energy:'에너지자원공학과',chembio:'화학생물공학부',earth:'지구환경과학부',lifesci:'생명과학부',agrobio:'응용생물화학부',soc:'사회학과',general:'일반선택'};
  const gradeColor = {
    'A+':'#00c9a7','A0':'#00c9a7','A-':'#00c9a7',
    'B+':'#60a5fa','B0':'#60a5fa','B-':'#60a5fa',
    'C+':'#94a3b8','C0':'#94a3b8','C-':'#94a3b8',
    'F':'#ef4444','S':'#f472b6',
  };

  if(completedCourses.length === 0){
    return `<div style="color:var(--dim);font-size:10px;padding:10px;text-align:center;">아직 이수한 과목이 없습니다</div>`;
  }

  const sorted = [...completedCourses].sort((a,b)=>{
    if(a.grade==='F'&&b.grade!=='F') return 1;
    if(a.grade!=='F'&&b.grade==='F') return -1;
    return 0;
  });

  return sorted.map(c=>{
    // 전공 미인정 → 일반선택
    let effCat = c.category;
    if((c.category==='agri'&&!isAgriMajor())||(c.category==='econ'&&!isEconMajor())||(c.category==='forest'&&!isForestMajor())||(c.category==='polisci'&&!isPolisciMajor())||(c.category==='japan'&&!isJapanMajor())||(c.category==='history'&&!isJapanMajor()&&!isJapanStudiesMajor())||(c.category==='japan_studies'&&!isJapanStudiesMajor())||(c.category==='arthistory'&&!isJapanStudiesMajor())||(c.category==='edu_history'&&!isJapanStudiesMajor())||(c.category==='sts'&&!isJapanStudiesMajor())||(c.category==='land'&&!isLandMajor())||(c.category==='genv'&&!isGenvMajor())||(c.category==='civil'&&!isGenvMajor())||(c.category==='energy'&&!isGenvMajor())||(c.category==='chembio'&&!isGenvMajor())||(c.category==='earth'&&!isGenvMajor())||(c.category==='lifesci'&&!isGenvMajor())||(c.category==='agrobio'&&!isGenvMajor())||(c.category==='soc'&&true)) effCat='general';
    const col = catColor[effCat] || '#94a3b8';
    const gc = gradeColor[c.grade] || '#94a3b8';
    const retake = retakeable(c) ? '<span style="color:#f97316;font-size:7px">↺</span>' : '';
    // 복수/부전공 구분 표시
    let kindTag = '';
    if(effCat==='agri'||effCat==='econ'||effCat==='forest'){
      const k = getMajorKind(effCat);
      if(k) kindTag = `<span style="font-size:6px;color:${k==='double'?'#fbbf24':'#a78bfa'};margin-left:2px">${k==='double'?'복수':'부전'}</span>`;
    }
    if(effCat==='polisci'){
      const pt = c.subtype==='polisci_b'?'polisci_b':'polisci_a';
      const k = getMajorKind(pt)||getMajorKind('polisci_a')||getMajorKind('polisci_b');
      if(k) kindTag = `<span style="font-size:6px;color:${k==='double'?'#fbbf24':'#a78bfa'};margin-left:2px">${k==='double'?'복수':'부전'}</span>`;
    }
    // 지리교육과: 지리전선 / 일반선택 구분
    let geoeduTag = '';
    if(effCat==='geoedu'){
      const geoCredit = c._geoEduGeoCredit || 0;
      const totalCredit = c.credit || 3;
      if(geoCredit <= 0){
        // 전액 일반선택
        geoeduTag = `<span style="font-size:6px;color:#888;margin-left:2px">일반선택</span>`;
      } else if(geoCredit < totalCredit){
        // 일부 지리전선, 나머지 일반선택
        geoeduTag = `<span style="font-size:6px;color:#34d399;margin-left:2px">전선${geoCredit}+일반${totalCredit-geoCredit}</span>`;
      } else {
        // 전액 지리전선
        geoeduTag = `<span style="font-size:6px;color:#34d399;margin-left:2px">지리전선</span>`;
      }
    }
    const semLabelStr = c.semYear
      ? `<span style="font-size:9px;color:#94a3b8;margin-left:3px">${semLabelYear(c.semYear, c.semNum)}</span>`
      : '';
    return `<div class="hist-row">
      <span class="hist-cat" style="background:${col}22;color:${col}">${catLabel[effCat]||'?'}${kindTag}</span>
      <span class="hist-name" title="${c.name}">${c.name}${geoeduTag}${semLabelStr}</span>
      <span class="hist-grade" style="color:${gc}">${c.grade}${retake}</span>
    </div>`;
  }).join('');
}
// ── End Graduation Panel ───────────────────────────────

// ── 정치외교학부 가/나/다군 패널 ───────────────────────
function buildPolisciDivHTML(){
  const types = [];
  if(hasAnyMajor('polisci_a')) types.push({type:'polisci_a', name:'정치학전공', icon:'🗳️', req:'216A.416'});
  if(hasAnyMajor('polisci_b')) types.push({type:'polisci_b', name:'외교학전공', icon:'🌐', req:'216B.420'});
  if(types.length===0) return `<div style="color:var(--dim);font-size:10px;padding:10px;text-align:center;">정치외교학부 전공 미신청</div>`;

  const divColors={ga:'#f97316',na:'#60a5fa',da:'#34d399'};
  const divNames={ga:'가군',na:'나군',da:'다군'};

  let html='';
  for(const {type,name,icon,req} of types){
    const kind=getMajorKind(type);
    const kindLabel=kind==='double'?'복수전공':'부전공';
    const totalReq=getPolisciCreditReq(type);
    const eff=calcPolisciCrossoverCredits(type);
    html+=`<div class="req-section-title">${icon} ${name} (${kindLabel})</div>`;
    html+=reqRow('📚','전공학점',`${eff}/${totalReq}`,eff>=totalReq,eff>=totalReq*0.6);
    html+=miniBar(eff,totalReq,'#c084fc');

    // 분야별 현황
    for(const div of ['ga','na','da']){
      const divCourses=ALL_COURSES_WITH_POLISCI.filter(c=>
        c.category==='polisci' && c.division_pol===div &&
        (c.subtype===type||c.subtype==='polisci_common')
      );
      const done=completedCourses.filter(c=>
        c.category==='polisci'&&c.division_pol===div&&c.grade!=='F'&&
        (c.subtype===type||c.subtype==='polisci_common')
      );
      const doneCredits=done.reduce((s,c)=>s+c.credit,0);
      html+=`<div class="req-section-title" style="color:${divColors[div]};margin-top:4px">${divNames[div]} (${doneCredits}/6학점 필요)</div>`;
      // 이수 과목
      for(const c of done){
        html+=`<div class="req-row"><span class="req-icon"><span class="req-ok">✓</span></span><span class="req-label" style="color:var(--text)">${c.name.substring(0,10)}</span><span class="req-val req-ok">${c.grade}</span></div>`;
      }
      // 미이수 과목 (최대 5개까지 표시)
      const notDone=divCourses.filter(c=>!done.some(d=>d.code===c.code)).slice(0,5);
      for(const c of notDone){
        html+=`<div class="req-row"><span class="req-icon"><span class="req-fail">○</span></span><span class="req-label">${c.name.substring(0,10)}</span><span class="req-val" style="color:#94a3b8">${c.credit}학점</span></div>`;
      }
      if(doneCredits<6){
        const short=6-doneCredits;
        html+=`<div style="font-size:9px;color:#ef4444;padding:2px 0 4px 14px">${short}학점 더 필요</div>`;
      }
    }
    // 전필 현황
    html+=`<div class="req-section-title" style="margin-top:4px">전필</div>`;
    html+=reqRow(chk(passed('200.103')&&passed('200.104')),'학부공통전필',passed('200.103')&&passed('200.104')?'이수':'미이수',passed('200.103')&&passed('200.104'),false);
    html+=reqRow(chk(passed(req)),type==='polisci_a'?'정치학연습':'국제정치연습',passed(req)?'이수':'미이수',passed(req),false);
    // 타과 인정
    const maxCross=player.polisciCredits>=39?9:6;
    const validCross=completedCourses.filter(c=>POLISCI_CROSSOVER_CODES.includes(c.code)&&c.grade!=='F'&&!['208.215','208.318'].includes(c.code));
    const crossCredit=Math.min(maxCross,validCross.length*3);
    html+=`<div class="req-section-title" style="margin-top:4px">타과 인정 (최대 ${maxCross}학점)</div>`;
    if(validCross.length===0){
      html+=`<div style="font-size:9px;color:#666;padding:2px 14px">해당 과목 미이수</div>`;
    } else {
      for(const c of validCross){
        html+=`<div class="req-row"><span class="req-icon"><span class="req-ok">✓</span></span><span class="req-label">${c.name.substring(0,10)}</span><span class="req-val req-ok">+3학점</span></div>`;
      }
      html+=`<div style="font-size:9px;color:#00c9a7;padding:2px 14px">합계: ${crossCredit}학점 인정 (분야분류 미산입)</div>`;
    }
  }
  return html;
}
