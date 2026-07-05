function switchGradTab(tab){
  currentGradTab = tab;
  ['req','pol','pick','hist'].forEach(t=>{
    const el = document.getElementById('gtab-'+t);
    if(el) el.classList.toggle('active', t===tab);
  });
  renderGradPanel();
}

// switchRegTab: 사이드바 active 상태도 갱신

function renderRegSkillStatus(){
  const el = document.getElementById('reg-skill-status');
  if(!el || !player || !player.skills) return;
  const GOOD = ['A+','A0','A-'];
  const ALL_SKILLS = ['통계','일본어','현장연구','GIS','질적연구','설계','생명과학','미시경제학','거시경제학','지리문헌','경제문헌','정치문헌','외교문헌','행정문헌','조경문헌','환경문헌'];
  let html = '';
  for(const sk of ALL_SKILLS){
      const meta = SKILL_META[sk];
      const lv = player.skills[sk] || 0;
      // 0.5단계는 ◐●○○ 식으로 표시
      let dotsStr = '';
      if(lv === 0)        dotsStr = '○○○';
      else if(lv === 0.5) dotsStr = '◑○○';
      else if(lv === 1)   dotsStr = '●○○';
      else if(lv === 2)   dotsStr = '●●○';
      else                dotsStr = '●●●';
      const col = lv > 0 ? meta.color : '#94a3b8';
      const bg  = lv > 0 ? meta.color+'18' : '#f8f9fc';
      // 다음 목표 단계
      const nextLv = lv === 0 ? 0.5 : lv === 0.5 ? 1 : Math.floor(lv) + 1;
      let progressStr = '';
      if(lv < 3){
        const targetLv = nextLv;
        const done = completedCourses.filter(cc=>{
          if(!GOOD.includes(cc.grade)) return false;
          const sm = COURSE_SKILL_MAP[cc.code];
          return sm && sm[sk] === targetLv;
        }).length;
        const req = targetLv === 0.5 ? 1 : targetLv === 1 ? 1 : 3;
        const lvLabel = targetLv === 0.5 ? '기초' : `${targetLv}단계`;
        progressStr = `<span style="color:${done>=req?'#22c55e':'#888'};font-size:6px">${lvLabel} ${done}/${req}</span>`;
      } else {
        progressStr = `<span style="color:#fbbf24;font-size:6px">MAX</span>`;
      }
      html += `<div style="background:${bg};border:1px solid ${lv>0?meta.color:'#e2e8f0'};border-radius:3px;padding:2px 4px;display:flex;align-items:center;gap:2px;">
        <span style="font-size:9px">${meta.icon}</span>
        <span style="font-size:6px;color:${col};flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${meta.label}</span>
        <span style="font-size:6px;color:${col}">${dotsStr}</span>
        ${progressStr}
      </div>`;
  }
  el.innerHTML = html;
}

function renderGradPanel(){
  const el = document.getElementById('grad-panel-content');
  if(!el) return;
  const polTab = document.getElementById('gtab-pol');
  if(polTab) polTab.style.display = isPolisciMajor() ? '' : 'none';
  if(currentGradTab === 'req') el.innerHTML = buildGradReqHTML();
  else if(currentGradTab === 'pol') el.innerHTML = buildPolisciDivHTML();
  else if(currentGradTab === 'pick'){
    el.innerHTML = buildPickSlotsHTML();
    renderRegSkillStatus();
  }
  else el.innerHTML = buildGradHistHTML();
}

function buildPickSlotsHTML(){
  const pickColors = ['','#ef4444','#f97316','#ffd93d','#22c55e','#00c9a7','#60a5fa','#a78bfa','#c084fc','#f472b6','#fb923c'];
  let html = `<div style="font-size:10px;color:#666;margin-bottom:8px;padding:4px 0;">슬롯 클릭 → 활성화 → 과목 선택으로 배치<br><span style="color:#003092">N픽 권장</span> = 해당 픽 이내 권장</div>`;
  for(let i=1; i<=10; i++){
    const reg = pendingRegistration.find(r=>r.pick===i);
    const col = pickColors[i];
    const isActive = activeSlot === i;
    if(reg){
      const cd = ALL_COURSES_WITH_POLISCI.find(x=>x.code===reg.code);
      const rate = cd ? Math.round(calcSuccessRate(cd,i)*100) : 0;
      const rateCol = rate===100?'#22c55e':rate>=80?'#003092':rate>=40?'#f59e0b':'#c0392b';
      const recTag = (cd?.recPick && !(cd.category==='econ'&&isEconMajor()&&cd.code!=='212.338A'))
        ? `<span style="font-size:9px;color:#f59e0b">[${cd.recPick}픽권장]</span> ` : '';
      const noConstraint = cd && (!cd.recPick||(cd.category==='econ'&&isEconMajor()&&cd.code!=='212.338A'))&&!cd.minPick&&!cd.specialPickRule;
      html += `<div class="crs-slot-item occupied" style="border-color:${col}" onclick="removeFromSlot(${i})">
        <span class="crs-slot-num" style="color:${col}">${i}</span>
        <div class="crs-slot-content">
          <div class="crs-slot-name">${recTag}${cd?.name||reg.code}</div>
          <div class="crs-slot-meta">${cd?.credit||0}학점 · <span style="color:${rateCol};font-weight:700">${noConstraint?'확정':'성공률 '+rate+'%'}</span></div>
        </div>
        <button class="crs-slot-remove" onclick="event.stopPropagation();removeFromSlot(${i})">✕</button>
      </div>`;
    } else {
      const borderCol = isActive ? '#003092' : '#dde3f0';
      const bg = isActive ? 'background:#eef2fc;' : '';
      html += `<div class="crs-slot-item" style="border-color:${borderCol};border-style:dashed;${bg}" onclick="activateSlot(${i})">
        <span class="crs-slot-num" style="color:${isActive?'#003092':'#ccc'}">${i}</span>
        <div class="crs-slot-empty" style="font-size:11px;color:${isActive?'#003092':'#bbb'};flex:1">${isActive?'← 과목 클릭으로 배치':'비어있음'}</div>
      </div>`;
    }
  }
  // 스킬 현황
  html += `<div style="margin-top:10px;border-top:1px solid #e8ecf5;padding-top:8px;">
    <div style="font-size:9px;font-weight:700;color:#888;margin-bottom:5px;text-transform:uppercase;letter-spacing:.4px;">현재 스킬</div>
    <div id="reg-skill-status" style="display:grid;grid-template-columns:1fr 1fr;gap:3px;"></div>
  </div>`;
  return html;
}
