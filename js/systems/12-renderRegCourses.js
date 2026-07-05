function renderRegCourses(){
  let offered = getOfferedCourses();

  // 계절학기: 개설 과목 제한
  if(isSeasonalSem(gameSem)){
    offered = offered.filter(c =>
      c.category==='elective' ||
      (c.category==='econ' && SEASONAL_ECON_CODES.has(c.code)) ||
      (c.category==='liberal' && c.type==='div_liberal' && SEASONAL_LIBERAL_CODES.has(c.code)) ||
      (c.category==='liberal' && (c.type==='required_liberal'||c.type==='lang2') && SEASONAL_BASIC_CODES.has(c.code)) ||
      c.category==='cert_study' ||
      c.category==='research_contact' ||
      isSeasonalSem(gameSem)  // 계절학기 허용
    );
  }

  // Filter by active tab
  if(currentRegTab === 'liberal_basic'){
    offered = offered.filter(c => c.category==='liberal' && (c.type==='required_liberal' || c.type==='lang2' || c.type==='basic_required'));
  } else if(currentRegTab === 'liberal_world'){
    offered = offered.filter(c => c.category==='liberal' && c.type==='div_liberal');
  } else if(currentRegTab === 'econ'){
    offered = offered.filter(c => c.category==='econ');
  } else if(currentRegTab === 'forest'){
    offered = offered.filter(c => c.category==='forest');
  } else if(currentRegTab === 'polisci'){
    offered = offered.filter(c => c.category==='polisci');
  } else if(currentRegTab === 'history'){
    offered = offered.filter(c => c.category==='history');
  } else if(currentRegTab === 'japan'){
    offered = offered.filter(c => c.category==='japan');
  } else if(currentRegTab === 'japan_studies'){
    offered = offered.filter(c => c.category==='japan_studies');
  } else if(currentRegTab === 'arthistory'){
    offered = offered.filter(c => c.category==='arthistory');
  } else if(currentRegTab === 'edu_history'){
    offered = offered.filter(c => c.category==='edu_history');
  } else if(currentRegTab === 'sts'){
    offered = offered.filter(c => c.category==='sts');
  } else if(currentRegTab === 'land'){
    offered = offered.filter(c => c.category==='land');
  } else if(currentRegTab === 'genv'){
    offered = offered.filter(c => c.category==='genv');
  } else if(['civil','energy','chembio','earth','lifesci','agrobio','soc'].includes(currentRegTab)){
    offered = offered.filter(c => c.category===currentRegTab);
  } else if(currentRegTab === 'geoedu'){
    offered = offered.filter(c => c.category==='geoedu');
  } else if(currentRegTab === 'cert_study'){
    offered = offered.filter(c => c.category==='cert_study');
  } else if(currentRegTab === 'elective'){
    offered = offered.filter(c => c.category==='elective');
    const indy1Done = completedCourses.some(c=>c.code==='054.001'&&c.grade==='A+');
    if(!indy1Done) offered = offered.filter(c=>c.code!=='054.002');
    const planDone = (player.researchPlanDone || false);
    if(!planDone){
      offered = offered.filter(c=>c.code!=='054.001'&&c.code!=='054.002');
    }
    // seasonalOnly 과목(그린리더십인턴십): 계절학기에만 개설
    if(!isSeasonalSem(gameSem)){
      offered = offered.filter(c=>!c.seasonalOnly);
    }
    // 그린리더십 인턴십: 선수조건 미충족 시 숨김
    if(!checkGreenLeaderReq().ok){
      offered = offered.filter(c=>c.code!=='053.011');
    }
  } else if(currentRegTab === 'research_plan'){
    renderResearchPanel();
    return;
  } else {
    offered = offered.filter(c => c.category===currentRegTab);
  }

  if(window._addDropFilter) offered = offered.filter(window._addDropFilter);

  const el = document.getElementById('reg-course-list');
  if(!el) return;

  const maxC = parseInt(document.getElementById('reg-max-credits').textContent) || getMaxCredits();
  const usedCredits = pendingRegistration.reduce((s,r)=>{
    const c=ALL_COURSES_WITH_POLISCI.find(x=>x.code===r.code); return s+(c?c.credit:0);
  },0);
  document.getElementById('reg-selected-credits').textContent = usedCredits;
  document.getElementById('reg-selected-credits').style.color = usedCredits>maxC?'#ef4444':'#60a5fa';


  // ── 섹션 헤더 설정 ──────────────────────────────────────
  // 각 탭별로 과목을 그룹화하여 섹션 헤더와 함께 표시
  // sectionFn(c) → 섹션 키 반환. null이면 섹션 없이 flat 렌더
  // sectionOrder: 섹션 키 순서 배열
  // sectionLabel: 섹션 키 → 표시 이름
  const SECTION_CONFIGS = {
    geo: {
      fn: c => c.type==='required_geo' ? 'req' : 'elec',
      order: ['req','elec'],
      label: { req:'⭐ 전공필수', elec:'📚 전공선택' },
    },
    geoedu: {
      fn: c => c.type==='required_geo' ? 'req' : 'elec',
      order: ['req','elec'],
      label: { req:'⭐ 전공필수', elec:'📚 전공선택' },
    },
    agri: {
      fn: c => c.type==='required_agri' ? 'req' : 'elec',
      order: ['req','elec'],
      label: { req:'⭐ 전공필수', elec:'📚 전공선택' },
    },
    econ: {
      fn: c => c.type==='required_econ' ? 'req' : 'elec',
      order: ['req','elec'],
      label: { req:'⭐ 전공필수', elec:'📚 전공선택' },
    },
    forest: {
      fn: c => c.type==='required_forest' ? 'req' : 'elec',
      order: ['req','elec'],
      label: { req:'⭐ 전공필수', elec:'📚 전공선택' },
    },
    polisci: {
      fn: c => {
        if(c.type==='required_polisci'||c.type==='required_polisci_a'||c.type==='required_polisci_b') return 'req';
        const d = c.division_pol;
        if(d==='ga') return 'ga';
        if(d==='na') return 'na';
        if(d==='da') return 'da';
        return 'elec';
      },
      order: ['req','ga','na','da','elec'],
      label: { req:'⭐ 전공필수', ga:'가군', na:'나군', da:'다군', elec:'전선(군 미분류)' },
    },
    japan: {
      fn: c => c.type==='required_japan' ? 'req' : 'elec',
      order: ['req','elec'],
      label: { req:'⭐ 전공필수', elec:'📚 전공선택' },
    },
    japan_studies: {
      fn: c => c.type==='required_jstudies' ? 'req' : 'elec',
      order: ['req','elec'],
      label: { req:'⭐ 전공필수', elec:'📚 전공선택' },
    },
    land: {
      fn: c => {
        if(c.type==='required_land') return 'req';
        if(c.type==='land_thesis') return 'thesis';
        return 'elec';
      },
      order: ['req','elec','thesis'],
      label: { req:'⭐ 전공필수', elec:'📚 전공선택', thesis:'🎓 졸업작품/논문세미나' },
    },
    genv: {
      fn: c => c.type==='required_genv' ? 'req' : 'self',
      order: ['req','self'],
      label: {
        req:  '⭐ 전공필수',
        self: '🌍 자체 개설 전공선택',
      },
    },
    civil:    { fn: c => 'elec', order: ['elec'], label: { elec:'📚 과목' } },
    energy:    { fn: c => 'elec', order: ['elec'], label: { elec:'📚 과목' } },
    chembio:    { fn: c => 'elec', order: ['elec'], label: { elec:'📚 과목' } },
    earth:    { fn: c => 'elec', order: ['elec'], label: { elec:'📚 과목' } },
    lifesci:    { fn: c => 'elec', order: ['elec'], label: { elec:'📚 과목' } },
    agrobio:    { fn: c => 'elec', order: ['elec'], label: { elec:'📚 과목' } },
    soc:     { fn: c => c.polisciOk ? 'polisci_ok' : c.greenOk ? 'green_ok' : 'elec', order: ['elec','polisci_ok','green_ok'], label: { elec:'📚 과목', polisci_ok:'🗳️ 정치외교학부 인정 과목', green_ok:'🌿 그린리더십 교과인증 과목' } },
    history: { fn: c => c.polisciOk ? 'polisci_ok' : 'japan_ok', order: ['japan_ok','polisci_ok'], label: { japan_ok:'🇯🇵 일본언어문명 인정 과목', polisci_ok:'🗳️ 정치외교학부 인정 과목' } },
    elective: {
      fn: c => {
        if(c.greenInternship) return 'gl_intern';
        if(c.greenOk) return 'green';
        if(c.subcat==='leadership') return 'leadership';
        if(c.subcat==='sport') return 'sport';
        if(c.subcat==='art') return 'art';
        if(c.subcat==='creative') return 'creative';
        return 'other';
      },
      order: ['gl_intern','green','leadership','sport','art','creative','other'],
      label: {
        gl_intern:   '🌿 그린리더십 인턴십',
        green:       '🌿 그린리더십 교과인증 과목',
        leadership:  '👥 대학과 리더십',
        sport:       '🏃 스포츠',
        art:         '🎨 예술 실기',
        creative:    '💡 창의와 융합',
        other:       '📚 기타',
      },
    },
    liberal_world: {
      fn: c => {
        const divNames = {1:'언어와문학',2:'문화와예술',3:'역사와철학',4:'정치와경제',5:'인간과사회',6:'자연과기술',7:'생명과환경'};
        return `div${c.division||0}`;
      },
      order: ['div1','div2','div3','div4','div5','div6','div7'],
      label: {
        div1:'언어와 문학', div2:'문화와 예술', div3:'역사와 철학',
        div4:'정치와 경제', div5:'인간과 사회', div6:'자연과 기술 (필수)', div7:'생명과 환경 (필수)',
      },
    },
  };

  const secConfig = SECTION_CONFIGS[currentRegTab];

  // ── 과목 카드 빌더 ──────────────────────────────────


  // ── 섹션별 렌더링 ────────────────────────────────────
  let html = '';

  // 이공계 타전공 탭 상단 안내
  if(currentRegTab === 'elective'){
    const gl = checkGreenLeaderReq();
    if(!gl.ok){
      html += `<div style="background:#f0fdf4;border:1px solid #86efac;border-radius:7px;padding:8px 12px;margin-bottom:8px;font-size:11px;color:#166534;">
        🌿 <b>그린리더십 인턴십 수강 조건</b>: 핵심/교과인증 <b>${gl.coreCertCount}/2과목</b> · 인정과목 <b>${gl.totalCredits}/9학점</b> · 평점 <b>${gl.avgGpa>0?gl.avgGpa.toFixed(2):'—'}/2.7</b>
        <span style="color:#888"> — 조건 충족 시 계절학기에 그린리더십 인턴십 수강 가능</span>
      </div>`;
    }
  }
  if(['civil','energy','chembio','earth','lifesci','agrobio','soc'].includes(currentRegTab)){
    const deptNames = {civil:'정치 영역',energy:'경제 영역',chembio:'법 영역',earth:'사회 영역',lifesci:'문화 영역',agrobio:'사회과교육 영역',soc:'통합사회 영역'};
    html += `<div style="background:#f0f9ff;border:1px solid #7dd3fc;border-radius:7px;padding:8px 12px;margin-bottom:8px;font-size:11px;color:#0c4a6e;">
      🌍 <b>${deptNames[currentRegTab]}</b> 개설 과목
      <span style="color:#888"> — 글로벌환경경영학 인정 과목은 <b style="color:#0369a1">↔글로벌환경경영</b> 배지로 표시됩니다.</span>
    </div>`;
  }
  if(secConfig){
    // 섹션 그룹화
    const groups = {};
    for(const c of offered){
      const key = secConfig.fn(c);
      if(!groups[key]) groups[key] = [];
      groups[key].push(c);
    }
    let anySection = false;
    for(const key of secConfig.order){
      if(!groups[key] || groups[key].length === 0) continue;
      anySection = true;
      html += `<div class="crs-section-head">${secConfig.label[key]||key} (${groups[key].length})</div>`;
      html += groups[key].map(c=>buildCourseCard(c, usedCredits, maxC)).join('');
    }
    if(!anySection){
      html = `<div class="crs-no-courses">이번 학기 제공 과목 없음</div>`;
    }
  } else {
    // 섹션 없이 flat 렌더
    html = offered.map(c=>buildCourseCard(c, usedCredits, maxC)).join('') || `<div class="crs-no-courses">이번 학기 제공 과목 없음</div>`;
  }

  el.innerHTML = html;
  renderPickSlots();
}
