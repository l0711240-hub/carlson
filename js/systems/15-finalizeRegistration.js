function finalizeRegistration(){
  document.getElementById('reg-overlay').classList.remove('show');
  document.getElementById('reg-submit-btn').onclick = submitRegistration;
  document.getElementById('reg-submit-btn').textContent = '수강신청 완료';

  // 학기 duration 설정 (계절학기 20초, 정규학기 60초)
  semDuration = isSeasonalSem(gameSem) ? (DEBUG_MODE?10:1200) : (DEBUG_MODE?60:3600);

  // Start semester
  startSemester();
  gameRunning = true;
  loop();
  updateUI();
  addLog(`📅 ${semLabel(gameYear,gameSem)} 시작! 수강: ${enrolledCodes.length}과목`, 'log-level');
}
