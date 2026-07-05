function ipmDocNext(){
  const next = document.getElementById('ipm-doc-btn').dataset.next;
  if(next === 'interview'){
    ipmShow('ipm-interview-ready');
  } else {
    ipmClose();
  }
}

// ── 2/3단계: 면접 ────────────────────────────────────────────
function ipmStartInterview(){
  ipmShow('ipm-interview-running');
  _ipmClicks = 0;
  _ipmTimeLeft = 10;
  document.getElementById('ipm-clicks').textContent = '0';
  document.getElementById('ipm-timer').textContent  = '10';
  document.getElementById('ipm-bar').style.width    = '100%';
  const startTime = Date.now();
  _ipmInterval = setInterval(()=>{
    const elapsed = (Date.now()-startTime)/1000;
    _ipmTimeLeft = Math.max(0, 10-elapsed);
    document.getElementById('ipm-timer').textContent = Math.ceil(_ipmTimeLeft);
    document.getElementById('ipm-bar').style.width   = (_ipmTimeLeft/10*100)+'%';
    if(_ipmTimeLeft <= 0){
      clearInterval(_ipmInterval); _ipmInterval=null;
      ipmFinishInterview();
    }
  }, 50);
}

function ipmInterviewClick(){
  if(_ipmTimeLeft <= 0) return;
  _ipmClicks++;
  document.getElementById('ipm-clicks').textContent = _ipmClicks;
}

// ── 4단계: 최종 합격 판정 ────────────────────────────────────
function ipmFinishInterview(){
  const intern = INTERN_LIST.find(i=>i.id===_ipmInternId);
  const interviewBonus = calcInterviewBonus(_ipmClicks);
  const finalRate = Math.min(100, Math.max(0, _ipmBaseRate + interviewBonus));
  const passed = Math.random()*100 < finalRate;

  const {certBonus, dmBonus, gpaComp} = calcInternBaseRate(intern);
  const dmColor = dmBonus>=0?'#a78bfa':'#ef4444';
  const breakdown = `<div style="font-size:9px;color:var(--dim);line-height:1.8;background:#e8ecf5;border-radius:5px;padding:6px 8px;margin-bottom:8px;text-align:left">
    GPA×숙련도 <b style="color:#fbbf24">${gpaComp}%</b>
    + 자격증 <b style="color:#34d399">+${certBonus}%</b>
    + 전공 <b style="color:${dmColor}">${dmBonus>=0?'+':''}${dmBonus}%</b>
    + 면접(${_ipmClicks}회) <b style="color:#60a5fa">+${interviewBonus}%</b>
    = 최종 <b style="color:#fbbf24">${finalRate}%</b>
  </div>`;

  if(passed){
    document.getElementById('ipm-final-icon').textContent  = '🎉';
    document.getElementById('ipm-final-title').style.color = '#15803d';
    document.getElementById('ipm-final-title').textContent = '최종 합격!';
    document.getElementById('ipm-final-desc').innerHTML    = breakdown + `<b style="color:#003092;">${intern.name}</b>에 합격했습니다!<br><span style="color:#15803d;">30회 활동 완료 시 인턴 이수 인정됩니다.</span>`;
    player.interns.push({id:_ipmInternId, name:intern.name, type:intern.type, bonus:intern.bonus, hits:0, done:false});
    addLog(`💼 ${intern.name} 최종 합격!`, 'log-level');
  } else {
    document.getElementById('ipm-final-icon').textContent  = '😔';
    document.getElementById('ipm-final-title').style.color = '#991b1b';
    document.getElementById('ipm-final-title').textContent = '최종 불합격';
    document.getElementById('ipm-final-desc').innerHTML    = breakdown + `<b style="color:#e2e8f0">${intern.name}</b> 면접 탈락.<br><span style="color:var(--dim)">다음 수강신청에서 재도전 가능합니다.</span>`;
    if(!player.rejectedInterns) player.rejectedInterns=[];
    if(!player.rejectedInterns.includes(_ipmInternId)) player.rejectedInterns.push(_ipmInternId);
    addLog(`💼 ${intern.name} 면접 탈락.`, 'log-eat');
  }
  ipmShow('ipm-final-result');
}
