function msnCard(title, body){
  return `<div class="msn-card"><div class="msn-card-title">${title}</div>${body}</div>`;
}
function msnRow(label, val, cls=''){
  return `<div class="msn-row"><span class="msn-label">${label}</span><span class="msn-val ${cls}">${val}</span></div>`;
}
function msnBadge(text, type='blue'){
  return `<span class="msn-badge msn-badge-${type}">${text}</span>`;
}
function msnProg(cur, max, color='#003092'){
  const pct = max>0 ? Math.min(100, Math.round(cur/max*100)) : 0;
  const col = pct>=100 ? '#1a8f4a' : pct>=60 ? '#003092' : '#c0392b';
  return `<div class="msn-prog-bar"><div class="msn-prog-fill" style="width:${pct}%;background:${col}"></div></div>`;
}
function msnCourseList(courses, highlightPassed=true){
  return courses.map(code=>{
    const c = ALL_COURSES_WITH_POLISCI.find(x=>x.code===code);
    const name = c?.name || code;
    const done = passed(code);
    return `<div class="msn-course-row">
      <span><span class="code">${code}</span>${name.substring(0,16)}</span>
      <span style="color:${done?'#1a8f4a':'#c0392b'};font-weight:600">${done?'✓ 이수':'○ 미이수'}</span>
    </div>`;
  }).join('');
}

function openMySNU(){
  const _semNum = (gameSem==='summer'||gameSem==='winter') ? 0 : (typeof gameSem==='number' ? gameSem : parseInt(gameSem)||1);
  const _yearDisplay = _semNum===0 ? `${gameYear}학년 계절학기` : `${gameYear}학년 ${_semNum}학기`;
  document.getElementById('mysnu-user-label').textContent = `${player.name||'학생'} · 사회교육과 ${_yearDisplay}`;
  _mySnuMainTab = 'major';
  _mySnuSubTab  = 'geo';
  document.getElementById('mysnu-overlay').classList.add('show');
  renderMySnuNav();
  renderMySnuContent();
}

