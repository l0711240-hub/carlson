function showAppraiserDiplomaWithBachelor(){
  showDiploma('appr_pre');
  const _gradBtnAppr = document.getElementById('diploma-grad-btn');
  const _contBtnAppr = document.getElementById('diploma-cont-btn');
  _gradBtnAppr.style.display=''; _contBtnAppr.style.display='none';
  _gradBtnAppr.textContent='7급 공무원 합격증 →';
  _gradBtnAppr.onclick=()=>{
    document.getElementById('diploma-overlay').classList.remove('show');
    showAppraiserDiploma();
  };
}
function showAppraiserDiploma(){
  document.getElementById('appraiser-overlay').classList.remove('show');
  const gpa=player.gpa||0;
  const approved=doubleMajors.filter(d=>d.approved);
  const typeNames={agri:'농경제 교직과정',econ:'경제학부',forest:'산림환경학',polisci_a:'정치학전공',polisci_b:'외교학전공',japan:'일본언어문명',land:'조경학'};
  const kindColors={double:'#0f766e',minor:'#6d28d9'};
  const kindBadge={double:'복수전공',minor:'부전공'};
  document.getElementById('appraiserdiploma-info').innerHTML=
    `GPA <b style="color:#003092">${gpa.toFixed(2)}</b> &nbsp;|&nbsp; 총 ${player.credits}학점 &nbsp;|&nbsp; `+
    `클릭 <b style="color:#15803d">${_appraiserClicks}회</b> / 목표 ${_appraiserGoal}회`;
  const majorsHtml=approved.length===0
    ?`<div style="font-size:10px;color:#666">부/복수전공 없음</div>`
    :approved.map(d=>{
        const col=kindColors[d.kind]||'#94a3b8';
        return `<div style="display:inline-flex;align-items:center;gap:5px;background:${col}22;border:1px solid ${col};border-radius:5px;padding:3px 8px;margin:2px;">
          <span style="font-size:9px;color:${col};font-weight:700">${kindBadge[d.kind]||d.kind}</span>
          <span style="font-size:10px;color:var(--text)">${typeNames[d.type]||d.type}</span>
        </div>`;
      }).join('');
  document.getElementById('appraiserdiploma-majors').innerHTML=majorsHtml;
  document.getElementById('appraiserdiploma-date').textContent=`제${player.semestersDone}학기 졸업`;
  gameRunning=false; cancelAnimationFrame(animId);
  document.getElementById('appraiserdiploma-overlay').classList.add('show');
}

function retryAppraiser(){
  document.getElementById('appraiser-overlay').classList.remove('show');
  showCareerChoice(); // 불합격: 진로 결정으로 (게임 정지)
}

function showCareerChoice(){
  gameRunning = false;
  cancelAnimationFrame(animId);
  const gpa = player.gpa || 0;
  document.getElementById('career-gpa').textContent = gpa.toFixed(2);
  document.getElementById('career-credits').textContent = player.credits;

  // 대학원 보너스 미리보기
  const bonusLines = applyGraduationBonuses();
  const preview = document.getElementById('career-bonus-preview');
  if(bonusLines.length > 0){
    preview.innerHTML = bonusLines.slice(0,3).map(l=>`<div>${l}</div>`).join('');
  } else {
    preview.innerHTML = '<div style="color:#666">보너스 없음</div>';
  }

  // 임용 합격 판정
  const card = document.getElementById('lawschool-card');
  const title = document.getElementById('lawschool-title');
  const desc = document.getElementById('lawschool-desc');
  const verdict = document.getElementById('lawschool-verdict');

  // GPA 4.3 환산 기준 → 4.5 기준으로 환산
  // 게임 GPA는 4.3 만점 → 실제 4.5 환산: gpa * (4.5/4.3)
  const gpa45 = gpa * (4.5 / 4.3);

  let lawTier, lawColor, lawBorder;
  if(gpa45 >= 4.15){
    lawTier = 'sky';
    lawColor = '#b45309';
    lawBorder = '#fcd34d';
  } else if(gpa45 >= 3.7){
    lawTier = 'general';
    lawColor = '#1d4ed8';
    lawBorder = '#bfdbfe';
  } else {
    lawTier = 'fail';
    lawColor = '#c0392b';
    lawBorder = '#fca5a5';
  }

  card.style.borderColor = lawBorder;
  title.style.color = lawColor;

  if(lawTier === 'sky'){
    desc.innerHTML = `4.5환산 GPA <b style="color:#fbbf24">${gpa45.toFixed(2)}</b><br>임용 수석권 — 1지망 지역 합격 유력<br>학점 불이익 없음`;
    verdict.innerHTML = `<span style="color:#fbbf24">⭐ 임용 수석 합격권</span>`;
  } else if(lawTier === 'general'){
    desc.innerHTML = `4.5환산 GPA <b style="color:#60a5fa">${gpa45.toFixed(2)}</b><br>임용 합격 안정권<br>(1지망 지역은 다소 불리)`;
    verdict.innerHTML = `<span style="color:#60a5fa">✓ 임용 합격권</span>`;
  } else {
    desc.innerHTML = `4.5환산 GPA <b style="color:#ef4444">${gpa45.toFixed(2)}</b><br>임용 합격 불리<br>3.7 이상이 안정권`;
    verdict.innerHTML = `<span style="color:#ef4444">✗ 임용 합격 어려움</span>`;
  }

  // 7급 공무원 카드: 할인 정보 표시
  const appraiserDiscount = calcAppraiserDiscount();
  const appraiserGoal = Math.max(50, 300 - appraiserDiscount - (player.appraiserClicks||0));
  const bonusEl = document.getElementById('appraiser-card-bonus');
  if(bonusEl){
    const discountParts = [];
    for(const [code, val] of Object.entries(APPRAISER_DISCOUNT_CODES)){
      if(completedCourses.some(c=>c.code===code&&c.grade!=='F')) discountParts.push(`-${val}`);
    }
    if(player.appraiserClicks>0) discountParts.push(`공부 -${player.appraiserClicks}`);
    bonusEl.innerHTML = discountParts.length>0
      ? `할인: ${discountParts.join(' ')} → 목표 <b style="color:#fbbf24">${appraiserGoal}회</b>`
      : `목표 <b style="color:#fbbf24">300회</b>`;
  }

  document.getElementById('career-overlay').classList.add('show');
  // 진로선택 중 게임 완전 정지
  gameRunning=false; cancelAnimationFrame(animId);
}
