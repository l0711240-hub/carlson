function endSemester(){
  // 인턴 진행도 업데이트
  for(const ce of courseEntities){
    if(ce.category!=='intern'||!ce.internId) continue;
    const intern=player.interns.find(i=>i.id===ce.internId);
    if(!intern) continue;
    intern.hits=ce.hits;
    if(ce.hits>=30&&!intern.done){
      intern.done=true;
      // 인턴 점수 확정 (이후 매번 random() 사용하지 않도록)
      const b = intern.bonus;
      intern.fixedScore = b[0] + Math.round(Math.random()*(b[1]-b[0]));
      addLog(`💼 ${intern.name} 인턴 이수 완료! (+${intern.fixedScore}점)`, 'log-level');
    }
  }
  // 교수 컨택 / 학부생 인턴 / 연구계획 완수 처리
  for(const ce of courseEntities){
    if(ce.category!=='research_contact') continue;
    if(ce.type==='research_plan'){
      // 연구계획: 3회 접촉 누적 (학기 넘어도 유지)
      player.researchPlanHits = Math.max(player.researchPlanHits||0, ce.hits);
      if((player.researchPlanHits||0) >= 3 && !player.researchPlanDone){
        player.researchPlanDone = true;
        // 연구계획 전공 확정
        player.researchPlanDept = player._pendingResearchPlanDept || Object.keys(player.contactHistory||{})[0] || 'geo';
        const deptName = RESEARCH_DEPTS.find(d=>d.id===player.researchPlanDept)?.name || player.researchPlanDept;
        addLog(`📄 연구계획 완수! [${deptName}] — 학생자율연구 수강 가능`, 'log-level');
      }
    } else if(ce.hits>=10){
      if(!player.contactHistory) player.contactHistory={};
      if(!player.internHistory)  player.internHistory={};
      if(ce.type==='contact'){
        player.contactHistory[ce.researchDept]={done:true, year:gameYear, sem:gameSem};
        // gradContactDone은 대학원 직접 컨택 시만 설정 (학사는 contactHistory로 관리)
        addLog(`🤝 ${ce.name} 완수!`,'log-level');
      } else if(ce.type==='intern'){
        player.internHistory[ce.researchDept]={done:true, year:gameYear, sem:gameSem};
        player.gradInternDone=true;
        addLog(`🔬 ${ce.name} 완수!`,'log-level');
      }
    }
  }

  for(const c of courseEntities){
    if(!c.visible) continue;
    if(c.category==='intern') continue; // 인턴은 별도 처리
    if(c.category==='research_contact') continue; // 위에서 처리
    if(c.type==='appraiser_study'){
      // 30회 접촉 시 7급 공무원 클릭 10 감소 (누적)
      if(c.hits>=30){
        player.appraiserClicks = Math.max(0, (player.appraiserClicks||0) + 10);
        addLog(`📖 공무원 시험 공부 완료! 시험 클릭 요구 -10회 (현재 누적 -${player.appraiserClicks}회)`,'log-level');
      }
      continue;
    }
    const cd = ALL_COURSES_WITH_POLISCI.find(x=>x.code===c.code);
    if(!cd) continue;
    let grade, gradePoint, gradeClass;
    if(c.type==='S' || c.type==='S_repeatable'){
      const threshold = cd.minHits || 1;
      grade = c.hits>=threshold ? 'S' : 'U'; gradePoint = c.hits>=threshold ? null : 0; gradeClass = c.hits>=threshold?'grade-S':'grade-F';
    } else if(c.type==='studio'||c.type==='land_thesis'){
      // 졸업작품/논문세미나: 10클릭 달성 시 S, 미달 시 F (land_thesis는 10회)
      const threshold = c.type==='land_thesis' ? 10 : 100;
      grade = c.hits>=threshold ? 'S' : 'F'; gradePoint = c.hits>=threshold ? null : 0; gradeClass = c.hits>=threshold?'grade-S':'grade-F';
    } else {
      const h=c.hits;
      // 스킬 단계 페널티 성적표 적용
      const adjMap = getAdjustedGradeMap(c.code);
      if(adjMap){
        grade='F'; gradePoint=0; gradeClass='grade-F';
        for(const [min,g] of adjMap){
          if(h>=min){ grade=g; break; }
        }
        gradePoint = grade==='A+'?4.3:grade==='A0'?4.0:grade==='A-'?3.7:grade==='B+'?3.3:grade==='B0'?3.0:grade==='B-'?2.7:grade==='C+'?2.3:grade==='C0'?2.0:grade==='C-'?1.7:0;
        gradeClass = grade.startsWith('A')?'grade-A':grade.startsWith('B')?'grade-B':grade.startsWith('C')?'grade-C':'grade-F';
      } else {
        if(h>=10){grade='A+';gradePoint=4.3;gradeClass='grade-A';}
        else if(h>=9){grade='A0';gradePoint=4.0;gradeClass='grade-A';}
        else if(h>=8){grade='A-';gradePoint=3.7;gradeClass='grade-A';}
        else if(h>=7){grade='B+';gradePoint=3.3;gradeClass='grade-B';}
        else if(h>=6){grade='B0';gradePoint=3.0;gradeClass='grade-B';}
        else if(h>=5){grade='B-';gradePoint=2.7;gradeClass='grade-B';}
        else if(h>=4){grade='C+';gradePoint=2.3;gradeClass='grade-C';}
        else if(h>=3){grade='C0';gradePoint=2.0;gradeClass='grade-C';}
        else if(h>=1){grade='C-';gradePoint=1.7;gradeClass='grade-C';}
        else {grade='F';gradePoint=0;gradeClass='grade-F';}
      }
    }

    // Remove old record if retake (undo previous credits/GPA)
    const prev = completedCourses.findIndex(x=>x.code===c.code);
    if(prev!==-1){
      const old = completedCourses[prev];
      if(old.grade!=='F' && old.grade!=='S'){
        player.credits -= cd.credit;
        if(cd.category==='liberal'||cd.category==='elective') player.liberalCredits-=cd.credit;
        else if(cd.category==='geo') player.geoCredits-=cd.credit;
        else if(cd.category==='agri' && hasAnyMajor('agri')) player.agriCredits-=cd.credit;
        else if(cd.category==='econ' && hasAnyMajor('econ')) player.econCredits-=cd.credit;
        else if(cd.category==='forest' && hasAnyMajor('forest')) player.forestCredits-=cd.credit;
        else if(cd.category==='polisci' && isPolisciMajor()) player.polisciCredits-=cd.credit;
        else if(cd.category==='japan' && isJapanMajor()) player.japanCredits-=cd.credit;
        else if(cd.category==='japan_studies' && isJapanStudiesMajor()) player.japanStudiesCredits-=cd.credit;
        else if(cd.category==='land' && isLandMajor()) player.landCredits-=cd.credit;
        else if(cd.category==='land' && isLandMajor()) player.landCredits-=cd.credit;
        else if(cd.category==='genv' && isGenvMajor()) player.genvCredits-=cd.credit;
        else if(['civil','energy','chembio','earth','lifesci','agrobio'].includes(cd.category) && isGenvMajor()) player.genvCredits-=cd.credit;
        else if(cd.category==='geoedu') player.geoCredits-=(old._geoEduGeoCredit||0);
        if(old.gradePoint!=null && old.gradePoint>0){
          player.totalGradeCredits-=cd.credit;
          player.gradePoints-=old.gradePoint*cd.credit;
        }
      } else if(old.grade==='S'){
        player.credits-=cd.credit;
        player.totalGradeCredits-=cd.credit; // S도 totalGradeCredits에 포함됐으므로 복구
        player.gradePoints-=0; // S의 gradePoint는 0이었으므로
        if(cd.category==='liberal'||cd.category==='elective') player.liberalCredits-=cd.credit;
      } else if(old.grade==='F' && old.gradePoint===0){
        // F was in GPA calc — undo
        player.totalGradeCredits-=cd.credit;
        player.gradePoints-=0;
      }
      completedCourses.splice(prev,1);
    }

    // Always record grade (including F) — F stays in transcript but allows retake
    // S 과목도 totalGradeCredits에 포함 (gradePoints는 0 추가) → GPA가 4.3 초과 방지
    if(grade !== 'U'){
      // S 과목: gradePoint=null → 0으로 처리 (분모 포함, 분자 0)
      player.totalGradeCredits += cd.credit;
      player.gradePoints += (gradePoint||0) * cd.credit;
      player.gpa = player.totalGradeCredits>0 ? player.gradePoints/player.totalGradeCredits : 0;
    }
    if(grade !== 'F'){
      player.credits += cd.credit;
      if(cd.category==='liberal') player.liberalCredits+=cd.credit;
      else if(cd.category==='elective') player.liberalCredits+=cd.credit; // 선택교양도 교양학점
      else if(cd.category==='geo') player.geoCredits+=cd.credit;
      // 복수/부전공 승인된 전공만 해당 전공학점으로 인정, 아니면 일반선택(총학점만 카운트)
      else if(cd.category==='agri' && hasAnyMajor('agri')) player.agriCredits+=cd.credit;
      else if(cd.category==='econ' && hasAnyMajor('econ')) player.econCredits+=cd.credit;
      else if(cd.category==='forest' && hasAnyMajor('forest')) player.forestCredits+=cd.credit;
      else if(cd.category==='polisci' && isPolisciMajor()) player.polisciCredits+=cd.credit;
      else if(cd.category==='japan' && isJapanMajor()) player.japanCredits+=cd.credit;
      else if(cd.category==='japan_studies' && isJapanStudiesMajor()) player.japanStudiesCredits+=cd.credit;
      else if(cd.category==='land' && isLandMajor()) player.landCredits+=cd.credit;
      else if(cd.category==='genv' && isGenvMajor()) player.genvCredits+=cd.credit;
      else if(['civil','energy','chembio','earth','lifesci','agrobio'].includes(cd.category) && isGenvMajor()) player.genvCredits+=cd.credit;
      else if(cd.category==='geoedu'){
        // 지금까지 이수한 geoedu 과목들 중 geoCredits에 반영된 누계
        const geoEduUsed = completedCourses
          .filter(x => x.category==='geoedu' && x.grade!=='F' && x.code!==cd.code)
          .reduce((s, x) => s + Math.min(x._geoEduGeoCredit||0, 0) + (x._geoEduGeoCredit||0), 0);
        // 실제로는 각 과목에 저장된 _geoEduGeoCredit 합산
        const geoEduAccum = completedCourses
          .filter(x => x.category==='geoedu' && x.grade!=='F' && x.code!==cd.code)
          .reduce((s, x) => s + (x._geoEduGeoCredit||0), 0);
        const space = Math.max(0, 9 - geoEduAccum);
        const geoCredit = Math.min(cd.credit, space);
        player.geoCredits += geoCredit;
        // 이 과목에 얼마나 geoCredits로 반영됐는지 기록 (재수강 환원용)
        cd._geoEduGeoCredit = geoCredit;
        if(geoCredit > 0 && geoCredit < cd.credit){
          addLog(`📚 ${cd.name}: 지리전선 ${geoCredit}학점 + 일반선택 ${cd.credit-geoCredit}학점 인정`, 'log-course');
        } else if(geoCredit > 0){
          addLog(`📚 ${cd.name}: 지리전선 ${geoCredit}학점 인정`, 'log-course');
        } else {
          addLog(`📚 ${cd.name}: 일반선택 ${cd.credit}학점 인정 (지리교육과 9학점 소진)`, 'log-course');
        }
      }
      if(grade==='S'){
        // S: credits but no GPA impact
        player.totalGradeCredits -= cd.credit;
        player.gradePoints -= 0;
        player.gpa = player.totalGradeCredits>0 ? player.gradePoints/player.totalGradeCredits : 0;
      }
    }

    completedCourses.push({...cd, grade, gradePoint, gradeClass, semYear:gameYear, semNum:gameSem});
    if(grade==='F'){
      addLog(`💀 ${c.name}: F — 재수강 가능`, 'log-eat');
    } else {
      addLog(`📝 ${c.name}: ${grade} (${c.hits}/${c.maxHits})`, 'log-course');
    }
  }
  player.semestersDone++;
  semestersDone++;
  // 정규학기 카운트: 이번 학기 수강 학점 12 이상이면 정규학기
  const semCredits = enrolledCodes.reduce((s,code)=>{const c=ALL_COURSES_WITH_POLISCI.find(x=>x.code===code);return s+(c?c.credit:0);},0);
  if(semCredits >= 12 && !isSeasonalSem(gameSem)) regularSemesters++;
  // 정규학기 16학기 초과 시 게임오버
  if(regularSemesters > 16){ gameOverFn('overterm'); return; }
  renderCourseList();
  updateUI();
  // 학기 종료 결과 화면 표시 (showSemResult는 nextSemester를 대신 호출함)
  showSemResult();
}
