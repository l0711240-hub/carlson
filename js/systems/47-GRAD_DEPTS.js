// ══════════════════════════════════════════════════════
// 대학원 시스템
// ══════════════════════════════════════════════════════

// 대학원 학과 정의
const GRAD_DEPTS = [
  { id:'geo',      name:'사회교육학과 (사회과교육)',             masterTeps:298, phdTeps:298, snult:0,   majorCat:'geo' },
  { id:'agri',     name:'교육학과 (교직·교육학)',        masterTeps:327, phdTeps:327, snult:0,   majorCat:'agri' },
  { id:'econ',     name:'사회교육학과 (경제)',              masterTeps:387, phdTeps:387, snult:0,   majorCat:'econ' },
  { id:'polisci',  name:'사회교육학과 (정치)',          masterTeps:387, phdTeps:387, snult:0,   majorCat:'polisci' },
  { id:'japan',    name:'교육대학원 (일반사회)',    masterTeps:327, phdTeps:327, snult:60,  majorCat:'japan' },
  { id:'forest',   name:'사회교육학과 (사회·문화)',      masterTeps:298, phdTeps:298, snult:0,   majorCat:'forest' },
  { id:'land',     name:'사회교육학과 (법교육)', masterTeps:298, phdTeps:298, snult:0, majorCat:'land' },
];

// 전형 방식 정의 (학과별)
// rounds: 차수 배열. 각 round = { stages, weights, passThreshold }
// passThreshold: 해당 차수에서 합격하기 위한 최소 득점률 (0~1). 없으면 최종차수.
// 1차 합격 여부: totalScore/maxScore >= passThreshold → 2차 진행
// 최종 합격 여부: 마지막 차수 totalScore/maxScore >= 0.40 (40%)
const GRAD_ADMISSION = {
  // 사회교육과: 1차(면접100+서류100), 합격선 없음(단일전형)
  geo: { rounds:[
    { stages:['doc','interview'], weights:{doc:100, interview:100} }
  ]},
  // 농경제사회학부: 단일전형
  agri: { rounds:[
    { stages:['doc','interview'], weights:{doc:100, interview:100} }
  ]},
  // 경제학부: 1차(필답고사100) → 2차(필답고사100[재사용]+면접100)
  // ★ exam stageKey 통일: 1차에서 취득한 exam 점수가 2차 집계에 그대로 사용됨
  econ: { rounds:[
    { stages:['exam'], weights:{exam:100}, passThreshold:0.40 },
    { stages:['interview'], weights:{exam:100, interview:100} }
  ]},
  // 정치외교학부: 1차(서류100) → 2차(면접100) — 항목이 달라 중복 없음
  polisci: { rounds:[
    { stages:['doc'], weights:{doc:100}, passThreshold:0.40 },
    { stages:['interview'], weights:{interview:100} }
  ]},
  // 아시아언어문명학부: 1차(면접120+서류80+한국사검정100) → 2차(필답200+면접120[재사용]+서류80[재사용]+한국사검정100[재사용])
  // ★ interview/doc/snult stageKey 통일: 1차 점수를 2차 집계에 재사용, 2차에서는 exam만 새로 응시
  japan: { rounds:[
    { stages:['interview','doc','snult'], weights:{interview:120, doc:80, snult:100}, passThreshold:0.40 },
    { stages:['exam'], weights:{exam:200, interview:120, doc:80, snult:100} }
  ]},
  // 산림: 단일전형
  forest: { rounds:[
    { stages:['doc','interview'], weights:{doc:100, interview:100} }
  ]},
  // 조경: 단일전형
  land: { rounds:[
    { stages:['doc','interview'], weights:{doc:100, interview:100} }
  ]},
};

// 대학원 수강 계획 아이템 타입
const GRAD_COURSE_TYPES = [
  { id:'lecture',   name:'전공교과',        maxHits:6,  credit:3, graded:true,  maxPerSem:4 },
  { id:'thesis_res',name:'논문연구',        maxHits:1,  credit:3, graded:false, grade:'S',  maxPerSem:2 },
  { id:'ethics',    name:'연구윤리의 이해', maxHits:2,  credit:1, graded:false, grade:'S',  maxPerSem:1, onlyOnce:true },
  { id:'paper',     name:'논문 작성',       maxHits:5,  credit:0, graded:false, isPaper:true },
  { id:'research',  name:'연구',            maxHits:5,  credit:0, graded:false, isResearch:true },
  { id:'conference',name:'학회 발표',       maxHits:1,  credit:0, graded:false, isConference:true },
  { id:'thesis',    name:'졸업논문',        maxHits:999,credit:0, graded:false, isThesis:true },
  { id:'contact',   name:'교수 컨택',       maxHits:10, credit:0, graded:false, isContact:true, onlyOnce:true },
  { id:'student_guidance', name:'학생지도',    maxHits:5,   credit:0, graded:false, isStudentGuidance:true },
  // 교수 전용
  { id:'publication',      name:'출판',         maxHits:30,  credit:0, graded:false, isPublication:true,    isProfOnly:true },
  { id:'research_project', name:'연구사업 참여', maxHits:50,  credit:0, graded:false, isResearchProject:true,isProfOnly:true },
  { id:'external_lecture', name:'외부강연',      maxHits:1,   credit:0, graded:false, isExternalLecture:true, isProfOnly:true, maxPerSem:5 },
  { id:'broadcast',        name:'방송출연',      maxHits:1,   credit:0, graded:false, isBroadcast:true,       isProfOnly:true, maxPerSem:5 },
  // 포닥 전용
  { id:'lecture_postdoc',    name:'강의(포닥)', maxHits:5,  credit:0, graded:false, isPostdocLec:true, maxPerSem:1 },
  { id:'paper_postdoc',      name:'논문 작성',  maxHits:5,  credit:0, graded:false, isPaper:true },
  { id:'research_postdoc',   name:'연구',       maxHits:5,  credit:0, graded:false, isResearch:true },
  { id:'conference_postdoc', name:'학회 발표',  maxHits:1,  credit:0, graded:false, isConference:true },

];

// 대학원 진입 시 자동 추가되는 엔티티 (조교·랩실연구)
// startGradSemester()에서 처리

let _gradApplyDept = null;
let _gradApplyRoundIdx = 0;   // 현재 차수 인덱스 (0=1차, 1=2차)
let _gradApplyStageIdx = 0;   // 현재 차수 내 단계 인덱스
let _gradApplyRoundScores = {}; // {roundIdx: {stage: score}}
let _gradExamInterval = null;
let _gradExamTime = 0;
let _gradExamClicks = 0;
let _gradIntInterval = null;
let _gradIntTime = 0;
let _gradIntClicks = 0;
let _gradSemPlan = []; // [{type, name, hits:0, maxHits, credit, ...}]

// ── 대학원 진학 오버레이 열기 ─────────────────────────────
