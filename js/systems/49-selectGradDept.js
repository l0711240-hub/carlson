function selectGradDept(deptId){
  _gradApplyDept = deptId;
  _gradApplyRoundIdx = 0;
  _gradApplyStageIdx = 0;
  _gradApplyRoundScores = {};
  document.getElementById('gradapply-dept-select').style.display='none';
  document.getElementById('gradapply-process').style.display='';
  runGradStage();
}

function getCurrentRound(){
  const adm = GRAD_ADMISSION[_gradApplyDept];
  return adm.rounds[_gradApplyRoundIdx];
}

function runGradStage(){
  const round = getCurrentRound();
  const adm   = GRAD_ADMISSION[_gradApplyDept];
  const stage = round.stages[_gradApplyStageIdx];
  const totalRounds = adm.rounds.length;
  const roundLabel = totalRounds>1 ? `${_gradApplyRoundIdx+1}차 ` : '';
  const stageNames = {
    doc:'서류', exam:'필답고사', interview:'면접', snult:'제2외국어'
  };
  const stageTotal = round.stages.length;
  document.getElementById('gradapply-stage-label').textContent =
    `[${roundLabel}${_gradApplyStageIdx+1}/${stageTotal}] ${stageNames[stage]||stage}`;

  // 모든 패널 숨김
  ['exam-panel','interview-panel','snult-panel','doc-panel'].forEach(p=>{
    const el=document.getElementById('gradapply-'+p);
    if(el) el.style.display='none';
  });

  if(stage==='doc')                        showGradDocPanel(stage);
  else if(/^exam/.test(stage))             startGradExam(stage);
  else if(/^interview/.test(stage))        startGradInterview(stage);
  else if(/^snult/.test(stage))            showGradSnult(stage);
}

function showGradDocPanel(stageKey){
  const degree = window._gradApplyDegree;
  const dept   = GRAD_DEPTS.find(d=>d.id===_gradApplyDept);
  const gpa    = calcGradGpaScore(degree);
  const major  = calcGradMajorScore(dept, degree);
  let paperBonus = 0;
  if(degree==='phd') paperBonus = Math.min(20, (player.gradPapers||0)*7);
  const indyBonus = calcGradIndyStudyScore(dept);
  // 전공수업 0개면 서류 최대 50점으로 제한 (전공기여=0)
  const baseDocScore = Math.min(100, major + gpa + paperBonus + indyBonus);
  const docScore = (major===0 && degree==='master') ? Math.min(50, baseDocScore) : baseDocScore;
  if(!_gradApplyRoundScores[_gradApplyRoundIdx]) _gradApplyRoundScores[_gradApplyRoundIdx]={};
  _gradApplyRoundScores[_gradApplyRoundIdx][stageKey] = docScore;

  const gpaRaw = degree==='phd' ? (player.gradGpa||player.gpa||0) : (player.gpa||0);
  const planDeptName = player.researchPlanDept
    ? (RESEARCH_DEPTS.find(d=>d.id===player.researchPlanDept)?.name||player.researchPlanDept) : null;
  const el = document.getElementById('gradapply-doc-panel');
  el.style.display='';
  el.innerHTML = `
    <b style="color:#003092">서류 점수: ${docScore}/100점</b>
    <div style="font-size:9px;color:var(--dim);line-height:1.8;margin:6px 0;background:#f0f4fb;border-radius:4px;padding:6px 8px">
      전공 기여: <b style="color:#6d28d9">${major}점</b> (전공평점합산×0.15, 최대30)<br>
      GPA 기여: <b style="color:#0f766e">${gpa}점</b> (${gpaRaw.toFixed(2)}/4.3 × 50, 최대50)<br>
      ${paperBonus?`논문 기여: <b style="color:#be185d">${paperBonus}점</b><br>`:''}
      ${indyBonus?`학생자율연구: <b style="color:#6d28d9">${indyBonus}점</b>${planDeptName?` [연구계획:${planDeptName}]`:''}<br>`:''}
    </div>
    <button class="btn" style="font-size:11px;padding:6px 16px" onclick="gradNextStage()">다음 →</button>`;
}
