function addResearchPlan(deptId, type){
  if(!player.researchPlan) player.researchPlan=[];
  if(player.researchPlan.some(p=>p.dept===deptId&&p.type===type)) return;
  if(type==='intern'){
    const ch=(player.contactHistory||{});
    if(!ch[deptId]){ alert('해당 전공 교수 컨택을 먼저 완수해야 합니다.'); return; }
  }
  player.researchPlan.push({dept:deptId, type});
  renderResearchPanel();
}

function addResearchPlanItem(){
  if(!player.researchPlan) player.researchPlan=[];
  if(player.researchPlan.some(p=>p.type==='research_plan')) return;
  if(!Object.keys(player.contactHistory||{}).length){
    alert('교수 컨택을 먼저 완수해야 합니다.'); return;
  }
  const sel = document.getElementById('research-plan-dept-select');
  const chosenDept = sel ? sel.value : Object.keys(player.contactHistory||{})[0] || 'geo';
  player.researchPlan.push({dept:'research_plan', type:'research_plan', chosenDept});
  // 연구계획 전공 미리 저장 (완수 시 확정)
  player._pendingResearchPlanDept = chosenDept;
  renderResearchPanel();
}

function removeResearchPlanItem(){
  if(!player.researchPlan) return;
  player.researchPlan = player.researchPlan.filter(p=>p.type!=='research_plan');
  renderResearchPanel();
}

function removeResearchPlan(deptId, type){
  if(!player.researchPlan) return;
  player.researchPlan=player.researchPlan.filter(p=>!(p.dept===deptId&&p.type===type));
  renderResearchPanel();
}
function startSemester(){
  courseEntities = [];

  // Check bonus: 공간정보와 시각화 A이상 → 컴퓨터 지도학 +2 hits
  const spatialVizGrade = completedCourses.find(c=>c.code==='L0549.000800' && c.gradePoint && c.gradePoint>=4.0);
  const spatialVizBonus = spatialVizGrade ? 2 : 0;

  enrolledCodes.forEach((code, i)=>{
    const c = ALL_COURSES_WITH_POLISCI.find(x=>x.code===code);
    if(!c) return;
    const appearAt = 0; // 학기 시작과 동시에 전부 등장
    const startHits = (code==='208.231A') ? spatialVizBonus : 0;
    const baseMax = (c.type==='S'||c.type==='S_repeatable') ? (c.minHits||1) : (c.type==='studio') ? 100 : (c.type==='land_thesis') ? 10 : 10;
    // 스킬 페널티가 있으면 A+를 받기 위한 출석 횟수로 maxHits 조정
    let maxHits = baseMax;
    if(baseMax === 10){
      const adjMap = getAdjustedGradeMap(c.code);
      if(adjMap && adjMap.length > 0){
        // adjMap[0][0] = A+를 받기 위한 최소 hits
        maxHits = adjMap[0][0];
      }
    }
    courseEntities.push({
      x: 40+Math.random()*(W-80),
      y: 40+Math.random()*(H-80),
      code:c.code, name:c.name, credit:c.credit,
      category:c.category, type:c.type,
      pulse:Math.random()*Math.PI*2,
      alive:true,
      hits: startHits,
      maxHits,
      cooldown:0,
      appearAt,
      visible: true,
      vx:(Math.random()-0.5)*0.4,
      vy:(Math.random()-0.5)*0.4,
      wanderTimer:120+Math.random()*180,
    });
  });
  if(spatialVizBonus>0) addLog('🎁 공간정보와 시각화 A이상 — 컴퓨터 지도학 +2 출석 보너스!','log-level');

  // 진행 중인 인턴을 courseEntity로 추가 (30회 달성 필요)
  for(const intern of player.interns.filter(i=>!i.done)){
    courseEntities.push({
      x:40+Math.random()*(W-80), y:40+Math.random()*(H-80),
      code:'INTERN_'+intern.id, name:intern.name.substring(0,8)+'인턴',
      credit:0, category:'intern', type:'intern',
      pulse:Math.random()*Math.PI*2, alive:true,
      hits:intern.hits, maxHits:30, cooldown:0,
      appearAt:0, visible:true,
      vx:(Math.random()-0.5)*0.4, vy:(Math.random()-0.5)*0.4,
      wanderTimer:120+Math.random()*180,
      internId: intern.id,
    });
  }

  // 연구 패널 신청 항목 → courseEntities 추가 (교수 컨택/학부생 인턴/연구계획)
  for(const rp of (player.researchPlan||[])){
    const deptInfo = RESEARCH_DEPTS.find(d=>d.id===rp.dept);
    let label, col, maxHits, code, type;
    if(rp.type==='research_plan'){
      label='연구계획'; col='#a78bfa'; maxHits=3;
      code='RESEARCH_PLAN'; type='research_plan';
    } else {
      label = rp.type==='contact' ? `${deptInfo?.name||rp.dept} 교수 컨택` : `${deptInfo?.name||rp.dept} 학부생 인턴`;
      col   = rp.type==='contact' ? '#fbbf24' : '#60a5fa';
      maxHits=10;
      code='RESEARCH_'+rp.type.toUpperCase()+'_'+rp.dept;
      type=rp.type;
    }
    courseEntities.push({
      x:40+Math.random()*(W-80), y:40+Math.random()*(H-80),
      vx:(Math.random()-0.5)*0.5, vy:(Math.random()-0.5)*0.5,
      wanderTimer:120+Math.random()*180,
      visible:true, cooldown:0,
      hits: rp.type==='research_plan' ? (player.researchPlanHits||0) : 0,
      maxHits,
      name:label,
      code, credit:0, category:'research_contact', type,
      researchDept:rp.dept,
      size:22, color:col,
      pulse:0, alive:true, appearAt:0,
    });
  }

  // Spawn course boss mobs (bosses 초기화 후 스폰)
  bosses=[]; bossProjectiles=[]; taAssistants=[]; playerStunTimer=0; playerSlowTimer=0;
  whiteoutTimer=0; bossDotTimer=0; bossDotActive=false; bossBeacons=[];
  for(const code of enrolledCodes){
    if(BOSS_DEFS[code]) spawnBossForCourse(code);
  }
  // 교수 컨택/인턴 신청 시 해당 전공 보스 추가
  for(const rp of (player.researchPlan||[])){
    const deptInfo = RESEARCH_DEPTS.find(d=>d.id===rp.dept);
    const cat = (deptInfo||{}).cat||'geo';
    const label = rp.type==='contact'?`${deptInfo?.name} 교수 컨택`:`${deptInfo?.name} 학부생 인턴`;
    const bossCodes = Object.keys(BOSS_DEFS);
    const catCandidates = ALL_COURSES_WITH_POLISCI.filter(c=>c.category===cat).map(c=>c.code).filter(c=>bossCodes.includes(c));
    const pool = catCandidates.length>0 ? catCandidates : bossCodes;
    const code = pool[Math.floor(Math.random()*pool.length)];
    if(code && BOSS_DEFS[code] && !bosses.find(b=>b.courseCode===code)){
      spawnBossForCourse(code);
      addLog(`${rp.type==='contact'?'👨‍🏫':'🔬'} ${label} — 교수 몹 추가됨`,'log-level');
    }
  }
  if(bosses.length>0){
    addLog(`⚠️ 보스 교수 등장: ${bosses.map(b=>b.name).join(', ')}`,'log-level');
  }
}
