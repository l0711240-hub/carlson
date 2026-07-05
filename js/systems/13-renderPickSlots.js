function renderPickSlots(){
  // CRS 스타일: pick 탭이 활성화돼 있으면 패널 콘텐츠 갱신
  if(currentGradTab === 'pick'){
    const el = document.getElementById('grad-panel-content');
    if(el) el.innerHTML = buildPickSlotsHTML();
    // 스킬 현황도 갱신
    renderRegSkillStatus();
  }
}

// State: which slot number is currently "active" (waiting for course selection)
let activeSlot = null;

function activateSlot(num){
  activeSlot = num;
  // 픽 슬롯 탭으로 자동 전환
  if(currentGradTab !== 'pick') switchGradTab('pick');
  document.getElementById('reg-priority-info').textContent = `픽 ${num} 선택됨 — 과목 목록에서 배치할 과목을 클릭하세요`;
  renderPickSlots();
  renderRegCourses();
}

function selectCourse(code){
  const c = ALL_COURSES_WITH_POLISCI.find(x=>x.code===code);
  if(!c) return;

  // If already in a slot → remove it (toggle off)
  const existingIdx = pendingRegistration.findIndex(r=>r.code===code);
  if(existingIdx !== -1){
    pendingRegistration.splice(existingIdx,1);
    activeSlot = null;
    document.getElementById('reg-priority-info').textContent = '슬롯을 클릭해 픽순을 지정하거나, 과목을 바로 클릭하세요';
    renderRegCourses();
    return;
  }

  const maxC = parseInt(document.getElementById('reg-max-credits').textContent) || getMaxCredits();
  const usedCredits = pendingRegistration.reduce((s,r)=>{
    const x=ALL_COURSES_WITH_POLISCI.find(z=>z.code===r.code); return s+(x?x.credit:0);
  },0);
  if(usedCredits + c.credit > maxC) return;

  // Active slot selected → place there
  if(activeSlot !== null){
    const existing = pendingRegistration.findIndex(r=>r.pick===activeSlot);
    if(existing !== -1) pendingRegistration.splice(existing,1);
    pendingRegistration.push({code, pick:activeSlot});
    activeSlot = null;
    document.getElementById('reg-priority-info').textContent = '슬롯을 클릭해 픽순을 지정하거나, 과목을 바로 클릭하세요';
    renderRegCourses();
    renderPickSlots();
    return;
  }

  // No active slot → place in first empty slot
  for(let i=1; i<=10; i++){
    if(!pendingRegistration.find(r=>r.pick===i)){
      pendingRegistration.push({code, pick:i});
      renderRegCourses();
      renderPickSlots();
      return;
    }
  }
}

function removeFromSlot(pickNum){
  const idx = pendingRegistration.findIndex(r=>r.pick===pickNum);
  if(idx !== -1) pendingRegistration.splice(idx,1);
  activeSlot = null;
  renderRegCourses();
  renderPickSlots();
}

// Keep toggleCourse as alias for backward compat but use selectCourse
