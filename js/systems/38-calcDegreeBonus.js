function calcDegreeBonus(company){
  const cats=getDegreeCategory();
  let bonus=0;
  for(const [cat,val] of Object.entries(company.degreeBonus)){
    if(cats.includes(cat)) bonus=Math.max(bonus,val);
  }
  // 석사 전공 가산점 (대학원 진학 학과 유관 공기업에 +10)
  if(player.gradSchool && player.gradDegree && ['master','phd'].includes(player.gradDegree)){
    const gradCat = {
      geo:'지리', agri:'상경', econ:'상경', forest:'농학',
      polisci:'외교언어', japan:'외교언어', land:'조경', genv:'환경'
    }[player.gradSchool] || '지리';
    if(company.degreeBonus[gradCat]) bonus += 10;
  }
  return bonus;
}

function calcGpaScore(){
  return Math.min(100,Math.round((player.gpa||0)/4.5*100));
}

function showPublicCompanies(){
  const ncs=player.ncsScore;
  const gpaS=calcGpaScore();
  const certS=calcCertScore();
  const internS=calcInternScore();
  document.getElementById('pubco-score-line').innerHTML=
    `NCS <b style="color:#c2410c">${ncs}</b> + 학점 <b style="color:#0f766e">${gpaS}</b> + 자격증 <b style="color:#15803d">${certS}</b> + 인턴 <b style="color:#1d4ed8">${internS}</b> = 기본 <b style="color:#d97706">${ncs+gpaS+certS+internS}</b>점`;
  const base=ncs+gpaS+certS+internS;
  const el=document.getElementById('pubco-list');
  el.innerHTML=PUBLIC_COMPANIES.map(co=>{
    const db=calcDegreeBonus(co);
    const total=base+db;
    const pass=total>=co.passScore;
    const col=pass?'#22c55e':'#ef4444';
    const dbStr=Object.entries(co.degreeBonus).map(([k,v])=>`${k}+${v}`).join(' / ');
    return `<label style="display:flex;align-items:center;gap:8px;padding:10px 12px;border:1px solid ${pass?'#86efac':'#e8ecf5'};border-radius:8px;margin-bottom:6px;cursor:pointer;background:${pass?'#f0fdf4':'#fff'}">
      <input type="checkbox" class="pubco-check" value="${co.id}" style="accent-color:#f97316">
      <div style="flex:1">
        <div style="font-size:13px;color:${pass?'#15803d':'#c0392b'};font-weight:700">${co.name} ${pass?'✅':'❌'}</div>
        <div style="font-size:10px;color:#888">${dbStr} | 학위보정 +${db} → 총 ${total}점 (기준 ${co.passScore})</div>
      </div>
    </label>`;
  }).join('');
  document.getElementById('pubco-overlay').classList.add('show');
}

function submitPubco(){
  const checks=[...document.querySelectorAll('.pubco-check:checked')].map(x=>x.value);
  if(checks.length===0){ alert('지원할 공기업을 선택하세요'); return; }
  if(checks.length>3){ alert('최대 3곳까지 지원 가능합니다'); return; }
  document.getElementById('pubco-overlay').classList.remove('show');
  const ncs=player.ncsScore, gpaS=calcGpaScore(), certS=calcCertScore(), internS=calcInternScore();
  const base=ncs+gpaS+certS+internS;
  const results=checks.map(id=>{
    const co=PUBLIC_COMPANIES.find(c=>c.id===id);
    const db=calcDegreeBonus(co);
    const total=base+db;
    const pass=total>=co.passScore;
    return {co,total,pass};
  });
  const passed=results.filter(r=>r.pass);
  const typeNames={agri:'농경제 교직과정',econ:'경제학부',forest:'산림환경학',polisci_a:'정치학전공',polisci_b:'외교학전공',japan:'일본언어문명',land:'조경학'};
  const majorsStr=doubleMajors.filter(d=>d.approved).map(d=>`${typeNames[d.type]||d.type}(${d.kind==='double'?'복수':'부전공'})`).join(', ')||'없음';
  const content=document.getElementById('pubco-result-content');
  content.innerHTML=`
    <div style="font-size:10px;color:var(--dim);margin-bottom:12px">GPA ${(player.gpa||0).toFixed(2)} | 복수/부전공: ${majorsStr}</div>
    <div style="font-size:11px;color:#fbbf24;margin-bottom:10px">NCS ${ncs}점 + 학점 ${gpaS}점 + 자격증 ${certS}점 + 인턴 ${internS}점 = 기본 ${base}점</div>
    ${results.map(r=>`
      <div style="padding:10px 12px;border:1px solid ${r.pass?'#86efac':'#fca5a5'};border-radius:8px;margin-bottom:8px;background:${r.pass?'#f0fdf4':'#fef2f2'}">
        <div style="font-size:14px;font-weight:700;color:${r.pass?'#15803d':'#c0392b'}">${r.pass?'✅':'❌'} ${r.co.name}</div>
        <div style="font-size:11px;color:#888">최종 ${r.total}점 (기준 ${r.co.passScore}점) — ${r.pass?'<b style="color:#15803d">합격</b>':'<span style="color:#c0392b">불합격</span>'}</div>
      </div>`).join('')}
    ${passed.length===0?'<div style="color:#ef4444;font-size:13px;margin-top:8px">아쉽게도 모든 곳에서 불합격하였습니다.</div>':''}`;
  const anyPassed = passed.length > 0;
  const btnEl = document.getElementById('pubco-result-btns');
  if(anyPassed){
    btnEl.innerHTML = `<button class="btn" style="background:#22c55e" onclick="showPubcoDiploma()">🏢 합격증 보기 →</button>`;
    window._pubcoPassed = passed;
  } else {
    btnEl.innerHTML = `<button class="btn btn-orange" onclick="returnToCareerFromPubco()">진로 결정으로 돌아가기</button>`;
  }
  gameRunning=false; cancelAnimationFrame(animId);
  document.getElementById('pubco-result-overlay').classList.add('show');
}
