function spawnGradBosses(majorCat){
  const bossCodes=Object.keys(BOSS_DEFS);
  const catCourses=ALL_COURSES_WITH_POLISCI.filter(c=>c.category===majorCat);
  let candidates=catCourses.map(c=>c.code).filter(code=>bossCodes.includes(code));
  if(candidates.length===0) candidates=[...bossCodes];
  bosses=bosses.filter(b=>!b._gradBoss);
  const idx=Math.floor(Math.random()*candidates.length);
  const code=candidates[idx];
  let def=BOSS_DEFS[code];
  if(!def) return;
  if(def.randomNames&&def.randomNames.length>0){
    def={...def, name:def.randomNames[Math.floor(Math.random()*def.randomNames.length)]};
  }
  bosses.push({
    courseCode:code,
    x:60+Math.random()*(W-120), y:60+Math.random()*(H-120),
    ...def,
    vx:(Math.random()-0.5)*0.8, vy:(Math.random()-0.5)*0.8,
    wobble:0, quakePhase:0, quakeActive:false, quakeTimer:0,
    changeTimer:120+Math.random()*180, attackTimer:0, stunTimer:0,
    alive:true, quoteTimer:0, quoteCooldown:240+Math.random()*300,
    _gradBoss:true,
  });
}

// ── 대학원 학기 종료 처리 ─────────────────────────────────────
function endGradSemester(){
  // courseEntities 결과 처리
  for(const ce of courseEntities){
    if(ce.category!=='grad') continue;
    const done=(ce.hits>=ce.maxHits);
    if(ce.type==='lecture'&&done){
      // 성적 처리 (hits 12=A+, 10=A-, 8=B+, ...)
      const gradeMap=[[6,'A+'],[4,'A0'],[3,'A-'],[2,'B+'],[1,'B0'],[0,'B-']];
      let grade='F';
      for(const [min,g] of gradeMap){ if(ce.hits>=min){grade=g;break;} }
      if(grade!=='F') player.gradCredits+=ce.credit;
      addLog(`📝 ${ce.name}: ${grade}`,'log-course');
    } else if(ce.type==='thesis_res'&&done){
      player.gradCredits+=ce.credit;
      addLog(`📝 논문연구: S`,'log-course');
    } else if(ce.type==='ethics'&&done){
      player.gradEthicsDone=true;
      player.gradCredits+=1;
      addLog(`✅ 연구윤리의 이해 이수`,'log-level');
    } else if(ce.isPaper&&done){
      player.gradPapers++;
      if(player.rankIdx===3||player.rankIdx===4){ player.postdocPapers=(player.postdocPapers||0)+1; }
      addLog(`📄 논문 작성 실적 +1 (총 ${player.gradPapers})`,'log-level');
    } else if(ce.isConference&&done){
      player.gradConferences++;
      if(player.rankIdx===3||player.rankIdx===4){ player.postdocConferences=(player.postdocConferences||0)+1; }
      addLog(`🎤 학회 발표 실적 +1 (총 ${player.gradConferences})`,'log-level');
    } else if(ce.isResearch&&done){
      player.gradResearch++;
      if(player.rankIdx===3||player.rankIdx===4){ player.postdocResearch=(player.postdocResearch||0)+1; }
      addLog(`🔬 연구 실적 +1 (총 ${player.gradResearch})`,'log-level');
    } else if(ce.isThesis){
      player.gradThesisHits+=ce.hits;
      const req=player.gradDegree==='master'?25:50;
      addLog(`📋 졸업논문 진행 +${ce.hits} (누적 ${player.gradThesisHits}/${req})`,'log-info');
    } else if(ce.isTA&&done){
      player.gradAssistant++;
      addLog(`👨‍🏫 조교 실적 +1`,'log-info');
    } else if(ce.isLab&&done){
      player.gradLabResearch++;
      addLog(`🔬 랩실 연구 +1`,'log-info');
    }
    // 교수 컨택 / 학부생 인턴
    if(ce.type==='contact'&&ce.hits>=10){ player.gradContactDone=true; addLog('🤝 교수 컨택 완수!','log-level'); }
    if(ce.isContact&&ce.hits>=10){ player.gradContactDone=true; addLog('🤝 교수 컨택 완수!','log-level'); }
    if(ce.isStudentGuidance&&done){
      player.profResearch=(player.profResearch||0)+1;
      player.profStudentGuidance=(player.profStudentGuidance||0)+1;
      addLog(`👨‍🏫 학생지도 실적 +1 (총 ${player.profStudentGuidance})`, 'log-level');
    }
    if(ce.isPublication){
      player.profPubHits=(player.profPubHits||0)+ce.hits;
      const pubDone=Math.floor(player.profPubHits/30);
      if(pubDone>(player.profPubs||0)){
        player.profPubs=pubDone;
        addLog(`📖 출판 완성! (총 ${player.profPubs}편, 누적 ${player.profPubHits}회)`, 'log-level');
      } else {
        addLog(`📖 출판 진행 ${player.profPubHits}/30회`, 'log-info');
      }
    }
    if(ce.isResearchProject){
      player.profProjHits=(player.profProjHits||0)+ce.hits;
      const projDone=Math.floor(player.profProjHits/50);
      if(projDone>(player.profProjs||0)){
        player.profProjs=projDone;
        addLog(`🔬 연구사업 완성! (총 ${player.profProjs}건, 누적 ${player.profProjHits}회)`, 'log-level');
      } else {
        addLog(`🔬 연구사업 진행 ${player.profProjHits}/50회`, 'log-info');
      }
    }
    if(ce.isExternalLecture&&done){ player.profExtLectures=(player.profExtLectures||0)+1; addLog(`🎤 외부강연 +1 (총 ${player.profExtLectures}회)`, 'log-level'); }
    if(ce.isBroadcast&&done){ player.profBroadcasts=(player.profBroadcasts||0)+1; addLog(`📺 방송출연 +1 (총 ${player.profBroadcasts}회)`, 'log-level'); }
    if(ce.type==='intern_lab'&&ce.hits>=10){ player.gradInternDone=true; addLog('💼 학부생 인턴 완수!','log-level'); }

    // 포닥 실적
    if(ce.isPostdocLec&&done){ player.postdocLectures++; addLog('🎓 강의 실적 +1','log-level'); }
    if(ce.isConference&&done&&(player.rankIdx===3||player.rankIdx===4)){ player.postdocConferences=(player.postdocConferences||0)+1; addLog(`🎤 학회 발표 실적 +1 (총 ${player.postdocConferences})`,'log-level'); }
  }

  player.semestersDone++;
  semestersDone++;

  // 석사 GPA 업데이트 (전공교과 성적 기준)
  {
    const gradLectures = courseEntities.filter(ce=>ce.category==='grad'&&ce.type==='lecture'&&ce.hits>=ce.maxHits);
    if(gradLectures.length > 0){
      const gradeToPoint = g => g==='A+'?4.3:g==='A0'?4.0:g==='A-'?3.7:g==='B+'?3.3:g==='B0'?3.0:g==='B-'?2.7:g==='C+'?2.3:g==='C0'?2.0:g==='C-'?1.7:0;
      const gradeMap = [[6,'A+'],[4,'A0'],[3,'A-'],[2,'B+'],[1,'B0'],[0,'B-']];
      let totalPoints = 0, totalCredits = 0;
      for(const ce of gradLectures){
        let grade='F';
        for(const [min,g] of gradeMap){ if(ce.hits>=min){grade=g;break;} }
        if(grade!=='F'){
          totalPoints += gradeToPoint(grade) * (ce.credit||3);
          totalCredits += ce.credit||3;
        }
      }
      if(totalCredits > 0){
        const prevCredits = player.gradGpaCredits || 0;
        const prevPoints  = (player.gradGpa||0) * prevCredits;
        player.gradGpaCredits = prevCredits + totalCredits;
        player.gradGpa = (prevPoints + totalPoints) / player.gradGpaCredits;
      }
    }
  }

  updateUI();

  // 포닥 승급 체크
  if(player.rankIdx===3){
    const score=player.points*(0.05*player.postdocLectures+0.02*player.postdocPapers+0.01*player.postdocResearch+0.01*(player.postdocConferences||0));
    if(score>=100){ promote('prof'); return; }
  }
  // 교수 모드: 활동점수 계산 후 계속 학기 운영
  if(player.gradDegree==='prof'){
    const profLec   = player.postdocLectures||0;
    const profPaper = player.gradPapers||0;
    const profRes   = (player.gradResearch||0)+(player.postdocResearch||0)+(player.profResearch||0);
    const profConf  = (player.postdocConferences||0);
    const profGuide = player.profStudentGuidance||0;
    const profPub   = player.profPubs||0;
    const profProj  = player.profProjs||0;
    const profExt   = player.profExtLectures||0;
    const profBroad = player.profBroadcasts||0;
    const coeff = 0.05*profLec + 0.02*profPaper + 0.01*profRes + 0.01*profConf
                + 0.02*profGuide + 0.2*profPub + 0.5*profProj
                + 0.01*profExt  + 0.02*profBroad;
    const profScore = Math.round(player.points * coeff);
    addLog(`📊 교수 활동점수: ${profScore}점 (포인트 ${player.points} × 계수 ${coeff.toFixed(3)})`, 'log-info');
    gameYear = gameSem===2 ? gameYear+1 : gameYear;
    gameSem  = gameSem===1 ? 2 : 1;
    openGradSemReg();
    return;
  }
  // 졸업 체크
  const gradReady=checkGradReady();
  if(gradReady){ showGradCongratsOrNext(); return; }

  // 다음 학기 (대학원은 계절학기 없이 1↔2만)
  gameYear = gameSem===2 ? gameYear+1 : gameYear;
  gameSem  = gameSem===1 ? 2 : 1;
  openGradSemReg();
}
