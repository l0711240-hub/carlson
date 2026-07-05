function switchRegTab(tab){
  currentRegTab = tab;
  ['liberal_basic','liberal_world','geo','agri','econ','forest','polisci','history','japan','japan_studies','arthistory','edu_history','sts','land','genv','civil','energy','chembio','earth','lifesci','agrobio','soc','cert_study','elective','research_plan'].forEach(t=>{
    const el = document.getElementById('tab-'+t);
    if(el) el.classList.toggle('active', t===tab);
  });
  // CRS 헤더 라벨 갱신
  const labelEl = document.getElementById('crs-cur-tab-label');
  if(labelEl){
    const el = document.getElementById('tab-'+tab);
    labelEl.textContent = el ? el.textContent.trim() : tab;
  }
  renderRegCourses();
  renderGradPanel();
}

function crsNavClick(view){
  ['search','basket'].forEach(v=>{
    const el = document.getElementById('crs-nav-'+v);
    if(el) el.classList.toggle('active', v===view);
  });
}

function crsSearch(){
  const q = (document.getElementById('crs-search-input')?.value||'').trim().toLowerCase();
  if(!q){ window._addDropFilter=null; renderRegCourses(); return; }
  const type = document.getElementById('crs-search-type')?.value||'교과목명';
  window._addDropFilter = c => {
    if(type==='학수번호') return c.code.toLowerCase().includes(q);
    return c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q);
  };
  // 검색 시 탭 제한 없이 전체 과목에서 검색
  renderRegCoursesSearch(q);
}

function renderRegCoursesSearch(q){
  const el = document.getElementById('reg-course-list');
  if(!el) return;
  // 검색은 전체 과목 대상 (탭/계절학기 제한 없이)
  const all = ALL_COURSES_WITH_POLISCI.filter(c=>
    c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
  );
  const labelEl = document.getElementById('crs-cur-tab-label');
  if(labelEl) labelEl.textContent = `'${q}' 검색 결과 ${all.length}건`;
  const maxC = parseInt(document.getElementById('reg-max-credits').textContent)||18;
  const usedCredits = pendingRegistration.reduce((s,r)=>{const c=ALL_COURSES_WITH_POLISCI.find(x=>x.code===r.code);return s+(c?c.credit:0);},0);
  el.innerHTML = all.length
    ? all.map(c=>buildCourseCard(c, usedCredits, maxC)).join('')
    : `<div class="crs-no-courses">검색 결과가 없습니다.</div>`;
}

