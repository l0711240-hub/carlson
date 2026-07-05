function applyGraduationBonuses(){
  let ptMult = 1.0, staminaBonus = 0, regenMult = 1.0, speedBonus = 0.0, promoteDiscount = 0.0;
  const bonusLines = [];

  // 충족된 전공만 보너스 적용 (quickMajorReqMet 재사용)
  function _metForBonus(d){
    const t=d.type,k=d.kind;
    if(k==='double'){
      if(t==='agri') return ['M2649.001300','M2649.001400','M2649.001600','M1683.000400','5202.202','5202.205','5202.415'].every(passed)&&calcAgriEffectiveCredits()>=48;
      if(t==='econ') return ['212.201','212.202','212.203','212.204','212.214'].every(passed)&&calcEconEffectiveCredits()>=39;
      if(t==='forest') return ['M1698.001200','M1698.002900','M1698.001900','5241.417'].every(passed)&&player.forestCredits>=48;
      if(t==='polisci_a'||t==='polisci_b') return true; // 충족 체크 간소화
      if(t==='japan') return passed('1003.221')&&passed('M2641.000300')&&calcJapanEffectiveCredits()>=getJapanCreditReq();
      if(t==='japan_studies') return passed('M3236.000100')&&calcJapanStudiesEffectiveCredits()>=36;
      if(t==='land'){const le=completedCourses.filter(c=>c.category==='land'&&c.type==='normal'&&c.grade!=='F').reduce((s,c)=>s+c.credit,0);return calcLandRequiredCredits()>=29&&le>=19&&calcLandEffectiveCredits()>=getLandCreditReq();}
      if(t==='genv'){const eff=calcGenvEffectiveCredits();const sci=calcGenvSciCredits();return GENV_REQUIRED_CODES.every(passed)&&eff>=39&&sci>=Math.ceil(eff/3)&&isGenvInternDone();}
    }
    if(k==='minor'){
      if(t==='agri') return ['5202.202','M2649.001300','M1683.000400','212.201','212.202'].every(passed)&&calcAgriEffectiveCredits()>=24;
      if(t==='econ') return ['212.201','212.202','212.203','212.204','212.214'].every(passed)&&calcEconEffectiveCredits()>=21;
      if(t==='forest') return ['M1698.001200','M1698.002900','M1698.001900','5241.417'].every(passed)&&player.forestCredits>=21;
      if(t==='japan') return passed('1003.221')&&calcJapanEffectiveCredits()>=getJapanCreditReq();
      if(t==='japan_studies') return passed('M3236.000100')&&calcJapanStudiesEffectiveCredits()>=36;
      if(t==='land'){const le=completedCourses.filter(c=>c.category==='land'&&c.type==='normal'&&c.grade!=='F').reduce((s,c)=>s+c.credit,0);return calcLandRequiredCredits()>=19&&le>=5&&calcLandEffectiveCredits()>=getLandCreditReq();}
      return true;
    }
    return false;
  }
  for(const dm of doubleMajors.filter(d=>d.approved&&_metForBonus(d))){
    const table = dm.kind==='double' ? MAJOR_BONUSES.double : MAJOR_BONUSES.minor;
    const b = table[dm.type];
    if(!b) continue;
    if(b.ptMult)          { ptMult *= b.ptMult; bonusLines.push(`💰 포인트 획득 ×${b.ptMult.toFixed(2)}`); }
    if(b.staminaBonus)    { staminaBonus += b.staminaBonus; bonusLines.push(`❤️ 최대 스태미나 +${b.staminaBonus}`); }
    if(b.regenMult)       { regenMult *= b.regenMult; bonusLines.push(`🔄 스태미나 회복 ×${b.regenMult.toFixed(1)}`); }
    if(b.speedBonus)      { speedBonus += b.speedBonus; bonusLines.push(`⚡ 이동속도 +${b.speedBonus}`); }
    if(b.promoteDiscount) { promoteDiscount += b.promoteDiscount; bonusLines.push(`📉 승급 요건 -${Math.round(b.promoteDiscount*100)}%`); }
  }

  // 중복 보너스라인 합산 표시용으로 저장
  player._gradPtMult       = ptMult;
  player._gradStaminaBonus = staminaBonus;
  player._gradRegenMult    = regenMult;
  player._gradSpeedBonus   = speedBonus;
  player._gradPromoteDisc  = promoteDiscount;

  return bonusLines;
}

// 대학원 승급 요건 (할인 적용)
function getPromoteThreshold(rankIdx){
  const base = [0, 60, 240, 200, 999][rankIdx] || 999;
  const disc = player._gradPromoteDisc || 0;
  return Math.round(base * (1 - disc));
}

