function confirmGraduation(){
  document.getElementById('transcript-overlay').classList.remove('show');
  const continueBtn = document.getElementById('tr-continue-btn');
  if(continueBtn) continueBtn.style.display='none';
  if(checkGraduationReady()){
    showCareerChoice();
  } else {
    player.transcriptShown=false;
    nextSemester();
  }
}

function continueStudying(){
  document.getElementById('transcript-overlay').classList.remove('show');
  const continueBtn = document.getElementById('tr-continue-btn');
  if(continueBtn) continueBtn.style.display='none';
  player.graduationContinue = true;
  addLog('📋 졸업 요건 충족 — 초과학기로 계속 수강합니다.','log-level');
  nextSemester();
}
