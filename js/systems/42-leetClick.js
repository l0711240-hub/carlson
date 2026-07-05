function leetClick(){
  if(leetTimeLeft <= 0 || leetTimeLeft > LEET_DURATION) return;
  leetClickCount++;
  document.getElementById('leet-count').textContent = leetClickCount;
  // 버튼 짧은 시각 피드백
  const btn = document.getElementById('leet-btn');
  btn.style.transform='scale(0.96)';
  setTimeout(()=>{ btn.style.transform=''; }, 60);
}

function finishLeet(){
  document.getElementById('leet-running').style.display='none';
  document.getElementById('leet-result').style.display='';

  const clicks = leetClickCount;
  const effMax = window._leetEffMaxClicks || LEET_MAX_CLICKS;
  const leetScore = Math.min(100, Math.round((clicks / effMax) * 100));
  const gpa = player.gpa || 0;
  // GPA → 100점 환산 (4.3 만점 기준)
  const gpaScore = Math.min(100, Math.round((gpa / 4.3) * 100));
  // 최종 점수 = GPA 50% + 임용 1차 50%
  const finalScore = Math.round(gpaScore * 0.5 + leetScore * 0.5);

  document.getElementById('leet-final-count').textContent = `${clicks}회`;

  // 임용 1차 등급
  let leetGrade, leetGradeColor;
  if(leetScore >= 90){ leetGrade='최우수 (상위 10%)'; leetGradeColor='#fbbf24'; }
  else if(leetScore >= 75){ leetGrade='우수 (상위 25%)'; leetGradeColor='#60a5fa'; }
  else if(leetScore >= 55){ leetGrade='보통 (상위 45%)'; leetGradeColor='#34d399'; }
  else { leetGrade='미흡'; leetGradeColor='#ef4444'; }

  document.getElementById('leet-score-line').innerHTML =
    `임용 1차 점수 <b style="color:#6d28d9">${leetScore}점</b> &nbsp;·&nbsp; <span style="color:${leetGradeColor}">${leetGrade}</span>`;

  // 최종 합격 판정 (GPA 50% + 임용 1차 50%)
  // 기준: SKY 96점↑, 일반 88점↑
  let verdict, verdictColor, schoolTier;
  const gpa45 = gpa * (4.5/4.3);
  if(finalScore >= 96){
    verdict='⭐ 임용 수석 합격권'; verdictColor='#fbbf24'; schoolTier='sky';
  } else if(finalScore >= 88){
    verdict='✓ 임용 우수 합격권'; verdictColor='#1d4ed8'; schoolTier='top';
  } else if(finalScore >= 75){
    verdict='△ 임용 합격권'; verdictColor='#15803d'; schoolTier='general';
  } else {
    verdict='✗ 임용 합격 어려움'; verdictColor='#ef4444'; schoolTier='fail';
  }

  document.getElementById('leet-combined-result').innerHTML = `
    <div><span style="color:var(--dim)">GPA 점수 (50%)</span> &nbsp;<b style="color:#0f766e">${gpaScore}점</b> → ${Math.round(gpaScore*0.5)}점 반영</div>
    <div><span style="color:var(--dim)">임용 1차 점수 (50%)</span> &nbsp;<b style="color:#6d28d9">${leetScore}점</b> → ${Math.round(leetScore*0.5)}점 반영</div>
    <div style="border-top:1px solid var(--border);margin-top:6px;padding-top:6px;">
      <span style="color:var(--dim)">최종 점수</span> &nbsp;<b style="color:${verdictColor};font-size:15px">${finalScore}점</b>
    </div>
    <div style="margin-top:4px"><b style="color:${verdictColor}">${verdict}</b></div>`;

  // 결과 저장 (showLawDiploma에서 사용)
  window._leetResult = { clicks, leetScore, gpaScore, finalScore, schoolTier };
}

function applyLeetResult(){
  document.getElementById('leet-overlay').classList.remove('show');
  const result = window._leetResult;
  if(result && result.schoolTier === 'fail'){
    // 임용 불합격: 진로결정으로
    addLog('⚖️ 임용 불합격 — 진로 결정으로 돌아갑니다.','log-eat');
    showCareerChoice(); // 게임 정지 유지
  } else {
    showDiploma('law_pre');
    const _gradBtnLaw = document.getElementById('diploma-grad-btn');
    const _contBtnLaw = document.getElementById('diploma-cont-btn');
    _gradBtnLaw.style.display=''; _contBtnLaw.style.display='none';
    _gradBtnLaw.textContent='임용 합격증 →';
    _gradBtnLaw.onclick=()=>{
      document.getElementById('diploma-overlay').classList.remove('show');
      showLawDiploma(result);
    };
  }
}
