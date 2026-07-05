function checkDoubleMajorEligible(){
  return player.semestersDone >= 1 && player.credits >= 33;
}

function quickMajorReq(type, kind){
  if(kind==='double'){
    if(type==='agri') return calcAgriEffectiveCredits()>=48;
    if(type==='econ') return ['212.201','212.202','212.203','212.204','212.214'].every(passed)&&calcEconEffectiveCredits()>=39;
    if(type==='forest') return ['M1698.001200','M1698.002900','M1698.001900','5241.417'].every(passed)&&player.forestCredits>=48;
    if(type==='polisci_a') return passed('200.103')&&passed('200.104')&&passed('216A.416')&&calcPolisciGaDivCredits('polisci_a')>=6&&calcPolisciNaDivCredits('polisci_a')>=6&&calcPolisciDaDivCredits('polisci_a')>=6&&calcPolisciCrossoverCredits('polisci_a')>=getPolisciCreditReq('polisci_a');
    if(type==='polisci_b') return passed('200.103')&&passed('200.104')&&passed('216B.420')&&calcPolisciGaDivCredits('polisci_b')>=6&&calcPolisciNaDivCredits('polisci_b')>=6&&calcPolisciDaDivCredits('polisci_b')>=6&&calcPolisciCrossoverCredits('polisci_b')>=getPolisciCreditReq('polisci_b');
    if(type==='japan') return passed('1003.221')&&passed('M2641.000300')&&calcJapanEffectiveCredits()>=getJapanCreditReq();
    if(type==='japan_studies') return passed('M3236.000100')&&calcJapanStudiesEffectiveCredits()>=36&&calcJapanStudiesHumanitCredit()>=6;
    if(type==='land'){const le=completedCourses.filter(c=>c.category==='land'&&c.type==='normal'&&c.grade!=='F').reduce((s,c)=>s+c.credit,0);return calcLandRequiredCredits()>=29&&le>=19&&calcLandEffectiveCredits()>=getLandCreditReq()&&(passed('M1707.000300')&&passed('M1707.000400')||passed('M1707.001000')&&passed('M1707.001100'));}
    if(type==='genv'){const eff=calcGenvEffectiveCredits();const sci=calcGenvSciCredits();return GENV_REQUIRED_CODES.every(passed)&&eff>=39&&sci>=Math.ceil(eff/3)&&isGenvInternDone();}
  }
  if(kind==='minor'){
    if(type==='agri') return calcAgriEffectiveCredits()>=24;
    if(type==='econ') return ['212.201','212.202','212.203','212.204','212.214'].every(passed)&&calcEconEffectiveCredits()>=21;
    if(type==='forest') return ['M1698.001200','M1698.002900','M1698.001900','5241.417'].every(passed)&&player.forestCredits>=21;
    if(type==='polisci_a') return passed('200.103')&&passed('200.104')&&passed('216A.416')&&calcPolisciGaDivCredits('polisci_a')>=6&&calcPolisciNaDivCredits('polisci_a')>=6&&calcPolisciDaDivCredits('polisci_a')>=6&&calcPolisciCrossoverCredits('polisci_a')>=getPolisciCreditReq('polisci_a');
    if(type==='polisci_b') return passed('200.103')&&passed('200.104')&&passed('216B.420')&&calcPolisciGaDivCredits('polisci_b')>=6&&calcPolisciNaDivCredits('polisci_b')>=6&&calcPolisciDaDivCredits('polisci_b')>=6&&calcPolisciCrossoverCredits('polisci_b')>=getPolisciCreditReq('polisci_b');
    if(type==='japan') return passed('1003.221')&&calcJapanEffectiveCredits()>=getJapanCreditReq();
    if(type==='japan_studies') return passed('M3236.000100')&&calcJapanStudiesEffectiveCredits()>=36&&calcJapanStudiesHumanitCredit()>=6;
    if(type==='land'){const le=completedCourses.filter(c=>c.category==='land'&&c.type==='normal'&&c.grade!=='F').reduce((s,c)=>s+c.credit,0);return calcLandRequiredCredits()>=19&&le>=5&&calcLandEffectiveCredits()>=getLandCreditReq();}
  }
  return false;
}

function openDoubleOverlay(){
  window._doubleMajorAppsThisSem = 0;
  renderDoubleOverlay();
  document.getElementById('double-overlay').classList.add('show');
}

