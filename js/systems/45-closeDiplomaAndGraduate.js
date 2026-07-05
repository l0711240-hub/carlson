function closeDiplomaAndGraduate(){
  document.getElementById('diploma-overlay').classList.remove('show');
  // 보너스 저장 (합격 시 적용)
  window._pendingGradBonus = {
    stamina: player._gradStaminaBonus || 0,
    speed:   player._gradSpeedBonus  || 0,
  };
  courseEntities=[];
  // 대학원 신입생 전형 오버레이 열기 (합격 여부 미결정)
  openGradApply('master');
}

function closeDiplomaAndContinue(){
  document.getElementById('diploma-overlay').classList.remove('show');
  player.transcriptShown = false;
  player.graduationContinue = true; // 졸업요건 충족 후 계속 수강 중
  addLog('📋 졸업 요건 충족 — 초과학기로 계속 수강합니다.','log-level');
  nextSemester();
}
