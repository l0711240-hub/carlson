function openInternOverlay(){
  const el = document.getElementById('intern-list');
  const certBonus = calcInternCertBonus();
  const certNote = certBonus>0
    ? `<div style="font-size:9px;color:#34d399;margin-bottom:6px">📜 자격증 가산점: +${certBonus}% 적용 중</div>` : '';
  el.innerHTML = certNote + INTERN_LIST.map(intern=>{
    const {baseRate, certBonus:cb, dmBonus, gpaComp} = calcInternBaseRate(intern);
    const alreadyDone     = player.interns.some(i=>i.id===intern.id&&i.done);
    const alreadyPending  = player.interns.some(i=>i.id===intern.id&&!i.done);
    const alreadyRejected = (player.rejectedInterns||[]).includes(intern.id);
    const maxTotal = Math.min(100, baseRate + 23);
    const rateColor = maxTotal>=60?'#22c55e':maxTotal>=30?'#ffd93d':'#ef4444';
    const dmColor   = dmBonus>=0?'#a78bfa':'#ef4444';
    const borderCol = alreadyDone?'#86efac':alreadyPending?'#fdba74':alreadyRejected?'#fca5a5':'#e8ecf5';
    const bgCol = alreadyDone?'#f0fdf4':alreadyPending?'#fff7ed':alreadyRejected?'#fef2f2':'#fff';
    const nameCol = alreadyRejected?'#94a3b8':alreadyDone?'#15803d':'#003092';
    const rateTextCol = maxTotal>=60?'#15803d':maxTotal>=30?'#92400e':'#991b1b';
    const dmTextCol = dmBonus>=0?'#6d28d9':'#991b1b';
    return `<div style="padding:10px 12px;border:1px solid ${borderCol};border-radius:8px;margin-bottom:8px;background:${bgCol}">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;">
        <div style="flex:1;min-width:0;">
          <div style="font-size:13px;color:${nameCol};font-weight:700;margin-bottom:3px;">${intern.name}</div>
          <div style="font-size:10px;color:#888;">
            서류 <b style="color:${rateTextCol}">${baseRate}%</b>
            &nbsp;(GPA×숙련도 ${gpaComp}%
            + 자격증 +${cb}%
            + 전공 <span style="color:${dmTextCol}">${dmBonus>=0?'+':''}${dmBonus}%</span>)
            + 면접 최대 +23%
            → <b style="color:${rateTextCol}">최대 ${maxTotal}%</b>
          </div>
        </div>
        <div style="flex-shrink:0;">
          ${alreadyDone     ? `<span style="font-size:11px;color:#15803d;font-weight:700;">✅ 이수완료</span>` :
            alreadyPending  ? `<span style="font-size:11px;color:#c2410c;font-weight:700;">⏳ 진행중 (${player.interns.find(i=>i.id===intern.id).hits}/30)</span>` :
            alreadyRejected ? `<span style="font-size:11px;color:#991b1b;font-weight:700;">❌ 불합격</span>` :
            `<button onclick="startInternApply('${intern.id}')" style="background:#003092;color:#fff;border:none;border-radius:6px;padding:6px 14px;font-size:12px;font-weight:700;cursor:pointer;">지원하기</button>`}
        </div>
      </div>
    </div>`;
  }).join('');
  document.getElementById('intern-overlay').classList.add('show');
}

// ── 1단계: 서류 전형 ────────────────────────────────────────
function startInternApply(id){
  const intern = INTERN_LIST.find(i=>i.id===id);
  if(!intern) return;
  _ipmInternId = id;
  const {baseRate, certBonus, dmBonus, gpaComp} = calcInternBaseRate(intern);
  _ipmBaseRate = baseRate;

  document.getElementById('ipm-intern-name').textContent = '💼 ' + intern.name;
  const dmColor = dmBonus>=0?'#a78bfa':'#ef4444';
  const breakdown = `<div style="font-size:10px;color:#555;line-height:1.8;margin-bottom:6px;">
    GPA×숙련도 <b style="color:#003092;">${gpaComp}%</b>
    + 자격증 <b style="color:#15803d;">+${certBonus}%</b>
    + 전공 <b style="color:${dmColor};">${dmBonus>=0?'+':''}${dmBonus}%</b>
    = 서류 합격률 <b style="color:${baseRate>=50?'#15803d':'#991b1b'};">${baseRate}%</b>
  </div>`;

  const docPassed = Math.random()*100 < baseRate;
  const docPassedDoc = baseRate >= 50; // 50% 기준 서류 합격 여부는 확률로만 결정

  if(docPassed && baseRate >= 50){
    // 서류 합격 (확률 통과 + 기준치 충족)
    document.getElementById('ipm-doc-icon').textContent = '📄✅';
    document.getElementById('ipm-doc-title').style.color = '#15803d';
    document.getElementById('ipm-doc-title').textContent = '서류 합격';
    document.getElementById('ipm-doc-desc').innerHTML = breakdown + `<span style="color:#15803d;font-weight:600;">서류 전형을 통과했습니다!</span><br><span style="color:#003092;">면접을 진행하세요.</span>`;
    document.getElementById('ipm-doc-btn').textContent = '면접 보러 가기 →';
    document.getElementById('ipm-doc-btn').style.background = '#1d4ed8';
    document.getElementById('ipm-doc-btn').dataset.next = 'interview';
  } else {
    // 서류 탈락
    document.getElementById('ipm-doc-icon').textContent = '📄❌';
    document.getElementById('ipm-doc-title').style.color = '#991b1b';
    document.getElementById('ipm-doc-title').textContent = '서류 탈락';
    const reason = baseRate < 50 ? `서류 합격률이 ${baseRate}%로 기준(50%) 미달` : `서류 합격률 ${baseRate}% — 이번엔 운이 따르지 않았습니다`;
    document.getElementById('ipm-doc-desc').innerHTML = breakdown + `<span style="color:#991b1b;">${reason}</span><br><span style="color:#888;">다음 수강신청에서 재도전 가능합니다.</span>`;
    document.getElementById('ipm-doc-btn').textContent = '확인';
    document.getElementById('ipm-doc-btn').style.background = '#ef4444';
    document.getElementById('ipm-doc-btn').dataset.next = 'reject';
    if(!player.rejectedInterns) player.rejectedInterns=[];
    player.rejectedInterns.push(id);
    addLog(`💼 ${intern.name} 서류 탈락.`, 'log-eat');
  }
  ipmShow('ipm-doc-result');
}