// ── 복수/부전공 오버레이 렌더링 ────────────────────────
function renderDoubleOverlay(){
  const gpa = player.gpa || 0;
  document.getElementById('double-info').innerHTML =
    `현재 GPA: <b style="color:#003092">${gpa.toFixed(2)}</b> | 취득학점: ${player.credits}학점 | ${player.semestersDone}학기 이수<br>
    <span style="font-size:10px;color:#666">※ 같은 전공의 복수전공+부전공 동시 신청 불가. 합격 기준 GPA는 공개되지 않습니다.</span>`;

  const kinds = ['double','minor'];
  const types = ['agri','econ','forest','polisci_a','polisci_b','japan','japan_studies','land','genv'];
  const typeNames = {agri:'농경제 교직과정', econ:'경제학부', forest:'산림환경학', polisci_a:'정치학전공', polisci_b:'외교학전공', japan:'일본언어문명', japan_studies:'연계전공 일본학', land:'조경학', genv:'글로벌환경경영'};
  const kindNames = {double:'복수전공', minor:'부전공'};

  let cardsHtml = '';
  for(const type of types){
    const dbl = doubleMajors.find(d=>d.type===type&&d.approved&&d.kind==='double');
    const mnr = doubleMajors.find(d=>d.type===type&&d.approved&&d.kind==='minor');
    const current = dbl || mnr;
    const currentKind = current ? current.kind : null;

    const dblReqDesc = (type==='agri') ? '48학점+전필7개' : (type==='econ') ? '36학점+전필5개' : (type==='forest') ? '48학점+전필4개' : (type==='japan') ? '39학점+전필2개' : (type==='japan_studies') ? '36학점+전필(일본학입문)+인문대6학점' : (type==='land') ? '48학점(전필29+선택19)' : (type==='genv') ? '39학점+전필5개+인턴+과기1/3' : '39학점+가·나·다군6학점';
    const mnrReqDesc = (type==='agri') ? '24학점+전필5개' : (type==='econ') ? '21학점+전필5개' : (type==='forest') ? '21학점+전필4개' : (type==='japan') ? '21학점' : (type==='japan_studies') ? '연계전공은 부전공 없음' : (type==='land') ? '24학점(전필19+선택5)' : (type==='genv') ? '연합전공은 부전공 없음' : '21학점+가·나·다군6학점';

    const dblApproved = currentKind==='double';
    const mnrApproved = currentKind==='minor';

    cardsHtml += `<div style="flex:1;min-width:140px;background:#fff;border:1px solid #e8ecf5;border-radius:10px;padding:12px;">
      <div style="font-size:12px;font-weight:700;color:#003092;margin-bottom:6px;">${typeNames[type]}</div>
      <div style="font-size:9px;color:var(--dim);margin-bottom:6px;">
        ${current ? `<span style="color:#15803d;font-weight:700">✓ ${kindNames[currentKind]} 승인됨</span>` : '<span style="color:#888">미신청</span>'}
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;">
        <div style="font-size:8px;color:#888">[${type==='japan_studies'?'연계전공':type==='genv'?'연합전공':'복수전공'}] ${dblReqDesc}</div>
        ${dblApproved ? `<div style="font-size:10px;font-weight:700;color:${quickMajorReq(type,'double')?'#15803d':'#888'}">${quickMajorReq(type,'double')?'✅ 졸업요건 충족':'⬜ 졸업요건 미충족'}</div>` : ''}
        <button class="btn btn-sm" style="font-size:10px;padding:4px 8px;${dblApproved?'background:#888;color:#fff;':''}"
          onclick="applyMajor('${type}','double')" ${dblApproved?'disabled':''}>
          ${dblApproved?(type==='japan_studies'?'연계전공 승인됨':type==='genv'?'연합전공 승인됨':'복수전공 승인됨'):mnrApproved?(type==='japan_studies'?'연계전공으로 전환':type==='genv'?'연합전공으로 전환':'복수전공으로 전환'):(type==='japan_studies'?'연계전공 신청':type==='genv'?'연합전공 신청':'복수전공 신청')}
        </button>
        <div style="font-size:8px;color:#888">[부전공] ${mnrReqDesc}</div>
        ${mnrApproved ? `<div style="font-size:10px;font-weight:700;color:${quickMajorReq(type,'minor')?'#15803d':'#888'}">${quickMajorReq(type,'minor')?'✅ 졸업요건 충족':'⬜ 졸업요건 미충족'}</div>` : ''}
        ${(type==='japan_studies'||type==='genv') ? `<div style="font-size:8px;color:#666;padding:3px 0">${type==='genv'?'연합전공은 부전공 없음':'연계전공은 부전공 없음'}</div>` :
        `<button class="btn btn-sm" style="font-size:10px;padding:4px 8px;background:#7c3aed;${mnrApproved?'background:#888;color:#fff;':''}"
          onclick="applyMajor('${type}','minor')" ${mnrApproved?'disabled':''}>
          ${mnrApproved?'부전공 승인됨':dblApproved?'부전공으로 전환':'부전공 신청'}
        </button>`}
      </div>
    </div>`;
  }
  document.getElementById('double-cards').innerHTML = cardsHtml;

  // 졸업 가능 여부 표시
  const gradStatusEl = document.getElementById('double-grad-status');
  if(gradStatusEl){
    if(checkGraduationReady()){
      gradStatusEl.innerHTML = `
        <div style="background:#f0fdf4;border:1.5px solid #22c55e;border-radius:8px;padding:10px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px;">
          <span style="font-size:12px;font-weight:700;color:#15803d;">🎓 졸업요건 충족! 지금 졸업신청이 가능합니다.</span>
          <button class="btn btn-sm" style="background:#15803d;color:#fff;font-weight:700;white-space:nowrap;" onclick="skipDouble(); setTimeout(triggerGraduation,100);">졸업신청 →</button>
        </div>`;
    } else {
      gradStatusEl.innerHTML = '';
    }
  }
}
