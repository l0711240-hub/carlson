function openGradApply(degree){
  // degree: 'master' | 'phd'
  window._gradApplyDegree = degree;
  _gradApplyStageIdx = 0; _gradApplyScores = {};
  const tepsScore = player.certs.텝스 || 0;

  document.getElementById('gradapply-subtitle').textContent =
    (degree==='master' ? '석사과정' : '박사과정') + ' 신입생 모집';
  document.getElementById('gradapply-result').style.display='none';
  document.getElementById('gradapply-process').style.display='none';
  document.getElementById('gradapply-dept-select').style.display='';
  document.getElementById('gradapply-stage-label').textContent='';

  const listEl = document.getElementById('gradapply-dept-list');
  listEl.innerHTML = GRAD_DEPTS.map(dept=>{
    // 박사 전형: 석사 졸업 학과만 선택 가능
    if(degree==='phd' && player.gradSchool && dept.id !== player.gradSchool) return '';
    const tepsReq = degree==='master' ? dept.masterTeps : dept.phdTeps;
    const tepsOk = tepsScore >= tepsReq;
    const snultOk = dept.snult===0 || (player.certs.snult일본어||0) >= dept.snult;
    const eligible = tepsOk && snultOk;
    const col = eligible ? '#a78bfa' : '#64748b';
    const warn = !tepsOk ? `텝스 ${tepsScore}/${tepsReq}점` : (!snultOk ? `한국사검정 ${player.certs.snult일본어||0}/${dept.snult}점` : '');
    return `<div style="background:${eligible?'#fff':'#f9fafb'};border:1px solid ${eligible?'#c7d2e8':'#e8ecf5'};border-radius:8px;padding:10px;cursor:${eligible?'pointer':'default'};transition:border-color .15s;" onmouseover="if(${eligible})this.style.borderColor='#003092'" onmouseout="if(${eligible})this.style.borderColor='#c7d2e8'"
      onclick="${eligible?`selectGradDept('${dept.id}')`:''}" >
      <div style="font-weight:700;color:${eligible?'#003092':'#94a3b8'};font-size:12px">${dept.name}</div>
      <div style="font-size:10px;color:#888;margin-top:2px;">텝스 ${tepsReq}점 이상${dept.snult?` / 한국사검정 ${dept.snult}점 이상`:''}</div>
      ${warn?`<div style="font-size:10px;color:#991b1b;font-weight:600;margin-top:3px;">❌ ${warn} 미달</div>`:`<div style="font-size:10px;color:#15803d;font-weight:600;margin-top:3px;">✅ 지원 가능</div>`}
    </div>`;
  }).join('');
  document.getElementById('gradapply-overlay').classList.add('show');
}

// ── 점수 계산 헬퍼 ──────────────────────────────────────────
function calcGradMajorScore(dept, degree){
  // 해당 분야 전공 평점×학점 합산 (가중치 낮게 조정: *0.15)
  const cats = dept ? [dept.majorCat] : ['geo'];
  const raw = completedCourses
    .filter(c=>cats.includes(c.category)&&c.grade!=='F'&&c.gradePoint>0)
    .reduce((s,c)=>s+c.gradePoint*c.credit,0);
  return Math.min(30, Math.round(raw * 0.15)); // 최대 30점 (과목 많아도 서류탈락 방지)
}
function calcGradGpaScore(degree){
  const gpa = (degree==='phd' ? player.gradGpa||player.gpa : player.gpa) || 0;
  return Math.min(50, Math.round(gpa / 4.3 * 50)); // GPA 비중 최대 50점
}
function calcGradContactScore(dept){
  // 교수 컨택: 해당 전공 컨택 여부 → 25점, 다른 전공 컨택 여부 → 10점
  const ch = player.contactHistory || {};
  if(dept && ch[dept.id]) return 25;
  if(Object.keys(ch).length > 0) return 10;
  return 0;
}
function calcGradInternScore(dept){
  // 학부생 인턴: 해당 전공 인턴 완수 → 15점, 다른 전공 → 5점
  const ih = player.internHistory || {};
  if(dept && ih[dept.id]) return 15;
  if(Object.keys(ih).length > 0) return 5;
  return 0;
}
function calcGradIndyStudyScore(dept){
  // 학생자율연구 가산점:
  // - 연구계획 전공이 지원 전공과 일치하고 자율연구1 A이상 이수 → +10점
  // - 연구계획 전공이 지원 전공과 일치하고 자율연구2 A이상 이수 → 추가 +10점 (합산 최대 20점)
  // - 전공 불일치: 자율연구1 A이상 → +5점, 자율연구2 A이상 → +5점 (합산 최대 10점)
  const planDept = player.researchPlanDept || null;
  const deptMatch = dept && planDept === dept.id;
  const A_GRADES = ['A+','A0','A-'];
  const indy1 = completedCourses.find(c=>c.code==='054.001' && A_GRADES.includes(c.grade));
  const indy2 = completedCourses.find(c=>c.code==='054.002' && A_GRADES.includes(c.grade));
  if(!indy1) return 0;
  const base1 = deptMatch ? 10 : 5;
  const base2 = indy2 ? (deptMatch ? 10 : 5) : 0;
  return base1 + base2;
}

// ── 전형 진행 ────────────────────────────────────────────────
