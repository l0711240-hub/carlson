function toggleCourse(code){ selectCourse(code); }

function skipSeasonalSemester(){
  if(!isSeasonalSem(gameSem)) return;
  document.getElementById('reg-overlay').classList.remove('show');
  addLog(`📅 ${semLabel(gameYear,gameSem)} 건너뜀`, 'log-info');
  nextSemester();
}

function submitRegistration(){
  enrolledCodes = [];
  const failed = [];

  // Handle gen_liberal F priority
  const failedDivLiberal = completedCourses
    .filter(c => c.type==='div_liberal' && c.grade==='F')
    .map(c => c.code);
  let divLiberalFSlot = 0;

  for(const reg of pendingRegistration){
    const cd = ALL_COURSES_WITH_POLISCI.find(x=>x.code===reg.code);
    if(!cd) continue;

    // div_liberal F priority: replace slot with F course
    if(cd.type==='div_liberal' && divLiberalFSlot < failedDivLiberal.length){
      enrolledCodes.push(failedDivLiberal[divLiberalFSlot++]);
      continue;
    }

    // alwaysSucceed or no pick constraint → always enroll
    if(cd.alwaysSucceed || (!cd.recPick && !cd.minPick && !cd.specialPickRule)){
      enrolledCodes.push(reg.code);
      continue;
    }

    // Has pick constraint → use player's chosen pick slot
    const rate = calcSuccessRate(cd, reg.pick);
    if(Math.random() < rate){
      enrolledCodes.push(reg.code);
    } else {
      failed.push(reg.code);
    }
  }

  if(failed.length > 0){
    showFailurePopup(failed);
  } else {
    finalizeRegistration();
  }
}

function showFailurePopup(failed){
  const maxC = getMaxCredits();
  const enrolledCredits = enrolledCodes.reduce((s,code)=>{
    const c=ALL_COURSES_WITH_POLISCI.find(x=>x.code===code); return s+(c?c.credit:0);
  }, 0);
  const remaining = maxC - enrolledCredits;

  const failedItems = failed.map(code=>{
    const c = ALL_COURSES_WITH_POLISCI.find(x=>x.code===code);
    return `<div style="background:#fef2f2;border:1px solid #ef4444;border-radius:5px;padding:5px 9px;margin-bottom:3px;font-size:11px;">
      <span style="color:#ef4444">✗</span> <b style="color:var(--text)">${c?c.name:code}</b>
    </div>`;
  }).join('');

  document.getElementById('reg-semester-label').innerHTML =
    `<span style="color:#ef4444">⚠️ 수강신청 실패</span> — 추가신청 가능 (잔여 ${remaining}학점)`;
  document.getElementById('reg-max-credits').textContent = remaining;

  const courseListEl = document.getElementById('reg-course-list');
  const failureDiv = document.createElement('div');
  failureDiv.id = 'failure-panel';
  failureDiv.style.cssText = 'margin-bottom:10px;';
  failureDiv.innerHTML = `<div style="font-size:11px;color:var(--dim);margin-bottom:5px;">❌ 수강신청 실패한 과목:</div>
    ${failedItems}
    <div style="font-size:10px;color:#666;padding:4px 0;margin-top:4px;">
      ※ 픽순이 정해진 전공과목(경제지리학·거시경제이론 등)은 추가신청 불가
    </div>`;
  courseListEl.parentNode.insertBefore(failureDiv, courseListEl);

  // Exclude: failed courses + ANY course with pick constraints from add/drop
  const pickConstrainedCodes = new Set(
    ALL_COURSES_WITH_POLISCI.filter(c=>c.recPick||c.minPick||c.specialPickRule).map(c=>c.code)
  );
  const excludeFromAddDrop = new Set([...failed, ...pickConstrainedCodes]);

  pendingRegistration = [];
  activeSlot = null;
  window._addDropFilter = c => !excludeFromAddDrop.has(c.code) && !enrolledCodes.includes(c.code);

  switchRegTab(currentRegTab);

  const btn = document.getElementById('reg-submit-btn');
  btn.textContent = '추가신청 완료';
  btn.onclick = ()=>{
    for(const reg of pendingRegistration) enrolledCodes.push(reg.code);
    window._addDropFilter = null;
    const fp = document.getElementById('failure-panel');
    if(fp) fp.remove();
    btn.textContent = '수강신청 완료';
    btn.onclick = submitRegistration;
    finalizeRegistration();
  };
}
