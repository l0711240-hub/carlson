function removeGradItem(idx){
  _gradSemPlan.splice(idx,1);
  if(window._renderGradSemList) window._renderGradSemList();
}


function openGradCertOverlay(){
  // 수강계획 닫지 않고 자격증 오버레이 위에 표시
  openCertOverlay();
}
function openGradInternOverlay(){
  // 수강계획 닫지 않고 인턴 오버레이 위에 표시
  openInternOverlay();
}
function submitGradSem(){
  document.getElementById('gradsem-overlay').classList.remove('show');
  startGradSemester();
}

// ── 대학원 학기 시작 ─────────────────────────────────────────
function startGradSemester(){
  gameRunning=true;
  semTimer=0;
  const dept=GRAD_DEPTS.find(d=>d.id===player.gradSchool)||GRAD_DEPTS[0];

  // courseEntities 초기화
  courseEntities=[];

  // 수강계획 → courseEntities로 변환
  for(const item of _gradSemPlan){
    courseEntities.push({
      x:80+Math.random()*(W-160), y:80+Math.random()*(H-160),
      vx:(Math.random()-0.5)*0.5, vy:(Math.random()-0.5)*0.5,
      wobble:Math.random()*Math.PI*2,
      wanderTimer:120+Math.random()*180,
      visible:true, cooldown:0,
      hits:0, maxHits:item.maxHits,
      name:item.name,
      code:'GRAD_'+item.type+'_'+Math.random().toString(36).slice(2,6),
      credit:item.credit,
      category:'grad',
      type:item.type,
      graded:item.graded,
      grade:item.grade,
      isPaper:item.isPaper,
      isResearch:item.isResearch,
      isThesis:item.isThesis,
      isPostdocLec:item.isPostdocLec||false,
      isConference:item.isConference||false,
      isContact:item.isContact||false,
      isStudentGuidance:item.isStudentGuidance||false,
      isPublication:item.isPublication||false,
      isResearchProject:item.isResearchProject||false,
      isExternalLecture:item.isExternalLecture||false,
      isBroadcast:item.isBroadcast||false,
      size:20,
      color:item.isThesis?'#fbbf24':item.isPaper?'#f472b6':item.isConference?'#38bdf8':item.isResearch||item.isStudentGuidance?'#34d399':item.isPublication?'#a78bfa':item.isResearchProject?'#22c55e':item.isExternalLecture?'#f97316':item.isBroadcast?'#ec4899':'#a78bfa',
    });
  }

  // 자동 추가: 조교, 랩실연구 (포닥 제외)
  if(player.rankIdx<3){
    courseEntities.push({
      x:80+Math.random()*(W-160), y:80+Math.random()*(H-160),
      vx:(Math.random()-0.5)*0.5, vy:(Math.random()-0.5)*0.5,
      wobble:0, wanderTimer:120, visible:true, cooldown:0,
      hits:0, maxHits:5,  name:'조교', code:'GRAD_TA', credit:0,
      category:'grad', type:'ta', size:18, color:'#fb923c',
      isTA:true,
    });
    courseEntities.push({
      x:80+Math.random()*(W-160), y:80+Math.random()*(H-160),
      vx:(Math.random()-0.5)*0.5, vy:(Math.random()-0.5)*0.5,
      wobble:0, wanderTimer:120, visible:true, cooldown:0,
      hits:0, maxHits:5,  name:'랩실 연구', code:'GRAD_LAB', credit:0,
      category:'grad', type:'lab', size:18, color:'#22c55e',
      isLab:true,
    });
  }

  // 대학원 보스 1개 무작위 추가
  spawnGradBosses(dept.majorCat);

  // 교수 컨택 / 학부생 인턴 엔티티 (해당 학기 신청한 경우)
  if(window._gradContactThisSem){
    window._gradContactThisSem=false;
    courseEntities.push({
      x:80+Math.random()*(W-160), y:80+Math.random()*(H-160),
      vx:(Math.random()-0.5)*0.4, vy:(Math.random()-0.5)*0.4,
      wobble:0, wanderTimer:120, visible:true, cooldown:0,
      hits:0, maxHits:10, name:'교수 컨택', code:'GRAD_CONTACT', credit:0,
      category:'contact', type:'contact', size:22, color:'#fbbf24',
    });
  }
  if(window._gradInternThisSem){
    window._gradInternThisSem=false;
    courseEntities.push({
      x:80+Math.random()*(W-160), y:80+Math.random()*(H-160),
      vx:(Math.random()-0.5)*0.4, vy:(Math.random()-0.5)*0.4,
      wobble:0, wanderTimer:120, visible:true, cooldown:0,
      hits:0, maxHits:10, name:'학부생 인턴', code:'GRAD_INTERN_LAB', credit:0,
      category:'contact', type:'intern_lab', size:22, color:'#60a5fa',
    });
  }

  loop();
  updateUI();
}

// 대학원 보스 1개 무작위 스폰
