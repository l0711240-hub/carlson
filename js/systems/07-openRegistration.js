function openRegistration(){
  gameRunning = false;
  cancelAnimationFrame(animId);
  pendingRegistration = [];
  activeSlot = null;

  const isSeasonal = isSeasonalSem(gameSem);
  currentRegTab = isSeasonal ? 'elective' : 'liberal_basic';

  rollSemesterOfferings();

  const fp = document.getElementById('failure-panel');
  if(fp) fp.remove();
  const btn = document.getElementById('reg-submit-btn');
  if(btn){ btn.textContent='수강신청 완료'; btn.onclick=submitRegistration; }
  // 졸업요건 충족 시 졸업신청 버튼 표시
  const gradBtn = document.getElementById('reg-grad-btn');
  if(gradBtn){
    if(checkGraduationReady()){
      gradBtn.style.display='';
    } else {
      gradBtn.style.display='none';
    }
  }
  const skipBtn = document.getElementById('reg-skip-seasonal-btn');
  if(skipBtn) skipBtn.style.display = isSeasonal ? '' : 'none';

  const maxC = getMaxCredits();
  document.getElementById('reg-max-credits').textContent = maxC;
  document.getElementById('reg-selected-credits').textContent = 0;
  const semCreditsLabel = regularSemesters >= 16
    ? `<span style="color:#ef4444;font-weight:700">⚠️ 정규학기 ${regularSemesters}/16 초과!</span>`
    : regularSemesters >= 14
    ? `<span style="color:#c0392b">⚠️ ${regularSemesters}/16</span>`
    : `${regularSemesters}/16학기`;
  document.getElementById('reg-semester-label').innerHTML =
    `${semLabel(gameYear,gameSem)} &nbsp;|&nbsp; ${player.credits}학점 &nbsp;|&nbsp; ${semCreditsLabel}`;

  // CRS 상단바 정보
  const yearNum = Math.ceil((gameYear - 2024) * 2 + gameSem);
  document.getElementById('crs-semester-year').textContent = semLabelShort(gameYear, gameSem);
  document.getElementById('crs-user-name').textContent = player.name || '학생';
  document.getElementById('crs-user-id').textContent = `사회교육과`;

  // CRS 사이드바 빌드
  crsBuildSidebar(isSeasonal);

  switchRegTab(currentRegTab);
  currentGradTab = 'pick';
  renderGradPanel();
  if(player) { player.rejectedInterns = player.rejectedInterns || []; }
  document.getElementById('reg-overlay').classList.add('show');
}

// CRS 사이드바 빌드
function crsBuildSidebar(isSeasonal){
  const TAB_GROUPS = [
    { head:'교양', tabs:[
      {id:'liberal_basic', label:'기초·중점교양'},
      {id:'liberal_world', label:'핵심교양'},
      {id:'elective',      label:'일반교양'},
    ]},
    { head:'주전공', tabs:[
      {id:'geo',    label:'사회교육과'},
    ]},
    { head:'교직과정', tabs:[
      {id:'agri',         label:'교직과정'},
    ]},
    { head:'복수전공·부전공', tabs:[
      {id:'econ',         label:'경제학과'},
      {id:'polisci',      label:'정치외교학과'},
      {id:'forest',       label:'사회복지학과'},
      {id:'japan',        label:'사학과'},
      {id:'land',         label:'행정학과'},
      {id:'genv',         label:'소비자학과'},
      {id:'japan_studies',label:'문화콘텐츠문화경영학과'},
    ]},
    { head:'타 학과 교과목', tabs:[
      {id:'geoedu',       label:'교육학과'},
      {id:'history',      label:'한국어문학과'},
      {id:'arthistory',   label:'철학과'},
      {id:'edu_history',  label:'영어교육과'},
      {id:'sts',          label:'통계학과'},
      {id:'soc',          label:'미디어커뮤니케이션학과'},
      {id:'civil',        label:'아태물류학부'},
      {id:'energy',       label:'에너지자원공학과'},
      {id:'chembio',      label:'화학공학과'},
      {id:'earth',        label:'환경공학과'},
      {id:'lifesci',      label:'생명과학과'},
      {id:'agrobio',      label:'식품영양학과'},
    ]},
    { head:'연구', tabs:[
      {id:'research_plan', label:'교수 컨택 / 연구'},
    ]},
    { head:'공부', tabs:[
      {id:'cert_study', label:'자격증 공부'},
    ]},
  ];

  // 계절학기 표시 탭 목록
  const SEASONAL_SHOW = new Set(['elective','econ','liberal_basic','liberal_world','cert_study','research_plan']);

  let html = '';
  for(const grp of TAB_GROUPS){
    const visibleTabs = grp.tabs.filter(t => {
      if(t.hidden && !isSeasonal) return false;
      if(isSeasonal && !SEASONAL_SHOW.has(t.id)) return false;
      return true;
    });
    if(!visibleTabs.length) continue;
    html += `<div class="crs-sidebar-section">
      <div class="crs-sidebar-head">${grp.head}</div>`;
    for(const t of visibleTabs){
      html += `<div class="crs-sidebar-item${currentRegTab===t.id?' active':''}" id="tab-${t.id}" onclick="switchRegTab('${t.id}')">
        <div class="dot"></div>${t.label}
      </div>`;
    }
    html += `</div>`;
  }
  document.getElementById('crs-sidebar').innerHTML = html;
}

// ── Graduation Status Panel ────────────────────────────
let currentGradTab = 'req';
