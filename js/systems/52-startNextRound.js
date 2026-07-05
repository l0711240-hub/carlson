function startNextRound(){
  document.getElementById('gradapply-doc-panel').style.display='none';
  _gradApplyRoundIdx++;
  _gradApplyStageIdx=0;
  runGradStage();
}

function showGradFail(){
  document.getElementById('gradapply-process').style.display='none';
  const dept=GRAD_DEPTS.find(d=>d.id===_gradApplyDept);
  const degree=window._gradApplyDegree;
  document.getElementById('gradapply-result').style.display='';
  document.getElementById('gradapply-result-icon').textContent='😔';
  document.getElementById('gradapply-result-title').style.color='#c0392b';
  document.getElementById('gradapply-result-title').textContent='불합격';
  document.getElementById('gradapply-result-desc').innerHTML=
    `<span style="color:#ef4444">${dept.name} ${degree==='master'?'석사':'박사'} 불합격</span><br><span style="color:var(--dim)">다음 기회를 노려보세요.</span>`;
}

function finishGradApply(total, maxSc, breakLines, passed){
  const dept=GRAD_DEPTS.find(d=>d.id===_gradApplyDept);
  const degree=window._gradApplyDegree;
  document.getElementById('gradapply-process').style.display='none';
  const result=document.getElementById('gradapply-result');
  result.style.display='';
  document.getElementById('gradapply-result-icon').textContent=passed?'🎉':'😔';
  document.getElementById('gradapply-result-title').style.color=passed?'#15803d':'#c0392b';
  document.getElementById('gradapply-result-title').textContent=passed
    ?`${dept.name} ${degree==='master'?'석사':'박사'} 합격!`:'최종 불합격';
  document.getElementById('gradapply-result-desc').innerHTML=
    breakLines.join(' | ')+'<br>총점: <b style="color:#fbbf24">'+Math.round(total)+'</b>/'+maxSc+
    ` (${Math.round(total/maxSc*100)}%)`+
    (passed?`<br><span style="color:#22c55e">🎓 ${dept.name} ${degree==='master'?'석사':'박사'}과정에 진학합니다!</span>`:
     `<br><span style="color:#ef4444">합격선(40%) 미달. 다음 기회를 노려보세요.</span>`);
  if(passed){
    player.gradSchool=_gradApplyDept;
    player.gradDegree=degree;
    player.gradCredits=0; player.gradPapers=0; player.gradResearch=0;
    player.gradConferences=0;
    player.gradThesisHits=0; player.gradEthicsDone=false;
    player.gradAssistant=0; player.gradLabResearch=0;
    addLog(`🎓 ${dept.name} ${degree==='master'?'석사':'박사'} 합격!`,'log-level');
    window._pendingGradTransition=true;
    window._pendingGradDegree=degree;
  }
}

function closeGradApply(){
  document.getElementById('gradapply-overlay').classList.remove('show');
  if(window._pendingGradTransition){
    window._pendingGradTransition=false;
    const degree = window._pendingGradDegree || 'master';
    window._pendingGradDegree = null;
    if(degree==='master'){
      // 학부 → 석사 합격: 보너스 적용 후 promote + 졸업증 표시
      const bonus = window._pendingGradBonus || {stamina:0, speed:0};
      window._pendingGradBonus = null;
      player.maxStamina = 100 + bonus.stamina;
      player.stamina = player.maxStamina;
      player.speed = 2.5 + bonus.speed;
      promote('master');
      // 졸업증 표시 — 졸업증의 버튼을 대학원 수강계획으로 연결
      showDiploma('grad_after_admit');
      return;
    }
    // 석사 → 박사 합격은 showGradCongratsOrNext에서 promote 후 openGradApply
    openGradSemReg();
  } else {
    // 불합격 처리
    window._pendingGradBonus = null;
    const failedDegree = window._pendingGradDegree;
    window._pendingGradDegree = null;
    if(player.rankIdx===2){
      // 박사 전형 불합격: 석사 과정으로 복귀
      promote('master'); // rankIdx를 1로 되돌림
      addLog('📋 박사 전형 불합격 — 석사 과정으로 복귀합니다.','log-eat');
      openGradSemReg();
    } else {
      // 석사 전형 불합격: 진로 결정으로 (게임 정지 유지)
      addLog('📋 대학원 불합격 — 진로 결정으로 돌아갑니다.','log-eat');
      player.transcriptShown=false;
      gameRunning=false; cancelAnimationFrame(animId);
      showCareerChoice();
    }
  }
}

// ── 대학원 수강계획 등록 ────────────────────────────────────
