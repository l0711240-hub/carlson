// ══════════════════════════════════════════════════════
// myINHA 포털 시스템
// ══════════════════════════════════════════════════════
let _mySnuMainTab = 'major';
let _mySnuSubTab  = 'geo';

const MYSNU_MAJOR_SUBS = [
  {id:'geo',    label:'사회교육과'},
  {id:'agri',   label:'교직과정'},
  {id:'econ',   label:'경제학부'},
  {id:'forest', label:'산림환경학'},
  {id:'polisci',label:'정치외교학부'},
  {id:'japan',  label:'일본언어문명'},
  {id:'jstud',  label:'연계전공 일본학'},
  {id:'land',   label:'조경학'},
  {id:'genv',   label:'글로벌환경경영'},
];
const MYSNU_GRAD_SUBS = [
  {id:'grad_geo',    label:'사회교육과'},
  {id:'grad_agri',   label:'농경제사회학부'},
  {id:'grad_econ',   label:'경제학부'},
  {id:'grad_forest', label:'산림환경학'},
  {id:'grad_polisci',label:'정치외교학부'},
  {id:'grad_land',   label:'조경학'},
  {id:'grad_japan',  label:'아시아언어문명학부'},
];
const MYSNU_CROSS_SUBS = [
  
  {id:'internship',  label:'인턴십'},
  {id:'volunteer',   label:'사회봉사'},
  {id:'research',    label:'학생자율연구'},
];


// 수강신청 화면에서 졸업신청
function triggerGraduation(){
  if(!checkGraduationReady()){
    alert('졸업 요건을 아직 충족하지 못했습니다.');
    return;
  }
  document.getElementById('reg-overlay').classList.remove('show');
  showTranscript();
}

// openMySNU: 아래(6209) 정의 참조

function switchMySnuTab(tab){
  _mySnuMainTab = tab;
  // 서브탭 초기값
  if(tab==='major')    _mySnuSubTab = 'geo';
  if(tab==='grad')     _mySnuSubTab = 'grad_geo';
  if(tab==='crossover')_mySnuSubTab = 'internship';
  renderMySnuNav();
  renderMySnuContent();
}

function switchMySnuSub(sub){
  _mySnuSubTab = sub;
  renderMySnuNav();
  renderMySnuContent();
}

function renderMySnuNav(){
  // 메인탭
  document.querySelectorAll('#mysnu-nav-tabs .msn-tab').forEach(el=>{
    el.classList.toggle('active', el.dataset.tab===_mySnuMainTab);
  });
  // 서브탭
  const subs = _mySnuMainTab==='major' ? MYSNU_MAJOR_SUBS
             : _mySnuMainTab==='grad'  ? MYSNU_GRAD_SUBS
             : MYSNU_CROSS_SUBS;
  document.getElementById('mysnu-subnav').innerHTML = subs.map(s=>
    `<div class="msn-sub${_mySnuSubTab===s.id?' active':''}" onclick="switchMySnuSub('${s.id}')">${s.label}</div>`
  ).join('');
}

// ── 카드 빌더 헬퍼 ──
