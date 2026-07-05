function showLawDiploma(leetResult){
  const gpa = player.gpa || 0;
  const approved = doubleMajors.filter(d=>d.approved);

  const tier = leetResult ? leetResult.schoolTier : 'general';
  const finalScore = leetResult ? leetResult.finalScore : 0;
  const leetScore = leetResult ? leetResult.leetScore : 0;
  const clicks = leetResult ? leetResult.clicks : 0;

  let schoolName, schoolColor, jdTitle;
  if(tier === 'sky'){
    schoolName='임용 수석'; schoolColor='#fbbf24'; jdTitle='⭐ 임용 수석 합격증';
  } else if(tier === 'top'){
    schoolName='임용 우수'; schoolColor='#1d4ed8'; jdTitle='사회교사 임용 합격증';
  } else if(tier === 'general'){
    schoolName='일반 지역 임용'; schoolColor='#15803d'; jdTitle='사회교사 임용 합격증';
  } else {
    schoolName='추가 합격 (간신히 합격)'; schoolColor='#94a3b8'; jdTitle='사회교사 임용 합격증';
  }

  document.getElementById('lawdiploma-title').textContent = jdTitle;
  document.getElementById('lawdiploma-title').style.color = schoolColor;
  document.getElementById('lawdiploma-info').innerHTML =
    `GPA <b style="color:#003092">${gpa.toFixed(2)}</b> &nbsp;|&nbsp; 임용 1차 <b style="color:#a78bfa">${leetScore}점</b> (${clicks}회) &nbsp;|&nbsp; 최종 <b style="color:${schoolColor}">${finalScore}점</b>`;
  document.getElementById('lawdiploma-school-badge').innerHTML =
    `<div style="display:inline-block;background:${schoolColor}22;border:1px solid ${schoolColor};border-radius:8px;padding:6px 18px;">
      <span style="font-family:'Black Han Sans',sans-serif;font-size:14px;color:${schoolColor}">${schoolName}</span>
    </div>`;

  const typeNames={agri:'농경제 교직과정',econ:'경제학부',forest:'산림환경학',polisci_a:'정치학전공',polisci_b:'외교학전공',japan:'일본언어문명',land:'조경학'};
  const kindColors={double:'#0f766e',minor:'#6d28d9'};
  const kindBadge={double:'복수전공',minor:'부전공'};
  const majorsHtml = approved.length===0
    ? `<div style="font-size:10px;color:#666">부/복수전공 없음</div>`
    : approved.map(d=>{
        const col=kindColors[d.kind]||'#94a3b8';
        return `<div style="display:inline-flex;align-items:center;gap:5px;background:${col}22;border:1px solid ${col};border-radius:5px;padding:3px 8px;margin:2px;">
          <span style="font-size:9px;color:${col};font-weight:700">${kindBadge[d.kind]||d.kind}</span>
          <span style="font-size:10px;color:var(--text)">${typeNames[d.type]||d.type}</span>
        </div>`;
      }).join('');
  document.getElementById('lawdiploma-majors').innerHTML = majorsHtml;
  document.getElementById('lawdiploma-date').textContent = `제${player.semestersDone}학기 졸업`;

  gameRunning=false; cancelAnimationFrame(animId);
  document.getElementById('lawdiploma-overlay').classList.add('show');
}


function returnToRegistrationFromCareer(){
  document.getElementById('career-overlay').classList.remove('show');
  // 계속 수강 중이므로 수강신청 화면으로 복귀
  player.graduationContinue = true;
  openRegistration();
}

function closePubcoOverlay(){
  document.getElementById('pubco-overlay').classList.remove('show');
  gameRunning = false;
  cancelAnimationFrame(animId);
  showCareerChoice();
}
function returnToCareerFromPubco(){
  document.getElementById('pubco-result-overlay').classList.remove('show');
  showCareerChoice(); // showCareerChoice 내에서 gameRunning=false 처리
}
function showPubcoDiploma(){
  document.getElementById('pubco-result-overlay').classList.remove('show');
  const passed = window._pubcoPassed || [];
  const names = passed.map(r=>r.co.name).join(', ');
  // 졸업증 + 합격 메시지 표시 (diploma overlay 재활용)
  showDiploma('pubco');
  // 졸업증 하단에 공기업 합격 메시지 추가
  const bonusBox = document.getElementById('diploma-bonus-box');
  bonusBox.innerHTML = `<div style="font-family:'Black Han Sans',sans-serif;font-size:13px;color:#f97316;margin-bottom:8px">🏢 공기업 합격</div>
    ${passed.map(r=>`<div style="color:#22c55e;font-size:12px;margin-bottom:4px">✅ ${r.co.name} (${r.total}점)</div>`).join('')}
    <div style="font-size:10px;color:var(--dim);margin-top:6px">최종 합격을 축하합니다!</div>`;
  const gradBtn = document.getElementById('diploma-grad-btn');
  const contBtn = document.getElementById('diploma-cont-btn');
  gradBtn.style.display='none'; contBtn.style.display='none';
  const endBtn = document.createElement('button');
  endBtn.className='btn btn-warn'; endBtn.textContent='게임 종료';
  endBtn.onclick=()=>restartGame();
  document.querySelector('#diploma-overlay .overlay-box div:last-child').appendChild(endBtn);
}
// 전공별 보너스 정의
const MAJOR_BONUSES = {
  // 복수전공 보너스
  double: {
    agri:      { label:'교직과정 복수전공', desc:'포인트 획득 +25% · 석사 승급 요건 -10%', ptMult:1.25, promoteDiscount:0.10 },
    econ:      { label:'경제학부 복수전공',   desc:'포인트 획득 +30% · 박사 승급 요건 -10%', ptMult:1.30, promoteDiscount:0.10 },
    forest:    { label:'산림환경학 복수전공', desc:'최대 스태미나 +30 · 스태미나 회복 +50%', staminaBonus:30, regenMult:1.5 },
    polisci_a: { label:'정치학전공 복수전공', desc:'포인트 획득 +20% · 이동속도 +0.2',       ptMult:1.20, speedBonus:0.2 },
    polisci_b: { label:'외교학전공 복수전공', desc:'포인트 획득 +20% · 이동속도 +0.2',       ptMult:1.20, speedBonus:0.2 },
    japan:     { label:'일본언어문명 복수전공', desc:'이동속도 +0.25 · 스태미나 회복 +20%',  speedBonus:0.25, regenMult:1.2 },
    land:      { label:'조경학 복수전공',       desc:'최대 스태미나 +25 · 이동속도 +0.15',   staminaBonus:25, speedBonus:0.15 },
  },
  // 부전공 보너스
  minor: {
    agri:      { label:'교직과정 부전공',   desc:'최대 스태미나 +20',                       staminaBonus:20 },
    econ:      { label:'경제학부 부전공',     desc:'포인트 획득 +15%',                         ptMult:1.15 },
    forest:    { label:'산림환경학 부전공',   desc:'최대 스태미나 +20 · 스태미나 회복 +30%',  staminaBonus:20, regenMult:1.3 },
    polisci_a: { label:'정치학전공 부전공',   desc:'이동속도 +0.15',                           speedBonus:0.15 },
    polisci_b: { label:'외교학전공 부전공',   desc:'이동속도 +0.15',                           speedBonus:0.15 },
    japan:     { label:'일본언어문명 부전공', desc:'이동속도 +0.15',                           speedBonus:0.15 },
    land:      { label:'조경학 부전공',       desc:'최대 스태미나 +15',                        staminaBonus:15 },
  },
};

// 졸업 시 보너스 적용 (복수전공/부전공 목록 기반)
