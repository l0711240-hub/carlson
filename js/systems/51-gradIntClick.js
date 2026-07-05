function gradIntClick(){if(_gradIntTime<=0)return;_gradIntClicks++;document.getElementById('gradapply-int-clicks').textContent=_gradIntClicks;}

function showGradSnult(stageKey){
  const score=Math.min(100, player.certs.snult일본어||0);
  if(!_gradApplyRoundScores[_gradApplyRoundIdx]) _gradApplyRoundScores[_gradApplyRoundIdx]={};
  _gradApplyRoundScores[_gradApplyRoundIdx][stageKey||'snult']=score;
  document.getElementById('gradapply-snult-panel').style.display='';
  document.getElementById('gradapply-snult-score').textContent=score+'점';
}

function gradNextStage(){
  const round = getCurrentRound();
  _gradApplyStageIdx++;
  if(_gradApplyStageIdx >= round.stages.length){
    // 현재 차수 완료 → 합격 여부 판정
    finishGradRound();
  } else {
    runGradStage();
  }
}

function finishGradRound(){
  const adm    = GRAD_ADMISSION[_gradApplyDept];
  const round  = getCurrentRound();
  // ★ 수정: 이전 차수 점수를 모두 누적 병합 (1차 exam 점수 → 2차에서 재사용 등)
  const scores = {};
  for(let i = 0; i <= _gradApplyRoundIdx; i++){
    Object.assign(scores, _gradApplyRoundScores[i] || {});
  }
  const stageNames = {doc:'서류', exam:'필답', interview:'면접', snult:'제2외국어'};

  let total=0, maxSc=0, breakLines=[];
  for(const [stage, weight] of Object.entries(round.weights)){
    const sc = scores[stage]||0;
    total += sc*(weight/100);
    maxSc += weight;
    breakLines.push(`${stageNames[stage]||stage}: <b style="color:#d97706">${sc}점</b>×${weight}`);
  }
  const pct = maxSc>0 ? total/maxSc : 0;
  const isLastRound = _gradApplyRoundIdx >= adm.rounds.length-1;
  const passThreshold = round.passThreshold || 0.40;
  const roundPassed = pct >= passThreshold;

  if(!isLastRound){
    // 중간 차수: 합격선 통과해야 2차 진행
    const roundNum = _gradApplyRoundIdx+1;
    const el=document.getElementById('gradapply-doc-panel');
    el.style.display='';
    if(roundPassed){
      el.innerHTML=`<div style="text-align:center">
        <div style="font-size:22px;margin-bottom:4px">✅</div>
        <b style="color:#22c55e">${roundNum}차 합격!</b>
        <div style="font-size:9px;color:var(--dim);margin:6px 0">${breakLines.join(' | ')}<br>합계 ${Math.round(total)}/${maxSc}점 (${Math.round(pct*100)}%)</div>
        <button class="btn" style="font-size:11px;padding:6px 16px;background:#1d4ed8" onclick="startNextRound()">2차 전형 진행 →</button>
      </div>`;
    } else {
      el.innerHTML=`<div style="text-align:center">
        <div style="font-size:22px;margin-bottom:4px">❌</div>
        <b style="color:#ef4444">${roundNum}차 탈락</b>
        <div style="font-size:9px;color:var(--dim);margin:6px 0">${breakLines.join(' | ')}<br>합계 ${Math.round(total)}/${maxSc}점 (${Math.round(pct*100)}%) — 합격선 ${Math.round(passThreshold*100)}%</div>
        <button class="btn btn-warn" style="font-size:11px;padding:6px 16px" onclick="showGradFail()">결과 확인</button>
      </div>`;
    }
  } else {
    // 최종 차수: 40% 이상이면 합격
    const finalPassed = pct >= 0.40;
    finishGradApply(total, maxSc, breakLines, finalPassed);
  }
}