// ── 전공별 콘텐츠 렌더 ──
function renderMySnuContent(){
  const el = document.getElementById('mysnu-content');
  const sub = _mySnuSubTab;
  let html = '';

  // ── 수업·학업 ──────────────────────────────────
  if(sub==='geo'){
    const eff = player.geoCredits||0;
    const req = getGeoCreditsRequired();
    html += msnCard('📍 사회교육과 (주전공)', `
      ${msnRow('전공 이수학점', `${eff} / ${req}학점`, eff>=req?'msn-ok':'')}
      ${msnProg(eff, req)}
      ${msnRow('공간정보분석 1', passed('M0000.029300')?'<span class="msn-ok">이수</span>':'<span class="msn-ng">미이수</span>')}
      ${msnRow('지리공간의 역사와 사상', passed('208.421A')?'<span class="msn-ok">이수</span>':'<span class="msn-ng">미이수</span>')}
    `);
    const geoElec = ALL_COURSES_WITH_POLISCI.filter(c=>c.category==='geo'&&c.type!=='required_geo');
    const geoReq  = ALL_COURSES_WITH_POLISCI.filter(c=>c.category==='geo'&&c.type==='required_geo');
    html += msnCard('⭐ 전공필수', msnCourseList(geoReq.map(c=>c.code)));

    html += msnCard('📌 지리교육과 타전공 인정', `
      <div style="font-size:11px;color:#555;line-height:1.8;padding:4px 0;">
        사회교육과 주전공 이수자는 <b>지리교육과(geoedu) 과목을 최대 9학점</b>까지 사회교육과 전공선택으로 인정받을 수 있습니다.<br>
        • 9학점 초과분은 일반선택으로 처리됩니다.<br>
        • 지리교육과 과목은 수강신청 → 타전공 → 지리교육과 탭에서 수강 가능합니다.
      </div>
    `);
    html += msnCard('📚 전공선택 (이수 현황)', `
      <div class="msn-row"><span class="msn-label">총 이수 과목</span><span class="msn-val">${completedCourses.filter(c=>c.category==='geo'&&c.grade!=='F').length}개</span></div>
      <div style="max-height:200px;overflow-y:auto;margin-top:6px">
      ${geoElec.map(c=>{const done=passed(c.code);return done?`<div class="msn-course-row"><span><span class="code">${c.code}</span>${c.name.substring(0,16)}</span><span class="msn-ok">✓ 이수</span></div>`:''}).filter(Boolean).join('') || '<div style="color:#888;font-size:11px;padding:4px">이수한 전공선택 없음</div>'}
      </div>
    `);

  } else if(sub==='agri'){
    const eff = calcAgriEffectiveCredits();
    const req = getAgriCreditReq();
    const kind = getMajorKind('agri');
    const agriDoubleReqs = ['M2649.001300','M2649.001400','M2649.001600','M1683.000400','5202.202','5202.205','5202.415'];
    const agriMinorReqs  = ['5202.202','M2649.001300','M1683.000400','212.201','212.202'];
    const reqs = kind==='double' ? agriDoubleReqs : agriMinorReqs;
    html += msnCard('🌾 교직과정 이수 현황', `
      ${!isAgriMajor() ? '<div style="color:#888;font-size:12px">교직과정 과목 미이수 상태입니다.</div>' : `
      ${msnRow('신청 구분', kind==='double'?'복수전공 (48학점)':'부전공 (24학점)')}
      ${msnRow('이수학점', `${eff} / ${req}학점`, eff>=req?'msn-ok':'msn-ng')}
      ${msnProg(eff, req)}
      `}
    `);
    html += msnCard('📋 교직과정 이수 규정', `
      <div style="font-size:11px;color:#555;line-height:2;padding:2px 0;">
        <b>복수전공 (48학점)</b><br>
        • 전공필수 7과목 필수 이수<br>
        • 타과인정: 사회교육과 최대 3학점 + 경제학부 최대 6학점 = 최대 9학점<br>
        <br>
        <b>부전공 (24학점)</b><br>
        • 전공필수 5과목 필수 이수<br>
        • 타과인정: 사회교육과 최대 3학점 + 경제학부 최대 6학점 = 최대 9학점
      </div>
    `);
    html += msnCard('⭐ 전공필수', msnCourseList(reqs));
    const agriCR = code=>{const c=ALL_COURSES_WITH_POLISCI.find(x=>x.code===code);const done=passed(code);return `<div class="msn-course-row"><span><span class="code">${code}</span>${(c?.name||code).substring(0,16)}</span><span style="color:${done?'#1a8f4a':'#888'}">${done?'✓':'미이수'}</span></div>`;};
    html += msnCard('↔ 타과인정 목록', `
      <div class="msn-section-head">사회교육과 과목 (최대 3학점, 1과목)</div>${AGRI_OVERLAP_CODES.geo.map(agriCR).join('')}
      <div class="msn-section-head" style="margin-top:6px">경제학부 과목 (최대 6학점, 2과목)</div>${AGRI_OVERLAP_CODES.econ.map(agriCR).join('')}
    `);

  } else if(sub==='econ'){
    const eff = calcEconEffectiveCredits();
    const req = getEconCreditReq();
    const kind = getMajorKind('econ');
    const econDoubleReqs = ['212.201','212.202','212.203','212.204','212.214'];
    const econMinorReqs  = ['212.201','212.202','212.203','212.204','212.214'];
    const reqs = kind==='double' ? econDoubleReqs : econMinorReqs;
    html += msnCard('💰 경제학부 이수 현황', `
      ${!isEconMajor() ? '<div style="color:#888;font-size:12px">다전공 미신청 상태입니다.</div>' : `
      ${msnRow('신청 구분', kind==='double'?'복수전공 (39학점)':'부전공 (21학점)')}
      ${msnRow('이수학점', `${eff} / ${req}학점`, eff>=req?'msn-ok':'msn-ng')}
      ${msnProg(eff, req)}
      `}
    `);
    html += msnCard('📋 경제학부 이수 규정', `
      <div style="font-size:11px;color:#555;line-height:2;padding:2px 0;">
        <b>복수전공 (39학점)</b><br>
        • 전공필수 5과목 (미시경제이론·거시경제이론·경제사·경제통계학·경제수학) 필수<br>
        • 타과인정: <b>없음</b> — 경제학부(212.xxx) 과목만 학점 인정<br>
        <br>
        <b>부전공 (21학점)</b><br>
        • 전공필수 5과목 동일하게 필수<br>
        • 타과인정: <b>없음</b>
      </div>
    `);
    html += msnCard('⭐ 전공필수 (5과목)', msnCourseList(reqs));
    const econCR = code=>{const c=ALL_COURSES_WITH_POLISCI.find(x=>x.code===code);const done=passed(code);return `<div class="msn-course-row"><span><span class="code">${code}</span>${(c?.name||code).substring(0,16)}</span><span style="color:${done?'#1a8f4a':'#888'}">${done?'✓':'미이수'}</span></div>`;};
    const econAsAgri = AGRI_OVERLAP_CODES.econ || [];
    const econAsPolisci = POLISCI_CROSSOVER_CODES.filter(c=>ALL_COURSES_WITH_POLISCI.find(x=>x.code===c)?.category==='econ');
    html += msnCard('↔ 경제학부 과목이 인정되는 타전공', `
      <div class="msn-section-head">교직과정 타과인정 (최대 6학점)</div>${econAsAgri.map(econCR).join('')}
      <div class="msn-section-head" style="margin-top:6px">정치외교학부 타과인정</div>${econAsPolisci.map(econCR).join('')}
    `);

  } else if(sub==='forest'){
    const forestEff = player.forestCredits||0;
    const forestReq = getForestCreditReq();
    const kind = getMajorKind('forest');
    const forestDoubleReqs = ['M1698.001200','M1698.002900','M1698.001900','5241.417'];
    const forestMinorReqs  = ['M1698.001200','M1698.002900','M1698.001900','5241.417'];
    const reqs = kind==='double' ? forestDoubleReqs : forestMinorReqs;
    html += msnCard('🌲 산림환경학 이수 현황', `
      ${!isForestMajor() ? '<div style="color:#888;font-size:12px">다전공 미신청 상태입니다.</div>' : `
      ${msnRow('신청 구분', kind==='double'?'복수전공 (48학점)':'부전공 (21학점)')}
      ${msnRow('이수학점', `${forestEff} / ${forestReq}학점`, forestEff>=forestReq?'msn-ok':'msn-ng')}
      ${msnProg(forestEff, forestReq)}
      `}
    `);
    html += msnCard('📋 산림환경학 이수 규정', `
      <div style="font-size:11px;color:#555;line-height:2;padding:2px 0;">
        <b>복수전공 (48학점)</b><br>
        • 전공필수 4과목 (조림학·산림경영학·학술림연구·산림환경학연구) 필수<br>
        • 타과인정: <b>없음</b> — 산림환경학(M1698.xxx / 5241.xxx) 과목만 인정<br>
        <br>
        <b>부전공 (21학점)</b><br>
        • 전공필수 4과목 동일하게 필수<br>
        • 타과인정: <b>없음</b>
      </div>
    `);
    html += msnCard('⭐ 전공필수 (4과목)', msnCourseList(reqs));

  } else if(sub==='polisci'){
    for(const pt of ['polisci_a','polisci_b']){
      const ptName = pt==='polisci_a'?'정치학전공':'외교학전공';
      const ptIcon = pt==='polisci_a'?'🗳️':'🌐';
      const eff = calcPolisciCrossoverCredits(pt);
      const req = getPolisciCreditReq(pt);
      const kind = getMajorKind(pt);
      const gaC = calcPolisciGaDivCredits(pt);
      const naC = calcPolisciNaDivCredits(pt);
      const daC = calcPolisciDaDivCredits(pt);
      html += msnCard(`${ptIcon} ${ptName} 이수 현황`, `
        ${!hasAnyMajor(pt) ? `<div style="color:#888;font-size:12px">${ptName} 다전공 미신청</div>` : `
        ${msnRow('신청 구분', kind==='double'?`복수전공 (39학점)`:`부전공 (21학점)`)}
        ${msnRow('총 이수학점', `${eff} / ${req}학점`, eff>=req?'msn-ok':'msn-ng')}
        ${msnProg(eff, req)}
        ${msnRow('가군 이수', `${gaC} / 6학점`, gaC>=6?'msn-ok':gaC>0?'':'msn-ng')}
        ${msnRow('나군 이수', `${naC} / 6학점`, naC>=6?'msn-ok':naC>0?'':'msn-ng')}
        ${msnRow('다군 이수', `${daC} / 6학점`, daC>=6?'msn-ok':daC>0?'':'msn-ng')}
        ${msnRow('전필 학부공통', passed('200.103')&&passed('200.104')?'<span class="msn-ok">이수</span>':'<span class="msn-ng">미이수</span>')}
        ${pt==='polisci_a'?msnRow('전필 정치학연습', passed('216A.416')?'<span class="msn-ok">이수</span>':'<span class="msn-ng">미이수</span>'):''}
        ${pt==='polisci_b'?msnRow('전필 국제정치연습', passed('216B.420')?'<span class="msn-ok">이수</span>':'<span class="msn-ng">미이수</span>'):''}
        `}
      `);
    }
    html += msnCard('📋 정치외교학부 이수 규정', `
      <div style="font-size:11px;color:#555;line-height:2;padding:2px 0;">
        <b>정치학전공 / 외교학전공 공통</b><br>
        • 학부공통전필 2과목 (국제정치학개론·비교정치학개론) 필수<br>
        • 복수전공: 39학점 / 부전공: 21학점<br>
        • 가군·나군·다군 각 <b>최소 6학점(2과목) 이상</b> 이수 필수<br>
        • 타과인정: 최대 6학점 (39학점 이상 시 9학점으로 확대)<br>
        • 사회교육과 주전공 과목(208.215, 208.318)은 중복인정 불가<br>
        <br>
        <b>가군 (정치사상·비교정치·정치사)</b><br>
        비교정치론, 서양정치사상, 국제관계사, 정치학연구방법론 등<br>
        <b>나군 (한국정치·국제정치·외교정책)</b><br>
        일본정치론, 외교정책론, 미국과 국제관계, 유럽정치론 등<br>
        <b>다군 (방법론·특수분야·국제정치경제)</b><br>
        행정학이론, 국제정치경제론, 한반도와 국제정치, 안보론 등
      </div>
    `);
    // 타과인정 목록
    const polCR = code=>{const c=ALL_COURSES_WITH_POLISCI.find(x=>x.code===code);const done=passed(code);return `<div class="msn-course-row"><span><span class="code">${code}</span>${(c?.name||code).substring(0,16)}</span><span style="color:${done?'#1a8f4a':'#888'}">${done?'✓':'미이수'}</span></div>`;};
    const polCross = POLISCI_CROSSOVER_CODES.filter(c=>!['208.215','208.318'].includes(c));
    const polHist  = polCross.filter(c=>ALL_COURSES_WITH_POLISCI.find(x=>x.code===c)?.category==='history');
    const polSoc   = polCross.filter(c=>ALL_COURSES_WITH_POLISCI.find(x=>x.code===c)?.category==='soc');
    const polEcon  = polCross.filter(c=>ALL_COURSES_WITH_POLISCI.find(x=>x.code===c)?.category==='econ');
    html += msnCard('↔ 타과인정 목록 (최대 6~9학점)', `
      <div class="msn-section-head">역사학부</div>${polHist.map(polCR).join('')}
      <div class="msn-section-head" style="margin-top:6px">사회학과</div>${polSoc.map(polCR).join('')}
      <div class="msn-section-head" style="margin-top:6px">경제학부</div>${polEcon.map(polCR).join('')}
      <div style="font-size:10px;color:#888;margin-top:6px">⚠ 사회교육과 주전공 과목(208.215, 208.318)은 중복인정 불가</div>
    `);

  } else if(sub==='japan'){
    const eff = calcJapanEffectiveCredits();
    const req = getJapanCreditReq();
    const kind = getMajorKind('japan');
    html += msnCard('🇯🇵 일본언어문명 이수 현황', `
      ${!isJapanMajor() ? '<div style="color:#888;font-size:12px">다전공 미신청 상태입니다.</div>' : `
      ${msnRow('신청 구분', kind==='double'?'복수전공 (39학점)':'부전공 (21학점)')}
      ${msnRow('이수학점', `${eff} / ${req}학점`, eff>=req?'msn-ok':'msn-ng')}
      ${msnProg(eff, req)}
      ${msnRow('전필 아시아문명론입문', passed('1003.221')?'<span class="msn-ok">이수</span>':'<span class="msn-ng">미이수</span>')}
      ${kind==='double'?msnRow('전필 아시아연구지도', passed('M2641.000300')?'<span class="msn-ok">이수</span>':'<span class="msn-ng">미이수</span>'):''}
      `}
    `);
    html += msnCard('📋 일본언어문명 이수 규정', `
      <div style="font-size:11px;color:#555;line-height:2;padding:2px 0;">
        <b>복수전공 (39학점)</b><br>
        • 전공필수 2과목 (아시아문명론입문·아시아연구지도) 필수<br>
        • 타과인정: 정치외교·역사학부·연계전공 일본학 과목 최대 9학점(3과목)<br>
        <br>
        <b>부전공 (21학점)</b><br>
        • 전공필수 1과목 (아시아문명론입문) 필수<br>
        • 타과인정: 최대 9학점(3과목)
      </div>
    `);
    html += msnCard('↔ 타과인정 목록 (최대 9학점)', JAPAN_CROSSOVER_CODES.map(code=>{const c=ALL_COURSES_WITH_POLISCI.find(x=>x.code===code);const done=passed(code);return `<div class="msn-course-row"><span><span class="code">${code}</span>${(c?.name||code).substring(0,18)}</span><span style="color:${done?'#1a8f4a':'#888'}">${done?'✓ 이수':'미이수'}</span></div>`;}).join(''));

  } else if(sub==='jstud'){
    const eff = calcJapanStudiesEffectiveCredits();
    const jsHum = calcJapanStudiesHumanitCredit();
    html += msnCard('🇯🇵 연계전공 일본학', `
      ${!isJapanStudiesMajor() ? '<div style="color:#888;font-size:12px">연계전공 미신청 상태입니다.</div>' : `
      ${msnRow('이수학점', `${eff} / 36학점`, eff>=36?'msn-ok':'msn-ng')}
      ${msnProg(eff, 36)}
      ${msnRow('전필 일본학입문', passed('M3236.000100')?'<span class="msn-ok">이수</span>':'<span class="msn-ng">미이수</span>')}
      ${msnRow('인문대 개설 6학점', `${jsHum}학점`, jsHum>=6?'msn-ok':'msn-ng')}
      ${msnRow('타과인정', '최대 6학점')}
      `}
    `);
    html += msnCard('↔ 연계전공 일본학 타과인정', JSTUDIES_CROSSOVER_CODES.map(code=>{const c=ALL_COURSES_WITH_POLISCI.find(x=>x.code===code);if(!c||c.category==='japan_studies')return '';const done=passed(code);return `<div class="msn-course-row"><span><span class="code">${code}</span>${(c?.name||code).substring(0,18)}</span><span style="color:${done?'#1a8f4a':'#888'}">${done?'✓ 이수':'미이수'}</span></div>`;}).filter(Boolean).join(''));

  } else if(sub==='land'){
    const eff = calcLandEffectiveCredits();
    const req = getLandCreditReq();
    const kind = getMajorKind('land');
    const reqCr = calcLandRequiredCredits();
    const elecCr = completedCourses.filter(c=>c.category==='land'&&c.type==='normal'&&c.grade!=='F').reduce((s,c)=>s+c.credit,0);
    const hasStudio1 = passed('M1707.000300');
    const hasStudio2 = passed('M1707.000400');
    const hasSeminar1 = passed('M1707.001000');
    const hasSeminar2 = passed('M1707.001100');
    const hasDesign1 = passed('5271.324');   // 조경설계1 (선수: 공간디자인)
    const hasDesign2 = passed('5271.412');   // 조경설계2 (선수: 조경계획)
    const hasPlan   = passed('5271.311');    // 조경계획 (선수: 조경설계1)
    html += msnCard('🌿 조경학 이수 현황', `
      ${!isLandMajor() ? '<div style="color:#888;font-size:12px">다전공 미신청 상태입니다.</div>' : `
      ${msnRow('신청 구분', kind==='double'?'복수전공 (48학점)':'부전공 (24학점)')}
      ${msnRow('총 이수학점', `${eff} / ${req}학점`, eff>=req?'msn-ok':'msn-ng')}
      ${msnProg(eff, req)}
      ${msnRow('전공필수', `${reqCr} / ${kind==='double'?29:19}학점`, reqCr>=(kind==='double'?29:19)?'msn-ok':'')}
      ${msnRow('전공선택', `${elecCr} / ${kind==='double'?19:5}학점`, elecCr>=(kind==='double'?19:5)?'msn-ok':'')}
      ${kind==='double'?`
        <div style="height:1px;background:#e8ecf5;margin:6px 0;"></div>
        ${msnRow('졸업작품스튜디오 1', hasStudio1?'<span class="msn-ok">이수</span>':'<span class="msn-ng">미이수</span>')}
        ${msnRow('졸업작품스튜디오 2', hasStudio2?'<span class="msn-ok">이수</span>':hasStudio1?'<span style="color:#f59e0b">수강 가능</span>':'<span class="msn-ng">스튜디오1 선수 필요</span>')}
        <div style="font-size:10px;color:#888;margin:2px 0 4px;">또는</div>
        ${msnRow('졸업논문세미나 1', hasSeminar1?'<span class="msn-ok">이수</span>':'<span class="msn-ng">미이수</span>')}
        ${msnRow('졸업논문세미나 2', hasSeminar2?'<span class="msn-ok">이수</span>':hasSeminar1?'<span style="color:#f59e0b">수강 가능</span>':'<span class="msn-ng">세미나1 선수 필요</span>')}
      `:''}
      `}
    `);
    html += msnCard('📋 조경학 이수 규정', `
      <div style="font-size:11px;color:#555;line-height:2;padding:2px 0;">
        <b>복수전공 (48학점 = 전필 29 + 전선 19)</b><br>
        <b>부전공 (24학점 = 전필 19 + 전선 5)</b><br>
        <br>
        <b>📐 설계 과목 이수 순서 (복수전공 필수)</b><br>
        ① 공간디자인(5271.214A) → ② 조경설계1(5271.324) → ③ 조경계획(5271.311) → ④ 조경설계2(5271.412)<br>
        → 조경설계2 이수 후 ⑤ 졸업작품스튜디오1 → ⑥ 졸업작품스튜디오2 수강 가능<br>
        <br>
        <b>🎓 졸업 조건 (복수전공)</b><br>
        다음 중 하나 완료:<br>
        • 졸업작품스튜디오 1 + 2 (순차 이수, 스튜디오1 선수 필요)<br>
        • 졸업논문세미나 1 + 2 (순차 이수)<br>
        <br>
        <b>↔ 타과인정: 사회교육과 최대 3학점 + 기타 최대 6학점 = 합산 9학점</b>
      </div>
    `);
    // 설계 이수 현황
    html += msnCard('📐 설계 과목 이수 현황', `
      ${msnRow('① 공간디자인', passed('5271.214A')?'<span class="msn-ok">이수</span>':'<span class="msn-ng">미이수</span>')}
      ${msnRow('② 조경설계1', hasDesign1?'<span class="msn-ok">이수</span>':passed('5271.214A')?'<span style="color:#f59e0b">수강 가능</span>':'<span style="color:#888">공간디자인 선수</span>')}
      ${msnRow('③ 조경계획', hasPlan?'<span class="msn-ok">이수</span>':hasDesign1?'<span style="color:#f59e0b">수강 가능</span>':'<span style="color:#888">조경설계1 선수</span>')}
      ${msnRow('④ 조경설계2', hasDesign2?'<span class="msn-ok">이수</span>':hasPlan?'<span style="color:#f59e0b">수강 가능</span>':'<span style="color:#888">조경계획 선수</span>')}
      ${msnRow('⑤ 졸업작품스튜디오1', hasStudio1?'<span class="msn-ok">이수</span>':hasDesign2?'<span style="color:#f59e0b">수강 가능</span>':'<span style="color:#888">조경설계2 선수</span>')}
      ${msnRow('⑥ 졸업작품스튜디오2', hasStudio2?'<span class="msn-ok">이수</span>':hasStudio1?'<span style="color:#f59e0b">수강 가능</span>':'<span style="color:#888">스튜디오1 선수</span>')}
    `);
    // 타과인정 목록
    const landCR = code=>{const c=ALL_COURSES_WITH_POLISCI.find(x=>x.code===code);const done=passed(code);return `<div class="msn-course-row"><span><span class="code">${code}</span>${(c?.name||code).substring(0,16)}</span><span style="color:${done?'#1a8f4a':'#888'}">${done?'✓':'미이수'}</span></div>`;};
    const lCivil = LAND_CROSSOVER_CODES.filter(c=>ALL_COURSES_WITH_POLISCI.find(x=>x.code===c)?.category==='civil');
    const lForest= LAND_CROSSOVER_CODES.filter(c=>ALL_COURSES_WITH_POLISCI.find(x=>x.code===c)?.category==='forest');
    const lGeo   = LAND_CROSSOVER_CODES.filter(c=>ALL_COURSES_WITH_POLISCI.find(x=>x.code===c)?.category==='geo');
    const lOther = LAND_CROSSOVER_CODES.filter(c=>!['civil','forest','geo'].includes(ALL_COURSES_WITH_POLISCI.find(x=>x.code===c)?.category||''));
    html += msnCard('↔ 타과인정 목록', `
      ${lGeo.length?`<div class="msn-section-head">사회교육과 (최대 3학점)</div>${lGeo.map(landCR).join('')}`:''}
      ${lForest.length?`<div class="msn-section-head" style="margin-top:6px">산림환경학</div>${lForest.map(landCR).join('')}`:''}
      ${lCivil.length?`<div class="msn-section-head" style="margin-top:6px">건설환경공학부</div>${lCivil.map(landCR).join('')}`:''}
      ${lOther.length?`<div class="msn-section-head" style="margin-top:6px">기타</div>${lOther.map(landCR).join('')}`:''}
    `);

  } else if(sub==='genv'){
    const eff = calcGenvEffectiveCredits();
    const sci = calcGenvSciCredits();
    const sciMin = Math.ceil(eff/3);
    const internDone = isGenvInternDone();
    const studio404 = passed('538.404'); // 환경경영 실습(인턴과정)
    html += msnCard('🌍 글로벌환경경영학 이수 현황', `
      ${!isGenvMajor() ? '<div style="color:#888;font-size:12px">다전공 미신청 상태입니다.</div>' : `
      ${msnRow('신청 구분', '연합전공 (39학점)')}
      ${msnRow('이수학점', `${eff} / 39학점`, eff>=39?'msn-ok':'msn-ng')}
      ${msnProg(eff, 39)}
      ${msnRow('과학기술 과목 (1/3 이상)', `${sci} / ${sciMin}학점`, sci>=sciMin?'msn-ok':'msn-ng')}
      ${msnRow('인턴 이수', internDone?'<span class="msn-ok">완료</span>':'<span class="msn-ng">미완료 — 졸업 필수</span>')}
      ${msnRow('환경경영실습 수강 가능', studio404?'<span class="msn-ok">이수 완료</span>':internDone?'<span style="color:#f59e0b">인턴 완료 → 수강 가능</span>':'<span style="color:#888">인턴 먼저 필요</span>')}
      ${msnRow('합격 평점 기준', '3.7 ± 0.1')}
      `}
    `);
    html += msnCard('📋 글로벌환경경영학 이수 규정', `
      <div style="font-size:11px;color:#555;line-height:2;padding:2px 0;">
        <b>연합전공 (39학점, 부전공 없음)</b><br>
        • 전공필수 5과목 모두 이수 필수<br>
        • 과학기술 관련 과목이 전체 이수학점의 <b>1/3 이상</b>이어야 함<br>
        • <b>인턴 이수 (졸업 필수 요건)</b>: 다음 중 하나 이수<br>
        &nbsp;&nbsp;① 수강신청 → 인턴 탭에서 글환경 관련 인턴십 신청·완수<br>
        &nbsp;&nbsp;→ 인턴 이수 완료 후 <b>환경경영 실습(인턴과정, 538.404) 수강 가능</b><br>
        • 타전공 중복인정: 산림·조경·교직과정 과목 최대 9학점<br>
        &nbsp;&nbsp;(단, 해당 전공을 복수전공으로 보유 시 중복인정 불가)
      </div>
    `);
    html += msnCard('⭐ 전공필수 (5과목)', msnCourseList(GENV_REQUIRED_CODES));

  // ── 대학원 ──────────────────────────────────────
  } else if(sub==='grad_geo'){
    const gradDeptGeo = GRAD_DEPTS.find(d=>d.id==='geo');
    const tepsGeo = player.certs.텝스||0;
    html += msnCard('🎓 대학원 입시 — 사회교육과', `
      ${msnRow('전형 방식', '1차 서류심사 → 2차 구술면접')}
      ${msnRow('현재 GPA', `${(player.gpa||0).toFixed(2)}`)}
      ${msnRow('TEPS (석사 요구)', `${tepsGeo} / ${gradDeptGeo?.masterTeps||298}점 이상`, tepsGeo>=(gradDeptGeo?.masterTeps||298)?'msn-ok':'msn-ng')}
    `);

  } else if(sub==='grad_agri'){
    html += msnCard('🎓 대학원 입시 — 농경제사회학부', `
      ${msnRow('전형 방식', '1차 서류 → 2차 면접')}
      ${msnRow('현재 GPA', `${(player.gpa||0).toFixed(2)}`)}
      ${(()=>{const dep=GRAD_DEPTS.find(d=>d.id==='agri');const t=player.certs.텝스||0;return msnRow('TEPS (석사 요구)',`${t} / ${dep?.masterTeps||327}점 이상`,t>=(dep?.masterTeps||327)?'msn-ok':'msn-ng');})()}
      ${msnRow('교직과정 복전', isAgriMajor()?`<span class="msn-ok">${getMajorKind('agri')==='double'?'복수전공':'부전공'} 신청됨</span>`:'<span style="color:#888">미신청</span>')}
    `);

  } else if(sub==='grad_econ'){
    html += msnCard('🎓 대학원 입시 — 경제학부', `
      ${msnRow('전형 방식', '1차 필기(경제원론) → 2차 면접')}
      ${msnRow('현재 GPA', `${(player.gpa||0).toFixed(2)}`)}
      ${(()=>{const dep=GRAD_DEPTS.find(d=>d.id==='econ');const t=player.certs.텝스||0;return msnRow('TEPS (석사 요구)',`${t} / ${dep?.masterTeps||387}점 이상`,t>=(dep?.masterTeps||387)?'msn-ok':'msn-ng');})()}
      ${msnRow('경제학부 복전', isEconMajor()?`<span class="msn-ok">${getMajorKind('econ')==='double'?'복수전공':'부전공'} 신청됨</span>`:'<span style="color:#888">미신청</span>')}
    `);

  } else if(sub==='grad_forest'){
    html += msnCard('🎓 대학원 입시 — 산림환경학', `
      ${msnRow('전형 방식', '서류 → 면접')}
      ${msnRow('현재 GPA', `${(player.gpa||0).toFixed(2)}`)}
      ${(()=>{const dep=GRAD_DEPTS.find(d=>d.id==='forest');const t=player.certs.텝스||0;return msnRow('TEPS (석사 요구)',`${t} / ${dep?.masterTeps||298}점 이상`,t>=(dep?.masterTeps||298)?'msn-ok':'msn-ng');})()}
      ${msnRow('산림환경학 복전', isForestMajor()?`<span class="msn-ok">${getMajorKind('forest')==='double'?'복수전공':'부전공'} 신청됨</span>`:'<span style="color:#888">미신청</span>')}
    `);

  } else if(sub==='grad_polisci'){
    html += msnCard('🎓 대학원 입시 — 정치외교학부', `
      ${msnRow('전형 방식', '1차 서류 → 2차 면접')}
      ${msnRow('현재 GPA', `${(player.gpa||0).toFixed(2)}`)}
      ${(()=>{const dep=GRAD_DEPTS.find(d=>d.id==='polisci');const t=player.certs.텝스||0;return msnRow('TEPS (석사 요구)',`${t} / ${dep?.masterTeps||387}점 이상`,t>=(dep?.masterTeps||387)?'msn-ok':'msn-ng');})()}
      ${msnRow('정치외교 복전', isPolisciMajor()?`<span class="msn-ok">${getMajorKind('polisci_a')||getMajorKind('polisci_b')?'신청됨':''}</span>`:'<span style="color:#888">미신청</span>')}
    `);

  } else if(sub==='grad_land'){
    html += msnCard('🎓 대학원 입시 — 조경학', `
      ${msnRow('전형 방식', '서류 + 포트폴리오 → 면접')}
      ${msnRow('현재 GPA', `${(player.gpa||0).toFixed(2)}`)}
      ${(()=>{const dep=GRAD_DEPTS.find(d=>d.id==='land');const t=player.certs.텝스||0;return msnRow('TEPS (석사 요구)',`${t} / ${dep?.masterTeps||298}점 이상`,t>=(dep?.masterTeps||298)?'msn-ok':'msn-ng');})()}
      ${msnRow('조경학 복전', isLandMajor()?`<span class="msn-ok">${getMajorKind('land')==='double'?'복수전공':'부전공'} 신청됨</span>`:'<span style="color:#888">미신청</span>')}
    `);

  } else if(sub==='grad_japan'){
    html += msnCard('🎓 대학원 입시 — 아시아언어문명학부 (일본언어문명·일본학)', `
      ${msnRow('전형 방식', '서류 → 구술면접')}
      ${msnRow('현재 GPA', `${(player.gpa||0).toFixed(2)}`)}
      ${msnRow('일본언어문명 복전', isJapanMajor()?`<span class="msn-ok">${getMajorKind('japan')==='double'?'복수전공':'부전공'} 신청됨</span>`:'<span style="color:#888">미신청</span>')}
      ${msnRow('연계전공 일본학', isJapanStudiesMajor()?'<span class="msn-ok">신청됨</span>':'<span style="color:#888">미신청</span>')}
      ${msnRow('어학 성적 (한국사검정)', player.certs&&player.certs.snult일본어>=70?`<span class="msn-ok">${player.certs.snult일본어}점</span>`:`<span style="color:#888">${(player.certs&&player.certs.snult일본어)||0}점</span>`)}
    `);

  // ── 비교과 ──────────────────────────────────────
  } else if(sub==='greenleader'){
    const gl = checkGreenLeaderReq();
    html += msnCard('🌿 그린리더십 교과인증', `
      ${msnRow('핵심/교과인증 과목', `${gl.coreCertCount} / 2과목 이상`, gl.coreCertCount>=2?'msn-ok':'msn-ng')}
      ${msnProg(gl.coreCertCount, 2)}
      ${msnRow('인정과목 이수학점', `${gl.totalCredits} / 9학점 이상`, gl.totalCredits>=9?'msn-ok':'msn-ng')}
      ${msnProg(gl.totalCredits, 9)}
      ${msnRow('이수 평점평균', `${gl.avgGpa>0?gl.avgGpa.toFixed(2):'—'} / 2.7 이상`, gl.avgGpa>=2.7?'msn-ok':'msn-ng')}
      ${msnRow('인턴십 수강 가능 여부', gl.ok?'<span class="msn-ok">조건 충족 ✓</span>':'<span class="msn-ng">조건 미충족</span>')}
      ${msnRow('그린리더십 인턴십 이수', isGreenLeaderInternDone()?'<span class="msn-ok">이수 완료</span>':'<span style="color:#888">미이수 (계절학기)</span>')}
    `);
    html += msnCard('⭐ 핵심교과목', [...GL_CORE_CODES].map(code=>{const c=ALL_COURSES_WITH_POLISCI.find(x=>x.code===code);const done=passed(code);return `<div class="msn-course-row"><span><span class="code">${code}</span>${(c?.name||code).substring(0,18)}</span><span style="color:${done?'#1a8f4a':'#888'}">${done?'✓ 이수':'미이수'}</span></div>`;}).join(''));
    html += msnCard('📋 교과인증교과목', [...GL_CERT_CODES].map(code=>{const c=ALL_COURSES_WITH_POLISCI.find(x=>x.code===code);const done=passed(code);return `<div class="msn-course-row"><span><span class="code">${code}</span>${(c?.name||code).substring(0,18)}</span><span style="color:${done?'#1a8f4a':'#888'}">${done?'✓ 이수':'미이수'}</span></div>`;}).join(''));
    const ssArr = [...GL_SS_CODES], sciArr = [...GL_SCI_CODES];
    html += msnCard('📗 학점인정 — 녹색사회과학', ssArr.map(code=>{const c=ALL_COURSES_WITH_POLISCI.find(x=>x.code===code);const done=passed(code);return done?`<div class="msn-course-row"><span><span class="code">${code}</span>${(c?.name||code).substring(0,18)}</span><span class="msn-ok">✓ 이수</span></div>`:'';}).filter(Boolean).join('')||'<div style="color:#888;font-size:11px;padding:4px">이수 과목 없음</div>');
    html += msnCard('🔬 학점인정 — 지속가능성 과학', sciArr.map(code=>{const c=ALL_COURSES_WITH_POLISCI.find(x=>x.code===code);const done=passed(code);return done?`<div class="msn-course-row"><span><span class="code">${code}</span>${(c?.name||code).substring(0,18)}</span><span class="msn-ok">✓ 이수</span></div>`:'';}).filter(Boolean).join('')||'<div style="color:#888;font-size:11px;padding:4px">이수 과목 없음</div>');

  } else if(sub==='internship'){
    const done = player.interns.filter(x=>x.done);
    const pending = player.interns.filter(x=>!x.done);
    html += msnCard('💼 인턴십 이수 현황', `
      ${msnRow('이수 완료', `${done.length}개`)}
      ${done.length ? done.map(i=>`<div class="msn-course-row"><span>${i.name}</span><span class="msn-ok">✓ 완료</span></div>`).join('') : '<div style="color:#888;font-size:11px;padding:4px">이수한 인턴십 없음</div>'}
      ${pending.length ? `<div class="msn-section-head" style="margin-top:8px">진행 중</div>${pending.map(i=>`<div class="msn-course-row"><span>${i.name}</span><span style="color:#f59e0b">진행중</span></div>`).join('')}` : ''}
    `);

  } else if(sub==='volunteer'){
    const volDone = completedCourses.filter(c=>c.code==='053.003'&&c.grade==='S');
    const volCount = volDone.length;
    html += msnCard('🤝 사회봉사 이수 현황', `
      ${msnRow('이수 횟수', `${volCount}회 (각 1학점)`)}
      ${msnProg(Math.min(volCount, 4), 4)}
      <div style="font-size:10px;color:#888;margin-top:8px;padding:6px;background:#f8f9fc;border-radius:5px;">
        사회봉사 1 (053.003)은 매 학기 반복 이수 가능합니다.
      </div>
    `);
    html += msnCard('📋 이수 이력', volCount > 0
      ? volDone.map((c,i)=>`<div class="msn-course-row"><span>사회봉사 1 (${i+1}회차)</span><span class="msn-ok">S 이수</span></div>`).join('')
      : '<div style="color:#888;font-size:11px;padding:4px">아직 이수한 사회봉사 과목이 없습니다.</div>'
    );

  } else if(sub==='research'){
    // 학생자율연구 이수 현황
    const res1 = completedCourses.filter(c=>c.code==='054.001').sort((a,b)=>0);
    const res2 = completedCourses.filter(c=>c.code==='054.002').sort((a,b)=>0);
    const res1Best = res1.reduce((best,c)=>{ const g=['A+','A0','A-','B+','B0','B-','C+','C0','C-','D+','D0','F'];return (!best||g.indexOf(c.grade)<g.indexOf(best.grade))?c:best; }, null);
    const res2Best = res2.reduce((best,c)=>{ const g=['A+','A0','A-','B+','B0','B-','C+','C0','C-','D+','D0','F'];return (!best||g.indexOf(c.grade)<g.indexOf(best.grade))?c:best; }, null);
    const planDone = player.researchPlanDone || false;
    const res1APlus = res1.some(c=>c.grade==='A+');
    html += msnCard('📖 학생자율연구 이수 현황', `
      ${msnRow('교수 컨택 / 연구계획', planDone ? '<span class="msn-ok">완료</span>' : '<span class="msn-ng">미완료</span>')}
      ${msnRow('학생자율연구 1', res1Best ? `<span class="msn-ok">${res1Best.grade} (${res1.length}회 이수)</span>` : planDone ? '<span style="color:#888">미이수</span>' : '<span class="msn-ng">연구계획 필요</span>')}
      ${msnRow('학생자율연구 2', res2Best ? `<span class="msn-ok">${res2Best.grade} (${res2.length}회 이수)</span>` : res1APlus ? '<span style="color:#888">미이수</span>' : '<span class="msn-ng">자율연구1 A+ 필요</span>')}
      ${msnRow('연계 대학원 가산점', player.researchDept ? `<span class="msn-ok">${{geo:'사회교육과',agri:'농경제사회학부',econ:'경제학부',forest:'산림환경학',polisci:'정치외교학부',land:'조경학'}[player.researchDept]||player.researchDept} 대학원 입시 유리</span>` : '<span style="color:#888">없음 (교수 컨택 필요)</span>')}
    `);
    html += msnCard('📋 안내', `
      <div style="font-size:11px;color:#555;line-height:1.7;">
        <b>교수 컨택 및 연구계획 완수</b> 후 수강신청 가능합니다.<br>
        • 학생자율연구 1: 2학점, A~F 성적<br>
        • 학생자율연구 2: 자율연구1 A+ 이수 후 수강 가능, 2학점<br>
        • 좋은 성적 이수 시 연계 전공 <b>대학원 입시 가산점</b> 적용
      </div>
    `);
  }

  el.innerHTML = html;
}
