function closeSemResult(){
  document.getElementById('semresult-overlay').classList.remove('show');
  // 졸업 성적표가 열려 있으면 nextSemester는 그쪽에서 처리
  const transcriptOpen = document.getElementById('transcript-overlay').classList.contains('show');
  if(!transcriptOpen){
    nextSemester();
  }
}

function nextSemester(){
  const idx = SEM_ORDER.indexOf(gameSem);
  const nextIdx = (idx+1) % SEM_ORDER.length;
  gameSem = SEM_ORDER[nextIdx];
  if(gameSem===1) gameYear++; // winter→1 전환 시 학년 증가
  // 계절학기는 20초, 정규학기는 60초
  semDuration = isSeasonalSem(gameSem) ? (DEBUG_MODE?10:1200) : (DEBUG_MODE?60:3600);

  for(let i=0;i<5+Math.floor(Math.random()*5);i++) spawnEntity('student');
  player.stamina = player.maxStamina;
  checkSkillUnlocks();
  updateUI();

  if(!isSeasonalSem(gameSem) && checkDoubleMajorEligible()){
    openDoubleOverlay();
  } else {
    openRegistration();
  }
}