function showDiploma(fromTranscript){
  const gpa = player.gpa || 0;
  const approved = doubleMajors.filter(d=>d.approved);

  // GPA 라인
  document.getElementById('diploma-gpa-line').innerHTML =
    `GPA <b style="color:#003092">${gpa.toFixed(2)}</b> &nbsp;|&nbsp; 총 ${player.credits}학점 &nbsp;|&nbsp; ${player.semestersDone}학기 이수`;

  // 학과 정보 매핑
  const typeNames = {agri:'농경제 교직과정', econ:'경제학부', forest:'산림환경학', polisci_a:'정치학전공', polisci_b:'외교학전공', japan:'일본언어문명', japan_studies:'연계전공 일본학', land:'조경학'};
  const collegeNames = {agri:'농업생명과학대학 농경제사회학부', econ:'사회과학대학 경제학부', forest:'농업생명과학대학 농림생물자원학부', polisci_a:'사회과학대학 정치외교학부 정치학전공', polisci_b:'사회과학대학 정치외교학부 외교학전공', japan:'인문대학 아시아언어문명학부', japan_studies:'일본학 연계전공', land:'농업생명과학대학 조경·지역시스템공학부 조경학전공', genv:'학부대학 글로벌환경경영학'};
  const degreeName  = {agri:'경제학사(교직과정)', econ:'경제학사(경제학)', forest:'농학사(산림환경학)', polisci_a:'정치외교학사(정치학)', polisci_b:'정치외교학사(외교학)', japan:'문학사(일본언어문명)', japan_studies:'문학사(지리학)', land:'농학사(조경학)', genv:'환경학사(글로벌환경경영학)'};
  const kindColors  = {double:'#00c9a7', minor:'#a78bfa'};
  const kindBadge   = {double:'복수전공', minor:'부전공', genv:'연합전공', japan_studies:'연계전공'};

  // 졸업요건 충족한 전공만 필터
  function quickMet2(d){
    const t=d.type,k=d.kind;
    if(k==='double'){
      if(t==='agri') return ['M2649.001300','M2649.001400','M2649.001600','M1683.000400','5202.202','5202.205','5202.415'].every(passed)&&calcAgriEffectiveCredits()>=48;
      if(t==='econ') return ['212.201','212.202','212.203','212.204','212.214'].every(passed)&&calcEconEffectiveCredits()>=39;
      if(t==='forest') return ['M1698.001200','M1698.002900','M1698.001900','5241.417'].every(passed)&&player.forestCredits>=48;
      if(t==='polisci_a') return passed('200.103')&&passed('200.104')&&passed('216A.416')&&calcPolisciCrossoverCredits('polisci_a')>=getPolisciCreditReq('polisci_a');
      if(t==='polisci_b') return passed('200.103')&&passed('200.104')&&passed('216B.420')&&calcPolisciCrossoverCredits('polisci_b')>=getPolisciCreditReq('polisci_b');
      if(t==='japan') return passed('1003.221')&&passed('M2641.000300')&&calcJapanEffectiveCredits()>=getJapanCreditReq();
      if(t==='japan_studies') return passed('M3236.000100')&&calcJapanStudiesEffectiveCredits()>=36&&calcJapanStudiesHumanitCredit()>=6;
      if(t==='land'){const le=completedCourses.filter(c=>c.category==='land'&&c.type==='normal'&&c.grade!=='F').reduce((s,c)=>s+c.credit,0);return calcLandRequiredCredits()>=29&&le>=19&&calcLandEffectiveCredits()>=getLandCreditReq()&&(passed('M1707.000300')&&passed('M1707.000400')||passed('M1707.001000')&&passed('M1707.001100'));}
      if(t==='genv'){const eff=calcGenvEffectiveCredits();const sci=calcGenvSciCredits();return GENV_REQUIRED_CODES.every(passed)&&eff>=39&&sci>=Math.ceil(eff/3)&&isGenvInternDone();}
    }
    if(k==='minor'){
      if(t==='agri') return ['5202.202','M2649.001300','M1683.000400','212.201','212.202'].every(passed)&&calcAgriEffectiveCredits()>=24;
      if(t==='econ') return ['212.201','212.202','212.203','212.204','212.214'].every(passed)&&calcEconEffectiveCredits()>=21;
      if(t==='forest') return ['M1698.001200','M1698.002900','M1698.001900','5241.417'].every(passed)&&player.forestCredits>=21;
      if(t==='polisci_a') return passed('200.103')&&passed('200.104')&&passed('216A.416')&&calcPolisciCrossoverCredits('polisci_a')>=getPolisciCreditReq('polisci_a');
      if(t==='polisci_b') return passed('200.103')&&passed('200.104')&&passed('216B.420')&&calcPolisciCrossoverCredits('polisci_b')>=getPolisciCreditReq('polisci_b');
      if(t==='japan') return passed('1003.221')&&calcJapanEffectiveCredits()>=getJapanCreditReq();
      if(t==='japan_studies') return passed('M3236.000100')&&calcJapanStudiesEffectiveCredits()>=36&&calcJapanStudiesHumanitCredit()>=6;
      if(t==='land'){const le=completedCourses.filter(c=>c.category==='land'&&c.type==='normal'&&c.grade!=='F').reduce((s,c)=>s+c.credit,0);return calcLandRequiredCredits()>=19&&le>=5&&calcLandEffectiveCredits()>=getLandCreditReq();}
    }
    return false;
  }
  const metMajors = approved.filter(d=>quickMet2(d));

  // 졸업증 문구 생성
  const doubles  = metMajors.filter(d=>d.kind==='double');
  const minors   = metMajors.filter(d=>d.kind==='minor');
  const jStudies = metMajors.filter(d=>d.type==='japan_studies');
  // 주전공 부분
  const minorStr = minors.length ? `(${minors.map(d=>typeNames[d.type]||d.type).join(', ')} 부전공)` : '';
  const jStudyStr = jStudies.length ? `(${jStudies.map(_=>'일본학 연계전공').join(', ')})` : '';
  const mainPart = `사회과학대학 사회교육과${minorStr||jStudyStr ? (minorStr||'')+jStudyStr : ''}`;
  // 복수전공 부분
  const doubleParts = doubles.map(d=>d.type==='japan_studies'?null:`${collegeNames[d.type]||d.type}`).filter(Boolean);
  // 학위 부분
  const mainDegree = '문학사(지리학)';
  const doubleDegrees = doubles.map(d=>d.type==='japan_studies'?null:degreeName[d.type]||d.type).filter(Boolean);

  let certText = '';
  if(doubleParts.length===0){
    certText = `위 사람은 ${mainPart}에서 소정의 과정을 이수하고 규정된 논문과 시험에 합격하여 ${mainDegree}의 자격을 갖추었으므로 이를 인정함.`;
  } else {
    const allColleges = [mainPart, ...doubleParts].join('와 ');
    const allDegrees  = [mainDegree, ...doubleDegrees].join('와 ');
    certText = `위 사람은 ${allColleges}에서 소정의 과정을 이수하고 규정된 논문과 시험에 합격하여 ${allDegrees}의 자격을 갖추었으므로 이를 인정함.`;
  }

  let majorsHtml = `<div style="font-size:10px;color:#334155;line-height:1.9;text-align:center;background:#f0f4fb;border-radius:6px;padding:10px 12px;margin-bottom:8px">${certText}</div>`;
  // 충족 배지 표시 (배지)
  if(metMajors.length>0){
    majorsHtml += `<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:4px;margin-bottom:4px">` + metMajors.map(d=>{
      const col=kindColors[d.kind]||'#94a3b8';
      return `<span style="background:${col}22;border:1px solid ${col};border-radius:4px;padding:2px 8px;font-size:9px;color:${col}">${d.type==='genv'?'연합전공':d.type==='japan_studies'?'연계전공':kindBadge[d.kind]} ${typeNames[d.type]||d.type}</span>`;
    }).join('') + `</div>`;
  }
  document.getElementById('diploma-majors').innerHTML = majorsHtml;

  // 보너스 박스
  const bonusLines = applyGraduationBonuses();
  const bonusBox = document.getElementById('diploma-bonus-box');
  if(bonusLines.length === 0){
    bonusBox.innerHTML = `<div style="font-size:10px;color:#666;text-align:center">대학원 보너스 없음</div>`;
  } else {
    bonusBox.innerHTML = `
      <div style="font-family:'Black Han Sans',sans-serif;font-size:11px;color:var(--accent3);margin-bottom:6px;">🎓 대학원 진학 보너스</div>
      ${bonusLines.map(l=>`<div style="font-size:10px;color:var(--text);padding:2px 0">${l}</div>`).join('')}
      <div style="font-size:9px;color:#666;margin-top:6px;">※ 보너스는 석사 진학 시 즉시 적용됩니다</div>`;
  }

  // 날짜
  document.getElementById('diploma-date').textContent =
    `제${player.semestersDone}학기 졸업`;

  // 버튼 설정
  const gradBtn = document.getElementById('diploma-grad-btn');
  const contBtn = document.getElementById('diploma-cont-btn');
  if(fromTranscript === 'grad'){
    // 대학원 진학 선택 경로 (구버전 호환)
    gradBtn.style.display=''; contBtn.style.display='none';
    gradBtn.textContent='진로 결정 →';
  } else if(fromTranscript === 'grad_after_admit'){
    // 대학원 합격 후 졸업증: 대학원 수강계획으로
    gradBtn.style.display=''; contBtn.style.display='none';
    gradBtn.textContent='석사과정 시작 →';
    gradBtn.onclick=()=>{ document.getElementById('diploma-overlay').classList.remove('show'); openGradSemReg(); };
  } else if(fromTranscript === 'pubco'){
    gradBtn.style.display='none'; contBtn.style.display='none';
  } else if(fromTranscript === 'law_pre' || fromTranscript === 'appr_pre'){
    gradBtn.style.display=''; contBtn.style.display='none';
    gradBtn.textContent='다음 →';
  } else {
    // 계속 수강하기 경로: 계속 수강하기 버튼만
    gradBtn.style.display='none'; contBtn.style.display='';
  }

  document.getElementById('diploma-overlay').classList.add('show');
}
