// ══════════════════════════════════════════════════════
// PROMOTION / GAMEOVER / WIN
// ══════════════════════════════════════════════════════
function checkPromotion(){
  if(player.rankIdx!==0) return;
  // 졸업요건 충족 후 계속 수강 중이면 매 학기 성적표 표시 안 함
  if(player.graduationContinue) return;
  if(!player.transcriptShown && checkGraduationReady()){
    showTranscript();
  }
}
