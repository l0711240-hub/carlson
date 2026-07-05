function applyMajor(type, kind){
  const appsThisSem = (window._doubleMajorAppsThisSem || 0);
  if(appsThisSem >= 6){
    showDoubleResult('⚠️ 이번 학기 신청 한도(6개) 초과', false); return;
  }
  // 같은 전공에 이미 같은 kind면 불가, 다른 kind면 전환 처리
  const existing = doubleMajors.find(d=>d.type===type&&d.approved);
  if(existing){
    if(existing.kind === kind){
      showDoubleResult(`이미 ${kind==='double'?'복수전공':'부전공'}으로 승인됨.`, false);
      return;
    }
    // 전환 신청: 기존 항목 제거 후 재신청
    const idx = doubleMajors.indexOf(existing);
    doubleMajors.splice(idx, 1);
    recomputeMajorCredits();
    addLog(`🔄 ${type} ${existing.kind==='double'?'복수→부전공':'부전공→복수전공'} 전환 신청`, 'log-info');
  }
  window._doubleMajorAppsThisSem = appsThisSem + 1;
  const gpa = player.gpa || 0;

  // GPA 기준 설정
  const thresholds = {
    agri:      { double: 3.9, minor: 3.7 },
    econ:      { double: 4.1, minor: 4.0 },
    forest:    { double: null, minor: null },
    polisci_a: { double: 4.0, minor: 3.8 },
    polisci_b: { double: 4.0, minor: 3.8 },
    japan:          { double: 3.8, minor: 3.5 },
    japan_studies:  { double: null, minor: null },
    land:           { double: 3.5, minor: null },
    genv:           { double: 3.7, minor: null }, // 연합전공 합격 평점 3.7
  };

  const th = thresholds[type]?.[kind];
  const randomizedTh = th !== null ? th + (Math.random()-0.5)*0.2 : null;
  const success = randomizedTh === null || gpa >= randomizedTh;

  const typeNames = {agri:'농경제 교직과정', econ:'경제학부', forest:'산림환경학', polisci_a:'정치학전공', polisci_b:'외교학전공', japan:'일본언어문명', japan_studies:'연계전공 일본학', land:'조경학', genv:'글로벌환경경영'};
  const kindName = kind==='double' ? (type==='japan_studies'?'연계전공':type==='genv'?'연합전공':'복수전공') : '부전공';
  const name = `${typeNames[type]} ${kindName}`;

  if(success){
    doubleMajors.push({type, approved:true, kind});
    recomputeMajorCredits();
    addLog(`🏛️ ${name} 승인!`, 'log-level');
    showDoubleResult(`🎉 ${name} 승인!`, true);
    // 수강신청 탭은 이미 항상 열려있음
  } else {
    addLog(`⚠️ ${name} 불허`, 'log-info');
    showDoubleResult(`❌ ${name} 불허. 다음 학기에 재신청 가능합니다.`, false);
  }
  renderDoubleOverlay();
  updateUI();
}

function showDoubleResult(msg, success){
  const infoEl = document.getElementById('double-info');
  const gpa = player.gpa || 0;
  infoEl.innerHTML =
    `현재 GPA: <b style="color:#003092">${gpa.toFixed(2)}</b> | 취득학점: ${player.credits}학점 | ${player.semestersDone}학기 이수<br>
    <span style="font-size:10px;color:#666">※ 같은 전공의 복수전공+부전공 동시 신청 불가.</span><br>
    <span style="font-size:12px;font-weight:700;color:${success?'#22c55e':'#ef4444'}">${msg}</span>`;
}

function skipDouble(){
  document.getElementById('double-overlay').classList.remove('show');
  openRegistration();
}
