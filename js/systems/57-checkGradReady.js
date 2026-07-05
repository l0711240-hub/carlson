function checkGradReady(){
  const degree=player.gradDegree;
  if(!degree || degree==='postdoc' || degree==='prof') return false; // 포닥/교수 중에는 통과 안 함
  // 석사: 해당 전공 교수 컨택 필수 (학사 때 같은 전공 컨택했으면 면제)
  if(degree==='master'){
    const contactedThisDept = !!(player.contactHistory||{})[player.gradSchool];
    if(!contactedThisDept && !player.gradContactDone) return false;
    // gradContactDone은 대학원에서 직접 컨택한 경우만 인정 (학사 컨택은 contactHistory로만 판단)
  }
  const dept=GRAD_DEPTS.find(d=>d.id===player.gradSchool);
  if(!dept) return false;
  // 학점 요건
  const minCr=degree==='master'?24:36;
  const hasBg = degree==='master'
    ? (player.gradSchool==='geo'||doubleMajors.some(d=>d.type===player.gradSchool&&d.approved))
    : true; // 박사: 이전 석사 있으면 ok
  const reqCr=hasBg?minCr:minCr+3;
  if(player.gradCredits<reqCr) return false;
  if(!player.gradEthicsDone) return false;
  // 졸업논문
  const thReq=degree==='master'?25:50;
  if(player.gradThesisHits<thReq) return false;
  // 논문·연구 실적 (졸업논문 신청 조건)
  if(degree==='master'&&(player.gradPapers<1||player.gradResearch<3)) return false;
  if(degree==='phd'&&(player.gradPapers<3||player.gradResearch<10)) return false;
  return true;
}

function showGradCongratsOrNext(){
  gameRunning=false; cancelAnimationFrame(animId);
  const degree=player.gradDegree;
  const dept=GRAD_DEPTS.find(d=>d.id===player.gradSchool);
  const degName=degree==='master'?'석사':'박사';
  addLog(`🎓 ${dept.name} ${degName} 졸업!`,'log-level');

  if(degree==='master'){
    // 석사 졸업: 졸업증서 표시 → 이후 진로결정 창
    showGradDiploma('master', dept, ()=>{
      // 진로결정 창 열기 (박사 전형 포함)
      showCareerChoicePostMaster();
    });
  } else {
    // 박사 졸업 → 포닥
    showGradDiploma('phd', dept, ()=>{
      player.gradDegree='postdoc'; // promote 전에 설정해야 checkGradReady가 phd로 재통과 안 함
      promote('postdoc');
      // promote('postdoc') 내부에서 setTimeout으로 openGradSemReg() 호출됨
    });
  }
}

// 석사/박사 졸업증서 오버레이 (diploma overlay 재활용)
// 전공별 학위명 매핑
const _DEPT_DEGREE = {
  geo:    {ko:'문학',      field:'지리학',         enM:'Master of Arts',      enP:'Doctor of Philosophy'},
  agri:   {ko:'경제학',    field:'교직과정',      enM:'Master of Economics', enP:'Doctor of Philosophy'},
  econ:   {ko:'경제학',    field:'경제학',          enM:'Master of Economics', enP:'Doctor of Philosophy'},
  forest: {ko:'농학',      field:'산림환경학',      enM:'Master of Science',   enP:'Doctor of Philosophy'},
  polisci:{ko:'정치외교학',field:'정치외교학',       enM:'Master of Arts',      enP:'Doctor of Philosophy'},
  japan:  {ko:'문학',      field:'일본언어문명학',   enM:'Master of Arts',      enP:'Doctor of Philosophy'},
  land:   {ko:'농학',      field:'조경학',          enM:'Master of Science',   enP:'Doctor of Philosophy'},
};
function showGradDiploma(degree, dept, onClose){
  const gpa = player.gradGpa || player.gpa || 0;
  const isMaster = degree==='master';
  const degMap = _DEPT_DEGREE[dept.id] || {ko:'학술', field:dept.name, enM:'Master of Science', enP:'Doctor of Philosophy'};
  const degKo  = isMaster ? `${degMap.ko} 석사` : `${degMap.ko} 박사`;
  const degEn  = isMaster ? degMap.enM : degMap.enP;
  const gpaLabel = isMaster ? '석사 GPA' : '박사 GPA';
  document.getElementById('diploma-gpa-line').innerHTML=
    `${gpaLabel} <b style="color:#a78bfa">${gpa.toFixed ? gpa.toFixed(2) : gpa}</b> &nbsp;|&nbsp; 이수학점 <b style="color:#60a5fa">${player.gradCredits||0}</b> &nbsp;|&nbsp; 논문 <b style="color:#f472b6">${player.gradPapers||0}</b>편`;
  document.getElementById('diploma-majors').innerHTML=
    `<div style="font-size:14px;color:#a78bfa;font-family:'Black Han Sans',sans-serif;margin-bottom:4px">${dept.name}</div>
     <div style="font-size:11px;color:var(--dim)">${degKo} (${degMap.field}) — ${degEn}</div>`;
  document.getElementById('diploma-bonus-box').innerHTML=
    `<div style="font-size:11px;color:#fbbf24;margin-bottom:6px">🎓 ${dept.name} ${degKo} 졸업</div>
     <div style="font-size:10px;color:var(--dim)">학위논문 통과 및 소정의 과정 이수를 인정함</div>`;
  document.getElementById('diploma-date').textContent=
    `${degKo} 졸업`;

  const gradBtn=document.getElementById('diploma-grad-btn');
  const contBtn=document.getElementById('diploma-cont-btn');
  gradBtn.style.display=''; contBtn.style.display='none';
  gradBtn.textContent='다음 →';
  gradBtn.onclick=()=>{
    document.getElementById('diploma-overlay').classList.remove('show');
    if(onClose) onClose();
  };
  document.getElementById('diploma-overlay').classList.add('show');
}

// 석사 졸업 후 진로 결정 (박사/공기업 등)
