function getRankIdx(id){ return RANKS.findIndex(r=>r.id===id); }

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let W, H;
let player, entities, courseEntities, completedCourses, enrolledCodes, logs;
let keys={}, gameRunning=false;
let gameYear=1, gameSem=1, semTimer=0, semDuration=3600; // 1분 = 60fps × 60초
// gameSem: 1 | 'summer' | 2 | 'winter'  (순환)
const SEM_ORDER = [1,'summer',2,'winter'];
function isSeasonalSem(s){ return s==='summer'||s==='winter'; }
function semLabel(year, sem){
  // 게임 내 표시: "1학년 1학기" 형식
  if(sem==='summer') return `${year}학년 여름학기`;
  if(sem==='winter') return `${year}학년 겨울학기`;
  return `${year}학년 ${sem}학기`;
}
// 이수과목/성적표용: "1학년 1학기" 형식 (semLabel과 동일)
function semLabelYear(year, sem){
  if(sem==='summer') return `${year}학년 여름학기`;
  if(sem==='winter') return `${year}학년 겨울학기`;
  return `${year}학년 ${sem}학기`;
}
// CRS 상단바용 짧은 표기: "2024 - 1학기"
function semLabelShort(year, sem){
  const y = 2024 + year - 1;
  const masked = y.toString().slice(0,2) + 'XX';
  if(sem==='summer') return `${masked} - 여름학기`;
  if(sem==='winter') return `${masked} - 겨울학기`;
  return `${masked} - ${sem}학기`;
}
// DEBUG_MODE: false | 'full' | 'undergrad_only'
// full: 학부+대학원 모두 자동완수 + 포인트 풀충
// undergrad_only: 학부만 자동완수, 대학원 정상
let DEBUG_MODE = false;

function _applyDebugMode(){
  const btn = document.getElementById('debug-btn');
  const labels = {false:'🐛 DEBUG OFF', full:'🐛 DEBUG A (전체)', undergrad_only:'🐛 DEBUG B (학부만)'};
  const colors = {false:'#ef4444', full:'#22c55e', undergrad_only:'#f97316'};
  const opacities = {false:'0.7', full:'1', undergrad_only:'1'};
  if(btn){
    btn.textContent = labels[DEBUG_MODE] || '🐛 DEBUG OFF';
    btn.style.background = colors[DEBUG_MODE] || '#ef4444';
    btn.style.opacity = opacities[DEBUG_MODE] || '0.7';
  }
  semDuration = isSeasonalSem(gameSem) ? (DEBUG_MODE?10:1200) : (DEBUG_MODE?60:3600);
}

function toggleDebugFromStart(val){
  // val: false | 'full' | 'undergrad_only'
  DEBUG_MODE = val;
  _applyDebugMode();
}

function toggleDebug(){
  // 헤더 버튼: OFF → A(전체) → B(학부만) → OFF 순환
  if(DEBUG_MODE === false)           DEBUG_MODE = 'full';
  else if(DEBUG_MODE === 'full')     DEBUG_MODE = 'undergrad_only';
  else                               DEBUG_MODE = false;
  _applyDebugMode();
}
let animId;
let doubleMajors = []; // [{type:'agri'|'econ'|'geo_intensive', approved:true}]
let semestersDone = 0;
let regularSemesters = 0; // 12학점 이상 수강한 학기 수
let currentRegTab = 'liberal_basic';
let pendingRegistration = [];
