function showCareerChoicePostMaster(){
  window._postMasterMode = true;
  gameRunning=false; cancelAnimationFrame(animId);
  showCareerChoice();
}

function promote(toRankId){
  const r=RANKS.find(x=>x.id===toRankId);
  player.rank=toRankId; player.rankIdx=getRankIdx(toRankId);
  player.size=r.size; player.speed=2.5; player.invincible=180;
  addLog(`🎉 ${r.name}(으)로 전직!`,'log-level');
  if(toRankId==='postdoc'){
    setTimeout(()=>openGradSemReg(),300);
  } else if(toRankId==='prof'){
    // 교수 임용 → winGame으로 임용 창 표시
    gameRunning=false; cancelAnimationFrame(animId);
    setTimeout(()=>winGame(),300);
    return;
  }
  gameRunning=true; loop(); updateUI();
}

function gameOverFn(reason){
  gameRunning=false; cancelAnimationFrame(animId);
  const rankName=RANKS[player.rankIdx].name;
  let msg;
  if(reason==='overterm'){
    msg=`정규학기 16학기를 초과하여 <b style="color:#ef4444">제적</b>되었습니다.<br>총학점: ${player.credits} | GPA: ${(player.gpa||0).toFixed(2)}`;
  } else {
    msg=`<b>${rankName}</b>의 스태미나가 고갈되어 <b style="color:#ef4444">과로사</b>했습니다.<br>`
      +(player.rankIdx===0?`총학점: ${player.credits} | GPA: ${(player.gpa||0).toFixed(2)}`:`누적 포인트: ${player.points}`);
  }
  document.getElementById('go-msg').innerHTML=msg;
  document.getElementById('gameover-overlay').classList.add('show');
}

function winGame(){
  gameRunning=false; cancelAnimationFrame(animId);
  // 교수 임용 축하 + 계속 여부 선택
  document.getElementById('go-title').textContent='🏆 교수 임용!';
  document.getElementById('go-title').style.color='#fbbf24';
  document.getElementById('go-msg').innerHTML=
    `드디어 교수가 되었습니다!<br>최종 포인트: <b style="color:#fbbf24">${player.points}</b><br><br>` +
    `<div style="display:flex;gap:10px;justify-content:center;margin-top:8px;">` +
    `<button class="btn" style="background:#003092;color:#fff" onclick="startProfMode()">🎓 학기 운영 계속</button>` +
    `<button class="btn btn-warn" onclick="restartGame()">게임 종료</button>` +
    `</div>`;
  document.getElementById('gameover-overlay').classList.add('show');
}

function startProfMode(){
  document.getElementById('gameover-overlay').classList.remove('show');
  player.gradDegree='prof';
  updateUI();
  // 교수 첫 학기계획 바로 오픈 (학기 진행 없이)
  openGradSemReg();
}
