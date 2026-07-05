function startCritiqueGame(boss, targetCourse){
  critiqueActive=true;
  critiqueState={ boss, targetCourse, clicks:0, done:false };
  gameRunning=false; // 게임 일시정지
  // 능력별 제목/아이콘 설정
  const critiqueLabels = {
    'critique_click':      {icon:'⚖️', label:'설계 비평'},
    'critique_and_dot':    {icon:'⚖️', label:'설계 비평'},
    'quiz_click':          {icon:'📝', label:'쪽지시험'},
    'parkpil_combo':       {icon:'🌲', label:'실습 과제'},
    'ta_spawn_critique':   {icon:'🔬', label:'실습 과제'},
    'dot_or_critique':     {icon:'💻', label:'실습 과제'},
  };
  const lbl = critiqueLabels[boss.ability] || {icon:'⚖️', label:'설계 비평'};
  // 오윤정: 쪽글
  const finalLabel = (boss.name==='오윤정') ? {icon:'📄', label:'쪽글'} : lbl;
  document.getElementById('critique-title-line').textContent = finalLabel.icon + ' ' + finalLabel.label;
  document.getElementById('critique-title-line').style.color =
    finalLabel.label==='쪽지시험' ? '#60a5fa' :
    finalLabel.label==='쪽글'     ? '#a78bfa' :
    finalLabel.label==='실습 과제'? '#34d399' : '#f97316';
  document.getElementById('critique-boss-name').textContent=`${boss.name} 교수`;
  document.getElementById('critique-count').textContent='0';
  document.getElementById('critique-timer-bar').style.width='100%';
  document.getElementById('critique-timer-bar').style.background='#f97316';
  const overlay=document.getElementById('critique-overlay');
  overlay.style.display='flex';

  window._critiqueKeyHandler=function(e){
    if(e.code==='Space'||e.key===' '){e.preventDefault();critiqueClick();}
  };
  window.addEventListener('keydown',window._critiqueKeyHandler);

  let elapsed=0;
  window._critiqueTimer=setInterval(()=>{
    elapsed+=50;
    const pct=Math.max(0,100-(elapsed/1000)*100);
    const bar=document.getElementById('critique-timer-bar');
    if(bar){bar.style.width=pct+'%'; bar.style.background=pct>50?'#f97316':pct>25?'#ef4444':'#7f1d1d';}
    if(elapsed>=1000){
      clearInterval(window._critiqueTimer);
      window.removeEventListener('keydown',window._critiqueKeyHandler);
      finishCritique();
    }
  },50);
}

function critiqueClick(){
  if(!critiqueState||critiqueState.done) return;
  critiqueState.clicks++;
  document.getElementById('critique-count').textContent=critiqueState.clicks;
  const btn=document.getElementById('critique-btn');
  btn.style.transform='scale(0.94)';
  setTimeout(()=>{btn.style.transform='';},50);
}

function finishCritique(){
  if(!critiqueState) return;
  critiqueState.done=true;
  const rawClicks=critiqueState.clicks;
  // 설계 스킬 보정: 1단계+1, 2단계+2, 3단계+2
  const designLv = (player.skills && player.skills['설계']) || 0;
  const clickBonus = designLv>=2 ? 2 : designLv===1 ? 1 : 0;
  const n = rawClicks + clickBonus;
  if(clickBonus>0) addLog(`✏️ 설계 스킬 ${designLv}단계: 클릭 +${clickBonus} 보정 (${rawClicks}→${n})`, 'log-level');
  const tc=critiqueState.targetCourse;
  let delta=0, msg='';
  if(n>=5){delta=+1;msg='완벽! 진도 +1';}
  else if(n>=4){delta=0;msg='통과. 진도 변화 없음';}
  else if(n>=3){delta=-1;msg='미흡. 진도 -1';}
  else if(n>=2){delta=-1;msg='부족. 진도 -1';}
  else if(n>=1){delta=-2;msg='매우 부족. 진도 -2';}
  else{delta=-3;msg='무응답. 진도 -3';}

  if(tc){
    tc.hits=Math.max(0,Math.min(tc.maxHits,tc.hits+delta));
  }
  addLog(`✏️ ${critiqueState.boss.name}: 설계비평 ${rawClicks}회(보정후${n}) → ${msg}`,'log-eat');

  document.getElementById('critique-overlay').style.display='none';
  critiqueActive=false; critiqueState=null;
  gameRunning=true; loop();
}

// ── 조교(TA) 업데이트 & 렌더 ──────────────────────────
