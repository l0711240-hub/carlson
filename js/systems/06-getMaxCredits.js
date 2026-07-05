// ══════════════════════════════════════════════════════
// COURSE REGISTRATION
// ══════════════════════════════════════════════════════
function getMaxCredits(){
  return player.credits >= 33 ? 21 : 18;
}

function getEligibleCodes(){
  const locked = new Set();
  for(const c of completedCourses){
    if(c.grade === 'F') continue;
    if(c.type === 'S_repeatable') continue; // 반복 수강 가능, never locked
    if(c.type === 'appraiser_study') continue; // 공무원 시험 공부: 중복 수강 가능
    if(c.grade === 'S'){ locked.add(c.code); continue; }
    if(c.gradePoint !== null && c.gradePoint > 2.3) locked.add(c.code);
  }
  return locked;
}

function getOfferedCourses(){
  const locked = getEligibleCodes();
  const sem = gameSem;
  // 계절학기는 semester 배열 체크 없이 everyTerm 기준으로만
  const numSem = isSeasonalSem(sem) ? null : sem;
  function semOk(c){
    if(c.everyTerm) return true;
    if(!numSem) return false; // 계절학기엔 semester 배열 과목 안 열림 (elective/econ 등 별도 처리)
    if(Array.isArray(c.semester)) return c.semester.includes(numSem);
    return false;
  }
  return ALL_COURSES_WITH_POLISCI.filter(c=>{
    if(locked.has(c.code)) return false;
    if(enrolledCodes.includes(c.code)) return false;
    // Prereq check
    if(c.prereq){
      const passed = completedCourses.some(x=>x.code===c.prereq && x.grade!=='F');
      if(!passed) return false;
    }
    // Econ: 계절학기엔 지정 코드만, 정규학기엔 semester 배열 기준
    if(c.category==='econ'){
      if(isSeasonalSem(sem)) return SEASONAL_ECON_CODES.has(c.code);
      if(Array.isArray(c.semester)) return c.semester.includes(sem);
      if(c.everyTerm) return true;
      return false;
    }
    // Liberal courses
    if(c.category==='liberal'){
      if(isSeasonalSem(sem)){
        return SEASONAL_LIBERAL_CODES.has(c.code) || SEASONAL_BASIC_CODES.has(c.code);
      }
      return semesterOfferedCodes.has(c.code);
    }
    // Forest: 항상 수강 가능
    if(c.category==='forest') return semOk(c)||(!isSeasonalSem(sem)&&Array.isArray(c.semester)&&c.semester.includes(sem));
    // Agri: 계절학기에는 닫힘
    if(c.category==='agri') return !isSeasonalSem(sem);
    // Polisci
    if(c.category==='polisci') return !isSeasonalSem(sem) && (semOk(c)||(Array.isArray(c.semester)&&c.semester.includes(sem)));
    // History
    if(c.category==='history') return !isSeasonalSem(sem) && (semOk(c)||(Array.isArray(c.semester)&&c.semester.includes(sem)));
    // Japan
    if(c.category==='japan') return !isSeasonalSem(sem) && (semOk(c)||(Array.isArray(c.semester)&&c.semester.includes(sem)));
    // japan_studies
    if(c.category==='japan_studies') return !isSeasonalSem(sem) && (semOk(c)||(Array.isArray(c.semester)&&c.semester.includes(sem)));
    // arthistory
    if(c.category==='arthistory') return !isSeasonalSem(sem) && (semOk(c)||(Array.isArray(c.semester)&&c.semester.includes(sem)));
    // edu_history
    if(c.category==='edu_history') return !isSeasonalSem(sem) && (semOk(c)||(Array.isArray(c.semester)&&c.semester.includes(sem)));
    // sts
    if(c.category==='sts') return !isSeasonalSem(sem) && (semOk(c)||(Array.isArray(c.semester)&&c.semester.includes(sem)));
    // cert_study (공무원 시험 공부): 항상 수강 가능, 중복 수강 허용
    if(c.category==='cert_study') return true;
    // 선택교양: 항상 수강 가능 (everyTerm)
    if(c.category==='elective'){
      // 학생자율연구2: 054.001 A+ 이수 필요
      if(c.code==='054.002'){
        return completedCourses.some(x=>x.code==='054.001'&&x.grade==='A+');
      }
      // 학생자율연구1·2: 연구계획 완수 필요
      if(c.code==='054.001'||c.code==='054.002'){
        return !!(player.researchPlanDone);
      }
      return true;
    }
    if(c.category==='land'){
      // land_thesis 과목: 동시수강 불가, 이수 완료 불가, 선수과목 체크
      // ── 체인 과목 순서 강제 및 동시수강 불가 ──
      const DESIGN_CHAIN = ['5271.214A','5271.324','5271.311','5271.412','M1707.000300','M1707.000400'];
      if(DESIGN_CHAIN.includes(c.code)){
        // 이미 통과한 과목 재수강 불가
        if(completedCourses.some(x=>x.code===c.code&&x.grade!=='F'&&x.grade!=='U')) return false;
        // 체인 내 다른 과목을 이번 학기에 신청했으면 동시수강 불가
        const chainConflict = pendingRegistration.some(r=>DESIGN_CHAIN.includes(r.code)&&r.code!==c.code);
        if(chainConflict) return false;
      }
      if(c.type==='land_thesis'){
        // 같은 학기에 다른 land_thesis 과목 신청했으면 불가
        const alreadyEnrolledThesis = pendingRegistration.some(r=>{
          const rc=ALL_COURSES_WITH_POLISCI.find(x=>x.code===r.code);
          return rc&&rc.type==='land_thesis'&&r.code!==c.code;
        });
        if(alreadyEnrolledThesis) return false;
        // 이미 통과한 과목은 재수강 불가
        if(completedCourses.some(x=>x.code===c.code&&x.grade==='S')) return false;
        // 선수과목 체크 (F/U 아닌 경우 이수로 인정 — 일반 과목은 A+~C-, thesis 과목은 S)
        if(c.prereqs && !c.prereqs.every(p=>completedCourses.some(x=>x.code===p&&x.grade!=='F'&&x.grade!=='U'&&x.grade!==undefined))) return false;
        // 같은 그룹의 다른 계열(졸업작품vs논문세미나) 이미 이수했으면 불가
        const studioGroup1 = ['M1707.000300','M1707.000400'];
        const seminarGroup = ['M1707.001000','M1707.001100'];
        const doneStudio  = studioGroup1.some(cd=>completedCourses.some(x=>x.code===cd&&x.grade==='S'));
        const doneSeminar = seminarGroup.some(cd=>completedCourses.some(x=>x.code===cd&&x.grade==='S'));
        if(studioGroup1.includes(c.code) && doneSeminar) return false;
        if(seminarGroup.includes(c.code) && doneStudio)  return false;
      }
      // 전제과목 체크 (일반 과목 - grade!=='F' 기준)
      if(c.prereqs && c.type!=='land_thesis' && c.prereqs.length>0){
        if(!c.prereqs.every(req=>completedCourses.some(x=>x.code===req&&x.grade!=='F'))) return false;
      }
      if(Array.isArray(c.semester)) return c.semester.includes(numSem||0);
      if(c.everyTerm) return true;
      return false;
    }
    // genv 과목: 크로스리스팅 충돌 체크
    if(c.category==='genv'){
      if(isSeasonalSem(sem)) return false;
      // 환경경영 실습(538.404): 인턴 이수 필요
      if(c.code==='538.404' && !isGenvInternDone()) return false;
      // 크로스리스팅 과목: 짝 과목을 이미 이수했으면 수강 불가
      const pair = GENV_CROSSLIST[c.code];
      if(pair && completedCourses.some(x=>x.code===pair && x.grade!=='F')) return false;
      if(Array.isArray(c.semester)) return c.semester.includes(numSem||0);
      return false;
    }
    // 이공계 타전공 과목 (건설환경/에너지/화학생물/지구환경/생명과학/응용생물화학)
    if(['civil','energy','chembio','earth','lifesci','agrobio','soc'].includes(c.category)){
      if(isSeasonalSem(sem)) return false;
      if(Array.isArray(c.semester)) return c.semester.includes(numSem||0);
      return false;
    }
    if(isSeasonalSem(sem)) return false;
    if(Array.isArray(c.semester)) return c.semester.includes(sem);
    return true;
  });
}
