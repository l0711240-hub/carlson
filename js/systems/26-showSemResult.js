// ══════════════════════════════════════════════════════
// 학기 종료 결과 화면
// ══════════════════════════════════════════════════════
function showSemResult(){
  const semCourses = completedCourses.filter(c =>
    c.semYear === gameYear && c.semNum === gameSem
  );
  const semCredits = semCourses
    .filter(c => c.grade !== 'F' && c.grade !== 'U')
    .reduce((s, c) => s + c.credit, 0);

  // 헤더 정보
  document.getElementById('sr-title').textContent = semLabel(gameYear, gameSem) + ' 성적';
  document.getElementById('sr-gpa-val').textContent =
    (player.gpa || 0).toFixed(2);
  document.getElementById('sr-total-credits').textContent = player.credits || 0;
  document.getElementById('sr-sem-credits').textContent = semCredits;
  document.getElementById('sr-course-count').textContent = semCourses.length;

  // 다음 학기 안내
  const nextSem = gameSem === 1 ? 'summer' : (gameSem === 'summer' ? 2 : (gameSem === 2 ? 'winter' : 1));
  const isNextSeasonal = nextSem === 'summer' || nextSem === 'winter';
  document.getElementById('sr-next-hint').textContent =
    isNextSeasonal ? '다음 계절학기 수강신청이 시작됩니다' : '다음 학기 수강신청이 시작됩니다';

  // 과목 목록
  const gradeColors = {
    'A+':'#1a6e3a','A0':'#1a6e3a','A-':'#1a8f4a',
    'B+':'#1e40af','B0':'#1e40af','B-':'#2563eb',
    'C+':'#92400e','C0':'#92400e','C-':'#b45309',
    'F':'#991b1b', 'S':'#065f46', 'U':'#6b7280',
  };
  const gradeBg = {
    'A+':'#f0fdf4','A0':'#f0fdf4','A-':'#f0fdf4',
    'B+':'#eff6ff','B0':'#eff6ff','B-':'#eff6ff',
    'C+':'#fffbeb','C0':'#fffbeb','C-':'#fffbeb',
    'F':'#fef2f2', 'S':'#f0fdf4', 'U':'#f9fafb',
  };

  document.getElementById('sr-course-list').innerHTML = semCourses.length
    ? semCourses.map(c => {
        const col = gradeColors[c.grade] || '#374151';
        const bg  = gradeBg[c.grade] || '#f9fafb';
        const catLabel = {
          geo:'사회교육과', agri:'교직과정', econ:'경제학부', forest:'산림환경학',
          polisci:'정치외교', japan:'일본언어문명', japan_studies:'연계전공 일본학',
          land:'조경학', genv:'글로벌환경경영', liberal:'교양', elective:'선택교양',
          history:'역사학부', soc:'사회학과', civil:'건설환경', energy:'에너지자원',
          chembio:'화학생물', earth:'지구환경', lifesci:'생명과학', agrobio:'응용생물화학',
        }[c.category] || c.category;
        return `<div style="background:#fff;border:1px solid #e8ecf5;border-radius:8px;padding:10px 14px;margin-bottom:6px;display:flex;align-items:center;gap:10px;">
          <div style="flex:1;min-width:0;">
            <div style="font-size:13px;font-weight:600;color:#1a1a2e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${c.name}</div>
            <div style="font-size:10px;color:#888;margin-top:2px;">
              <span style="background:#f0f2f8;border-radius:3px;padding:1px 5px;">${catLabel}</span>
              &nbsp;${c.code}&nbsp;·&nbsp;${c.credit}학점
            </div>
          </div>
          <div style="background:${bg};border:1px solid ${col}22;border-radius:6px;padding:4px 12px;text-align:center;flex-shrink:0;">
            <div style="font-size:16px;font-weight:800;color:${col};">${c.grade}</div>
            <div style="font-size:8px;color:${col};opacity:.7;">${c.gradePoint != null ? c.gradePoint.toFixed(1) : 'S/U'}</div>
          </div>
        </div>`;
      }).join('')
    : `<div style="text-align:center;color:#aaa;font-size:12px;padding:30px 0;">이번 학기 이수 과목이 없습니다</div>`;

  document.getElementById('semresult-overlay').classList.add('show');
  // 졸업요건 충족 시 확인 버튼 클릭하면 성적표로 이동
  const confirmBtn = document.querySelector('#semresult-overlay button[onclick="closeSemResult()"]');
  if(confirmBtn){
    if(!player.graduationContinue && checkGraduationReady()){
      confirmBtn.textContent = '성적표 확인 →';
      confirmBtn.onclick = function(){
        document.getElementById('semresult-overlay').classList.remove('show');
        showTranscript();
      };
    } else {
      confirmBtn.textContent = '확인 →';
      confirmBtn.onclick = closeSemResult;
    }
  }
}
