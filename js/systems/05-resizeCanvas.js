// ══════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════
function resizeCanvas(){
  const c = document.getElementById('canvas-container');
  W=c.clientWidth; H=c.clientHeight;
  canvas.width=W; canvas.height=H;
}

function startGame(){
  const nameInput = document.getElementById('player-name-input');
  window._playerName = nameInput ? nameInput.value.trim() || '학생' : '학생';
  document.getElementById('overlay').classList.remove('show');
  resizeCanvas();
  initGame();
}

function restartGame(){
  // 모든 오버레이 닫기
  ['gameover-overlay','diploma-overlay','lawdiploma-overlay',
   'career-overlay','leet-overlay','transcript-overlay','double-overlay',
   'intern-overlay','cert-overlay','certtest-overlay','ncs-overlay',
   'pubco-overlay','pubco-result-overlay',
   'appraiser-overlay','appraiserdiploma-overlay'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.classList.remove('show');
  });
  resizeCanvas();
  initGame();
}

function initGame(){
  player={
    x:W/2, y:H/2, rank:'student', rankIdx:0,
    credits:0, liberalCredits:0, geoCredits:0, agriCredits:0, econCredits:0, forestCredits:0, polisciCredits:0, japanCredits:0, japanStudiesCredits:0, landCredits:0, genvCredits:0,
    interns:[],      // [{type:'public'|'related'|'general', name, done:false, hits:0}]
    researchPlan:[],   // [{dept, type:'contact'|'intern', name, hits:0, done:false}]
    researchPlanDone:false,  // 연구계획 완수 여부 (학생자율연구 수강 조건)
    researchPlanHits:0,      // 연구계획 접촉 횟수 (3회 완수)
    certs:{},        // {컴활1급:true, 토익:score, 한국사:grade, 텝스:score, snult일본어:score}
    skills:{통계:0, 일본어:0, 현장연구:0, GIS:0, 질적연구:0, 설계:0, 생명과학:0, 미시경제학:0, 거시경제학:0, 지리문헌:0, 경제문헌:0, 정치문헌:0, 외교문헌:0, 행정문헌:0, 조경문헌:0, 환경문헌:0},
    skillProgress:{통계:0, 일본어:0, 현장연구:0, GIS:0, 질적연구:0, 설계:0, 생명과학:0, 미시경제학:0, 거시경제학:0, 지리문헌:0, 경제문헌:0, 정치문헌:0, 외교문헌:0, 행정문헌:0, 조경문헌:0},
    ncsScore:0,      // NCS 점수 (공기업 선택 시 측정)
    appraiserClicks:0, // 7급 공무원 누적 클릭수
    gpa:0, gradePoints:0, totalGradeCredits:0,
    points:0, size:10, speed:2.2, vx:0, vy:0,
    invincible:0, stamina:100, maxStamina:100, drainTimer:0,
    name: window._playerName || '학생',
    transcriptShown:false, semestersDone:0,
    // 대학원 관련
    gradSchool:null,     // 진학한 대학원 학과 id
    gradDegree:null,     // 'master'|'phd'
    gradCredits:0,       // 대학원 이수학점
    gradPapers:0,        // 논문 실적 수
    gradResearch:0,      // 연구 실적 수
    gradConferences:0,   // 학회 발표 실적 수
    gradThesisHits:0,    // 졸업논문 누적 접촉
    gradEthicsDone:false,// 연구윤리 이수 여부
    gradContactDone:false, // 교수 컨택 완수
    gradInternDone:false,  // 학부생 인턴 완수
    gradAssistant:0,     // 조교 실적 (박사 전형용)
    gradLabResearch:0,   // 랩실 연구 실적
    postdocPapers:0,     // 포닥 논문 실적
    postdocResearch:0,   // 포닥 연구 실적
    postdocLectures:0,   // 포닥 강의 실적
    postdocConferences:0, // 포닥 학회 발표 실적
  };
  entities=[]; courseEntities=[]; completedCourses=[]; enrolledCodes=[]; logs=[];
  gameYear=1; gameSem=1; semTimer=0;
  doubleMajors=[]; minorMajors=[]; semestersDone=0; regularSemesters=0;

  for(let i=0;i<15;i++) spawnEntity('student');
  for(let i=0;i<5;i++) spawnEntity('master');
  for(let i=0;i<3;i++) spawnEntity('phd');
  for(let i=0;i<2;i++) spawnEntity('postdoc');
  spawnEntity('prof');

  updateUI();
  openRegistration();
}