function buildCourseCard(c, usedCredits, maxC){
    const divColors = {1:'#a78bfa',2:'#f472b6',3:'#fb923c',4:'#60a5fa',5:'#34d399',6:'#fbbf24',7:'#00c9a7'};
    const pickColors = ['','#ef4444','#f97316','#ffd93d','#22c55e','#00c9a7','#60a5fa','#a78bfa','#c084fc','#f472b6','#fb923c'];
    const reg = pendingRegistration.find(r=>r.code===c.code);
    const inSlot = !!reg;
    const wouldExceed = !inSlot && (usedCredits + c.credit) > maxC;
    const lastGrade = [...completedCourses].reverse().find(x=>x.code===c.code);
    const isRequired = c.type==='required_geo'||c.type==='required_agri'||c.type==='required_polisci'||c.type==='required_polisci_a'||c.type==='required_polisci_b'||c.type==='required_japan'||c.type==='required_jstudies'||c.type==='required_econ'||c.type==='required_forest'||c.type==='required_land'||c.type==='required_genv';
    const isLibRequired = c.type==='required_liberal';
    const isGeneralElective = (c.category==='agri'&&!isAgriMajor())||(c.category==='econ'&&!isEconMajor())||(c.category==='forest'&&!isForestMajor())||(c.category==='polisci'&&!isPolisciMajor())||(c.category==='japan'&&!isJapanMajor())||(c.category==='history'&&!isJapanMajor()&&!isJapanStudiesMajor())||(c.category==='japan_studies'&&!isJapanStudiesMajor())||(c.category==='arthistory'&&!isJapanStudiesMajor())||(c.category==='edu_history'&&!isJapanStudiesMajor())||(c.category==='sts'&&!isJapanStudiesMajor())||(c.category==='land'&&!isLandMajor())||(c.category==='genv'&&!isGenvMajor());
    const geoEduAccumBadge = c.category==='geoedu'
      ? completedCourses.filter(x=>x.category==='geoedu'&&x.grade!=='F').reduce((s,x)=>s+(x._geoEduGeoCredit||0),0)
      : 0;
    const geoEduTag = c.category==='geoedu'
      ? `<span style="font-size:7px;color:${geoEduAccumBadge<9?'#34d399':'#888'};border:1px solid ${geoEduAccumBadge<9?'#16a34a':'#d1d5db'};border-radius:3px;padding:1px 4px;background:${geoEduAccumBadge<9?'#f0fdf4':'#f9fafb'}">지리전선(${geoEduAccumBadge}/9학점)</span>`
      : '';
    const majorKindTag = !isGeneralElective && (c.category==='agri'||c.category==='econ'||c.category==='forest') ?
      (() => { const k=getMajorKind(c.category); return k ? `<span style="font-size:7px;color:${k==='double'?'#fbbf24':'#a78bfa'};border:1px solid ${k==='double'?'#fbbf24':'#a78bfa'};border-radius:2px;padding:0 2px">${k==='double'?'복수전공':'부전공'}</span>` : ''; })()
      : '';
    const polDivColors2 = {ga:'#f97316',na:'#60a5fa',da:'#34d399',required:'#f472b6',elective:'#94a3b8'};
    const polDivNames2 = {ga:'가군',na:'나군',da:'다군',required:'전필',elective:'전선'};
    const polDivTag = c.category==='polisci' && c.division_pol ?
      `<span style="font-size:7px;color:${polDivColors2[c.division_pol]||'#94a3b8'};border:1px solid ${polDivColors2[c.division_pol]||'#e2e8f0'};border-radius:3px;padding:0 2px">${polDivNames2[c.division_pol]||''}</span>` : '';
    const isCrossoverTag = (POLISCI_CROSSOVER_CODES.includes(c.code) && !['208.215','208.318'].includes(c.code)) || c.polisciOk ?
      `<span style="font-size:7px;color:#c084fc;border:1px solid #7c3aed;border-radius:2px;padding:0 2px">정치외교인정</span>` :
      JAPAN_CROSSOVER_CODES.includes(c.code) ?
      `<span style="font-size:7px;color:#f9a8d4;border:1px solid #ec4899;border-radius:2px;padding:0 2px">일본언어인정</span>` :
      GENV_CROSSLIST[c.code] ?
      `<span style="font-size:7px;color:#2dd4bf;border:1px solid #0891b2;border-radius:2px;padding:0 2px">크로스리스팅</span>` : '';

    // ── 전공인정 배지: 복전 신청 여부와 무관하게 항상 표시 ──
    // 스킬 배지와 동일 스타일: 인정됨(밝음) / 미신청(어두움) / 중복불가(빨강)
    const majorRecogTags = (() => {
      const tags = [];
      // ok=true→밝은색(인정됨), ok=false→어두운색(미신청/미인정), blocked=true→빨강
      const B = (text, ok, blocked) => {
        const col    = blocked ? '#ef4444' : ok ? '#fbbf24' : '#334155';
        const border = blocked ? '#fca5a5' : ok ? '#fcd34d' : '#e5e7eb';
        return `<span style="font-size:7px;color:${col};border:1px solid ${border};border-radius:2px;padding:0 3px;white-space:nowrap">${text}</span>`;
      };

      // ── 교직과정 (AGRI_OVERLAP) ──
      if(AGRI_OVERLAP_CODES.geo.includes(c.code) || AGRI_OVERLAP_CODES.econ.includes(c.code)){
        const approved = isAgriMajor();
        const econBlocked = approved && hasAnyMajor('econ') && AGRI_OVERLAP_CODES.econ.includes(c.code);
        const geoLimit = approved && AGRI_OVERLAP_CODES.geo.includes(c.code) &&
          completedCourses.filter(x=>AGRI_OVERLAP_CODES.geo.includes(x.code)&&x.grade!=='F').length >= 1;
        // 사회교육과 과목은 최대 3학점(1과목) 제한 경고
        const col    = econBlocked ? '#ef4444' : approved ? '#fbbf24' : '#334155';
        const border = econBlocked ? '#fca5a5' : approved ? '#fcd34d' : '#e2e8f0';
        const label  = econBlocked ? '↔지역정보(경제복전→불가)' : '↔교직과정';
        tags.push(`<span style="font-size:7px;color:${col};border:1px solid ${border};border-radius:2px;padding:0 3px;white-space:nowrap">${label}</span>`);
      }

      // ── 조경학 (LAND_CROSSOVER + landOk) ──
      if(LAND_CROSSOVER_CODES.includes(c.code) || c.landOk){
        const approved = isLandMajor();
        const isGeo = c.category === 'geo';
        const geoUsed = completedCourses.filter(x=>LAND_CROSSOVER_CODES.includes(x.code)&&x.category==='geo'&&x.grade!=='F').length;
        const cappedOut = approved && isGeo && geoUsed >= 1;
        const col    = cappedOut ? '#991b1b' : approved ? '#15803d' : '#888';
        const border = cappedOut ? '#fca5a5' : approved ? '#bbf7d0' : '#e5e7eb';
        const label  = cappedOut ? '↔조경학(지리3학점초과)' : '↔조경학';
        tags.push(`<span style="font-size:7px;color:${col};border:1px solid ${border};border-radius:2px;padding:0 3px;white-space:nowrap">${label}</span>`);
      }

      // ── 정치외교학부 (POLISCI_CROSSOVER) ──
      if(POLISCI_CROSSOVER_CODES.includes(c.code) || c.polisciOk){
        const approved = isPolisciMajor();
        const geoBlocked = ['208.215','208.318'].includes(c.code); // 사회교육과 주전공 과목
        const col    = geoBlocked ? '#991b1b' : approved ? '#7c3aed' : '#888';
        const border = geoBlocked ? '#fca5a5' : approved ? '#e9d5ff' : '#e5e7eb';
        const label  = geoBlocked ? '↔정치외교(주전공→불가)' : '↔정치외교';
        tags.push(`<span style="font-size:7px;color:${col};border:1px solid ${border};border-radius:2px;padding:0 3px;white-space:nowrap">${label}</span>`);
      }

      // ── 일본언어문명 (JAPAN_CROSSOVER) ──
      if(JAPAN_CROSSOVER_CODES.includes(c.code)){
        const approved = isJapanMajor();
        const col    = approved ? '#be185d' : '#888';
        const border = approved ? '#fbcfe8' : '#e5e7eb';
        tags.push(`<span style="font-size:7px;color:${col};border:1px solid ${border};border-radius:2px;padding:0 3px;white-space:nowrap">↔일본언어문명</span>`);
      }

      // ── 연계전공 일본학 (JSTUDIES_CROSSOVER) ──
      if(JSTUDIES_CROSSOVER_CODES.includes(c.code) && c.category!=='japan_studies'){
        const approved = isJapanStudiesMajor();
        const col    = approved ? '#1d4ed8' : '#888';
        const border = approved ? '#bfdbfe' : '#e5e7eb';
        tags.push(`<span style="font-size:7px;color:${col};border:1px solid ${border};border-radius:2px;padding:0 3px;white-space:nowrap">↔일본학연계</span>`);
      }

      // ── 글로벌환경경영학 (genvOk) ──
      if(c.genvOk){
        const approved = isGenvMajor();
        // 해당 타전공도 복전이면 중복불가
        const catBlockMap = {forest:GENV_OVERLAP_CAT_CODES.forest, land:GENV_OVERLAP_CAT_CODES.land, agri:GENV_OVERLAP_CAT_CODES.agri};
        const blockedCat = Object.entries(catBlockMap).find(([cat, codes])=>codes?.includes(c.code) && hasAnyMajor(cat));
        const blocked = approved && !!blockedCat;
        const col    = blocked ? '#991b1b' : approved ? '#0f766e' : '#888';
        const border = blocked ? '#fca5a5' : approved ? '#99f6e4' : '#e5e7eb';
        const label  = blocked ? `↔글환경(${['산림환경학','조경학','교직과정'][['forest','land','agri'].indexOf(blockedCat[0])]}복전→불가)` : '↔글로벌환경경영';
        tags.push(`<span style="font-size:7px;color:${col};border:1px solid ${border};border-radius:2px;padding:0 3px;white-space:nowrap">${label}</span>`);
      }

      return tags.join(' ');
    })();
    const adjMapPreview = getAdjustedGradeMap(c.code);
    const sm_prev = COURSE_SKILL_MAP[c.code];
    let maxBonusProb = 0, maxBonusSk = null;
    if(sm_prev && player && player.skills){
      for(const [sk, courseLv] of Object.entries(sm_prev)){
        if(courseLv === 0.5) continue;
        const playerLv = player.skills[sk] || 0;
        if(playerLv < courseLv) continue;
        const diff = playerLv - courseLv;
        let prob = 0;
        if(diff===0 && courseLv===1 && playerLv===1) prob=0.25;
        else if(diff===1 && courseLv===1) prob=0.50;
        else if(diff===0 && courseLv===2 && playerLv===2) prob=0.25;
        else if(diff===2 && courseLv===1) prob=1.00;
        else if(diff===1 && courseLv===2) prob=0.50;
        else if(diff===0 && courseLv===3 && playerLv===3) prob=0.25;
        if(prob > maxBonusProb){ maxBonusProb=prob; maxBonusSk=sk; }
      }
    }
    const penaltyTag = adjMapPreview
      ? `<span style="font-size:8px;background:#fef2f2;color:#991b1b;border:1px solid #fca5a5;border-radius:3px;padding:1px 4px;font-weight:600">⚠️A+=${adjMapPreview[0][0]}회</span>`
      : '';
    const bonusTag = maxBonusProb > 0
      ? `<span style="font-size:8px;background:#f0fdf4;color:#15803d;border:1px solid #86efac;border-radius:3px;padding:1px 4px">${SKILL_META[maxBonusSk]?.icon||'✨'} 진도+1 ${Math.round(maxBonusProb*100)}%</span>`
      : '';
    const badges = [
      isGeneralElective ? `<span style="font-size:8px;background:#f0f2f8;color:#666;border:1px solid #d1d5db;border-radius:3px;padding:1px 5px">일반선택</span>` : '',
      geoEduTag, penaltyTag, bonusTag, majorKindTag, polDivTag, isCrossoverTag, majorRecogTags,
      (c.recPick && !(c.category==='econ' && isEconMajor() && c.code!=='212.338A')) ? `<span class="badge-fp">${c.recPick}픽 권장</span>` : '',
      c.minPick && !c.recPick ? `<span class="badge-mp">${c.minPick}픽↑</span>` : '',
      c.alwaysSucceed ? `<span class="badge-as">항상성공</span>` : '',
      c.specialPickRule==='death_science' ? `<span class="badge-ds">최대45%</span>` : '',
      (c.code==='538.404' && !isGenvInternDone()) ? `<span style="font-size:8px;background:#fff7ed;color:#c2410c;border:1px solid #fdba74;border-radius:3px;padding:1px 5px;font-weight:600">인턴이수필요</span>` : '',
      (c.category==='genv' && c.subtype==='sci') ? `<span style="font-size:8px;background:#f0f9ff;color:#0369a1;border:1px solid #7dd3fc;border-radius:3px;padding:1px 4px">과학기술</span>` : '',
      (c.category==='genv' && c.subtype==='hum') ? `<span style="font-size:8px;background:#f5f3ff;color:#6d28d9;border:1px solid #c4b5fd;border-radius:3px;padding:1px 4px">인문사회</span>` : '',
      (c.code==='053.011'&&!checkGreenLeaderReq().ok) ? `<span style="font-size:8px;background:#fff7ed;color:#c2410c;border:1px solid #fdba74;border-radius:3px;padding:1px 5px;font-weight:600">선수조건미충족</span>` : '',
      isRequired ? `<span class="badge-req">전공필수</span>` : '',
      isLibRequired ? `<span style="font-size:8px;background:#eff6ff;color:#1d4ed8;border:1px solid #93c5fd;border-radius:3px;padding:1px 5px;font-weight:600">교양필수</span>` : '',
      lastGrade ? `<span class="badge-retake">재수강(${lastGrade.grade})</span>` : '',
      c.divName ? `<span class="badge-div" style="color:${divColors[c.division]||'#94a3b8'};border:1px solid ${divColors[c.division]||'#e2e8f0'}">${c.divName}</span>` : '',
      ...(() => {
        const sm = COURSE_SKILL_MAP[c.code];
        if(!sm || !player || !player.skills) return [];
        return Object.entries(sm).map(([sk, lv]) => {
          const meta = SKILL_META[sk];
          if(!meta) return '';
          const curLv = player.skills[sk] || 0;
          const isHalf    = lv === 0.5;
          const isReached = curLv >= lv;
          const isNext    = !isReached && (lv === 0.5 ? curLv === 0 : curLv >= lv - 1);
          const border  = isReached ? meta.color : isNext ? '#94a3b8' : '#e2e8f0';
          const textCol = isReached ? meta.color : isNext ? '#94a3b8' : '#334155';
          const icon    = isReached ? meta.icon  : (isNext ? '○' : '·');
          const lvLabel = isHalf ? '기초' : `${lv}단계`;
          return `<span style="font-size:8px;color:${textCol};border:1px solid ${border};border-radius:3px;padding:1px 4px;white-space:nowrap;background:${isReached?meta.color+'12':'transparent'}">${icon}${meta.label} ${lvLabel}</span>`;
        }).filter(Boolean);
      })(),
    ].filter(Boolean).join(' ');

    let crsClass = 'crs-course-item';
    let pickBadge = '';
    if(inSlot){
      crsClass += ' selected';
      pickBadge = `<span class="crs-pick-badge" style="color:${pickColors[reg.pick]}">픽${reg.pick}</span>`;
    } else if(wouldExceed){
      crsClass += ' exceed';
      pickBadge = `<span style="font-size:10px;color:#bbb">학점초과</span>`;
    } else if(activeSlot){
      crsClass += ' active-slot';
      pickBadge = `<span style="font-size:10px;color:#00a88a;font-weight:700">→픽${activeSlot}</span>`;
    } else {
      pickBadge = `<span style="font-size:10px;color:#ccc">선택</span>`;
    }

    // 학과/구분 태그
    const typeLabel = isRequired ? `<span style="background:#fff0f5;color:#c0392b;font-size:9px;padding:1px 5px;border-radius:3px;font-weight:700">전공필수</span>`
      : isGeneralElective ? `<span style="background:#f0f2f8;color:#888;font-size:9px;padding:1px 5px;border-radius:3px;">일반선택</span>`
      : `<span style="background:#eef2fc;color:#003092;font-size:9px;padding:1px 5px;border-radius:3px;">전공선택</span>`;

    return `<div class="${crsClass}" style="${wouldExceed?'cursor:not-allowed;':''}" ${wouldExceed?'':'onclick="selectCourse(\''+c.code+'\')"'}>
      <div class="crs-course-left">
        <div class="crs-course-name">${c.name}${lastGrade?` <span style="font-size:9px;color:#f97316">(재수강 ${lastGrade.grade})</span>`:''}</div>
        <div class="crs-course-meta">
          ${typeLabel}
          <span style="color:#999">${c.code}</span>
          <span>·</span>
          <span>${c.credit}학점</span>
          ${badges ? `<span style="flex-basis:100%;margin-top:2px">${badges}</span>` : ''}
        </div>
      </div>
      <div class="crs-course-right">
        ${pickBadge}
      </div>
    </div>`;
  }
